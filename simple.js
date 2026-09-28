/* TechNext Drip Studio — the simple style (v4, the default for new drips).
   Every post keeps the standard frame (TechNext logo top left, Odoo badge top right, headline and subline
   centred on top) and shows ONE visual under the subline, drawn like the first drips: flat white cards, a
   phone, Nexi, handwritten pills, step chips and sparkles on a clean background. Claude picks the visual that
   shows the headline and writes every word inside it (ai.js); this file places it, measuring each element
   so nothing is cut off, runs off the canvas or covers the headline. Posts in a set alternate sides. */
(function () {
  'use strict';
  var R = window.TNDrip, C = window.TN_CONTENT || {};
  var W = 1080, BOTTOM = 1050, T0 = 440, GROUND = 'haze';
  var POSES = ['wave', 'point', 'present', 'celebrate', 'cheer', 'surprise', 'love', 'think', 'clap'];
  var NEXI_AR = { celebrate: 851 / 1100, cheer: 778 / 1100, clap: 678 / 1100, love: 658 / 1100, point: 939 / 1100, present: 726 / 1100, surprise: 911 / 1100, think: 724 / 1100, wave: 835 / 1100 };
  var ICONS = ['check', 'spark', 'search', 'sync', 'cloudOk', 'cloudOff', 'bell', 'clock', 'chart'];
  var EXTRA = ['pos_restaurant', 'ai_app', 'industry_fsm', 'appointment', 'mail', 'whatsapp', 'knowledge', 'documents', 'sign', 'voip', 'iot', 'spreadsheet_dashboard'];

  /* ---------- cleaning Claude's JSON ---------- */
  function clean(v) { return v == null ? '' : String(v).replace(/\s+/g, ' ').trim(); }
  /* keep Claude's words; only a far-too-long text is shortened, at a word boundary and without "…" */
  function t(v, max) {
    v = clean(typeof v === 'object' && v ? v.text : v); var lim = Math.round((max || 999) * 1.35);
    if (v.length <= lim) return v;
    var c = v.slice(0, lim), i = c.lastIndexOf(' ');
    return (i > lim * .55 ? c.slice(0, i) : c).replace(/[,;:\s–-]+$/, '');
  }
  function arr(v) { return Array.isArray(v) ? v : v == null || v === '' ? [] : [v]; }
  function strs(v, n, max) { return arr(v).map(function (x) { return t(x, max); }).filter(Boolean).slice(0, n); }
  function pick(list, v, d) { return list.indexOf(v) > -1 ? v : d; }
  function num(v, d) { v = parseFloat(v); return isFinite(v) ? v : d; }
  function modOK(m) { return !!((C.apps && C.apps[m]) || (C.appFlows && C.appFlows[m]) || EXTRA.indexOf(m) > -1); }
  function mod(m, d) { m = clean(m).toLowerCase().replace(/^odoo[ _-]?/, '').replace(/\s+/g, '_'); return m && modOK(m) ? m : d; }
  function mods(v, n) { return arr(v).map(function (m) { return mod(m, ''); }).filter(Boolean).slice(0, n); }
  function idx(v, n) { v = parseInt(v, 10); return v >= 0 && v < n ? v : undefined; }
  function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : typeof v === 'string' && v ? { text: v } : {}; }
  function chipL(c, dIcon) {
    c = obj(c); var tx = t(c.text, 26); if (!tx) return null;
    var ic = pick(ICONS, c.icon, dIcon || 'check');
    return { type: 'chip', text: tx, small: t(c.small, 30) || undefined, icon: ic, tone: ic === 'check' || ic === 'cloudOk' ? 'ok' : undefined, z: 18 };
  }
  function recordL(r, dApp) {
    r = r || {};
    var rows = arr(r.rows).filter(Array.isArray).slice(0, 4).map(function (x) { return [t(x[0], 16), t(x[1], 26), /^(ai|ok)$/.test(x[2]) ? x[2] : '', t(x[3], 10) || undefined].filter(function (y, i) { return i < 3 || y; }); });
    var st = t(r.status, 14);
    return { type: 'record', app: mod(r.app, dApp || 'accountant'), title: t(r.title, 30) || 'Record', crumb: t(r.crumb, 34) || undefined, status: st || undefined,
      statusOk: /paid|done|posted|approved|validated|confirmed|won|delivered/i.test(st) || undefined, rows: rows.length ? rows : [['Status', 'Ready', 'ok']],
      ai: t(r.note || r.ai, 46) || undefined, btn: t(r.btn, 16) || undefined };
  }

  /* ---------- measuring ---------- */
  var host = null;
  function hostEl() {
    if (!host || !host.isConnected) { host = document.createElement('div'); host.setAttribute('aria-hidden', 'true'); host.style.cssText = 'position:fixed;left:-30000px;top:0;width:1080px;visibility:hidden;pointer-events:none'; document.body.appendChild(host); }
    return host;
  }
  function size(L) {
    if (L.type === 'nexi') return { w: L.w, h: Math.round(L.w / (NEXI_AR[L.pose] || .8)) };
    var c = {}; Object.keys(L).forEach(function (k) { if (k.charAt(0) !== '_' && k !== 'rot' && k !== 's' && k !== 'flip') c[k] = L[k]; });
    c.x = 0; c.y = 0;
    var el = R.render({ id: 'm', ground: '', badge: '', copy: {}, layers: [c] }), h = hostEl();
    h.innerHTML = ''; h.appendChild(el);
    var n = el.querySelector('.L');
    return n ? { w: n.offsetWidth, h: n.offsetHeight } : { w: c.w || 100, h: c.w || 100 };
  }
  function copyBottom(copy) {
    var el = R.render({ id: 'mc', ground: '', badge: '', copy: copy, layers: [] }), h = hostEl();
    h.innerHTML = ''; h.appendChild(el); R.fit(h);
    var c = el.querySelector('.d-copy'); return c ? c.offsetTop + c.offsetHeight : 420;
  }
  function box(x, y, w, h) { return { x: x, y: y, w: w, h: h, x1: x + w, y1: y + h, cx: x + w / 2, cy: y + h / 2 }; }
  function vbox(L) { var m = L._m || { w: L.w || 100, h: L.w || 100 }, s = L.s || 1; return box(L.x + m.w * (1 - s) / 2, L.y + m.h * (1 - s) / 2, m.w * s, m.h * s); }

  /* the builder's toolkit: every builder places its elements for a subline ending near y 406 (T = 440);
     settle() then moves and, if needed, scales the whole group into the space the real copy leaves */
  function stage(d) {
    var a = { T: T0, m: size };
    a.add = function (L, vx, vy, role) {
      var m = size(L), s = L.s || 1;
      L.x = Math.round(vx - m.w * (1 - s) / 2); L.y = Math.round(vy - m.h * (1 - s) / 2); L._m = m; L._r = role || 'main';
      d.layers.push(L); return box(vx, vy, m.w * s, m.h * s);
    };
    a.fx = function (L, x, y) { return a.add(L, x, y, 'fx'); };
    a.nexi = function (pose, h) { pose = pick(POSES, pose, 'point'); return { type: 'nexi', pose: pose, w: Math.round(h * (NEXI_AR[pose] || .8)), z: 16 }; };
    a.fitW = function (L, maxW) { var m = size(L); if (m.w > maxW) L.s = +Math.max(.6, maxW / m.w).toFixed(3); return L; };
    a.w = function (L) { return size(L).w * (L.s || 1); };
    a.sparkles = function (x, y, w) { return a.fx({ type: 'sparkles', w: w || 104, z: 21 }, x, y); };
    a.sphere = function (x, y, w) { return a.fx({ type: 'sphere', w: w || 54, z: 6 }, x, y); };
    a.pill = function (tx, x, y, rot, maxW) { var L = { type: 'pill', text: tx, rot: rot || 0, z: 19 }; if (maxW) a.fitW(L, maxW); return a.add(L, x, y); };
    /* step chips stacked under a card, slightly staggered like the first drips */
    a.steps = function (list, under, xs, icons) {
      var y = under.y1 + 34;
      list.forEach(function (tx, i) {
        var last = i === list.length - 1, ic = (icons || [])[i] || (last ? 'check' : ['spark', 'search', 'sync'][i]);
        var L = { type: 'chip', text: tx, icon: ic, tone: ic === 'check' ? 'ok' : undefined, rot: [-1.5, 1.5, -1][i] || 0, z: 18 + i };
        var w = a.w(L), x = Math.min(xs[i] == null ? xs[xs.length - 1] : xs[i], W - 22 - w);
        var B = a.add(L, x, y); y = B.y1 + 8;
      });
    };
    return a;
  }
  function scaleAbout(L, px, py, f) {
    var b = vbox(L), m = L._m, cx = px + (b.cx - px) * f, cy = py + (b.cy - py) * f;
    L.s = +((L.s || 1) * f).toFixed(3); L.x = Math.round(cx - m.w / 2); L.y = Math.round(cy - m.h / 2);
  }
  function settle(d, T, center) {
    var Ls = d.layers.filter(function (L) { return L._r; }), top = Infinity, bot = -Infinity;
    Ls.forEach(function (L) { if (L._r === 'fx') return; var b = vbox(L); top = Math.min(top, b.y); if (L._r === 'main') bot = Math.max(bot, b.y1); });
    if (!isFinite(top)) return;
    if (!isFinite(bot)) bot = top + 320;
    var avail = BOTTOM - T, gh = bot - top, f = gh > avail ? Math.max(.7, avail / gh) : 1;
    if (f < 1) Ls.forEach(function (L) { scaleAbout(L, W / 2, top, f); });
    var dy = Math.round(T + Math.max(0, avail - gh * f) * (center == null ? .2 : center) - top);
    Ls.forEach(function (L) { L.y += dy; });
    /* nothing solid past the sides */
    Ls.forEach(function (L) { if (L._r !== 'main') return; var b = vbox(L); if (b.x < 14) L.x += Math.round(14 - b.x); else if (b.x1 > W - 14) L.x -= Math.round(b.x1 - W + 14); });
  }
  function mirror(d) {
    d.layers.forEach(function (L) {
      if (!L._r) return;
      var b = vbox(L), m = L._m;
      L.x = Math.round(W - b.x1 - m.w * (1 - (L.s || 1)) / 2);
      if (L.rot) L.rot = -L.rot;
      if (L.type === 'arrow' || L.type === 'storm') L.flip = !L.flip || undefined;
    });
  }

  /* ---------- the visuals ---------- */
  var VIS = {};

  VIS.phone = { label: 'Phone screen', mirror: true, about: 'an Odoo screen on a phone with handwritten callouts', build: function (p, a) {
    var T = a.T, offline = !!p.offline || p.sticker === 'storm';
    var lines = arr(p.lines).filter(Array.isArray).slice(0, 4).map(function (l) { return [t(l[0], 24), t(l[1], 10), l[2] === true || l[2] === 1 || /^(true|done|yes|1)$/i.test(l[2])]; });
    var fl = arr(p.field || p.fields); if (fl.length && !Array.isArray(fl[0])) fl = [fl];
    fl = fl.filter(Array.isArray).slice(0, 1).map(function (f) { return [t(f[0], 18), t(f[1], 28)]; });
    var ph = { type: 'phone', w: 336, rot: -5, z: 12, screen: offline ? 'offline-receipt' : 'odoo', app: mod(p.app, 'stock'), title: t(p.title, 26) || undefined, crumb: t(p.crumb, 30) || undefined,
      banner: t(p.banner, 64) || undefined, fields: fl.length ? fl : offline ? undefined : [], lines: lines.length ? lines : undefined, btn: t(p.btn, 18) || undefined };
    a.fx({ type: 'glow', w: 600, z: 2 }, 250, T + 30);
    var P = a.add(ph, 382, T + 12, 'bleed');
    var pills = strs(p.pills, 3, 20), ys = [[T + 232], [T + 150, T + 330], [T + 108, T + 266, T + 422]][Math.max(0, pills.length - 1)];
    pills.forEach(function (tx, i) { var x = [62, 44, 104][i]; a.pill(tx, x, ys[i], [-5, 3, -3][i], P.x + 36 - x); });
    var S = null, q = obj(p.qr), n = obj(p.notif);
    if (offline) {
      a.fx({ type: 'storm', w: 290, rot: 6, z: 14 }, 706, T - 2);
      a.fx({ type: 'nosignal', w: 120, rot: 8, z: 16 }, 676, T + 188);
      a.fx({ type: 'arrow', w: 120, rot: 62, z: 17, kind: 'down' }, 790, T + 272);
    } else if (p.qr || p.sticker === 'qr') {
      S = a.add({ type: 'qr', w: 250, rot: 5, z: 14, title: t(q.title, 20) || undefined, text: t(q.text, 30) || 'Scan to order and pay', app: ph.app }, 770, T + 4);
    } else if (n.title) {
      S = a.add({ type: 'notif', w: 360, rot: 3, z: 14, app: mod(n.app, ph.app), title: t(n.title, 24), text: t(n.text, 40) || undefined, time: t(n.time, 8) || 'now' }, 690, T + 60);
    }
    var c = chipL(p.chip, offline ? 'cloudOk' : 'check');
    if (c) { c.rot = 3; var cw = a.w(c); a.add(c, Math.min(700, W - 24 - cw), S ? Math.max(T + 380, S.y1 + 28) : T + 380); }
    if (!S && !offline) a.sphere(968, T + 186, 58);
    if (S) a.sparkles(716, T - 30, 90); else a.sparkles(930, T + 318, 110);
  } };

  VIS.record = { label: 'Record + Nexi', mirror: true, about: 'Nexi next to one Odoo record, with 3 step chips', build: function (p, a) {
    var T = a.T, rec = recordL(p); rec.w = 540; rec.rot = 2.5; rec.z = 12;
    a.add(a.nexi(p.nexi || 'point', 520), 30, T + 84, 'bleed');
    var RB = a.add(rec, 486, T + 4);
    var b = t(p.bubble, 18); if (b) a.add({ type: 'bubble', text: b, rot: -3, z: 20 }, 60, T);
    a.steps(strs(p.steps, 3, 26), RB, [548, 606, 560]);
    a.sparkles(404, T + 28, 110); a.sphere(990, T + 330, 52);
  } };

  VIS.paper = { label: 'Paper to Odoo', mirror: true, about: 'a paper or PDF document turned into an Odoo record', build: function (p, a) {
    var T = a.T, dc = p.doc || p.paper || {}, lines = arr(dc.lines).filter(Array.isArray).slice(0, 4).map(function (x) { return [t(x[0], 22), t(x[1], 12)]; });
    var RC = a.add({ type: 'receipt', w: 370, rot: -6, z: 11, vendor: t(dc.vendor, 26) || 'Sample Supplier Pte Ltd', doc: t(dc.doc, 18) || 'TAX INVOICE', lines: lines.length ? lines : [['Item', '100.00']], total: t(dc.total, 14) || undefined, stamp: t(dc.stamp, 10) || 'SCANNED' }, 58, T + 70);
    var rec = recordL(p.record || p); rec.w = 540; rec.rot = 2; rec.z = 12;
    var RB = a.add(rec, 490, T + 8);
    a.fx({ type: 'arrow', w: 118, rot: -6, z: 22, kind: 'right' }, 372, T - 4);
    var lb = t(p.label, 22); if (lb) a.pill(lb, 70, RC.y1 + 26, -4, 400);
    a.steps(strs(p.steps, 2, 26), RB, [566, 612], ['spark', 'check']);
    a.sparkles(440, T + 300, 96);
  } };

  VIS.checklist = { label: 'Checklist + Nexi', mirror: true, center: .3, about: 'a card of 3-4 points with Nexi presenting it', build: function (p, a, ctx) {
    var T = a.T, items = strs(p.items, 4, 70);
    if (!items.length && ctx.industry) items = ((C.industries[ctx.industry] || {}).new20 || []).slice(0, 4);
    var CB = a.add({ type: 'checklist', w: 660, z: 12, big: items.length <= 3 || undefined, app: mod(p.app, undefined), title: t(p.title, 34) || 'What changes', tag: t(p.tag, 20) || undefined, items: items, apps: mods(p.apps, 5) }, 56, T);
    var nx = a.nexi(p.nexi || 'present', 560); a.add(nx, W - 34 - nx.w, T + 96, 'bleed');
    a.sparkles(926, T + 8, 100);
    var pl = strs(p.pills, 1, 22)[0]; if (pl && CB.y1 + 110 < BOTTOM) a.pill(pl, 96, CB.y1 + 34, -3);
  } };

  VIS.versus = { label: 'Old way vs Odoo', center: .3, about: 'the old way next to the same job in Odoo', build: function (p, a, ctx, d) {
    var T = a.T, o = p.old || {}, n = p.new || p.odoo || {};
    var OL = { type: 'checklist', variant: 'old', big: true, w: 460, rot: -3, z: 11, title: t(o.title, 26) || 'The old way', tag: t(o.tag, 16) || 'Before', items: strs(o.items, 3, 44) };
    var NL = { type: 'checklist', big: true, w: 520, rot: 2, z: 12, app: mod(n.app, undefined), title: t(n.title, 26) || 'With Odoo', tag: t(n.tag, 16) || 'With Odoo', items: strs(n.items, 3, 48) };
    var OB, NB;
    if ((d.variant || 0) % 2 === 0) {
      OB = a.add(OL, 30, T + 44); NB = a.add(NL, 524, T);
      a.fx({ type: 'arrow', w: 104, rot: -4, z: 22, kind: 'right' }, 444, T + 130);
    } else {
      OB = a.add(OL, 44, T); NB = a.add(NL, 516, T + 160);
      a.fx({ type: 'arrow', w: 120, rot: 30, z: 22, kind: 'down' }, 300, OB.y1 - 10);
    }
    var pl = strs(p.pills, 1, 22)[0];
    if (pl) { var L = { type: 'pill', text: pl, rot: -3, z: 19 }, w = a.w(L); a.add(L, (d.variant || 0) % 2 ? 70 : Math.round((W - w) / 2), Math.max(OB.y1, NB.y1) + 36); }
    a.sparkles(NB.x1 - 70, NB.y - 60, 96);
  } };

  VIS.flow = { label: 'Workflow steps', about: '3-6 steps across Odoo apps', build: function (p, a, ctx) {
    var T = a.T, st = arr(p.steps).map(function (x) { if (Array.isArray(x)) x = { app: x[0], t: x[1], h: x[2] }; x = x || {}; return { app: mod(x.app, ''), t: t(x.t || x.title, 12), h: t(x.h || x.detail, 44) }; }).filter(function (x) { return x.t; }).slice(0, 6);
    if (st.length < 3 && ctx.industry) st = R.flowSteps({ from: 'industry:' + ctx.industry });
    if (st.length < 3) st = [{ app: 'sale', t: 'Quote', h: 'Sent from a template' }, { app: 'stock', t: 'Deliver', h: 'Picked and shipped' }, { app: 'accountant', t: 'Invoice', h: 'Paid online' }];
    var n = st.length, cf = n >= 5 ? { cols: 3, nodeW: 270, nodeH: 200, gapX: 65, gapY: 50 } : n === 4 ? { cols: 4, nodeW: 222, nodeH: 236, gapX: 30, gapY: 40 } : { cols: 3, nodeW: 288, nodeH: 236, gapX: 58, gapY: 40 };
    var Wf = cf.cols * cf.nodeW + (cf.cols - 1) * cf.gapX;
    var FB = a.add({ type: 'flow', z: 12, steps: st, cols: cf.cols, nodeW: cf.nodeW, nodeH: cf.nodeH, gapX: cf.gapX, gapY: cf.gapY, layout: 'snake', hot: idx(p.hot, n) }, Math.round((W - Wf) / 2), T);
    var o = t(p.old, 22), nw = t(p.new, 26);
    if (o && nw) {
      var y = FB.y1 + 46, OL = { type: 'note', text: o.toLowerCase(), variant: 'red strike', size: 46, rot: -4, z: 20 }, ow = a.w(OL);
      a.add(OL, Math.max(40, 470 - ow), y);
      a.fx({ type: 'arrow', w: 100, rot: 8, z: 20, kind: 'right' }, 486, y - 14);
      a.add(a.fitW({ type: 'note', text: nw.toLowerCase(), size: 46, rot: -3, z: 20 }, W - 36 - 606), 606, y - 4);
    } else if (n <= 4) {
      var nx = a.nexi(p.nexi || 'present', 300); a.add(nx, W - 60 - nx.w, FB.y1 + 24, 'bleed');
      var pl = strs(p.pills, 1, 22)[0]; if (pl) a.pill(pl, 90, FB.y1 + 70, -3);
    }
    a.sparkles(FB.x1 - 64, T - 52, 100);
  } };

  VIS.chart = { label: 'Chart + numbers', mirror: true, about: 'a chart card with one KPI and the insight', build: function (p, a) {
    var T = a.T, ch = p.chart || {}, data = arr(ch.data).filter(Array.isArray).map(function (x) { return [t(x[0], 12), num(x[1], 0)]; }).slice(0, 7);
    if (data.length < 2) data = [['Mon', 12], ['Tue', 18], ['Wed', 15], ['Thu', 22], ['Fri', 26]];
    var kind = pick(['bar', 'line', 'area', 'donut', 'funnel', 'progress'], ch.kind, 'bar');
    var G = { type: 'graph', w: 620, z: 12, kind: kind, title: t(ch.title, 30) || 'This week', tag: t(ch.tag, 16) || undefined, data: data, highlight: idx(ch.highlight, data.length), unit: t(ch.unit, 4) || undefined, note: t(ch.note, 60) || undefined };
    if (kind === 'donut') { G.center = t(ch.center, 8) || undefined; G.centerLabel = t(ch.centerLabel, 14) || undefined; }
    if (kind === 'progress') G.max = num(ch.max, 100);
    var GB = a.add(G, 52, T), k = arr(p.kpi), KB = null, CB = null;
    if (k.length >= 2) KB = a.add({ type: 'stat', w: 300, rot: 3, z: 13, value: t(k[1], 10), label: t(k[0], 24) + (t(k[2], 10) ? ' · ' + t(k[2], 10) : '') }, 716, T + 14);
    var c = chipL(p.chip, 'chart'); if (c) { c.rot = -2; var cw = a.w(c); CB = a.add(c, Math.min(690, W - 24 - cw), (KB ? KB.y1 : T) + 30); }
    if (p.nexi) { var nx = a.nexi(p.nexi, 330); a.add(nx, W - 46 - nx.w, Math.max((CB || KB || { y1: T }).y1 + 14, T + 290), 'bleed'); }
    var pl = strs(p.pills, 1, 22)[0]; if (pl) a.pill(pl, 80, GB.y1 + 30, -3);
    a.sparkles(GB.x1 - 56, T - 40, 92);
  } };

  function viewData(p, view) {
    var L = { view: view };
    if (view === 'kanban') {
      L.stages = arr(p.stages).filter(Array.isArray).slice(0, 4).map(function (s) { return [t(s[0], 14), arr(s[1]).filter(Array.isArray).slice(0, 2).map(function (c) { return [t(c[0], 22), t(c[1], 24), t(c[2], 12), t(c[3], 3)]; })]; });
      L.highlight = strs(p.highlight, 2, 5);
    } else if (view === 'list') {
      L.cols = strs(p.cols, 4, 14); L.rows = arr(p.rows).filter(Array.isArray).slice(0, 5).map(function (r) { return r.slice(0, L.cols.length || 4).map(function (c) { return t(c, 20); }); });
      L.highlight = idx(p.highlight, L.rows.length); L.sum = t(p.sum, 30) || undefined;
    } else if (view === 'planning') {
      L.days = strs(p.days, 5, 5); if (L.days.length < 3) L.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      L.rows = arr(p.rows).filter(Array.isArray).slice(0, 4).map(function (r) { return [t(r[0], 16), arr(r[1]).filter(Array.isArray).slice(0, 3).map(function (b) { return [num(b[0], 0), num(b[1], 1), t(b[2], 16)]; })]; });
    } else if (view === 'kds') {
      L.tickets = arr(p.tickets).filter(Array.isArray).slice(0, 3).map(function (k) { return [t(k[0], 12), arr(k[1]).filter(Array.isArray).slice(0, 3).map(function (i) { return [t(i[0], 18), t(i[1], 3)]; }), t(k[2], 10) || 'Cooking', t(k[3], 8)]; });
    } else if (view === 'pos') {
      L.table = t(p.table, 22) || undefined; L.products = arr(p.products).filter(Array.isArray).slice(0, 6).map(function (x) { return [t(x[0], 16), t(x[1], 10)]; });
      L.order = arr(p.order).filter(Array.isArray).slice(0, 3).map(function (x) { return x.slice(0, 4).map(function (c) { return t(c, 16); }); }); L.total = t(p.total, 14) || undefined; L.btn = t(p.btn, 14) || undefined;
    } else if (view === 'dashboard') {
      L.kpis = arr(p.kpis).filter(Array.isArray).slice(0, 3).map(function (x) { return [t(x[0], 18), t(x[1], 12), t(x[2], 8)]; });
      var ch = p.chart || {}; L.chart = { kind: pick(['bar', 'line', 'area', 'donut', 'funnel', 'progress'], ch.kind, 'bar'), title: t(ch.title, 30), data: arr(ch.data).filter(Array.isArray).slice(0, 7).map(function (x) { return [t(x[0], 10), num(x[1], 0)]; }), highlight: idx(ch.highlight, 7), unit: t(ch.unit, 4) || undefined };
    }
    return L;
  }
  VIS.board = { label: 'Odoo board', mirror: true, about: 'one Odoo view as a card: pipeline, list, roster, kitchen tickets, till or dashboard', build: function (p, a) {
    var T = a.T, view = pick(['kanban', 'list', 'planning', 'kds', 'pos', 'dashboard'], p.view, 'kanban'), L = viewData(p, view);
    L.type = 'appcard'; L.z = 12; L.app = mod(p.app, { kanban: 'crm', list: 'sale', planning: 'planning', kds: 'pos_restaurant', pos: 'point_of_sale', dashboard: 'spreadsheet_dashboard' }[view]);
    L.title = t(p.title, 30) || undefined; L.crumb = t(p.crumb, 34) || undefined; L.tag = t(p.tag, 18) || undefined;
    var B, pl = strs(p.pills, 1, 22)[0], c = chipL(p.chip);
    if (p.nexi) {
      L.w = 740; B = a.add(L, 30, T);
      var nx = a.nexi(p.nexi, 400); a.add(nx, W - 14 - nx.w, Math.max(T + 150, B.y1 - 150), 'bleed');
      if (pl) a.pill(pl, 60, B.y1 + 28, -3);
      if (c) { c.rot = 2; a.add(c, pl ? 440 : 60, B.y1 + (pl ? 40 : 30)); }
    } else {
      L.w = 920; B = a.add(L, 80, T);
      if (pl) a.pill(pl, 40, B.y1 - 18, -4, 460);
      if (c) { c.rot = 2; var cw = a.w(c); a.add(c, W - 40 - cw, B.y1 - 10); }
    }
    a.sparkles(B.x1 - 70, T - 50, 96);
  } };

  VIS.chat = { label: 'Chat to Odoo', mirror: true, about: 'a WhatsApp or website chat and what it creates in Odoo', build: function (p, a) {
    var T = a.T, c = p.chat || {}, msgs = arr(c.msgs).filter(Array.isArray).slice(0, 4).map(function (m) { return [pick(['in', 'out', 'bot'], m[0], 'in'), t(m[1], 72)]; }).filter(function (m) { return m[1]; });
    if (!msgs.length) msgs = [['in', 'Hi, can I order for tomorrow?'], ['bot', 'Sure. What would you like?']];
    var CB = a.add({ type: 'chat', w: 440, rot: -3, z: 12, channel: pick(['whatsapp', 'web', 'odoo'], c.channel, 'whatsapp'), title: t(c.title, 24) || undefined, status: t(c.status, 28) || undefined, msgs: msgs }, 52, T);
    var ch = chipL(p.chip);
    if (p.record) {
      var rec = recordL(p.record, 'sale'); rec.w = 500; rec.rot = 2; rec.z = 13;
      var RB = a.add(rec, 534, T + 84);
      a.fx({ type: 'arrow', w: 112, rot: 10, z: 22, kind: 'right' }, 436, T + 6);
      if (ch) { ch.rot = -1.5; a.add(ch, Math.min(580, W - 24 - a.w(ch)), RB.y1 + 30); }
    } else {
      var nx = a.nexi(p.nexi || 'wave', 500); a.add(nx, W - 40 - nx.w, T + 110, 'bleed');
      var b = t(p.bubble, 18); if (b) a.add({ type: 'bubble', text: b, rot: 3, z: 20 }, 610, T + 16);
      if (ch) { ch.rot = 2; a.add(ch, 80, CB.y1 + 30); }
    }
    var lb = t(p.label, 22); if (lb) a.pill(lb, p.record ? 70 : 90, CB.y1 + (ch && !p.record ? 118 : 30), -4, 440);
    a.sparkles(p.record ? 470 : 520, p.record ? T + 170 : T + 300, 90);
  } };

  VIS.alerts = { label: 'Nexi + alerts', mirror: true, about: 'Nexi with 2-3 Odoo notifications', build: function (p, a) {
    var T = a.T, list = arr(p.alerts).map(obj).filter(function (n) { return n.title; }).slice(0, 3);
    if (!list.length) list = [{ app: 'stock', title: 'Low stock', text: 'Reorder rule raised a purchase order', time: 'now' }];
    a.add(a.nexi(p.nexi || 'surprise', 540), 26, T + 86, 'bleed');
    var b = t(p.bubble, 18); if (b) a.add({ type: 'bubble', text: b, rot: -3, z: 20 }, 60, T);
    var y = T + 10;
    list.forEach(function (n, i) { var B = a.add({ type: 'notif', w: 560, rot: [-1.5, 1.5, -1][i], z: 12 + i, app: mod(n.app, 'mail'), title: t(n.title, 30), text: t(n.text, 50) || undefined, time: t(n.time, 8) || 'now' }, [470, 496, 478][i], y); y = B.y1 + 24; });
    a.sparkles(414, T + 22, 96);
  } };

  VIS.timeline = { label: 'Timeline', mirror: true, about: 'one record or one day, step by step with times', build: function (p, a) {
    var T = a.T, items = arr(p.items).filter(Array.isArray).slice(0, 5).map(function (x) { return [t(x[0], 8), t(x[1], 28), mod(x[2], ''), t(x[3], 34) || undefined]; });
    var TB = a.add({ type: 'timeline', w: 620, z: 12, title: t(p.title, 30) || undefined, items: items, hot: idx(p.hot, items.length) }, 56, T);
    var c = chipL(p.chip), CB = null;
    if (c) { c.rot = 3; CB = a.add(c, Math.min(720, W - 24 - a.w(c)), T + 40); }
    var nx = a.nexi(p.nexi || 'celebrate', 470); a.add(nx, W - 40 - nx.w, (CB ? CB.y1 : T) + 60, 'bleed');
    a.sparkles(TB.x1 - 40, T - 44, 96);
  } };

  VIS.reaction = { label: 'Nexi reaction', about: 'a big Nexi reaction with 3 handwritten callouts, for a question hook', build: function (p, a) {
    var T = a.T;
    a.fx({ type: 'glow', w: 660, z: 2 }, 210, T - 20);
    var nx = a.nexi(p.nexi || 'surprise', 590); a.add(nx, Math.round((W - nx.w) / 2), T + 10, 'bleed');
    strs(p.pills, 3, 20).forEach(function (tx, i) {
      var L = { type: 'pill', text: tx, rot: [-5, 4, -2][i], z: 19 }; a.fitW(L, 420); var w = a.w(L);
      a.add(L, i === 1 ? W - 40 - w : [44, 0, 70][i], [T + 96, T + 262, T + 440][i]);
    });
    a.sparkles(826, T + 4, 124); a.sphere(150, T + 18, 50);
  } };

  VIS.orbit = { label: 'App orbit', about: 'Odoo apps around one database', build: function (p, a) {
    var T = a.T, apps = mods(p.apps, 10);
    a.add({ type: 'orbit', w: 500, z: 12, apps: apps.length >= 5 ? apps : undefined, label: t(p.label, 16) || 'One database', core: p.core === 'odoo' ? 'odoo' : undefined }, 290, T - 6);
    strs(p.pills, 2, 20).forEach(function (tx, i) { var L = { type: 'pill', text: tx, rot: i ? 4 : -5, z: 19 }; a.fitW(L, 360); a.add(L, i ? W - 26 - a.w(L) : 26, i ? T + 400 : T + 64); });
    a.sparkles(820, T + 6, 110);
  } };

  VIS.appflow = { label: 'How a record moves', about: 'the states of one Odoo record and its hand-offs', build: function (p, a) {
    var T = a.T, app = C.appFlows && C.appFlows[mod(p.app, '')] ? mod(p.app, '') : 'sale', f = (C.appFlows || {})[app] || { states: [] };
    var AB = a.add({ type: 'appflow', w: 940, z: 12, app: app, hot: idx(p.hot, Math.min(5, (f.path || f.states).length)), title: t(p.title, 40) || undefined }, 70, T + 10);
    var nx = a.nexi(p.nexi || 'wave', 300); a.add(nx, 56, AB.y1 + 16, 'bleed');
    strs(p.pills, 2, 20).forEach(function (tx, i) { a.pill(tx, [330, 640][i], AB.y1 + [70, 104][i], [-3, 3][i], [300, W - 30 - 640][i]); });
  } };

  VIS.phases = { label: 'Rollout phases', needs: 'industry', about: "the website's three rollout phases for the industry", build: function (p, a, ctx) {
    var PB = a.add({ type: 'phases', w: 940, z: 12, from: 'industry:' + ctx.industry }, 70, a.T + 6);
    var pl = strs(p.pills, 1, 22)[0] || 'Live in phases'; a.pill(pl, 80, PB.y1 + 36, -4);
    if (p.nexi) { var nx = a.nexi(p.nexi, 260); a.add(nx, W - 60 - nx.w, PB.y1 + 10, 'bleed'); } else a.sparkles(900, PB.y1 + 16, 104);
  } };

  VIS.website = { label: 'Website we built', about: 'a TechNext-built website on a laptop and phone', build: function (p, a) {
    var T = a.T, site = (C.sites || {})[p.site] ? p.site : 'technext';
    a.add({ type: 'devices', w: 720, z: 12, site: site, label: C.sites[site].name + ' · built by TechNext' }, 46, T + 14);
    a.fx({ type: 'cursor', w: 64, z: 19 }, 360, T + 262);
    var y = T + 84;
    strs(p.chips, 3, 26).forEach(function (tx, i) { var L = { type: 'chip', text: tx, icon: 'check', tone: 'ok', rot: [2, -1.5, 1.5][i], z: 18 }, w = a.w(L); var B = a.add(L, Math.min([770, 790, 762][i], W - 20 - w), y); y = B.y1 + 26; });
    a.sparkles(930, T - 24, 100); a.sphere(990, T + 450, 50);
  } };

  VIS.webdesign = { label: 'Web design craft', about: 'a website mockup, its code and a score', build: function (p, a) {
    var T = a.T;
    var SB = a.add({ type: 'site', w: 640, rot: -2, z: 12, brand: t(p.brand, 18) || 'Your Brand', head: t(p.sitehead, 44) || undefined, cta: t(p.cta, 16) || undefined }, 56, T + 8);
    a.add({ type: 'code', w: 420, rot: 3, z: 14 }, 612, T + 122);
    a.add({ type: 'gauge', w: 190, z: 16, label: t(p.gauge, 14) || 'Mobile-first' }, 836, T + 384);
    a.fx({ type: 'cursor', w: 64, z: 19 }, 300, T + 262);
    var pl = strs(p.pills, 1, 20)[0]; if (pl) a.pill(pl, 80, SB.y1 + 22, -3);
  } };

  VIS.google = { label: 'Found on Google', about: 'a Google result for TechNext', build: function (p, a) {
    var T = a.T, SB = a.add({ type: 'serp', w: 860, z: 12, query: t(p.query, 44) || undefined, title: t(p.title, 64) || undefined, desc: t(p.desc, 160) || undefined }, 110, T + 20);
    var nx = a.nexi(p.nexi || 'point', 300); a.add(nx, W - 50 - nx.w, SB.y1 - 30, 'bleed');
    strs(p.chips, 2, 26).forEach(function (tx, i) { a.add({ type: 'chip', text: tx, icon: i ? 'search' : 'check', tone: i ? undefined : 'ok', rot: i ? 1.5 : -1.5, z: 18 }, [130, 180][i], SB.y1 + [30, 112][i]); });
  } };

  VIS.proof = { label: 'TechNext in numbers', about: 'the approved company figures', build: function (p, a) {
    var T = a.T;
    var top = 0;
    [['10+', 'countries'], ['11+', 'enterprise clients'], ['4', 'AI disciplines']].forEach(function (f, i) { var B = a.add({ type: 'stat', variant: 'big', w: 292, rot: [-3, 0, 3][i], z: 12 + i, value: f[0], label: f[1] }, [60, 394, 728][i], T + [34, 0, 34][i]); top = Math.max(top, B.y1); });
    var nx = a.nexi(p.nexi || 'celebrate', 420); a.add(nx, Math.round((W - nx.w) / 2), top + 20, 'bleed');
    strs(p.pills, 2, 20).forEach(function (tx, i) { var L = { type: 'pill', text: tx, rot: i ? 4 : -4, z: 19 }; a.fitW(L, 330); a.add(L, i ? W - 54 - a.w(L) : 54, top + 90 + i * 70); });
    a.sparkles(860, T - 40, 96);
  } };

  /* which visuals suit which category (the prompt only offers these) */
  var FOR_CAT = {
    industry: ['phone', 'record', 'paper', 'checklist', 'versus', 'flow', 'chart', 'board', 'chat', 'alerts', 'timeline', 'reaction', 'orbit', 'appflow', 'phases'],
    odoo20: ['phone', 'record', 'paper', 'checklist', 'versus', 'chart', 'board', 'chat', 'alerts', 'timeline', 'reaction', 'orbit'],
    apps: ['phone', 'record', 'paper', 'checklist', 'versus', 'flow', 'chart', 'board', 'chat', 'alerts', 'timeline', 'reaction', 'orbit', 'appflow'],
    ai: ['record', 'paper', 'chat', 'alerts', 'checklist', 'versus', 'timeline', 'board', 'phone', 'reaction'],
    services: ['website', 'webdesign', 'google', 'checklist', 'versus', 'chat', 'timeline', 'reaction', 'proof'],
    'field-service': ['phone', 'board', 'timeline', 'record', 'checklist', 'alerts', 'versus', 'chart', 'reaction', 'appflow']
  };
  function forCat(cat, industry) { var l = FOR_CAT[cat] || (industry ? FOR_CAT.industry : FOR_CAT.apps); return industry || cat !== 'odoo20' ? l : l.filter(function (v) { return v !== 'phases'; }); }

  function guess(p) {
    if (p.site) return 'website'; if (p.query) return 'google'; if (p.sitehead) return 'webdesign';
    if (p.doc || p.paper) return 'paper'; if (p.chat) return 'chat'; if (p.alerts) return 'alerts';
    if (p.old && p.new) return 'versus'; if (p.chart) return 'chart'; if (p.view || p.stages || p.tickets) return 'board';
    if (p.steps && typeof arr(p.steps)[0] === 'object') return 'flow'; if (p.lines) return 'phone'; if (p.rows) return 'record';
    if (p.items && Array.isArray(arr(p.items)[0])) return 'timeline'; if (p.items) return 'checklist'; if (p.apps) return 'orbit';
    return 'reaction';
  }

  /* ---------- a post → a drip ---------- */
  function compose(post, ctx) {
    ctx = ctx || {};
    var p = JSON.parse(JSON.stringify(post || {})), vis = VIS[p.visual] ? p.visual : guess(p);
    if (VIS[vis].needs === 'industry' && !ctx.industry) vis = 'checklist';
    p.visual = vis;
    var head = t(p.head, 90) || 'Your headline,|*in blue.*', sub = t(p.sub, 150);
    var d = {
      id: '', v: 4, cat: ctx.cat || 'apps', name: t(p.name, 60) || head.replace(/\s*\|\s*/g, ' ').replace(/[*~=\[\]]/g, '').replace(/\s+/g, ' ').trim(), angle: t(p.angle, 20) || undefined,
      visual: vis, variant: parseInt(p.variant, 10) || 0, mirror: !!p.mirror && !!VIS[vis].mirror, ground: p.ground != null ? p.ground : GROUND,
      badge: ctx.cat === 'services' ? '' : ctx.cat === 'odoo20' || p.badge === 'o20' ? 'o20' : 'ready',
      copy: ctx.copy ? JSON.parse(JSON.stringify(ctx.copy)) : { head: head, sub: sub || undefined }, layers: [],
      caption: t(p.caption, 900) || undefined, hashtags: strs(p.hashtags, 6, 30).map(function (h) { h = h.replace(/\s+/g, ''); return h.charAt(0) === '#' ? h : '#' + h; }),
      source: ctx.source || '', post: p
    };
    var a = stage(d);
    VIS[vis].build(p, a, ctx, d);
    if (d.mirror) mirror(d);
    settle(d, copyBottom(d.copy) + 34, VIS[vis].center);
    d.layers.forEach(function (L) { delete L._m; delete L._r; Object.keys(L).forEach(function (k) { if (L[k] === undefined) delete L[k]; }); });
    if (!d.hashtags.length) delete d.hashtags;
    Object.keys(d).forEach(function (k) { if (d[k] === undefined) delete d[k]; });
    return d;
  }
  /* every post in a set: a different visual where Claude chose one, and alternating sides */
  function diversify(posts) {
    var seen = {}, last = {};
    return arr(posts).map(function (p, i) {
      p = p || {}; var v = VIS[p.visual] ? p.visual : guess(p), n = seen[v] || 0; seen[v] = n + 1;
      p.visual = v;
      if (p.mirror == null) p.mirror = !!VIS[v].mirror && (n ? !last[v] : i % 2 === 1);
      last[v] = !!p.mirror;
      if (p.variant == null) p.variant = n;
      return p;
    });
  }
  /* the editor's "Mirror" and "Re-layout": rebuild from the post, keeping the edited headline, subline and caption */
  function relayout(d, change, ctx) {
    var p = JSON.parse(JSON.stringify(d.post || {}));
    p.head = (d.copy && d.copy.head) || p.head; p.sub = (d.copy && d.copy.sub) || p.sub;
    p.caption = d.caption || p.caption; p.hashtags = d.hashtags || p.hashtags; p.name = d.name || p.name; p.ground = d.ground;
    p.mirror = change && change.mirror != null ? change.mirror : d.mirror; p.variant = change && change.variant != null ? change.variant : d.variant;
    var c2 = {}; Object.keys(ctx || {}).forEach(function (k) { c2[k] = ctx[k]; }); c2.copy = d.copy;
    var n = compose(p, c2);
    if (d.badge != null) n.badge = d.badge;
    return n;
  }

  window.TNSimple = { compose: compose, diversify: diversify, relayout: relayout, forCat: forCat, VIS: VIS, POSES: POSES, GROUND: GROUND, canMirror: function (v) { return !!(VIS[v] && VIS[v].mirror); }, hasVariants: function (v) { return v === 'versus'; } };
})();
