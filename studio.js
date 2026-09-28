/* TechNext Drip Studio — the editor. Data lives in drips.js; edits are kept in this browser until you
   press "Save library", which downloads a new drips.js to replace the old one. */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {}, R = window.TNDrip;
  var KEY = 'tn-drip-library', KEY_CATS = 'tn-drip-categories';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var esc = R.esc;

  var POSES = ['wave', 'point', 'present', 'celebrate', 'cheer', 'surprise', 'love', 'think', 'clap'];
  var ODOO = ['account', 'accountant', 'ai_app', 'appointment', 'approvals', 'crm', 'documents', 'esg', 'event', 'fleet', 'helpdesk', 'hr', 'hr_appraisal', 'hr_expense', 'hr_holidays',
    'hr_payroll', 'hr_recruitment', 'hr_referral', 'hr_timesheet', 'im_livechat', 'industry_fsm', 'iot', 'knowledge', 'mail', 'maintenance', 'marketing_automation', 'mass_mailing',
    'mass_mailing_sms', 'mrp', 'mrp_plm', 'planning', 'point_of_sale', 'pos_restaurant', 'project', 'purchase', 'quality_control', 'sale', 'sale_renting', 'sale_subscription', 'sign',
    'social', 'spreadsheet_dashboard', 'stock', 'survey', 'voip', 'web_studio', 'website', 'website_blog', 'website_forum', 'website_sale', 'website_slides', 'whatsapp'];
  var KIT = ['check', 'spark', 'search', 'sync', 'wifiOff', 'cloudOff', 'cloudOk'];
  var ICONS = KIT.concat(Object.keys(C.icons || {}).sort());
  var INDUSTRIES = Object.keys(C.industries || {});
  var indName = function (k) { var i = C.industries[k]; return i ? i.name : k; };

  /* ---------- library + storage ---------- */
  var fileLib = clone(window.DRIPS || []);
  var cats = (function () { try { var c = JSON.parse(localStorage.getItem(KEY_CATS) || 'null'); if (c && c.length) return c; } catch (e) {} return clone(window.CATEGORIES || []); })();
  (window.CATEGORIES || []).forEach(function (c) { if (!cats.some(function (x) { return x.id === c.id; })) cats.push(clone(c)); });
  var lib = (function () {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!saved || !saved.length) return clone(fileLib);
    fileLib.forEach(function (d) { if (!saved.some(function (x) { return x.id === d.id; })) saved.push(clone(d)); });
    return saved;
  })();
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(lib)); localStorage.setItem(KEY_CATS, JSON.stringify(cats)); }
    catch (e) { toast('This browser is out of storage (dropped images are large). Press Save library to keep your work.'); }
    markDirty();
  }
  function isEdited(d) { var f = fileLib.filter(function (x) { return x.id === d.id; })[0]; return !f || JSON.stringify(f) !== JSON.stringify(d); }
  function markDirty() { var n = lib.filter(isEdited).length + (lib.length < fileLib.length ? 1 : 0); var b = $('#save'); b.dataset.n = n; b.querySelector('.cnt').textContent = n ? ' (' + n + ')' : ''; }

  var st = { cat: 'all', id: null, sel: -1 };
  var hist = [], future = [];
  var cur = function () { return lib.filter(function (d) { return d.id === st.id; })[0]; };
  function snapshot() { hist.push(JSON.stringify(cur())); if (hist.length > 60) hist.shift(); future = []; }
  function replaceCur(obj) { var i = lib.indexOf(cur()); lib[i] = obj; }

  /* ---------- small UI helpers ---------- */
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 3200); }
  function download(name, href) { var a = document.createElement('a'); a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
  function uid(base) { var s = (base || 'drip').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'drip', id = s, n = 2; while (lib.some(function (d) { return d.id === id; })) id = s + '-' + n++; return id; }
  function catName(id) { var c = cats.filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; }
  function opts(list, val, labels) { return list.map(function (v, i) { return '<option value="' + esc(v) + '"' + (String(v) === String(val == null ? '' : val) ? ' selected' : '') + '>' + esc(labels ? labels[i] : (v === '' ? 'default' : v)) + '</option>'; }).join(''); }
  function whenReady(root) {
    var imgs = $$('img', root).map(function (im) { return im.complete ? 1 : new Promise(function (r) { im.onload = im.onerror = r; }); });
    return Promise.all(imgs.concat([document.fonts.ready]));
  }

  /* ---------- category rail ---------- */
  function renderRail() {
    var groups = [];
    cats.forEach(function (c) { if (groups.indexOf(c.group) < 0) groups.push(c.group); });
    var count = function (id) { return lib.filter(function (d) { return id === 'all' || d.cat === id; }).length; };
    var h = '<h2>Library</h2>' + catBtn({ id: 'all', name: 'All drips', group: '' }, count('all'));
    groups.forEach(function (g) {
      h += '<h2>' + esc(g) + '</h2>';
      cats.filter(function (c) { return c.group === g; }).forEach(function (c) { h += catBtn(c, count(c.id)); });
    });
    h += '<h2>Add</h2><form id="newcat" class="f" style="padding:0 6px"><input type="text" id="newcat-name" placeholder="New category name" aria-label="New category name">' +
      '<select id="newcat-group" aria-label="Group">' + opts(groups.concat(['Other']), 'Industries') + '</select><button class="btn sm" type="submit">Add category</button></form>';
    $('#rail').innerHTML = h;
    $('#newcat').addEventListener('submit', function (e) {
      e.preventDefault(); var n = $('#newcat-name').value.trim(); if (!n) return;
      var id = n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (!cats.some(function (c) { return c.id === id; })) cats.push({ id: id, group: $('#newcat-group').value, name: n });
      persist(); st.cat = id; showGallery();
    });
  }
  function catBtn(c, n) {
    return '<button class="cat' + (st.cat === c.id && !st.id ? ' on' : '') + '" data-cat="' + esc(c.id) + '" data-group="' + esc(c.group) + '">' + (c.id === 'all' ? '' : '<span class="dot"></span>') +
      esc(c.name) + '<span class="n' + (n ? '' : ' zero') + '">' + n + '</span></button>';
  }

  /* ---------- gallery ---------- */
  function showGallery() {
    st.id = null; st.sel = -1;
    $('#shell').classList.remove('editing'); $('#insp').hidden = true;
    renderRail();
    var list = lib.filter(function (d) { return st.cat === 'all' || d.cat === st.cat; });
    var c = cats.filter(function (x) { return x.id === st.cat; })[0];
    var ind = c && c.industry && C.industries[c.industry];
    var h = '<div class="gallery"><div class="gal-head"><div><h2>' + esc(c ? c.name : 'All drips') + '</h2><p>' +
      (ind ? 'Workflow on technext.asia: ' + esc(ind.flow_title) : c ? esc(c.group) + ' · ' + list.length + ' drip' + (list.length === 1 ? '' : 's') : lib.length + ' drips across ' + cats.length + ' categories. Pick one to edit, or start a new one.') +
      '</p></div><span class="sp"></span>' +
      (ind ? '<button class="btn" data-quick="workflow">New workflow drip</button><button class="btn" data-quick="beforeafter">New before/after drip</button>' : '') +
      (st.cat === 'odoo20' ? '<button class="btn" data-quick="odoo20">New Odoo 20 feature drip</button>' : '') +
      '<button class="btn primary" data-new="1">New drip</button></div><div class="grid" id="grid">';
    list.forEach(function (d) {
      h += '<button class="card" data-open="' + esc(d.id) + '"><div class="thumb' + (d.format === '4:5' ? ' r45' : '') + '" data-thumb="' + esc(d.id) + '"></div>' +
        '<span class="meta"><b>' + esc(d.name || d.id) + '</b>' + (st.cat === 'all' ? '<span class="tag">' + esc(catName(d.cat)) + '</span>' : '') + (isEdited(d) ? '<span class="tag" style="background:#FFF4D6;color:#7A5200">edited</span>' : '') + '</span></button>';
    });
    h += '<button class="card new" data-new="1"><div class="thumb"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>New drip</span></div><span class="meta"><b>Start from a template</b></span></button>';
    h += '</div>' + (list.length ? '' : '<p class="empty" style="margin-top:18px">No drips in this category yet. Start one from a template' + (ind ? ', or build the ' + esc(ind.name) + ' workflow straight from the website data.' : '.') + '</p>') + '</div>';
    $('#main').innerHTML = h;
    list.forEach(function (d) {
      var box = $('[data-thumb="' + d.id + '"]'), el = R.render(d);
      box.appendChild(el); R.fit(box); fitThumb(box);
    });
    document.fonts.ready.then(function () { R.fit($('#grid')); });
  }
  function fitThumb(box) { var el = box.firstChild; if (el) el.style.transform = 'scale(' + (box.clientWidth / 1080) + ')'; }
  new ResizeObserver(function () { $$('[data-thumb]').forEach(fitThumb); if (st.id) fitCanvas(); }).observe(document.body);

  /* ---------- editor ---------- */
  function openDrip(id) {
    st.id = id; st.sel = -1; hist = []; future = [];
    $('#shell').classList.add('editing'); $('#insp').hidden = false;
    renderRail();
    var d = cur();
    $('#main').innerHTML = '<div class="editor"><div class="ed-bar"><button class="btn ghost sm" id="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>All drips</button>' +
      '<span class="title" id="ed-title"></span><span class="sp"></span>' +
      '<span class="seg" role="group" aria-label="Format"><button data-fmt="1:1">1:1</button><button data-fmt="4:5">4:5</button></span>' +
      '<button class="btn sm" id="undo" title="Undo (Ctrl+Z)">Undo</button><button class="btn sm" id="dup">Duplicate</button><button class="btn sm danger" id="del">Delete</button>' +
      '<button class="btn sm" id="png2">PNG 2x</button><button class="btn sm primary" id="png">Download PNG</button></div>' +
      '<div class="canvas-wrap" id="wrap"><div class="canvas-box" id="box"></div><span class="hint">Drag layers to move · arrow keys nudge (Shift = 10 px) · drop an image to add it</span></div></div>';
    drawCanvas(); renderInspector();
  }
  function drawCanvas() {
    var d = cur(), box = $('#box'); if (!box) return;
    box.innerHTML = ''; var el = R.render(d, { edit: true }); box.appendChild(el); R.fit(box);
    var shrunk = $('.d-head', el).dataset.fit === 'shrunk', w = $('#fitwarn'); if (w) w.hidden = !shrunk;
    $$('.L', el).forEach(function (n) { if (+n.dataset.i === st.sel) n.classList.add('sel'); });
    $('#ed-title').textContent = d.name || d.id;
    $$('[data-fmt]').forEach(function (b) { b.classList.toggle('on', (d.format || '1:1') === b.dataset.fmt); });
    fitCanvas();
  }
  function fitCanvas() {
    var wrap = $('#wrap'), box = $('#box'), el = box && box.firstChild; if (!el) return;
    var H = el.offsetHeight || 1080, s = Math.min((wrap.clientWidth - 56) / 1080, (wrap.clientHeight - 74) / H);
    s = Math.max(.2, Math.min(s, 1)); box.style.width = 1080 * s + 'px'; box.style.height = H * s + 'px';
    el.style.transform = 'scale(' + s + ')'; box.dataset.s = s;
  }
  var redrawT;
  function change(fn, opts) {
    if (!(opts && opts.noHist)) snapshot();
    fn(cur()); persist();
    clearTimeout(redrawT); redrawT = setTimeout(function () { drawCanvas(); if (opts && opts.insp) renderInspector(); }, opts && opts.now ? 0 : 40);
  }

  /* drag layers */
  var drag = null;
  document.addEventListener('pointerdown', function (e) {
    var n = e.target.closest && e.target.closest('#box .L'); if (!n) return;
    e.preventDefault();
    var i = +n.dataset.i, L = cur().layers[i], s = +$('#box').dataset.s, tall = cur().format === '4:5';
    if (st.sel !== i) { st.sel = i; $$('#box .L').forEach(function (x) { x.classList.toggle('sel', x === n); }); renderInspector(); }
    drag = { n: n, i: i, s: s, x0: e.clientX, y0: e.clientY, lx: L.x || 0, ly: tall ? parseFloat(n.style.top) || 0 : L.y || 0, lb: L.b, tall: tall, moved: false };
    $('#box').classList.add('dragging'); n.setPointerCapture(e.pointerId);
  });
  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = (e.clientX - drag.x0) / drag.s, dy = (e.clientY - drag.y0) / drag.s;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 2) return;
    if (!drag.moved) { snapshot(); drag.moved = true; }
    var L = cur().layers[drag.i];
    L.x = Math.round(drag.lx + dx); drag.n.style.left = L.x + 'px';
    if (drag.lb != null) { L.b = Math.round(drag.lb - dy); drag.n.style.bottom = L.b + 'px'; } else { var ny = Math.round(drag.ly + dy); if (drag.tall) L.y45 = ny; else L.y = ny; drag.n.style.top = ny + 'px'; }
    syncXY();
  });
  document.addEventListener('pointerup', function () { if (!drag) return; $('#box').classList.remove('dragging'); if (drag.moved) persist(); drag = null; });
  function syncXY() { var L = cur().layers[st.sel]; if (!L) return; var fx = $('#p-x'), fy = $('#p-y'), f45 = $('#p-y45'); if (fx) fx.value = L.x || 0; if (fy) fy.value = L.b != null ? L.b : (L.y || 0); if (f45) f45.value = L.y45 == null ? '' : L.y45; }

  document.addEventListener('keydown', function (e) {
    if (!st.id) return;
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); undo(); return; }
    if (typing || st.sel < 0) return;
    var k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!k) return;
    e.preventDefault(); var m = e.shiftKey ? 10 : 1;
    change(function (d) { var L = d.layers[st.sel]; L.x = (L.x || 0) + k[0] * m; if (L.b != null) L.b -= k[1] * m;
      else if (d.format === '4:5') { var n = $('#box .L[data-i="' + st.sel + '"]'); L.y45 = (L.y45 != null ? L.y45 : parseFloat(n.style.top) || 0) + k[1] * m; } else L.y = (L.y || 0) + k[1] * m; }, { now: true });
    setTimeout(syncXY, 0);
  });
  function undo() { if (!hist.length) { toast('Nothing to undo'); return; } replaceCur(JSON.parse(hist.pop())); persist(); drawCanvas(); renderInspector(); }

  /* drop images onto the canvas */
  function readImage(file, cb) {
    if (!file || !/^image\//.test(file.type)) { toast('Drop a PNG, JPG, WebP or SVG image'); return; }
    if (file.size > 3.5e6) toast('Large image: it is embedded in the library. Consider saving it into assets/people and typing its path.');
    var r = new FileReader(); r.onload = function () { cb(r.result); }; r.readAsDataURL(file);
  }
  document.addEventListener('dragover', function (e) { if (!st.id) return; if ((e.dataTransfer.types || []).indexOf('Files') > -1) { e.preventDefault(); var b = $('#box'); if (b) b.classList.add('drop'); } });
  document.addEventListener('dragleave', function (e) { var b = $('#box'); if (b && !e.relatedTarget) b.classList.remove('drop'); });
  document.addEventListener('drop', function (e) {
    if (!st.id) return; e.preventDefault(); var b = $('#box'); if (b) b.classList.remove('drop');
    var f = e.dataTransfer.files && e.dataTransfer.files[0];
    readImage(f, function (url) {
      var L = cur().layers[st.sel];
      if (L && /^(person|shot|img|phone)$/.test(L.type)) change(function () { L.src = url; }, { insp: true });
      else change(function (d) { d.layers.push({ type: 'person', src: url, x: 560, y: 380, w: 480, z: 14 }); st.sel = d.layers.length - 1; }, { insp: true });
      toast('Image added. Drag it into place.');
    });
  });

  /* ---------- inspector ---------- */
  var LF = {
    nexi: [['pose', 'select', POSES], ['glow', 'check', 'Soft glow behind Nexi']],
    person: [['src', 'image'], ['sticker', 'check', 'White sticker outline'], ['fade', 'check', 'Fade the bottom edge']],
    img: [['src', 'image'], ['radius', 'number']],
    shot: [['src', 'image'], ['frame', 'select', ['', 'browser', 'laptop', 'tablet']], ['url', 'text']],
    phone: [['src', 'image'], ['title', 'text'], ['crumb', 'text'], ['banner', 'text'], ['partner', 'text'], ['btn', 'text'], ['toast', 'text']],
    record: [['app', 'odoo'], ['title', 'text'], ['crumb', 'text'], ['status', 'text'], ['ai', 'text'], ['btn', 'text']],
    flow: [['from', 'industry'], ['hot', 'number', 'Highlight step (0 = first, blank = none)'], ['cols', 'number'], ['nodeW', 'number'], ['nodeH', 'number'], ['gapX', 'number'], ['gapY', 'number']],
    apps: [['list', 'list', 'module:Label, comma separated'], ['cols', 'number'], ['labels', 'check', 'Show labels']],
    pill: [['text', 'text'], ['variant', 'select', ['', 'white', 'ok', 'sans', 'white sans']], ['icon', 'icon']],
    chip: [['text', 'text'], ['small', 'text'], ['icon', 'icon'], ['tone', 'select', ['', 'ok']]],
    note: [['text', 'text'], ['small', 'text'], ['variant', 'select', ['', 'red', 'red strike']], ['size', 'number'], ['color', 'text']],
    bubble: [['text', 'text']],
    text: [['text', 'textarea'], ['font', 'select', ['display', 'body', 'hand']], ['size', 'number'], ['weight', 'number'], ['color', 'text'], ['align', 'select', ['left', 'center', 'right']]],
    icon: [['name', 'icon'], ['color', 'text']],
    odoo: [['app', 'odoo']],
    arrow: [['kind', 'select', ['right', 'left', 'down', 'up', 'loop']], ['color', 'text']],
    burst: [['variant', 'select', ['', 'yellow']]],
    sparkles: [['color', 'text']]
  };
  function field(k, type, extra, val) {
    var id = 'p-' + k, lab = '<span>' + esc(k) + '</span>';
    switch (type) {
      case 'check': return '<label class="chk f"><input type="checkbox" id="' + id + '" data-k="' + k + '" data-t="check"' + (val ? ' checked' : '') + '>' + esc(extra || k) + '</label>';
      case 'select': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts(extra, val) + '</select></label>';
      case 'odoo': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts(ODOO, val) + '</select></label>';
      case 'icon': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts([''].concat(ICONS), val) + '</select></label>';
      case 'industry': return '<label class="f">' + lab + '<select id="' + id + '" data-k="' + k + '">' + opts(INDUSTRIES.map(function (i) { return 'industry:' + i; }), val, INDUSTRIES.map(indName)) + '</select></label>';
      case 'number': return '<label class="f"><span>' + esc(extra || k) + '</span><input type="number" id="' + id + '" data-k="' + k + '" data-t="num" value="' + (val == null ? '' : val) + '"></label>';
      case 'textarea': return '<label class="f">' + lab + '<textarea id="' + id + '" data-k="' + k + '">' + esc(val || '') + '</textarea></label>';
      case 'list': return '<label class="f"><span>' + esc(extra) + '</span><textarea id="' + id + '" data-k="' + k + '" data-t="list">' + esc((val || []).join(', ')) + '</textarea></label>';
      case 'image': return '<div class="f"><span>image</span><input type="text" id="' + id + '" data-k="' + k + '" value="' + esc(val && val.indexOf('data:') === 0 ? '(embedded image)' : (val || '')) + '" placeholder="assets/people/photo.png"' + (val && val.indexOf('data:') === 0 ? ' readonly' : '') + '>' +
        '<span class="row"><label class="btn sm" style="justify-content:center">Choose image…<input type="file" accept="image/*" data-img="' + k + '" hidden></label><button class="btn sm" type="button" data-clear="' + k + '">Remove image</button></span></div>';
      default: return '<label class="f">' + lab + '<input type="text" id="' + id + '" data-k="' + k + '" value="' + esc(val == null ? '' : val) + '"></label>';
    }
  }
  function layerLabel(L) { return L.text || L.title || L.pose || L.from && indName(L.from.replace('industry:', '')) || L.app || L.name || (L.src ? (L.src.indexOf('data:') === 0 ? 'embedded image' : L.src.split('/').pop()) : '') || ''; }

  function renderInspector() {
    var d = cur(); if (!d) return;
    var c = d.copy || (d.copy = {});
    var catOpts = cats.map(function (x) { return x.id; }), catLabels = cats.map(function (x) { return x.name; });
    var h = '<section class="sec"><h3>Copy<small>*blue* ~brush~ ==marker== | break</small></h3>' +
      '<label class="f"><span>Headline</span><textarea id="c-head" data-c="head">' + esc(c.head || '') + '</textarea></label>' +
      '<label class="f"><span>Subline</span><textarea id="c-sub" data-c="sub">' + esc(c.sub || '') + '</textarea></label>' +
      '<div class="row"><label class="f"><span>Headline size</span><select id="c-size" data-c="size">' + opts(['s', 'm', '', 'l'], c.size || '', ['Small', 'Medium', 'Regular', 'Large']) + '</select></label>' +
      '<label class="f"><span>Align</span><select id="c-align" data-c="align">' + opts(['', 'left'], c.align || '', ['Centre', 'Left']) + '</select></label></div>' +
      '<div class="row"><label class="f"><span>Kicker (blue bar)</span><input type="text" id="c-kicker" data-c="kicker" value="' + esc(c.kicker || '') + '"></label>' +
      '<label class="f"><span>Copy top (px)</span><input type="number" id="c-top" data-c="top" data-t="num" value="' + (c.top == null ? '' : c.top) + '" placeholder="148"></label></div>' +
      '<div class="row"><label class="f"><span>Max headline lines</span><input type="number" id="c-lines" data-c="lines" data-t="num" value="' + (c.lines == null ? '' : c.lines) + '" placeholder="2"></label>' +
      '<label class="chk f" style="align-self:end;padding-bottom:8px"><input type="checkbox" id="c-quote" data-c="quote"' + (c.quote ? ' checked' : '') + '>Big quote mark</label></div>' +
      '<p class="help" id="fitwarn" hidden style="color:#7A5200">The headline was shrunk to fit. Shorten it, or allow more lines.</p>' +
      '<p class="help">Every claim should come from technext.asia. Say "Odoo Partner", never "Certified".</p></section>';
    h += '<section class="sec"><h3>Drip</h3>' +
      '<label class="f"><span>Name in the library</span><input type="text" id="d-name" data-d="name" value="' + esc(d.name || '') + '"></label>' +
      '<div class="row"><label class="f"><span>Category</span><select id="d-cat" data-d="cat">' + opts(catOpts, d.cat, catLabels) + '</select></label>' +
      '<label class="f"><span>Badge</span><select id="d-badge" data-d="badge">' + opts(['ready', 'o20', ''], d.badge || '', ['Odoo Ready Partner', 'Meet Odoo 20', 'None']) + '</select></label></div>' +
      '<div class="row"><label class="f"><span>Ground</span><select id="d-ground" data-d="ground">' + opts(['blobs', 'blobs-low', 'wave', ''], d.ground == null ? 'blobs' : d.ground, ['Blue blobs', 'Blobs, lower', 'Wave', 'None']) + '</select></label>' +
      '<label class="f"><span>Background</span><select id="d-bg" data-d="bg">' + opts(['light', 'plain', 'sky', 'navy'], d.bg || 'light', ['Light rays', 'White', 'Sky', 'Navy']) + '</select></label></div>' +
      '<label class="chk f"><input type="checkbox" id="d-grid" data-d="grid"' + (d.grid ? ' checked' : '') + '>Faint grid</label>' +
      '<div class="row"><label class="f"><span>Bottom call to action</span><input type="text" id="d-cta" data-cta="text" value="' + esc(d.cta && d.cta.text || '') + '" placeholder="technext.asia"></label>' +
      '<label class="f"><span>Button</span><input type="text" id="d-ctab" data-cta="btn" value="' + esc(d.cta && d.cta.btn || '') + '" placeholder="Book a call"></label></div>' +
      (d.source ? '<p class="help">Source: ' + esc(d.source) + '</p>' : '') + '</section>';
    h += '<section class="sec"><h3>Layers<small>top of list = drawn first</small></h3><div class="layers">' +
      (d.layers || []).map(function (L, i) {
        return '<div class="lrow' + (i === st.sel ? ' on' : '') + (L.hide ? ' off' : '') + '" data-li="' + i + '"><span class="ty">' + esc(L.type) + '</span><span class="tx">' + esc(layerLabel(L)) + '</span>' +
          '<button class="btn ghost icon" data-lact="hide" title="' + (L.hide ? 'Show' : 'Hide') + '" aria-label="' + (L.hide ? 'Show' : 'Hide') + ' layer">' + (L.hide ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.2A10 10 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.2 3.9M6.2 6.3C3.8 8 2.5 12 2.5 12S6 19 12 19c1.6 0 3-.4 4.3-1"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"/><circle cx="12" cy="12" r="2.6"/></svg>') + '</button>' +
          '<button class="btn ghost icon" data-lact="up" title="Draw earlier" aria-label="Move layer up">↑</button><button class="btn ghost icon" data-lact="down" title="Draw later" aria-label="Move layer down">↓</button>' +
          '<button class="btn ghost icon" data-lact="copy" title="Duplicate" aria-label="Duplicate layer">⧉</button><button class="btn ghost icon danger" data-lact="rm" title="Remove" aria-label="Remove layer">✕</button></div>';
      }).join('') + '</div>' +
      '<div class="add"><select id="addtype" aria-label="Layer type">' + opts(Object.keys(DEFAULTS), 'nexi', Object.keys(DEFAULTS).map(function (k) { return ADDLAB[k] || k; })) + '</select><button class="btn sm primary" id="addlayer" type="button">Add layer</button></div></section>';
    var L = d.layers && d.layers[st.sel];
    if (L) {
      var yk = L.b != null ? 'b' : 'y';
      h += '<section class="sec"><h3>' + esc(ADDLAB[L.type] || L.type) + '<small>layer ' + (st.sel + 1) + '</small></h3>' +
        '<div class="row3">' + field('x', 'number', 'x', L.x || 0) + field(yk, 'number', yk === 'b' ? 'from bottom' : 'y', L[yk] || 0) + field('w', 'number', 'width', L.w) + '</div>' +
        '<div class="row3">' + field('rot', 'number', 'rotate °', L.rot || 0) + field('z', 'number', 'stack (z)', L.z == null ? 10 : L.z) + field('op', 'number', 'opacity 0–1', L.op == null ? 1 : L.op) + '</div>' +
        (d.format === '4:5' && L.b == null ? field('y45', 'number', 'y in 4:5 (blank = y + 150 when below the copy)', L.y45) : '') +
        field('flip', 'check', 'Mirror horizontally', L.flip) +
        (LF[L.type] || []).map(function (f) { return field(f[0], f[1], f[2], L[f[0]]); }).join('') +
        '<details style="margin-top:8px"><summary style="cursor:pointer;font-weight:600;color:var(--label)">Layer JSON (every field)</summary>' +
        '<label class="f" style="margin-top:8px"><textarea class="code" id="ljson">' + esc(JSON.stringify(L, function (k, v) { return typeof v === 'string' && v.indexOf('data:') === 0 ? '(embedded image)' : v; }, 1)) + '</textarea></label>' +
        '<button class="btn sm" id="ljson-apply" type="button">Apply JSON</button></details></section>';
    } else {
      h += '<section class="sec"><p class="help" style="margin:0">Click a layer on the canvas or in the list to edit it. Drop an image on the canvas to add a person or product cut-out.</p></section>';
    }
    $('#insp').innerHTML = h;
  }

  var ADDLAB = { nexi: 'Nexi (mascot)', person: 'Person / cut-out photo', shot: 'Screenshot', img: 'Image', phone: 'Phone mockup', record: 'Odoo record card', flow: 'Workflow (from website)', apps: 'Odoo app cloud',
    pill: 'Handwritten pill', chip: 'Step chip', note: 'Handwritten note', bubble: 'Speech bubble', text: 'Free text', icon: 'TechNext icon', odoo: 'Odoo app icon',
    burst: 'Burst rays', glow: 'Glow', sphere: 'Sphere', halftone: 'Halftone dots', scan: 'AI scan beam', sparkles: 'Sparkles', storm: 'Storm cloud', speed: 'Speed lines', confetti: 'Confetti', arrow: 'Hand-drawn arrow', nosignal: 'No-signal badge' };
  var DEFAULTS = {
    nexi: { pose: 'wave', x: 60, y: 540, w: 400, z: 16 }, person: { x: 560, y: 400, w: 460, z: 14 }, shot: { x: 140, y: 470, w: 800, z: 12, frame: 'browser' }, img: { x: 300, y: 450, w: 480, z: 12 },
    phone: { x: 380, y: 450, w: 330, z: 12, rot: -4 },
    record: { x: 480, y: 450, w: 540, z: 12, app: 'accountant', title: 'Vendor bill', crumb: 'Accounting · Draft', status: 'Draft', rows: [['Vendor', 'Sample Supplier', 'ai'], ['Total', 'S$ 1,000.00', 'ai']], btn: 'Approve' },
    flow: { x: 70, y: 410, z: 12, from: 'industry:retail', cols: 3, nodeW: 270, nodeH: 200, gapX: 65, gapY: 50 },
    apps: { x: 120, y: 470, w: 840, z: 12, cols: 6, list: ['crm:CRM', 'sale:Sales', 'accountant:Accounting', 'stock:Inventory', 'point_of_sale:POS', 'website:Website'] },
    pill: { x: 80, y: 600, z: 18, text: 'Quote it', rot: -4 }, chip: { x: 640, y: 820, z: 18, icon: 'check', tone: 'ok', text: 'Done in one click' },
    note: { x: 120, y: 900, z: 20, text: 'handwritten note', rot: -3 }, bubble: { x: 80, y: 460, z: 20, text: 'Hello!' }, text: { x: 80, y: 900, w: 600, z: 20, text: 'Your text', size: 40 },
    icon: { x: 880, y: 500, w: 110, z: 14, name: 'sparkle' }, odoo: { x: 880, y: 500, w: 110, z: 14, app: 'accountant' },
    burst: { x: 240, y: 420, w: 600, z: 2 }, glow: { x: 240, y: 440, w: 600, z: 2 }, sphere: { x: 940, y: 640, w: 60, z: 6 }, halftone: { x: 600, y: 420, w: 500, z: 2 },
    scan: { x: 480, y: 560, w: 540, z: 14 }, sparkles: { x: 880, y: 420, w: 120, z: 20 }, storm: { x: 700, y: 430, w: 290, z: 14 }, speed: { x: 60, y: 520, w: 260, z: 8 },
    confetti: { x: 140, y: 380, w: 800, z: 20 }, arrow: { x: 480, y: 700, w: 130, z: 17, kind: 'right' }, nosignal: { x: 680, y: 620, w: 120, z: 16 }
  };

  document.addEventListener('input', function (e) {
    var t = e.target; if (!st.id || !t.closest('#insp')) return;
    if (t.id === 'ljson' || t.type === 'file') return;
    var v = t.type === 'checkbox' ? t.checked : t.value;
    if (t.dataset.t === 'num') v = v === '' ? null : +v;
    if (t.dataset.t === 'list') v = v.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var soft = t.tagName === 'TEXTAREA' || t.type === 'text';
    if (t.dataset.c) change(function (d) { d.copy = d.copy || {}; if (v === '' || v === null || v === false) delete d.copy[t.dataset.c]; else d.copy[t.dataset.c] = v; }, { noHist: soft && inputBurst() });
    else if (t.dataset.d) change(function (d) { if (v === '' && t.dataset.d !== 'ground') delete d[t.dataset.d]; else d[t.dataset.d] = v === 'light' && t.dataset.d === 'bg' ? undefined : v; if (t.dataset.d === 'cat') renderRail(); }, { noHist: soft && inputBurst() });
    else if (t.dataset.cta) change(function (d) { d.cta = d.cta || {}; d.cta[t.dataset.cta] = v; if (!d.cta.text && !d.cta.btn) delete d.cta; }, { noHist: soft && inputBurst() });
    else if (t.dataset.k) change(function (d) {
      var L = d.layers[st.sel], k = t.dataset.k;
      if (k === 'src' && v === '(embedded image)') return;
      if (v === '' || v === null || v === false) delete L[k]; else L[k] = v;
      if (k === 'text' || k === 'title') { var r = $('.lrow.on .tx'); if (r) r.textContent = layerLabel(L); }
    }, { noHist: soft && inputBurst() });
  });
  function inputBurst() { var now = Date.now(), b = now - (inputBurst.t || 0) < 1200; inputBurst.t = now; return b; }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.img) readImage(t.files[0], function (url) { change(function (d) { d.layers[st.sel][t.dataset.img] = url; }, { insp: true }); });
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button,[data-li],[data-cat],[data-open]'); if (!t) return;
    if (t.dataset.cat) { st.cat = t.dataset.cat; showGallery(); return; }
    if (t.dataset.open) { openDrip(t.dataset.open); return; }
    if (t.dataset.new) { openTemplates(); return; }
    if (t.dataset.quick) { openTemplates(t.dataset.quick); return; }
    if (t.dataset.fmt) { change(function (d) { if (t.dataset.fmt === '1:1') delete d.format; else d.format = t.dataset.fmt; }, { now: true, insp: true }); return; }
    if (t.dataset.clear) { change(function (d) { delete d.layers[st.sel][t.dataset.clear]; }, { insp: true }); return; }
    if (t.dataset.lact) {
      var i = +t.closest('[data-li]').dataset.li, act = t.dataset.lact;
      change(function (d) {
        var Ls = d.layers;
        if (act === 'hide') Ls[i].hide = !Ls[i].hide || undefined;
        if (act === 'up' && i > 0) { Ls.splice(i - 1, 0, Ls.splice(i, 1)[0]); st.sel = i - 1; }
        if (act === 'down' && i < Ls.length - 1) { Ls.splice(i + 1, 0, Ls.splice(i, 1)[0]); st.sel = i + 1; }
        if (act === 'copy') { var cp = clone(Ls[i]); cp.x = (cp.x || 0) + 30; if (cp.b != null) cp.b -= 30; else cp.y = (cp.y || 0) + 30; Ls.splice(i + 1, 0, cp); st.sel = i + 1; }
        if (act === 'rm') { Ls.splice(i, 1); st.sel = -1; }
      }, { insp: true, now: true });
      return;
    }
    if (t.dataset.li != null && !e.target.closest('button')) { st.sel = +t.dataset.li; drawCanvas(); renderInspector(); return; }
    switch (t.id) {
      case 'back': st.cat = st.cat === 'all' ? 'all' : (cur() ? cur().cat : st.cat); showGallery(); break;
      case 'addlayer': change(function (d) { var ty = $('#addtype').value, L = clone(DEFAULTS[ty]); L.type = ty; d.layers = d.layers || []; d.layers.push(L); st.sel = d.layers.length - 1; }, { insp: true, now: true }); break;
      case 'ljson-apply':
        try { var obj = JSON.parse($('#ljson').value), old = cur().layers[st.sel]; if (obj.src === '(embedded image)') obj.src = old.src; change(function (d) { d.layers[st.sel] = obj; }, { insp: true, now: true }); }
        catch (err) { toast('That JSON has an error: ' + err.message); }
        break;
      case 'undo': undo(); break;
      case 'dup': var cp = clone(cur()); cp.id = uid(cp.id); cp.name = (cp.name || cp.id) + ' (copy)'; lib.push(cp); persist(); openDrip(cp.id); toast('Duplicated'); break;
      case 'del': confirmDelete(); break;
      case 'del-yes': var gone = cur(); lib.splice(lib.indexOf(gone), 1); persist(); st.cat = gone.cat; showGallery(); toast('Deleted ' + (gone.name || gone.id)); break;
      case 'del-no': var c = $('#confirm'); if (c) c.remove(); break;
      case 'png': exportPng(1); break;
      case 'png2': exportPng(2); break;
      case 'save': saveLibrary(); break;
      case 'reset': confirmReset(); break;
      case 'reset-yes': try { localStorage.removeItem(KEY); localStorage.removeItem(KEY_CATS); } catch (err) {} location.reload(); break;
      case 'reset-no': closeDlg(); break;
    }
  });
  function confirmDelete() {
    if ($('#confirm')) return;
    var bar = $('.ed-bar'), c = document.createElement('div'); c.id = 'confirm'; c.className = 'confirm'; c.style.flexBasis = '100%';
    c.innerHTML = 'Delete "' + esc(cur().name || cur().id) + '" from this browser\'s library? Save library afterwards to make it permanent. <button class="btn sm danger" id="del-yes">Delete</button><button class="btn sm" id="del-no">Keep it</button>';
    bar.appendChild(c);
  }

  /* ---------- export ---------- */
  /* In-browser export (used online, where there is no studio server): the drip is drawn through an
     SVG foreignObject with the real drip.css, fonts and images embedded as data URIs, then rasterised. */
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
        var ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, W * scale, H * scale);
        return new Promise(function (res, rej) { cv.toBlob(function (b) { b ? res(b) : rej(new Error('The browser could not create the PNG')); }, 'image/png'); });
      });
    }).then(function (b) { host.remove(); return b; }, function (e) { host.remove(); throw e; });
  }
  window.TNStudioRender = clientRender;

  function exportPng(scale) {
    var d = cur();
    var fname = d.id + (scale === 2 ? '@2x' : '') + (d.format === '4:5' ? '-4x5' : '') + '.png';
    if (!SERVER && location.protocol !== 'file:') {
      toast('Rendering ' + (d.name || d.id) + '…');
      clientRender(d, scale).then(function (b) { var url = URL.createObjectURL(b); download(fname, url); setTimeout(function () { URL.revokeObjectURL(url); }, 4000); toast('Downloaded ' + fname); })
        .catch(function (err) { toast('Export failed: ' + (err && err.message || err)); });
      return;
    }
    if (!SERVER) {
      openDlg('<h2>Export needs the studio server</h2><p>PNG files are rendered by headless Chrome through a small local server, so they match the batch export pixel for pixel.</p>' +
        '<p class="help" style="font-size:13.5px">Double-click <code>Open Drip Studio.bat</code> in the studio folder (it opens <code>http://localhost:8807</code>), or export every drip at once with <code>python tools/render.py</code>. Your edits are kept in this browser.</p>' +
        '<div class="dlg-foot"><button class="btn primary" id="reset-no">OK</button></div>');
      return;
    }
    toast('Rendering ' + (d.name || d.id) + '…');
    var saved = '';
    fetch('api/render', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ drip: d, scale: scale }) })
      .then(function (r) { if (!r.ok) return r.json().then(function (j) { throw new Error(j.error || r.status); }); saved = r.headers.get('X-Saved-To') || ''; return r.blob(); })
      .then(function (b) { var url = URL.createObjectURL(b); download(saved.split('/').pop() || d.id + '.png', url); setTimeout(function () { URL.revokeObjectURL(url); }, 4000); toast('Saved ' + saved); })
      .catch(function (err) { toast('Export failed: ' + err.message); });
  }
  function saveLibrary() {
    var head = '/* TechNext Drip Studio — the drip library. Saved from the studio on ' + new Date().toISOString().slice(0, 10) + '.\n' +
      '   Headline markup:  *blue*   ~yellow brush underline~   ==yellow marker==   [[white on blue]]   {odoo}purple{/odoo}   | = line break\n' +
      '   Layer fields (canvas px, 1080 wide): x, y (or b = from the bottom), w, rot, z, op, flip, hide. See README.md for every layer type.\n' +
      '   Content rules (from technext.asia): "Odoo Partner", never "Certified"; approved figures only (10+ countries, 11+ enterprise clients, 4 AI disciplines). */\n\n';
    var js = head + 'window.CATEGORIES = ' + JSON.stringify(cats, null, 2) + ';\n\nwindow.DRIPS = ' + JSON.stringify(lib, null, 2) + ';\n';
    if (SERVER) {
      fetch('api/library', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ js: js }) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); fileLib = clone(lib); markDirty(); if (st.id) renderInspector(); else showGallery(); toast('Saved drips.js (the previous version is in backups/)'); })
        .catch(function (err) { toast('Could not save: ' + err.message); });
      return;
    }
    var url = URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
    download('drips.js', url); setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    toast('Downloaded drips.js: put it in the studio folder (and the GitHub repo) to share your drips');
  }
  function confirmReset() {
    openDlg('<h2>Discard browser edits?</h2><p>This drops every change kept in this browser and reloads the library from drips.js.</p><div class="dlg-foot"><button class="btn" id="reset-no">Cancel</button><button class="btn danger" id="reset-yes">Discard edits</button></div>');
  }
  function openDlg(html) { var d = $('#dlg'); d.innerHTML = '<div class="dlg-card" role="dialog" aria-modal="true">' + html + '</div>'; d.hidden = false; var f = $('button,select,input', d); if (f) f.focus(); }
  function closeDlg() { $('#dlg').hidden = true; $('#dlg').innerHTML = ''; }
  $('#dlg').addEventListener('click', function (e) { if (e.target.id === 'dlg') closeDlg(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#dlg').hidden) closeDlg(); });

  /* ---------- templates ---------- */
  var TPL = {
    workflow: { name: 'Industry workflow', desc: 'The six-step Odoo flow for an industry, straight from technext.asia.', needs: 'industry' },
    beforeafter: { name: 'Before / after', desc: 'Three old habits struck out, and what Odoo does instead (from the industry page).', needs: 'industry' },
    odoo20: { name: 'Odoo 20 feature', desc: 'One new Odoo 20 feature from the site\'s release summary, with a phone and callouts.', needs: 'o20' },
    nexi: { name: 'Nexi explains', desc: 'Nexi presents three steps on the right. Good for AI and how-it-works posts.' },
    person: { name: 'Person + callouts', desc: 'Drop in an exaggerated cut-out, with a burst and handwritten pills.' },
    apps: { name: 'Odoo app cloud', desc: 'A grid of official Odoo app icons under one headline.' },
    blank: { name: 'Blank', desc: 'Logo, badge, headline and blobs. Add layers yourself.' }
  };
  var o20cards = []; (C.odoo20 || []).forEach(function (a) { (a[2] || []).forEach(function (c) { if (c[0] !== 's') o20cards.push({ area: a[1], tag: c[0], t: c[1], d: c[2] }); }); });
  function openTemplates(pre) {
    var cat = cats.filter(function (x) { return x.id === st.cat; })[0];
    var h = '<h2>New drip</h2><p>Pick a starting layout. Everything stays editable.</p><div class="tpls">' +
      Object.keys(TPL).map(function (k) { return '<button class="tpl' + (k === (pre || 'workflow') ? ' on' : '') + '" data-tpl="' + k + '" type="button"><b>' + esc(TPL[k].name) + '</b><span>' + esc(TPL[k].desc) + '</span></button>'; }).join('') + '</div>' +
      '<label class="f" id="t-ind-f"><span>Industry</span><select id="t-ind">' + opts(INDUSTRIES, cat && cat.industry || 'fnb', INDUSTRIES.map(indName)) + '</select></label>' +
      '<label class="f" id="t-o20-f"><span>Odoo 20 feature</span><select id="t-o20">' + opts(o20cards.map(function (c, i) { return i; }), 0, o20cards.map(function (c) { return c.area + ' · ' + c.t; })) + '</select></label>' +
      '<div class="dlg-foot"><button class="btn" id="reset-no" type="button">Cancel</button><button class="btn primary" id="t-go" type="button">Create drip</button></div>';
    openDlg(h);
    var pick = pre || 'workflow';
    var sync = function () { $$('.tpl').forEach(function (b) { b.classList.toggle('on', b.dataset.tpl === pick); }); $('#t-ind-f').hidden = TPL[pick].needs !== 'industry'; $('#t-o20-f').hidden = TPL[pick].needs !== 'o20'; };
    sync();
    $$('.tpl').forEach(function (b) { b.addEventListener('click', function () { pick = b.dataset.tpl; sync(); }); });
    $('#t-go').addEventListener('click', function () {
      var d = build(pick, $('#t-ind').value, o20cards[+$('#t-o20').value]);
      lib.push(d); persist(); closeDlg(); openDrip(d.id); toast('Created "' + d.name + '"');
    });
  }
  function headFrom(title) {
    var t = title.replace(/\.$/, ''), i = t.lastIndexOf(', ');
    return i > 0 ? t.slice(0, i + 1) + '|*' + t.slice(i + 2) + '.*' : t + '.';
  }
  function build(kind, indKey, o20) {
    var ind = C.industries[indKey] || {}, catId = cats.some(function (c) { return c.id === indKey; }) ? indKey : (st.cat === 'all' ? 'apps' : st.cat);
    var base = { id: '', cat: st.cat === 'all' ? 'apps' : st.cat, name: '', badge: 'ready', ground: 'blobs', copy: {}, layers: [] };
    if (kind === 'workflow') {
      base.cat = catId; base.name = ind.name + ' · workflow'; base.ground = 'blobs-low'; base.source = 'technext.asia/industries — ' + ind.name + ' flow';
      base.copy = { head: headFrom(ind.flow_title || 'From first step to the books, in one system.'), size: 'm', sub: 'Six steps ' + (ind.noun || 'teams') + ' run every day, and the Odoo app behind each one.' };
      base.layers = [{ type: 'flow', x: 70, y: 410, z: 12, from: 'industry:' + indKey, cols: 3, nodeW: 270, nodeH: 200, gapX: 65, gapY: 50, layout: 'snake' },
        { type: 'sparkles', x: 906, y: 330, w: 120, z: 20 }, { type: 'sphere', x: 44, y: 330, w: 46, z: 6 }];
      var ba = (ind.ba || []).map(function (r) { return [r[1].split(/[,.]/)[0], r[2].split(/[,.]/)[0]]; }).sort(function (a, b) { return (a[0] + a[1]).length - (b[0] + b[1]).length; })[0];
      if (ba && ba[0].length <= 24 && ba[1].length <= 26) base.layers.push({ type: 'note', x: 470 - ba[0].length * 19, y: 906, rot: -4, z: 20, text: ba[0].toLowerCase(), variant: 'red strike', size: 44 },
        { type: 'arrow', x: 486, y: 890, w: 100, rot: 8, z: 20, kind: 'right' }, { type: 'note', x: 606, y: 900, rot: -3, z: 20, text: ba[1].toLowerCase(), size: 44 });
    } else if (kind === 'beforeafter') {
      base.cat = catId; base.name = ind.name + ' · before and after'; base.source = 'technext.asia/industries — ' + ind.name + ' before/after table';
      base.copy = { head: 'Still doing it *the old way?*', sub: 'What changes for ' + (ind.noun || 'teams') + ' when everything runs in one Odoo.' };
      (ind.ba || []).slice(0, 3).forEach(function (r, i) {
        base.layers.push({ type: 'text', x: 70, y: 430 + i * 170, w: 940, z: 12, text: r[0], font: 'display', size: 30, weight: 800, color: '#1E4691' });
        base.layers.push({ type: 'note', x: 70, y: 476 + i * 170, z: 14, text: r[1], variant: 'red strike', size: 38, rot: -1.5 });
        base.layers.push({ type: 'chip', x: 560, y: 470 + i * 170, z: 16, icon: 'check', tone: 'ok', text: r[2], rot: 1 });
      });
    } else if (kind === 'odoo20') {
      base.cat = 'odoo20'; base.badge = 'o20'; base.name = 'Odoo 20 · ' + o20.t; base.source = 'technext.asia/blog/odoo-20-whats-new — ' + o20.area;
      base.copy = { head: o20.t.replace(/\.$/, '') + '.', size: o20.t.length > 44 ? 's' : 'm', sub: o20.d };
      base.layers = [{ type: 'glow', x: 250, y: 470, w: 600, z: 2 }, { type: 'shot', x: 170, y: 470, w: 740, z: 12, frame: 'browser' },
        { type: 'pill', x: 60, y: 560, rot: -5, z: 18, text: 'New in Odoo 20' }, { type: 'sparkles', x: 900, y: 440, w: 110, z: 19 }, { type: 'sphere', x: 960, y: 700, w: 56, z: 6 }];
    } else if (kind === 'nexi') {
      base.name = 'Nexi explains'; base.copy = { head: 'Three steps. *Zero retyping.*', sub: 'Say what the post is about in one short line.' };
      base.layers = [{ type: 'burst', x: -60, y: 470, w: 620, z: 2 }, { type: 'nexi', x: 40, y: 520, w: 430, z: 16, pose: 'present' },
        { type: 'chip', x: 520, y: 520, z: 18, icon: 'spark', text: 'Step one' }, { type: 'chip', x: 560, y: 640, z: 18, icon: 'search', text: 'Step two' },
        { type: 'chip', x: 520, y: 760, z: 18, icon: 'check', tone: 'ok', text: 'Step three' }, { type: 'sparkles', x: 420, y: 470, w: 110, z: 20 }];
    } else if (kind === 'person') {
      base.name = 'Person + callouts'; base.copy = { head: 'Your headline|*goes here.*', align: 'left', sub: 'One line on what changes for the customer.' };
      base.layers = [{ type: 'burst', x: 420, y: 330, w: 720, z: 2, variant: 'yellow' }, { type: 'person', x: 520, y: 360, w: 520, z: 14 },
        { type: 'pill', x: 70, y: 640, rot: -4, z: 18, text: 'Quote it' }, { type: 'pill', x: 110, y: 780, rot: 3, z: 18, text: 'Confirm it' }, { type: 'pill', x: 70, y: 920, rot: -2, z: 18, text: 'Get paid' }];
    } else if (kind === 'apps') {
      base.name = 'Odoo app cloud'; base.copy = { head: 'All your business on *one platform.*', sub: 'Every Odoo app shares one database, so nothing is typed twice.' };
      base.layers = [{ type: 'apps', x: 110, y: 470, w: 860, z: 12, cols: 6, list: ['crm:CRM', 'sale:Sales', 'accountant:Accounting', 'stock:Inventory', 'purchase:Purchase', 'mrp:Manufacturing', 'point_of_sale:Point of Sale', 'website:Website', 'project:Project', 'planning:Planning', 'helpdesk:Helpdesk', 'hr:Employees'] },
        { type: 'nexi', x: 800, y: 760, w: 240, z: 16, pose: 'wave' }, { type: 'sparkles', x: 80, y: 420, w: 100, z: 20 }];
    } else {
      base.name = 'New drip'; base.copy = { head: 'Your headline, *in blue.*', sub: 'One supporting line.' };
    }
    base.id = uid(base.name);
    return base;
  }

  /* ---------- boot ---------- */
  var SERVER = false;
  function notice(t) { var n = $('#notice'); n.hidden = !t; n.textContent = t || ''; }
  if (location.protocol === 'file:') notice('Opened as a file: editing works; PNG export and saving need "Open Drip Studio.bat"');
  else fetch('api/ping', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    .then(function (j) { SERVER = !!(j && j.ok); if (!SERVER) notice('Online copy: edits stay in this browser, and Save library downloads drips.js'); });
  markDirty();
  var hash = location.hash.slice(1);
  if (hash && lib.some(function (d) { return d.id === hash; })) openDrip(hash); else showGallery();
})();
