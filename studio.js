/* TechNext Drip Studio — the editor (v3).
   Every change is saved automatically (the claude.ai hub: shared database; elsewhere: this browser).
   Edits like a slide or website builder: click to select, Shift-click or drag a box to select several,
   drag to move with smart guides, corner to resize, top dot to rotate, double-click text to type in place,
   right-click for more. The Design panel restyles a whole post (background, camera, layout, logo). */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {}, R = window.TNDrip, AI = window.TNAI, S = window.TNStore, K = window.TNCompose, ST = window.TNStarters;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var esc = R.esc;

  var POSES = K.POSES;
  var ODOO = Object.keys(C.apps || {}).concat(['ai_app', 'industry_fsm', 'pos_restaurant', 'appointment', 'whatsapp', 'mail']).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
  var KIT = ['check', 'spark', 'search', 'sync', 'wifiOff', 'cloudOff', 'cloudOk'];
  var ICONS = KIT.concat(Object.keys(C.icons || {}).sort());
  var INDUSTRIES = Object.keys(C.industries || {});
  var indName = function (k) { var i = C.industries[k]; return i ? i.name : k; };
  var SITES = Object.keys(C.sites || {});
  var VIEWS = ['form', 'list', 'kanban', 'dashboard', 'planning', 'pos', 'kds', 'apps', 'discuss'];

  var lib = [], cats = [], usage = [], fileLib = clone(window.DRIPS || []);
  var st = { cat: 'all', id: null, sel: -1, multi: [], zoom: 1 };
  var hist = [], future = [], SERVER = false, clip = null;
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
  function sparkIcon() { return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.6 4.6 2.4 7.1 7 8-4.6.9-6.4 3.4-7 8-.6-4.6-2.4-7.1-7-8 4.6-.9 6.4-3.4 7-8Z"/></svg>'; }

  /* ---------- saving (automatic) ---------- */
  var saveT = {}, dirtyAt = {};
  function setStatus(kind) {
    var el = $('#savestate'); if (!el) return;
    el.dataset.kind = kind;
    el.textContent = kind === 'saving' ? 'Saving…' : kind === 'error' ? 'Not saved: check your connection' : kind === 'readonly' ? 'View only' : S.mode !== 'hub' ? 'Saved in this browser' : 'All changes saved';
  }
  S.on('saving', function () { setStatus('saving'); });
  S.on('saved', function () { if (!S.pending()) setStatus('saved'); });
  S.on('saveError', function (e) { setStatus(e && e.code === 'invalid_argument' ? 'readonly' : 'error'); if (e && e.code === 'quota') toast('This browser is out of storage: remove large embedded images'); });
  function queueSave(d) {
    if (!d) return;
    dirtyAt[d.id] = Date.now(); setStatus('saving');
    clearTimeout(saveT[d.id]);
    saveT[d.id] = setTimeout(function () { S.saveDrip(d, lib); }, 600);
  }
  function saveNow(d) { clearTimeout(saveT[d.id]); dirtyAt[d.id] = Date.now(); return S.saveDrip(d, lib); }
  function removeDrip(d) { lib.splice(lib.indexOf(d), 1); S.deleteDrip(d.id, lib); }
  function stripMeta(d) { var c = clone(d); delete c.updatedAt; return c; }
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

  /* ---------- history ---------- */
  function snapshot() { var d = cur(); if (!d) return; hist.push(JSON.stringify(d)); if (hist.length > 80) hist.shift(); future = []; }
  function replaceCur(obj) { var i = lib.indexOf(cur()); lib[i] = obj; }
  function undo() { if (!hist.length) { toast('Nothing to undo'); return; } future.push(JSON.stringify(cur())); replaceCur(JSON.parse(hist.pop())); afterEdit(); }
  function redo() { if (!future.length) { toast('Nothing to redo'); return; } hist.push(JSON.stringify(cur())); replaceCur(JSON.parse(future.pop())); afterEdit(); }
  function afterEdit() { queueSave(cur()); if (st.sel !== 'copy' && (!cur().layers || !cur().layers[st.sel])) st.sel = -1; st.multi = st.multi.filter(function (i) { return cur().layers[i]; }); drawCanvas(); renderInspector(); }
  var redrawT;
  function change(fn, o) {
    o = o || {};
    if (!o.noHist) snapshot();
    fn(cur()); queueSave(cur());
    clearTimeout(redrawT);
    var go = function () { drawCanvas(); if (o.insp) renderInspector(); };
    if (o.now) go(); else redrawT = setTimeout(go, 40);
  }

  /* ---------- element library ---------- */
  var SAMPLE_FORM = { app: 'sale', view: 'form', crumbs: ['Quotations', 'S00042'], status: ['Quotation', 'Quotation Sent', 'Sales Order'], statusAt: 1, buttons: ['Confirm', 'Send by Email'], record: 'S00042', fields: [['Customer', 'Sample Trading Pte Ltd'], ['Validity', '15 Oct 2026'], ['Payment terms', '30 days'], ['Salesperson', 'Mei Ling T.']], lines: [['Office chair', '10', 'S$ 180.00', 'S$ 1,800.00'], ['Standing desk', '2', 'S$ 620.00', 'S$ 1,240.00']], total: 'S$ 3,313.60' };
  var PRESET = {
    'win-form': ['window', SAMPLE_FORM],
    'win-list': ['window', { app: 'account', view: 'list', crumbs: ['Invoices'], cols: ['Number', 'Customer', 'Due', 'Total', 'Status'], rows: [['INV/2026/0141', 'Sample Trading', '30 Sep', 'S$ 3,313.60', 'Paid'], ['INV/2026/0142', 'Sample Foods', '2 Oct', 'S$ 860.00', 'Sent'], ['INV/2026/0143', 'Sample Clinic', '20 Sep', 'S$ 1,420.00', 'Late'], ['INV/2026/0144', 'Sample Retail', '9 Oct', 'S$ 2,050.00', 'Draft']], highlight: 2 }],
    'win-kanban': ['window', { app: 'crm', view: 'kanban', crumbs: ['Pipeline'], menus: ['Sales', 'Leads', 'Reporting'], stages: [['New', [['Office fit-out', 'Sample Build Co', 'S$ 18,000', 'KL']]], ['Qualified', [['Warehouse barcodes', 'Sample Logistics', 'S$ 12,500', 'RS']]], ['Proposition', [['Online store', 'Sample Retail', 'S$ 15,800', 'AN']]], ['Won', [['Accounting', 'Sample Foods', 'S$ 11,000', 'LT']]]], highlight: ['2.0'] }],
    'win-dash': ['window', { app: 'spreadsheet_dashboard', view: 'dashboard', appLabel: 'Dashboards', crumbs: ['Dashboards', 'Sales'], kpis: [['Revenue', 'S$ 84k', '+12%'], ['Orders', '312', '+8%'], ['Avg. order', 'S$ 269']], chart: { kind: 'line', title: 'Revenue by week', data: [['W36', 18], ['W37', 21], ['W38', 19], ['W39', 26]] } }],
    'win-plan': ['window', { app: 'planning', view: 'planning', crumbs: ['Planning', 'Schedule'], days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], rows: [['Ravi S.', [[0, 2, 'Service'], [3, 1, 'Install']]], ['Mei Ling T.', [[1, 2, 'Repair']]], ['Daniel K.', [[0, 1, 'Survey'], [2, 3, 'Maintenance']]]] }],
    'win-pos': ['window', { app: 'point_of_sale', view: 'pos', table: 'Order 0042', products: [['Linen shirt', 'S$ 49'], ['Canvas tote', 'S$ 29'], ['Silk scarf', 'S$ 39'], ['Cap', 'S$ 19'], ['Socks', 'S$ 9'], ['Belt', 'S$ 35']], order: [['Linen shirt', '1', 'S$ 49', 'S$ 49.00'], ['Canvas tote', '2', 'S$ 29', 'S$ 58.00']], total: 'S$ 107.00', btn: 'Payment' }],
    'win-kds': ['window', { app: 'pos_restaurant', view: 'kds', frame: false, appLabel: 'Kitchen Display', tickets: [['Table 12', [['Laksa', '2'], ['Chicken rice', '1']], 'Cooking', '2 min'], ['Table 7', [['Satay (10)', '1']], 'Ready', '6 min']] }],
    'win-apps': ['window', { app: 'sale', view: 'apps', frame: false }],
    'win-discuss': ['window', { app: 'mail', view: 'discuss', appLabel: 'Discuss', crumbs: ['Discuss'], msgs: [['Mei Ling T.', 'Can someone check the P00088 bill?'], ['Odoo AI', 'Done: the bill matches P00088 and is ready to approve.', 'BILL/2026/0311.pdf']] }],
    'ph-form': ['ophone', clone(SAMPLE_FORM)],
    'g-bar': ['graph', { kind: 'bar', title: 'Orders by day', data: [['Mon', 32], ['Tue', 41], ['Wed', 38], ['Thu', 52], ['Fri', 61]], highlight: 4 }],
    'g-line': ['graph', { kind: 'line', title: 'Revenue by week', data: [['W36', 18], ['W37', 21], ['W38', 19], ['W39', 26], ['W40', 31]], unit: 'k' }],
    'g-donut': ['graph', { kind: 'donut', title: 'Sales by channel', data: [['Store', 46], ['Online', 34], ['Wholesale', 20]], center: '100%', centerLabel: 'of sales', unit: '%' }],
    'g-funnel': ['graph', { kind: 'funnel', title: 'Pipeline', data: [['Leads', 48], ['Qualified', 26], ['Proposition', 14], ['Won', 6]] }],
    'g-prog': ['graph', { kind: 'progress', title: 'Rollout progress', data: [['Accounting', 100], ['Sales', 80], ['Inventory', 55]], unit: '%' }],
    kpis: ['kpis', { items: [['Orders today', '312', '+8%', 'sale'], ['Stock value', 'S$ 84k', '', 'stock'], ['Overdue', '3', '-2', 'account']] }],
    timeline: ['timeline', { title: 'One order, one day', items: [['09:10', 'Order confirmed', 'sale', 'S00118'], ['11:30', 'Picked and packed', 'stock', 'WH/OUT/0231'], ['15:00', 'Delivered', 'stock', 'Signed on the phone'], ['15:02', 'Invoice sent', 'account', 'INV/2026/0142']], hot: 3 }],
    steps: ['steps', { dir: 'h', items: [['sale', 'Quote', 'Sent from a template'], ['stock', 'Deliver', 'Picked and shipped'], ['account', 'Invoice', 'Paid online']], hot: 1 }],
    chat: ['chat', { channel: 'whatsapp', title: 'Sample Store', msgs: [['in', 'Is my order out for delivery?'], ['bot', 'Yes, it arrives today before 6pm.']] }],
    receipt: ['receipt', { vendor: 'Sample Supplier Pte Ltd', doc: 'TAX INVOICE', lines: [['Item one', '120.00'], ['GST 9%', '10.80']], total: 'S$ 130.80', stamp: 'PAID' }],
    notif: ['notif', { app: 'account', title: 'Invoice paid', text: 'S$ 3,313.60 received online', time: 'now' }],
    stat: ['stat', { value: '10+', label: 'countries served' }],
    route: ['route', { stops: [['Tampines', '09:00'], ['Bedok', '10:30'], ['Katong', '13:00']], hot: 1 }],
    link: ['link', { x1: 300, y1: 600, x2: 700, y2: 760, label: 'Handed over', bend: .25 }]
  };
  var ELEMENTS = [
    ['Odoo screens', [['win-form', 'Form (quotation, bill…)'], ['win-list', 'List (invoices…)'], ['win-kanban', 'Kanban (pipeline)'], ['win-dash', 'Dashboard'], ['win-plan', 'Planning board'], ['win-pos', 'Point of Sale'], ['win-kds', 'Kitchen display'], ['win-apps', 'App home screen'], ['win-discuss', 'Discuss / Odoo AI'], ['ph-form', 'Phone screen']]],
    ['Charts & numbers', [['g-bar', 'Bar chart'], ['g-line', 'Line chart'], ['g-donut', 'Donut chart'], ['g-funnel', 'Funnel'], ['g-prog', 'Progress bars'], ['kpis', 'KPI tiles'], ['stat', 'Big number']]],
    ['Workflow', [['steps', 'Steps across apps'], ['timeline', 'Timeline'], ['link', 'Arrow with label'], ['appflow', 'How a record moves'], ['flow', 'Industry workflow (site)'], ['ba', 'Before / after (site)'], ['phases', 'Rollout phases (site)'], ['chart', 'Industry dashboard (site)']]],
    ['Cards', [['record', 'Record card'], ['checklist', 'Checklist'], ['notif', 'Notification'], ['chat', 'Chat (WhatsApp, web)'], ['receipt', 'Paper invoice'], ['route', 'Delivery route'], ['orbit', 'App orbit'], ['apps', 'App cloud']]],
    ['Website design', [['devices', 'Laptop + phone (our sites)'], ['site', 'Website mockup'], ['code', 'Code window'], ['palette', 'Colour palette'], ['wireframe', 'Wireframe'], ['serp', 'Google result'], ['gauge', 'Score gauge'], ['cursor', 'Cursor']]],
    ['Nexi', POSES.map(function (p) { return ['nexi', p]; })],
    ['Photos', [['person', 'Person cut-out'], ['shot', 'Screenshot'], ['img', 'Image']]],
    ['Callouts', [['pill', 'Handwritten pill'], ['chip', 'Step chip'], ['note', 'Handwritten note'], ['bubble', 'Speech bubble'], ['text', 'Free text'], ['arrow', 'Hand-drawn arrow'], ['icon', 'TechNext icon'], ['odoo', 'Odoo app icon']]],
    ['Effects', [['glow', 'Glow'], ['sparkles', 'Sparkles'], ['sphere', 'Sphere'], ['burst', 'Burst rays'], ['confetti', 'Confetti'], ['halftone', 'Halftone'], ['scan', 'AI scan beam'], ['storm', 'Storm cloud'], ['speed', 'Speed lines'], ['nosignal', 'No-signal badge']]]
  ];
  var DEFAULTS = {
    nexi: { pose: 'wave', x: 330, y: 470, w: 300 }, person: { x: 540, y: 380, w: 480 }, shot: { x: 140, y: 470, w: 800, frame: 'browser' }, img: { x: 300, y: 450, w: 480 },
    record: { x: 480, y: 450, w: 540, app: 'accountant', title: 'Vendor bill', crumb: 'Accounting · Draft', status: 'Draft', rows: [['Vendor', 'Sample Supplier', 'ai'], ['Total', 'S$ 1,000.00', 'ai']], btn: 'Approve' },
    flow: { x: 70, y: 410, from: 'industry:retail', cols: 3, nodeW: 270, nodeH: 200, gapX: 65, gapY: 50 },
    ba: { x: 70, y: 432, w: 940, from: 'industry:retail' }, phases: { x: 70, y: 446, w: 940, from: 'industry:retail' }, chart: { x: 90, y: 436, w: 900, from: 'industry:retail' },
    appflow: { x: 70, y: 460, w: 940, app: 'sale' }, orbit: { x: 290, y: 424, w: 500 }, checklist: { x: 80, y: 440, w: 620, title: 'What you get', items: ['First point', 'Second point', 'Third point'] },
    apps: { x: 120, y: 470, w: 840, cols: 6, list: ['crm:CRM', 'sale:Sales', 'accountant:Accounting', 'stock:Inventory', 'point_of_sale:POS', 'website:Website'] },
    devices: { x: 60, y: 444, w: 720, site: 'technext' }, site: { x: 70, y: 450, w: 640 }, code: { x: 612, y: 560, w: 420 }, palette: { x: 110, y: 880, w: 520 },
    wireframe: { x: 560, y: 470, w: 440 }, serp: { x: 110, y: 462, w: 860 }, gauge: { x: 830, y: 820, w: 190 }, cursor: { x: 520, y: 700, w: 64 },
    pill: { x: 80, y: 600, text: 'Quote it', rot: -4 }, chip: { x: 640, y: 820, icon: 'check', tone: 'ok', text: 'Done in one click' },
    note: { x: 120, y: 900, text: 'handwritten note', rot: -3 }, bubble: { x: 80, y: 460, text: 'Hello!' }, text: { x: 80, y: 900, w: 600, text: 'Your text', size: 40 },
    icon: { x: 880, y: 500, w: 110, name: 'sparkle' }, odoo: { x: 880, y: 500, w: 110, app: 'accountant' },
    burst: { x: 240, y: 420, w: 600, z: 2 }, glow: { x: 240, y: 440, w: 600, z: 1 }, sphere: { x: 940, y: 640, w: 60, z: 6 }, halftone: { x: 600, y: 420, w: 500, z: 2 },
    scan: { x: 480, y: 560, w: 540 }, sparkles: { x: 880, y: 420, w: 110 }, storm: { x: 700, y: 430, w: 290 }, speed: { x: 60, y: 520, w: 260, z: 8 },
    confetti: { x: 140, y: 380, w: 800 }, arrow: { x: 480, y: 700, w: 130, kind: 'right' }, nosignal: { x: 680, y: 620, w: 120 }
  };
  var PRESET_W = { window: 700, ophone: 320, graph: 460, kpis: 640, timeline: 480, steps: 800, chat: 420, receipt: 340, notif: 440, stat: 320, route: 440 };

  /* ---------- rail ---------- */
  function renderRail() {
    if (st.id) {
      var h = '<h2>Add to the drip</h2><p class="rail-help">Click to drop it on the canvas, then drag it into place.</p>';
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
    st.id = null; st.sel = -1; st.multi = []; closePop(); closeMenu();
    $('#shell').classList.remove('editing'); $('#insp').hidden = true;
    renderRail();
    var inCat = function (d) { return st.cat === 'all' || (st.cat === 'drafts' ? d.draft : d.cat === st.cat); };
    var list = lib.filter(inCat), drafts = list.filter(function (d) { return d.draft; }), kept = list.filter(function (d) { return !d.draft; });
    var c = catObj(st.cat), ind = c && c.industry && C.industries[c.industry];
    var head = st.cat === 'drafts' ? 'Drafts to review' : c ? c.name : 'All drips';
    var h = '<div class="gallery"><div class="gal-head"><div><h2>' + esc(head) + '</h2><p>' +
      (ind ? 'Workflow on technext.asia: ' + esc(ind.flow_title) : st.cat === 'drafts' ? 'Posts Claude designed. Keep the ones you like; everything is already saved.' : c ? esc(c.group) + ' · ' + list.length + ' drip' + (list.length === 1 ? '' : 's') : lib.length + ' drips across ' + cats.length + ' categories.') +
      '</p></div><span class="sp"></span>' + (S.canWrite ? '<button class="btn" data-gen="1">' + sparkIcon() + 'Generate with Claude</button><button class="btn primary" data-new="1">New drip</button>' : '') + '</div>';
    if (lib.length === 0 && S.mode === 'hub') h += '<div class="empty" style="margin-bottom:18px"><b>This hub is empty.</b> Import the starter drips, or generate new ones with Claude.' + (S.canWrite ? ' <button class="btn sm" id="import-starters">Import the starter drips</button>' : '') + '</div>';
    if (drafts.length && st.cat !== 'drafts') h += '<div class="sec-h"><h3>New from Claude <span class="tag">' + drafts.length + '</span></h3><span class="sp"></span>' + (S.canWrite ? '<button class="btn sm" data-keepall="1">Keep all</button>' : '') + '</div>' + cards(drafts, true);
    if (st.cat === 'drafts') h += cards(drafts, true);
    else h += (drafts.length ? '<div class="sec-h"><h3>Library</h3></div>' : '') + cards(kept, false, true);
    h += (list.length ? '' : '<p class="empty" style="margin-top:18px">Nothing here yet. Start a drip from a starter, or let Claude design a set' + (ind ? ' from the ' + esc(ind.name) + ' content on technext.asia.' : '.') + '</p>') + '</div>';
    $('#main').innerHTML = h;
    list.forEach(function (d) { var box = $('[data-thumb="' + d.id + '"]'); if (!box) return; box.appendChild(R.render(d)); R.fit(box); fitThumb(box); });
    document.fonts.ready.then(function () { $$('[data-thumb]').forEach(function (b) { R.fit(b); }); });
  }
  function cards(list, drafts, withNew) {
    var h = '<div class="grid">';
    list.forEach(function (d) {
      h += '<div class="card"><button class="thumb' + (d.format === '4:5' ? ' r45' : '') + '" data-open="' + esc(d.id) + '" data-thumb="' + esc(d.id) + '" aria-label="Edit ' + esc(d.name || d.id) + '"></button>' +
        '<span class="meta"><b>' + esc(d.name || d.id) + '</b>' + (st.cat === 'all' || st.cat === 'drafts' ? '<span class="tag">' + esc(catName(d.cat)) + '</span>' : '') + '</span>' +
        (drafts && S.canWrite ? '<span class="draft-act"><button class="btn sm primary" data-keep="' + esc(d.id) + '">Keep</button><button class="btn sm" data-open="' + esc(d.id) + '">Edit</button><button class="btn sm danger" data-discard="' + esc(d.id) + '">Discard</button></span>' : '') + '</div>';
    });
    if (withNew && S.canWrite) h += '<div class="card new"><button class="thumb" data-new="1"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>New drip</span></button><span class="meta"><b>Start from a starter</b></span></div>';
    return h + '</div>';
  }
  function fitThumb(box) { var el = box.querySelector('.drip'); if (el) el.style.transform = 'scale(' + (box.clientWidth / 1080) + ')'; }
  new ResizeObserver(function () { $$('[data-thumb]').forEach(fitThumb); if (st.id) { fitCanvas(); placeTools(); } }).observe(document.body);

  /* ---------- editor ---------- */
  function openDrip(id) {
    st.id = id; st.sel = -1; st.multi = []; st.zoom = 1; hist = []; future = []; closePop(); closeMenu();
    $('#shell').classList.add('editing'); $('#insp').hidden = false;
    renderRail();
    $('#main').innerHTML = '<div class="editor"><div class="ed-bar"><button class="btn ghost sm" id="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>All drips</button>' +
      '<span class="title" id="ed-title"></span>' +
      '<span class="seg" role="group" aria-label="Zoom"><button id="zoom-out" title="Zoom out" aria-label="Zoom out">−</button><button id="zoom-fit" title="Fit">Fit</button><button id="zoom-in" title="Zoom in" aria-label="Zoom in">+</button></span>' +
      '<span class="seg" role="group" aria-label="Format"><button data-fmt="1:1">1:1</button><button data-fmt="4:5">4:5</button></span>' +
      '<button class="btn sm icon" id="undo" title="Undo (Ctrl+Z)" aria-label="Undo">↶</button><button class="btn sm icon" id="redo" title="Redo (Ctrl+Shift+Z)" aria-label="Redo">↷</button>' +
      '<button class="btn sm" id="png2">PNG 2x</button><button class="btn sm primary" id="png">Download PNG</button></div>' +
      '<div class="canvas-wrap" id="wrap"><div class="canvas-box" id="box"></div><div class="guides" id="guides"></div><div class="marq" id="marq" hidden></div><div class="tools" id="tools" hidden></div>' +
      '<span class="hint">Click to select · Shift-click or drag a box to select several · double-click text to type · right-click for more</span></div></div>';
    drawCanvas(); renderInspector();
  }
  function drawCanvas() {
    var d = cur(), box = $('#box'); if (!box || !d) return;
    box.innerHTML = ''; var el = R.render(d, { edit: true }); box.appendChild(el); R.fit(box);
    (d.layers || []).forEach(function (L, i) { if (L.lock) { var n = $('#box .L[data-i="' + i + '"]'); if (n) n.classList.add('locked'); } });
    $('#ed-title').textContent = (d.draft ? 'Draft · ' : '') + (d.name || d.id);
    $$('[data-fmt]').forEach(function (b) { b.classList.toggle('on', (d.format || '1:1') === b.dataset.fmt); });
    fitCanvas(); markSel();
  }
  function fitCanvas() {
    var wrap = $('#wrap'), box = $('#box'), el = box && box.firstChild; if (!el) return;
    var H = el.offsetHeight || 1080, fit = Math.min((wrap.clientWidth - 56) / 1080, (wrap.clientHeight - 80) / H);
    fit = Math.max(.2, Math.min(fit, 1)); var s = fit * st.zoom;
    box.style.width = 1080 * s + 'px'; box.style.height = H * s + 'px';
    el.style.transform = 'scale(' + s + ')'; box.dataset.s = s; el.style.setProperty('--inv', (1 / s).toFixed(3));
    wrap.classList.toggle('zoomed', st.zoom > 1);
  }
  function selEls() { var out = []; if (st.sel === 'copy') out.push($('#box .d-copy')); (st.multi.length ? st.multi : st.sel > -1 ? [st.sel] : []).forEach(function (i) { var n = $('#box .L[data-i="' + i + '"]'); if (n) out.push(n); }); return out.filter(Boolean); }
  function markSel() {
    $$('#box .sel').forEach(function (n) { n.classList.remove('sel'); });
    $$('#box .hdl').forEach(function (n) { n.remove(); });
    var els = selEls(); if (!els.length) { $('#tools').hidden = true; return; }
    els.forEach(function (n) { n.classList.add('sel'); });
    if (!st.multi.length || st.multi.length === 1) {
      var n = els[0], L = st.sel === 'copy' ? null : cur().layers[st.sel];
      if (st.sel === 'copy') n.insertAdjacentHTML('beforeend', '<span class="hdl hdl-se" data-h="cw" title="Width"></span>');
      else if (L && L.type !== 'link' && !L.lock) { n.style.setProperty('--ls', L.s || 1); n.insertAdjacentHTML('beforeend', '<span class="hdl hdl-rot" data-h="rot" title="Rotate (Shift snaps to 15°)"></span><span class="hdl hdl-se" data-h="se" title="Resize"></span>'); }
    }
    placeTools();
  }
  var TEXTY = { pill: 1, chip: 1, note: 1, bubble: 1, text: 1, record: 1, phone: 1, checklist: 1, code: 1, site: 1, serp: 1, gauge: 1, ba: 1, orbit: 1, apps: 1, palette: 1, devices: 1, appflow: 1,
    window: 1, ophone: 1, graph: 1, kpis: 1, timeline: 1, steps: 1, chat: 1, receipt: 1, notif: 1, stat: 1, route: 1, link: 1 };
  var IMAGEY = { person: 1, shot: 1, img: 1, phone: 1, nexi: 1 };
  var ALIGN_SVG = { l: 'M4 3v18M8 7h12M8 13h8', c: 'M12 3v18M6 7h12M8 13h8', r: 'M20 3v18M4 7h12M8 13h8', t: 'M3 4h18M7 8v12M13 8v8', m: 'M3 12h18M7 6v12M13 8v8', b: 'M3 20h18M7 4v12M13 8v8' };
  function ico(p) { return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' + '<path d="' + p + '"/></svg>'; }
  function placeTools() {
    var t = $('#tools'), els = selEls(), wrap = $('#wrap'); if (!t || !els.length || editing || !S.canWrite) { if (t) t.hidden = true; return; }
    var h = '';
    if (st.multi.length > 1) {
      h = '<span class="tl-l">' + st.multi.length + ' selected</span>' + ['l', 'c', 'r', 't', 'm', 'b'].map(function (k) { return '<button data-align="' + k + '" title="Align ' + { l: 'left', c: 'centre', r: 'right', t: 'top', m: 'middle', b: 'bottom' }[k] + '">' + ico(ALIGN_SVG[k]) + '</button>'; }).join('') +
        '<button data-dist="h" title="Distribute across">↔</button><button data-dist="v" title="Distribute down">↕</button><button data-tool="dup">Duplicate</button><button data-tool="del" class="danger">Delete</button>';
    } else if (st.sel === 'copy') {
      var c = cur().copy || {};
      h = '<button data-tool="edit">Edit text</button><button data-fs="-4" title="Smaller">A−</button><button data-fs="4" title="Bigger">A+</button>' +
        ['#1F1F3D', '#3167CA', '#FFFFFF'].map(function (col) { return '<button class="sw" data-color="' + col + '" title="Colour" style="--sw:' + col + '"></button>'; }).join('') +
        (c.x != null ? '<button data-stdframe="1" title="Back to the standard position">Reset position</button>' : '');
    } else {
      var L = cur().layers[st.sel];
      h = (TEXTY[L.type] ? '<button data-tool="edit">Edit text</button>' : '') +
        (IMAGEY[L.type] ? '<button data-tool="image">' + (L.type === 'nexi' ? 'Swap for a photo' : 'Replace image') + '</button>' : '') +
        (L.type === 'nexi' ? '<select data-tool="pose" aria-label="Nexi pose">' + opts(POSES, L.pose) + '</select>' : '') +
        (L.type === 'window' || L.type === 'ophone' ? '<select data-tool="view" aria-label="Odoo view">' + opts(VIEWS, L.view) + '</select>' : '') +
        '<button data-tool="lock">' + (L.lock ? 'Unlock' : 'Lock') + '</button><button data-tool="front" title="Bring forward (])">Forward</button><button data-tool="back" title="Send backward ([)">Backward</button><button data-tool="dup" title="Duplicate (Ctrl+D)">Duplicate</button><button data-tool="del" class="danger" title="Delete (Del)">Delete</button>';
    }
    t.innerHTML = h; t.hidden = false;
    var r = unionRect(els), w = wrap.getBoundingClientRect();
    var top = r.top - w.top - 48; if (top < 6) top = r.bottom - w.top + 10;
    var left = Math.max(6, Math.min(r.left - w.left + r.width / 2 - t.offsetWidth / 2, w.width - t.offsetWidth - 6));
    t.style.top = top + 'px'; t.style.left = left + 'px';
  }
  function unionRect(els) { var a = { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 }; els.forEach(function (n) { var r = n.getBoundingClientRect(); a.left = Math.min(a.left, r.left); a.top = Math.min(a.top, r.top); a.right = Math.max(a.right, r.right); a.bottom = Math.max(a.bottom, r.bottom); }); a.width = a.right - a.left; a.height = a.bottom - a.top; return a; }
  function select(i, add) {
    closePop(); closeMenu();
    if (add && i !== 'copy' && i > -1) {
      var m = st.multi.length ? st.multi.slice() : st.sel > -1 && st.sel !== 'copy' ? [st.sel] : [];
      var k = m.indexOf(i); if (k > -1) m.splice(k, 1); else m.push(i);
      st.multi = m.length > 1 ? m : []; st.sel = m.length ? m[m.length - 1] : -1;
    } else { st.sel = i; st.multi = []; }
    markSel(); renderInspector();
  }

  /* ---------- pointer: move, resize, rotate, marquee, smart guides ---------- */
  var drag = null, editing = null;
  function tf(L) { var d = cur(), camT = L.cam && R.CAM[d.cam] ? R.CAM[d.cam] + ' ' : ''; return (L.rot || L.flip || L.s || camT) ? camT + 'rotate(' + (L.rot || 0) + 'deg)' + (L.flip ? ' scaleX(-1)' : '') + (L.s ? ' scale(' + L.s + ')' : '') : ''; }
  function boxOf(n) { var s = +$('#box').dataset.s, dr = $('#box .drip').getBoundingClientRect(), r = n.getBoundingClientRect(); return { x: (r.left - dr.left) / s, y: (r.top - dr.top) / s, w: r.width / s, h: r.height / s }; }
  function toCanvas(e) { var s = +$('#box').dataset.s, dr = $('#box .drip').getBoundingClientRect(); return [(e.clientX - dr.left) / s, (e.clientY - dr.top) / s]; }
  document.addEventListener('pointerdown', function (e) {
    closeMenu();
    if (!st.id || !S.canWrite || e.button !== 0) return;
    if (editing && e.target.closest('[contenteditable]')) return;
    if (editing && editing.commit) editing.commit();
    var box = e.target.closest && e.target.closest('#box'); if (!box) return;
    var hdl = e.target.closest('.hdl'), n = e.target.closest('.L:not(.locked), .d-copy');
    var d = cur(), s = +box.dataset.s, H = $('#box .drip').offsetHeight;
    if (!n) {
      e.preventDefault();
      if (!e.shiftKey) { st.sel = -1; st.multi = []; markSel(); renderInspector(); }
      var p = toCanvas(e); drag = { mode: 'marq', x0: p[0], y0: p[1], cx0: e.clientX, cy0: e.clientY, add: e.shiftKey, moved: false };
      return;
    }
    e.preventDefault();
    var i = n.classList.contains('d-copy') ? 'copy' : +n.dataset.i;
    if (e.shiftKey && i !== 'copy') { select(i, true); return; }
    var inMulti = st.multi.indexOf(i) > -1;
    if (!inMulti && st.sel !== i) select(i);
    var ids = inMulti ? st.multi.slice() : [i];
    drag = { mode: hdl ? hdl.dataset.h : 'move', i: i, ids: ids, s: s, H: H, x0: e.clientX, y0: e.clientY, moved: false, tall: d.format === '4:5', start: {} };
    if (i === 'copy') {
      var c = d.copy || {}, cn = $('#box .d-copy');
      drag.copy0 = { x: c.x != null ? c.x : cn.offsetLeft, y: c.x != null ? (c.y || 0) : cn.offsetTop - (drag.tall ? 40 : 0), w: c.w || cn.offsetWidth }; drag.n = cn; drag.box0 = boxOf(cn);
    } else {
      ids.forEach(function (k) { var L = d.layers[k], ln = $('#box .L[data-i="' + k + '"]'); drag.start[k] = { x: L.x || 0, y: drag.tall ? parseFloat(ln.style.top) || 0 : L.y || 0, b: L.b, x1: L.x1, y1: L.y1, x2: L.x2, y2: L.y2, n: ln }; });
      var L0 = d.layers[i]; drag.n = selEls().filter(function (x) { return +x.dataset.i === i; })[0] || n;
      drag.w0 = L0.w || drag.n.offsetWidth; drag.s0 = L0.s || 1; drag.box0 = unionBox(ids);
      var r = drag.n.getBoundingClientRect(); drag.cx = r.left + r.width / 2; drag.cy = r.top + r.height / 2;
    }
    drag.others = $$('#box .L').filter(function (x) { return ids.indexOf(+x.dataset.i) < 0 && !x.classList.contains('L-glow') && !x.classList.contains('L-link') && !x.classList.contains('fx'); }).map(boxOf);
    if (i !== 'copy') drag.others.push(boxOf($('#box .d-copy')));
    $('#box').classList.add('dragging'); $('#tools').hidden = true;
    try { n.setPointerCapture(e.pointerId); } catch (err) {}
  });
  function unionBox(ids) { var a = null; ids.forEach(function (k) { var n = $('#box .L[data-i="' + k + '"]'); if (!n) return; var b = boxOf(n); a = a ? { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), x1: Math.max(a.x + a.w, b.x + b.w), y1: Math.max(a.y + a.h, b.y + b.h) } : { x: b.x, y: b.y, x1: b.x + b.w, y1: b.y + b.h }; if (a) { a.w = a.x1 - a.x; a.h = a.y1 - a.y; } }); return a || { x: 0, y: 0, w: 1, h: 1 }; }
  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    if (drag.mode === 'marq') {
      if (!drag.moved && Math.abs(e.clientX - drag.cx0) + Math.abs(e.clientY - drag.cy0) < 4) return;
      drag.moved = true; var p = toCanvas(e), m = $('#marq'), wr = $('#wrap').getBoundingClientRect(), br = $('#box').getBoundingClientRect(), s = +$('#box').dataset.s;
      var x = Math.min(p[0], drag.x0), y = Math.min(p[1], drag.y0), w = Math.abs(p[0] - drag.x0), h = Math.abs(p[1] - drag.y0);
      m.hidden = false; m.style.left = (br.left - wr.left + x * s) + 'px'; m.style.top = (br.top - wr.top + y * s) + 'px'; m.style.width = w * s + 'px'; m.style.height = h * s + 'px';
      drag.rect = { x: x, y: y, x1: x + w, y1: y + h }; return;
    }
    var dx = (e.clientX - drag.x0) / drag.s, dy = (e.clientY - drag.y0) / drag.s;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 2) return;
    if (!drag.moved) { snapshot(); drag.moved = true; }
    var d = cur();
    if (drag.i === 'copy') {
      d.copy = d.copy || {};
      if (drag.mode === 'cw') { d.copy.x = drag.copy0.x; d.copy.y = drag.copy0.y; d.copy.w = Math.max(160, Math.round(drag.copy0.w + dx)); if (!d.copy.align) d.copy.align = 'center'; drag.n.style.width = d.copy.w + 'px'; return; }
      var g = snap(drag.box0, dx, dy, drag.H, drag.others, e.altKey); showGuides(g.lines);
      d.copy.x = Math.round(drag.copy0.x + g.dx); d.copy.y = Math.round(drag.copy0.y + g.dy); d.copy.w = drag.copy0.w; if (!d.copy.align) d.copy.align = 'center';
      drag.n.style.left = d.copy.x + 'px'; drag.n.style.right = 'auto'; drag.n.style.width = d.copy.w + 'px'; drag.n.style.top = (d.copy.y + (drag.tall ? 40 : 0)) + 'px'; return;
    }
    var L = d.layers[drag.i];
    if (drag.mode === 'move') {
      var g2 = snap(drag.box0, dx, dy, drag.H, drag.others, e.altKey); dx = g2.dx; dy = g2.dy; showGuides(g2.lines);
      drag.ids.forEach(function (k) {
        var M = d.layers[k], s0 = drag.start[k];
        if (M.type === 'link') { M.x1 = Math.round(s0.x1 + dx); M.x2 = Math.round(s0.x2 + dx); M.y1 = Math.round(s0.y1 + dy); M.y2 = Math.round(s0.y2 + dy); s0.n.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; return; }
        M.x = Math.round(s0.x + dx); s0.n.style.left = M.x + 'px';
        if (s0.b != null) { M.b = Math.round(s0.b - dy); s0.n.style.bottom = M.b + 'px'; }
        else { var ny = Math.round(s0.y + dy); if (drag.tall) M.y45 = ny; else M.y = ny; s0.n.style.top = ny + 'px'; }
      });
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
    var dd = drag; drag = null;
    if (dd.mode === 'marq') {
      $('#marq').hidden = true;
      if (dd.moved && dd.rect) {
        var hitIds = $$('#box .L:not(.locked)').filter(function (n) { if (n.classList.contains('L-link') || n.classList.contains('L-glow')) return false; var b = boxOf(n); return b.x < dd.rect.x1 && b.x + b.w > dd.rect.x && b.y < dd.rect.y1 && b.y + b.h > dd.rect.y; }).map(function (n) { return +n.dataset.i; });
        if (dd.add) hitIds = (st.multi.length ? st.multi : st.sel > -1 && st.sel !== 'copy' ? [st.sel] : []).concat(hitIds).filter(function (v, k, a) { return a.indexOf(v) === k; });
        st.multi = hitIds.length > 1 ? hitIds : []; st.sel = hitIds.length ? hitIds[hitIds.length - 1] : -1; markSel(); renderInspector();
      }
      return;
    }
    if (dd.moved) { queueSave(cur()); drawCanvas(); renderInspector(); } else placeTools();
  });
  var AUTO = { pill: 1, chip: 1, note: 1, bubble: 1 };
  function snap(b, dx, dy, H, others, off) {
    var lines = [], th = 6; if (off) return { dx: dx, dy: dy, lines: lines };
    var xs = [64, 540, 1016], ys = [H / 2, 64, H - 64];
    (others || []).forEach(function (o) { xs.push(o.x, o.x + o.w / 2, o.x + o.w); ys.push(o.y, o.y + o.h / 2, o.y + o.h); });
    function best(vals, cands) { var bd = null; cands.forEach(function (l) { vals.forEach(function (v) { var d2 = l - v; if (Math.abs(d2) < th && (bd == null || Math.abs(d2) < Math.abs(bd))) bd = d2; }); }); return bd; }
    var bx = best([b.x + dx, b.x + dx + b.w / 2, b.x + dx + b.w], xs); if (bx != null) { dx += bx; lines.push(['v', xs.filter(function (l) { return [b.x + dx, b.x + dx + b.w / 2, b.x + dx + b.w].some(function (v) { return Math.abs(v - l) < .6; }); })]); }
    var by = best([b.y + dy, b.y + dy + b.h / 2, b.y + dy + b.h], ys); if (by != null) { dy += by; lines.push(['h', ys.filter(function (l) { return [b.y + dy, b.y + dy + b.h / 2, b.y + dy + b.h].some(function (v) { return Math.abs(v - l) < .6; }); })]); }
    return { dx: dx, dy: dy, lines: lines };
  }
  function showGuides(lines) {
    var g = $('#guides'); if (!g) return; var box = $('#box'), s = +box.dataset.s, br = box.getBoundingClientRect(), wr = $('#wrap').getBoundingClientRect();
    g.innerHTML = lines.map(function (l) { return l[1].map(function (v) {
      return l[0] === 'v' ? '<i class="gv" style="left:' + (br.left - wr.left + v * s) + 'px;top:' + (br.top - wr.top) + 'px;height:' + br.height + 'px"></i>'
        : '<i class="gh" style="top:' + (br.top - wr.top + v * s) + 'px;left:' + (br.left - wr.left) + 'px;width:' + br.width + 'px"></i>'; }).join(''); }).join('');
  }
  function syncXY() { var L = cur().layers[st.sel]; if (!L) return; var f = function (id, v) { var x = $('#' + id); if (x) x.value = v == null ? '' : v; }; f('p-x', L.x || 0); f('p-y', L.y || 0); f('p-b', L.b); f('p-w', L.w); f('p-rot', L.rot || 0); f('p-s', L.s); }
  function doAlign(k) {
    var ids = st.multi.slice(); if (ids.length < 2) return;
    var boxes = ids.map(function (i) { return { i: i, b: boxOf($('#box .L[data-i="' + i + '"]')) }; }), U = unionBox(ids);
    change(function (d) {
      boxes.forEach(function (o) {
        var L = d.layers[o.i], b = o.b, dx = 0, dy = 0;
        if (k === 'l') dx = U.x - b.x; if (k === 'r') dx = U.x1 - (b.x + b.w); if (k === 'c') dx = (U.x + U.w / 2) - (b.x + b.w / 2);
        if (k === 't') dy = U.y - b.y; if (k === 'b') dy = U.y1 - (b.y + b.h); if (k === 'm') dy = (U.y + U.h / 2) - (b.y + b.h / 2);
        moveBy(L, dx, dy, d);
      });
    }, { now: true, insp: true });
  }
  function doDist(axis) {
    var ids = st.multi.slice(); if (ids.length < 3) { toast('Pick three or more to distribute'); return; }
    var o = ids.map(function (i) { return { i: i, b: boxOf($('#box .L[data-i="' + i + '"]')) }; }).sort(function (a, b) { return axis === 'h' ? a.b.x - b.b.x : a.b.y - b.b.y; });
    var first = o[0].b, last = o[o.length - 1].b, span = axis === 'h' ? (last.x + last.w) - first.x : (last.y + last.h) - first.y, total = o.reduce(function (a, x) { return a + (axis === 'h' ? x.b.w : x.b.h); }, 0), gap = (span - total) / (o.length - 1), pos = axis === 'h' ? first.x : first.y;
    change(function (d) { o.forEach(function (x) { var cur0 = axis === 'h' ? x.b.x : x.b.y; moveBy(d.layers[x.i], axis === 'h' ? pos - cur0 : 0, axis === 'v' ? pos - cur0 : 0, d); pos += (axis === 'h' ? x.b.w : x.b.h) + gap; }); }, { now: true, insp: true });
  }
  function moveBy(L, dx, dy, d) {
    if (L.type === 'link') { L.x1 += dx; L.x2 += dx; L.y1 += dy; L.y2 += dy; return; }
    L.x = Math.round((L.x || 0) + dx);
    if (L.b != null) L.b = Math.round(L.b - dy); else if (d.format === '4:5') { var n = $('#box .L[data-i="' + d.layers.indexOf(L) + '"]'); L.y45 = Math.round((L.y45 != null ? L.y45 : parseFloat(n.style.top) || 0) + dy); } else L.y = Math.round((L.y || 0) + dy);
  }

  /* ---------- editing text on the canvas ---------- */
  document.addEventListener('dblclick', function (e) {
    if (!st.id || !S.canWrite) return;
    var n = e.target.closest && e.target.closest('#box .L, #box .d-copy'); if (!n) return;
    var i = n.classList.contains('d-copy') ? 'copy' : +n.dataset.i;
    if (st.sel !== i || st.multi.length) select(i);
    var spot = e.target.closest('[data-e]'), L = i === 'copy' ? null : cur().layers[i];
    if (spot && L && typeof L[spot.dataset.e] !== 'object') inlineEdit(spot, L); else openPop();
  });
  function inlineEdit(spot, L) {
    var key = spot.dataset.e, before = L[key], done = false; snapshot();
    editing = { spot: spot, L: L, key: key, before: before, commit: commit }; $('#tools').hidden = true;
    spot.setAttribute('contenteditable', 'plaintext-only'); if (spot.contentEditable !== 'plaintext-only') spot.setAttribute('contenteditable', 'true');
    spot.focus(); var rg = document.createRange(); rg.selectNodeContents(spot); var sl = getSelection(); sl.removeAllRanges(); sl.addRange(rg);
    function commit() { if (done) return; done = true; editing = null; if (L[key] === before) hist.pop(); else queueSave(cur()); drawCanvas(); renderInspector(); }
    spot.addEventListener('input', function () { L[key] = spot.textContent; queueSave(cur()); });
    spot.addEventListener('keydown', function (k) { if (k.key === 'Enter' && !k.shiftKey) { k.preventDefault(); commit(); } if (k.key === 'Escape') { L[key] = before; commit(); } k.stopPropagation(); });
    spot.addEventListener('blur', commit, { once: true });
  }
  var POPW = {
    form: [['crumbs', 'Breadcrumbs, one per line', 'lines'], ['record', 'Record name', 'text'], ['status', 'Status steps, one per line', 'lines'], ['statusAt', 'Current step (0 = first)', 'num'], ['buttons', 'Buttons, one per line', 'lines'], ['fields', 'Fields: label | value', 'rows'], ['highlight', 'Glowing fields (labels), one per line', 'lines'], ['lines', 'Lines: product | qty | price | subtotal', 'rows'], ['total', 'Total', 'text'], ['chatter', 'Note under the form', 'area']],
    list: [['crumbs', 'Breadcrumbs', 'lines'], ['cols', 'Columns, one per line', 'lines'], ['rows', 'Rows: a | b | c | … (last = status)', 'rows'], ['highlight', 'Highlighted row (0 = first)', 'num'], ['sum', 'Sum line', 'text']],
    kanban: [['crumbs', 'Breadcrumbs', 'lines'], ['stages', 'Stages and cards (JSON)', 'json'], ['highlight', 'Lifted cards, e.g. 2.0', 'lines']],
    dashboard: [['crumbs', 'Breadcrumbs', 'lines'], ['kpis', 'KPIs: label | value | change', 'rows'], ['chart', 'Chart (JSON)', 'json']],
    planning: [['days', 'Days, one per line', 'lines'], ['rows', 'People and shifts (JSON)', 'json']],
    pos: [['table', 'Order title', 'text'], ['products', 'Products: name | price', 'rows'], ['order', 'Order: item | qty | unit | subtotal', 'rows'], ['total', 'Total', 'text'], ['btn', 'Button', 'text']],
    kds: [['tickets', 'Tickets (JSON)', 'json']],
    apps: [['apps', 'Apps, one module per line', 'lines'], ['highlight', 'Highlighted apps', 'lines']],
    discuss: [['channels', 'Channels', 'lines'], ['msgs', 'Messages: who | text | attachment', 'rows']]
  };
  var POP = {
    copy: [['head', 'Headline (*blue* ~brush~ ==marker== | line break)', 'area'], ['sub', 'Subline', 'area'], ['kicker', 'Blue bar above the headline', 'text']],
    pill: [['text', 'Text', 'text']], bubble: [['text', 'Text', 'text']], chip: [['text', 'Text', 'text'], ['small', 'Second line', 'text']], note: [['text', 'Text', 'text'], ['small', 'Second line', 'text']],
    text: [['text', 'Text (markup works)', 'area']],
    record: [['title', 'Title', 'text'], ['crumb', 'Breadcrumb', 'text'], ['status', 'Status', 'text'], ['rows', 'Rows: label | value | ai or ok', 'rows'], ['ai', 'AI note', 'text'], ['btn', 'Button', 'text']],
    checklist: [['title', 'Title', 'text'], ['tag', 'Tag', 'text'], ['items', 'Items, one per line', 'lines']],
    ba: [['rows', 'Rows: topic | old way | with Odoo', 'rows'], ['oldLabel', 'Old column', 'text'], ['newLabel', 'New column', 'text']],
    code: [['file', 'File name', 'text'], ['lines', 'Code, one line each', 'lines']],
    site: [['brand', 'Brand', 'text'], ['head', 'Headline (*blue*)', 'text'], ['sub', 'Subline', 'text'], ['cta', 'Button', 'text'], ['url', 'Address bar', 'text'], ['accent', 'Accent colour', 'text']],
    serp: [['query', 'Search', 'text'], ['site', 'Site name', 'text'], ['url', 'URL', 'text'], ['title', 'Title', 'text'], ['desc', 'Description', 'area']],
    gauge: [['label', 'Label', 'text'], ['value', 'Value (number, text, or blank for a tick)', 'text']],
    orbit: [['label', 'Centre label', 'text'], ['apps', 'Apps, one module per line', 'lines']],
    apps: [['list', 'Apps: module:Label, one per line', 'lines']], palette: [['colors', 'Colours, one hex per line', 'lines']], devices: [['label', 'Tag on the laptop', 'text']], appflow: [['title', 'Title', 'text']],
    graph: [['title', 'Title', 'text'], ['data', 'Data: label | number', 'rows'], ['highlight', 'Highlighted bar (0 = first)', 'num'], ['unit', 'Unit (%, k…)', 'text'], ['note', 'Note', 'text'], ['tag', 'Tag', 'text']],
    kpis: [['items', 'Tiles: label | value | change | module', 'rows']],
    timeline: [['title', 'Title', 'text'], ['items', 'Items: time | event | module | detail', 'rows'], ['hot', 'Highlighted item (0 = first)', 'num']],
    steps: [['items', 'Steps: module | step | detail', 'rows'], ['hot', 'Highlighted step (0 = first)', 'num']],
    chat: [['title', 'Title', 'text'], ['status', 'Status line', 'text'], ['msgs', 'Messages: in, out or bot | text', 'rows']],
    receipt: [['vendor', 'Vendor', 'text'], ['doc', 'Document', 'text'], ['lines', 'Lines: item | amount', 'rows'], ['total', 'Total', 'text'], ['stamp', 'Stamp', 'text']],
    notif: [['title', 'Title', 'text'], ['text', 'Text', 'text'], ['time', 'Time', 'text']], stat: [['value', 'Value', 'text'], ['label', 'Label', 'text']],
    route: [['stops', 'Stops: place | time', 'rows'], ['hot', 'Current stop (0 = first)', 'num']], link: [['label', 'Label', 'text']]
  };
  function popSpec(L) { if (!L) return POP.copy; if (L.type === 'window' || L.type === 'ophone') return [['appLabel', 'App name in the bar', 'text']].concat(POPW[L.view || 'form'] || []); return POP[L.type]; }
  function openPop() {
    closePop();
    var d = cur(), isCopy = st.sel === 'copy', L = isCopy ? d.copy || (d.copy = {}) : d.layers[st.sel], spec = popSpec(isCopy ? null : L);
    if (!spec) { toast('This element has no text; use the panel on the right'); return; }
    var h = '<div class="pop-h"><b>Edit ' + (isCopy ? 'headline' : esc(ADDLAB[L.type] || L.type)) + '</b><button class="btn ghost sm icon" id="pop-x" aria-label="Close">✕</button></div>' + spec.map(function (f) {
      var v = L[f[0]], t = f[2], val = t === 'rows' ? (v || []).map(function (r) { return (Array.isArray(r) ? r : [r]).map(function (x) { return x === true ? '1' : x === false ? '0' : x; }).join(' | '); }).join('\n') : t === 'lines' ? (Array.isArray(v) ? v : v == null ? [] : [v]).join('\n') : t === 'json' ? JSON.stringify(v == null ? null : v, null, 1) : (v == null ? '' : v);
      return '<label class="f"><span>' + esc(f[1]) + '</span>' + (t === 'text' || t === 'num' ? '<input type="' + (t === 'num' ? 'number' : 'text') + '" data-pk="' + f[0] + '" data-pt="' + t + '" value="' + esc(val) + '">' : '<textarea class="' + (t === 'json' ? 'code' : '') + '" data-pk="' + f[0] + '" data-pt="' + t + '" rows="' + (t === 'area' ? 3 : t === 'json' ? 7 : 4) + '">' + esc(val) + '</textarea>') + '</label>';
    }).join('') + '<div class="pop-f"><button class="btn sm primary" id="pop-done">Done</button></div>';
    var p = document.createElement('div'); p.className = 'pop'; p.id = 'pop'; p.innerHTML = h; $('#wrap').appendChild(p);
    var n = selEls()[0], r = n.getBoundingClientRect(), w = $('#wrap').getBoundingClientRect();
    var left = Math.max(8, Math.min(r.left - w.left, w.width - p.offsetWidth - 8)), top = r.bottom - w.top + 10;
    if (top + p.offsetHeight > w.height - 8) top = Math.max(8, Math.min(r.top - w.top - p.offsetHeight - 10, w.height - p.offsetHeight - 8));
    p.style.left = left + 'px'; p.style.top = Math.max(8, top) + 'px';
    snapshot(); editing = { pop: true }; $('#tools').hidden = true;
    var first = $('input,textarea', p); if (first) { first.focus(); }
    p.addEventListener('input', function (ev) {
      var t = ev.target, k = t.dataset.pk, ty = t.dataset.pt, v = t.value;
      if (ty === 'num') v = v === '' ? null : +v;
      if (ty === 'lines') v = v.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
      if (ty === 'rows') v = v.split('\n').filter(function (x) { return x.trim(); }).map(function (x) { return x.split('|').map(function (y) { y = y.trim(); return /^\d+(\.\d+)?$/.test(y) && (k === 'data' || k === 'rows' && st.sel !== 'copy' && (cur().layers[st.sel] || {}).type === 'window' && false) ? +y : (k === 'lines' && y === '1') ? true : (k === 'lines' && y === '0') ? false : y; }); });
      if (ty === 'json') { try { v = JSON.parse(v); t.classList.remove('bad'); } catch (e) { t.classList.add('bad'); return; } }
      var tgt = st.sel === 'copy' ? cur().copy : cur().layers[st.sel];
      if (v === '' || v === null || (Array.isArray(v) && !v.length)) delete tgt[k]; else tgt[k] = v;
      queueSave(cur()); clearTimeout(redrawT); redrawT = setTimeout(function () { var keep = $('#pop'); drawCanvas(); if (keep && !keep.isConnected) $('#wrap').appendChild(keep); $('#tools').hidden = true; }, 140);
    });
    p.addEventListener('keydown', function (k) { if (k.key === 'Escape') { k.preventDefault(); closePop(); } k.stopPropagation(); });
  }
  function closePop() { var p = $('#pop'); if (!p) return; p.remove(); editing = null; renderInspector(); placeTools(); }

  /* ---------- context menu ---------- */
  document.addEventListener('contextmenu', function (e) {
    var n = e.target.closest && e.target.closest('#box .L, #box .d-copy, #box'); if (!n || !st.id || !S.canWrite) return;
    e.preventDefault();
    var i = n.classList.contains('d-copy') ? 'copy' : n.classList.contains('L') ? +n.dataset.i : -1;
    if (i !== -1 && st.multi.indexOf(i) < 0 && st.sel !== i) select(i);
    var L = typeof i === 'number' && i > -1 ? cur().layers[i] : null;
    var items = i === -1 ? [['paste', 'Paste'], ['selall', 'Select all']] : i === 'copy' ? [['edit', 'Edit headline'], ['paste', 'Paste']] :
      [['edit', 'Edit text'], ['dup', 'Duplicate'], ['copy', 'Copy'], ['paste', 'Paste'], ['top', 'Bring to front'], ['bottom', 'Send to back'], ['lock', L && L.lock ? 'Unlock' : 'Lock'], ['cam', L && L.cam ? 'Stop following the camera' : 'Follow the camera angle'], ['del', 'Delete']];
    var m = $('#ctx'); m.innerHTML = items.map(function (x) { return '<button data-ctx="' + x[0] + '"' + (x[0] === 'del' ? ' class="danger"' : '') + '>' + esc(x[1]) + '</button>'; }).join('');
    m.hidden = false; m.style.left = Math.min(e.clientX, innerWidth - 220) + 'px'; m.style.top = Math.min(e.clientY, innerHeight - m.offsetHeight - 8) + 'px';
  });
  function closeMenu() { var m = $('#ctx'); if (m) m.hidden = true; }
  function ctxAct(a) {
    closeMenu();
    if (a === 'edit') openPop(); else if (a === 'dup') layerAct('dup'); else if (a === 'del') layerAct('del'); else if (a === 'copy') copyLayers(); else if (a === 'paste') pasteLayers();
    else if (a === 'top' || a === 'bottom') change(function (d) { var zs0 = zs(), L = d.layers[st.sel]; L.z = a === 'top' ? Math.max.apply(null, zs0) + 1 : Math.max(0, Math.min.apply(null, zs0) - 1); }, { now: true, insp: true });
    else if (a === 'lock') layerAct('lock'); else if (a === 'cam') change(function (d) { var L = d.layers[st.sel]; L.cam = !L.cam || undefined; }, { now: true, insp: true });
    else if (a === 'selall') { st.multi = cur().layers.map(function (L, i) { return L.lock || L.type === 'glow' ? -1 : i; }).filter(function (i) { return i > -1; }); st.sel = st.multi[st.multi.length - 1]; if (st.multi.length < 2) st.multi = []; markSel(); renderInspector(); }
  }
  function copyLayers() { var ids = st.multi.length ? st.multi : st.sel > -1 && st.sel !== 'copy' ? [st.sel] : []; if (!ids.length) return; clip = ids.map(function (i) { return clone(cur().layers[i]); }); try { localStorage.setItem('tn-drip-clip', JSON.stringify(clip)); } catch (e) {} toast(ids.length + ' copied'); }
  function pasteLayers() {
    var c = clip; if (!c) { try { c = JSON.parse(localStorage.getItem('tn-drip-clip') || 'null'); } catch (e) {} } if (!c || !c.length) { toast('Nothing to paste'); return; }
    change(function (d) { var top = Math.max.apply(null, zs().concat([10])), start = d.layers.length; c.forEach(function (L, k) { L = clone(L); moveBy(L, 30, 30, d); L.z = top + 1 + k; d.layers.push(L); }); st.multi = c.length > 1 ? c.map(function (x, k) { return start + k; }) : []; st.sel = start + c.length - 1; }, { now: true, insp: true });
  }

  /* keyboard */
  document.addEventListener('keydown', function (e) {
    if (!st.id || editing) return;
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    var mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (mod && k === 'z' && !typing) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if (mod && k === 'y' && !typing) { e.preventDefault(); redo(); return; }
    if (typing || !S.canWrite) return;
    if (mod && k === 'c') { copyLayers(); return; }
    if (mod && k === 'v') { e.preventDefault(); pasteLayers(); return; }
    if (mod && k === 'a') { e.preventDefault(); ctxAct('selall'); return; }
    if (e.key === 'Escape') { select(-1); return; }
    if (st.sel === -1) return;
    if (st.sel === 'copy') { if (e.key === 'Enter') { e.preventDefault(); openPop(); } return; }
    if (mod && k === 'd') { e.preventDefault(); layerAct('dup'); return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); layerAct('del'); return; }
    if (e.key === ']') { layerAct('front'); return; }
    if (e.key === '[') { layerAct('back'); return; }
    if (e.key === 'Enter') { e.preventDefault(); openPop(); return; }
    var mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!mv) return;
    e.preventDefault(); var m = e.shiftKey ? 10 : 1, ids = st.multi.length ? st.multi : [st.sel];
    change(function (d) { ids.forEach(function (i) { moveBy(d.layers[i], mv[0] * m, mv[1] * m, d); }); }, { now: true });
    syncXY();
  });
  function zs() { return (cur().layers || []).map(function (L) { return L.z == null ? 10 : L.z; }); }
  function layerAct(act, i) {
    var ids = i != null ? [i] : st.multi.length ? st.multi.slice() : [st.sel]; if (!cur().layers[ids[0]]) return;
    change(function (d) {
      var Ls = d.layers, all = zs();
      if (act === 'del') { ids.sort(function (a, b) { return b - a; }).forEach(function (k) { Ls.splice(k, 1); }); st.sel = -1; st.multi = []; return; }
      if (act === 'dup') { var top = Math.max.apply(null, all), start = Ls.length; ids.forEach(function (k, n) { var cp = clone(Ls[k]); moveBy(cp, 30, 30, d); cp.z = top + 1 + n; Ls.push(cp); }); st.multi = ids.length > 1 ? ids.map(function (x, n) { return start + n; }) : []; st.sel = Ls.length - 1; return; }
      ids.forEach(function (k) {
        var L = Ls[k], z = L.z == null ? 10 : L.z;
        if (act === 'front') { var up = all.filter(function (v) { return v > z; }); L.z = up.length ? Math.min.apply(null, up) + 1 : z + 1; }
        if (act === 'back') { var dn = all.filter(function (v) { return v < z; }); L.z = Math.max(0, dn.length ? Math.max.apply(null, dn) - 1 : z - 1); }
        if (act === 'hide') L.hide = !L.hide || undefined;
        if (act === 'lock') L.lock = !L.lock || undefined;
      });
    }, { insp: true, now: true });
  }

  /* images */
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
  document.addEventListener('drop', function (e) { if (!st.id) return; e.preventDefault(); var b = $('#box'); if (b) b.classList.remove('drop'); if (S.canWrite) addImage(e.dataTransfer.files && e.dataTransfer.files[0]); });
  function pickImage() { var i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = function () { addImage(i.files[0]); }; i.click(); }

  /* ---------- inspector ---------- */
  var LF = {
    window: [['app', 'odoo'], ['view', 'select', VIEWS], ['frame', 'check', 'Browser frame', true], ['url', 'text'], ['ai', 'check', 'AI sparkles on glowing fields']],
    ophone: [['app', 'odoo'], ['view', 'select', VIEWS]],
    graph: [['kind', 'select', ['bar', 'line', 'area', 'donut', 'funnel', 'progress']], ['glass', 'check', 'Frosted glass'], ['demo', 'check', 'Show "Demo data"', true]],
    kpis: [['cols', 'number', 'Columns'], ['glass', 'check', 'Frosted glass']], timeline: [['glass', 'check', 'Frosted glass']], steps: [['dir', 'select', ['h', 'v']]],
    chat: [['channel', 'select', ['whatsapp', 'web', 'odoo']]], notif: [['app', 'odoo']], stat: [['glass', 'check', 'Frosted glass']],
    link: [['x1', 'number'], ['y1', 'number'], ['x2', 'number'], ['y2', 'number'], ['bend', 'number', 'Bend (-0.6 to 0.6)'], ['tone', 'select', ['', 'blue', 'white']], ['color', 'text'], ['dash', 'check', 'Dashed', true], ['labelOnly', 'check', 'Label only (no arrow)']],
    nexi: [['pose', 'select', POSES], ['glow', 'check', 'Soft glow', true]],
    person: [['src', 'image'], ['sticker', 'check', 'White sticker outline'], ['fade', 'check', 'Fade the bottom edge']],
    img: [['src', 'image'], ['radius', 'number']], shot: [['src', 'image'], ['frame', 'select', ['', 'browser', 'laptop', 'tablet']], ['url', 'text']],
    phone: [['src', 'image'], ['app', 'odoo'], ['screen', 'select', ['odoo', 'offline-receipt']]], record: [['app', 'odoo'], ['statusOk', 'check', 'Green status']],
    flow: [['from', 'industry'], ['hot', 'number', 'Highlight step (0 = first)'], ['cols', 'number'], ['nodeW', 'number'], ['nodeH', 'number']],
    ba: [['from', 'industry'], ['n', 'number', 'Rows from the website']], phases: [['from', 'industry']], chart: [['from', 'industry'], ['view', 'number', 'Chart view (0 or 1)']],
    appflow: [['app', 'flowapp'], ['hot', 'number', 'Highlight state'], ['max', 'number', 'States shown'], ['handoffs', 'number', 'Hand-offs shown']],
    checklist: [['app', 'odoo'], ['from', 'industry'], ['max', 'number', 'Items shown']], orbit: [['core', 'select', ['', 'odoo']]], apps: [['cols', 'number'], ['labels', 'check', 'Show labels']],
    devices: [['site', 'site'], ['phone', 'check', 'Show the phone', true]], site: [['src', 'image']],
    pill: [['variant', 'select', ['', 'white', 'ok', 'sans', 'white sans']], ['icon', 'icon']], chip: [['icon', 'icon'], ['tone', 'select', ['', 'ok']]],
    note: [['variant', 'select', ['', 'red', 'red strike']], ['size', 'number'], ['color', 'text']],
    text: [['font', 'select', ['display', 'body', 'hand']], ['size', 'number'], ['weight', 'number'], ['color', 'text'], ['align', 'select', ['left', 'center', 'right']]],
    icon: [['name', 'icon'], ['color', 'text']], odoo: [['app', 'odoo']], arrow: [['kind', 'select', ['right', 'left', 'down', 'up', 'loop']], ['color', 'text']],
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
      case 'number': return '<label class="f"><span>' + esc(extra || k) + '</span><input type="number" step="any" id="' + id + '" data-k="' + k + '" data-t="num" value="' + (val == null ? '' : val) + '"></label>';
      case 'image': return '<div class="f"><span>image</span><input type="text" id="' + id + '" data-k="' + k + '" value="' + esc(val && val.indexOf('data:') === 0 ? '(embedded image)' : (val || '')) + '" placeholder="assets/people/photo.png"' + (val && val.indexOf('data:') === 0 ? ' readonly' : '') + '>' +
        '<span class="row"><button class="btn sm" type="button" data-pick="1">Choose image…</button><button class="btn sm" type="button" data-clear="' + k + '">Remove image</button></span></div>';
      default: return '<label class="f">' + lab + '<input type="text" id="' + id + '" data-k="' + k + '" value="' + esc(val == null ? '' : val) + '"></label>';
    }
  }
  var ADDLAB = { nexi: 'Nexi', person: 'Person / photo', shot: 'Screenshot', img: 'Image', phone: 'Phone', record: 'Record card', flow: 'Workflow', apps: 'App cloud', orbit: 'App orbit', appflow: 'Record flow',
    checklist: 'Checklist', ba: 'Before / after', phases: 'Phases', chart: 'Dashboard', devices: 'Laptop + phone', site: 'Website mockup', code: 'Code window', palette: 'Palette', wireframe: 'Wireframe',
    serp: 'Google result', gauge: 'Gauge', cursor: 'Cursor', pill: 'Pill', chip: 'Chip', note: 'Note', bubble: 'Bubble', text: 'Text', icon: 'Icon', odoo: 'Odoo icon', arrow: 'Arrow',
    burst: 'Burst', glow: 'Glow', sphere: 'Sphere', halftone: 'Halftone', scan: 'Scan beam', sparkles: 'Sparkles', storm: 'Storm', speed: 'Speed lines', confetti: 'Confetti', nosignal: 'No signal',
    window: 'Odoo screen', ophone: 'Odoo on a phone', graph: 'Chart', kpis: 'KPI tiles', timeline: 'Timeline', steps: 'Steps', chat: 'Chat', receipt: 'Paper invoice', notif: 'Notification', stat: 'Big number', route: 'Route', link: 'Arrow link' };
  function layerLabel(L) {
    var t = L.text || L.title || L.label || L.record || (L.view && R.appName(L.app) + ' · ' + L.view) || L.head || L.pose || L.value || L.vendor || (L.from && indName(L.from.replace('industry:', ''))) || (L.app && R.appName(L.app)) || (L.site && C.sites[L.site] && C.sites[L.site].name) || L.kind || (L.src ? (L.src.indexOf('data:') === 0 ? 'embedded image' : L.src.split('/').pop()) : '');
    return String(t || '').replace(/[*~|=]/g, '');
  }
  function designPanel(d) {
    var bg = d.bg && typeof d.bg === 'object' ? d.bg : null, b = d.brand || {}, lk = (d.scene && d.scene.look) || {};
    var sw = function (p) { var P = R.PAL[p]; return '<button class="pal-sw' + (bg && bg.palette === p ? ' on' : '') + '" data-pal="' + p + '" title="' + p + '" style="--a:' + P.a + ';--b:' + P.b + ';--c:' + P.c + ';--base:' + P.base + '"></button>'; };
    return '<section class="sec design"><h3>Design<small>restyles the whole post</small></h3>' +
      '<div class="f"><span>Background</span><div class="chips">' + K.BGS.map(function (s) { return '<button data-bgs="' + s + '"' + (bg && bg.style === s ? ' class="on"' : '') + '>' + s + '</button>'; }).join('') + '</div></div>' +
      '<div class="f"><span>Palette</span><div class="pals">' + ['blue', 'sky', 'mint', 'violet', 'sunrise', 'slate', 'night'].map(sw).join('') + '<button class="btn sm" data-reseed="1" title="Same style, new shapes">New shapes</button></div></div>' +
      '<div class="f"><span>Camera angle</span><div class="chips">' + K.CAMS.map(function (c) { return '<button data-cam="' + c + '"' + ((d.cam || 'front') === c ? ' class="on"' : '') + '>' + c + '</button>'; }).join('') + '</div></div>' +
      (d.brand || (d.copy && d.copy.x != null) ? '<div class="confirm" style="background:#FFF4D6;color:#7A5200">This drip uses a moved logo or headline. <button class="btn sm" data-stdframe="1">Use the standard frame</button></div>' : '') +
      '<div class="row"><label class="f"><span>Odoo badge (top right)</span><select id="d-badge2">' + opts(['ready', 'o20', ''], d.brand ? (b.badge === 'none' ? '' : b.badge || 'ready') : d.badge == null ? 'ready' : d.badge, ['Odoo Ready Partner', 'Meet Odoo 20', 'None']) + '</select></label>' +
      (d.scene ? '<div class="f" style="align-self:end"><button class="btn sm primary" data-shuffle="1" style="width:100%">' + sparkIcon() + 'Shuffle look</button></div>' : '') + '</div></section>';
  }
  function renderInspector() {
    var d = cur(); if (!d) return;
    var c = d.copy || (d.copy = {}), ro = !S.canWrite, h = '';
    var L = st.sel !== 'copy' && d.layers && d.layers[st.sel];
    if (st.multi.length > 1) h += '<section class="sec sel-sec"><h3>' + st.multi.length + ' elements<small>align from the toolbar</small></h3><p class="help" style="margin:0">Drag any of them to move all. Delete, Duplicate, Copy and the arrow keys work on all of them.</p></section>';
    else if (L) {
      h += '<section class="sec sel-sec"><h3>' + esc(ADDLAB[L.type] || L.type) + '<small>' + (TEXTY[L.type] ? 'double-click text on the canvas to edit' : 'selected') + '</small></h3>' +
        (TEXTY[L.type] ? '<button class="btn sm" type="button" data-tool="edit" style="margin-bottom:10px">Edit text and data…</button>' : '') +
        (L.type === 'link' ? '' : '<div class="row3">' + field('x', 'number', 'x', L.x || 0) + (L.b != null ? field('b', 'number', 'from bottom', L.b) : field('y', 'number', 'y', L.y || 0)) + field('w', 'number', 'width', L.w) + '</div>' +
        '<div class="row3">' + field('rot', 'number', 'rotate °', L.rot || 0) + field('s', 'number', 'scale', L.s == null ? '' : L.s) + field('op', 'number', 'opacity 0–1', L.op == null ? 1 : L.op) + '</div>') +
        (d.format === '4:5' && L.b == null && L.type !== 'link' ? field('y45', 'number', 'y in 4:5 (blank = y + 150 below the copy)', L.y45) : '') +
        '<div class="row">' + field('cam', 'check', 'Follow the camera', L.cam) + field('lock', 'check', 'Lock', L.lock) + '</div>' +
        (LF[L.type] || []).map(function (f) { return field(f[0], f[1], f[2], L[f[0]], f[3]); }).join('') +
        '<details style="margin-top:8px"><summary>Every field (JSON)</summary><label class="f" style="margin-top:8px"><textarea class="code" id="ljson">' + esc(JSON.stringify(L, function (k, v) { return typeof v === 'string' && v.indexOf('data:') === 0 ? '(embedded image)' : v; }, 1)) + '</textarea></label>' +
        '<button class="btn sm" id="ljson-apply" type="button">Apply JSON</button></details></section>';
    }
    if (!ro) h += designPanel(d);
    h += '<section class="sec' + (st.sel === 'copy' ? ' sel-sec' : '') + '"><h3>Headline<small>*blue* ~brush~ ==marker== | break</small></h3>' +
      '<label class="f"><span>Headline</span><textarea id="c-head" data-c="head">' + esc(c.head || '') + '</textarea></label>' +
      '<p class="help" id="fitwarn" hidden style="color:#7A5200;margin:-4px 0 8px">Shrunk to fit. Shorten it, widen the text box, or allow more lines.</p>' +
      '<label class="f"><span>Subline</span><textarea id="c-sub" data-c="sub">' + esc(c.sub || '') + '</textarea></label>' +
      '<div class="row3"><label class="f"><span>Size px</span><input type="number" id="c-fs" data-c="fs" data-t="num" value="' + (c.fs == null ? '' : c.fs) + '" placeholder="80"></label>' +
      '<label class="f"><span>Sub px</span><input type="number" id="c-subfs" data-c="subFs" data-t="num" value="' + (c.subFs == null ? '' : c.subFs) + '" placeholder="29"></label>' +
      '<label class="f"><span>Max lines</span><input type="number" id="c-lines" data-c="lines" data-t="num" value="' + (c.lines == null ? '' : c.lines) + '" placeholder="2"></label></div>' +
      '<div class="row"><label class="f"><span>Blue bar</span><input type="text" id="c-kicker" data-c="kicker" value="' + esc(c.kicker || '') + '"></label>' +
      '<label class="chk f" style="align-self:end;padding-bottom:8px"><input type="checkbox" id="c-quote" data-c="quote"' + (c.quote ? ' checked' : '') + '>Quote mark</label></div></section>';
    h += '<section class="sec"><h3>Layers<small>front first</small></h3><div class="layers">' +
      (d.layers || []).map(function (L, i) { return { L: L, i: i, z: L.z == null ? 10 : L.z }; }).sort(function (a, b) { return b.z - a.z || b.i - a.i; }).map(function (o) {
        var L = o.L, i = o.i, on = i === st.sel || st.multi.indexOf(i) > -1;
        return '<div class="lrow' + (on ? ' on' : '') + (L.hide ? ' off' : '') + '" data-li="' + i + '"><span class="ty">' + esc(ADDLAB[L.type] || L.type) + '</span><span class="tx">' + (L.lock ? '🔒 ' : '') + esc(layerLabel(L)) + '</span>' +
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
      '<label class="f"><span>Category</span><select id="d-cat" data-d="cat">' + opts(catOpts, d.cat, catLabels) + '</select></label>' +
      '<div class="row"><label class="f"><span>Bottom bar</span><input type="text" id="d-cta" data-cta="text" value="' + esc(d.cta && d.cta.text || '') + '" placeholder="technext.asia"></label>' +
      '<label class="f"><span>Button</span><input type="text" id="d-ctab" data-cta="btn" value="' + esc(d.cta && d.cta.btn || '') + '" placeholder="Book a call"></label></div>' +
      (d.source ? '<p class="help">Source: ' + esc(d.source) + '</p>' : '') +
      (ro ? '' : '<div class="row" style="margin-top:10px"><button class="btn sm" id="dup" type="button">Duplicate drip</button><button class="btn sm danger" id="del" type="button">Delete drip</button></div>') + '</section>';
    $('#insp').innerHTML = h;
    if (ro) $$('#insp input,#insp select,#insp textarea').forEach(function (x) { x.disabled = true; });
    var w = $('#fitwarn'), hd = $('#box .d-head'); if (w && hd) w.hidden = hd.dataset.fit !== 'shrunk';
  }
  function addLayer(type, extra) {
    change(function (d) {
      var L;
      if (PRESET[type]) { L = clone(PRESET[type][1]); L.type = PRESET[type][0]; L.w = PRESET_W[L.type]; L.x = Math.round(540 - (L.w || 400) / 2); L.y = 420; if (L.type === 'link') { delete L.w; delete L.x; delete L.y; } L.cam = L.type !== 'link' && d.cam && d.cam !== 'front' ? true : undefined; }
      else { L = clone(DEFAULTS[type] || {}); L.type = type; }
      Object.keys(extra || {}).forEach(function (k) { L[k] = extra[k]; });
      var ind = (catObj(d.cat) || {}).industry; if (ind && L.from) L.from = 'industry:' + ind;
      if (L.z == null) L.z = Math.max.apply(null, zs().concat([10])) + 1;
      d.layers = d.layers || []; d.layers.push(L); st.sel = d.layers.length - 1; st.multi = [];
    }, { insp: true, now: true });
    if (type === 'person' || type === 'shot' || type === 'img') toast('Drop an image on it, or use "Replace image"');
  }

  /* design panel actions */
  function ensureV3(d) {
    if (!d.bg || typeof d.bg !== 'object') { d.bg = { style: 'aurora', palette: 'blue', seed: Math.floor(Math.random() * 1e6) }; delete d.ground; delete d.grid; }
  }
  function stdFrame(d) {
    if (d.brand) { d.badge = d.brand.badge === 'none' ? '' : d.brand.badge || 'ready'; delete d.brand; }
    if (d.copy) ['x', 'y', 'w', 'fs', 'subFs', 'align', 'top', 'color'].forEach(function (k) { delete d.copy[k]; });
  }
  function recompose(look) {
    var d = cur(); if (!d.scene) return;
    snapshot();
    var sc = clone(d.scene); sc.look = Object.assign({}, sc.look || {}, look || {});
    sc.head = (d.copy && d.copy.head) || sc.head; sc.sub = (d.copy && d.copy.sub) || sc.sub;
    var n = K.compose(sc, { cat: d.cat, industry: (catObj(d.cat) || {}).industry });
    ['bg', 'cam', 'brand', 'badge', 'copy', 'layers', 'scene'].forEach(function (k) { if (n[k] === undefined) delete d[k]; else d[k] = n[k]; });
    st.sel = -1; st.multi = []; queueSave(d); drawCanvas(); renderInspector();
  }

  /* inspector inputs */
  document.addEventListener('input', function (e) {
    var t = e.target; if (!st.id || !t.closest('#insp') || !S.canWrite) return;
    if (t.id === 'ljson') return;
    var v = t.type === 'checkbox' ? t.checked : t.value;
    if (t.dataset.t === 'num') v = v === '' ? null : +v;
    if (t.dataset.t === 'tags') v = v.split(/[\s,]+/).filter(Boolean).map(function (x) { return x.charAt(0) === '#' ? x : '#' + x; });
    var soft = t.tagName === 'TEXTAREA' || t.type === 'text', o = { noHist: soft && burst() };
    if (t.id === 'd-badge2') { change(function (d) { if (d.brand) d.brand.badge = v || 'none'; else d.badge = v; }, { now: true }); return; }
    if (t.dataset.c) change(function (d) { d.copy = d.copy || {}; if (v === '' || v === null || v === false) delete d.copy[t.dataset.c]; else d.copy[t.dataset.c] = v; if (d.scene && (t.dataset.c === 'head' || t.dataset.c === 'sub')) d.scene[t.dataset.c] = v; }, o);
    else if (t.dataset.d) change(function (d) {
      var k = t.dataset.d;
      if ((v === '' && k !== 'ground') || v === false || (Array.isArray(v) && !v.length)) delete d[k]; else d[k] = v;
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
    if (ds.ctx) { ctxAct(ds.ctx); return; }
    if (ds.cat) { st.cat = ds.cat; showGallery(); return; }
    if (ds.open) { openDrip(ds.open); return; }
    if (ds.new) { openStarters(); return; }
    if (ds.gen) { openGenerate(); return; }
    if (ds.keep) { var k = lib.filter(function (x) { return x.id === ds.keep; })[0]; if (k) { delete k.draft; saveNow(k); toast('Kept in ' + catName(k.cat)); if (st.id) { drawCanvas(); renderInspector(); } else showGallery(); } return; }
    if (ds.keepall) { lib.forEach(function (x) { if (x.draft && (st.cat === 'all' || st.cat === 'drafts' || x.cat === st.cat)) { delete x.draft; saveNow(x); } }); toast('All drafts kept'); showGallery(); return; }
    if (ds.discard) { var g = lib.filter(function (x) { return x.id === ds.discard; })[0]; if (g) { removeDrip(g); toast('Discarded'); showGallery(); } return; }
    if (ds.add) { addLayer(ds.add, ds.pose ? { pose: ds.pose } : null); return; }
    if (ds.fmt) { change(function (d) { if (ds.fmt === '1:1') delete d.format; else d.format = ds.fmt; }, { now: true, insp: true }); return; }
    if (ds.clear) { change(function (d) { delete d.layers[st.sel][ds.clear]; }, { insp: true, now: true }); return; }
    if (ds.pick) { pickImage(); return; }
    if (ds.align) { doAlign(ds.align); return; }
    if (ds.dist) { doDist(ds.dist); return; }
    if (ds.fs) { change(function (d) { var hd = $('#box .d-head'), base = d.copy.fs || (hd ? parseFloat(getComputedStyle(hd).fontSize) : 80); d.copy.fs = Math.max(32, Math.min(140, Math.round(base + +ds.fs))); d.copy.subFs = Math.max(18, Math.round((d.copy.subFs || 29) + (+ds.fs) / 4)); }, { now: true, insp: true }); return; }
    if (ds.color) { change(function (d) { d.copy.color = ds.color === '#1F1F3D' ? undefined : ds.color; }, { now: true }); return; }
    if (ds.calign) { change(function (d) { var c = d.copy, cn = $('#box .d-copy'); if (c.x == null) { c.x = cn.offsetLeft; c.y = cn.offsetTop - (d.format === '4:5' ? 40 : 0); c.w = cn.offsetWidth; } c.align = ds.calign; }, { now: true }); return; }
    if (ds.bgs) { change(function (d) { ensureV3(d); d.bg.style = ds.bgs; if (ds.bgs === 'navy') d.bg.palette = 'night'; else if (d.bg.palette === 'night') d.bg.palette = 'blue'; if (d.scene) (d.scene.look = d.scene.look || {}).bg = ds.bgs; }, { now: true, insp: true }); return; }
    if (ds.pal) { change(function (d) { ensureV3(d); d.bg.palette = ds.pal; if (ds.pal === 'night') d.bg.style = 'navy'; else if (d.bg.style === 'navy') d.bg.style = 'aurora'; if (d.scene) (d.scene.look = d.scene.look || {}).palette = ds.pal; }, { now: true, insp: true }); return; }
    if (ds.reseed) { change(function (d) { ensureV3(d); d.bg.seed = Math.floor(Math.random() * 1e6); }, { now: true }); return; }
    if (ds.cam) { change(function (d) { d.cam = ds.cam; if (d.scene) (d.scene.look = d.scene.look || {}).camera = ds.cam; (d.layers || []).forEach(function (L) { if (L.cam == null && /^(window|ophone|graph|kpis|timeline|steps|chat|receipt|notif|stat|route|record|checklist|ba|phases|appflow|orbit|devices|site|code|serp)$/.test(L.type)) L.cam = true; }); }, { now: true, insp: true }); return; }
    if (ds.stdframe) { if (cur().scene) recompose({}); else change(function (d) { stdFrame(d); }, { now: true, insp: true }); toast('Standard frame: logo top left, badge top right, headline centred'); return; }
    if (ds.shuffle) { var d0 = cur(); var sc = K.shuffleLook(d0); recompose(sc.look); toast('New look: ' + [sc.look.camera, sc.look.bg, sc.look.palette].join(' · ')); return; }
    if (ds.tool) { if (ds.tool === 'edit') openPop(); else if (ds.tool === 'image') pickImage(); else layerAct(ds.tool === 'del' ? 'del' : ds.tool); return; }
    if (ds.lact) { layerAct(ds.lact, +t.closest('[data-li]').dataset.li); return; }
    if (ds.li != null && !e.target.closest('button')) { select(+ds.li, e.shiftKey); return; }
    switch (t.id) {
      case 'back': st.cat = st.cat === 'all' || st.cat === 'drafts' ? st.cat : (cur() ? cur().cat : st.cat); showGallery(); break;
      case 'zoom-in': st.zoom = Math.min(3, st.zoom * 1.25); fitCanvas(); placeTools(); break;
      case 'zoom-out': st.zoom = Math.max(.4, st.zoom / 1.25); fitCanvas(); placeTools(); break;
      case 'zoom-fit': st.zoom = 1; fitCanvas(); placeTools(); break;
      case 'addlayer': var av = $('#addtype').value.split(':'); addLayer(av[0], av[1] ? { pose: av[1] } : null); break;
      case 'ljson-apply':
        try { var obj = JSON.parse($('#ljson').value), old = cur().layers[st.sel]; if (obj.src === '(embedded image)') obj.src = old.src; change(function (d) { d.layers[st.sel] = obj; }, { insp: true, now: true }); }
        catch (err) { toast('That JSON has an error: ' + err.message); }
        break;
      case 'undo': undo(); break;
      case 'redo': redo(); break;
      case 'dup': var cp = clone(cur()); cp.id = uid(cp.id); cp.name = (cp.name || cp.id) + ' (copy)'; delete cp.draft; lib.push(cp); saveNow(cp); openDrip(cp.id); toast('Duplicated'); break;
      case 'del': confirmDelete(); break;
      case 'del-yes': var gone = cur(); removeDrip(gone); st.cat = gone.cat; showGallery(); toast('Deleted ' + (gone.name || gone.id)); break;
      case 'del-no': var cf = $('#confirm'); if (cf) cf.remove(); break;
      case 'png': exportPng(1); break;
      case 'png2': exportPng(2); break;
      case 'copycap': var dc = cur(); copyText((dc.caption || '') + ((dc.hashtags || []).length ? '\n\n' + dc.hashtags.join(' ') : '')); break;
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
    if (t.dataset && t.dataset.tool === 'view') change(function (d) { d.layers[st.sel].view = t.value; }, { insp: true, now: true });
  });
  function confirmDelete() {
    if ($('#confirm')) return;
    var c = document.createElement('div'); c.id = 'confirm'; c.className = 'confirm'; c.style.flexBasis = '100%';
    c.innerHTML = 'Delete "' + esc(cur().name || cur().id) + '" for everyone? <button class="btn sm danger" id="del-yes">Delete</button><button class="btn sm" id="del-no">Keep it</button>';
    ($('#del') ? $('#del').closest('.sec') : $('.ed-bar')).appendChild(c);
  }

  /* ---------- dialogs ---------- */
  function openDlg(html, wide) { var d = $('#dlg'); d.innerHTML = '<div class="dlg-card' + (wide ? ' wide' : '') + '" role="dialog" aria-modal="true">' + html + '</div>'; d.hidden = false; var f = $('button,select,input,textarea', d); if (f) f.focus(); }
  function closeDlg() { if (genCtl) return; $('#dlg').hidden = true; $('#dlg').innerHTML = ''; }
  $('#dlg').addEventListener('click', function (e) { if (e.target.id === 'dlg') closeDlg(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (!$('#dlg').hidden) closeDlg(); closeMenu(); } });

  /* ---------- new drip from a starter (no Claude) ---------- */
  function openStarters() {
    var c = catObj(st.cat), ind = c && c.industry || 'fnb', keys = Object.keys(ST);
    openDlg('<h2>New drip</h2><p>Pick a starter. Each one tells one story from technext.asia; restyle it from the Design panel, or edit anything on the canvas.</p>' +
      '<div class="row"><label class="f"><span>Category</span><select id="t-cat">' + opts(cats.map(function (x) { return x.id; }), c ? c.id : 'apps', cats.map(function (x) { return x.name; })) + '</select></label>' +
      '<label class="f"><span>Industry content</span><select id="t-ind">' + opts(INDUSTRIES, ind, INDUSTRIES.map(indName)) + '</select></label></div>' +
      '<div class="starters" id="t-grid"></div><div class="dlg-foot"><button class="btn" id="dlg-close" type="button">Cancel</button><button class="btn" id="t-blank" type="button">Blank drip</button></div>', true);
    function draw() {
      var indK = (catObj($('#t-cat').value) || {}).industry || $('#t-ind').value, g = $('#t-grid'); g.innerHTML = '';
      keys.forEach(function (k, n) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'stc'; b.dataset.st = k;
        b.innerHTML = '<span class="stc-t"></span><b>' + esc(ST[k].label) + '</b><small>' + esc(ST[k].about) + '</small>'; g.appendChild(b);
        setTimeout(function () { var dd = K.compose(ST[k].make(indK), { cat: $('#t-cat').value, industry: indK, index: n }); var el = R.render(dd); var box = b.querySelector('.stc-t'); box.appendChild(el); R.fit(box); el.style.transform = 'scale(' + (box.clientWidth / 1080) + ')'; }, 20 + n * 30);
      });
    }
    draw();
    $('#t-cat').addEventListener('change', function () { var cc = catObj(this.value); if (cc && cc.industry) $('#t-ind').value = cc.industry; draw(); });
    $('#t-ind').addEventListener('change', draw);
    $('#t-grid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-st]'); if (!b) return;
      var cat = $('#t-cat').value, indK = (catObj(cat) || {}).industry || $('#t-ind').value;
      var d = K.compose(ST[b.dataset.st].make(indK), { cat: cat, industry: indK, source: 'Starter: ' + ST[b.dataset.st].label });
      d.id = uid(d.name); d.createdAt = new Date().toISOString(); lib.push(d); saveNow(d); closeDlg(); openDrip(d.id); toast('Created "' + d.name + '"');
    });
    $('#t-blank').addEventListener('click', function () {
      var cat = $('#t-cat').value, d = { id: uid('new-drip'), cat: cat, name: 'New drip', v: 3, bg: { style: 'aurora', palette: 'blue', seed: Math.floor(Math.random() * 1e6) }, cam: 'front', badge: cat === 'services' ? '' : cat === 'odoo20' ? 'o20' : 'ready',
        copy: { head: 'Your headline,|*in blue.*', sub: 'One supporting line.' }, layers: [], createdAt: new Date().toISOString() };
      lib.push(d); saveNow(d); closeDlg(); openDrip(d.id);
    });
  }

  /* ---------- generate with Claude ---------- */
  var genCtl = null;
  function openGenerate() {
    var c = catObj(st.cat) || catObj('fnb') || cats[0], catIds = cats.map(function (x) { return x.id; });
    openDlg('<h2>' + sparkIcon() + ' Generate with Claude</h2><p>Claude reads the technext.asia content for the category and designs a set of posts. Each one gets its own story, Odoo screens with data that match the headline, workflow arrows, callouts and look (background, camera angle, layout). They arrive as drafts.</p>' +
      '<div class="row"><label class="f"><span>Category</span><select id="g-cat">' + opts(catIds, c.id, cats.map(function (x) { return x.name; })) + '</select></label>' +
      '<label class="f"><span>Industry focus</span><select id="g-ind">' + opts([''].concat(INDUSTRIES), c.industry || '', ['Any / none'].concat(INDUSTRIES.map(indName))) + '</select></label></div>' +
      '<div class="row"><label class="f"><span>How many posts</span><select id="g-n">' + opts(['3', '6', '9'], '6') + '</select></label>' +
      '<label class="f"><span>Model</span><select id="g-tier">' + opts(AI.TIERS.map(function (t) { return t[0]; }), 'default', AI.TIERS.map(function (t) { return t[1]; })) + '</select></label></div>' +
      '<div class="f"><span>Angles to cover</span><div class="angles">' + AI.ANGLES.map(function (a) { return '<label class="chk"><input type="checkbox" data-angle="' + a[0] + '" checked>' + esc(a[1]) + '</label>'; }).join('') + '</div></div>' +
      '<label class="f"><span>Brief (optional)</span><textarea id="g-brief" rows="2" placeholder="e.g. Restaurant groups with 3+ outlets; show POS, kitchen display and food cost."></textarea></label>' +
      '<div class="est" id="g-est"></div>' +
      '<div class="dlg-foot"><button class="btn" id="dlg-close" type="button">Cancel</button><button class="btn primary" id="g-go" type="button">Generate</button></div>', true);
    var syncAngles = function () {
      var cat = $('#g-cat').value, ind = $('#g-ind').value;
      $$('[data-angle]').forEach(function (b) {
        var a = b.dataset.angle, off = (a === 'web' && cat !== 'services') || (cat === 'services' && /workflow|beforeafter|odoo20|proof/.test(a)) || (!ind && /beforeafter|proof/.test(a) && cat !== 'services');
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
    card.innerHTML = '<h2>' + sparkIcon() + ' Claude is designing ' + o.count + ' posts</h2><p id="g-stage">Thinking… (the Balanced and Best models think for 10-60 seconds before writing)</p>' +
      '<div class="gbar"><i id="g-bar" style="width:4%"></i></div><div class="dlg-foot"><button class="btn" id="g-stop" type="button">Stop</button></div>';
    $('#g-stop').addEventListener('click', function () { if (genCtl) genCtl.abort(); });
    AI.generate(o, function (n) { $('#g-stage').textContent = 'Designing post ' + Math.min(n, o.count) + ' of ' + o.count + '…'; $('#g-bar').style.width = Math.max(8, Math.min(96, n / o.count * 96)) + '%'; }, genCtl.signal)
      .then(function (r) {
        genCtl = null;
        var gid = 'g' + Date.now().toString(36), made = [], scenes = K.diversify(r.concepts.slice(0, o.count), Date.now() % 1e6);
        scenes.forEach(function (sc, i) {
          var d = K.compose(sc, { cat: o.cat, industry: o.industry, index: i, source: 'Claude · ' + o.catName + (o.industry ? ' · ' + indName(o.industry) : '') + ' · ' + new Date().toISOString().slice(0, 10) });
          d.id = uid(d.name); d.draft = true; d.gen = gid; d.createdAt = new Date().toISOString(); d.order = lib.length + i;
          lib.push(d); made.push(d); saveNow(d);
        });
        var entry = { at: new Date().toISOString(), cat: o.cat, industry: o.industry, asked: o.count, made: made.length, tier: r.tier, input: r.input, output: r.output, ms: r.ms };
        usage.push(entry); S.logUsage(usage);
        $('.dlg-card').innerHTML = '<h2>' + made.length + ' drafts added to ' + esc(o.catName) + '</h2><p>Each post has its own design. Open any of them to edit, restyle it from the Design panel, or keep the ones you like.</p>' +
          '<div class="est"><b>This run:</b> about ' + nf(r.input) + ' tokens in + ' + nf(r.output) + ' out = <b>' + nf(r.input + r.output) + ' tokens</b> (estimate, ' + esc(tierName(r.tier)) + ' model, ' + Math.round(r.ms / 1000) + ' s).</div>' +
          '<div class="dlg-foot"><button class="btn" id="dlg-close" type="button">Close</button><button class="btn primary" id="g-review" type="button">Review drafts</button></div>';
        $('#g-review').addEventListener('click', function () { closeDlg(); st.cat = o.cat; showGallery(); });
        if (!st.id) showGallery();
      })
      .catch(function (e) {
        genCtl = null;
        var code = e && e.code, msg = {
          cancelled: 'Stopped. Nothing was added.', not_granted: 'Claude was not allowed for this page. Allow it when asked, then try again.', rate_limited: 'Claude is busy or your usage limit is reached. Try again in a few minutes.',
          invalid_json: 'Claude\'s answer could not be read as posts. Try again, or ask for fewer posts.', prompt_too_large: 'The request was too long. Remove the brief or pick fewer angles.',
          unavailable: 'Claude is only available inside the TechNext hub on claude.ai.', sampling_disabled: 'Claude is turned off for this account.', refused: 'Claude declined this request. Change the brief and try again.'
        }[code] || ('Something went wrong (' + (code || (e && e.message) || 'error') + '). Try again.');
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
      '<div class="usage-sum"><span><small>Generations</small><b>' + usage.length + '</b></span><span><small>Drafts designed</small><b>' + posts + '</b></span><span><small>Estimated tokens</small><b>' + nf(tot) + '</b></span><span><small>Typical 6-post run</small><b>≈ ' + nf(e6.input + e6.output) + '</b></span></div>' +
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
    if (location.protocol === 'file:') { openDlg('<h2>Export needs a server</h2><p>Browsers block image export for pages opened straight from a folder. Double-click <code>Open Drip Studio.bat</code>, use the live link, or run <code>python tools/render.py</code>.</p><div class="dlg-foot"><button class="btn primary" id="dlg-close">OK</button></div>'); return; }
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
  var ctx = document.createElement('div'); ctx.id = 'ctx'; ctx.className = 'ctx'; ctx.hidden = true; document.body.appendChild(ctx);
  $('#main').innerHTML = '<div class="gallery"><p class="empty">Loading the library…</p></div>';
  S.init(fileLib, clone(window.CATEGORIES || [])).then(function (r) {
    lib = r.lib; cats = r.cats; usage = r.usage;
    topbar(); S.on('caps', topbar);
    if (location.protocol !== 'file:' && S.mode !== 'hub') fetch('api/ping', { cache: 'no-store' }).then(function (x) { return x.ok ? x.json() : null; }).catch(function () { return null; }).then(function (j) { SERVER = !!(j && j.ok); if (SERVER) topbar(); });
    var hash = location.hash.slice(1);
    if (hash && lib.some(function (d) { return d.id === hash; })) openDrip(hash); else showGallery();
  });
})();
