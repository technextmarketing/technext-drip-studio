/* TechNext Drip Studio — the editor (v3).
   Every change is saved automatically (the claude.ai hub: shared database; elsewhere: this browser).
   Edits like a slide or website builder: click to select, Shift-click or drag a box to select several,
   drag to move with smart guides, corner to resize, top dot to rotate, double-click text to type in place,
   right-click for more. The Design panel restyles a whole post (background, camera, layout, logo). */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {}, R = window.TNDrip, AI = window.TNAI, S = window.TNStore, SP = window.TNSimple, ST = window.TNStarters;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var esc = R.esc;

  var POSES = SP.POSES;
  var ODOO = Object.keys(C.apps || {}).concat(['ai_app', 'industry_fsm', 'pos_restaurant', 'appointment', 'whatsapp', 'mail']).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
  var KIT = ['check', 'spark', 'search', 'sync', 'wifiOff', 'cloudOff', 'cloudOk'];
  var ICONS = KIT.concat(Object.keys(C.icons || {}).sort());
  var INDUSTRIES = Object.keys(C.industries || {});
  var indName = function (k) { var i = C.industries[k]; return i ? i.name : k; };
  var SITES = Object.keys(C.sites || {});
  var VIEWS = ['form', 'list', 'kanban', 'dashboard', 'planning', 'pos', 'kds', 'apps', 'discuss'], CARD_VIEWS = ['kanban', 'list', 'planning', 'kds', 'pos', 'dashboard'];

  var lib = [], cats = [], usage = [], fileLib = clone(window.DRIPS || []);
  var st = { cat: 'all', id: null, sel: -1, multi: [], zoom: 1, pick: null };
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
    el.textContent = kind === 'saving' ? 'Saving…' : kind === 'error' ? 'Not saved: check your connection' : kind === 'toobig' ? 'Not saved: too large' : kind === 'readonly' ? 'View only' : S.mode !== 'hub' ? 'Saved in this browser' : 'All changes saved';
  }
  S.on('saving', function () { setStatus('saving'); });
  S.on('saved', function () { if (!S.pending()) setStatus('saved'); });
  S.on('saveError', function (e) {
    if (e && e.code === 'too_big') { setStatus('toobig'); toast('Not saved: this drip is ' + Math.round(e.size / 1024) + ' KB, over the hub\'s 256 KB limit. Select the embedded photo and use Replace image, so it is uploaded instead.', 8000); return; }
    setStatus(e && e.code === 'invalid_argument' ? 'readonly' : 'error'); if (e && e.code === 'quota') toast('This browser is out of storage: remove large embedded images');
  });
  function queueSave(d) {
    if (!d) return;
    dirtyAt[d.id] = Date.now(); setStatus('saving');
    clearTimeout(saveT[d.id]);
    saveT[d.id] = setTimeout(function () { S.saveDrip(d, lib); }, 600);
  }
  function saveNow(d) { clearTimeout(saveT[d.id]); dirtyAt[d.id] = Date.now(); return S.saveDrip(d, lib); }
  function removeDrip(d) { lib.splice(lib.indexOf(d), 1); S.deleteDrip(d.id, lib); }
  function canon(v) { return JSON.stringify(v, function (k, x) { if (x && typeof x === 'object' && !Array.isArray(x)) { var o = {}; Object.keys(x).sort().forEach(function (kk) { if (x[kk] !== undefined && x[kk] !== null) o[kk] = x[kk]; }); return o; } return x; }); }
  function stripMeta(d) { var c = clone(d); delete c.updatedAt; return c; }
  S.on('remote', function (remote) {
    var changed = false, byId = {};
    remote.forEach(function (d) { byId[d.id] = d; });
    remote.forEach(function (d) {
      var i = lib.map(function (x) { return x.id; }).indexOf(d.id);
      if (Date.now() - (dirtyAt[d.id] || 0) < 4000) return;
      var a = i > -1 ? canon(stripMeta(lib[i])) : '', b = canon(stripMeta(d));
      if (a !== b) { if (i > -1) { var keep = lib[i]; Object.keys(keep).forEach(function (k) { delete keep[k]; }); Object.keys(d).forEach(function (k) { keep[k] = d[k]; }); } else lib.push(d); changed = true; }
    });
    lib.slice().forEach(function (d) { if (!byId[d.id] && Date.now() - (dirtyAt[d.id] || 0) > 4000) { lib.splice(lib.indexOf(d), 1); changed = true; } });
    if (!changed) return;
    if (st.id && !cur()) { toast('This drip was deleted by someone else'); showGallery(); return; }
    if (st.id) { if (!drag && !editing) { var cd = cur(); if (cd && st.sel !== 'copy' && !(cd.layers || [])[st.sel]) st.sel = -1; st.multi = st.multi.filter(function (k) { return cd && cd.layers && cd.layers[k]; }); drawCanvas(); renderInspector(); } } else showGallery();
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
    'card-kanban': ['appcard', { app: 'crm', view: 'kanban', title: 'Pipeline', crumb: 'CRM · Sales team', tag: '4 open deals', stages: [['New', [['Office fit-out', 'Sample Build Co', 'S$ 18,000', 'KL']]], ['Qualified', [['Warehouse barcodes', 'Sample Logistics', 'S$ 12,500', 'RS']]], ['Won', [['Accounting', 'Sample Foods', 'S$ 11,000', 'LT']]]], highlight: ['1.0'] }],
    'card-list': ['appcard', { app: 'account', view: 'list', title: 'Invoices', crumb: 'Accounting · Customers', cols: ['Number', 'Customer', 'Total', 'Status'], rows: [['INV/2026/0141', 'Sample Trading', 'S$ 3,313.60', 'Paid'], ['INV/2026/0142', 'Sample Foods', 'S$ 860.00', 'Sent'], ['INV/2026/0143', 'Sample Clinic', 'S$ 1,420.00', 'Late']], highlight: 2 }],
    'card-plan': ['appcard', { app: 'planning', view: 'planning', title: 'This week', crumb: 'Planning · Schedule', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], rows: [['Ravi S.', [[0, 2, 'Service'], [3, 1, 'Install']]], ['Mei Ling T.', [[1, 2, 'Repair']]], ['Daniel K.', [[0, 1, 'Survey'], [2, 3, 'Maintenance']]]] }],
    'card-kds': ['appcard', { app: 'pos_restaurant', view: 'kds', title: 'Kitchen display', crumb: 'POS · Main kitchen', tickets: [['Table 12', [['Laksa', '2'], ['Chicken rice', '1']], 'cooking', '2 min'], ['Table 7', [['Satay (10)', '1']], 'ready', '6 min']] }],
    qr: ['qr', { title: 'Table 12', text: 'Scan to order and pay', app: 'pos_restaurant' }],
    'doc-quote': ['doc', { kind: 'quote', partner: 'Sample Trading Pte Ltd', fields: [['Expiration', '15 Oct 2026']], lines: [['Office chair', '10', 'S$ 1,800.00'], ['Standing desk', '4', 'S$ 2,480.00']], total: 'S$ 4,665.20' }],
    'doc-order': ['doc', { kind: 'order', partner: 'Sample Trading Pte Ltd', lines: [['Office chair', '10', 'S$ 1,800.00']], total: 'S$ 1,962.00' }],
    'doc-invoice': ['doc', { kind: 'invoice', partner: 'Sample Foods Pte Ltd', fields: [['Due', '30 Oct 2026']], lines: [['Accounting set-up', '1', 'S$ 3,040.00']], total: 'S$ 3,313.60', ribbon: 'PAID' }],
    'doc-bill': ['doc', { kind: 'bill', partner: 'Sample Seafood Pte Ltd', lines: [['Prawns 2 kg', '6', 'S$ 192.00']], total: 'S$ 209.28', note: 'Filled by Odoo AI' }],
    'doc-po': ['doc', { kind: 'po', partner: 'Sample Supplier Pte Ltd', lines: [['Cement, 40 kg bags', '20', 'S$ 180.00']], total: 'S$ 196.20' }],
    'doc-delivery': ['doc', { kind: 'delivery', partner: 'Sample Cafe, Tampines', lines: [['Chicken rice (kg)', '20 / 20', ''], ['Laksa paste', '6 / 8', '']] }],
    'doc-compact': ['doc', { kind: 'invoice', compact: true, partner: 'Sample Foods Pte Ltd', total: 'S$ 3,313.60', ribbon: 'PAID' }],
    product: ['product', { name: 'Linen shirt', ref: '[LN-SHIRT-M] Apparel', icon: 'shirt', price: 'S$ 49.00', stock: [['On hand', '4 units'], ['Forecast', '64 units']], level: 12, tags: ['Reorder at 10'], badge: 'Low stock' }],
    workorder: ['workorder', { title: 'WO/00042 · Painting', sub: 'Oak dining table x20', status: 'In progress', timer: '00:24:10', steps: [['Cutting', 'done', '12:40'], ['Painting', 'now', 'Work center 2'], ['Packing', 'todo', '']], progress: 60, progressLabel: '12 of 20 done', btn: 'Mark as done' }],
    ticket: ['ticket', { title: '#1042 · Change address', sub: 'Sample Buyer · WhatsApp', stage: 'In progress', priority: 2, sla: '2h left', text: 'Can you deliver to our Tampines outlet instead?', assignee: 'Mei Ling T.', tags: ['Delivery'] }],
    calendar: ['calendar', { title: 'This week', sub: 'Appointments', tag: '6 booked', days: ['Mon 5', 'Tue 6', 'Wed 7', 'Thu 8', 'Fri 9'], from: 9, to: 15, events: [[0, 9, 1, 'Check-up'], [1, 10.5, 1.5, 'Dental'], [2, 13, 2, 'Surgery', '', 1], [4, 11, 1, 'Follow-up']] }],
    employee: ['employee', { name: 'Mei Ling T.', job: 'Sales Manager', dept: 'Sales · Singapore', rows: [['Manager', 'Ravi S.'], ['Leave', '2-4 Oct', 'Approved'], ['Payslip', 'September', 'Sent']] }],
    email: ['email', { subject: 'New arrivals, 20% off this week', from: 'From: Sample Store', headline: 'The linen *edit* is here', cta: 'Shop now', stats: [['42%', 'opened'], ['12%', 'clicked'], ['38', 'orders']] }],
    shop: ['shop', { brand: 'Sample Store', product: 'Linen shirt', category: 'Apparel', icon: 'shirt', price: 'S$ 49.00', rating: 4.5, reviews: '128 reviews', stock: 'In stock · ships today', options: ['S', 'M', 'L'], pick: 1, cart: '2' }],
    reconcile: ['reconcile', { title: 'Bank reconciliation', sub: 'DBS · September 2026', status: 'Reconciled', bank: ['24 Sep · PayNow', 'SAMPLE TRADING PTE LTD', 'S$ 4,665.20'], match: ['INV/2026/0142', 'Sample Trading Pte Ltd', 'S$ 4,665.20'], label: 'Matched by amount and reference', btn: 'Validate' }],
    approval: ['approval', { title: 'Purchase request', sub: 'Approvals · S$ 2,400', status: 'To approve', fields: [['Requested by', 'Mei Ling T.'], ['Amount', 'S$ 2,400']], approvers: [['Ravi S.', 'Approved'], ['Daniel K.', 'Waiting']] }],
    sheet: ['sheet', { title: 'Sales by outlet', tag: 'Live', formula: '=ODOO.PIVOT(1,"sales")', cols: ['Outlet', 'Sales', 'Orders'], rows: [['Orchard', 'S$ 42,100', '1,204'], ['Tampines', 'S$ 38,400', '1,118'], ['Total', 'S$ 80,500', '2,322']], totalRow: true }],
    docs: ['docs', { title: 'Finance · Inbox', sub: 'Documents', tag: '4 new', files: [['Bill Seafood.pdf', 'pdf', 'Bill', 1], ['Payslips Sep.xls', 'xls', 'HR'], ['Receipt 88.jpg', 'img', 'Expense'], ['Contract.doc', 'doc', 'Sign']] }],
    rating: ['rating', { stars: 5, text: 'Fixed on the first visit, and the invoice came the same day.', who: 'Daniel K.', meta: 'Rated the service' }],
    kcard: ['kcard', { app: 'crm', title: 'Office fit-out', sub: 'Sample Build Co', tags: ['Fit-out', 'Hot'], priority: 3, amount: 'S$ 18,000', owner: 'Ravi S.', activity: 'Call back today, 3 pm' }],
    pyramid: ['pyramid', { levels: [['Scale', 'Growth'], ['Marketing', 'Growth'], ['ERP', 'Sales · Ops · Admin']], hot: 2 }],
    groups: ['groups', { groups: [{ title: 'Sales & growth', apps: [['crm'], ['sale'], ['sign'], ['accountant']] }, { title: 'Operations', apps: [['stock'], ['industry_fsm'], ['hr'], ['project']] }], base: 'One database' }],
    stamp: ['stamp', { text: 'PAID', rot: -10 }], sticker: ['sticker', { text: 'New in|*Odoo 20*', rot: -8 }], ring: ['ring', { value: 78, label: 'Orders on time' }],
    avatars: ['avatars', { names: ['Mei Ling T.', 'Ravi S.', 'Daniel K.', 'Aisha R.'], more: '+8', label: 'Team SG' }], sticky: ['sticky', { text: 'Stock count? Odoo did it.', rot: -4 }],
    toggle: ['toggle', { text: 'Offline mode' }], button: ['button', { text: 'Confirm order' }], search: ['search', { query: 'late deliveries', filters: ['This week', 'Tampines'] }],
    barcode: ['barcode', { code: '8 88012 34567 1', label: 'Linen shirt · M' }], pin: ['pin', { label: 'Tampines' }], timer: ['timer', { time: '00:24:10', label: 'on this job' }],
    'scr-circle': ['scribble', { kind: 'circle', color: '#E5534B' }], 'scr-underline': ['scribble', { kind: 'underline' }], 'scr-arrow': ['scribble', { kind: 'arrow', color: '#3167CA' }], 'scr-check': ['scribble', { kind: 'check', color: '#21B799' }],
    scanner: ['scanner', { title: 'Scanned', text: 'LN-SHIRT-M x1' }],
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
    ['Odoo documents', [['doc-quote', 'Quotation'], ['doc-order', 'Sales order'], ['doc-invoice', 'Invoice (paid)'], ['doc-bill', 'Vendor bill'], ['doc-po', 'Purchase order'], ['doc-delivery', 'Delivery'], ['doc-compact', 'Small document']]],
    ['Odoo cards', [['card-kanban', 'Board (pipeline)'], ['card-list', 'List (invoices…)'], ['card-plan', 'Planning board'], ['card-kds', 'Kitchen tickets'], ['ph-form', 'Phone screen'], ['product', 'Product'], ['workorder', 'Work order'], ['ticket', 'Helpdesk ticket'], ['calendar', 'Calendar week'], ['employee', 'Employee'], ['email', 'Email campaign'], ['shop', 'Online shop page'], ['reconcile', 'Bank reconciliation'], ['approval', 'Approval'], ['sheet', 'Spreadsheet'], ['docs', 'Documents'], ['rating', 'Rating'], ['kcard', 'Lead card']]],
    ['Poster elements', [['stamp', 'Stamp'], ['sticker', 'Round sticker'], ['ring', 'Progress ring'], ['avatars', 'Team avatars'], ['sticky', 'Sticky note'], ['toggle', 'Toggle'], ['button', 'Big button'], ['search', 'Search bar'], ['barcode', 'Barcode'], ['pin', 'Map pin'], ['timer', 'Timer'], ['scanner', 'Barcode scanner'], ['pyramid', 'Growth pyramid'], ['groups', 'One-system map'], ['scr-circle', 'Scribble circle'], ['scr-underline', 'Scribble underline'], ['scr-arrow', 'Scribble arrow'], ['scr-check', 'Scribble tick']]],
    ['Industry props', []],
    ['Odoo windows', [['win-form', 'Form (quotation, bill…)'], ['win-list', 'List (invoices…)'], ['win-kanban', 'Kanban (pipeline)'], ['win-dash', 'Dashboard'], ['win-plan', 'Planning board'], ['win-pos', 'Point of Sale'], ['win-kds', 'Kitchen display'], ['win-apps', 'App home screen'], ['win-discuss', 'Discuss / Odoo AI']]],
    ['Charts & numbers', [['g-bar', 'Bar chart'], ['g-line', 'Line chart'], ['g-donut', 'Donut chart'], ['g-funnel', 'Funnel'], ['g-prog', 'Progress bars'], ['kpis', 'KPI tiles'], ['stat', 'Big number']]],
    ['Workflow', [['steps', 'Steps across apps'], ['timeline', 'Timeline'], ['link', 'Arrow with label'], ['appflow', 'How a record moves'], ['flow', 'Industry workflow (site)'], ['ba', 'Before / after (site)'], ['phases', 'Rollout phases (site)'], ['chart', 'Industry dashboard (site)']]],
    ['Cards', [['record', 'Record card'], ['checklist', 'Checklist'], ['notif', 'Notification'], ['chat', 'Chat (WhatsApp, web)'], ['receipt', 'Paper invoice'], ['qr', 'QR code card'], ['route', 'Delivery route'], ['orbit', 'App orbit'], ['apps', 'App cloud']]],
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
    prop: { x: 800, y: 700, w: 180, name: 'rocket' }, burst: { x: 240, y: 420, w: 600, z: 2 }, glow: { x: 240, y: 440, w: 600, z: 1 }, sphere: { x: 940, y: 640, w: 60, z: 6 }, halftone: { x: 600, y: 420, w: 500, z: 2 },
    scan: { x: 480, y: 560, w: 540 }, sparkles: { x: 880, y: 420, w: 110 }, storm: { x: 700, y: 430, w: 290 }, speed: { x: 60, y: 520, w: 260, z: 8 },
    confetti: { x: 140, y: 380, w: 800 }, arrow: { x: 480, y: 700, w: 130, kind: 'right' }, nosignal: { x: 680, y: 620, w: 120 }
  };
  var PRESET_W = { appcard: 820, qr: 260, doc: 520, product: 400, workorder: 520, ticket: 520, calendar: 660, employee: 420, email: 480, shop: 620, reconcile: 580, approval: 520, sheet: 580, docs: 580, rating: 420, kcard: 420, pyramid: 600, groups: 900, ring: 220, sticky: 280, search: 560, barcode: 320, scribble: 220, scanner: 240, sticker: 190, window: 700, ophone: 320, graph: 460, kpis: 640, timeline: 480, steps: 800, chat: 420, receipt: 340, notif: 440, stat: 320, route: 440 };

  /* ---------- rail ---------- */
  function renderRail() {
    if (st.id) {
      var h = '<h2>Add to the drip</h2><p class="rail-help">Click to drop it on the canvas, then drag it into place.</p>';
      ELEMENTS.forEach(function (g) {
        h += '<h2>' + esc(g[0]) + '</h2>';
        if (g[0] === 'Industry props') { var PR = window.TNProps; if (PR) { var ord = Object.keys(PR.BY_IND).concat(['any']); ord.forEach(function (k) { var list = k === 'any' ? PR.ANY : PR.BY_IND[k]; h += '<p class="rail-help" style="margin:6px 0 4px">' + esc(k === 'any' ? 'Any industry' : indName(k)) + '</p><div class="el-grid props">' + list.map(function (n) { return '<button class="el nexi prop" data-add="prop" data-name="' + n + '" title="' + n + '">' + PR.svg(n) + '<span>' + n + '</span></button>'; }).join('') + '</div>'; }); } return; }
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
  function inCatFn(d) { return st.cat === 'all' || (st.cat === 'drafts' ? d.draft : d.cat === st.cat); }
  function dlIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M4 19h16"/></svg>'; }
  var PNGQ = [['1', 'Standard · 1080 px'], ['2', 'HD · 2160 px'], ['3', 'Ultra · 3240 px']];
  function pngScale() { var v = 2; try { v = +localStorage.getItem('tn-drip-pngq') || 2; } catch (e) {} return [1, 2, 3].indexOf(v) > -1 ? v : 2; }
  function qualitySel(id) { return '<select class="sel" id="' + id + '" data-pngq="1" title="Image size" aria-label="Image size">' + opts(PNGQ.map(function (q) { return q[0]; }), String(pngScale()), PNGQ.map(function (q) { return q[1]; })) + '</select>'; }
  function showGallery() {
    st.id = null; st.sel = -1; st.multi = []; closePop(); closeMenu();
    $('#shell').classList.remove('editing'); $('#insp').hidden = true;
    renderRail();
    var list = lib.filter(inCatFn), drafts = list.filter(function (d) { return d.draft; }), kept = list.filter(function (d) { return !d.draft; });
    var c = catObj(st.cat), ind = c && c.industry && C.industries[c.industry];
    var head = st.cat === 'drafts' ? 'Drafts to review' : c ? c.name : 'All drips';
    var h = '<div class="gallery"><div class="gal-head"><div><h2>' + esc(head) + '</h2><p>' +
      (ind ? 'Workflow on technext.asia: ' + esc(ind.flow_title) : st.cat === 'drafts' ? 'Posts Claude designed. Keep the ones you like; everything is already saved.' : c ? esc(c.group) + ' · ' + list.length + ' drip' + (list.length === 1 ? '' : 's') : lib.length + ' drips across ' + cats.length + ' categories.') +
      '</p></div><span class="sp"></span>' + (list.length ? qualitySel('pngq2') + destSel(st.cat) + '<button class="btn" data-saveall="1" title="' + (toDrive(st.cat) ? 'Upload every drip shown here to Google Drive' : 'Save every drip shown here as PNG, in one zip') + '">' + dlIcon() + 'Save all</button>' + (st.pick ? '' : '<button class="btn" data-pickmode="1" title="Tick posts, then save them together">Select</button>') : '') +
      (S.canWrite ? '<button class="btn" data-gen="1">' + sparkIcon() + 'Generate with Claude</button><button class="btn primary" data-new="1">New drip</button>' : '') + '</div>';
    if (st.pick && list.length) h += '<div class="pickbar" id="pickbar"><b>0 selected</b><button class="btn sm" data-pickall="1" type="button">All</button><span class="sp"></span>' + (toDrive(st.cat) ? '<button class="btn sm primary" data-picksave="zip" type="button" disabled>' + dlIcon() + 'Upload to Google Drive</button>' : '<button class="btn sm primary" data-picksave="zip" type="button" disabled>' + dlIcon() + 'Save as one zip</button><button class="btn sm" data-picksave="png" type="button" disabled>' + dlIcon() + 'Save as separate PNGs</button>') + '<button class="btn sm ghost" data-pickdone="1" type="button">Done</button></div>';
    if (lib.length === 0 && S.mode === 'hub') h += '<div class="empty" style="margin-bottom:18px"><b>This hub is empty.</b> Import the starter drips, or generate new ones with Claude.' + (S.canWrite ? ' <button class="btn sm" id="import-starters">Import the starter drips</button>' : '') + '</div>';
    if (drafts.length && st.cat !== 'drafts') h += '<div class="sec-h"><h3>New from Claude <span class="tag">' + drafts.length + '</span></h3><span class="sp"></span>' + (S.canWrite ? '<button class="btn sm" data-keepall="1">Keep all</button>' : '') + '</div>' + cards(drafts, true);
    if (st.cat === 'drafts') h += cards(drafts, true);
    else h += (drafts.length ? '<div class="sec-h"><h3>Library</h3></div>' : '') + cards(kept, false, true);
    h += (list.length ? '' : '<p class="empty" style="margin-top:18px">Nothing here yet. Start a drip from a starter, or let Claude design a set' + (ind ? ' from the ' + esc(ind.name) + ' content on technext.asia.' : '.') + '</p>') + '</div>';
    $('#main').innerHTML = h;
    list.forEach(function (d) { var box = $('[data-thumb="' + d.id + '"]'); if (!box) return; box.appendChild(R.render(d)); R.fit(box); fitThumb(box); });
    document.fonts.ready.then(function () { $$('[data-thumb]').forEach(function (b) { R.fit(b); }); });
    pickBar();
  }
  /* selection: tick posts in the gallery, then save them together (one zip = one save prompt) */
  function togglePick(id, on) {
    if (!st.pick) return;
    if (on == null) on = !st.pick[id];
    if (on) st.pick[id] = true; else delete st.pick[id];
    var box = $('[data-thumb="' + id + '"]'), card = box && box.closest('.card');
    if (card) { card.classList.toggle('picked', on); var cb = $('[data-tick]', card); if (cb) cb.checked = on; }
    pickBar();
  }
  function picked() { return lib.filter(inCatFn).filter(function (d) { return st.pick && st.pick[d.id]; }); }
  function pickBar() {
    var bar = $('#pickbar'); if (!bar || !st.pick) return;
    var n = picked().length, all = lib.filter(inCatFn).length;
    $('b', bar).textContent = n + ' selected'; $('[data-pickall]', bar).textContent = n === all ? 'None' : 'All';
    $$('[data-picksave]', bar).forEach(function (b) { b.disabled = !n; });
  }
  function cards(list, drafts, withNew) {
    var h = '<div class="grid">';
    list.forEach(function (d) {
      h += '<div class="card' + (st.pick && st.pick[d.id] ? ' picked' : '') + '">' + (st.pick ? '<label class="pick" title="Select"><input type="checkbox" data-tick="' + esc(d.id) + '"' + (st.pick[d.id] ? ' checked' : '') + ' aria-label="Select ' + esc(d.name || d.id) + '"></label>' : '') + '<button class="thumb' + (d.format === '4:5' ? ' r45' : '') + '" data-open="' + esc(d.id) + '" data-thumb="' + esc(d.id) + '" aria-label="' + (st.pick ? 'Select ' : 'Edit ') + esc(d.name || d.id) + '"></button>' +
        '<span class="meta"><b>' + esc(d.name || d.id) + '</b>' + (st.cat === 'all' || st.cat === 'drafts' ? '<span class="tag">' + esc(catName(d.cat)) + '</span>' : '') + (d.drive && d.drive.url ? '<a class="indrive" href="' + esc(d.drive.url) + '" target="_blank" rel="noopener" title="In Google Drive › ' + esc(d.drive.folder || '') + ' (' + esc(String(d.drive.at || '').slice(0, 10)) + ')">In Drive</a>' : '') + '<button class="btn sm save" data-save="' + esc(d.id) + '" title="' + (toDrive(st.cat) ? 'Upload to Google Drive' : 'Save as PNG') + ' (' + PNGQ[pngScale() - 1][1] + ')" aria-label="Save ' + esc(d.name || d.id) + '">' + dlIcon() + 'Save</button></span>' +
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
      qualitySel('pngq') + destSel(cur() && cur().cat) + '<button class="btn sm primary" id="png">' + dlIcon() + saveLabel(cur() && cur().cat) + '</button></div>' +
      '<div class="canvas-wrap" id="wrap"><div class="canvas-box" id="box"></div><div class="guides" id="guides"></div><div class="marq" id="marq" hidden></div><div class="tools" id="tools" hidden></div>' +
      '<span class="hint">Click to select · drag to move · corners resize, sides change the width, the round handle rotates · double-click text to type · right-click for every option</span></div></div>';
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
    $$('#box .ed-sel').forEach(function (n) { n.classList.remove('ed-sel'); });
    $$('#box .hdl').forEach(function (n) { n.remove(); });
    var els = selEls(); $('#box').classList.toggle('multi', st.multi.length > 1); if (!els.length) { $('#tools').hidden = true; var hh = $('#hdls'); if (hh) hh.innerHTML = ''; return; }
    els.forEach(function (n) { n.classList.add('ed-sel'); });
    placeTools();
  }
  /* ---------- v9: Canva-style selection frame ----------
     One frame per selection, drawn in the overlay (#hdls) so it is never clipped. It is sized from the element's
     untransformed box and rotated with the element, so the handles sit on the real corners. Corners scale the element
     (the opposite corner stays put; Alt scales about the centre), the side pills change the width (text reflows) and
     the round handle below rotates. A badge shows the size or angle while dragging. */
  var ROT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/></svg>';
  var FRAME_HTML = '<span class="hdl h-nw" data-h="nw"></span><span class="hdl h-ne" data-h="ne"></span><span class="hdl h-se" data-h="se"></span><span class="hdl h-sw" data-h="sw"></span>' +
    '<span class="hdl h-w" data-h="w" title="Width (the text reflows)"></span><span class="hdl h-e" data-h="e" title="Width (the text reflows)"></span>' +
    '<span class="hdl h-rot" data-h="rot" title="Rotate (Shift snaps to 15°)">' + ROT_SVG + '</span><i class="rot-badge" hidden></i>';
  /* the layer's geometry in canvas px: its own box (ex,ey,ew,eh; transforms pivot on its centre), the box of what it
     actually draws in its own unrotated, unscaled coordinates (ox,oy = content centre minus box centre; cw,ch), its scale
     and rotation, and the content centre on the canvas (cx,cy). Content can be bigger or offset from the layer box. */
  function geomOf(n, L) {
    var S0 = +$('#box').dataset.s || 1, ew = n.offsetWidth, eh = n.offsetHeight, ex = n.offsetLeft, ey = n.offsetTop, s = (L && L.s) || 1, rot = (L && L.rot) || 0;
    var keep = n.style.transform; n.style.transform = 'none';
    var r = n.getBoundingClientRect(), u = { l: r.left, t: r.top, r: r.right, b: r.bottom }, kids = n.querySelectorAll('*');
    if (r.width < 2 || r.height < 2) u = { l: 1e9, t: 1e9, r: -1e9, b: -1e9 };
    for (var k = 0; k < kids.length && k < 400; k++) { var q = kids[k].getBoundingClientRect(); if (q.width < 1 || q.height < 1) continue; if (q.left < u.l) u.l = q.left; if (q.top < u.t) u.t = q.top; if (q.right > u.r) u.r = q.right; if (q.bottom > u.b) u.b = q.bottom; }
    n.style.transform = keep;
    if (u.r < u.l) u = { l: r.left, t: r.top, r: r.left + ew * S0, b: r.top + eh * S0 };
    var cw = (u.r - u.l) / S0, ch = (u.b - u.t) / S0, ox = ((u.l + u.r) / 2 - r.left) / S0 - ew / 2, oy = ((u.t + u.b) / 2 - r.top) / S0 - eh / 2;
    var rad = rot * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad), ecx = ex + ew / 2, ecy = ey + eh / 2;
    return { ex: ex, ey: ey, ew: ew, eh: eh, ecx: ecx, ecy: ecy, ox: ox, oy: oy, cw: cw, ch: ch, s: s, rot: rot,
      cx: ecx + s * (ox * c - oy * sn), cy: ecy + s * (ox * sn + oy * c), w: cw, h: ch };
  }
  /* the geometry measured at pointerdown, moved to where the node is now (cheap: no content measuring) */
  function liveGeom(g0, n, L) { var g = {}; for (var k in g0) g[k] = g0[k]; g.ex = n.offsetLeft; g.ey = n.offsetTop; g.ecx = g.ex + g.ew / 2; g.ecy = g.ey + g.eh / 2; g.s = (L && L.s) || 1; g.rot = (L && L.rot) || 0; var o = rv(g, g.ox, g.oy); g.cx = g.ecx + o[0]; g.cy = g.ecy + o[1]; return g; }
  /* rotate a local vector by the layer rotation and scale it */
  function rv(g, x, y, s, rot) { var rad = (rot == null ? g.rot : rot) * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad); s = s == null ? g.s : s; return [s * (x * c - y * sn), s * (x * sn + y * c)]; }
  /* place a layer so its content centre lands on (fx,fy) with scale s and rotation rot */
  function placeContent(L, n, g, fx, fy, s, rot) { var o = rv(g, g.ox, g.oy, s, rot); putAt(L, n, fx - o[0] - g.ew / 2, fy - o[1] - g.eh / 2, g.eh); }
  function placeHandles() {
    var wrap = $('#wrap'); if (!wrap) return;
    var h = $('#hdls'); if (!h) { h = document.createElement('div'); h.id = 'hdls'; h.className = 'hdls'; wrap.appendChild(h); }
    var d = cur(), els = selEls();
    if (!d || !S.canWrite || editing || !els.length) { h.innerHTML = ''; return; }
    var box = $('#box'), S0 = +box.dataset.s, dr = $('#box .drip').getBoundingClientRect(), wr = wrap.getBoundingClientRect(), ox = dr.left - wr.left, oy = dr.top - wr.top;
    var f = h.querySelector('.selframe');
    if (!f) { f = document.createElement('div'); f.className = 'selframe'; h.appendChild(f); }
    if (st.multi.length > 1) {
      var U = drag && drag.mode === 'move' && drag.U0 ? { x: drag.U0.x + (drag.ldx || 0), y: drag.U0.y + (drag.ldy || 0), w: drag.U0.w, h: drag.U0.h } : unionBox(st.multi); f.className = 'selframe multi'; f.innerHTML = '';
      f.style.cssText = 'left:' + (ox + U.x * S0) + 'px;top:' + (oy + U.y * S0) + 'px;width:' + (U.w * S0) + 'px;height:' + (U.h * S0) + 'px;transform:none';
      return;
    }
    var n = els[0], L = st.sel === 'copy' ? null : d.layers[st.sel];
    if (L && (L.type === 'link' || L.lock)) { h.innerHTML = ''; return; }
    var g = drag && drag.gLive && drag.i === st.sel ? drag.gLive : geomOf(n, L), cam = L && L.cam && d.cam && d.cam !== 'front';
    if (st.sel === 'copy') { var cr = n.getBoundingClientRect(); g = { cx: (cr.left + cr.width / 2 - dr.left) / S0, cy: (cr.top + cr.height / 2 - dr.top) / S0, w: cr.width / S0, h: cr.height / S0, s: 1, rot: 0 }; }
    if (cam) { var r = n.getBoundingClientRect(); g = { cx: (r.left + r.width / 2 - dr.left) / S0, cy: (r.top + r.height / 2 - dr.top) / S0, w: r.width / S0, h: r.height / S0, s: 1, rot: 0 }; }
    var cls = 'selframe' + (st.sel === 'copy' ? ' copy' : '') + (L && (L.w == null || AUTO[L.type]) ? ' nowidth' : '') + (cam ? ' cam' : '');
    if (f.className !== cls || !f.firstChild) { f.className = cls; f.innerHTML = FRAME_HTML; }
    f.style.cssText = 'left:' + (ox + g.cx * S0) + 'px;top:' + (oy + g.cy * S0) + 'px;width:' + (g.w * g.s * S0) + 'px;height:' + (g.h * g.s * S0) + 'px;transform:translate(-50%,-50%) rotate(' + g.rot + 'deg);--rot:' + g.rot + 'deg';
    setCursors(f, g.rot);
  }
  document.addEventListener('load', function (e) { if (st.id && !drag && e.target.closest && e.target.closest('#box')) { clearTimeout(placeHandles.t); placeHandles.t = setTimeout(function () { if (!drag) placeTools(); }, 60); } }, true);
  if (document.fonts) document.fonts.addEventListener('loadingdone', function () { if (st.id && !drag) placeTools(); });
  var CUR8 = ['ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize'];
  function setCursors(f, rot) {
    /* a handle's cursor follows the rotated edge it sits on */
    var base = { n: 0, ne: 45, e: 90, se: 135, s: 180, sw: 225, w: 270, nw: 315 };
    $$('.hdl', f).forEach(function (hd) { var k = hd.dataset.h; if (!(k in base)) return; var a = ((base[k] + rot) % 180 + 180) % 180; hd.style.cursor = CUR8[Math.round(a / 45) % 4]; });
  }
  function sizeBadge(t) { var b = $('#hdls .rot-badge'); if (!b) return; if (t == null) { b.hidden = true; return; } b.hidden = false; b.textContent = t; }
  /* write a new top-left for a layer and its node (bottom-anchored and 4:5 layers keep their own fields) */
  function putAt(L, n, x, y, h) {
    L.x = Math.round(x); n.style.left = L.x + 'px';
    if (L.b != null) { L.b = Math.round((drag ? drag.H : $('#box .drip').offsetHeight) - (y + h)); n.style.bottom = L.b + 'px'; }
    else { var ny = Math.round(y); if (drag && drag.tall) L.y45 = ny; else L.y = ny; n.style.top = ny + 'px'; }
  }
  var TEXTY = { pill: 1, chip: 1, note: 1, bubble: 1, text: 1, record: 1, phone: 1, checklist: 1, code: 1, site: 1, serp: 1, gauge: 1, ba: 1, orbit: 1, apps: 1, palette: 1, devices: 1, appflow: 1,
    appcard: 1, qr: 1, doc: 1, product: 1, workorder: 1, ticket: 1, calendar: 1, employee: 1, email: 1, shop: 1, reconcile: 1, approval: 1, sheet: 1, docs: 1, rating: 1, kcard: 1, pyramid: 1, groups: 1, stamp: 1, sticker: 1, ring: 1, avatars: 1, sticky: 1, toggle: 1, button: 1, search: 1, barcode: 1, pin: 1, timer: 1, scanner: 1, prop: 1, window: 1, ophone: 1, graph: 1, kpis: 1, timeline: 1, steps: 1, chat: 1, receipt: 1, notif: 1, stat: 1, route: 1, link: 1 };
  var IMAGEY = { person: 1, shot: 1, img: 1, phone: 1, nexi: 1 };
  var ALIGN_SVG = { l: 'M4 3v18M8 7h12M8 13h8', c: 'M12 3v18M6 7h12M8 13h8', r: 'M20 3v18M4 7h12M8 13h8', t: 'M3 4h18M7 8v12M13 8v8', m: 'M3 12h18M7 6v12M13 8v8', b: 'M3 20h18M7 4v12M13 8v8' };
  function ico(p) { return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' + '<path d="' + p + '"/></svg>'; }
  function placeTools() {
    placeHandles();
    var tb = $('#tools'); if (tb) { tb.hidden = true; return; }
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
        (L.type === 'window' || L.type === 'ophone' ? '<select data-tool="view" aria-label="Odoo view">' + opts(VIEWS, L.view) + '</select>' : L.type === 'appcard' ? '<select data-tool="view" aria-label="Odoo view">' + opts(CARD_VIEWS, L.view || 'kanban') + '</select>' : '') +
        '<button data-tool="lock">' + (L.lock ? 'Unlock' : 'Lock') + '</button><button data-tool="front" title="Bring forward (])">Forward</button><button data-tool="back" title="Send backward ([)">Backward</button><button data-tool="dup" title="Duplicate (Ctrl+D)">Duplicate</button><button data-tool="del" class="danger" title="Delete (Del)">Delete</button>';
    }
    t.innerHTML = h; t.hidden = false;
    var r = unionRect(els), w = wrap.getBoundingClientRect();
    var top = r.top - w.top - 86; if (top < 6) top = r.bottom - w.top + 26;
    var left = Math.max(6, Math.min(r.left - w.left + r.width / 2 - t.offsetWidth / 2, w.width - t.offsetWidth - 6));
    t.style.top = top + 'px'; t.style.left = left + 'px';
  }
  function unionRect(els) { var a = { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 }; els.forEach(function (n) { var r = visRect(n); a.left = Math.min(a.left, r.left); a.top = Math.min(a.top, r.top); a.right = Math.max(a.right, r.right); a.bottom = Math.max(a.bottom, r.bottom); }); a.width = a.right - a.left; a.height = a.bottom - a.top; return a; }
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
  function visRect(n) { var r = n.getBoundingClientRect(), u = { left: r.left, top: r.top, right: r.right, bottom: r.bottom }, kids = n.querySelectorAll('*'); if (r.width < 2 || r.height < 2) u = { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 }; for (var k = 0; k < kids.length && k < 400; k++) { var q = kids[k].getBoundingClientRect(); if (q.width < 1 || q.height < 1) continue; if (q.left < u.left) u.left = q.left; if (q.top < u.top) u.top = q.top; if (q.right > u.right) u.right = q.right; if (q.bottom > u.bottom) u.bottom = q.bottom; } if (u.right < u.left) u = { left: r.left, top: r.top, right: r.right, bottom: r.bottom }; u.width = u.right - u.left; u.height = u.bottom - u.top; return u; }
  function boxOf(n) { var s = +$('#box').dataset.s, dr = $('#box .drip').getBoundingClientRect(), r = visRect(n); return { x: (r.left - dr.left) / s, y: (r.top - dr.top) / s, w: r.width / s, h: r.height / s }; }
  function toCanvas(e) { var s = +$('#box').dataset.s, dr = $('#box .drip').getBoundingClientRect(); return [(e.clientX - dr.left) / s, (e.clientY - dr.top) / s]; }
  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest && e.target.closest('#ctx')) return;
    closeMenu();
    if (!st.id || !S.canWrite || e.button !== 0) return;
    if (editing && e.target.closest('[contenteditable]')) return;
    if (editing && editing.commit) editing.commit();
    var hdl = e.target.closest && e.target.closest('.hdl'), box = e.target.closest && e.target.closest('#box'); if (!box && !hdl) { if (!e.target.closest || !e.target.closest('#wrap')) return; }
    if (!box && !hdl) return;
    var n = hdl ? (st.sel === 'copy' ? $('#box .d-copy') : $('#box .L[data-i="' + st.sel + '"]')) : e.target.closest('.L:not(.locked), .d-copy');
    if (hdl && !n) return;
    box = box || $('#box');
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
    drag = { mode: hdl ? (i === 'copy' && /^(e|w)$/.test(hdl.dataset.h) ? 'cw' : hdl.dataset.h) : 'move', i: i, ids: ids, s: s, H: H, x0: e.clientX, y0: e.clientY, moved: false, tall: d.format === '4:5', start: {}, p0: toCanvas(e), cwLeft: !!(hdl && i === 'copy' && hdl.dataset.h === 'w') };
    if (i === 'copy') {
      var c = d.copy || {}, cn = $('#box .d-copy');
      drag.copy0 = { x: c.x != null ? c.x : cn.offsetLeft, y: c.x != null ? (c.y || 0) : cn.offsetTop - (drag.tall ? 40 : 0), w: c.w || cn.offsetWidth }; drag.n = cn; drag.box0 = boxOf(cn);
    } else {
      ids.forEach(function (k) { var L = d.layers[k], ln = $('#box .L[data-i="' + k + '"]'); drag.start[k] = { x: L.x || 0, y: drag.tall ? parseFloat(ln.style.top) || 0 : L.y || 0, b: L.b, x1: L.x1, y1: L.y1, x2: L.x2, y2: L.y2, n: ln }; });
      var L0 = d.layers[i]; drag.n = selEls().filter(function (x) { return +x.dataset.i === i; })[0] || n;
      drag.w0 = L0.w || drag.n.offsetWidth; drag.h0 = drag.n.offsetHeight; drag.s0 = L0.s || 1; drag.box0 = unionBox(ids); drag.U0 = drag.box0; drag.g0 = geomOf(drag.n, L0); drag.gLive = drag.g0;
      ids.forEach(function (k) { if (drag.start[k].n) drag.start[k].n.classList.add('lift'); });
      var r = drag.n.getBoundingClientRect(), dr0 = $('#box .drip').getBoundingClientRect(); drag.cx = r.left + r.width / 2; drag.cy = r.top + r.height / 2; if (drag.g0) { drag.cx = dr0.left + drag.g0.cx * s; drag.cy = dr0.top + drag.g0.cy * s; }
    }
    drag.others = $$('#box .L').filter(function (x) { return ids.indexOf(+x.dataset.i) < 0 && !x.classList.contains('L-glow') && !x.classList.contains('L-link') && !x.classList.contains('fx'); }).map(boxOf);
    if (i !== 'copy') drag.others.push(boxOf($('#box .d-copy')));
    $('#box').classList.add('dragging'); $('#tools').hidden = true;
    try { (hdl || n).setPointerCapture(e.pointerId); } catch (err) {}
  });
  function unionBox(ids) { var a = null; ids.forEach(function (k) { var n = $('#box .L[data-i="' + k + '"]'); if (!n) return; var b = boxOf(n); a = a ? { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), x1: Math.max(a.x + a.w, b.x + b.w), y1: Math.max(a.y + a.h, b.y + b.h) } : { x: b.x, y: b.y, x1: b.x + b.w, y1: b.y + b.h }; if (a) { a.w = a.x1 - a.x; a.h = a.y1 - a.y; } }); return a || { x: 0, y: 0, w: 1, h: 1 }; }
  function onMove(e) {
    if (!drag) return;
    if (drag.mode === 'marq') {
      if (!drag.moved && Math.abs(e.clientX - drag.cx0) + Math.abs(e.clientY - drag.cy0) < 4) return;
      drag.moved = true; var p = toCanvas(e), m = $('#marq'), wr = $('#wrap').getBoundingClientRect(), br = $('#box').getBoundingClientRect(), s = +$('#box').dataset.s;
      var x = Math.min(p[0], drag.x0), y = Math.min(p[1], drag.y0), w = Math.abs(p[0] - drag.x0), h = Math.abs(p[1] - drag.y0);
      m.hidden = false; m.style.left = (br.left - wr.left + x * s) + 'px'; m.style.top = (br.top - wr.top + y * s) + 'px'; m.style.width = w * s + 'px'; m.style.height = h * s + 'px';
      drag.rect = { x: x, y: y, x1: x + w, y1: y + h }; return;
    }
    var dx = (e.clientX - drag.x0) / drag.s, dy = (e.clientY - drag.y0) / drag.s;
    if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 4) return;
    if (!drag.moved) { snapshot(); drag.moved = true; }
    var fast = drag.lx != null && Math.hypot(e.clientX - drag.lx, e.clientY - drag.ly) / drag.s > 16; drag.lx = e.clientX; drag.ly = e.clientY;
    var d = cur();
    if (drag.i === 'copy') {
      d.copy = d.copy || {};
      if (drag.mode === 'cw') { var cdir = drag.cwLeft ? -1 : 1, nw2 = Math.max(160, Math.round(drag.copy0.w + dx * cdir)); d.copy.x = drag.cwLeft ? Math.round(drag.copy0.x + drag.copy0.w - nw2) : drag.copy0.x; d.copy.y = drag.copy0.y; d.copy.w = nw2; if (!d.copy.align) d.copy.align = 'center'; drag.n.style.left = d.copy.x + 'px'; drag.n.style.right = 'auto'; drag.n.style.width = d.copy.w + 'px'; placeHandles(); sizeBadge(nw2 + ' px wide'); return; }
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
    } else if (/^(nw|ne|se|sw)$/.test(drag.mode)) {
      /* a corner scales the element as a whole, like Canva: the opposite corner stays put (Alt: scale about the centre) */
      var g = drag.g0, p = toCanvas(e), kx = drag.mode.indexOf('e') > -1 ? -1 : 1, ky = drag.mode.indexOf('s') > -1 ? -1 : 1;
      var av = rv(g, kx * g.cw / 2, ky * g.ch / 2), ax = e.altKey ? g.cx : g.cx + av[0], ay = e.altKey ? g.cy : g.cy + av[1];
      var d0 = Math.hypot(drag.p0[0] - ax, drag.p0[1] - ay) || 1, d1 = Math.hypot(p[0] - ax, p[1] - ay);
      var s1 = Math.max(.15, Math.min(5, Math.round(g.s * d1 / d0 * 1000) / 1000));
      L.s = s1 === 1 ? undefined : s1; drag.n.style.transform = tf(L);
      placeContent(L, drag.n, g, ax + (g.cx - ax) * s1 / g.s, ay + (g.cy - ay) * s1 / g.s, s1);
      sizeBadge(Math.round(g.cw * s1) + ' × ' + Math.round(g.ch * s1) + (s1 !== 1 ? ' · ' + Math.round(s1 * 100) + '%' : ''));
    } else if (drag.mode === 'e' || drag.mode === 'w') {
      /* a side changes the width and the text reflows; the opposite side and the top edge stay put */
      var g2 = drag.g0, p2 = toCanvas(e), dir = drag.mode === 'e' ? 1 : -1, ux = rv(g2, 1, 0, 1);
      var along = ((p2[0] - drag.p0[0]) * ux[0] + (p2[1] - drag.p0[1]) * ux[1]) * dir, w1 = Math.max(40, Math.round(g2.ew + along / g2.s));
      L.w = w1; drag.n.style.width = w1 + 'px';
      var g3 = geomOf(drag.n, L), fv = rv(g2, -dir * g2.cw / 2, -g2.ch / 2), F = [g2.cx + fv[0], g2.cy + fv[1]], nv = rv(g3, -dir * g3.cw / 2, -g3.ch / 2);
      placeContent(L, drag.n, g3, F[0] - nv[0], F[1] - nv[1]); drag.gLive = liveGeom(g3, drag.n, L);
      sizeBadge(Math.round(g3.cw * g2.s) + ' px wide');
    } else if (drag.mode === 'rot') {
      /* the handle hangs below the element, so straight down is 0° */
      var ang = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx) * 180 / Math.PI - 90;
      if (ang > 180) ang -= 360; if (ang <= -180) ang += 360;
      if (e.shiftKey) ang = Math.round(ang / 15) * 15;
      else { var near = Math.round(ang / 90) * 90; ang = Math.abs(ang - near) < 4 ? near : Math.round(ang * 2) / 2; }
      if (ang === 180) ang = -180;
      L.rot = ang || undefined; drag.n.style.transform = tf(L);
      if (drag.g0 && (Math.abs(drag.g0.ox) > 1 || Math.abs(drag.g0.oy) > 1)) placeContent(L, drag.n, drag.g0, drag.g0.cx, drag.g0.cy, drag.g0.s, ang);
      sizeBadge((ang > 0 ? '+' : '') + ang + '°');
    }
    if (drag.mode === 'move') { drag.ldx = dx; drag.ldy = dy; }
    if (drag.g0 && drag.ids.length === 1) drag.gLive = drag.mode === 'e' || drag.mode === 'w' ? drag.gLive : liveGeom(drag.g0, drag.n, L);
    syncXY(); placeHandles();
  }
  document.addEventListener('pointermove', function (e) { if (!drag) return; drag.ev = e; if (drag.raf) return; drag.raf = requestAnimationFrame(function () { var dr = drag; if (!dr) return; dr.raf = 0; onMove(dr.ev); }); });
  function endDrag(e) {
    if (!drag) return;
    /* apply the release point itself, so the element lands exactly where the pointer let go
       (moves are drawn once per frame; the last one could still be waiting) */
    if (drag.raf) { clearTimeout(drag.raf); cancelAnimationFrame(drag.raf); drag.raf = 0; }
    if (e && e.type === 'pointerup' && e.clientX != null) { try { onMove(e); } catch (err) { console.error(err); } }
    $('#box').classList.remove('dragging'); showGuides([]); sizeBadge(null);
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
    $$('#box .lift').forEach(function (n) { n.classList.remove('lift'); });
    if (!dd.moved) { placeTools(); return; }
    queueSave(cur());
    /* the canvas already shows the new position, size and angle: redraw only when the render must change
       (the headline refits its text; arrow links are drawn from their end points) */
    var d = cur(), needs = dd.i === 'copy' || (dd.ids || []).some(function (k) { return d.layers[k] && d.layers[k].type === 'link'; });
    if (needs) drawCanvas(); else markSel();
    renderInspector();
  }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', endDrag);
  /* images and text inside the canvas never start a native drag (it would cancel the move halfway) */
  document.addEventListener('dragstart', function (e) { if (e.target.closest && e.target.closest('#box, #hdls')) e.preventDefault(); });
  var AUTO = { pill: 1, chip: 1, note: 1, bubble: 1, stamp: 1, avatars: 1, toggle: 1, button: 1, timer: 1, pin: 1 };
  function snap(b, dx, dy, H, others, off) {
    var lines = [], th = 4 / (+($('#box').dataset.s) || 1); if (off) return { dx: dx, dy: dy, lines: lines };
    var xs = [64, 540, 1016], ys = [H / 2, 64, H - 64], cx = b.x + dx + b.w / 2, cy = b.y + dy + b.h / 2;
    /* only the three nearest neighbours, so the element does not jump between dozens of lines */
    (others || []).map(function (o) { return { o: o, d: Math.hypot(o.x + o.w / 2 - cx, o.y + o.h / 2 - cy) }; }).filter(function (p) { return p.o.w > 8 && p.o.h > 8; })
      .forEach(function (p) { var o = p.o; xs.push(o.x, o.x + o.w / 2, o.x + o.w); ys.push(o.y, o.y + o.h / 2, o.y + o.h); });
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
    route: [['stops', 'Stops: place | time', 'rows'], ['hot', 'Current stop (0 = first)', 'num']], link: [['label', 'Label', 'text']], qr: [['title', 'Title', 'text'], ['text', 'Caption', 'text']],
    doc: [['label', 'Document label', 'text'], ['number', 'Number', 'text'], ['partner', 'Customer or vendor', 'text'], ['fields', 'Fields: label | value', 'rows'], ['lines', 'Lines: product | qty | amount', 'rows'], ['total', 'Total', 'text'], ['ribbon', 'Ribbon (PAID…)', 'text'], ['note', 'Note', 'text'], ['btns', 'Buttons, one per line', 'lines'], ['status', 'Status steps, one per line', 'lines']],
    product: [['name', 'Name', 'text'], ['ref', 'Reference', 'text'], ['price', 'Price', 'text'], ['stock', 'Stock: label | value', 'rows'], ['tags', 'Tags, one per line', 'lines'], ['badge', 'Badge', 'text']],
    workorder: [['title', 'Title', 'text'], ['sub', 'Product line', 'text'], ['status', 'Status', 'text'], ['timer', 'Timer', 'text'], ['timerLabel', 'Timer label', 'text'], ['steps', 'Steps: name | done, now or todo | detail', 'rows'], ['progressLabel', 'Progress label', 'text'], ['btn', 'Button', 'text']],
    ticket: [['title', 'Title', 'text'], ['sub', 'Customer · channel', 'text'], ['stage', 'Stage', 'text'], ['sla', 'SLA', 'text'], ['channel', 'Channel', 'text'], ['text', 'Message', 'area'], ['assignee', 'Assignee', 'text'], ['tags', 'Tags', 'lines']],
    calendar: [['title', 'Title', 'text'], ['sub', 'Subtitle', 'text'], ['tag', 'Tag', 'text'], ['days', 'Days, one per line', 'lines'], ['events', 'Events (JSON): [day, start hour, hours, label, colour, highlight]', 'json']],
    employee: [['name', 'Name', 'text'], ['job', 'Job', 'text'], ['dept', 'Department', 'text'], ['rows', 'Rows: label | value | status', 'rows']],
    email: [['from', 'From', 'text'], ['subject', 'Subject', 'text'], ['headline', 'Headline (*word*)', 'text'], ['cta', 'Button', 'text'], ['stats', 'Stats: value | label', 'rows']],
    shop: [['brand', 'Brand', 'text'], ['url', 'Address bar', 'text'], ['product', 'Product', 'text'], ['category', 'Category', 'text'], ['price', 'Price', 'text'], ['reviews', 'Reviews', 'text'], ['stock', 'Stock line', 'text'], ['options', 'Options, one per line', 'lines'], ['btn', 'Button', 'text'], ['cart', 'Cart count', 'text']],
    reconcile: [['title', 'Title', 'text'], ['sub', 'Subtitle', 'text'], ['status', 'Status', 'text'], ['bank', 'Bank line: date, payer, amount (3 lines)', 'lines'], ['match', 'Invoice: number, customer, amount (3 lines)', 'lines'], ['label', 'Match label', 'text'], ['btn', 'Button', 'text'], ['note', 'Note', 'text']],
    approval: [['title', 'Title', 'text'], ['sub', 'Subtitle', 'text'], ['status', 'Status', 'text'], ['fields', 'Fields: label | value', 'rows'], ['approvers', 'Approvers: name | state', 'rows'], ['btns', 'Buttons, one per line', 'lines']],
    sheet: [['title', 'Title', 'text'], ['tag', 'Tag', 'text'], ['formula', 'Formula', 'text'], ['cols', 'Columns, one per line', 'lines'], ['rows', 'Rows: a | b | c | d', 'rows']],
    docs: [['title', 'Title', 'text'], ['sub', 'Subtitle', 'text'], ['tag', 'Tag', 'text'], ['files', 'Files: name | pdf, xls, doc or img | tag', 'rows']],
    rating: [['text', 'Review', 'area'], ['who', 'Name', 'text'], ['meta', 'Detail', 'text']],
    kcard: [['title', 'Title', 'text'], ['sub', 'Customer', 'text'], ['amount', 'Amount', 'text'], ['owner', 'Owner', 'text'], ['tags', 'Tags, one per line', 'lines'], ['activity', 'Next activity', 'text']],
    pyramid: [['levels', 'Levels, top to bottom: title | sub', 'rows'], ['note', 'Note', 'text']], groups: [['groups', 'Groups (JSON)', 'json'], ['base', 'Base bar', 'text']],
    stamp: [['text', 'Text', 'text'], ['small', 'Second line', 'text']], sticker: [['text', 'Text (*blue*, | = new line)', 'text'], ['small', 'Small line', 'text']],
    ring: [['text', 'Centre text (blank = the value)', 'text'], ['label', 'Label', 'text']], avatars: [['names', 'Names, one per line', 'lines'], ['more', 'More (+8)', 'text'], ['label', 'Label', 'text']],
    sticky: [['text', 'Text', 'area']], toggle: [['text', 'Text', 'text']], button: [['text', 'Text', 'text']], search: [['query', 'Search', 'text'], ['filters', 'Filters, one per line', 'lines']],
    barcode: [['code', 'Code', 'text'], ['label', 'Label', 'text']], pin: [['label', 'Label', 'text']], timer: [['time', 'Time', 'text'], ['label', 'Label', 'text']], scanner: [['title', 'Title', 'text'], ['text', 'Text', 'text']], prop: [['label', 'Label', 'text']]
  };
  function popSpec(L) { if (!L) return POP.copy; if (L.type === 'appcard') return [['title', 'Title', 'text'], ['crumb', 'Breadcrumb', 'text'], ['tag', 'Tag', 'text']].concat((POPW[L.view || 'kanban'] || []).filter(function (f) { return f[0] !== 'crumbs'; })); if (L.type === 'window' || L.type === 'ophone') return [['appLabel', 'App name in the bar', 'text']].concat(POPW[L.view || 'form'] || []); return POP[L.type]; }
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

  /* ---------- v9: context menu with everything for the element, the text and the design ----------
     Right-click an element, the headline or the empty canvas. Items with a › open a submenu on hover (or on tap). */
  function mi(label, act, v, o) { o = o || {}; return { label: label, act: act, v: v, on: o.on, danger: o.danger, k: o.k, sw: o.sw }; }
  function sub(label, items) { items = (items || []).filter(Boolean); return items.length ? { label: label, sub: items } : null; }
  var SEP = { sep: true };
  function cap(x) { x = String(x || ''); return x.charAt(0).toUpperCase() + x.slice(1); }
  var STACKY = { doc: 1, appcard: 1, record: 1, product: 1, workorder: 1, ticket: 1, calendar: 1, employee: 1, email: 1, shop: 1, reconcile: 1, approval: 1, sheet: 1, docs: 1, rating: 1, kcard: 1, pyramid: 1, groups: 1, checklist: 1, graph: 1, kpis: 1, timeline: 1, chat: 1, receipt: 1, notif: 1, stat: 1, phone: 1, window: 1, flow: 1 };
  var PAGE_POS = [['l', 'Left edge'], ['c', 'Centre'], ['r', 'Right edge'], ['t', 'Under the subline'], ['m', 'Middle'], ['b', 'Bottom edge'], ['cc', 'Centre of the visual']];
  var ARRANGE = [mi('Bring to front', 'top'), mi('Bring forward', 'front', null, { k: ']' }), mi('Send backward', 'back', null, { k: '[' }), mi('Send to back', 'bottom')];
  function clipItems() { return [mi('Cut', 'cut', null, { k: 'Ctrl+X' }), mi('Copy', 'copy', null, { k: 'Ctrl+C' }), mi('Paste', 'paste', null, { k: 'Ctrl+V' }), mi('Duplicate', 'dup', null, { k: 'Ctrl+D' })]; }
  function designItems(d) {
    var c = d.copy || {};
    return [
      sub('Look', SP.LOOKS.map(function (x) { return mi(LOOKLAB[x], 'look', x, { on: (d.look || 'clean') === x }); })),
      sub('Accent colour', SP.ACCENTS.map(function (x) { return mi(cap(x), 'acc', x, { on: (d.accent || 'blue') === x, sw: ACCC[x] }); })),
      sub('Headline accent', SP.DECORS.map(function (x) { return mi(DECLAB[x], 'decor', x, { on: (c.decor || 'none') === x }); })),
      sub('Background pattern', [mi('None', 'pattern', '', { on: !d.pattern })].concat(SP.PATTERNS.map(function (x) { return mi(PATLAB[x], 'pattern', x, { on: d.pattern === x }); }))),
      sub('Tint', [mi('White', 'tint', '', { on: !d.tint })].concat(SP.TINTS.map(function (x) { return mi(cap(x), 'tint', x, { on: d.tint === x }); }))),
      sub('Floor', [['', 'Clean'], ['haze', 'Soft blue floor'], ['blobs', 'Blue shapes']].map(function (x) { var g = d.ground == null ? 'blobs' : String(d.ground); return mi(x[1], 'ground', x[0], { on: g === x[0] || (x[0] === 'blobs' && g.indexOf('blobs') === 0) }); })),
      sub('Odoo badge', [['ready', 'Odoo Ready Partner'], ['o20', 'Meet Odoo 20'], ['', 'None']].map(function (x) { var b = d.brand ? (d.brand.badge === 'none' ? '' : d.brand.badge || 'ready') : d.badge == null ? 'ready' : d.badge; return mi(x[1], 'badge', x[0], { on: b === x[0] }); })),
      d.post ? sub('Layout', [SP.canMirror(d.visual) ? mi('Mirror', 'mirror', null, { on: !!d.mirror }) : null, SP.hasVariants(d.visual) ? mi('Other arrangement', 'variant') : null, mi('Reset layout', 'relayout'), mi('Fresh design', 'fresh')]) : null,
      sub('Format', [mi('Square 1:1', 'fmt', '1:1', { on: (d.format || '1:1') === '1:1' }), mi('Portrait 4:5', 'fmt', '4:5', { on: d.format === '4:5' })])
    ];
  }
  var ADD_QUICK = [['pill', 'Pill'], ['chip', 'Chip'], ['note', 'Note'], ['bubble', 'Bubble'], ['text', 'Text'], ['sticker', 'Sticker'], ['stamp', 'Stamp'], ['sticky', 'Sticky note'], ['arrow', 'Arrow'], ['scribble', 'Scribble'], ['prop', 'Prop'], ['nexi', 'Nexi'], ['person', 'Photo'], ['doc', 'Odoo document'], ['record', 'Record card'], ['appcard', 'Odoo card'], ['graph', 'Chart'], ['stat', 'Big number'], ['sparkles', 'Sparkles']];
  function ctxItems(i, L, d) {
    var it;
    if (i === -1) {
      it = [mi('Paste', 'paste', null, { k: 'Ctrl+V' }), mi('Select all', 'selall', null, { k: 'Ctrl+A' }),
        sub('Add element', ADD_QUICK.map(function (x) { return mi(x[1], 'add', x[0]); })), SEP]
        .concat(designItems(d))
        .concat([SEP, mi('Undo', 'undo', null, { k: 'Ctrl+Z' }), mi('Redo', 'redo', null, { k: 'Ctrl+Shift+Z' }), mi('Save PNG', 'png')]);
      return it.filter(Boolean);
    }
    if (i === 'copy') {
      var c = d.copy || {};
      it = [mi('Edit headline…', 'edit', null, { k: 'Enter' }), SEP,
        sub('Text size', [mi('Bigger', 'fs', 4), mi('Smaller', 'fs', -4)]),
        sub('Colour', [['#1F1F3D', 'Ink'], ['#3167CA', 'Blue'], ['#FFFFFF', 'White']].map(function (x) { return mi(x[1], 'color', x[0], { on: (c.color || '#1F1F3D').toUpperCase() === x[0], sw: x[0] }); })),
        sub('Align', [mi('Left', 'calign', 'left', { on: c.align === 'left' }), mi('Centre', 'calign', 'center', { on: !c.align || c.align === 'center' })]),
        sub('Headline accent', SP.DECORS.map(function (x) { return mi(DECLAB[x], 'decor', x, { on: (c.decor || 'none') === x }); })),
        c.x != null || c.fs != null || c.color ? mi('Reset to the standard headline', 'stdframe') : null,
        SEP, mi('Paste', 'paste', null, { k: 'Ctrl+V' })];
      return it.filter(Boolean);
    }
    if (st.multi.length > 1) {
      it = [mi(st.multi.length + ' elements selected'), SEP,
        sub('Align', [['l', 'Left'], ['c', 'Centre'], ['r', 'Right'], ['t', 'Top'], ['m', 'Middle'], ['b', 'Bottom']].map(function (x) { return mi(x[1], 'align', x[0]); })),
        sub('Distribute', [mi('Across', 'dist', 'h'), mi('Down', 'dist', 'v')]),
        sub('Position on page', PAGE_POS.map(function (x) { return mi(x[1], 'page', x[0]); })),
        sub('Arrange', ARRANGE),
        sub('Size', [mi('Bigger', 'scale', 1.1), mi('Smaller', 'scale', 1 / 1.1), mi('Reset size', 'scale', 0)]),
        sub('Rotate', [mi('Rotate left 15°', 'rot', -15), mi('Rotate right 15°', 'rot', 15), mi('Straighten', 'rot', 0)]),
        mi('Lock', 'lock'), SEP].concat(clipItems()).concat([SEP, mi('Delete', 'del', null, { danger: true, k: 'Del' })]);
      return it.filter(Boolean);
    }
    var canW = L.w != null && !AUTO[L.type], texty = L.type === 'text' || L.type === 'note';
    it = [TEXTY[L.type] && popSpec(L) ? mi(L.type === 'text' ? 'Edit text…' : 'Edit text and data…', 'edit', null, { k: 'Enter' }) : null,
      IMAGEY[L.type] ? mi(L.type === 'nexi' ? 'Swap Nexi for a photo…' : 'Replace image…', 'image') : null,
      L.type === 'nexi' ? sub('Nexi pose', POSES.map(function (p) { return mi(cap(p), 'pose', p, { on: (L.pose || 'wave') === p }); })) : null,
      L.type === 'window' || L.type === 'ophone' ? sub('Odoo view', VIEWS.map(function (v) { return mi(v, 'view', v, { on: L.view === v }); })) : L.type === 'appcard' ? sub('Odoo view', CARD_VIEWS.map(function (v) { return mi(v, 'view', v, { on: (L.view || 'kanban') === v }); })) : null,
      L.type === 'prop' ? sub('Prop', ((window.TNProps || {}).names || []).map(function (p) { return mi(p, 'prop', p, { on: L.name === p }); })) : null,
      L.type === 'prop' ? mi(L.tile ? 'Without the white tile' : 'On a white tile', 'tile', null, { on: !!L.tile }) : null,
      texty ? sub('Text', [
        L.type === 'text' ? sub('Font', [['hand', 'Handwriting'], ['display', 'Display'], ['body', 'Body']].map(function (x) { return mi(x[1], 'font', x[0], { on: (L.font || 'display') === x[0] }); })) : null,
        sub('Text size', [mi('Bigger', 'tsize', 1.15), mi('Smaller', 'tsize', 1 / 1.15)]),
        L.type === 'text' ? sub('Align', [['left', 'Left'], ['center', 'Centre'], ['right', 'Right']].map(function (x) { return mi(x[1], 'talign', x[0], { on: (L.align || 'left') === x[0] }); })) : null,
        sub('Colour', [['', 'Default'], ['#1F1F3D', 'Ink'], ['#3167CA', 'Blue'], ['#FFFFFF', 'White'], ['#E5534B', 'Coral'], ['#21B799', 'Teal'], ['#714B67', 'Purple'], ['#FFC83D', 'Yellow']].map(function (x) { return mi(x[1], 'tcolor', x[0], { on: (L.color || '') === x[0], sw: x[0] || null }); }))
      ]) : null,
      SEP,
      sub('Size', [mi('Bigger', 'scale', 1.1), mi('Smaller', 'scale', 1 / 1.1), mi('Reset size', 'scale', 0, { on: !L.s })].concat(canW ? [SEP].concat([25, 33, 50, 66, 80, 92].map(function (p) { return mi(p + '% of the width', 'width', p); })) : [])),
      sub('Rotate', [mi('Rotate left 15°', 'rot', -15), mi('Rotate right 15°', 'rot', 15), mi('Straighten', 'rot', 0, { on: !L.rot }), SEP, mi('Flip horizontally', 'flip', null, { on: !!L.flip })]),
      sub('Position on page', PAGE_POS.map(function (x) { return mi(x[1], 'page', x[0]); })),
      sub('Arrange', ARRANGE),
      sub('Opacity', [100, 75, 50, 25].map(function (p) { return mi(p + '%', 'op', p / 100, { on: Math.round((L.op == null ? 1 : L.op) * 100) === p }); })),
      STACKY[L.type] ? sub('Paper sheets behind', [0, 1, 2].map(function (k) { return mi(k === 0 ? 'None' : k === 1 ? 'One sheet' : 'Two sheets', 'stack', k, { on: (L.stack || 0) === k }); })) : null,
      SEP, mi(L.lock ? 'Unlock' : 'Lock', 'lock', null, { on: !!L.lock }), mi(L.hide ? 'Show' : 'Hide', 'hide'),
      d.cam && d.cam !== 'front' ? mi(L.cam ? 'Stop following the camera' : 'Follow the camera angle', 'cam') : null,
      SEP].concat(clipItems()).concat([SEP, mi('Delete', 'del', null, { danger: true, k: 'Del' })]);
    return it.filter(Boolean);
  }
  function renderMenu(items) {
    return items.map(function (x) {
      if (!x) return '';
      if (x.sep) return '<hr>';
      if (x.sub) return '<div class="it sub"><button type="button" class="lab">' + esc(x.label) + '<span class="arr">›</span></button><div class="ctx-sub">' + renderMenu(x.sub) + '</div></div>';
      if (!x.act) return '<div class="it head">' + esc(x.label) + '</div>';
      return '<button type="button" class="it' + (x.on ? ' on' : '') + (x.danger ? ' danger' : '') + '" data-ctx="' + x.act + '"' + (x.v != null ? ' data-v="' + esc(String(x.v)) + '"' : '') + '>' +
        (x.sw ? '<i class="sw" style="--sw:' + esc(x.sw) + '"></i>' : '') + '<span>' + esc(x.label) + '</span>' + (x.k ? '<kbd>' + esc(x.k) + '</kbd>' : '') + '</button>';
    }).join('');
  }
  document.addEventListener('contextmenu', function (e) {
    var n = e.target.closest && e.target.closest('#box .L, #box .d-copy, #box, #hdls .hdl'); if (!n || !st.id || !S.canWrite) return;
    e.preventDefault();
    var i = n.classList.contains('hdl') ? st.sel : n.classList.contains('d-copy') ? 'copy' : n.classList.contains('L') ? +n.dataset.i : -1;
    if (i !== -1 && st.multi.indexOf(i) < 0 && st.sel !== i) select(i);
    var d = cur(), L = typeof i === 'number' && i > -1 ? d.layers[i] : null;
    openMenu(ctxItems(i, L, d), e.clientX, e.clientY);
  });
  function openMenu(items, x, y) {
    var m = $('#ctx'); if (!m) { m = document.createElement('div'); m.id = 'ctx'; m.className = 'ctx'; document.body.appendChild(m); }
    m.innerHTML = renderMenu(items); m.hidden = false; m.classList.remove('flip');
    var W0 = m.offsetWidth, H0 = m.offsetHeight;
    m.style.left = Math.max(4, Math.min(x, innerWidth - W0 - 8)) + 'px'; m.style.top = Math.max(4, Math.min(y, innerHeight - H0 - 8)) + 'px';
    if (x + W0 + 240 > innerWidth) m.classList.add('flip');
    $$('.it.sub', m).forEach(function (s) {
      s.addEventListener('mouseenter', function () { var sm = $('.ctx-sub', s); sm.classList.remove('up'); var r = sm.getBoundingClientRect(); if (r.bottom > innerHeight - 8) sm.classList.add('up'); });
    });
  }
  function closeMenu() { var m = $('#ctx'); if (m) { m.hidden = true; $$('.it.sub.open', m).forEach(function (s) { s.classList.remove('open'); }); } }
  function scaleLayer(L, f) { var s1 = f === 0 ? 1 : Math.max(.15, Math.min(5, Math.round((L.s || 1) * f * 1000) / 1000)); L.s = s1 === 1 ? undefined : s1; }
  function setWidthPct(L, dd, pct) {
    var n = $('#box .L[data-i="' + dd.layers.indexOf(L) + '"]'); if (!n || L.w == null || AUTO[L.type]) return;
    var g = geomOf(n, L), w1 = Math.max(40, Math.round(1080 * pct / 100 / g.s)); L.x = Math.round(g.cx - w1 / 2); L.w = w1;
  }
  function pagePos(k) {
    var ids = st.multi.length ? st.multi.slice() : st.sel > -1 && st.sel !== 'copy' ? [st.sel] : []; if (!ids.length) return;
    var H = $('#box .drip').offsetHeight, cb = $('#box .d-copy'), T = cb ? cb.offsetTop + cb.offsetHeight + 24 : 440, B = H - 36, U = unionBox(ids);
    change(function (dd) {
      var dx = 0, dy = 0;
      if (k === 'l') dx = 64 - U.x; if (k === 'r') dx = 1016 - (U.x + U.w); if (k === 'c' || k === 'cc') dx = 540 - (U.x + U.w / 2);
      if (k === 't') dy = T - U.y; if (k === 'b') dy = B - (U.y + U.h); if (k === 'm' || k === 'cc') dy = (T + B) / 2 - (U.y + U.h / 2);
      ids.forEach(function (i) { moveBy(dd.layers[i], dx, dy, dd); });
    }, { now: true, insp: true });
  }
  function ctxAct(a, v) {
    closeMenu();
    var d = cur(); if (!d) return;
    var ids = st.multi.length ? st.multi.slice() : st.sel > -1 && st.sel !== 'copy' ? [st.sel] : [];
    var each = function (fn) { if (!ids.length) return; change(function (dd) { ids.forEach(function (k) { if (dd.layers[k]) fn(dd.layers[k], dd); }); }, { now: true, insp: true }); };
    switch (a) {
      case 'edit': openPop(); break;
      case 'image': pickImage(); break;
      case 'add': addLayer(v, v === 'nexi' ? { pose: 'wave' } : null); break;
      case 'dup': case 'del': case 'lock': case 'hide': case 'front': case 'back': layerAct(a); break;
      case 'copy': copyLayers(); break;
      case 'cut': copyLayers(); layerAct('del'); break;
      case 'paste': pasteLayers(); break;
      case 'top': case 'bottom': change(function (dd) { var all = zs(); ids.forEach(function (k, n) { dd.layers[k].z = a === 'top' ? Math.max.apply(null, all) + 1 + n : Math.max(0, Math.min.apply(null, all) - 1 - n); }); }, { now: true, insp: true }); break;
      case 'selall': st.multi = d.layers.map(function (L, i) { return L.lock || L.type === 'glow' ? -1 : i; }).filter(function (i) { return i > -1; }); st.sel = st.multi.length ? st.multi[st.multi.length - 1] : -1; if (st.multi.length < 2) st.multi = []; markSel(); renderInspector(); break;
      case 'cam': each(function (L) { L.cam = !L.cam || undefined; }); break;
      case 'pose': each(function (L) { L.pose = v; }); break;
      case 'view': each(function (L) { L.view = v; }); break;
      case 'prop': each(function (L) { L.name = v; }); break;
      case 'tile': each(function (L) { L.tile = !L.tile || undefined; }); break;
      case 'font': each(function (L) { L.font = v; }); break;
      case 'talign': each(function (L) { L.align = v; }); break;
      case 'tcolor': each(function (L) { if (v) L.color = v; else delete L.color; }); break;
      case 'tsize': each(function (L) { var base = L.size || (L.type === 'note' ? 44 : 40); L.size = Math.max(10, Math.min(200, Math.round(base * +v))); }); break;
      case 'scale': each(function (L) { scaleLayer(L, +v); }); break;
      case 'width': each(function (L, dd) { setWidthPct(L, dd, +v); }); break;
      case 'rot': each(function (L) { var r = +v === 0 ? 0 : (L.rot || 0) + +v; r = ((r + 180) % 360 + 360) % 360 - 180; L.rot = r || undefined; }); break;
      case 'flip': each(function (L) { L.flip = !L.flip || undefined; }); break;
      case 'op': each(function (L) { L.op = +v === 1 ? undefined : +v; }); break;
      case 'stack': each(function (L) { L.stack = +v || undefined; }); break;
      case 'page': pagePos(v); break;
      case 'align': doAlign(v); break;
      case 'dist': doDist(v); break;
      case 'fs': change(function (dd) { dd.copy = dd.copy || {}; var hd = $('#box .d-head'), base = dd.copy.fs || (hd ? parseFloat(getComputedStyle(hd).fontSize) : 80); dd.copy.fs = Math.max(32, Math.min(140, Math.round(base + +v))); dd.copy.subFs = Math.max(18, Math.round((dd.copy.subFs || 29) + (+v) / 4)); }, { now: true, insp: true }); break;
      case 'color': change(function (dd) { dd.copy = dd.copy || {}; dd.copy.color = v === '#1F1F3D' ? undefined : v; }, { now: true }); break;
      case 'calign': change(function (dd) { var c = dd.copy = dd.copy || {}, cn = $('#box .d-copy'); if (c.x == null && cn) { c.x = cn.offsetLeft; c.y = cn.offsetTop - (dd.format === '4:5' ? 40 : 0); c.w = cn.offsetWidth; } c.align = v; }, { now: true }); break;
      case 'stdframe': change(function (dd) { stdFrame(dd); }, { now: true, insp: true }); toast('Standard headline: centred, standard size and colour'); break;
      case 'look': if (d.post) simpleRelayout({ look: v }); else change(function (dd) { if (v === 'clean') delete dd.look; else dd.look = v; }, { now: true, insp: true }); break;
      case 'acc': change(function (dd) { if (v === 'blue') delete dd.accent; else dd.accent = v; if (dd.post) dd.post.accent = v; }, { now: true, insp: true }); break;
      case 'decor': change(function (dd) { dd.copy = dd.copy || {}; if (v === 'none') delete dd.copy.decor; else dd.copy.decor = v; }, { now: true, insp: true }); break;
      case 'pattern': change(function (dd) { if (v) dd.pattern = v; else delete dd.pattern; }, { now: true, insp: true }); break;
      case 'tint': change(function (dd) { if (v) dd.tint = v; else delete dd.tint; }, { now: true, insp: true }); break;
      case 'ground': change(function (dd) { dd.ground = v; }, { now: true, insp: true }); break;
      case 'badge': change(function (dd) { if (dd.brand) dd.brand.badge = v || 'none'; else dd.badge = v; }, { now: true, insp: true }); break;
      case 'mirror': simpleRelayout({ mirror: !d.mirror }); break;
      case 'variant': simpleRelayout({ variant: (d.variant || 0) + 1 }); break;
      case 'relayout': simpleRelayout({}); toast('Layout reset'); break;
      case 'fresh': var fr = SP.fresh(d); simpleRelayout(fr); toast('Fresh design: ' + LOOKLAB[fr.look] + ' · ' + fr.accent + ' · ' + DECLAB[fr.decor] + ' · ' + PATLAB[fr.pattern]); break;
      case 'fmt': change(function (dd) { if (v === '1:1') delete dd.format; else dd.format = v; }, { now: true, insp: true }); break;
      case 'undo': undo(); break;
      case 'redo': redo(); break;
      case 'png': exportPng(d, pngScale()); break;
    }
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
    if (mod && k === 'x') { if (st.sel > -1 && st.sel !== 'copy') { e.preventDefault(); copyLayers(); layerAct('del'); } return; }
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
    nudge(ids, mv[0] * m, mv[1] * m);
  });
  function nudge(ids, dx, dy) {
    var d = cur(); if (!nudge.t) snapshot(); clearTimeout(nudge.t); nudge.t = setTimeout(function () { nudge.t = 0; renderInspector(); }, 500);
    var link = false;
    ids.forEach(function (i) {
      var L = d.layers[i], n = $('#box .L[data-i="' + i + '"]'); if (!L) return;
      moveBy(L, dx, dy, d); if (L.type === 'link' || !n) { link = true; return; }
      n.style.left = (L.x || 0) + 'px';
      if (L.b != null) n.style.bottom = L.b + 'px'; else n.style.top = (d.format === '4:5' && L.y45 != null ? L.y45 : (L.y || 0)) + 'px';
    });
    queueSave(d); if (link) drawCanvas(); else placeTools(); syncXY();
  }
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
  function loadImg(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(new Error('this image cannot be read here; use a PNG, JPG or WebP')); };
      im.src = url;
    });
  }
  function toBlob(cv, type, q) { return new Promise(function (res, rej) { cv.toBlob(function (b) { b ? res(b) : rej(new Error('the image could not be encoded')); }, type, q); }); }
  /* photos are resized before they are stored: the long side becomes `max` px; with `bytes` (an embedded copy) they shrink until they fit */
  function shrinkImage(file, o) {
    o = o || {};
    if (file.type === 'image/svg+xml') return Promise.resolve(file);
    return loadImg(file).then(function (im) {
      var w = im.naturalWidth || im.width, h = im.naturalHeight || im.height, max = o.max || 2400;
      if (!o.bytes && Math.max(w, h) <= max && /^image\/(png|jpeg|webp)$/.test(file.type)) return file;
      var pc = document.createElement('canvas'); pc.width = pc.height = 32; var px = pc.getContext('2d'); px.drawImage(im, 0, 0, 32, 32);
      var pd = px.getImageData(0, 0, 32, 32).data, alpha = false;
      for (var i = 3; i < pd.length; i += 4) if (pd[i] < 250) { alpha = true; break; }
      var tries = [];
      (o.bytes ? [max, 1100, 900, 700, 520] : [max]).forEach(function (mx) { (o.bytes ? [.85, .72, .6] : [.92]).forEach(function (q) { tries.push([mx, q]); }); });
      return tries.reduce(function (p, tr, k) {
        return p.then(function (found) {
          if (found) return found;
          var sc = Math.min(1, tr[0] / Math.max(w, h)), cw = Math.max(1, Math.round(w * sc)), chh = Math.max(1, Math.round(h * sc));
          var cv = document.createElement('canvas'); cv.width = cw; cv.height = chh; var cx = cv.getContext('2d'); cx.imageSmoothingQuality = 'high'; cx.drawImage(im, 0, 0, cw, chh);
          var type = o.bytes ? (alpha ? 'image/webp' : 'image/jpeg') : (alpha ? 'image/png' : 'image/jpeg');
          return toBlob(cv, type, type === 'image/png' ? undefined : tr[1]).then(function (b) { return !o.bytes || b.size <= o.bytes || k === tries.length - 1 ? b : null; });
        });
      }, Promise.resolve(null));
    });
  }
  function addImage(file) {
    if (!file || !/^image\//.test(file.type)) { toast('Use a PNG, JPG, WebP or SVG image'); return; }
    var embed = !S.assets, small = { max: 1400, bytes: 120e3 };
    toast(embed ? 'Preparing the image…' : 'Uploading…', 8000);
    shrinkImage(file, embed ? small : { max: 2400 })
      .then(function (b) { return S.uploadImage(b).catch(function (e) { if (embed) throw e; return shrinkImage(file, small).then(S.embed).then(function (u) { u.fallback = e; return u; }); }); })
      .then(function (url) {
        var fallback = url && url.fallback; if (fallback) url = String(url);
        change(function (d) {
          var L = d.layers[st.sel];
          if (L && L.type === 'nexi') { L.type = 'person'; delete L.pose; delete L.glow; L.src = url; }
          else if (L && /^(person|shot|img|phone)$/.test(L.type)) L.src = url;
          else { d.layers.push({ type: 'person', src: url, x: 560, y: 380, w: 480, z: Math.max.apply(null, zs().concat([10])) + 1 }); st.sel = d.layers.length - 1; }
        }, { insp: true, now: true });
        toast(fallback ? 'Image added as a small embedded copy (the upload failed: ' + (fallback.code || fallback.message || 'error') + ')' : 'Image added. Drag it into place.');
      })
      .catch(function (e) { toast('Could not add the image: ' + (e && (e.message || e.code) || e), 6000); });
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
    chat: [['channel', 'select', ['whatsapp', 'web', 'odoo']]], notif: [['app', 'odoo']], stat: [['variant', 'select', ['', 'big']], ['glass', 'check', 'Frosted glass']],
    link: [['x1', 'number'], ['y1', 'number'], ['x2', 'number'], ['y2', 'number'], ['bend', 'number', 'Bend (-0.6 to 0.6)'], ['tone', 'select', ['', 'blue', 'white']], ['color', 'text'], ['dash', 'check', 'Dashed', true], ['labelOnly', 'check', 'Label only (no arrow)']],
    nexi: [['pose', 'select', POSES], ['glow', 'check', 'Soft glow', true]],
    person: [['src', 'image'], ['sticker', 'check', 'White sticker outline'], ['fade', 'check', 'Fade the bottom edge']],
    img: [['src', 'image'], ['radius', 'number']], shot: [['src', 'image'], ['frame', 'select', ['', 'browser', 'laptop', 'tablet']], ['url', 'text']],
    phone: [['src', 'image'], ['app', 'odoo'], ['screen', 'select', ['odoo', 'offline-receipt']]], record: [['app', 'odoo'], ['statusOk', 'check', 'Green status']],
    flow: [['from', 'industry'], ['hot', 'number', 'Highlight step (0 = first)'], ['cols', 'number'], ['nodeW', 'number'], ['nodeH', 'number']],
    ba: [['from', 'industry'], ['n', 'number', 'Rows from the website']], phases: [['from', 'industry']], chart: [['from', 'industry'], ['view', 'number', 'Chart view (0 or 1)']],
    appflow: [['app', 'flowapp'], ['hot', 'number', 'Highlight state'], ['max', 'number', 'States shown'], ['handoffs', 'number', 'Hand-offs shown']],
    checklist: [['app', 'odoo'], ['variant', 'select', ['', 'old']], ['big', 'check', 'Large text'], ['from', 'industry'], ['max', 'number', 'Items shown']], appcard: [['app', 'odoo'], ['view', 'select', CARD_VIEWS], ['k', 'number', 'Text size (1.2 to 2.2)'], ['stack', 'number', 'Paper sheets behind (0-2)']], qr: [['app', 'odoo']],
    doc: [['kind', 'select', ['quote', 'order', 'invoice', 'bill', 'po', 'delivery', 'receipt']], ['app', 'odoo'], ['statusAt', 'number', 'Current status (0 = first)'], ['compact', 'check', 'Small version'], ['stack', 'number', 'Paper sheets behind (0-2)']],
    product: [['icon', 'select', (window.TNCards || {}).PICO || []], ['level', 'number', 'Stock level %'], ['stack', 'number', 'Paper sheets behind (0-2)']], workorder: [['app', 'odoo'], ['progress', 'number', 'Progress %'], ['stack', 'number', 'Paper sheets behind (0-2)']],
    ticket: [['app', 'odoo'], ['priority', 'number', 'Stars (0-3)']], calendar: [['app', 'odoo'], ['from', 'number', 'First hour'], ['to', 'number', 'Last hour'], ['today', 'number', 'Today (0 = first day)']],
    employee: [['app', 'odoo'], ['stack', 'number', 'Paper sheets behind (0-2)']], email: [['app', 'odoo'], ['color', 'text'], ['stack', 'number', 'Paper sheets behind (0-2)']], shop: [['icon', 'select', (window.TNCards || {}).PICO || []], ['rating', 'number', 'Stars']],
    reconcile: [['app', 'odoo']], approval: [['app', 'odoo']], sheet: [['app', 'odoo'], ['totalRow', 'check', 'Last row is a total']], docs: [['app', 'odoo']], rating: [['stars', 'number', 'Stars (1-5)']], kcard: [['app', 'odoo'], ['priority', 'number', 'Stars (0-3)']],
    pyramid: [['hot', 'number', 'Highlighted level (0 = top)']], stamp: [['tone', 'select', ['', 'b', 'r', 'o']]], sticker: [['tone', 'select', ['', 'blue', 'white', 'mint', 'pink']]],
    ring: [['value', 'number', 'Value %'], ['color', 'text'], ['plain', 'check', 'Without the card']], sticky: [['tone', 'select', ['', 'blue', 'mint', 'pink']]], toggle: [['on', 'check', 'Switched on', true]],
    button: [['tone', 'select', ['', 'blue', 'white', 'green']]], timer: [['tone', 'select', ['', 'light']]], scribble: [['kind', 'select', (window.TNCards || {}).SCRIB || []], ['color', 'text'], ['weight', 'number']],
    prop: [['name', 'select', (window.TNProps || {}).names || []], ['tile', 'check', 'White tile']], orbit: [['core', 'select', ['', 'odoo']]], apps: [['cols', 'number'], ['labels', 'check', 'Show labels']],
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
    appcard: 'Odoo card', qr: 'QR code', doc: 'Odoo document', product: 'Product', workorder: 'Work order', ticket: 'Ticket', calendar: 'Calendar', employee: 'Employee', email: 'Email campaign', shop: 'Shop page', reconcile: 'Reconciliation', approval: 'Approval', sheet: 'Spreadsheet', docs: 'Documents', rating: 'Rating', kcard: 'Lead card', pyramid: 'Pyramid', groups: 'One-system map', stamp: 'Stamp', sticker: 'Sticker', ring: 'Progress ring', avatars: 'Avatars', sticky: 'Sticky note', toggle: 'Toggle', button: 'Button', search: 'Search bar', barcode: 'Barcode', pin: 'Map pin', timer: 'Timer', scribble: 'Scribble', scanner: 'Scanner', prop: 'Prop', window: 'Odoo screen', ophone: 'Odoo on a phone', graph: 'Chart', kpis: 'KPI tiles', timeline: 'Timeline', steps: 'Steps', chat: 'Chat', receipt: 'Paper invoice', notif: 'Notification', stat: 'Big number', route: 'Route', link: 'Arrow link' };
  function layerLabel(L) {
    var t = L.text || L.title || L.label || L.record || (L.view && R.appName(L.app) + ' · ' + L.view) || L.head || L.pose || L.value || L.vendor || (L.from && indName(L.from.replace('industry:', ''))) || (L.app && R.appName(L.app)) || (L.site && C.sites[L.site] && C.sites[L.site].name) || L.kind || (L.src ? (L.src.indexOf('data:') === 0 ? 'embedded image' : L.src.split('/').pop()) : '');
    return String(t || '').replace(/[*~|=]/g, '');
  }
  var PATLAB = { dots: 'Dots', grid: 'Grid lines', fine: 'Fine grid', diagonal: 'Diagonal', rings: 'Rings', plus: 'Plus', hex: 'Hexagons', waves: 'Waves', spots: 'Light spots', floor: 'Floor grid' };
  var LOOKLAB = { clean: 'Clean', band: 'Blue panel', navy: 'Navy panel', corner: 'Blue corner', outline: 'Outline', paper: 'Paper', spotlight: 'Spotlight', stack: 'Desk stack' };
  var ACCC = { blue: '#3167CA', navy: '#1F1F3D', teal: '#21B799', coral: '#E5534B', purple: '#714B67', yellow: '#FFC83D' };
  var DECLAB = { none: 'None', circle: 'Circle', underline: 'Underline', marker: 'Marker', strokes: 'Strokes', box: 'Box' };
  function designPanel(d) {
    var b = d.brand || {}, V = d.post && SP.VIS[d.visual], g = d.bg && typeof d.bg === 'object' ? 'v3' : d.ground == null ? 'blobs' : String(d.ground);
    var badgeSel = '<label class="f"><span>Odoo badge (top right)</span><select id="d-badge2">' + opts(['ready', 'o20', ''], d.brand ? (b.badge === 'none' ? '' : b.badge || 'ready') : d.badge == null ? 'ready' : d.badge, ['Odoo Ready Partner', 'Meet Odoo 20', 'None']) + '</select></label>';
    var frame = d.brand || (d.copy && d.copy.x != null) ? '<div class="confirm" style="background:#FFF4D6;color:#7A5200">This drip uses a moved logo or headline. <button class="btn sm" data-stdframe="1">Use the standard frame</button></div>' : '';
    if (g === 'v3') return '<section class="sec design"><h3>Design<small>older v3 look</small></h3><div class="confirm" style="background:var(--blue-050);color:var(--blue-700)">This drip uses the v3 look (background shapes and a camera angle). <button class="btn sm primary" data-simplify="1">Switch to the clean style</button></div>' + frame + badgeSel + '</section>';
    return '<section class="sec design"><h3>Design<small>the frame stays; only the visual changes</small></h3>' +
      '<div class="f"><span>Background</span><div class="chips">' + [['', 'Clean'], ['haze', 'Soft blue floor'], ['blobs', 'Blue shapes']].map(function (o) { return '<button data-ground="' + o[0] + '"' + (g === o[0] || (o[0] === 'blobs' && g.indexOf('blobs') === 0) ? ' class="on"' : '') + '>' + o[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="f"><span>Pattern</span><div class="chips">' + [['', 'None']].concat(SP.PATTERNS.map(function (x) { return [x, PATLAB[x] || x]; })).map(function (o) { return '<button data-pattern="' + o[0] + '"' + ((d.pattern || '') === o[0] ? ' class="on"' : '') + '>' + o[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="f"><span>Tint</span><div class="chips">' + [['', 'White']].concat(SP.TINTS.map(function (x) { return [x, x.charAt(0).toUpperCase() + x.slice(1)]; })).map(function (o) { return '<button data-tint="' + o[0] + '"' + ((d.tint || '') === o[0] ? ' class="on"' : '') + '>' + o[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="f"><span>Look</span><div class="chips">' + SP.LOOKS.map(function (x) { return '<button data-look="' + x + '"' + ((d.look || 'clean') === x ? ' class="on"' : '') + ' title="' + esc(SP.LOOK_ABOUT[x]) + '">' + LOOKLAB[x] + '</button>'; }).join('') + '</div></div>' +
      '<div class="f"><span>Accent colour' + (SP.LOOK_ACC[d.look] ? ' · set by the look' : '') + '</span><div class="chips accs">' + SP.ACCENTS.map(function (x) { return '<button class="acc-sw' + ((d.accent || 'blue') === x ? ' on' : '') + '" data-acc="' + x + '" title="' + x + '" style="--c:' + ACCC[x] + '"></button>'; }).join('') + '</div></div>' +
      '<div class="f"><span>Headline accent</span><div class="chips">' + SP.DECORS.map(function (x) { return '<button data-decor="' + x + '"' + (((d.copy && d.copy.decor) || 'none') === x ? ' class="on"' : '') + '>' + DECLAB[x] + '</button>'; }).join('') + '</div></div>' +
      (V && d.visual !== 'free' ? '<div class="row"><div class="f"><span>Card size</span><div class="chips">' + SP.HERO.map(function (x) { return '<button data-hero="' + x + '"' + ((d.heroSize || 'normal') === x ? ' class="on"' : '') + '>' + x + '</button>'; }).join('') + '</div></div>' +
        '<div class="f"><span>Tilt</span><div class="chips">' + SP.TILTS.map(function (x) { return '<button data-tilt="' + x + '"' + ((d.tilt || 'soft') === x ? ' class="on"' : '') + '>' + x + '</button>'; }).join('') + '</div></div></div>' +
        '<div class="f"><button class="btn sm primary" data-fresh="1" type="button">' + sparkIcon() + 'Fresh design</button><p class="help" style="margin:6px 0 0">A look, colour, headline accent, pattern, size and tilt this post does not have yet.</p></div>' : '') +
      (V ? '<div class="f"><span>Layout · ' + esc(V.label) + '</span><div class="chips">' + (SP.canMirror(d.visual) ? '<button data-mirror="1"' + (d.mirror ? ' class="on"' : '') + '>Mirror</button>' : '') + (SP.hasVariants(d.visual) ? '<button data-variant="1">Other arrangement</button>' : '') +
        '<button data-relayout="1">Reset layout</button></div><p class="help" style="margin:6px 0 0">Rebuilds the visual from its content; moved or added elements go back to the standard layout.</p></div>' : '') +
      frame + badgeSel + '</section>';
  }
  function renderInspector() {
    var d = cur(); if (!d) return;
    var c = d.copy || (d.copy = {}), ro = !S.canWrite, h = '';
    var L = st.sel !== 'copy' && d.layers && d.layers[st.sel];
    if (st.multi.length > 1) h += '<section class="sec sel-sec"><h3>' + st.multi.length + ' elements<small>right-click to align</small></h3><p class="help" style="margin:0">Drag any of them to move all. Delete, Duplicate, Copy and the arrow keys work on all of them.</p></section>';
    else if (L) {
      h += '<section class="sec sel-sec"><h3>' + esc(ADDLAB[L.type] || L.type) + '<small>' + (TEXTY[L.type] ? 'double-click text on the canvas to edit' : 'selected') + '</small></h3>' +
        (TEXTY[L.type] ? '<button class="btn sm" type="button" data-tool="edit" style="margin-bottom:10px">Edit text and data…</button>' : '') +
        (L.type === 'link' ? '' : '<div class="row3">' + field('x', 'number', 'x', L.x || 0) + (L.b != null ? field('b', 'number', 'from bottom', L.b) : field('y', 'number', 'y', L.y || 0)) + field('w', 'number', 'width', L.w) + '</div>' +
        '<div class="row3">' + field('rot', 'number', 'rotate °', L.rot || 0) + field('s', 'number', 'scale', L.s == null ? '' : L.s) + field('op', 'number', 'opacity 0–1', L.op == null ? 1 : L.op) + '</div>') +
        (d.format === '4:5' && L.b == null && L.type !== 'link' ? field('y45', 'number', 'y in 4:5 (blank = y + 150 below the copy)', L.y45) : '') +
        '<div class="row">' + (d.cam && d.cam !== 'front' ? field('cam', 'check', 'Follow the camera', L.cam) : '') + field('lock', 'check', 'Lock', L.lock) + '</div>' +
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
  function stdFrame(d) {
    if (d.brand) { d.badge = d.brand.badge === 'none' ? '' : d.brand.badge || 'ready'; delete d.brand; }
    if (d.copy) ['x', 'y', 'w', 'fs', 'subFs', 'align', 'top', 'color'].forEach(function (k) { delete d.copy[k]; });
  }
  function toSimple(d) {
    delete d.bg; delete d.cam; delete d.scene; d.ground = SP.GROUND; stdFrame(d);
    (d.layers || []).forEach(function (L) { delete L.cam; });
  }
  function simpleRelayout(ch) {
    var d = cur(); if (!d || !d.post) return;
    snapshot();
    var n = SP.relayout(d, ch, { cat: d.cat, industry: d.industry || (catObj(d.cat) || {}).industry });
    ['layers', 'mirror', 'variant', 'visual', 'post', 'look', 'accent', 'heroSize', 'tilt', 'panelY', 'watermark', 'pattern', 'tint'].forEach(function (k) { if (n[k] === undefined) delete d[k]; else d[k] = n[k]; });
    d.copy = d.copy || {}; if (n.copy && n.copy.decor) d.copy.decor = n.copy.decor; else delete d.copy.decor;
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

  document.addEventListener('focusin', function (e) { if (e.target && e.target.matches && e.target.matches('select[data-dest]') && !driveFolders && driveAvail()) loadFolders().catch(function () {}); });
  /* clicks */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button,[data-li],select[data-tool]'); if (!t || t.tagName === 'SELECT') return;
    var ds = t.dataset;
    if (t.closest('#ctx')) { if (t.classList.contains('lab')) { var par = t.parentNode; $$('#ctx .it.sub.open').forEach(function (s) { if (s !== par && !s.contains(par)) s.classList.remove('open'); }); par.classList.toggle('open'); return; } if (ds.ctx) ctxAct(ds.ctx, ds.v); return; }
    if (ds.cat) { st.cat = ds.cat; st.pick = null; showGallery(); return; }
    if (ds.open) { if (st.pick && t.classList.contains('thumb')) togglePick(ds.open); else openDrip(ds.open); return; }
    if (ds.pickmode) { st.pick = {}; showGallery(); return; }
    if (ds.pickdone) { st.pick = null; showGallery(); return; }
    if (ds.pickall) { var pl = lib.filter(inCatFn), allOn = pl.every(function (d) { return st.pick[d.id]; }); pl.forEach(function (d) { togglePick(d.id, !allOn); }); return; }
    if (ds.picksave) { var pk = picked(); if (!pk.length) return; if (ds.picksave === 'zip') exportZip(pk, (st.cat === 'all' ? '' : st.cat + '-') + 'selected'); else pk.forEach(function (d) { exportPng(d, pngScale()); }); st.pick = null; showGallery(); return; }
    if (ds.savestop) { stopSaves(); return; }
    if (ds.new) { openStarters(); return; }
    if (ds.gen) { openGenerate(); return; }
    if (ds.genstop) { if (genCtl) genCtl.abort(); return; }
    if (ds.review) { var gb = $('#genbanner'); if (gb) gb.remove(); st.cat = ds.review; showGallery(); return; }
    if (ds.dismiss) { var gb2 = $('#genbanner'); if (gb2) gb2.remove(); return; }
    if (ds.keep) { var k = lib.filter(function (x) { return x.id === ds.keep; })[0]; if (k) { delete k.draft; saveNow(k); toast('Kept in ' + catName(k.cat)); if (st.id) { drawCanvas(); renderInspector(); } else showGallery(); } return; }
    if (ds.keepall) { lib.forEach(function (x) { if (x.draft && (st.cat === 'all' || st.cat === 'drafts' || x.cat === st.cat)) { delete x.draft; saveNow(x); } }); toast('All drafts kept'); showGallery(); return; }
    if (ds.discard) { var g = lib.filter(function (x) { return x.id === ds.discard; })[0]; if (g) { removeDrip(g); toast('Discarded'); showGallery(); } return; }
    if (ds.add) { addLayer(ds.add, ds.pose ? { pose: ds.pose } : ds.name ? { name: ds.name } : null); return; }
    if (ds.fmt) { change(function (d) { if (ds.fmt === '1:1') delete d.format; else d.format = ds.fmt; }, { now: true, insp: true }); return; }
    if (ds.clear) { change(function (d) { delete d.layers[st.sel][ds.clear]; }, { insp: true, now: true }); return; }
    if (ds.pick) { pickImage(); return; }
    if (ds.align) { doAlign(ds.align); return; }
    if (ds.dist) { doDist(ds.dist); return; }
    if (ds.fs) { change(function (d) { var hd = $('#box .d-head'), base = d.copy.fs || (hd ? parseFloat(getComputedStyle(hd).fontSize) : 80); d.copy.fs = Math.max(32, Math.min(140, Math.round(base + +ds.fs))); d.copy.subFs = Math.max(18, Math.round((d.copy.subFs || 29) + (+ds.fs) / 4)); }, { now: true, insp: true }); return; }
    if (ds.color) { change(function (d) { d.copy.color = ds.color === '#1F1F3D' ? undefined : ds.color; }, { now: true }); return; }
    if (ds.calign) { change(function (d) { var c = d.copy, cn = $('#box .d-copy'); if (c.x == null) { c.x = cn.offsetLeft; c.y = cn.offsetTop - (d.format === '4:5' ? 40 : 0); c.w = cn.offsetWidth; } c.align = ds.calign; }, { now: true }); return; }
    if (ds.ground !== undefined) { change(function (d) { d.ground = ds.ground; }, { now: true, insp: true }); return; }
    if (ds.pattern !== undefined) { change(function (d) { if (ds.pattern) d.pattern = ds.pattern; else delete d.pattern; }, { now: true, insp: true }); return; }
    if (ds.tint !== undefined) { change(function (d) { if (ds.tint) d.tint = ds.tint; else delete d.tint; }, { now: true, insp: true }); return; }
    if (ds.look) { if (cur().post) simpleRelayout({ look: ds.look }); else change(function (d) { if (ds.look === 'clean') delete d.look; else d.look = ds.look; }, { now: true, insp: true }); return; }
    if (ds.acc) { change(function (d) { if (ds.acc === 'blue') delete d.accent; else d.accent = ds.acc; if (d.post) d.post.accent = ds.acc; }, { now: true, insp: true }); return; }
    if (ds.decor) { change(function (d) { d.copy = d.copy || {}; if (ds.decor === 'none') delete d.copy.decor; else d.copy.decor = ds.decor; }, { now: true, insp: true }); return; }
    if (ds.hero) { simpleRelayout({ heroSize: ds.hero }); return; }
    if (ds.tilt) { simpleRelayout({ tilt: ds.tilt }); return; }
    if (ds.fresh) { var fr = SP.fresh(cur()); simpleRelayout(fr); toast('Fresh design: ' + LOOKLAB[fr.look] + ' · ' + fr.accent + ' · ' + DECLAB[fr.decor] + ' · ' + PATLAB[fr.pattern]); return; }
    if (ds.save) { var sd = lib.filter(function (x) { return x.id === ds.save; })[0]; if (sd) exportPng(sd, pngScale()); return; }
    if (ds.saveall) { exportZip(lib.filter(inCatFn), st.cat === 'all' ? 'all' : st.cat); return; }
    if (ds.mirror) { simpleRelayout({ mirror: !cur().mirror }); return; }
    if (ds.variant) { simpleRelayout({ variant: (cur().variant || 0) + 1 }); return; }
    if (ds.relayout) { simpleRelayout({}); toast('Layout reset'); return; }
    if (ds.simplify) { change(function (d) { toSimple(d); }, { now: true, insp: true }); toast('Clean style: no background shapes, no camera angle'); return; }
    if (ds.stdframe) { change(function (d) { stdFrame(d); }, { now: true, insp: true }); toast('Standard frame: logo top left, badge top right, headline centred'); return; }
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
      case 'png': exportPng(cur(), pngScale()); break;
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
    if (t.dataset && t.dataset.tick) { togglePick(t.dataset.tick, t.checked); return; }
    if (t.dataset && t.dataset.dest) { setDest(t.dataset.dest, t.value); refreshDest(); if (t.value !== 'local') loadFolders().catch(function (err) { toast(err.message || 'Google Drive is not available', 6000); }); return; }
    if (t.dataset && t.dataset.pngq) { try { localStorage.setItem('tn-drip-pngq', t.value); } catch (err) {} $$('[data-pngq]').forEach(function (x) { x.value = t.value; }); $$('[data-save]').forEach(function (b) { b.title = 'Save as PNG (' + PNGQ[+t.value - 1][1] + ')'; }); return; }
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
  function closeDlg() { $('#dlg').hidden = true; $('#dlg').innerHTML = ''; }
  $('#dlg').addEventListener('click', function (e) { if (e.target.id === 'dlg') closeDlg(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (!$('#dlg').hidden) closeDlg(); closeMenu(); } });

  /* ---------- new drip from a starter (no Claude) ---------- */
  function openStarters() {
    var c = catObj(st.cat), ind = c && c.industry || 'fnb', keys = Object.keys(ST);
    openDlg('<h2>New drip</h2><p>Pick a starter. Each one tells one story from technext.asia in the clean style; edit any word on the canvas, or mirror it from the Design panel.</p>' +
      '<div class="row"><label class="f"><span>Category</span><select id="t-cat">' + opts(cats.map(function (x) { return x.id; }), c ? c.id : 'apps', cats.map(function (x) { return x.name; })) + '</select></label>' +
      '<label class="f"><span>Industry content</span><select id="t-ind">' + opts(INDUSTRIES, ind, INDUSTRIES.map(indName)) + '</select></label></div>' +
      '<div class="starters" id="t-grid"></div><div class="dlg-foot"><button class="btn" id="dlg-close" type="button">Cancel</button><button class="btn" id="t-blank" type="button">Blank drip</button></div>', true);
    function draw() {
      var indK = (catObj($('#t-cat').value) || {}).industry || $('#t-ind').value, g = $('#t-grid'); g.innerHTML = '';
      keys.forEach(function (k, n) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'stc'; b.dataset.st = k;
        b.innerHTML = '<span class="stc-t"></span><b>' + esc(ST[k].label) + '</b><small>' + esc(ST[k].about) + '</small>'; g.appendChild(b);
        setTimeout(function () { var dd = SP.compose(ST[k].make(indK), { cat: $('#t-cat').value, industry: indK, index: n }); var el = R.render(dd); var box = b.querySelector('.stc-t'); box.appendChild(el); R.fit(box); el.style.transform = 'scale(' + (box.clientWidth / 1080) + ')'; }, 20 + n * 30);
      });
    }
    draw();
    $('#t-cat').addEventListener('change', function () { var cc = catObj(this.value); if (cc && cc.industry) $('#t-ind').value = cc.industry; draw(); });
    $('#t-ind').addEventListener('change', draw);
    $('#t-grid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-st]'); if (!b) return;
      var cat = $('#t-cat').value, indK = (catObj(cat) || {}).industry || $('#t-ind').value;
      var d = SP.compose(ST[b.dataset.st].make(indK), { cat: cat, industry: indK, source: 'Starter: ' + ST[b.dataset.st].label });
      d.id = uid(d.name); d.createdAt = new Date().toISOString(); lib.push(d); saveNow(d); closeDlg(); openDrip(d.id); toast('Created "' + d.name + '"');
    });
    $('#t-blank').addEventListener('click', function () {
      var cat = $('#t-cat').value, d = { id: uid('new-drip'), cat: cat, name: 'New drip', v: 4, ground: SP.GROUND, badge: cat === 'services' ? '' : cat === 'odoo20' ? 'o20' : 'ready',
        copy: { head: 'Your headline,|*in blue.*', sub: 'One supporting line.' }, layers: [], createdAt: new Date().toISOString() };
      lib.push(d); saveNow(d); closeDlg(); openDrip(d.id);
    });
  }

  /* ---------- generate with Claude ---------- */
  var genCtl = null;
  function openGenerate() {
    var c = catObj(st.cat) || catObj('fnb') || cats[0], catIds = cats.map(function (x) { return x.id; });
    openDlg('<h2>' + sparkIcon() + ' Generate with Claude</h2><p>Claude reads the technext.asia content for the category, writes a set of posts and lays each one out itself: its own story, hook and moment, its own composition, style, colour and elements. Only the frame stays. You can keep working while Claude designs; a banner and a chime tell you when the drafts are ready.</p>' +
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
    var cat = $('#g-cat').value, ind = $('#g-ind').value || (catObj(cat) || {}).industry || AI.detectIndustry($('#g-brief').value) || '';
    return { cat: cat, catName: catName(cat), industry: ind || null, count: +$('#g-n').value, tier: $('#g-tier').value, brief: $('#g-brief').value.trim(),
      angles: $$('[data-angle]').filter(function (b) { return b.checked; }).map(function (b) { return b.dataset.angle; }),
      existingDesigns: lib.filter(function (d) { return d.composition || d.visual; }).map(function (d) { return (d.style ? d.style + ': ' : '') + (d.composition || d.visual + (d.look ? ' + ' + d.look : '')); }).filter(function (v, i, a) { return a.indexOf(v) === i; }),
      existing: lib.slice().sort(function (a, b) { return (a.cat === cat ? 0 : 1) - (b.cat === cat ? 0 : 1); }).map(function (d) { return String(d.copy && d.copy.head || '').replace(/[*~|=]/g, ' ').replace(/\s+/g, ' ').trim(); }).filter(Boolean) };
  }
  function runGenerate() {
    var o = genOpts();
    if (!o.angles.length) { toast('Pick at least one angle'); return; }
    if (genCtl) { toast('Claude is still designing the previous set'); return; }
    genCtl = new AbortController(); o.seed = Date.now() % 1e9;
    askNotify(); closeDlg();
    genPill('Claude is thinking… keep working, the drafts arrive in the background', 4);
    AI.generate(o, function (n) { genPill('Designing post ' + Math.min(n, o.count) + ' of ' + o.count + '…', Math.max(8, Math.min(96, n / o.count * 96))); }, genCtl.signal)
      .then(function (r) {
        genCtl = null; genPill(null);
        var gid = 'g' + Date.now().toString(36), made = [], posts = SP.diversify(r.concepts.slice(0, o.count), o.seed, lib.filter(function (x) { return x.cat === o.cat; }));
        posts.forEach(function (sc, i) {
          var d = SP.compose(sc, { cat: o.cat, industry: o.industry, index: i, source: 'Claude · ' + o.catName + (o.industry ? ' · ' + indName(o.industry) : '') + ' · ' + new Date().toISOString().slice(0, 10) });
          d.id = uid(d.name); d.draft = true; d.gen = gid; d.createdAt = new Date().toISOString(); d.order = lib.length + i;
          lib.push(d); made.push(d); saveNow(d);
        });
        var entry = { at: new Date().toISOString(), cat: o.cat, industry: o.industry, asked: o.count, made: made.length, tier: r.tier, input: r.input, output: r.output, ms: r.ms };
        usage.push(entry); S.logUsage(usage);
        var msg = made.length + ' new draft' + (made.length === 1 ? '' : 's') + ' for ' + o.catName + (o.industry && (catObj(o.cat) || {}).industry !== o.industry ? ' · ' + indName(o.industry) : '') + ' are ready (about ' + nf(r.input + r.output) + ' tokens)';
        genBanner(msg, o.cat, false); chime(); notifyBrowser('Drafts ready', msg);
        if (!st.id) showGallery();
      })
      .catch(function (e) {
        genCtl = null; genPill(null);
        var code = e && e.code, msg = {
          cancelled: 'Stopped. Nothing was added.', not_granted: 'Claude was not allowed for this page. Allow it when asked, then try again.', rate_limited: 'Claude is busy or your usage limit is reached. Try again in a few minutes.',
          invalid_json: 'Claude\'s answer could not be read as posts. Try again, or ask for fewer posts.', prompt_too_large: 'The request was too long. Remove the brief or pick fewer angles.',
          unavailable: 'Claude is only available inside the TechNext hub on claude.ai.', sampling_disabled: 'Claude is turned off for this account.', refused: 'Claude declined this request. Change the brief and try again.'
        }[code] || ('Something went wrong (' + (code || (e && e.message) || 'error') + '). Try again.');
        genBanner('No drafts this time: ' + msg, null, true);
      });
  }
  function genPill(text, pct) {
    var p = $('#genpill'); if (!text) { if (p) p.remove(); return; }
    if (!p) { p = document.createElement('span'); p.id = 'genpill'; p.className = 'genpill'; p.innerHTML = '<i></i><span></span><button type="button" data-genstop="1">Stop</button>'; $('#topacts').insertBefore(p, $('#topacts').firstChild); }
    $('span', p).textContent = text; $('i', p).style.width = pct + '%';
  }
  function genBanner(msg, cat, isErr) {
    var b = $('#genbanner'); if (b) b.remove();
    b = document.createElement('div'); b.id = 'genbanner'; b.className = 'genbanner' + (isErr ? ' err' : ''); b.setAttribute('role', 'status');
    b.innerHTML = '<span>' + sparkIcon() + esc(msg) + '</span>' + (cat ? '<button class="btn sm primary" data-review="' + esc(cat) + '" type="button">Review drafts</button>' : '') + '<button class="btn sm ghost" data-dismiss="1" type="button" aria-label="Dismiss">✕</button>';
    document.body.appendChild(b);
  }
  function askNotify() { try { if (window.Notification && Notification.permission === 'default') Notification.requestPermission().catch(function () {}); } catch (e) {} }
  function notifyBrowser(title, body) { try { if (window.Notification && Notification.permission === 'granted') new Notification(title, { body: body }); } catch (e) {} }
  function chime() {
    try {
      var A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      var c = chime.c || (chime.c = new A()); if (c.state === 'suspended') c.resume();
      [[880, 0], [1175, .16]].forEach(function (n) {
        var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = n[0];
        g.gain.setValueAtTime(.0001, c.currentTime + n[1]); g.gain.exponentialRampToValueAtTime(.18, c.currentTime + n[1] + .02); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + n[1] + .38);
        o.connect(g); g.connect(c.destination); o.start(c.currentTime + n[1]); o.stop(c.currentTime + n[1] + .4);
      });
    } catch (e) {}
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
  /* ---------- saving PNGs: a queue, so any number of saves go through, one after another ----------
     In the hub every file is confirmed by the viewer's save prompt (name + size). The queue renders the
     next file while a prompt is open, waits when the platform pauses prompts, and never refuses a click.
     A zip is one prompt for many images; if a device caps the file size the zip is split by itself. */
  var saveQ = [], saveBusy = false, saveDone = 0, saveTotal = 0;
  function pngName(d, scale) { return d.id + (scale > 1 ? '@' + scale + 'x' : '') + (d.format === '4:5' ? '-4x5' : '') + '.png'; }
  function renderBlob(d, scale) {
    if (SERVER) return fetch('api/render', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ drip: d, scale: scale }) }).then(function (r) { if (!r.ok) throw new Error('render ' + r.status); return r.blob(); });
    return clientRender(d, scale);
  }
  function needsServer() {
    if (location.protocol !== 'file:') return false;
    openDlg('<h2>Export needs a server</h2><p>Browsers block image export for pages opened straight from a folder. Double-click <code>Open Drip Studio.bat</code>, use the live link, or run <code>python tools/render.py</code>.</p><div class="dlg-foot"><button class="btn primary" id="dlg-close">OK</button></div>');
    return true;
  }
  function sizeTxt(n) { return n >= 1048576 ? Math.round(n / 1048576 * 10) / 10 + ' MB' : Math.round(n / 1024) + ' KB'; }
  function savePill(text) {
    var p = $('#savepill'); if (!text) { if (p) p.remove(); return; }
    if (!p) { p = document.createElement('span'); p.id = 'savepill'; p.className = 'genpill save'; p.innerHTML = '<i></i><span></span><button type="button" data-savestop="1">Stop</button>'; $('#topacts').insertBefore(p, $('#topacts').firstChild); }
    $('span', p).textContent = (saveTotal > 1 ? (saveDone + 1) + ' of ' + saveTotal + ' · ' : '') + text;
    $('i', p).style.width = Math.round(saveDone / Math.max(1, saveTotal) * 100) + '%';
    $('button', p).hidden = saveQ.length === 0;
  }
  function queueExport(job) {
    if (needsServer()) return;
    saveQ.push(job); saveTotal++;
    if (saveBusy) { savePill($('#savepill span') ? $('#savepill span').textContent.replace(/^\d+ of \d+ · /, '') : 'Saving…'); toast('Queued ' + job.label + ' (' + saveQ.length + ' waiting)', 2500); return; }
    nextSave();
  }
  function nextSave() {
    var job = saveQ.shift();
    if (!job) { saveBusy = false; saveDone = saveTotal = 0; savePill(); return; }
    saveBusy = true;
    var progress = function (msg) { savePill(msg); };
    job.run(progress)
      .then(function (msg) { toast(msg, 4000); }, function (err) { toast('Could not save ' + job.label + ': ' + (err && (err.message || err.code) || err), 6000); })
      .then(function () { saveDone++; nextSave(); });
  }
  function stopSaves() { saveStopped = saveBusy; var n = saveQ.length; saveQ = []; saveTotal = saveDone + 1; savePill('Finishing this file…'); toast(n ? n + ' queued save' + (n === 1 ? '' : 's') + ' removed' : 'Nothing queued'); }
  function waiting(progress, name) { return { onWait: function (sec) { progress('Waiting for the save prompt for ' + name + ' (' + sec + ' s)…'); } }; }

  /* ---------- where saved PNGs go: the team's Google Drive Drips folder (hub) or this computer ----------
     The choice is per category and per viewer. "By category" picks the Drips subfolder that matches the
     drip's category (DRIVE_AUTO, then the category name); without a match the file goes to the Drips folder. */
  var DRIVE_AUTO = { odoo20: 'Meet Odoo 20', fnb: 'FnB', ecommerce: 'Ecommerce', manufacturing: 'Manufacturing', 'health-wellness': 'Health and Wellness', kitchen: 'Kitchen', 'field-service': 'Field Service', it: 'Information Technology' };
  var driveFolders = null, driveLoad = null;
  function driveAvail() { return !!(S.inViewer && S.drive); }
  function destKey(scope) { return 'tn-drip-dest:' + (scope || 'all'); }
  function getDest(scope) { var v = null; try { v = localStorage.getItem(destKey(scope)); } catch (e) {} if (!driveAvail()) return 'local'; return v || 'auto'; }
  function setDest(scope, v) { try { localStorage.setItem(destKey(scope), v); } catch (e) {} }
  function toDrive(scope) { return getDest(scope) !== 'local'; }
  function scopeOf(d) { return st.id ? (d ? d.cat : (cur() || {}).cat) : st.cat; }
  function loadFolders() {
    if (!driveAvail()) return Promise.reject(new Error('Google Drive is not available in this view'));
    if (driveFolders) return Promise.resolve(driveFolders);
    if (!driveLoad) driveLoad = S.driveFolders().then(function (f) { driveFolders = f; driveLoad = null; refreshDest(); return f; }, function (e) { driveLoad = null; throw e; });
    return driveLoad;
  }
  function folderFor(d, scope) {
    var v = getDest(scope), fs = driveFolders || [], root = { id: S.DRIVE_ROOT, title: S.DRIVE_ROOT_NAME };
    if (v === 'root') return root;
    if (v !== 'auto') { var hit = fs.filter(function (f) { return f.id === v; })[0]; return hit || root; }
    var names = [DRIVE_AUTO[d.cat], catName(d.cat)].filter(Boolean).map(function (x) { return x.toLowerCase(); });
    for (var i = 0; i < names.length; i++) { var m = fs.filter(function (f) { return f.title.toLowerCase() === names[i]; })[0]; if (m) return m; }
    return root;
  }
  function destSel(scope) {
    if (!driveAvail()) return '';
    var v = getDest(scope), fs = driveFolders || [];
    var o = [['auto', 'Drive · folder by category'], ['root', 'Drive · ' + S.DRIVE_ROOT_NAME]].concat(fs.map(function (f) { return [f.id, 'Drive · ' + S.DRIVE_ROOT_NAME + ' / ' + f.title]; }));
    if (v !== 'auto' && v !== 'root' && v !== 'local' && !fs.some(function (f) { return f.id === v; })) o.push([v, 'Drive · saved folder']);
    o.push(['local', 'This computer (download)']);
    return '<select class="sel dest" data-dest="' + esc(scope || 'all') + '" title="Where saved PNGs go" aria-label="Where saved PNGs go">' + o.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (x[0] === v ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') + '</select>';
  }
  function saveLabel(scope) { return toDrive(scope) ? 'Save to Drive' : 'Save PNG'; }
  function refreshDest() {
    $$('select[data-dest]').forEach(function (s) { var tmp = document.createElement('div'); tmp.innerHTML = destSel(s.dataset.dest); if (tmp.firstChild) s.innerHTML = tmp.firstChild.innerHTML; s.value = getDest(s.dataset.dest); });
    var png = $('#png'); if (png) png.innerHTML = dlIcon() + saveLabel(scopeOf());
    var sa = $('[data-saveall]'); if (sa) sa.title = toDrive(st.cat) ? 'Upload every drip shown here to Google Drive' : 'Save every drip shown here as PNG, in one zip';
  }
  function freeTitle(folderId, title) {
    var base = title.replace(/\.png$/, ''), k = 1;
    function next(t) { return S.driveTaken(folderId, t).then(function (taken) { if (!taken || k > 6) return t; k++; return next(base + '-' + k + '.png'); }); }
    return next(title);
  }
  function recordDrive(d, r, f) {
    if (!S.canWrite || !r || !r.id) return;
    d.drive = { id: r.id, url: r.url, folder: f.title, folderId: f.id, file: r.title, at: new Date().toISOString() };
    queueSave(d); if (!st.id) showGallery();
  }
  /* render-independent: upload one rendered PNG to the right folder */
  function uploadOne(d, blob, fname, scope, progress) {
    return loadFolders().catch(function (e) { if (e && e.mine && !e.fallback && getDest(scope) !== 'root') throw e; return null; }).then(function () {
      var f = folderFor(d, scope);
      progress('Uploading ' + fname + ' to Drive › ' + f.title + '…');
      return freeTitle(f.id, fname).then(function (title) { return S.driveUpload(f.id, title, blob); }).then(function (r) { recordDrive(d, r, f); return { r: r, f: f }; });
    });
  }
  function exportPng(d, scale) {
    if (!d) return;
    scale = scale || 2;
    var fname = pngName(d, scale), px = 1080 * scale, label = d.name || d.id, scope = scopeOf(d);
    queueExport({ label: label, run: function (progress) {
      progress('Rendering ' + label + ' at ' + px + ' px…');
      return renderBlob(d, scale).then(function (b) {
        var local = function () {
          progress('Save ' + fname + (S.inViewer ? ' · answer the prompt' : ''));
          return S.download(fname, b, waiting(progress, fname)).then(function (ok) { return ok ? 'Saved ' + fname + ' (' + sizeTxt(b.size) + (SERVER ? ', also in exports/' : '') + ')' : 'Save cancelled: ' + fname; });
        };
        if (!toDrive(scope)) return local();
        return uploadOne(d, b, fname, scope, progress).then(function (x) { return 'Uploaded ' + x.r.title + ' (' + sizeTxt(b.size) + ') to Google Drive › ' + x.f.title; },
          function (e) { if (e && e.fallback) { toast(e.message + ' Saving to this computer instead.', 5000); return local(); } throw e; });
      });
    } });
  }
  function uploadMany(list) {
    var scale = pngScale(), n = list.length, scope = st.cat, label = n + ' drip' + (n === 1 ? '' : 's') + ' → Google Drive';
    queueExport({ label: label, run: function (progress) {
      var ok = [], bad = [], where = {};
      return list.reduce(function (p, d, i) {
        return p.then(function () {
          if (saveStopped) return;
          progress('Rendering ' + (i + 1) + ' of ' + n + ': ' + (d.name || d.id));
          return renderBlob(d, scale).then(function (b) {
            return uploadOne(d, b, pngName(d, scale), scope, function (m) { progress((i + 1) + ' of ' + n + ' · ' + m); }).then(function (x) { ok.push(x.r.title); where[x.f.title] = 1; });
          }).catch(function (e) { bad.push((d.name || d.id) + ': ' + (e && (e.message || e.code) || e)); if (e && /needs_reauth|server_not_connected|server_not_found|not_in_manifest|blocked_by_policy|approval_required|unavailable|not_granted|capability_disabled/.test(e.code || '')) saveStopped = true; });
        });
      }, Promise.resolve()).then(function () {
        var stopped = saveStopped; saveStopped = false;
        var m = ok.length ? 'Uploaded ' + ok.length + ' of ' + n + ' to Google Drive › ' + Object.keys(where).join(', ') : 'Nothing uploaded';
        if (bad.length) m += ' · ' + bad.length + ' failed: ' + bad.slice(0, 2).join(' · ') + (bad.length > 2 ? '…' : '');
        if (stopped && ok.length + bad.length < n) m += ' · stopped';
        return m;
      });
    } });
  }
  var saveStopped = false;
  function loadZip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    return new Promise(function (res, rej) { var sc = document.createElement('script'); sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'; sc.onload = function () { res(window.JSZip); }; sc.onerror = function () { rej(new Error('The zip library could not load; save the posts one by one')); }; document.head.appendChild(sc); });
  }
  function exportZip(list, tag) {
    if (!list.length) return;
    if (toDrive(st.cat)) return uploadMany(list);
    var scale = pngScale(), n = list.length, zipName = 'technext-drips-' + tag + (scale > 1 ? '@' + scale + 'x' : '') + '.zip';
    queueExport({ label: zipName, run: function (progress) {
      return loadZip().then(function (JSZip) {
        var files = [];
        return list.reduce(function (p, d, i) { return p.then(function () { progress('Rendering ' + (i + 1) + ' of ' + n + ': ' + (d.name || d.id)); return renderBlob(d, scale).then(function (b) { files.push({ name: pngName(d, scale), blob: b }); }); }); }, Promise.resolve())
          .then(function () { return saveZip(JSZip, files, zipName, progress); }).then(function (r) { return zipMsg(r, zipName); });
      });
    } });
  }
  /* pack and save. If this device caps the file size (too_large: the Claude Android app, 200 MB), the
     images are saved as two smaller zips instead, and so on; every part is attempted. Resolves a tally. */
  function saveZip(JSZip, files, name, progress) {
    progress('Packing ' + files.length + ' image' + (files.length === 1 ? '' : 's') + '…');
    var zip = new JSZip(); files.forEach(function (f) { zip.file(f.name, f.blob); });
    return zip.generateAsync({ type: 'blob', compression: 'STORE' }).then(function (b) {
      progress('Save ' + name + (S.inViewer ? ' · answer the prompt' : ''));
      return S.download(name, b, waiting(progress, name)).then(function (ok) {
        return ok ? { saved: files.length, zips: 1, bytes: b.size, failed: [], cancelled: [] } : { saved: 0, zips: 0, bytes: 0, failed: [], cancelled: [name] };
      }, function (e) {
        if (!(e && e.code === 'too_large') || files.length < 2) throw e;
        var h = Math.ceil(files.length / 2), base = name.replace(/\.zip$/, '');
        var part = function (fs, sfx) { return saveZip(JSZip, fs, base + sfx + '.zip', progress).catch(function (e2) { return { saved: 0, zips: 0, bytes: 0, failed: [base + sfx + '.zip (' + (e2 && (e2.message || e2.code) || e2) + ')'], cancelled: [] }; }); };
        return part(files.slice(0, h), '-a').then(function (r1) { return part(files.slice(h), '-b').then(function (r2) {
          return { saved: r1.saved + r2.saved, zips: r1.zips + r2.zips, bytes: r1.bytes + r2.bytes, failed: r1.failed.concat(r2.failed), cancelled: r1.cancelled.concat(r2.cancelled) };
        }); });
      });
    });
  }
  function zipMsg(r, name) {
    if (!r.zips && !r.failed.length) return 'Save cancelled: ' + name;
    var m = r.zips ? 'Saved ' + r.saved + ' image' + (r.saved === 1 ? '' : 's') + ' (' + sizeTxt(r.bytes) + ')' + (r.zips > 1 ? ' as ' + r.zips + ' zips, because this device caps the file size' : ' as ' + name) : '';
    if (r.failed.length) m += (m ? ' · ' : '') + 'Could not save ' + r.failed.join('; ');
    if (r.cancelled.length) m += (m ? ' · ' : '') + 'Cancelled: ' + r.cancelled.join(', ');
    return m;
  }
  function saveLibraryFile() {
    var js = '/* TechNext Drip Studio — the drip library, saved from the studio on ' + new Date().toISOString().slice(0, 10) + '. See README.md. */\n\nwindow.CATEGORIES = ' + JSON.stringify(cats, null, 2) + ';\n\nwindow.DRIPS = ' + JSON.stringify(lib.map(stripMeta), null, 2) + ';\n';
    if (SERVER) { fetch('api/library', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ js: js }) }).then(function (r) { if (!r.ok) throw new Error(r.status); toast('Wrote drips.js (old copy in backups/)'); }).catch(function (e) { toast('Could not save: ' + e.message); }); return; }
    S.download('drips.js', new Blob([js], { type: 'text/javascript' })).then(function () { toast('Downloaded drips.js'); });
  }

  /* ---------- boot ---------- */
  function drawEditorBarDest() { var b = $('#png'); if (b && !$('select[data-dest]')) { var tmp = document.createElement('div'); tmp.innerHTML = destSel(cur() && cur().cat); if (tmp.firstChild) b.parentNode.insertBefore(tmp.firstChild, b); } refreshDest(); }
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
    var addedCat = false;
    (window.CATEGORIES || []).forEach(function (c, i) {
      var have = cats.filter(function (x) { return x.id === c.id; })[0];
      if (!have) { cats.splice(Math.min(i, cats.length), 0, clone(c)); addedCat = true; }
      else if (c.industry && !have.industry) { have.industry = c.industry; addedCat = true; }
    });
    if (addedCat && S.canWrite) S.saveCats(cats);
    topbar(); S.on('caps', topbar);
    S.driveReady.then(function () { if (!driveAvail()) return; if (S.drivePerm === 'granted') loadFolders().catch(function () {}); if (st.id) { var bar = $('.ed-bar'); if (bar && !$('select[data-dest]', bar)) drawEditorBarDest(); } else showGallery(); refreshDest(); });
    if (location.protocol !== 'file:' && S.mode !== 'hub') fetch('api/ping', { cache: 'no-store' }).then(function (x) { return x.ok ? x.json() : null; }).catch(function () { return null; }).then(function (j) { SERVER = !!(j && j.ok); if (SERVER) topbar(); });
    var hash = location.hash.slice(1);
    if (hash && lib.some(function (d) { return d.id === hash; })) openDrip(hash); else showGallery();
  });
})();
