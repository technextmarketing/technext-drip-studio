/* TechNext Drip Studio — the editor.
   Every change is saved automatically (the claude.ai hub: shared database; elsewhere: this browser).
   Canvas: click to select, drag to move (snaps to the centre and margins), corner handle to resize,
   top handle to rotate, double-click text to edit it in place. */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {}, R = window.TNDrip, RC = window.TNRecipes, AI = window.TNAI, S = window.TNStore;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var esc = R.esc;

  var POSES = RC.POSES;
  var ODOO = Object.keys(C.apps || {}).concat(['ai_app', 'industry_fsm', 'pos_restaurant', 'appointment']).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
  var KIT = ['check', 'spark', 'search', 'sync', 'wifiOff', 'cloudOff', 'cloudOk'];
  var ICONS = KIT.concat(Object.keys(C.icons || {}).sort());
  var INDUSTRIES = Object.keys(C.industries || {});
  var indName = function (k) { var i = C.industries[k]; return i ? i.name : k; };
  var SITES = Object.keys(C.sites || {});

  var lib = [], cats = [], usage = [], fileLib = clone(window.DRIPS || []);
  var st = { cat: 'all', id: null, sel: -1 };
  var hist = [], future = [], SERVER = false;
  var cur = function () { return lib.filter(function (d) { return d.id === st.id; })[0]; };

  /* ---------- helpers ---------- */
  function toast(msg, ms) { var t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, ms || 3200); }
  function uid(base) { var s = (base || 'drip').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'drip', id = s, n = 2; while (lib.some(function (d) { return d.id === id; })) id = s + '-' + n++; return id; }
  function catName(id) { var c = cats.filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; }
  function catObj(id) { return cats.filter(function (x) { return x.id === id; })[0]; }
  function opts(list, val, labels) { return list.map(function (v, i) { return '<option value="' + esc(v) + '"' + (String(v) === String(val == null ? '' : val) ? ' selected' : '') + '>' + esc(labels ? labels[i] : (v === '' ? 'default' : v)) + '</option>'; }).join(''); }
  function whenReady(root) {
    var imgs = $$('img', root).map(function (im) { return im.complete ? 1 : new Promise(function (r) { im.onload = im.onerror = r; }); });
    return Promise.all(imgs.concat([document.fonts.ready]));
  }
  function nf(n) { return Number(n || 0).toLocaleString('en-US'); }
  function copyText(t) {
    var ok = function () { toast('Copied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fallback); else fallback();
    function fallback() { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('Select the text and copy it'); } ta.remove(); }
  }

  /* ---------- saving (automatic) ---------- */
  var saveT = {}, dirtyAt = {};
  function setStatus(kind) {
    var el = $('#savestate'); if (!el) return;
    var local = S.mode !== 'hub';
    el.dataset.kind = kind;
    el.textContent = kind === 'saving' ? 'Saving…' : kind === 'error' ? 'Not saved: check your connection' : kind === 'readonly' ? 'View only' : local ? 'Saved in this browser' : 'All changes saved';
  }
  S.on('saving', function () { setStatus('saving'); });
  S.on('saved', function () { if (!S.pending()) setStatus('saved'); });
  S.on('saveError', function (e) { setStatus(e && e.code === 'invalid_argument' ? 'readonly' : 'error'); if (e && e.code === 'quota') toast('This browser is out of storage: remove large embedded images'); });
  S.on('caps', function () { if (!S.canWrite) setStatus('readonly'); });
  function queueSave(d) {
    if (!d) return;
    dirtyAt[d.id] = Date.now(); setStatus('saving');
    clearTimeout(saveT[d.id]);
    saveT[d.id] = setTimeout(function () { S.saveDrip(d, lib); }, 600);
  }
  function saveNow(d) { clearTimeout(saveT[d.id]); dirtyAt[d.id] = Date.now(); return S.saveDrip(d, lib); }
  function removeDrip(d) { lib.splice(lib.indexOf(d), 1); S.deleteDrip(d.id, lib); }
  S.on('remote', function (remote) {
    var changed = false, byId = {};
    remote.forEach(function (d) { byId[d.id] = d; });
    remote.forEach(function (d) {
      var i = lib.map(function (x) { return x.id; }).indexOf(d.id);
      if (Date.now() - (dirtyAt[d.id] || 0) < 4000) return;
      var a = i > -1 ? JSON.stringify(stripMeta(lib[i])) : '', b = JSON.stringify(stripMeta(d));
      if (a !== b) { if (i > -1) lib[i] = d; else lib.push(d); changed = true; }
    });
    lib.slice().forEach(function (d) { if (!byId[d.id] && Date.now() - (dirtyAt[d.id] || 0) > 4000) { lib.splice(lib.indexOf(d), 1); changed = true; } });
    if (!changed) return;
    if (st.id && !cur()) { toast('This drip was deleted by someone else'); showGallery(); return; }
    if (st.id) { if (!drag && !editing) { drawCanvas(); renderInspector(); } } else showGallery();
  });
  S.on('remoteCats', function (v) { cats = v; renderRail(); });
  S.on('remoteUsage', function (v) { usage = v; });
  function stripMeta(d) { var c = clone(d); delete c.updatedAt; return c; }

  /* ---------- history ---------- */
  function snapshot() { var d = cur(); if (!d) return; hist.push(JSON.stringify(d)); if (hist.length > 80) hist.shift(); future = []; }
  function replaceCur(obj) { var i = lib.indexOf(cur()); lib[i] = obj; }
  function undo() { if (!hist.length) { toast('Nothing to undo'); return; } future.push(JSON.stringify(cur())); replaceCur(JSON.parse(hist.pop())); afterEdit(true); }
  function redo() { if (!future.length) { toast('Nothing to redo'); return; } hist.push(JSON.stringify(cur())); replaceCur(JSON.parse(future.pop())); afterEdit(true); }
  function afterEdit(full) { queueSave(cur()); if (full) { if (st.sel !== 'copy' && (!cur().layers || !cur().layers[st.sel])) st.sel = -1; drawCanvas(); renderInspector(); } }
  var redrawT;
  function change(fn, o) {
    o = o || {};
    if (!o.noHist) snapshot();
    fn(cur()); queueSave(cur());
    clearTimeout(redrawT);
    var go = function () { drawCanvas(); if (o.insp) renderInspector(); };
    if (o.now) go(); else redrawT = setTimeout(go, 40);
  }

  /* ---------- rail: categories (gallery) or elements (editor) ---------- */
  var ELEMENTS = [
    ['Nexi', POSES.map(function (p) { return ['nexi', p, { pose: p }]; })],
    ['Photos', [['person', 'Person cut-out'], ['shot', 'Screenshot'], ['img', 'Image']]],
    ['Odoo', [['record', 'Record card'], ['phone', 'Phone screen'], ['odoo', 'App icon'], ['apps', 'App cloud'], ['orbit', 'App orbit'], ['appflow', 'How a record moves'], ['checklist', 'Checklist']]],
    ['From technext.asia', [['flow', 'Industry workflow'], ['ba', 'Before / after'], ['phases', 'Rollout phases'], ['chart', 'Industry dashboard']]],
    ['Website design', [['devices', 'Laptop + phone'], ['site', 'Website mockup'], ['code', 'Code window'], ['palette', 'Colour palette'], ['wireframe', 'Wireframe'], ['serp', 'Google result'], ['gauge', 'Score gauge'], ['cursor', 'Cursor']]],
    ['Callouts', [['pill', 'Handwritten pill'], ['chip', 'Step chip'], ['note', 'Handwritten note'], ['bubble', 'Speech bubble'], ['text', 'Free text'], ['arrow', 'Hand-drawn arrow'], ['icon', 'TechNext icon']]],
    ['Effects', [['burst', 'Burst rays'], ['glow', 'Glow'], ['sparkles', 'Sparkles'], ['sphere', 'Sphere'], ['confetti', 'Confetti'], ['storm', 'Storm cloud'], ['speed', 'Speed lines'], ['halftone', 'Halftone'], ['scan', 'AI scan beam'], ['nosignal', 'No-signal badge']]]
  ];
  function renderRail() {
    if (st.id) {
      var h = '<h2>Add to the drip</h2><p class="rail-help">Click an element to drop it on the canvas.</p>';
      ELEMENTS.forEach(function (g) {
        h += '<h2>' + esc(g[0]) + '</h2>';
        if (g[0] === 'Nexi') h += '<div class="el-grid">' + g[1].map(function (e) { return '<button class="el nexi" data-add="nexi" data-pose="' + e[1] + '" title="Nexi · ' + e[1] + '"><img src="assets/nexi/nexi-' + e[1] + '.png" alt=""><span>' + e[1] + '</span></button>'; }).join('') + '</div>';
        else h += g[1].map(function (e) { return '<button class="el" data-add="' + e[0] + '">' + esc(e[1]) + '</button>'; }).join('');
      });
      $('#rail').innerHTML = h; return;
    }
    var groups = [];
    cats.forEach(function (c) { if (groups.indexOf(c.group) < 0) groups.push(c.group); });
    var count = function (id) { return lib.filter(function (d) { return id === 'all' || d.cat === id; }).length; };
    var drafts = lib.filter(function (d) { return d.draft; }).length;
    var h2 = '<h2>Library</h2>' + catBtn({ id: 'all', name: 'All drips', group: '' }, count('all')) + (drafts ? catBtn({ id: 'drafts', name: 'Drafts to review', group: 'drafts' }, drafts) : '');
    groups.forEach(function (g) {
      h2 += '<h2>' + esc(g) + '</h2>';
      cats.filter(function (c) { return c.group === g; }).forEach(function (c) { h2 += catBtn(c, count(c.id)); });
    });
    if (S.canWrite) h2 += '<h2>Add</h2><form id="newcat" class="f" style="padding:0 6px"><input type="text" id="newcat-name" placeholder="New category name" aria-label="New category name">' +
      '<select id="newcat-group" aria-label="Group">' + opts(groups.concat(['Other']), 'Industries') + '</select><button class="btn sm" type="submit">Add category</button></form>';
    $('#rail').innerHTML = h2;
    var f = $('#newcat'); if (f) f.addEventListener('submit', function (e) {
      e.preventDefault(); var n = $('#newcat-name').value.trim(); if (!n) return;
      var id = n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (!catObj(id)) cats.push({ id: id, group: $('#newcat-group').value, name: n });
      S.saveCats(cats); st.cat = id; showGallery();
    });
  }
  function catBtn(c, n) {
    return '<button class="cat' + (st.cat === c.id && !st.id ? ' on' : '') + '" data-cat="' + esc(c.id) + '" data-group="' + esc(c.group) + '">' + (c.id === 'all' ? '' : '<span class="dot"></span>') +
      esc(c.name) + '<span class="n' + (n ? '' : ' zero') + '">' + n + '</span></button>';
  }

  /* ---------- gallery ---------- */
  function showGallery() {
    st.id = null; st.sel = -1; closePop();
    $('#shell').classList.remove('editing'); $('#insp').hidden = true;
    renderRail();
    var inCat = function (d) { return st.cat === 'all' || (st.cat === 'drafts' ? d.draft : d.cat === st.cat); };
    var list = lib.filter(inCat);
    var drafts = list.filter(function (d) { return d.draft; }), kept = list.filter(function (d) { return !d.draft; });
    var c = catObj(st.cat), ind = c && c.industry && C.industries[c.industry];
    var head = st.cat === 'drafts' ? 'Drafts to review' : c ? c.name : 'All drips';
    var h = '<div class="gallery"><div class="gal-head"><div><h2>' + esc(head) + '</h2><p>' +
      (ind ? 'Workflow on technext.asia: ' + esc(ind.flow_title) : st.cat === 'drafts' ? 'Posts Claude wrote. Keep the ones you like; everything is already saved.' : c ? esc(c.group) + ' · ' + list.length + ' drip' + (list.length === 1 ? '' : 's') : lib.length + ' drips across ' + cats.length + ' categories.') +
      '</p></div><span class="sp"></span>' +
      (S.canWrite ? '<button class="btn" data-gen="1">' + sparkIcon() + 'Generate with Claude</button><button class="btn primary" data-new="1">New drip</button>' : '') + '</div>';
    if (lib.length === 0 && S.mode === 'hub') h += '<div class="empty" style="margin-bottom:18px"><b>This hub is empty.</b> Import the starter drips, or generate new ones with Claude.' + (S.canWrite ? ' <button class="btn sm" id="import-starters">Import the starter drips</button>' : '') + '</div>';
    if (drafts.length && st.cat !== 'drafts') h += '<div class="sec-h"><h3>New from Claude <span class="tag">' + drafts.length + '</span></h3><span class="sp"></span><button class="btn sm" data-keepall="1">Keep all</button></div>' + cards(drafts, true);
    if (st.cat === 'drafts') h += cards(drafts, true);
    else h += (drafts.length ? '<div class="sec-h"><h3>Library</h3></div>' : '') + cards(kept, false, true);
    h += (list.length ? '' : '<p class="empty" style="margin-top:18px">Nothing here yet. Start a drip from a layout, or let Claude write a set' + (ind ? ' from the ' + esc(ind.name) + ' content on technext.asia.' : '.') + '</p>') + '</div>';
    $('#main').innerHTML = h;
    list.forEach(function (d) {
      var box = $('[data-thumb="' + d.id + '"]'); if (!box) return;
      var el = R.render(d); box.appendChild(el); R.fit(box); fitThumb(box);
    });
    document.fonts.ready.then(function () { $$('[data-thumb]').forEach(function (b) { R.fit(b); }); });
  }
  function cards(list, drafts, withNew) {
    var h = '<div class="grid">';
    list.forEach(function (d) {
      h += '<div class="card"><button class="thumb' + (d.format === '4:5' ? ' r45' : '') + '" data-open="' + esc(d.id) + '" data-thumb="' + esc(d.id) + '" aria-label="Edit ' + esc(d.name || d.id) + '"></button>' +
        '<span class="meta"><b>' + esc(d.name || d.id) + '</b>' + (st.cat === 'all' || st.cat === 'drafts' ? '<span class="tag">' + esc(catName(d.cat)) + '</span>' : '') + '</span>' +
        (drafts && S.canWrite ? '<span class="draft-act"><button class="btn sm primary" data-keep="' + esc(d.id) + '">Keep</button><button class="btn sm" data-open="' + esc(d.id) + '">Edit</button><button class="btn sm danger" data-discard="' + esc(d.id) + '">Discard</button></span>' : '') + '</div>';
    });
    if (withNew && S.canWrite) h += '<div class="card new"><button class="thumb" data-new="1"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>New drip</span></button><span class="meta"><b>Start from a layout</b></span></div>';
    return h + '</div>';
  }
  function sparkIcon() { return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.6 4.6 2.4 7.1 7 8-4.6.9-6.4 3.4-7 8-.6-4.6-2.4-7.1-7-8 4.6-.9 6.4-3.4 7-8Z"/></svg>'; }
  function fitThumb(box) { var el = box.querySelector('.drip'); if (el) el.style.transform = 'scale(' + (box.clientWidth / 1080) + ')'; }
  new ResizeObserver(function () { $$('[data-thumb]').forEach(fitThumb); if (st.id) { fitCanvas(); placeTools(); } }).observe(document.body);

  /* ---------- editor ---------- */
  function openDrip(id) {
    st.id = id; st.sel = -1; hist = []; future = []; closePop();
    $('#shell').classList.add('editing'); $('#insp').hidden = false;
    renderRail();
    $('#main').innerHTML = '<div class="editor"><div class="ed-bar"><button class="btn ghost sm" id="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>All drips</button>' +
      '<span class="title" id="ed-title"></span>' +
      '<span class="seg" role="group" aria-label="Format"><button data-fmt="1:1">1:1</button><button data-fmt="4:5">4:5</button></span>' +
      '<button class="btn sm icon" id="undo" title="Undo (Ctrl+Z)" aria-label="Undo">↶</button><button class="btn sm icon" id="redo" title="Redo (Ctrl+Shift+Z)" aria-label="Redo">↷</button>' +
      (S.canWrite ? '<button class="btn sm" id="dup">Duplicate</button><button class="btn sm danger" id="del">Delete</button>' : '') +
      '<button class="btn sm" id="png2">PNG 2x</button><button class="btn sm primary" id="png">Download PNG</button></div>' +
      '<div class="canvas-wrap" id="wrap"><div class="canvas-box" id="box"></div><div class="guides" id="guides"></div><div class="tools" id="tools" hidden></div>' +
      '<span class="hint">Click to select · drag to move · corner to resize · top dot to rotate · double-click text to edit · Del removes · Ctrl+D duplicates</span></div></div>';
    drawCanvas(); renderInspector();
  }
  function drawCanvas() {
    var d = cur(), box = $('#box'); if (!box || !d) return;
    box.innerHTML = ''; var el = R.render(d, { edit: true }); box.appendChild(el); R.fit(box);
    $('#ed-title').textContent = (d.draft ? 'Draft · ' : '') + (d.name || d.id);
    $$('[data-fmt]').forEach(function (b) { b.classList.toggle('on', (d.format || '1:1') === b.dataset.fmt); });
    fitCanvas(); markSel();
    var w = $('#fitwarn'); if (w) w.hidden = $('.d-head', el).dataset.fit !== 'shrunk';
  }
  function fitCanvas() {
    var wrap = $('#wrap'), box = $('#box'), el = box && box.firstChild; if (!el) return;
    var H = el.offsetHeight || 1080, s = Math.min((wrap.clientWidth - 56) / 1080, (wrap.clientHeight - 80) / H);
    s = Math.max(.2, Math.min(s, 1)); box.style.width = 1080 * s + 'px'; box.style.height = H * s + 'px';
    el.style.transform = 'scale(' + s + ')'; box.dataset.s = s; el.style.setProperty('--inv', (1 / s).toFixed(3));
  }
  function selEl() { return st.sel === 'copy' ? $('#box .d-copy') : st.sel > -1 ? $('#box .L[data-i="' + st.sel + '"]') : null; }
  function markSel() {
    $$('#box .sel').forEach(function (n) { n.classList.remove('sel'); });
    $$('#box .hdl').forEach(function (n) { n.remove(); });
    var n = selEl(); if (!n) { $('#tools').hidden = true; return; }
    n.classList.add('sel');
    if (st.sel !== 'copy') {
      var L = cur().layers[st.sel]; n.style.setProperty('--ls', L.s || 1);
      n.insertAdjacentHTML('beforeend', '<span class="hdl hdl-rot" data-h="rot" title="Rotate (Shift snaps to 15°)"></span><span class="hdl hdl-se" data-h="se" title="Resize"></span>');
    }
    placeTools();
  }
  var TEXTY = { pill: 1, chip: 1, note: 1, bubble: 1, text: 1, record: 1, phone: 1, checklist: 1, code: 1, site: 1, serp: 1, gauge: 1, ba: 1, orbit: 1, apps: 1, palette: 1, devices: 1, appflow: 1 };
  var IMAGEY = { person: 1, shot: 1, img: 1, phone: 1, nexi: 1 };
  function placeTools() {
    var t = $('#tools'), n = selEl(), wrap = $('#wrap'); if (!t || !n || editing) { if (t) t.hidden = true; return; }
    var L = st.sel === 'copy' ? { type: 'copy' } : cur().layers[st.sel];
    var r = n.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    t.innerHTML = (st.sel === 'copy' || TEXTY[L.type] ? '<button data-tool="edit">Edit text</button>' : '') +
      (IMAGEY[L.type] ? '<button data-tool="image">' + (L.type === 'nexi' ? 'Swap for a photo' : 'Replace image') + '</button>' : '') +
      (L.type === 'nexi' ? '<select data-tool="pose" aria-label="Nexi pose">' + opts(POSES, L.pose) + '</select>' : '') +
      (st.sel === 'copy' ? '' : '<button data-tool="front" title="Bring forward (])">Forward</button><button data-tool="back" title="Send backward ([)">Backward</button><button data-tool="dup" title="Duplicate (Ctrl+D)">Duplicate</button><button data-tool="del" class="danger" title="Delete (Del)">Delete</button>');
    t.hidden = !S.canWrite;
    var top = r.top - w.top - 46; if (top < 6) top = r.bottom - w.top + 10;
    var left = Math.max(6, Math.min(r.left - w.left + r.width / 2 - t.offsetWidth / 2, w.width - t.offsetWidth - 6));
    t.style.top = top + 'px'; t.style.left = left + 'px';
  }
  function select(i) { st.sel = i; closePop(); markSel(); renderInspector(); }

  /* ---------- pointer: move, resize, rotate, snap ---------- */
  var drag = null, editing = null;
  function tf(L) { return (L.rot || L.flip || L.s) ? 'rotate(' + (L.rot || 0) + 'deg)' + (L.flip ? ' scaleX(-1)' : '') + (L.s ? ' scale(' + L.s + ')' : '') : ''; }
  function boxOf(n) { var s = +$('#box').dataset.s, dr = $('#box .drip').getBoundingClientRect(), r = n.getBoundingClientRect(); return { x: (r.left - dr.left) / s, y: (r.top - dr.top) / s, w: r.width / s, h: r.height / s }; }
  document.addEventListener('pointerdown', function (e) {
    if (!st.id || !S.canWrite || e.button !== 0) return;
    if (editing && e.target.closest('[contenteditable]')) return;
    if (editing && editing.commit) editing.commit();
    var box = e.target.closest && e.target.closest('#box'); if (!box) return;
    var hdl = e.target.closest('.hdl'), n = e.target.closest('.L, .d-copy');
    if (!n) { if (st.sel !== -1) select(-1); return; }
    e.preventDefault();
    var i = n.classList.contains('d-copy') ? 'copy' : +n.dataset.i;
    if (st.sel !== i) select(i);
    n = selEl();
    var d = cur(), s = +box.dataset.s, H = $('#box .drip').offsetHeight;
    var L = i === 'copy' ? null : d.layers[i], tall = d.format === '4:5';
    drag = { mode: hdl ? hdl.dataset.h : 'move', n: n, i: i, s: s, H: H, x0: e.clientX, y0: e.clientY, moved: false, tall: tall };
    if (i === 'copy') { drag.top0 = parseFloat(n.style.top) || 148; }
    else {
      drag.lx = L.x || 0; drag.ly = tall ? parseFloat(n.style.top) || 0 : L.y || 0; drag.lb = L.b;
      drag.w0 = L.w || n.offsetWidth; drag.s0 = L.s || 1; drag.rot0 = L.rot || 0; drag.box0 = boxOf(n);
      var r = n.getBoundingClientRect(); drag.cx = r.left + r.width / 2; drag.cy = r.top + r.height / 2;
    }
    $('#box').classList.add('dragging'); $('#tools').hidden = true;
    try { n.setPointerCapture(e.pointerId); } catch (err) {}
  });
  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = (e.clientX - drag.x0) / drag.s, dy = (e.clientY - drag.y0) / drag.s;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 2) return;
    if (!drag.moved) { snapshot(); drag.moved = true; }
    var d = cur();
    if (drag.i === 'copy') { var t = Math.round(drag.top0 + dy); d.copy = d.copy || {}; d.copy.top = (d.format === '4:5' ? t - 40 : t); drag.n.style.top = t + 'px'; return; }
    var L = d.layers[drag.i];
    if (drag.mode === 'move') {
      var g = snap(drag.box0, dx, dy, drag.H, e.altKey); dx = g.dx; dy = g.dy; showGuides(g.lines);
      L.x = Math.round(drag.lx + dx); drag.n.style.left = L.x + 'px';
      if (drag.lb != null) { L.b = Math.round(drag.lb - dy); drag.n.style.bottom = L.b + 'px'; }
      else { var ny = Math.round(drag.ly + dy); if (drag.tall) L.y45 = ny; else L.y = ny; drag.n.style.top = ny + 'px'; }
    } else if (drag.mode === 'se') {
      var a = (L.rot || 0) * Math.PI / 180, along = dx * Math.cos(a) + dy * Math.sin(a);
      if (L.w || !AUTO[L.type]) { L.w = Math.max(24, Math.round(drag.w0 + along)); drag.n.style.width = L.w + 'px'; }
      else { L.s = Math.max(.25, Math.round(drag.s0 * (1 + along / (drag.w0 * drag.s0)) * 100) / 100); drag.n.style.transform = tf(L); drag.n.style.setProperty('--ls', L.s); }
    } else if (drag.mode === 'rot') {
      var ang = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx) * 180 / Math.PI + 90;
      if (ang > 180) ang -= 360;
      ang = e.shiftKey ? Math.round(ang / 15) * 15 : Math.abs(ang) < 3 ? 0 : Math.round(ang * 2) / 2;
      L.rot = ang || undefined; drag.n.style.transform = tf(L);
    }
    syncXY();
  });
  document.addEventListener('pointerup', function () {
    if (!drag) return;
    $('#box').classList.remove('dragging'); showGuides([]);
    var moved = drag.moved; drag = null;
    if (moved) { queueSave(cur()); drawCanvas(); renderInspector(); } else placeTools();
  });
  var AUTO = { pill: 1, chip: 1, note: 1, bubble: 1 };
  function snap(b, dx, dy, H, off) {
    var lines = [], th = 7;
    if (off) return { dx: dx, dy: dy, lines: lines };
    var xs = [[64, 'l'], [540, 'c'], [1016, 'r']], ys = [[H / 2, 'c'], [64, 't'], [H - 64, 'b']];
    var bx = [b.x + dx, b.x + dx + b.w / 2, b.x + dx + b.w], by = [b.y + dy, b.y + dy + b.h / 2, b.y + dy + b.h];
    var best = null;
    xs.forEach(function (l) { bx.forEach(function (v) { var dd = l[0] - v; if (Math.abs(dd) < th && (!best || Math.abs(dd) < Math.abs(best))) best = dd; }); });
    if (best != null) { dx += best; lines.push(['v', xs.filter(function (l) { return [b.x + dx, b.x + dx + b.w / 2, b.x + dx + b.w].some(function (v) { return Math.abs(v - l[0]) < .6; }); }).map(function (l) { return l[0]; })]); }
    best = null;
    ys.forEach(function (l) { by.forEach(function (v) { var dd = l[0] - v; if (Math.abs(dd) < th && (!best || Math.abs(dd) < Math.abs(best))) best = dd; }); });
    if (best != null) { dy += best; lines.push(['h', ys.filter(function (l) { return [b.y + dy, b.y + dy + b.h / 2, b.y + dy + b.h].some(function (v) { return Math.abs(v - l[0]) < .6; }); }).map(function (l) { return l[0]; })]); }
    return { dx: dx, dy: dy, lines: lines };
  }
  function showGuides(lines) {
    var g = $('#guides'); if (!g) return; var box = $('#box'), s = +box.dataset.s, br = box.getBoundingClientRect(), wr = $('#wrap').getBoundingClientRect();
    g.innerHTML = lines.map(function (l) { return l[1].map(function (v) {
      return l[0] === 'v' ? '<i class="gv" style="left:' + (br.left - wr.left + v * s) + 'px;top:' + (br.top - wr.top) + 'px;height:' + br.height + 'px"></i>'
        : '<i class="gh" style="top:' + (br.top - wr.top + v * s) + 'px;left:' + (br.left - wr.left) + 'px;width:' + br.width + 'px"></i>'; }).join(''); }).join('');
  }
  function syncXY() { var L = cur().layers[st.sel]; if (!L) return; var fx = $('#p-x'), fy = $('#p-y'), fb = $('#p-b'), fw = $('#p-w'), fr = $('#p-rot'); if (fx) fx.value = L.x || 0; if (fy) fy.value = L.y || 0; if (fb) fb.value = L.b; if (fw) fw.value = L.w == null ? '' : L.w; if (fr) fr.value = L.rot || 0; }

  /* ---------- editing text on the canvas ---------- */
  document.addEventListener('dblclick', function (e) {
    if (!st.id || !S.canWrite) return;
    var n = e.target.closest && e.target.closest('#box .L, #box .d-copy'); if (!n) return;
    var i = n.classList.contains('d-copy') ? 'copy' : +n.dataset.i;
    if (st.sel !== i) select(i);
    var spot = e.target.closest('[data-e]');
    var L = i === 'copy' ? null : cur().layers[i];
    if (spot && L && !Array.isArray(L[spot.dataset.e])) inlineEdit(spot, L);
    else openPop();
  });
  function inlineEdit(spot, L) {
    var key = spot.dataset.e, before = L[key], done = false; snapshot();
    editing = { spot: spot, L: L, key: key, before: before, commit: commit }; $('#tools').hidden = true;
    spot.setAttribute('contenteditable', 'plaintext-only'); if (spot.contentEditable !== 'plaintext-only') spot.setAttribute('contenteditable', 'true');
    spot.focus(); var rg = document.createRange(); rg.selectNodeContents(spot); var sl = getSelection(); sl.removeAllRanges(); sl.addRange(rg);
    function commit() {
      if (done) return; done = true; editing = null;
      if (L[key] === before) hist.pop(); else queueSave(cur());
      drawCanvas(); renderInspector();
    }
    spot.addEventListener('input', function () { L[key] = spot.textContent; queueSave(cur()); });
    spot.addEventListener('keydown', function (k) {
      if (k.key === 'Enter' && !k.shiftKey) { k.preventDefault(); commit(); }
      if (k.key === 'Escape') { L[key] = before; commit(); }
      k.stopPropagation();
    });
    spot.addEventListener('blur', commit, { once: true });
  }
  var POP = {
    copy: [['head', 'Headline (*blue* ~brush~ ==marker== | line break)', 'area'], ['sub', 'Subline', 'area'], ['kicker', 'Blue bar above the headline', 'text']],
    pill: [['text', 'Text', 'text']], bubble: [['text', 'Text', 'text']], chip: [['text', 'Text', 'text'], ['small', 'Second line', 'text']], note: [['text', 'Text', 'text'], ['small', 'Second line', 'text']],
    text: [['text', 'Text (markup works)', 'area']],
    record: [['title', 'Title', 'text'], ['crumb', 'Breadcrumb', 'text'], ['status', 'Status', 'text'], ['rows', 'Rows: label | value | ai or ok', 'rows'], ['ai', 'AI note', 'text'], ['btn', 'Button', 'text']],
    phone: [['title', 'Title', 'text'], ['crumb', 'Breadcrumb', 'text'], ['banner', 'Banner', 'text'], ['fields', 'Fields: label | value', 'rows'], ['lines', 'Lines: item | qty | 1 = done', 'rows'], ['btn', 'Button', 'text'], ['toast', 'Toast', 'text']],
    checklist: [['title', 'Title', 'text'], ['tag', 'Tag', 'text'], ['items', 'Items, one per line', 'lines']],
    ba: [['rows', 'Rows: topic | old way | with Odoo', 'rows'], ['oldLabel', 'Old column', 'text'], ['newLabel', 'New column', 'text']],
    code: [['file', 'File name', 'text'], ['lines', 'Code, one line each', 'lines']],
    site: [['brand', 'Brand', 'text'], ['head', 'Headline (*blue*)', 'text'], ['sub', 'Subline', 'text'], ['cta', 'Button', 'text'], ['url', 'Address bar', 'text'], ['accent', 'Accent colour', 'text']],
    serp: [['query', 'Search', 'text'], ['site', 'Site name', 'text'], ['url', 'URL', 'text'], ['title', 'Title', 'text'], ['desc', 'Description', 'area']],
    gauge: [['label', 'Label', 'text'], ['value', 'Value (number 0-100, text, or blank for a tick)', 'text']],
    orbit: [['label', 'Centre label', 'text'], ['apps', 'Apps, one module per line', 'lines']],
    apps: [['list', 'Apps: module:Label, one per line', 'lines']],
    palette: [['colors', 'Colours, one hex per line', 'lines']],
    devices: [['label', 'Tag under the laptop', 'text']],
    appflow: [['title', 'Title', 'text']]
  };
  function openPop() {
    closePop();
    var d = cur(), isCopy = st.sel === 'copy', L = isCopy ? d.copy || (d.copy = {}) : d.layers[st.sel], spec = POP[isCopy ? 'copy' : L.type];
    if (!spec) { toast('This element has no text; use the panel on the right'); return; }
    var h = '<div class="pop-h"><b>Edit ' + (isCopy ? 'headline' : esc(L.type)) + '</b><button class="btn ghost sm icon" id="pop-x" aria-label="Close">✕</button></div>' + spec.map(function (f) {
      var v = L[f[0]], val = f[2] === 'rows' ? (v || []).map(function (r) { return r.map(function (x) { return x === true ? '1' : x === false ? '0' : x; }).join(' | '); }).join('\n') : f[2] === 'lines' ? (v || []).join('\n') : (v == null ? '' : v);
      return '<label class="f"><span>' + esc(f[1]) + '</span>' + (f[2] === 'text' ? '<input type="text" data-pk="' + f[0] + '" data-pt="' + f[2] + '" value="' + esc(val) + '">' : '<textarea data-pk="' + f[0] + '" data-pt="' + f[2] + '" rows="' + (f[2] === 'area' ? 3 : 5) + '">' + esc(val) + '</textarea>') + '</label>';
    }).join('') + '<div class="pop-f"><button class="btn sm primary" id="pop-done">Done</button></div>';
    var p = document.createElement('div'); p.className = 'pop'; p.id = 'pop'; p.innerHTML = h; $('#wrap').appendChild(p);
    var n = selEl(), r = n.getBoundingClientRect(), w = $('#wrap').getBoundingClientRect();
    var left = Math.max(8, Math.min(r.left - w.left, w.width - p.offsetWidth - 8)), top = r.bottom - w.top + 10;
    if (top + p.offsetHeight > w.height - 8) top = Math.max(8, r.top - w.top - p.offsetHeight - 10);
    p.style.left = left + 'px'; p.style.top = top + 'px';
    snapshot(); editing = { pop: true }; $('#tools').hidden = true;
    var first = $('input,textarea', p); if (first) { first.focus(); first.select && first.select(); }
    p.addEventListener('input', function (ev) {
      var t = ev.target, k = t.dataset.pk, ty = t.dataset.pt, v = t.value;
      if (ty === 'lines') v = v.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
      if (ty === 'rows') v = v.split('\n').filter(function (x) { return x.trim(); }).map(function (x) { return x.split('|').map(function (y) { y = y.trim(); return y === '1' && k === 'lines' ? true : y === '0' && k === 'lines' ? false : y; }); });
      var tgt = st.sel === 'copy' ? cur().copy : cur().layers[st.sel];
      if (v === '' || (Array.isArray(v) && !v.length)) delete tgt[k]; else tgt[k] = v;
      queueSave(cur()); clearTimeout(redrawT); redrawT = setTimeout(function () { var keep = $('#pop'); drawCanvas(); if (keep && !keep.isConnected) $('#wrap').appendChild(keep); $('#tools').hidden = true; }, 120);
    });
    p.addEventListener('keydown', function (k) { if (k.key === 'Escape') { k.preventDefault(); closePop(true); } k.stopPropagation(); });
  }
  function closePop(commit) { var p = $('#pop'); if (!p) return; p.remove(); editing = null; if (commit !== false) { renderInspector(); placeTools(); } }

  /* keyboard */
  document.addEventListener('keydown', function (e) {
    if (!st.id || editing) return;
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    var mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (mod && k === 'z' && !typing) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if (mod && k === 'y' && !typing) { e.preventDefault(); redo(); return; }
    if (typing || !S.canWrite) return;
    if (e.key === 'Escape') { select(-1); return; }
    if (st.sel === -1) return;
    if (st.sel === 'copy') { if (e.key === 'Enter') { e.preventDefault(); openPop(); } return; }
    if (mod && k === 'd') { e.preventDefault(); layerAct('dup'); return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); layerAct('del'); return; }
    if (e.key === ']') { layerAct('front'); return; }
    if (e.key === '[') { layerAct('back'); return; }
    if (e.key === 'Enter') { e.preventDefault(); openPop(); return; }
    var mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!mv) return;
    e.preventDefault(); var m = e.shiftKey ? 10 : 1;
    change(function (d) {
      var L = d.layers[st.sel]; L.x = (L.x || 0) + mv[0] * m;
      if (L.b != null) L.b -= mv[1] * m;
      else if (d.format === '4:5') { var n = selEl(); L.y45 = (L.y45 != null ? L.y45 : parseFloat(n.style.top) || 0) + mv[1] * m; }
      else L.y = (L.y || 0) + mv[1] * m;
    }, { now: true });
    syncXY();
  });
  function zs() { return (cur().layers || []).map(function (L) { return L.z == null ? 10 : L.z; }); }
  function layerAct(act, i) {
    i = i == null ? st.sel : i; var d = cur(); if (!d.layers[i]) return;
    change(function (d) {
      var Ls = d.layers, L = Ls[i], z = L.z == null ? 10 : L.z, all = zs();
      if (act === 'front') { var up = all.filter(function (v) { return v > z; }); L.z = up.length ? Math.min.apply(null, up) + 1 : z + 1; }
      if (act === 'back') { var dn = all.filter(function (v) { return v < z; }); L.z = Math.max(0, dn.length ? Math.max.apply(null, dn) - 1 : z - 1); }
      if (act === 'dup') { var cp = clone(L); cp.x = (cp.x || 0) + 30; if (cp.b != null) cp.b -= 30; else cp.y = (cp.y || 0) + 30; if (cp.y45 != null) cp.y45 += 30; cp.z = Math.max.apply(null, all) + 1; Ls.push(cp); st.sel = Ls.length - 1; }
      if (act === 'del') { Ls.splice(i, 1); st.sel = -1; }
      if (act === 'hide') L.hide = !L.hide || undefined;
    }, { insp: true, now: true });
  }

  /* drop or pick images */
  function addImage(file) {
    if (!file || !/^image\//.test(file.type)) { toast('Use a PNG, JPG, WebP or SVG image'); return; }
    if (file.size > 20e6) { toast('That image is over 20 MB'); return; }
    toast(S.assets ? 'Uploading…' : 'Adding image…');
    S.uploadImage(file).then(function (url) {
      change(function (d) {
        var L = d.layers[st.sel];
        if (L && L.type === 'nexi') { L.type = 'person'; delete L.pose; delete L.glow; L.src = url; }
        else if (L && /^(person|shot|img|phone)$/.test(L.type)) L.src = url;
        else { d.layers.push({ type: 'person', src: url, x: 560, y: 380, w: 480, z: Math.max.apply(null, zs().concat([10])) + 1 }); st.sel = d.layers.length - 1; }
      }, { insp: true, now: true });
      toast('Image added. Drag it into place.');
    }).catch(function (e) { toast('Could not add the image: ' + (e && (e.message || e.code) || e)); });
  }
  document.addEventListener('dragover', function (e) { if (!st.id) return; if ((e.dataTransfer.types || []).indexOf('Files') > -1) { e.preventDefault(); var b = $('#box'); if (b) b.classList.add('drop'); } });
  document.addEventListener('dragleave', function (e) { var b = $('#box'); if (b && !e.relatedTarget) b.classList.remove('drop'); });
  document.addEventListener('drop', function (e) {
    if (!st.id) return; e.preventDefault(); var b = $('#box'); if (b) b.classList.remove('drop');
    if (!S.canWrite) return; addImage(e.dataTransfer.files && e.dataTransfer.files[0]);
  });
  function pickImage() { var i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = function () { addImage(i.files[0]); }; i.click(); }

  /* ---------- inspector ---------- */
  var LF = {
    nexi: [['pose', 'select', POSES], ['glow', 'check', 'Soft glow behind Nexi']],
    person: [['src', 'image'], ['sticker', 'check', 'White sticker outline'], ['fade', 'check', 'Fade the bottom edge']],
    img: [['src', 'image'], ['radius', 'number']],
    shot: [['src', 'image'], ['frame', 'select', ['', 'browser', 'laptop', 'tablet']], ['url', 'text']],
    phone: [['src', 'image'], ['app', 'odoo'], ['screen', 'select', ['odoo', 'offline-receipt']]],
    record: [['app', 'odoo'], ['statusOk', 'check', 'Green status']],
    flow: [['from', 'industry'], ['hot', 'number', 'Highlight step (0 = first)'], ['cols', 'number'], ['nodeW', 'number'], ['nodeH', 'number'], ['gapX', 'number'], ['gapY', 'number']],
    ba: [['from', 'industry'], ['n', 'number', 'Rows from the website']],
    phases: [['from', 'industry']], chart: [['from', 'industry'], ['view', 'number', 'Chart view (0 or 1)']],
    appflow: [['app', 'flowapp'], ['hot', 'number', 'Highlight state (0 = first)'], ['max', 'number', 'States shown'], ['handoffs', 'number', 'Hand-offs shown']],
    checklist: [['app', 'odoo'], ['from', 'industry'], ['max', 'number', 'Items shown']],
    orbit: [['core', 'select', ['', 'odoo']]],
    apps: [['cols', 'number'], ['labels', 'check', 'Show labels']],
    devices: [['site', 'site'], ['phone', 'check', 'Show the phone', true]],
    site: [['src', 'image']],
    pill: [['variant', 'select', ['', 'white', 'ok', 'sans', 'white sans']], ['icon', 'icon']],
    chip: [['icon', 'icon'], ['tone', 'select', ['', 'ok']]],
    note: [['variant', 'select', ['', 'red', 'red strike']], ['size', 'number'], ['color', 'text']],
    text: [['font', 'select', ['display', 'body', 'hand']], ['size', 'number'], ['weight', 'number'], ['color', 'text'], ['align', 'select', ['left', 'center', 'right']]],
    icon: [['name', 'icon'], ['color', 'text']], odoo: [['app', 'odoo']],
    arrow: [['kind', 'select', ['right', 'left', 'down', 'up', 'loop']], ['color', 'text']],
    burst: [['variant', 'select', ['', 'yellow']]], sparkles: [['color', 'text']], cursor: [['click', 'check', 'Click rings', true]], gauge: [['color', 'text']]
  };
  function field(k, type, extra, val, dflt) {
    var id = 'p-' + k, lab = '<span>' + esc(k) + '</span>';
    switch (type) {
      case 'check': return '<label class="chk f"><input type="checkbox" id="' + id + '" data-k="' + k + '" data-t="check"' + ((val == null ? dflt : val) ? ' checked' : '') + (dflt ? ' data-dflt="1"' : '') + '>' + esc(extra || k) + '</label>';
      case 'select': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts(extra, val) + '</select></label>';
      case 'odoo': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts([''].concat(ODOO), val, ['(none)'].concat(ODOO.map(R.appName))) + '</select></label>';
      case 'flowapp': var fa = Object.keys(C.appFlows || {}); return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts(fa, val, fa.map(R.appName)) + '</select></label>';
      case 'site': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts(SITES, val, SITES.map(function (s) { return C.sites[s].name; })) + '</select></label>';
      case 'icon': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts([''].concat(ICONS), val) + '</select></label>';
      case 'industry': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts([''].concat(INDUSTRIES.map(function (i) { return 'industry:' + i; })), val, ['(none)'].concat(INDUSTRIES.map(indName))) + '</select></label>';
      case 'number': return '<label class="f"><span>' + esc(extra || k) + '</span><input type="number" id="' + id + '" data-k="' + k + '" data-t="num" value="' + (val == null ? '' : val) + '"></label>';
      case 'image': return '<div class="f"><span>image</span><input type="text" id="' + id + '" data-k="' + k + '" value="' + esc(val && val.indexOf('data:') === 0 ? '(embedded image)' : (val || '')) + '" placeholder="assets/people/photo.png"' + (val && val.indexOf('data:') === 0 ? ' readonly' : '') + '>' +
        '<span class="row"><button class="btn sm" type="button" data-pick="1">Choose image…</button><button class="btn sm" type="button" data-clear="' + k + '">Remove image</button></span></div>';
      default: return '<label class="f">' + lab + '<input type="text" id="' + id + '" data-k="' + k + '" value="' + esc(val == null ? '' : val) + '"></label>';
    }
  }
  var ADDLAB = { nexi: 'Nexi', person: 'Person / photo', shot: 'Screenshot', img: 'Image', phone: 'Phone', record: 'Record card', flow: 'Workflow', apps: 'App cloud', orbit: 'App orbit', appflow: 'Record flow',
    checklist: 'Checklist', ba: 'Before / after', phases: 'Phases', chart: 'Dashboard', devices: 'Laptop + phone', site: 'Website mockup', code: 'Code window', palette: 'Palette', wireframe: 'Wireframe',
    serp: 'Google result', gauge: 'Gauge', cursor: 'Cursor', pill: 'Pill', chip: 'Chip', note: 'Note', bubble: 'Bubble', text: 'Text', icon: 'Icon', odoo: 'Odoo icon', arrow: 'Arrow',
    burst: 'Burst', glow: 'Glow', sphere: 'Sphere', halftone: 'Halftone', scan: 'Scan beam', sparkles: 'Sparkles', storm: 'Storm', speed: 'Speed lines', confetti: 'Confetti', nosignal: 'No signal' };
  function layerLabel(L) { var t = L.text || L.title || L.head || L.label || L.pose || (L.from && indName(L.from.replace('industry:', ''))) || (L.app && R.appName(L.app)) || (L.site && C.sites[L.site] && C.sites[L.site].name) || L.name || (L.src ? (L.src.indexOf('data:') === 0 ? 'embedded image' : L.src.split('/').pop()) : ''); return String(t || '').replace(/[*~|=]/g, ''); }

  function renderInspector() {
    var d = cur(); if (!d) return;
    var c = d.copy || (d.copy = {}), ro = !S.canWrite;
    var h = '';
    var L = st.sel !== 'copy' && d.layers && d.layers[st.sel];
    if (L) {
      h += '<section class="sec sel-sec"><h3>' + esc(ADDLAB[L.type] || L.type) + '<small>' + (TEXTY[L.type] ? 'double-click text on the canvas to edit' : 'selected') + '</small></h3>' +
        (TEXTY[L.type] ? '<button class="btn sm" type="button" data-tool="edit" style="margin-bottom:10px">Edit text…</button>' : '') +
        '<div class="row3">' + field('x', 'number', 'x', L.x || 0) + (L.b != null ? field('b', 'number', 'from bottom', L.b) : field('y', 'number', 'y', L.y || 0)) + field('w', 'number', 'width', L.w) + '</div>' +
        '<div class="row3">' + field('rot', 'number', 'rotate °', L.rot || 0) + field('s', 'number', 'scale', L.s == null ? '' : L.s) + field('op', 'number', 'opacity 0–1', L.op == null ? 1 : L.op) + '</div>' +
        (d.format === '4:5' && L.b == null ? field('y45', 'number', 'y in 4:5 (blank = y + 150 below the copy)', L.y45) : '') +
        field('flip', 'check', 'Mirror', L.flip) +
        (LF[L.type] || []).map(function (f) { return field(f[0], f[1], f[2], L[f[0]], f[3]); }).join('') +
        '<details style="margin-top:8px"><summary>Every field (JSON)</summary><label class="f" style="margin-top:8px"><textarea class="code" id="ljson">' + esc(JSON.stringify(L, function (k, v) { return typeof v === 'string' && v.indexOf('data:') === 0 ? '(embedded image)' : v; }, 1)) + '</textarea></label>' +
        '<button class="btn sm" id="ljson-apply" type="button">Apply JSON</button></details></section>';
    }
    h += '<section class="sec' + (st.sel === 'copy' ? ' sel-sec' : '') + '"><h3>Headline<small>*blue* ~brush~ ==marker== | break</small></h3>' +
      '<label class="f"><span>Headline</span><textarea id="c-head" data-c="head">' + esc(c.head || '') + '</textarea></label>' +
      '<p class="help" id="fitwarn" hidden style="color:#7A5200;margin:-4px 0 8px">Shrunk to fit. Shorten it, or allow more lines.</p>' +
      '<label class="f"><span>Subline</span><textarea id="c-sub" data-c="sub">' + esc(c.sub || '') + '</textarea></label>' +
      '<div class="row"><label class="f"><span>Size</span><select id="c-size" data-c="size">' + opts(['s', 'm', '', 'l'], c.size || '', ['Small', 'Medium', 'Regular', 'Large']) + '</select></label>' +
      '<label class="f"><span>Align</span><select id="c-align" data-c="align">' + opts(['', 'left'], c.align || '', ['Centre', 'Left']) + '</select></label></div>' +
      '<div class="row"><label class="f"><span>Max lines</span><input type="number" id="c-lines" data-c="lines" data-t="num" value="' + (c.lines == null ? '' : c.lines) + '" placeholder="2"></label>' +
      '<label class="f"><span>Top (px)</span><input type="number" id="c-top" data-c="top" data-t="num" value="' + (c.top == null ? '' : c.top) + '" placeholder="148"></label></div>' +
      '<div class="row"><label class="f"><span>Blue bar</span><input type="text" id="c-kicker" data-c="kicker" value="' + esc(c.kicker || '') + '"></label>' +
      '<label class="chk f" style="align-self:end;padding-bottom:8px"><input type="checkbox" id="c-quote" data-c="quote"' + (c.quote ? ' checked' : '') + '>Quote mark</label></div></section>';
    h += '<section class="sec"><h3>Layers<small>front first</small></h3><div class="layers">' +
      (d.layers || []).map(function (L, i) { return { L: L, i: i, z: L.z == null ? 10 : L.z }; }).sort(function (a, b) { return b.z - a.z || b.i - a.i; }).map(function (o) {
        var L = o.L, i = o.i;
        return '<div class="lrow' + (i === st.sel ? ' on' : '') + (L.hide ? ' off' : '') + '" data-li="' + i + '"><span class="ty">' + esc(ADDLAB[L.type] || L.type) + '</span><span class="tx">' + esc(layerLabel(L)) + '</span>' +
          (ro ? '' : '<button class="btn ghost icon" data-lact="hide" title="' + (L.hide ? 'Show' : 'Hide') + '" aria-label="' + (L.hide ? 'Show' : 'Hide') + ' layer">' + (L.hide ? '◌' : '●') + '</button>' +
          '<button class="btn ghost icon" data-lact="front" title="Bring forward" aria-label="Bring forward">↑</button><button class="btn ghost icon" data-lact="back" title="Send backward" aria-label="Send backward">↓</button>' +
          '<button class="btn ghost icon danger" data-lact="del" title="Delete" aria-label="Delete layer">✕</button>') + '</div>';
      }).join('') + '</div>' +
      (ro ? '' : '<div class="add"><select id="addtype" aria-label="Element to add">' + ELEMENTS.map(function (g) { return '<optgroup label="' + esc(g[0]) + '">' + g[1].map(function (e) { return '<option value="' + e[0] + (g[0] === 'Nexi' ? ':' + e[1] : '') + '">' + esc(g[0] === 'Nexi' ? 'Nexi · ' + e[1] : e[1]) + '</option>'; }).join('') + '</optgroup>'; }).join('') + '</select><button class="btn sm primary" id="addlayer" type="button">Add</button></div>') + '</section>';
    h += '<section class="sec"><h3>Post caption<small>for LinkedIn and Facebook</small></h3>' +
      '<label class="f"><textarea id="d-caption" data-d="caption" rows="5" placeholder="Write the post text here, or let Claude write it.">' + esc(d.caption || '') + '</textarea></label>' +
      '<label class="f"><span>Hashtags</span><input type="text" id="d-tags" data-d="hashtags" data-t="tags" value="' + esc((d.hashtags || []).join(' ')) + '" placeholder="#Odoo #Singapore"></label>' +
      '<button class="btn sm" type="button" id="copycap">Copy caption + hashtags</button></section>';
    var catOpts = cats.map(function (x) { return x.id; }), catLabels = cats.map(function (x) { return x.name; });
    h += '<section class="sec"><h3>Drip</h3>' +
      (d.draft ? '<div class="confirm" style="background:var(--blue-050);color:var(--blue-700)">Draft from Claude. <button class="btn sm primary" data-keep="' + esc(d.id) + '">Keep in the library</button></div>' : '') +
      '<label class="f"><span>Name in the library</span><input type="text" id="d-name" data-d="name" value="' + esc(d.name || '') + '"></label>' +
      '<div class="row"><label class="f"><span>Category</span><select id="d-cat" data-d="cat">' + opts(catOpts, d.cat, catLabels) + '</select></label>' +
      '<label class="f"><span>Badge</span><select id="d-badge" data-d="badge">' + opts(['ready', 'o20', ''], d.badge || '', ['Odoo Ready Partner', 'Meet Odoo 20', 'None']) + '</select></label></div>' +
      '<div class="row"><label class="f"><span>Ground</span><select id="d-ground" data-d="ground">' + opts(['blobs', 'blobs-low', 'wave', ''], d.ground == null ? 'blobs' : d.ground, ['Blue blobs', 'Blobs, lower', 'Wave', 'None']) + '</select></label>' +
      '<label class="f"><span>Background</span><select id="d-bg" data-d="bg">' + opts(['light', 'plain', 'sky', 'navy'], d.bg || 'light', ['Light rays', 'White', 'Sky', 'Navy']) + '</select></label></div>' +
      '<label class="chk f"><input type="checkbox" id="d-grid" data-d="grid"' + (d.grid ? ' checked' : '') + '>Faint grid</label>' +
      '<div class="row"><label class="f"><span>Bottom bar</span><input type="text" id="d-cta" data-cta="text" value="' + esc(d.cta && d.cta.text || '') + '" placeholder="technext.asia"></label>' +
      '<label class="f"><span>Button</span><input type="text" id="d-ctab" data-cta="btn" value="' + esc(d.cta && d.cta.btn || '') + '" placeholder="Book a call"></label></div>' +
      (d.source ? '<p class="help">Source: ' + esc(d.source) + '</p>' : '') + '</section>';
    $('#insp').innerHTML = h;
    if (ro) $$('#insp input,#insp select,#insp textarea').forEach(function (x) { x.disabled = true; });
    var w = $('#fitwarn'), hd = $('#box .d-head'); if (w && hd) w.hidden = hd.dataset.fit !== 'shrunk';
  }

  var DEFAULTS = {
    nexi: { pose: 'wave', x: 330, y: 470, w: 400 }, person: { x: 540, y: 380, w: 480 }, shot: { x: 140, y: 470, w: 800, frame: 'browser' }, img: { x: 300, y: 450, w: 480 },
    phone: { x: 382, y: 452, w: 336, rot: -4, screen: 'odoo', app: 'sale', title: 'S00042', crumb: 'Sales · Quotation', fields: [['Customer', 'Sample Customer Pte Ltd']], lines: [['Linen shirt, M', '12', true], ['Canvas tote', '6', true], ['Silk scarf', '3', false]], btn: 'Confirm' },
    record: { x: 480, y: 450, w: 540, app: 'accountant', title: 'Vendor bill', crumb: 'Accounting · Draft', status: 'Draft', rows: [['Vendor', 'Sample Supplier', 'ai'], ['Total', 'S$ 1,000.00', 'ai']], btn: 'Approve' },
    flow: { x: 70, y: 410, from: 'industry:retail', cols: 3, nodeW: 270, nodeH: 200, gapX: 65, gapY: 50 },
    ba: { x: 70, y: 432, w: 940, from: 'industry:retail' }, phases: { x: 70, y: 446, w: 940, from: 'industry:retail' }, chart: { x: 90, y: 436, w: 900, from: 'industry:retail' },
    appflow: { x: 70, y: 460, w: 940, app: 'sale' }, orbit: { x: 290, y: 424, w: 500 }, checklist: { x: 80, y: 440, w: 640, title: 'What you get', items: ['First point', 'Second point', 'Third point'] },
    apps: { x: 120, y: 470, w: 840, cols: 6, list: ['crm:CRM', 'sale:Sales', 'accountant:Accounting', 'stock:Inventory', 'point_of_sale:POS', 'website:Website'] },
    devices: { x: 60, y: 444, w: 720, site: 'technext' }, site: { x: 70, y: 450, w: 640, rot: -2 }, code: { x: 612, y: 560, w: 420, rot: 3 }, palette: { x: 110, y: 880, w: 520 },
    wireframe: { x: 560, y: 470, w: 440 }, serp: { x: 110, y: 462, w: 860 }, gauge: { x: 830, y: 820, w: 190 }, cursor: { x: 520, y: 700, w: 64 },
    pill: { x: 80, y: 600, text: 'Quote it', rot: -4 }, chip: { x: 640, y: 820, icon: 'check', tone: 'ok', text: 'Done in one click' },
    note: { x: 120, y: 900, text: 'handwritten note', rot: -3 }, bubble: { x: 80, y: 460, text: 'Hello!' }, text: { x: 80, y: 900, w: 600, text: 'Your text', size: 40 },
    icon: { x: 880, y: 500, w: 110, name: 'sparkle' }, odoo: { x: 880, y: 500, w: 110, app: 'accountant' },
    burst: { x: 240, y: 420, w: 600, z: 2 }, glow: { x: 240, y: 440, w: 600, z: 2 }, sphere: { x: 940, y: 640, w: 60, z: 6 }, halftone: { x: 600, y: 420, w: 500, z: 2 },
    scan: { x: 480, y: 560, w: 540 }, sparkles: { x: 880, y: 420, w: 120 }, storm: { x: 700, y: 430, w: 290 }, speed: { x: 60, y: 520, w: 260, z: 8 },
    confetti: { x: 140, y: 380, w: 800 }, arrow: { x: 480, y: 700, w: 130, kind: 'right' }, nosignal: { x: 680, y: 620, w: 120 }
  };
  function addLayer(type, extra) {
    change(function (d) {
      var L = clone(DEFAULTS[type] || {}); L.type = type; Object.keys(extra || {}).forEach(function (k) { L[k] = extra[k]; });
      var ind = (catObj(d.cat) || {}).industry; if (ind && L.from) L.from = 'industry:' + ind;
      if (L.z == null) L.z = Math.max.apply(null, zs().concat([10])) + 1;
      d.layers = d.layers || []; d.layers.push(L); st.sel = d.layers.length - 1;
    }, { insp: true, now: true });
    if (type === 'person' || type === 'shot' || type === 'img') toast('Drop an image on it, or use "Replace image"');
  }

  /* inspector inputs */
  document.addEventListener('input', function (e) {
    var t = e.target; if (!st.id || !t.closest('#insp') || !S.canWrite) return;
    if (t.id === 'ljson') return;
    var v = t.type === 'checkbox' ? t.checked : t.value;
    if (t.dataset.t === 'num') v = v === '' ? null : +v;
    if (t.dataset.t === 'tags') v = v.split(/[\s,]+/).filter(Boolean).map(function (x) { return x.charAt(0) === '#' ? x : '#' + x; });
    var soft = t.tagName === 'TEXTAREA' || t.type === 'text';
    var o = { noHist: soft && burst() };
    if (t.dataset.c) change(function (d) { d.copy = d.copy || {}; if (v === '' || v === null || v === false) delete d.copy[t.dataset.c]; else d.copy[t.dataset.c] = v; }, o);
    else if (t.dataset.d) change(function (d) {
      var k = t.dataset.d;
      if (k === 'bg' && v === 'light') delete d.bg; else if ((v === '' && k !== 'ground') || v === false || (Array.isArray(v) && !v.length)) delete d[k]; else d[k] = v;
      if (k === 'cat') renderRail();
      if (k === 'name') $('#ed-title').textContent = (d.draft ? 'Draft · ' : '') + v;
    }, o);
    else if (t.dataset.cta) change(function (d) { d.cta = d.cta || {}; d.cta[t.dataset.cta] = v; if (!d.cta.text && !d.cta.btn) delete d.cta; }, o);
    else if (t.dataset.k) change(function (d) {
      var L = d.layers[st.sel], k = t.dataset.k;
      if (k === 'src' && v === '(embedded image)') return;
      if (t.type === 'checkbox' && t.dataset.dflt) { if (v) delete L[k]; else L[k] = false; }
      else if (v === '' || v === null || v === false) delete L[k]; else L[k] = v;
    }, o);
  });
  function burst() { var now = Date.now(), b = now - (burst.t || 0) < 1200; burst.t = now; return b; }

  /* clicks */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button,[data-li],select[data-tool]'); if (!t || t.tagName === 'SELECT') return;
    var ds = t.dataset;
    if (ds.cat) { st.cat = ds.cat; showGallery(); return; }
    if (ds.open) { openDrip(ds.open); return; }
    if (ds.new) { openLayouts(); return; }
    if (ds.gen) { openGenerate(); return; }
    if (ds.keep) { var k = lib.filter(function (x) { return x.id === ds.keep; })[0]; if (k) { delete k.draft; saveNow(k); toast('Kept in ' + catName(k.cat)); if (st.id) { drawCanvas(); renderInspector(); } else showGallery(); } return; }
    if (ds.keepall) { lib.forEach(function (x) { if (x.draft && (st.cat === 'all' || st.cat === 'drafts' || x.cat === st.cat)) { delete x.draft; saveNow(x); } }); toast('All drafts kept'); showGallery(); return; }
    if (ds.discard) { var g = lib.filter(function (x) { return x.id === ds.discard; })[0]; if (g) { removeDrip(g); toast('Discarded'); showGallery(); } return; }
    if (ds.add) { addLayer(ds.add, ds.pose ? { pose: ds.pose } : null); return; }
    if (ds.fmt) { change(function (d) { if (ds.fmt === '1:1') delete d.format; else d.format = ds.fmt; }, { now: true, insp: true }); return; }
    if (ds.clear) { change(function (d) { delete d.layers[st.sel][ds.clear]; }, { insp: true, now: true }); return; }
    if (ds.pick) { pickImage(); return; }
    if (ds.tool) {
      if (ds.tool === 'edit') openPop(); else if (ds.tool === 'image') pickImage(); else layerAct(ds.tool === 'del' ? 'del' : ds.tool);
      return;
    }
    if (ds.lact) { layerAct(ds.lact, +t.closest('[data-li]').dataset.li); return; }
    if (ds.li != null && !e.target.closest('button')) { select(+ds.li); return; }
    switch (t.id) {
      case 'back': st.cat = st.cat === 'all' || st.cat === 'drafts' ? st.cat : (cur() ? cur().cat : st.cat); showGallery(); break;
      case 'ljson-apply':
        try { var obj = JSON.parse($('#ljson').value), old = cur().layers[st.sel]; if (obj.src === '(embedded image)') obj.src = old.src; change(function (d) { d.layers[st.sel] = obj; }, { insp: true, now: true }); }
        catch (err) { toast('That JSON has an error: ' + err.message); }
        break;
      case 'addlayer': var av = $('#addtype').value.split(':'); addLayer(av[0], av[1] ? { pose: av[1] } : null); break;
      case 'undo': undo(); break;
      case 'redo': redo(); break;
      case 'dup': var cp = clone(cur()); cp.id = uid(cp.id); cp.name = (cp.name || cp.id) + ' (copy)'; delete cp.draft; lib.push(cp); saveNow(cp); openDrip(cp.id); toast('Duplicated'); break;
      case 'del': confirmDelete(); break;
      case 'del-yes': var gone = cur(); removeDrip(gone); st.cat = gone.cat; showGallery(); toast('Deleted ' + (gone.name || gone.id)); break;
      case 'del-no': var cf = $('#confirm'); if (cf) cf.remove(); break;
      case 'png': exportPng(1); break;
      case 'png2': exportPng(2); break;
      case 'copycap': var d = cur(); copyText((d.caption || '') + ((d.hashtags || []).length ? '\n\n' + d.hashtags.join(' ') : '')); break;
      case 'pop-done': case 'pop-x': closePop(); break;
      case 'usage': openUsage(); break;
      case 'savefile': saveLibraryFile(); break;
      case 'reset': openDlg('<h2>Discard browser edits?</h2><p>This drops every change kept in this browser and reloads the library from drips.js.</p><div class="dlg-foot"><button class="btn" id="dlg-close">Cancel</button><button class="btn danger" id="reset-yes">Discard edits</button></div>'); break;
      case 'reset-yes': S.resetLocal(); location.reload(); break;
      case 'dlg-close': closeDlg(); break;
      case 'import-starters': fileLib.forEach(function (d, i) { if (!lib.some(function (x) { return x.id === d.id; })) { var c2 = clone(d); c2.order = i; lib.push(c2); S.saveDrip(c2, lib); } }); S.saveCats(cats); toast('Starter drips imported'); showGallery(); break;
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.tool === 'pose') change(function (d) { d.layers[st.sel].pose = t.value; }, { insp: true, now: true });
  });
  function confirmDelete() {
    if ($('#confirm')) return;
    var c = document.createElement('div'); c.id = 'confirm'; c.className = 'confirm'; c.style.flexBasis = '100%';
    c.innerHTML = 'Delete "' + esc(cur().name || cur().id) + '" for everyone? <button class="btn sm danger" id="del-yes">Delete</button><button class="btn sm" id="del-no">Keep it</button>';
    $('.ed-bar').appendChild(c);
  }

  /* ---------- dialogs ---------- */
  function openDlg(html, wide) { var d = $('#dlg'); d.innerHTML = '<div class="dlg-card' + (wide ? ' wide' : '') + '" role="dialog" aria-modal="true">' + html + '</div>'; d.hidden = false; var f = $('button,select,input,textarea', d); if (f) f.focus(); }
  function closeDlg() { if (genCtl) return; $('#dlg').hidden = true; $('#dlg').innerHTML = ''; }
  $('#dlg').addEventListener('click', function (e) { if (e.target.id === 'dlg') closeDlg(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#dlg').hidden) closeDlg(); });

  /* ---------- new drip from a layout (no Claude) ---------- */
  function starter(recipe, ind, cat) {
    var i = C.industries[ind] || {}, noun = i.noun || 'teams', ft = (i.flow_title || '').replace(/\.$/, ''), k = ft.lastIndexOf(', ');
    var S0 = {
      workflow: { head: k > 0 ? ft.slice(0, k + 1) + '|*' + ft.slice(k + 2) + '.*' : 'Every step,|*one system.*', sub: 'Six steps ' + noun + ' run every day, and the Odoo app behind each one.' },
      beforeafter: { head: 'Still doing it|*the old way?*', sub: 'What changes for ' + noun + ' when everything runs in one Odoo.' },
      chart: { head: 'Your numbers,|*live from Odoo.*', sub: (i.chart ? i.chart.title : 'Reports') + ' for every location, straight from your Odoo.' },
      phases: { head: 'Three phases.|*One Odoo rollout.*', sub: 'How TechNext rolls out Odoo for ' + noun + '.' },
      checklist: { head: 'What Odoo 20 changes|*for ' + noun + '.*', sub: 'Worth testing on a copy of your database before you upgrade.', title: 'Odoo 20 for ' + (i.name || 'your business') },
      appflow: { head: 'From quote to invoice,|*one record.*', sub: 'Watch a sales order move through Odoo, and what it triggers on the way.', app: 'sale' },
      orbit: { head: 'Every app.|*One database.*', sub: 'Accounting, Sales, Inventory and the rest of Odoo share the same data.' },
      record: { head: 'AI prepares it.|*You approve it.*', sub: 'TechNext builds AI inside your Odoo. It prepares the record and waits for your OK.', app: 'accountant', title: 'Vendor bill', crumb: 'Accounting · Draft', status: 'Draft', rows: [['Vendor', 'Sample Supplier', 'ai'], ['Total', 'S$ 1,284.00', 'ai'], ['PO match', 'PO00123', 'ok']], steps: ['AI read the bill', 'Matched to the PO', 'Approved by Finance'] },
      phone: { head: 'Run it|*from your phone.*', sub: 'Odoo works on the phone your team already carries.', app: 'sale', title: 'S00042', crumb: 'Sales · Quotation', pills: ['Quote it', 'Confirm it', 'Get paid'] },
      reaction: { head: 'Your question|*goes here?*', sub: 'One line on what changes for the customer.', pose: 'surprise', pills: ['First point', 'Second point', 'Third point'] },
      website: { head: 'Websites that|*bring you leads.*', sub: 'Fast, mobile-first pages with every inquiry sent to the right person.', site: 'technext', chips: ['Mobile-first pages', 'Forms reach your team', 'SEO basics built in'] },
      webdesign: { head: 'Designed, built|*and handed over.*', sub: 'Short copy, real information and pages your team can edit without us.' },
      seo: { head: 'Be the answer|*on Google.*', sub: 'Every TechNext site ships with SEO basics, analytics and accessibility.', chips: ['SEO basics included', 'Analytics from day one'] }
    };
    var c = S0[recipe] || { head: 'Your headline, *in blue.*', sub: 'One supporting line.' };
    c.recipe = recipe; c.name = RC.RECIPES[recipe] ? RC.RECIPES[recipe].label + (ind ? ' · ' + indName(ind) : '') : 'New drip';
    return c;
  }
  function openLayouts() {
    var c = catObj(st.cat), ind = c && c.industry, rec = Object.keys(RC.RECIPES);
    openDlg('<h2>New drip</h2><p>Pick a layout. Industry layouts fill themselves from technext.asia; everything stays editable.</p><div class="tpls">' +
      rec.map(function (r, n) { return '<button class="tpl' + (n === 0 ? ' on' : '') + '" data-tpl="' + r + '" type="button"><b>' + esc(RC.RECIPES[r].label) + '</b><span>' + esc(RC.RECIPES[r].about) + '</span></button>'; }).join('') +
      '<button class="tpl" data-tpl="blank" type="button"><b>Blank</b><span>Logo, badge, headline and blobs. Add elements yourself.</span></button></div>' +
      '<div class="row"><label class="f"><span>Category</span><select id="t-cat">' + opts(cats.map(function (x) { return x.id; }), c ? c.id : 'apps', cats.map(function (x) { return x.name; })) + '</select></label>' +
      '<label class="f"><span>Industry content</span><select id="t-ind">' + opts(INDUSTRIES, ind || 'fnb', INDUSTRIES.map(indName)) + '</select></label></div>' +
      '<div class="dlg-foot"><button class="btn" id="dlg-close" type="button">Cancel</button><button class="btn primary" id="t-go" type="button">Create drip</button></div>', true);
    var pick = rec[0];
    $$('.tpl').forEach(function (b) { b.addEventListener('click', function () { pick = b.dataset.tpl; $$('.tpl').forEach(function (x) { x.classList.toggle('on', x === b); }); }); });
    $('#t-cat').addEventListener('change', function () { var cc = catObj(this.value); if (cc && cc.industry) $('#t-ind').value = cc.industry; });
    $('#t-go').addEventListener('click', function () {
      var cat = $('#t-cat').value, indK = (catObj(cat) || {}).industry || $('#t-ind').value, d;
      if (pick === 'blank') d = { cat: cat, name: 'New drip', badge: cat === 'odoo20' ? 'o20' : 'ready', ground: 'blobs', copy: { head: 'Your headline, *in blue.*', sub: 'One supporting line.' }, layers: [] };
      else d = RC.build(starter(pick, indK, cat), { cat: cat, industry: indK, source: 'Layout: ' + RC.RECIPES[pick].label });
      d.id = uid(d.name); d.createdAt = new Date().toISOString();
      lib.push(d); saveNow(d); closeDlg(); openDrip(d.id); toast('Created "' + d.name + '"');
    });
  }

  /* ---------- generate with Claude ---------- */
  var genCtl = null;
  function openGenerate() {
    var c = catObj(st.cat) || catObj('fnb') || cats[0];
    var catIds = cats.map(function (x) { return x.id; });
    openDlg('<h2>' + sparkIcon() + ' Generate with Claude</h2><p>Claude reads the technext.asia content for the category and writes a set of different posts: headline, subline, caption and the facts each layout shows. The studio designs every drip. They arrive as drafts you keep or discard.</p>' +
      '<div class="row"><label class="f"><span>Category</span><select id="g-cat">' + opts(catIds, c.id, cats.map(function (x) { return x.name; })) + '</select></label>' +
      '<label class="f"><span>Industry focus</span><select id="g-ind">' + opts([''].concat(INDUSTRIES), c.industry || '', ['Any / none'].concat(INDUSTRIES.map(indName))) + '</select></label></div>' +
      '<div class="row"><label class="f"><span>How many posts</span><select id="g-n">' + opts(['3', '6', '9'], '6') + '</select></label>' +
      '<label class="f"><span>Model</span><select id="g-tier">' + opts(AI.TIERS.map(function (t) { return t[0]; }), 'default', AI.TIERS.map(function (t) { return t[1]; })) + '</select></label></div>' +
      '<div class="f"><span>Angles to cover</span><div class="angles">' + AI.ANGLES.map(function (a) { return '<label class="chk"><input type="checkbox" data-angle="' + a[0] + '" checked>' + esc(a[1]) + '</label>'; }).join('') + '</div></div>' +
      '<label class="f"><span>Brief (optional)</span><textarea id="g-brief" rows="2" placeholder="e.g. Promote Odoo POS for restaurant groups with 3+ outlets; mention training."></textarea></label>' +
      '<div class="est" id="g-est"></div>' +
      '<div class="dlg-foot"><button class="btn" id="dlg-close" type="button">Cancel</button><button class="btn primary" id="g-go" type="button">Generate</button></div>', true);
    var syncAngles = function () {
      var cat = $('#g-cat').value, ind = $('#g-ind').value;
      $$('[data-angle]').forEach(function (b) {
        var a = b.dataset.angle, off = (a === 'web' && cat !== 'services') || (cat === 'services' && /workflow|beforeafter|odoo20|proof/.test(a)) || (!ind && /workflow|beforeafter|proof/.test(a) && cat !== 'services');
        b.checked = !off; b.closest('label').classList.toggle('dim', off);
      });
    };
    var est = function () {
      var o = genOpts(), e = AI.estimate(o);
      $('#g-est').innerHTML = '<b>Estimated usage:</b> about ' + nf(e.input) + ' tokens in + ' + nf(e.output) + ' out = <b>' + nf(e.input + e.output) + ' tokens</b> for ' + o.count + ' posts' +
        (o.tier === 'quick' ? '.' : ', plus Claude\'s thinking time (billed, not reported).') + ' <span class="muted">It runs on your own Claude plan; the page cannot see exact counts.</span>';
    };
    $('#g-cat').addEventListener('change', function () { var cc = catObj(this.value); $('#g-ind').value = cc && cc.industry || ''; syncAngles(); est(); });
    var card = $('.dlg-card'); card.addEventListener('input', est); card.addEventListener('change', est);
    syncAngles(); est();
    AI.available().then(function (s) { if (!s) { $('#g-go').disabled = true; $('#g-est').insertAdjacentHTML('beforeend', '<p class="warn">Claude is only available inside the TechNext hub on claude.ai. This copy can design and export, but not generate.</p>'); } });
    $('#g-go').addEventListener('click', runGenerate);
  }
  function genOpts() {
    var cat = $('#g-cat').value, ind = $('#g-ind').value || (catObj(cat) || {}).industry || '';
    return { cat: cat, catName: catName(cat), industry: ind || null, count: +$('#g-n').value, tier: $('#g-tier').value, brief: $('#g-brief').value.trim(),
      angles: $$('[data-angle]').filter(function (b) { return b.checked; }).map(function (b) { return b.dataset.angle; }),
      existing: lib.filter(function (d) { return d.cat === cat; }).map(function (d) { return String(d.copy && d.copy.head || '').replace(/[*~|=]/g, ' ').replace(/\s+/g, ' ').trim(); }) };
  }
  function runGenerate() {
    var o = genOpts();
    if (!o.angles.length) { toast('Pick at least one angle'); return; }
    genCtl = new AbortController();
    var card = $('.dlg-card');
    card.innerHTML = '<h2>' + sparkIcon() + ' Claude is writing ' + o.count + ' posts</h2><p id="g-stage">Thinking… (the Balanced and Best models think for 10-60 seconds before writing)</p>' +
      '<div class="gbar"><i id="g-bar" style="width:4%"></i></div><div class="dlg-foot"><button class="btn" id="g-stop" type="button">Stop</button></div>';
    $('#g-stop').addEventListener('click', function () { if (genCtl) genCtl.abort(); });
    var t0 = Date.now();
    AI.generate(o, function (n) { $('#g-stage').textContent = 'Writing post ' + Math.min(n, o.count) + ' of ' + o.count + '…'; $('#g-bar').style.width = Math.max(8, Math.min(96, n / o.count * 96)) + '%'; }, genCtl.signal)
      .then(function (r) {
        genCtl = null;
        var gid = 'g' + Date.now().toString(36), made = [];
        r.concepts.slice(0, o.count).forEach(function (cpt, i) {
          var d = RC.build(cpt, { cat: o.cat, industry: o.industry, source: 'Claude · ' + o.catName + (o.industry ? ' · ' + indName(o.industry) : '') + ' · ' + new Date().toISOString().slice(0, 10) });
          d.id = uid(d.name); d.draft = true; d.gen = gid; d.angle = cpt.angle || ''; d.createdAt = new Date().toISOString(); d.order = lib.length + i;
          lib.push(d); made.push(d); saveNow(d);
        });
        var entry = { at: new Date().toISOString(), cat: o.cat, industry: o.industry, asked: o.count, made: made.length, tier: r.tier, input: r.input, output: r.output, ms: r.ms };
        usage.push(entry); S.logUsage(usage);
        $('.dlg-card').innerHTML = '<h2>' + made.length + ' drafts added to ' + esc(o.catName) + '</h2>' +
          '<p>They are saved as drafts. Open any of them to edit, or keep the ones you like.</p>' +
          '<div class="est"><b>This run:</b> about ' + nf(r.input) + ' tokens in + ' + nf(r.output) + ' out = <b>' + nf(r.input + r.output) + ' tokens</b> (estimate, ' + esc(tierName(r.tier)) + ' model, ' + Math.round(r.ms / 1000) + ' s).</div>' +
          '<div class="dlg-foot"><button class="btn" id="dlg-close" type="button">Close</button><button class="btn primary" id="g-review" type="button">Review drafts</button></div>';
        $('#g-review').addEventListener('click', function () { closeDlg(); st.cat = o.cat; showGallery(); });
        if (!st.id) showGallery();
      })
      .catch(function (e) {
        genCtl = null;
        var code = e && e.code, msg = {
          cancelled: 'Stopped. Nothing was added.', not_granted: 'Claude was not allowed for this page. Allow it when asked, then try again.', rate_limited: 'Claude is busy or your usage limit is reached. Try again in a few minutes.',
          invalid_json: 'Claude\'s answer could not be read as drafts. Try again, or ask for fewer posts.', prompt_too_large: 'The request was too long. Remove the brief or pick fewer angles.',
          unavailable: 'Claude is only available inside the TechNext hub on claude.ai.', sampling_disabled: 'Claude is turned off for this account.', refused: 'Claude declined this request. Change the brief and try again.'
        }[code] || ('Something went wrong (' + (code || 'error') + '). Try again.');
        $('.dlg-card').innerHTML = '<h2>No drafts this time</h2><p>' + esc(msg) + '</p><div class="dlg-foot"><button class="btn" id="dlg-close" type="button">Close</button><button class="btn primary" id="g-again" type="button">Try again</button></div>';
        $('#g-again').addEventListener('click', openGenerate);
      });
  }
  function tierName(t) { var x = AI.TIERS.filter(function (y) { return y[0] === t; })[0]; return x ? x[1] : t; }
  function openUsage() {
    var tot = usage.reduce(function (a, u) { return a + (u.input || 0) + (u.output || 0); }, 0), posts = usage.reduce(function (a, u) { return a + (u.made || 0); }, 0);
    var rows = usage.slice().reverse().slice(0, 40).map(function (u) {
      return '<tr><td>' + esc(String(u.at).slice(0, 16).replace('T', ' ')) + '</td><td>' + esc(catName(u.cat)) + (u.industry ? ' · ' + esc(indName(u.industry)) : '') + '</td><td class="n">' + u.made + '/' + u.asked + '</td><td>' + esc(tierName(u.tier)) + '</td><td class="n">' + nf(u.input) + '</td><td class="n">' + nf(u.output) + '</td><td class="n"><b>' + nf((u.input || 0) + (u.output || 0)) + '</b></td></tr>';
    }).join('');
    var e6 = AI.estimate({ cat: 'fnb', catName: 'F&B', industry: 'fnb', count: 6, tier: 'default', angles: AI.ANGLES.map(function (a) { return a[0]; }), existing: [] });
    openDlg('<h2>Claude usage</h2><p>Every generation is logged here with an estimate (about 4 characters per token; the page cannot read exact counts, and thinking time on the Balanced and Best models is extra).</p>' +
      '<div class="usage-sum"><span><small>Generations</small><b>' + usage.length + '</b></span><span><small>Drafts written</small><b>' + posts + '</b></span><span><small>Estimated tokens</small><b>' + nf(tot) + '</b></span><span><small>Typical 6-post run</small><b>≈ ' + nf(e6.input + e6.output) + '</b></span></div>' +
      (rows ? '<div class="tbl"><table><thead><tr><th>When (UTC)</th><th>Category</th><th class="n">Posts</th><th>Model</th><th class="n">In</th><th class="n">Out</th><th class="n">Total</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="empty">No generations yet.</p>') +
      '<div class="dlg-foot"><button class="btn primary" id="dlg-close" type="button">Close</button></div>', true);
  }

  /* ---------- export ---------- */
  var URI = {}, CSS = null;
  function dataURL(url) {
    if (/^data:/.test(url)) return Promise.resolve(url);
    return URI[url] || (URI[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error('Could not load ' + url); return r.blob(); })
      .then(function (b) { return new Promise(function (res, rej) { var f = new FileReader(); f.onload = function () { res(f.result); }; f.onerror = rej; f.readAsDataURL(b); }); }));
  }
  function dripCSS() {
    return CSS || (CSS = Promise.all([fetch('drip.css').then(function (r) { return r.text(); }), fetch('assets/fonts.css').then(function (r) { return r.text(); })]).then(function (a) {
      var fonts = a[1], urls = [];
      fonts.replace(/url\((fonts\/[^)]+)\)/g, function (m, u) { if (urls.indexOf(u) < 0) urls.push(u); });
      return Promise.all(urls.map(function (u) { return dataURL('assets/' + u); })).then(function (ds) {
        urls.forEach(function (u, i) { fonts = fonts.split('url(' + u + ')').join('url(' + ds[i] + ')'); });
        return fonts + '\n' + a[0].replace(/@import[^;]+;/, '');
      });
    }));
  }
  function clientRender(d, scale) {
    var host = document.createElement('div'); host.className = 'export-host'; var el = R.render(d); host.appendChild(el); document.body.appendChild(host);
    return whenReady(host).then(function () {
      R.fit(host);
      return Promise.all($$('img', el).map(function (im) { return dataURL(im.getAttribute('src')).then(function (u) { im.setAttribute('src', u); }); }));
    }).then(dripCSS).then(function (css) {
      var W = 1080, H = el.offsetHeight;
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '"><foreignObject x="0" y="0" width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="margin:0"><style><![CDATA[' + css + ']]></style>' + new XMLSerializer().serializeToString(el) + '</div></foreignObject></svg>';
      var img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      return img.decode().then(function () { return new Promise(function (r) { setTimeout(r, 120); }); }).then(function () {
        var cv = document.createElement('canvas'); cv.width = W * scale; cv.height = H * scale;
        cv.getContext('2d').drawImage(img, 0, 0, W * scale, H * scale);
        return new Promise(function (res, rej) { cv.toBlob(function (b) { b ? res(b) : rej(new Error('The browser could not create the PNG')); }, 'image/png'); });
      });
    }).then(function (b) { host.remove(); return b; }, function (e) { host.remove(); throw e; });
  }
  window.TNStudioRender = clientRender;
  function exportPng(scale) {
    var d = cur(), fname = d.id + (scale === 2 ? '@2x' : '') + (d.format === '4:5' ? '-4x5' : '') + '.png';
    if (location.protocol === 'file:') {
      openDlg('<h2>Export needs a server</h2><p>Browsers block image export for pages opened straight from a folder. Double-click <code>Open Drip Studio.bat</code>, use the live link, or run <code>python tools/render.py</code>.</p><div class="dlg-foot"><button class="btn primary" id="dlg-close">OK</button></div>');
      return;
    }
    toast('Rendering ' + (d.name || d.id) + '…', 8000);
    var job = SERVER ? fetch('api/render', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ drip: d, scale: scale }) }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); }) : clientRender(d, scale);
    job.then(function (b) { return S.download(fname, b); })
      .then(function (ok) { toast(ok ? 'Saved ' + fname + (SERVER ? ' (also in exports/)' : '') : 'Save cancelled'); })
      .catch(function (err) { toast('Export failed: ' + (err && (err.message || err.code) || err)); });
  }
  function saveLibraryFile() {
    var js = '/* TechNext Drip Studio — the drip library, saved from the studio on ' + new Date().toISOString().slice(0, 10) + '. See README.md. */\n\nwindow.CATEGORIES = ' + JSON.stringify(cats, null, 2) + ';\n\nwindow.DRIPS = ' + JSON.stringify(lib.map(stripMeta), null, 2) + ';\n';
    if (SERVER) { fetch('api/library', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ js: js }) }).then(function (r) { if (!r.ok) throw new Error(r.status); toast('Wrote drips.js (old copy in backups/)'); }).catch(function (e) { toast('Could not save: ' + e.message); }); return; }
    S.download('drips.js', new Blob([js], { type: 'text/javascript' })).then(function () { toast('Downloaded drips.js'); });
  }

  /* ---------- boot ---------- */
  function topbar() {
    var local = S.mode !== 'hub';
    $('#topacts').innerHTML = '<span class="savestate" id="savestate"></span><span class="sp"></span>' +
      '<button class="btn ghost" id="usage" type="button">Claude usage</button>' +
      (local ? '<button class="btn ghost" id="reset" type="button" title="Drop the edits kept in this browser">Discard edits</button><button class="btn" id="savefile" type="button" title="Write every drip into drips.js">' + (SERVER ? 'Write drips.js' : 'Download drips.js') + '</button>' : '') +
      (S.canWrite ? '<button class="btn" data-gen="1" type="button">' + sparkIcon() + 'Generate</button><button class="btn primary" data-new="1" type="button">New drip</button>' : '');
    setStatus(S.canWrite ? 'saved' : 'readonly');
  }
  $('#main').innerHTML = '<div class="gallery"><p class="empty">Loading the library…</p></div>';
  S.init(fileLib, clone(window.CATEGORIES || [])).then(function (r) {
    lib = r.lib; cats = r.cats; usage = r.usage;
    topbar(); S.on('caps', topbar);
    if (location.protocol !== 'file:' && S.mode !== 'hub') fetch('api/ping', { cache: 'no-store' }).then(function (x) { return x.ok ? x.json() : null; }).catch(function () { return null; }).then(function (j) { SERVER = !!(j && j.ok); if (SERVER) topbar(); });
    var hash = location.hash.slice(1);
    if (hash && lib.some(function (d) { return d.id === hash; })) openDrip(hash); else showGallery();
  });
})();
