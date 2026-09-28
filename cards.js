/* TechNext Drip Studio — more Odoo cards and elements, in the flat style of the first drips.
   Odoo-format cards: documents (quotation, sales order, invoice, bill, purchase order, delivery), product,
   work order, helpdesk ticket, calendar week, employee, email campaign, eCommerce page, bank reconciliation,
   approval, spreadsheet, Documents, rating, lead card. Elements: stamp, sticker, progress ring, avatars,
   sticky note, toggle, big button, search bar, barcode, map pin, timer, hand-drawn scribbles, scanner.
   Every text is sample data written for the post. Sizes are canvas px, so a card reads well at 360-700 px. */
(function () {
  'use strict';
  var R = window.TNDrip, LAY = R.LAYERS, esc = R.esc, asset = R.asset;
  function oi(app) { return '<img class="oi" src="' + asset('assets/odoo/' + app + '.svg') + '" alt="">'; }
  function arr(v) { return Array.isArray(v) ? v : v == null || v === '' ? [] : [v]; }
  function clamp(v, a, b) { v = +v; return isFinite(v) ? Math.max(a, Math.min(b, v)) : a; }
  function initials(n) { var w = String(n || '?').replace(/[^A-Za-z\s]/g, ' ').trim().split(/\s+/); return (w.length > 1 ? w[0].charAt(0) + w[1].charAt(0) : (w[0] || '?').slice(0, 2)).toUpperCase(); }
  var HUES = ['#3167CA', '#21B799', '#E8A33D', '#D9567A', '#8A63D2', '#2FA7E6', '#E36C3A'];
  function hue(s) { var h = 0; String(s || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 997; }); return HUES[h % HUES.length]; }
  function strHash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function av(name, cls) { return '<span class="av' + (cls ? ' ' + cls : '') + '" style="background:' + hue(name) + '">' + esc(initials(name)) + '</span>'; }
  function tone(t) {
    t = String(t || '').toLowerCase();
    if (/(paid|done|posted|approved|validated|confirmed|won|delivered|solved|reconciled|matched|in stock|ready|signed|sent|booked|on time)/.test(t)) return 'ok';
    if (/(late|overdue|refused|blocked|lost|cancel|out of stock|urgent)/.test(t)) return 'r';
    if (/(wait|to approve|pending|low|draft|review|soon|left)/.test(t)) return 'o';
    return '';
  }

  var I = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.6 2.4 7.1 7 8-4.6.9-6.4 3.4-7 8-.6-4.6-2.4-7.1-7-8 4.6-.9 6.4-3.4 7-8Z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8Z"/></svg>',
    starO: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8Z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5Z"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 4l9 5.5"/><path d="M5 10v7M9.7 10v7M14.3 10v7M19 10v7"/><path d="M3 20h18"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13H7Z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.5l2.2 11h10.6L21 7.5H7"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
  };
  function stars(n, of) { n = clamp(n == null ? 5 : n, 0, of || 5); var s = ''; for (var i = 0; i < (of || 5); i++) s += i < Math.round(n) ? I.star : I.starO; return s; }

  /* product pictures: simple line drawings, so a card never needs a photo */
  var PICO = {
    box: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"><path d="M8 20 32 8l24 12v24L32 56 8 44Z"/><path d="M8 20l24 12 24-12M32 32v24"/><path d="m20 14 24 12"/></svg>',
    shirt: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"><path d="M22 8c2 5 6 7 10 7s8-2 10-7l14 7-5 12-7-3v32H20V24l-7 3-5-12Z"/></svg>',
    cup: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22h34v14a15 15 0 0 1-15 15h-4a15 15 0 0 1-15-15Z"/><path d="M46 26h4a7 7 0 0 1 0 14h-5"/><path d="M22 8c-2 4 2 6 0 10M32 8c-2 4 2 6 0 10"/></svg>',
    bag: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"><path d="M12 20h40l-3 36H15Z"/><path d="M23 26v-8a9 9 0 0 1 18 0v8" stroke-linecap="round"/></svg>',
    bowl: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 30h48c0 13-11 22-24 22S8 43 8 30Z"/><path d="M22 52h20"/><path d="M26 22c-2-4 2-6 0-10M36 22c-2-4 2-6 0-10"/></svg>',
    bottle: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"><path d="M26 6h12v10l6 8v32H20V24l6-8Z"/><path d="M20 34h24"/></svg>',
    tool: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M40 8a12 12 0 0 0-12 16L8 44l12 12 20-20a12 12 0 0 0 16-12l-8 8-8-8 8-8a12 12 0 0 0-8-8Z"/></svg>',
    pill: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"><rect x="6" y="22" width="52" height="20" rx="10" transform="rotate(-35 32 32)"/><path d="m26 20 12 24"/></svg>',
    chair: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6h28v26H18Z"/><path d="M14 32h36v8H14Z"/><path d="M18 40v18M46 40v18"/></svg>',
    plant: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 40h28l-4 18H22Z"/><path d="M32 40V22"/><path d="M32 28c-8 0-14-6-14-14 8 0 14 6 14 14ZM32 24c0-7 5-12 12-12 0 7-5 12-12 12Z"/></svg>'
  };

  /* ---------- Odoo documents ---------- */
  var DOC = {
    quote: { app: 'sale', label: 'Quotation', num: 'S00118', status: ['Quotation', 'Quotation Sent', 'Sales Order'], at: 1, partner: 'Customer', btns: ['Confirm', 'Send by Email'] },
    order: { app: 'sale', label: 'Sales Order', num: 'S00118', status: ['Quotation', 'Quotation Sent', 'Sales Order'], at: 2, partner: 'Customer', btns: ['Create Invoice'] },
    invoice: { app: 'accountant', label: 'Customer Invoice', num: 'INV/2026/0142', status: ['Draft', 'Posted'], at: 1, partner: 'Customer', btns: ['Register Payment'] },
    bill: { app: 'accountant', label: 'Vendor Bill', num: 'BILL/2026/0311', status: ['Draft', 'Posted'], at: 0, partner: 'Vendor', btns: ['Confirm'] },
    po: { app: 'purchase', label: 'Purchase Order', num: 'P00231', status: ['RFQ', 'RFQ Sent', 'Purchase Order'], at: 1, partner: 'Vendor', btns: ['Confirm Order'] },
    delivery: { app: 'stock', label: 'Delivery Order', num: 'WH/OUT/00231', status: ['Draft', 'Waiting', 'Ready', 'Done'], at: 2, partner: 'Deliver to', btns: ['Validate'] },
    receipt: { app: 'stock', label: 'Receipt', num: 'WH/IN/00042', status: ['Draft', 'Ready', 'Done'], at: 1, partner: 'Receive from', btns: ['Validate'] }
  };
  LAY.doc = function (L) {
    var k = DOC[L.kind] || DOC.quote, sts = arr(L.status).length ? arr(L.status).slice(0, 4) : k.status, at = L.statusAt == null ? k.at : clamp(L.statusAt, 0, sts.length - 1);
    var lines = arr(L.lines).slice(0, 4), fields = arr(L.fields).slice(0, 3), cur = sts[at] || '';
    var h = '<div class="oc odoc' + (L.compact ? ' compact' : '') + '">' +
      '<div class="oc-top">' + oi(L.app || k.app) + '<div><small data-e="label">' + esc(L.label || k.label) + '</small><b data-e="number">' + esc(L.number || k.num) + '</b></div>' + (L.ribbon ? '' : '<span class="oc-st ' + tone(cur) + '">' + esc(cur) + '</span>') + '</div>';
    if (!L.compact) h += '<div class="od-bar">' + sts.map(function (s, i) { return '<span class="' + (i === at ? 'on' : i < at ? 'past' : '') + '">' + esc(s) + '</span>'; }).join('') + '</div>';
    var fl = (L.partner ? [[L.partnerLabel || k.partner, L.partner]] : []).concat(fields).slice(0, L.compact ? 1 : 4);
    if (fl.length) h += '<div class="od-fields">' + fl.map(function (f) { f = arr(f); return '<div><small>' + esc(f[0]) + '</small><b>' + esc(f[1]) + '</b></div>'; }).join('') + '</div>';
    if (lines.length && !L.compact) h += '<div class="od-lines"><div class="od-lh"><span>' + esc(L.colLabel || 'Product') + '</span><span>Qty</span><span>' + esc(L.amountLabel || 'Amount') + '</span></div>' +
      lines.map(function (l, i) { l = arr(l); return '<div class="od-l' + (+L.hot === i ? ' hl' : '') + '"><span>' + esc(l[0]) + '</span><span>' + esc(l[1]) + '</span><span>' + esc(l[2]) + '</span></div>'; }).join('') + '</div>';
    if (L.total) h += '<div class="od-tot"><span>' + esc(L.totalLabel || 'Total') + '</span><b data-e="total">' + esc(L.total) + '</b></div>';
    if (!L.compact) { var bs = arr(L.btns).length ? arr(L.btns) : k.btns; h += '<div class="od-btns">' + bs.slice(0, 2).map(function (b, i) { return '<span class="' + (i ? '' : 'pri') + '">' + esc(b) + '</span>'; }).join('') + (L.note ? '<em>' + I.spark + '<span data-e="note">' + esc(L.note) + '</span></em>' : '') + '</div>'; }
    if (L.ribbon) h += '<span class="od-rib">' + esc(L.ribbon) + '</span>';
    return h + '</div>';
  };

  /* ---------- product ---------- */
  LAY.product = function (L) {
    var c = L.color || hue(L.name), pct = L.level == null ? null : clamp(L.level, 0, 100), stock = arr(L.stock).length ? arr(L.stock).slice(0, 3) : [['On hand', '48 units'], ['Forecast', '120 units']];
    return '<div class="oc opro">' +
      '<div class="pr-img" style="background:linear-gradient(135deg,' + c + '1F,' + c + '4D);color:' + c + '">' + (PICO[L.icon] || PICO.box) + (L.badge ? '<span class="pr-bdg">' + esc(L.badge) + '</span>' : '') + '</div>' +
      '<div class="pr-b"><b data-e="name">' + esc(L.name || 'Product') + '</b>' + (L.ref ? '<small data-e="ref">' + esc(L.ref) + '</small>' : '') + (L.price ? '<div class="pr-price" data-e="price">' + esc(L.price) + '</div>' : '') +
      '<div class="pr-q">' + stock.map(function (q) { q = arr(q); return '<div><small>' + esc(q[0]) + '</small><b>' + esc(q[1]) + '</b></div>'; }).join('') + '</div>' +
      (pct != null ? '<div class="pr-bar' + (pct < 25 ? ' low' : '') + '"><i style="width:' + pct + '%"></i></div>' : '') +
      (arr(L.tags).length ? '<div class="pr-tags">' + arr(L.tags).slice(0, 3).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' : '') + '</div></div>';
  };

  /* ---------- manufacturing work order ---------- */
  LAY.workorder = function (L) {
    var steps = arr(L.steps).slice(0, 4), pct = L.progress == null ? null : clamp(L.progress, 0, 100);
    return '<div class="oc owo">' + top(L.app || 'mrp', L.title || 'WO/00042', L.sub, L.status) +
      (L.timer ? '<div class="wo-t">' + I.clock + '<b data-e="timer">' + esc(L.timer) + '</b><small>' + esc(L.timerLabel || 'on this step') + '</small></div>' : '') +
      '<div class="wo-s">' + steps.map(function (s) { s = arr(s); var st = /done|ok|✓/i.test(s[1]) ? 'done' : /now|run|progress|current/i.test(s[1]) ? 'now' : 'todo'; return '<div class="' + st + '"><i>' + (st === 'done' ? I.check : st === 'now' ? I.play : '') + '</i><span>' + esc(s[0]) + '</span><em>' + esc(s[2] || '') + '</em></div>'; }).join('') + '</div>' +
      (pct != null ? '<div class="wo-p"><span>' + esc(L.progressLabel || pct + '% done') + '</span><i><em style="width:' + pct + '%"></em></i></div>' : '') +
      (L.btn ? '<div class="od-btns"><span class="pri">' + esc(L.btn) + '</span></div>' : '') + '</div>';
  };
  function top(app, title, sub, status) {
    return '<div class="oc-top">' + oi(app) + '<div><b data-e="title">' + esc(title) + '</b>' + (sub ? '<small data-e="sub">' + esc(sub) + '</small>' : '') + '</div>' + (status ? '<span class="oc-st ' + tone(status) + '" data-e="status">' + esc(status) + '</span>' : '') + '</div>';
  }

  /* ---------- helpdesk ticket ---------- */
  LAY.ticket = function (L) {
    var p = clamp(L.priority == null ? 2 : L.priority, 0, 3), s = '';
    for (var i = 0; i < 3; i++) s += i < p ? I.star : I.starO;
    return '<div class="oc otk">' + top(L.app || 'helpdesk', L.title || '#1042', L.sub, L.stage) +
      '<div class="tk-r"><span class="tk-stars">' + s + '</span>' + (L.sla ? '<span class="tk-sla ' + (tone(L.sla) || 'o') + '">' + I.clock + '<span data-e="sla">' + esc(L.sla) + '</span></span>' : '') + (L.channel ? '<span class="tk-ch">' + esc(L.channel) + '</span>' : '') + '</div>' +
      (L.text ? '<p class="tk-x" data-e="text">' + esc(L.text) + '</p>' : '') +
      '<div class="tk-f">' + (L.assignee ? av(L.assignee) + '<span class="tk-as">' + esc(L.assignee) + '</span>' : '') + arr(L.tags).slice(0, 3).map(function (t) { return '<span class="tk-tag">' + esc(t) + '</span>'; }).join('') + '</div></div>';
  };

  /* ---------- calendar week ---------- */
  function fmtH(h) { var m = Math.round((h % 1) * 60); return Math.floor(h) + ':' + (m < 10 ? '0' : '') + m; }
  LAY.calendar = function (L) {
    var days = arr(L.days).length ? arr(L.days).slice(0, 6) : ['Mon 5', 'Tue 6', 'Wed 7', 'Thu 8', 'Fri 9'], n = days.length;
    var h0 = clamp(L.from == null ? 9 : L.from, 0, 22), h1 = clamp(L.to == null ? h0 + 7 : L.to, h0 + 2, 24), H = +L.rowH || 48, hours = [];
    for (var hh = h0; hh < h1; hh++) hours.push(hh);
    var ev = arr(L.events).slice(0, 10).map(function (e) {
      e = arr(e); var d = clamp(Math.floor(+e[0] || 0), 0, n - 1), s = clamp(e[1] == null ? h0 : e[1], h0, h1 - .5), len = clamp(e[2] || 1, .5, h1 - s), c = e[4] && String(e[4]).charAt(0) === '#' ? e[4] : hue(e[3] || String(d));
      return '<em class="' + (e[5] ? 'hl' : '') + '" style="left:calc(' + (d / n * 100).toFixed(3) + '% + 4px);width:calc(' + (100 / n).toFixed(3) + '% - 8px);top:' + ((s - h0) * H + 3) + 'px;height:' + (len * H - 6) + 'px;background:' + c + '"><b>' + esc(e[3] || '') + '</b><small>' + fmtH(s) + '</small></em>';
    }).join('');
    return '<div class="oc ocal">' + top(L.app || 'appointment', L.title || 'This week', L.sub, L.tag) +
      '<div class="cal-h" style="grid-template-columns:58px repeat(' + n + ',1fr)"><span></span>' + days.map(function (d, i) { return '<span' + (+L.today === i ? ' class="on"' : '') + '>' + esc(d) + '</span>'; }).join('') + '</div>' +
      '<div class="cal-g"><div class="cal-t">' + hours.map(function (x) { return '<span style="height:' + H + 'px">' + fmtH(x) + '</span>'; }).join('') + '</div>' +
      '<div class="cal-b" style="height:' + hours.length * H + 'px;background-size:calc(100% / ' + n + ') 100%,100% ' + H + 'px">' + ev + '</div></div></div>';
  };

  /* ---------- employee ---------- */
  LAY.employee = function (L) {
    return '<div class="oc oemp"><div class="em-hd">' + av(L.name || 'Mei Ling T.', 'xl') + '<div><b data-e="name">' + esc(L.name || 'Mei Ling T.') + '</b><small data-e="job">' + esc(L.job || '') + '</small>' +
      (L.dept ? '<span class="em-dp">' + oi(L.app || 'hr') + esc(L.dept) + '</span>' : '') + '</div></div>' +
      '<div class="em-rows">' + arr(L.rows).slice(0, 4).map(function (r) { r = arr(r); return '<div><small>' + esc(r[0]) + '</small><b>' + esc(r[1]) + '</b>' + (r[2] ? '<span class="oc-st ' + tone(r[2]) + '">' + esc(r[2]) + '</span>' : '') + '</div>'; }).join('') + '</div></div>';
  };

  /* ---------- email campaign ---------- */
  LAY.email = function (L) {
    var c = L.color || '#3167CA';
    return '<div class="oc omail"><div class="om-h">' + oi(L.app || 'mass_mailing') + '<div><small data-e="from">' + esc(L.from || 'From: Sample Store') + '</small><b data-e="subject">' + esc(L.subject || 'Subject line') + '</b></div></div>' +
      '<div class="om-b"><div class="om-hero" style="background:linear-gradient(135deg,' + c + ',' + c + 'B3)"><b>' + R.rich(L.headline || 'New this week') + '</b><span data-e="cta">' + esc(L.cta || 'Shop now') + '</span></div><i></i><i class="s"></i><i class="m"></i></div>' +
      (arr(L.stats).length ? '<div class="om-st">' + arr(L.stats).slice(0, 3).map(function (s) { s = arr(s); return '<span><b>' + esc(s[0]) + '</b><small>' + esc(s[1]) + '</small></span>'; }).join('') + '</div>' : '') + '</div>';
  };

  /* ---------- eCommerce product page ---------- */
  LAY.shop = function (L) {
    var c = L.color || hue(L.product);
    return '<div class="oc oshop"><div class="web-bar"><i></i><i></i><i></i><span data-e="url">' + esc(L.url || 'yourstore.com/shop') + '</span></div>' +
      '<div class="sh-nav"><b><span class="dot"></span><span data-e="brand">' + esc(L.brand || 'Sample Store') + '</span></b><span>Shop</span><span>New in</span><em>' + I.cart + (L.cart ? '<u>' + esc(L.cart) + '</u>' : '') + '</em></div>' +
      '<div class="sh-m"><div class="sh-img" style="background:linear-gradient(135deg,' + c + '1F,' + c + '59);color:' + c + '">' + (PICO[L.icon] || PICO.shirt) + (L.badge ? '<span class="pr-bdg">' + esc(L.badge) + '</span>' : '') + '</div>' +
      '<div class="sh-i">' + (L.category ? '<small>' + esc(L.category) + '</small>' : '') + '<b data-e="product">' + esc(L.product || 'Product') + '</b><div class="sh-r">' + stars(L.rating == null ? 5 : L.rating) + (L.reviews ? '<span>' + esc(L.reviews) + '</span>' : '') + '</div>' +
      (L.price ? '<div class="sh-p" data-e="price">' + esc(L.price) + '</div>' : '') + (L.stock ? '<div class="sh-s">' + I.check + '<span data-e="stock">' + esc(L.stock) + '</span></div>' : '') +
      (arr(L.options).length ? '<div class="sh-opt">' + arr(L.options).slice(0, 4).map(function (o, i) { return '<span' + (i === (+L.pick || 0) ? ' class="on"' : '') + '>' + esc(o) + '</span>'; }).join('') + '</div>' : '') +
      '<span class="sh-btn" data-e="btn">' + esc(L.btn || 'Add to cart') + '</span></div></div></div>';
  };

  /* ---------- bank reconciliation ---------- */
  LAY.reconcile = function (L) {
    var b = arr(L.bank), m = arr(L.match);
    return '<div class="oc orc">' + top(L.app || 'accountant', L.title || 'Bank reconciliation', L.sub, L.status) +
      '<div class="rc-l"><i class="bk">' + I.bank + '</i><div><small>' + esc(b[0] || '') + '</small><b>' + esc(b[1] || '') + '</b></div><em>' + esc(b[2] || '') + '</em></div>' +
      '<div class="rc-k"><span>' + I.link + '<span data-e="label">' + esc(L.label || 'Matched') + '</span></span></div>' +
      '<div class="rc-l"><i class="iv">' + I.file + '</i><div><small>' + esc(m[0] || '') + '</small><b>' + esc(m[1] || '') + '</b></div><em>' + esc(m[2] || '') + '</em></div>' +
      (L.btn || L.note ? '<div class="od-btns">' + (L.btn ? '<span class="pri">' + esc(L.btn) + '</span>' : '') + (L.note ? '<em>' + I.spark + '<span data-e="note">' + esc(L.note) + '</span></em>' : '') + '</div>' : '') + '</div>';
  };

  /* ---------- approvals ---------- */
  LAY.approval = function (L) {
    return '<div class="oc oap">' + top(L.app || 'approvals', L.title || 'Purchase request', L.sub, L.status) +
      '<div class="ap-f">' + arr(L.fields).slice(0, 3).map(function (f) { f = arr(f); return '<div><small>' + esc(f[0]) + '</small><b>' + esc(f[1]) + '</b></div>'; }).join('') + '</div>' +
      '<div class="ap-a"><small>Approvers</small>' + arr(L.approvers).slice(0, 3).map(function (a) { a = arr(a); var ok = tone(a[1]) === 'ok'; return '<div>' + av(a[0]) + '<b>' + esc(a[0]) + '</b><em class="' + (ok ? 'ok' : 'w') + '">' + (ok ? I.check : I.clock) + esc(a[1] || 'Waiting') + '</em></div>'; }).join('') + '</div>' +
      '<div class="od-btns">' + (arr(L.btns).length ? arr(L.btns) : ['Approve', 'Refuse']).slice(0, 2).map(function (b, i) { return '<span class="' + (i ? '' : 'pri') + '">' + esc(b) + '</span>'; }).join('') + '</div></div>';
  };

  /* ---------- spreadsheet ---------- */
  LAY.sheet = function (L) {
    var cols = arr(L.cols).slice(0, 5), rows = arr(L.rows).slice(0, 7), hl = arr(L.highlight), n = rows.length;
    return '<div class="oc osh"><div class="sh-tb">' + oi(L.app || 'spreadsheet_dashboard') + '<b data-e="title">' + esc(L.title || 'Report') + '</b>' + (L.tag ? '<span class="oc-st">' + esc(L.tag) + '</span>' : '') + '</div>' +
      (L.formula ? '<div class="sh-fx"><i>fx</i><span data-e="formula">' + esc(L.formula) + '</span></div>' : '') +
      '<table class="sh-g"><tr><th></th>' + cols.map(function (c, j) { return '<th>' + String.fromCharCode(65 + j) + '</th>'; }).join('') + '</tr>' +
      '<tr class="hd"><td>1</td>' + cols.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>' +
      rows.map(function (r, i) { return '<tr' + (L.totalRow && i === n - 1 ? ' class="tot"' : '') + '><td>' + (i + 2) + '</td>' + arr(r).slice(0, cols.length).map(function (c, j) { return '<td' + (hl.length === 2 && +hl[0] === i && +hl[1] === j ? ' class="hl"' : '') + '>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
  };

  /* ---------- Documents ---------- */
  var FT = { pdf: ['PDF', '#D9463A'], xls: ['XLS', '#1E8E4E'], doc: ['DOC', '#2F6FD6'], img: ['JPG', '#8A63D2'], zip: ['ZIP', '#8A8D9E'] };
  LAY.docs = function (L) {
    return '<div class="oc odcs">' + top(L.app || 'documents', L.title || 'Documents', L.sub, L.tag) +
      '<div class="dc-g">' + arr(L.files).slice(0, 6).map(function (f) { f = arr(f); var ty = FT[f[1]] || FT.pdf; return '<div class="dc-f' + (f[3] ? ' hl' : '') + '"><span class="dc-i" style="--c:' + ty[1] + '">' + ty[0] + '</span><b>' + esc(f[0]) + '</b>' + (f[2] ? '<em>' + I.spark + esc(f[2]) + '</em>' : '') + '</div>'; }).join('') + '</div></div>';
  };

  /* ---------- rating ---------- */
  LAY.rating = function (L) {
    return '<div class="oc ort"><div class="rt-s">' + stars(L.stars == null ? 5 : L.stars) + '</div><p data-e="text">' + esc(L.text || '') + '</p>' +
      '<div class="rt-w">' + av(L.who || 'Customer') + '<div><b data-e="who">' + esc(L.who || 'Customer') + '</b>' + (L.meta ? '<small data-e="meta">' + esc(L.meta) + '</small>' : '') + '</div></div></div>';
  };

  /* ---------- one lead / task card, big ---------- */
  LAY.kcard = function (L) {
    var p = clamp(L.priority == null ? 2 : L.priority, 0, 3), s = '';
    for (var i = 0; i < 3; i++) s += i < p ? I.star : I.starO;
    return '<div class="oc okc"><div class="kc-h">' + (L.app ? oi(L.app) : '') + '<div><b data-e="title">' + esc(L.title || 'Opportunity') + '</b><small data-e="sub">' + esc(L.sub || '') + '</small></div></div>' +
      (arr(L.tags).length ? '<div class="kc-tags">' + arr(L.tags).slice(0, 3).map(function (t, i) { return '<span style="--c:' + HUES[(i * 3 + 1) % HUES.length] + '">' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
      '<div class="kc-f"><span class="tk-stars">' + s + '</span>' + (L.amount ? '<b data-e="amount">' + esc(L.amount) + '</b>' : '<b></b>') + av(L.owner || L.title) + '</div>' +
      (L.activity ? '<div class="kc-a">' + I.clock + '<span data-e="activity">' + esc(L.activity) + '</span></div>' : '') + '</div>';
  };

  /* ================= elements ================= */
  LAY.stamp = function (L) { return '<span class="stamp ' + esc(L.tone || '') + '"><span data-e="text">' + esc(L.text || 'PAID') + '</span>' + (L.small ? '<small data-e="small">' + esc(L.small) + '</small>' : '') + '</span>'; };
  LAY.sticker = function (L) { return '<span class="stk ' + esc(L.tone || '') + '"><b>' + R.rich(L.text || 'New') + '</b>' + (L.small ? '<small data-e="small">' + esc(L.small) + '</small>' : '') + '</span>'; };
  LAY.ring = function (L) {
    var v = clamp(L.value == null ? 75 : L.value, 0, 100), r = 54, c = 2 * Math.PI * r, col = L.color || '#3167CA';
    return '<div class="rng' + (L.plain ? ' plain' : '') + '"><div class="rng-c"><svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="' + r + '" fill="none" stroke="#E4E9F3" stroke-width="15"/>' +
      '<circle cx="70" cy="70" r="' + r + '" fill="none" stroke="' + esc(col) + '" stroke-width="15" stroke-linecap="round" stroke-dasharray="' + (c * v / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 70 70)"/></svg>' +
      '<b data-e="text" style="color:' + esc(col) + '">' + esc(L.text != null ? L.text : v + '%') + '</b></div>' + (L.label ? '<span data-e="label">' + esc(L.label) + '</span>' : '') + '</div>';
  };
  LAY.avatars = function (L) {
    var ns = arr(L.names).length ? arr(L.names).slice(0, 5) : ['Mei Ling T.', 'Ravi S.', 'Daniel K.'];
    return '<span class="avs">' + ns.map(function (n) { return av(n); }).join('') + (L.more ? '<span class="av more">' + esc(L.more) + '</span>' : '') + (L.label ? '<b data-e="label">' + esc(L.label) + '</b>' : '') + '</span>';
  };
  LAY.sticky = function (L) { return '<div class="sty ' + esc(L.tone || '') + '"><span data-e="text">' + esc(L.text || 'Remember!') + '</span></div>'; };
  LAY.toggle = function (L) { return '<span class="tgl' + (L.on === false ? ' off' : '') + '"><i><u></u></i><span data-e="text">' + esc(L.text || 'On') + '</span></span>'; };
  LAY.button = function (L) { return '<span class="bigbtn ' + esc(L.tone || '') + '"><span data-e="text">' + esc(L.text || 'Confirm') + '</span></span>'; };
  LAY.search = function (L) {
    return '<div class="srch">' + I.search + '<span class="q" data-e="query">' + esc(L.query || '') + '</span>' + arr(L.filters).slice(0, 3).map(function (f) { return '<span class="f">' + esc(f) + '<i>×</i></span>'; }).join('') + '</div>';
  };
  LAY.barcode = function (L) {
    var r = R.rng(strHash(L.code || 'code')), x = 0, s = '';
    while (x < 186) { var w = 1 + Math.floor(r() * 3.4), g = 1 + Math.floor(r() * 2.6); if (x + w > 190) break; s += '<rect x="' + x + '" y="0" width="' + w + '" height="70"/>'; x += w + g; }
    return '<div class="bcd"><svg viewBox="0 0 190 70" preserveAspectRatio="none" aria-hidden="true">' + s + '</svg><span data-e="code">' + esc(L.code || '') + '</span>' + (L.label ? '<b data-e="label">' + esc(L.label) + '</b>' : '') + '</div>';
  };
  LAY.pin = function (L) {
    return '<span class="pin"><svg viewBox="0 0 60 80" aria-hidden="true"><path d="M30 78C30 78 4 47 4 29A26 26 0 0 1 56 29C56 47 30 78 30 78Z" fill="' + esc(L.color || '#3167CA') + '"/><circle cx="30" cy="29" r="10" fill="#fff"/></svg>' + (L.label ? '<span data-e="label">' + esc(L.label) + '</span>' : '') + '</span>';
  };
  LAY.timer = function (L) { return '<span class="tmr' + (L.tone === 'light' ? ' light' : '') + '">' + I.clock + '<span><b data-e="time">' + esc(L.time || '00:24:10') + '</b>' + (L.label ? '<small data-e="label">' + esc(L.label) + '</small>' : '') + '</span></span>'; };
  var SCRIB = {
    circle: '<path d="M104 10C46 8 8 26 8 50c0 26 48 42 98 40 50-2 88-20 86-44C190 20 144 6 88 14"/>',
    underline: '<path d="M6 34C54 20 118 18 194 26"/><path d="M34 48c44-8 94-8 134-4"/>',
    check: '<path d="M20 52 70 88 186 8"/>',
    star: '<path d="M100 8 124 70 190 74 138 112 156 176 100 138 44 176 62 112 10 74 76 70Z" transform="scale(1 .52)"/>',
    arrow: '<path d="M10 76C60 20 124 8 176 36"/><path d="M150 18 178 38 150 56"/>',
    cross: '<path d="M24 16 176 84M176 16 24 84"/>',
    zigzag: '<path d="M8 60 38 30 68 60 98 30 128 60 158 30 190 60"/>'
  };
  LAY.scribble = function (L) {
    return '<svg class="scrb" viewBox="0 0 200 100" preserveAspectRatio="none" fill="none" stroke="' + esc(L.color || '#FFC83D') + '" stroke-width="' + (+L.weight || 7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (SCRIB[L.kind] || SCRIB.circle) + '</svg>';
  };
  LAY.scanner = function (L) {
    return '<div class="scn"><svg viewBox="0 -70 200 400" aria-hidden="true"><defs><linearGradient id="scnb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF4D4D" stop-opacity=".7"/><stop offset="1" stop-color="#FF4D4D" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="scnd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A4155"/><stop offset="1" stop-color="#151925"/></linearGradient></defs>' +
      '<path d="M78 0 60 -70H140L122 0Z" fill="url(#scnb)"/><rect x="10" y="0" width="180" height="170" rx="30" fill="url(#scnd)"/><rect x="66" y="150" width="68" height="170" rx="26" fill="url(#scnd)"/>' +
      '<rect x="26" y="18" width="148" height="112" rx="14" fill="#F4F6FB"/><rect x="76" y="-6" width="48" height="10" rx="4" fill="#FF6B5F"/><circle cx="100" cy="148" r="7" fill="#3167CA"/></svg>' +
      '<div class="scn-s"><b data-e="title">' + esc(L.title || 'Scanned') + '</b><span data-e="text">' + esc(L.text || '') + '</span></div></div>';
  };

  /* ---------- growth pyramid: 3-5 levels, the foundation at the bottom ---------- */
  var PYR = ['#A9C6F6', '#7FAAF3', '#5A8FE8', '#3F74D6', '#2657B5', '#1E4691'];
  LAY.pyramid = function (L) {
    var lv = arr(L.levels).slice(0, 5), n = lv.length || 1, band = 100 / n, top = 24, s = '', lab = '';
    lv.forEach(function (x, i) {
      x = arr(x);
      var w0 = top + (100 - top) * i / n, w1 = top + (100 - top) * (i + 1) / n, y0 = i * band, y1 = (i + 1) * band - (i < n - 1 ? 1.4 : 0);
      var c = PYR[PYR.length - n + i] || '#3167CA', dark = PYR.indexOf(c) < 2;
      s += '<path d="M' + (50 - w0 / 2).toFixed(2) + ' ' + y0.toFixed(2) + 'H' + (50 + w0 / 2).toFixed(2) + 'L' + (50 + w1 / 2).toFixed(2) + ' ' + y1.toFixed(2) + 'H' + (50 - w1 / 2).toFixed(2) + 'Z" fill="' + c + '"/>';
      var pad = ((100 - (w0 + w1) / 2) / 2 + 3).toFixed(1);
      lab += '<div class="pyr-l' + (dark ? ' dk' : '') + (+L.hot === i ? ' hot' : '') + '" style="top:' + y0.toFixed(2) + '%;height:' + band.toFixed(2) + '%;padding:0 ' + pad + '%"><b>' + esc(x[0]) + '</b>' + (x[1] ? '<small>' + esc(x[1]) + '</small>' : '') + '</div>';
    });
    return '<div class="pyr"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + s + '</svg>' + lab + '</div>' + (L.note ? '<p class="pyr-n" data-e="note">' + esc(L.note) + '</p>' : '');
  };

  /* ---------- one operating system: 2-3 groups of Odoo apps on one base ---------- */
  LAY.groups = function (L) {
    var gs = arr(L.groups).slice(0, 3), n = Math.max(1, gs.length);
    return '<div class="grp" style="grid-template-columns:repeat(' + n + ',1fr)">' + gs.map(function (g, i) {
      g = g || {};
      return '<div class="grp-c"><div class="grp-h"><span style="background:' + HUES[(i * 3) % HUES.length] + '"></span><b>' + esc(g.title || '') + '</b></div><div class="grp-a' + (n === 3 ? ' one' : '') + '">' +
        arr(g.apps).slice(0, 6).map(function (a) { a = arr(a); return '<span>' + oi(a[0] || 'sale') + '<em>' + esc(a[1] || R.appName(a[0])) + '</em></span>'; }).join('') + '</div>' +
        (g.note ? '<small>' + esc(g.note) + '</small>' : '') + '</div>';
    }).join('') + (L.base ? '<div class="grp-base"><img src="' + asset('assets/brand/logo-plane.png') + '" alt=""><span data-e="base">' + esc(L.base) + '</span></div>' : '') + '</div>';
  };

  window.TNCards = { DOC: DOC, PICO: Object.keys(PICO), SCRIB: Object.keys(SCRIB) };
})();
