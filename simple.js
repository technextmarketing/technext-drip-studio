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
  function area(a, b) { var w = Math.min(a.x1, b.x1) - Math.max(a.x, b.x), h = Math.min(a.y1, b.y1) - Math.max(a.y, b.y); return w > 0 && h > 0 ? w * h : 0; }
  function box(x, y, w, h) { return { x: x, y: y, w: w, h: h, x1: x + w, y1: y + h, cx: x + w / 2, cy: y + h / 2 }; }
  function vbox(L) { var m = L._m || { w: L.w || 100, h: L.w || 100 }, s = L.s || 1; return box(L.x + m.w * (1 - s) / 2, L.y + m.h * (1 - s) / 2, m.w * s, m.h * s); }

  /* the builder's toolkit: every builder places its elements for a subline ending near y 406 (T = 440);
     settle() then moves and, if needed, scales the whole group into the space the real copy leaves */
  function stage(d) {
    var a = { T: T0, m: size, tiltK: d._tiltK == null ? 1 : d._tiltK };
    a.add = function (L, vx, vy, role) {
      if (L.rot && role !== 'fx' && a.tiltK !== 1) L.rot = +Math.max(-9, Math.min(9, L.rot * a.tiltK)).toFixed(1);
      var m = size(L), s = L.s || 1;
      L.x = Math.round(vx - m.w * (1 - s) / 2); L.y = Math.round(vy - m.h * (1 - s) / 2); L._m = m; L._r = role || 'main';
      d.layers.push(L); return box(vx, vy, m.w * s, m.h * s);
    };
    a.fx = function (L, x, y) { return a.add(L, x, y, 'fx'); };
    a.nexi = function (pose, h) { pose = pick(POSES, pose, 'point'); return { type: 'nexi', pose: pose, w: Math.round(h * (NEXI_AR[pose] || .8)), z: 16 }; };
    a.fitW = function (L, maxW) { var m = size(L); if (m.w > maxW) L.s = +Math.max(.6, maxW / m.w).toFixed(3); return L; };
    a.w = function (L) { return size(L).w * (L.s || 1); };
    a.col = function (items, x, y, gap) { items.forEach(function (L) { if (!L) return; var w = a.w(L), B = a.add(L, Math.max(18, Math.min(x, W - 22 - w)), y); y = B.y1 + (gap == null ? 26 : gap); }); return y; };
    /* the free spot nearest the hero that covers the least of what is already placed */
    a.free = function (L, o) {
      o = o || {};
      var m = size(L), s = L.s || 1, w = m.w * s, h = m.h * s, near = o.near || box(W / 2, a.T + 200, 1, 1), best = null;
      var occ = d.layers.filter(function (x) { return x._r === 'main' || x._r === 'bleed' || x._r === 'accent' || (x._r === 'fx' && !/^(glow|sparkles|sphere|burst)$/.test(x.type)); }).map(vbox);
      for (var y = a.T - 6; y <= BOTTOM - h; y += 22) for (var x = 18; x <= W - 18 - w; x += 22) {
        var b = box(x, y, w, h), ov = 0;
        for (var k = 0; k < occ.length; k++) ov += area(b, occ[k]);
        var f = ov / (w * h), sc = f * 1000 + Math.hypot(b.cx - near.cx, b.cy - near.cy) * .35;
        if (!best || sc < best.sc) best = { x: x, y: y, f: f, sc: sc };
      }
      if (!best || best.f > (o.maxOverlap == null ? .08 : o.maxOverlap)) return null;
      return a.add(L, best.x, best.y, o.role || 'accent');
    };
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
    Ls.forEach(function (L) { if (L._r === 'fx') return; var b = vbox(L); top = Math.min(top, b.y); if (L._r === 'main' || L._r === 'accent') bot = Math.max(bot, b.y1); });
    if (!isFinite(top)) return;
    if (!isFinite(bot)) bot = top + 320;
    var avail = BOTTOM - T, gh = bot - top, f = gh > avail ? Math.max(.7, avail / gh) : 1;
    if (f < 1) Ls.forEach(function (L) { scaleAbout(L, W / 2, top, f); });
    var dy = Math.round(T + Math.max(0, avail - gh * f) * (center == null ? .2 : center) - top);
    Ls.forEach(function (L) { L.y += dy; });
    /* nothing solid past the sides */
    Ls.forEach(function (L) { if (L._r !== 'main' && L._r !== 'accent') return; var b = vbox(L); if (b.x < 14) L.x += Math.round(14 - b.x); else if (b.x1 > W - 14) L.x -= Math.round(b.x1 - W + 14); });
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

  VIS.record = { label: 'Record + Nexi', mirror: true, variants: 2, about: 'Nexi next to one Odoo record, with 3 step chips', build: function (p, a, ctx, d) {
    var T = a.T, rec = recordL(p); rec.w = 540; rec.rot = 2.5; rec.z = 12;
    if ((d.variant || 0) % 2 === 1) {
      rec.w = 580; rec.rot = -2; rec.stack = 1;
      var R1 = a.add(rec, 56, T + 10), st1 = strs(p.steps, 3, 26), y1 = T + 40;
      st1.forEach(function (tx, i) { var last = i === st1.length - 1, L = { type: 'chip', text: tx, icon: last ? 'check' : ['spark', 'search'][i], tone: last ? 'ok' : undefined, rot: [2, -1.5, 1.5][i], z: 18 + i }; a.fitW(L, 380); var B1 = a.add(L, 676, y1); y1 = B1.y1 + 22; });
      var nx1 = a.nexi(p.nexi || 'point', 340); a.add(nx1, W - 40 - nx1.w, Math.max(y1 + 20, T + 300), 'bleed');
      a.sparkles(R1.x1 - 60, T - 40, 96);
      return;
    }
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

  VIS.checklist = { label: 'Checklist + Nexi', mirror: true, variants: 2, center: .3, about: 'a card of 3-4 points with Nexi presenting it', build: function (p, a, ctx, d) {
    var T = a.T, items = strs(p.items, 4, 70);
    if (!items.length && ctx.industry) items = ((C.industries[ctx.industry] || {}).new20 || []).slice(0, 4);
    if ((d.variant || 0) % 2 === 1) {
      a.add({ type: 'checklist', w: 640, rot: -2, stack: 1, z: 12, big: items.length <= 3 || undefined, app: mod(p.app, undefined), title: t(p.title, 34) || 'What changes', tag: t(p.tag, 20) || undefined, items: items, apps: mods(p.apps, 5) }, 56, T + 10);
      var nm = propName(p.prop, ctx) || propName('', ctx, ctx.index || 0);
      if (nm) a.add({ type: 'prop', name: nm, w: 290, rot: 6, z: 14 }, 740, T + 40);
      else { var nx2 = a.nexi(p.nexi || 'present', 440); a.add(nx2, W - 24 - nx2.w, T + 110, 'bleed'); }
      strs(p.pills, 1, 22).forEach(function (tx) { a.pill(tx, 720, T + 400, 4, 330); });
      a.sparkles(700, T - 30, 90);
      return;
    }
    var CB = a.add({ type: 'checklist', w: 660, z: 12, big: items.length <= 3 || undefined, app: mod(p.app, undefined), title: t(p.title, 34) || 'What changes', tag: t(p.tag, 20) || undefined, items: items, apps: mods(p.apps, 5) }, 56, T);
    var nx = a.nexi(p.nexi || 'present', 560); a.add(nx, W - 34 - nx.w, T + 96, 'bleed');
    a.sparkles(926, T + 8, 100);
    var pl = strs(p.pills, 1, 22)[0]; if (pl && CB.y1 + 110 < BOTTOM) a.pill(pl, 96, CB.y1 + 34, -3);
  } };

  VIS.versus = { label: 'Old way vs Odoo', variants: 2, center: .3, about: 'the old way next to the same job in Odoo', build: function (p, a, ctx, d) {
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

  VIS.chart = { label: 'Chart + numbers', mirror: true, variants: 2, center: .3, about: 'a chart card with one KPI and the insight', build: function (p, a, ctx, d) {
    var T = a.T, ch = p.chart || {}, data = arr(ch.data).filter(Array.isArray).map(function (x) { return [t(x[0], 12), num(x[1], 0)]; }).slice(0, 7);
    if (data.length < 2) data = [['Mon', 12], ['Tue', 18], ['Wed', 15], ['Thu', 22], ['Fri', 26]];
    var kind = pick(['bar', 'line', 'area', 'donut', 'funnel', 'progress'], ch.kind, 'bar');
    var G = { type: 'graph', w: 620, z: 12, kind: kind, title: t(ch.title, 30) || 'This week', tag: t(ch.tag, 16) || undefined, data: data, highlight: idx(ch.highlight, data.length), unit: t(ch.unit, 4) || undefined, note: t(ch.note, 60) || undefined };
    if (kind === 'donut') { G.center = t(ch.center, 8) || undefined; G.centerLabel = t(ch.centerLabel, 14) || undefined; }
    if (kind === 'progress') G.max = num(ch.max, 100);
    var k0 = arr(p.kpi);
    if ((d.variant || 0) % 2 === 1 && k0.length >= 2) {
      var SB = a.add({ type: 'stat', variant: 'big', w: 420, rot: -3, z: 13, value: t(k0[1], 10), label: t(k0[0], 24) + (t(k0[2], 10) ? ' · ' + t(k0[2], 10) : '') }, 50, T + 40);
      G.w = 530; G.rot = 2; a.add(G, 496, T + 10);
      var c3 = chipL(p.chip, 'chart'); if (c3) { c3.rot = -2; a.add(c3, 80, SB.y1 + 30); }
      if (p.nexi) { var nx3 = a.nexi(p.nexi, 300); a.add(nx3, W - 60 - nx3.w, T + 420, 'bleed'); }
      return;
    }
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
  VIS.board = { label: 'Odoo board', mirror: true, variants: 2, about: 'one Odoo view as a card: pipeline, list, roster, kitchen tickets, till or dashboard', build: function (p, a, ctx, d) {
    var T = a.T, view = pick(['kanban', 'list', 'planning', 'kds', 'pos', 'dashboard'], p.view, 'kanban'), L = viewData(p, view);
    L.type = 'appcard'; L.z = 12; L.app = mod(p.app, { kanban: 'crm', list: 'sale', planning: 'planning', kds: 'pos_restaurant', pos: 'point_of_sale', dashboard: 'spreadsheet_dashboard' }[view]);
    L.title = t(p.title, 30) || undefined; L.crumb = t(p.crumb, 34) || undefined; L.tag = t(p.tag, 18) || undefined;
    var B, pl = strs(p.pills, 1, 22)[0], c = chipL(p.chip);
    if ((d.variant || 0) % 2 === 1) {
      L.w = 820; L.rot = -2; L.stack = 1; B = a.add(L, 36, T + 10);
      var hot = view === 'kanban' && L.highlight && L.highlight[0] ? String(L.highlight[0]).split('.') : null, card = null;
      if (hot) { var sg = (L.stages || [])[+hot[0]], cc = sg && sg[1] && sg[1][+hot[1]]; if (cc) card = { type: 'kcard', w: 400, rot: 4, z: 16, app: L.app, title: cc[0], sub: cc[1] || undefined, amount: cc[2] || undefined, owner: cc[3] || cc[0], tags: strs(p.tags, 2, 12), priority: 2, activity: t(p.activity, 30) || undefined }; }
      if (!card) card = notifL(p.notif, L.app, 400);
      if (card) a.add(card, W - 30 - (card.w || 400), B.y1 - 110);
      if (pl) a.pill(pl, 60, B.y1 + 30, -3, 440);
      else if (c) { c.rot = -2; a.add(c, 60, B.y1 + 30); }
      a.sparkles(B.x1 - 90, T - 44, 96);
      return;
    }
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

  /* ================= v5: Odoo documents and cards, poster layouts ================= */
  var PATTERNS = ['dots', 'grid', 'fine', 'diagonal', 'rings', 'plus', 'hex', 'waves', 'spots', 'floor'];
  /* looks: whole-post design directions under the fixed frame */
  var LOOKS = ['clean', 'band', 'navy', 'corner', 'outline', 'paper', 'spotlight', 'stack'];
  var LOOK_ABOUT = { clean: 'white cards on a light floor', band: 'a blue panel across the lower half, white cards and white pills on it', navy: 'a navy panel, white cards, yellow pills', corner: 'a big blue rounded shape in the lower-right corner behind the visual', outline: 'printed sticker look: navy outlines and hard offset shadows on every card and pill', paper: 'warm cream cards and coral handwriting on a sand background', spotlight: 'a warm glow and a huge faded industry illustration behind the visual', stack: 'cards on a desk: paper sheets behind each one, stronger tilts, a floor grid' };
  var ACCENTS = ['blue', 'navy', 'teal', 'coral', 'purple', 'yellow'];
  var DECORS = ['none', 'circle', 'underline', 'marker', 'strokes', 'box'];
  var LOOK_ACC = { navy: 'yellow', outline: 'navy', paper: 'coral', band: 'blue', corner: 'blue' };
  var HERO = ['normal', 'big', 'small'], TILTS = ['soft', 'flat', 'strong'], TILT_K = { flat: 0, soft: 1, strong: 1.9 };
  var NEXI_OPT = { workorder: 1, chart: 1, board: 1, spotlight: 1, pyramid: 1, groups: 1, phases: 1, people: 1 };
  function shuffle(list, r) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t2 = a[i]; a[i] = a[j]; a[j] = t2; } return a; }
  var TINTS = ['sky', 'mint', 'lilac', 'sand'];
  var DOCKINDS = ['quote', 'order', 'invoice', 'bill', 'po', 'delivery', 'receipt'];
  var PICOS = ['box', 'shirt', 'cup', 'bag', 'bowl', 'bottle', 'tool', 'pill', 'chair', 'plant'];
  function clampN(v, lo, hi) { v = parseFloat(v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : lo; }
  function three(v) { v = arr(v); return [t(v[0], 24), t(v[1], 30), t(v[2], 14)]; }
  function docL(p, dKind) {
    p = p || {};
    var kind = pick(DOCKINDS, p.kind, dKind || 'quote'), K = (window.TNCards && window.TNCards.DOC[kind]) || {}, st = arr(K.status), at;
    if (p.stage) { var i = st.map(function (x) { return x.toLowerCase(); }).indexOf(clean(p.stage).toLowerCase()); if (i > -1) at = i; }
    if (p.statusAt != null) at = idx(p.statusAt, st.length);
    return { type: 'doc', kind: kind, app: mod(p.app, K.app || 'sale'), label: t(p.label, 22) || undefined, number: t(p.number, 18) || undefined, statusAt: at,
      partner: t(p.partner, 30) || undefined, partnerLabel: t(p.partnerLabel, 16) || undefined,
      fields: arr(p.fields).filter(Array.isArray).slice(0, 3).map(function (f) { return [t(f[0], 16), t(f[1], 26)]; }),
      lines: arr(p.lines).filter(Array.isArray).slice(0, 4).map(function (l) { return [t(l[0], 26), t(l[1], 10), t(l[2], 14)]; }),
      total: t(p.total, 16) || undefined, ribbon: t(p.ribbon, 10) || undefined, note: t(p.note, 40) || undefined, hot: idx(p.hot, 4), btns: strs(p.btns, 2, 18) };
  }
  function productL(p) {
    p = p || {};
    var L = { type: 'product', name: t(p.item || p.name, 26) || 'Product', ref: t(p.ref, 30) || undefined, icon: pick(PICOS, p.icon, 'box'), price: t(p.price, 14) || undefined,
      stock: arr(p.stock).filter(Array.isArray).slice(0, 3).map(function (q) { return [t(q[0], 14), t(q[1], 14)]; }), level: p.level == null ? undefined : clampN(p.level, 0, 100),
      tags: strs(p.tags, 3, 18), badge: t(p.badge, 16) || undefined };
    if (!L.stock.length) delete L.stock;
    return L;
  }
  function notifL(n, dApp, w) { n = obj(n); return n.title ? { type: 'notif', w: w || 380, rot: 3, z: 14, app: mod(n.app, dApp || 'mail'), title: t(n.title, 26), text: t(n.text, 44) || undefined, time: t(n.time, 8) || 'now' } : null; }
  function msgsL(c) { return arr((c || {}).msgs).filter(Array.isArray).slice(0, 4).map(function (m) { return [pick(['in', 'out', 'bot'], m[0], 'in'), t(m[1], 72)]; }).filter(function (m) { return m[1]; }); }
  function graphL(ch, w) {
    ch = ch || {}; var data = arr(ch.data).filter(Array.isArray).map(function (x) { return [t(x[0], 12), num(x[1], 0)]; }).slice(0, 7);
    return data.length > 1 ? { type: 'graph', w: w || 440, z: 13, kind: pick(['bar', 'line', 'area', 'donut', 'funnel', 'progress'], ch.kind, 'bar'), title: t(ch.title, 28) || undefined, tag: t(ch.tag, 14) || undefined, data: data, highlight: idx(ch.highlight, data.length), unit: t(ch.unit, 4) || undefined } : null;
  }
  function propName(n, ctx, k) {
    var P = window.TNProps; if (!P) return null;
    n = clean(n).toLowerCase().replace(/[\s_-]+/g, '');
    if (n && P.names.indexOf(n) > -1) return n;
    var list = ctx && ctx.industry && P.BY_IND[ctx.industry];
    return n ? null : list ? list[(k || 0) % list.length] : null;
  }

  VIS.document = { label: 'Odoo document', mirror: true, variants: 2, about: 'a quotation, sales order, invoice, bill, purchase order or delivery', build: function (p, a, ctx, d) {
    var T = a.T, D = docL(p), B;
    if ((d.variant || 0) % 2 === 0) {
      D.w = 560; D.rot = 2; D.z = 12;
      a.add(a.nexi(p.nexi || 'point', 490), 26, T + 96, 'bleed');
      B = a.add(D, 494, T + 4);
      var b = t(p.bubble, 18); if (b) a.add({ type: 'bubble', text: b, rot: -3, z: 20 }, 56, T + 4);
      a.steps(strs(p.steps, 2, 26), B, [560, 612]);
      a.sparkles(420, T + 50, 96);
    } else {
      D.w = 590; D.rot = -2; D.z = 12; D.stack = 2;
      B = a.add(D, 60, T + 26);
      var y = T + 40, n = notifL(p.notif, D.app);
      if (n) { var NB = a.add(n, 676, y); y = NB.y1 + 30; }
      a.steps(strs(p.steps, 2, 26), { y1: y - 34 }, [690, 720]);
      strs(p.pills, 1, 20).forEach(function (tx) { a.pill(tx, 700, Math.max(y + 170, T + 360), 4, 340); });
      a.sparkles(B.x1 - 50, T - 34, 96);
    }
  } };

  VIS.product = { label: 'Product card', mirror: true, variants: 2, about: 'one product with its stock and price, and what Odoo does about it', build: function (p, a, ctx, d) {
    var T = a.T, P = productL(Object.assign({}, p, { name: undefined })), v = (d.variant || 0) % 2, items = [];
    P.w = 420; P.rot = v ? 2 : -3; P.z = 12; P.stack = 1;
    var B = a.add(P, v ? 330 : 60, T + 14);
    var sc = obj(p.scan), bc = obj(p.barcode), r = obj(p.ring), c = chipL(p.chip, 'check');
    if (sc.text || sc.title) items.push({ type: 'scanner', w: 210, rot: v ? -8 : 8, z: 14, title: t(sc.title, 14) || 'Scanned', text: t(sc.text, 22) || undefined });
    else if (bc.code) items.push({ type: 'barcode', w: 320, rot: 3, z: 13, code: t(bc.code, 20), label: t(bc.label, 24) || undefined });
    if (r.value != null) items.push({ type: 'ring', w: 210, z: 13, value: clampN(r.value, 0, 100), label: t(r.label, 18) || undefined, text: t(r.text, 6) || undefined });
    if (c) { c.rot = -2; items.push(c); }
    strs(p.pills, 1, 20).forEach(function (tx) { items.push({ type: 'pill', text: tx, rot: 3, z: 19 }); });
    if (!v) a.col(items, 560, T + 20, 26);
    else {
      var left = items.filter(function (L) { return L.type === 'scanner' || L.type === 'barcode' || L.type === 'ring'; }), right = items.filter(function (L) { return left.indexOf(L) < 0; });
      left.forEach(function (L) { if (L.type === 'barcode') L.w = 280; });
      a.col(left, 40, T + 40, 26);
      right.forEach(function (L) { a.fitW(L, 290); });
      a.col(right, 770, T + 120, 30);
    }
    a.sparkles(B.x1 - 40, T - 30, 90);
  } };

  VIS.workorder = { label: 'Work order', mirror: true, about: 'a manufacturing work order on the shop floor', build: function (p, a) {
    var T = a.T, WO = { type: 'workorder', w: 560, rot: -2, z: 12, stack: 1, app: mod(p.app, 'mrp'), title: t(p.title, 30) || 'WO/00042', sub: t(p.crumb, 34) || undefined, status: t(p.status, 14) || undefined,
      timer: t(p.timer, 9) || undefined, timerLabel: t(p.timerLabel, 18) || undefined,
      steps: arr(p.steps).filter(Array.isArray).slice(0, 4).map(function (s) { return [t(s[0], 20), t(s[1], 8) || 'todo', t(s[2], 14)]; }),
      progress: p.progress == null ? undefined : clampN(p.progress, 0, 100), progressLabel: t(p.progressLabel, 22) || undefined, btn: t(p.btn, 16) || undefined };
    var B = a.add(WO, 50, T), items = [];
    if (WO.progress != null) items.push({ type: 'ring', w: 220, z: 13, value: WO.progress, label: t(p.ringLabel, 18) || 'Order progress' });
    var c = chipL(p.chip, 'check'); if (c) { c.rot = 2; items.push(c); }
    var y = a.col(items, 680, T + 20, 28);
    if (p.nexi) { var nx = a.nexi(p.nexi, 330); a.add(nx, W - 40 - nx.w, Math.max(y, T + 340), 'bleed'); }
    strs(p.pills, 1, 20).forEach(function (tx) { a.pill(tx, 80, B.y1 + 30, -3); });
  } };

  VIS.ticket = { label: 'Helpdesk ticket', mirror: true, about: 'a support ticket with the customer message and the rating', build: function (p, a) {
    var T = a.T, c = p.chat || {}, msgs = msgsL(c), CB = null;
    var TK = { type: 'ticket', w: 540, rot: 2, z: 13, app: mod(p.app, 'helpdesk'), title: t(p.title, 36) || '#1042', sub: t(p.crumb, 34) || undefined, stage: t(p.stage, 14) || undefined,
      priority: p.priority == null ? undefined : clampN(p.priority, 0, 3), sla: t(p.sla, 12) || undefined, channel: t(p.channel, 12) || undefined, text: t(p.text, 90) || undefined, assignee: t(p.assignee, 18) || undefined, tags: strs(p.tags, 3, 12) };
    if (msgs.length) CB = a.add({ type: 'chat', w: 420, rot: -3, z: 12, channel: pick(['whatsapp', 'web', 'odoo'], c.channel, 'whatsapp'), title: t(c.title, 24) || undefined, status: t(c.status, 28) || undefined, msgs: msgs }, 44, T);
    var TB = a.add(TK, CB ? 496 : 270, CB ? T + 110 : T + 10);
    var r = obj(p.rating);
    if (r.text) a.add({ type: 'rating', w: 400, rot: -2, z: 14, stars: clampN(r.stars == null ? 5 : r.stars, 1, 5), text: t(r.text, 80), who: t(r.who, 18) || 'Customer', meta: t(r.meta, 30) || undefined }, CB ? 60 : 90, (CB ? CB.y1 : TB.y1) + 28);
    a.sparkles(TB.x1 - 60, TB.y - 56, 90);
  } };

  VIS.calendar = { label: 'Calendar', mirror: true, variants: 2, about: 'bookings, appointments or site visits on a week calendar', build: function (p, a, ctx, d) {
    var T = a.T, B, CL = { type: 'calendar', z: 12, app: mod(p.app, 'appointment'), title: t(p.title, 26) || undefined, sub: t(p.crumb, 34) || undefined, tag: t(p.tag, 14) || undefined,
      days: strs(p.days, 6, 8), from: p.from == null ? 9 : clampN(p.from, 6, 20), to: p.to == null ? undefined : clampN(p.to, 8, 23), today: idx(p.today, 6),
      events: arr(p.events).filter(Array.isArray).slice(0, 10).map(function (e) { return [clampN(e[0], 0, 5), num(e[1], 9), num(e[2], 1), t(e[3], 16), undefined, e[4] ? 1 : undefined]; }) };
    if (!CL.days.length) delete CL.days;
    if ((d.variant || 0) % 2 === 0) {
      CL.w = 700; CL.rot = -1.5; B = a.add(CL, 36, T);
      var n = notifL(p.notif, CL.app, 390); if (n) a.add(n, 650, B.y1 - 70);
      strs(p.pills, 1, 20).forEach(function (tx) { a.pill(tx, 60, B.y1 + 26, -3); });
    } else {
      CL.w = 650; CL.rot = -1; B = a.add(CL, 30, T);
      var nx = a.nexi(p.nexi || 'point', 440); a.add(nx, W - 14 - nx.w, Math.max(T + 170, B.y1 - 180), 'bleed');
      var b = t(p.bubble, 18); if (b) a.add({ type: 'bubble', text: b, rot: 3, z: 20 }, 720, T + 70);
      var c = chipL(p.chip); if (c) { c.rot = -2; a.add(c, 60, B.y1 + 28); }
    }
  } };

  VIS.people = { label: 'Employee card', mirror: true, center: .3, about: 'an employee record with leave, payslips or shifts', build: function (p, a) {
    var T = a.T, E = { type: 'employee', w: 440, rot: -3, z: 12, stack: 1, name: t(p.person, 20) || 'Mei Ling T.', job: t(p.job, 26) || undefined, dept: t(p.dept, 24) || undefined, app: mod(p.app, 'hr'),
      rows: arr(p.rows).filter(Array.isArray).slice(0, 4).map(function (r) { return [t(r[0], 12), t(r[1], 20), t(r[2], 12) || undefined]; }) };
    var B = a.add(E, 64, T + 16), items = [], tm = obj(p.team), tg = obj(p.toggle);
    if (arr(tm.names).length || tm.label) items.push({ type: 'avatars', z: 13, names: strs(tm.names, 5, 18), more: t(tm.more, 4) || undefined, label: t(tm.label, 16) || undefined });
    strs(p.steps, 3, 26).forEach(function (tx, i) { items.push({ type: 'chip', text: tx, icon: ['check', 'clock', 'spark'][i], tone: i ? undefined : 'ok', rot: [1.5, -1.5, 1][i], z: 14 + i }); });
    if (tg.text) items.push({ type: 'toggle', text: t(tg.text, 20), on: tg.on !== false, z: 14 });
    var y = a.col(items, 580, T + 30, 24);
    if (p.nexi) { var nx = a.nexi(p.nexi, 320); a.add(nx, W - 40 - nx.w, Math.max(y, T + 330), 'bleed'); }
    strs(p.pills, 1, 20).forEach(function (tx) { a.pill(tx, 90, B.y1 + 30, -3); });
  } };

  VIS.campaign = { label: 'Email campaign', mirror: true, about: 'an Odoo Email Marketing campaign and its results', build: function (p, a) {
    var T = a.T, M = { type: 'email', w: 500, rot: -2, z: 12, stack: 1, app: mod(p.app, 'mass_mailing'), from: t(p.from, 30) || undefined, subject: t(p.subject, 44) || undefined, headline: t(p.headline, 40) || undefined, cta: t(p.cta, 16) || undefined,
      stats: arr(p.stats).filter(Array.isArray).slice(0, 3).map(function (s) { return [t(s[0], 6), t(s[1], 12)]; }) };
    a.add(M, 60, T + 10);
    var items = [], r = obj(p.ring), c = chipL(p.chip, 'check');
    if (r.value != null) items.push({ type: 'ring', w: 220, z: 13, value: clampN(r.value, 0, 100), label: t(r.label, 18) || undefined, text: t(r.text, 6) || undefined });
    if (c) { c.rot = 2; items.push(c); }
    strs(p.pills, 1, 20).forEach(function (tx) { items.push({ type: 'pill', text: tx, rot: 3, z: 19 }); });
    a.col(items, 640, T + 30, 28);
  } };

  VIS.store = { label: 'Online store page', mirror: true, about: 'a product page in the Odoo online shop and the order it brings', build: function (p, a) {
    var T = a.T, S2 = { type: 'shop', w: 640, rot: -1.5, z: 12, brand: t(p.brand, 18) || undefined, url: t(p.url, 32) || undefined, product: t(p.product, 22) || undefined, category: t(p.category, 16) || undefined, icon: pick(PICOS, p.icon, 'shirt'),
      price: t(p.price, 12) || undefined, rating: p.rating == null ? undefined : clampN(p.rating, 1, 5), reviews: t(p.reviews, 14) || undefined, stock: t(p.stock, 24) || undefined, options: strs(p.options, 4, 6), cart: t(p.cart, 3) || undefined, btn: t(p.btn, 16) || undefined, badge: t(p.badge, 14) || undefined };
    var B = a.add(S2, 36, T + 6), n = notifL(p.notif, 'website_sale');
    if (n) a.add(n, 670, B.y1 - 90);
    strs(p.pills, 1, 20).forEach(function (tx) { a.pill(tx, 60, B.y1 + 26, -3); });
    a.sparkles(B.x1 - 40, T - 40, 90);
  } };

  VIS.reconcile = { label: 'Bank reconciliation', mirror: true, about: 'a bank line matched to its invoice', build: function (p, a) {
    var T = a.T, RC = { type: 'reconcile', w: 600, rot: 2, z: 12, app: mod(p.app, 'accountant'), title: t(p.title, 30) || undefined, sub: t(p.crumb, 30) || undefined, status: t(p.status, 14) || undefined,
      bank: three(p.bank), match: three(p.match), label: t(p.label, 34) || undefined, btn: t(p.btn, 14) || undefined, note: t(p.note, 30) || undefined };
    a.add(a.nexi(p.nexi || 'think', 480), 24, T + 110, 'bleed');
    var b = t(p.bubble, 18); if (b) a.add({ type: 'bubble', text: b, rot: -3, z: 20 }, 50, T + 20);
    var B = a.add(RC, 440, T + 10);
    a.steps(strs(p.steps, 2, 26), B, [520, 580]);
  } };

  VIS.approval = { label: 'Approval', mirror: true, about: 'a request waiting for approval, with the approvers', build: function (p, a) {
    var T = a.T, AP = { type: 'approval', w: 540, rot: 2, z: 12, app: mod(p.app, 'approvals'), title: t(p.title, 28) || undefined, sub: t(p.crumb, 30) || undefined, status: t(p.status, 14) || undefined,
      fields: arr(p.fields).filter(Array.isArray).slice(0, 3).map(function (f) { return [t(f[0], 14), t(f[1], 24)]; }),
      approvers: arr(p.approvers).filter(Array.isArray).slice(0, 3).map(function (x) { return [t(x[0], 16), t(x[1], 12) || 'Waiting']; }), btns: strs(p.btns, 2, 12) };
    a.add(a.nexi(p.nexi || 'point', 490), 26, T + 100, 'bleed');
    var b = t(p.bubble, 18); if (b) a.add({ type: 'bubble', text: b, rot: -3, z: 20 }, 56, T + 10);
    var B = a.add(AP, 490, T + 6);
    a.steps(strs(p.steps, 2, 26), B, [560, 610]);
  } };

  VIS.spreadsheet = { label: 'Spreadsheet report', mirror: true, about: 'an Odoo spreadsheet with live numbers and a chart', build: function (p, a) {
    var T = a.T, SH = { type: 'sheet', w: 620, rot: -2, z: 12, app: mod(p.app, 'spreadsheet_dashboard'), title: t(p.title, 28) || undefined, tag: t(p.tag, 12) || undefined, formula: t(p.formula, 40) || undefined,
      cols: strs(p.cols, 4, 12), rows: arr(p.rows).filter(Array.isArray).slice(0, 6).map(function (r) { return r.slice(0, 4).map(function (c) { return t(c, 12); }); }), highlight: arr(p.highlight).slice(0, 2).map(function (v) { return parseInt(v, 10) || 0; }), totalRow: !!p.totalRow || undefined };
    SH.w = 600; var B = a.add(SH, 36, T + 20), G = graphL(p.chart, 400);
    if (G) { G.rot = 3; a.add(G, 650, T + 210); }
    strs(p.pills, 1, 20).forEach(function (tx) { a.pill(tx, 60, B.y1 + 30, -3); });
  } };

  VIS.documents = { label: 'Documents', mirror: true, about: 'files in Odoo Documents, sorted and tagged', build: function (p, a) {
    var T = a.T, DC = { type: 'docs', w: 620, rot: -1.5, z: 12, app: mod(p.app, 'documents'), title: t(p.title, 26) || undefined, sub: t(p.crumb, 30) || undefined, tag: t(p.tag, 12) || undefined,
      files: arr(p.files).filter(Array.isArray).slice(0, 6).map(function (f) { return [t(f[0], 22), pick(['pdf', 'xls', 'doc', 'img', 'zip'], f[1], 'pdf'), t(f[2], 12) || undefined, f[3] ? 1 : undefined]; }) };
    var B = a.add(DC, 44, T + 10), nx = a.nexi(p.nexi || 'present', 420);
    a.add(nx, W - 20 - nx.w, T + 150, 'bleed');
    var b = t(p.bubble, 18); if (b) a.add({ type: 'bubble', text: b, rot: 3, z: 20 }, 700, T + 60);
    var c = chipL(p.chip, 'spark'); if (c) { c.rot = -2; a.add(c, 70, B.y1 + 26); }
  } };

  VIS.fan = { label: 'Three documents', about: 'three Odoo documents in a row: one record handed on to the next', build: function (p, a) {
    var T = a.T, ds = arr(p.docs).slice(0, 3).map(obj), Bs = [];
    while (ds.length < 3) ds.push({});
    var xs = [34, 372, 710], ys = [T + 70, T + 22, T + 70], rs = [-6, 0, 6], zs = [11, 13, 12];
    ds.forEach(function (x, i) { var D = docL(x, ['quote', 'order', 'invoice'][i]); D.compact = true; D.w = 336; D.rot = rs[i]; D.z = zs[i]; Bs.push(a.add(D, xs[i], ys[i])); });
    var low = Math.max(Bs[0].y1, Bs[1].y1, Bs[2].y1);
    [0, 1].forEach(function (i) { a.fx({ type: 'arrow', w: 92, rot: -8, z: 26, kind: 'right' }, xs[i] + 290, low - 6); });
    strs(p.pills, 2, 20).forEach(function (tx, i) { var L = { type: 'pill', text: tx, rot: i ? 3 : -3, z: 19 }; a.fitW(L, 400); var w = a.w(L); a.add(L, i ? W - 70 - w : 70, low + 86); });
    a.sparkles(Bs[1].x1 - 30, T - 34, 90);
  } };

  VIS.bignumber = { label: 'Big number', mirror: true, center: .3, about: 'one big number from Odoo, with its chart', build: function (p, a) {
    var T = a.T, k = obj(p.stat), val = t(k.value || p.value, 10) || '30.8%', lab = t(k.label || p.label, 34);
    var SB = a.add({ type: 'stat', variant: 'big', w: 430, rot: -3, z: 13, value: val, label: lab || undefined }, 60, T + 30), G = graphL(p.chart, 480), GB = null;
    if (G) { G.rot = 2; G.z = 12; GB = a.add(G, 540, T + 10); }
    var c = chipL(p.chip, 'chart'); if (c) { c.rot = -2; a.add(c, 90, SB.y1 + 30); }
    strs(p.pills, 1, 20).forEach(function (tx) { a.pill(tx, 580, (GB ? GB.y1 : T + 300) + 30, 3, 440); });
  } };

  VIS.spotlight = { label: 'Spotlight prop', mirror: true, about: 'one big industry illustration with callouts, like a poster', build: function (p, a, ctx) {
    var T = a.T, name = propName(p.prop, ctx) || propName('', ctx) || 'rocket';
    a.fx({ type: 'glow', w: 660, z: 2 }, 210, T - 20);
    a.add({ type: 'prop', name: name, w: 400, rot: -4, z: 12 }, 340, T + 24);
    strs(p.pills, 3, 20).forEach(function (tx, i) {
      var L = { type: 'pill', text: tx, rot: [-5, 4, -2][i], z: 19 }; a.fitW(L, 330); var w = a.w(L);
      a.add(L, i === 1 ? W - 40 - w : [44, 0, 70][i], [T + 70, T + 230, T + 420][i]);
    });
    var c = chipL(p.chip); if (c) { c.rot = 3; a.add(c, Math.min(640, W - 30 - a.w(c)), T + 440); }
    if (p.nexi) { var nx = a.nexi(p.nexi, 300); a.add(nx, 60, T + 420, 'bleed'); }
    a.sparkles(824, T + 4, 116);
  } };

  VIS.pyramid = { label: 'Growth pyramid', about: 'stages that build on each other, the foundation at the bottom', build: function (p, a) {
    var T = a.T, lv = arr(p.levels).map(function (x) { if (!Array.isArray(x)) x = [x && typeof x === 'object' ? x.title : x, x && typeof x === 'object' ? x.sub : '']; return [t(x[0], 16), t(x[1], 26) || undefined]; }).filter(function (x) { return x[0]; }).slice(0, 5);
    if (lv.length < 3) lv = [['Scale', 'Growth'], ['Marketing', 'Growth'], ['ERP', 'Sales · Ops · Admin']];
    var PB = a.add({ type: 'pyramid', w: 640, z: 12, levels: lv, hot: idx(p.hot, lv.length), note: t(p.note, 80) || undefined }, 220, T);
    strs(p.pills, 2, 20).forEach(function (tx, i) { var L = { type: 'pill', text: tx, rot: i ? 4 : -4, z: 19 }; a.fitW(L, 300); var w = a.w(L); a.add(L, i ? W - 30 - w : 30, i ? PB.y + PB.h * .18 : PB.y1 - 150); });
    if (p.nexi) { var nx = a.nexi(p.nexi, 280); a.add(nx, W - 50 - nx.w, PB.y1 - 150, 'bleed'); }
    a.sparkles(PB.cx - 50, T - 50, 96);
  } };

  VIS.groups = { label: 'One operating system', about: 'groups of Odoo apps on one base: how the business runs on one system', build: function (p, a) {
    var T = a.T, gs = arr(p.groups).slice(0, 3).map(function (g) { g = obj(g); return { title: t(g.title, 20), apps: arr(g.apps).slice(0, 6).map(function (x) { x = arr(x); return [mod(x[0], 'sale'), t(x[1], 16) || undefined]; }), note: t(g.note, 60) || undefined }; });
    if (!gs.length) gs = [{ title: 'Sales & growth', apps: [['crm'], ['sale'], ['sign'], ['accountant']] }, { title: 'Operations', apps: [['stock'], ['industry_fsm'], ['hr'], ['project']] }];
    var GB = a.add({ type: 'groups', w: 960, z: 12, groups: gs, base: t(p.base, 30) || 'One database' }, 60, T);
    strs(p.pills, 1, 22).forEach(function (tx) { a.pill(tx, 80, GB.y1 + 26, -3); });
    if (p.nexi) { var nx = a.nexi(p.nexi, 260); a.add(nx, W - 60 - nx.w, GB.y1 - 30, 'bleed'); }
  } };

  VIS.scan = { label: 'Scan it', mirror: true, about: 'a handheld scanner reading a barcode into Odoo', build: function (p, a) {
    var T = a.T, sc = obj(p.scan);
    a.add({ type: 'scanner', w: 250, rot: -8, z: 14, title: t(sc.title, 14) || 'Scanned', text: t(sc.text, 22) || undefined }, 80, T + 10);
    var tg = p.doc ? docL(p.doc, 'receipt') : productL(p.product || {});
    tg.w = p.doc ? 540 : 420; tg.rot = 2; tg.z = 12;
    var TB = a.add(tg, p.doc ? 480 : 540, T + 30);
    a.fx({ type: 'arrow', w: 110, rot: -10, z: 22, kind: 'right' }, 336, T + 70);
    var c = chipL(p.chip, 'check'); if (c) { c.rot = -2; a.add(c, Math.min(TB.x + 30, W - 24 - a.w(c)), TB.y1 + 28); }
    strs(p.pills, 1, 20).forEach(function (tx) { a.pill(tx, 70, T + 540, -3, 360); });
  } };

  /* ---------- accents: props, stickers, stamps and small elements Claude adds, placed in free space ---------- */
  var ACC = ['prop', 'sticker', 'stamp', 'sticky', 'avatars', 'toggle', 'timer', 'ring', 'button', 'search', 'pin', 'barcode', 'scribble', 'pill', 'chip', 'note', 'bubble', 'nexi'];
  var CARDISH = { record: 1, doc: 1, product: 1, workorder: 1, ticket: 1, calendar: 1, employee: 1, email: 1, shop: 1, reconcile: 1, approval: 1, sheet: 1, docs: 1, appcard: 1, checklist: 1, graph: 1, chat: 1, receipt: 1, timeline: 1, phone: 1, flow: 1, pyramid: 1, groups: 1, devices: 1, site: 1, serp: 1, appflow: 1, phases: 1, orbit: 1, stat: 1 };
  function stampTone(v) { return { green: '', g: '', blue: 'b', b: 'b', red: 'r', r: 'r', purple: 'o', odoo: 'o' }[clean(v).toLowerCase()] || ''; }
  function accentLayer(x, ctx, i) {
    x = obj(x); var ty = pick(ACC, x.type, x.name ? 'prop' : 'sticker'), r = [-6, 5, -4, 7][i % 4], L = null;
    if (ty === 'prop') { var nm = propName(x.name, ctx, (ctx && ctx.index || 0) + i); if (nm) L = { type: 'prop', name: nm, w: Math.round(clampN(x.w || 170, 110, 260)), tile: x.tile ? true : undefined, label: t(x.label, 18) || undefined, rot: r, z: 17 }; }
    else if (ty === 'sticker') { var st = t(x.text, 14); if (st) L = { type: 'sticker', text: st, small: t(x.small, 20) || undefined, tone: pick(['', 'blue', 'white', 'mint', 'pink'], x.tone === 'yellow' ? '' : x.tone, ''), w: 180, rot: r, z: 22 }; }
    else if (ty === 'stamp') { var sp = t(x.text, 12); if (sp) L = { type: 'stamp', text: sp.toUpperCase(), small: t(x.small, 16) || undefined, tone: stampTone(x.tone), rot: -9, z: 24, _on: 1 }; }
    else if (ty === 'sticky') { var sk = t(x.text, 40); if (sk) L = { type: 'sticky', text: sk, tone: pick(['', 'blue', 'mint', 'pink'], x.tone, ''), w: 270, rot: r, z: 21 }; }
    else if (ty === 'avatars') L = { type: 'avatars', names: strs(x.names, 5, 18), more: t(x.more, 4) || undefined, label: t(x.label, 16) || undefined, rot: r / 3, z: 20 };
    else if (ty === 'toggle') { var tg = t(x.text, 20); if (tg) L = { type: 'toggle', text: tg, on: x.on !== false, rot: r / 2, z: 20 }; }
    else if (ty === 'timer') L = { type: 'timer', time: t(x.time, 9) || '00:24:10', label: t(x.label, 18) || undefined, rot: r / 2, z: 20 };
    else if (ty === 'ring') L = { type: 'ring', w: 200, value: clampN(x.value == null ? 80 : x.value, 0, 100), label: t(x.label, 18) || undefined, text: t(x.text, 6) || undefined, z: 20 };
    else if (ty === 'button') { var bt = t(x.text, 18); if (bt) L = { type: 'button', text: bt, tone: pick(['', 'blue', 'white', 'green'], x.tone, ''), rot: r / 2, z: 20 }; }
    else if (ty === 'search') L = { type: 'search', w: 520, query: t(x.query, 28) || 'late deliveries', filters: strs(x.filters, 2, 14), z: 20 };
    else if (ty === 'pin') L = { type: 'pin', label: t(x.label, 18) || undefined, z: 20 };
    else if (ty === 'barcode') L = { type: 'barcode', w: 300, code: t(x.code, 20) || '8 88012 34567 1', label: t(x.label, 24) || undefined, rot: r / 2, z: 19 };
    else if (ty === 'scribble') L = { type: 'scribble', w: 200, kind: pick(['circle', 'underline', 'arrow', 'check', 'star', 'zigzag', 'cross'], x.kind, 'underline'), color: /^#[0-9a-f]{6}$/i.test(x.color) ? x.color : undefined, z: 23 };
    else if (ty === 'pill') { var pl = t(x.text, 20); if (pl) L = { type: 'pill', text: pl, rot: r, z: 19 }; }
    else if (ty === 'chip') L = chipL(x);
    else if (ty === 'note') { var nt = t(x.text, 22); if (nt) L = { type: 'note', text: nt, variant: x.strike ? 'red strike' : undefined, size: 44, rot: r / 2, z: 20 }; }
    else if (ty === 'bubble') { var bb = t(x.text, 18); if (bb) L = { type: 'bubble', text: bb, rot: r / 2, z: 20 }; }
    else if (ty === 'nexi') L = { type: 'nexi', pose: pick(POSES, x.pose, 'wave'), w: Math.round(280 * (NEXI_AR[pick(POSES, x.pose, 'wave')] || .8)), z: 16, _bleed: 1 };
    return L;
  }
  function placeAccents(a, d, list, ctx) {
    var hero = d.layers.filter(function (L) { return L._r === 'main' && CARDISH[L.type]; })[0] || d.layers.filter(function (L) { return L._r === 'main'; })[0];
    var HB = hero ? vbox(hero) : box(300, a.T, 480, 400), n = 0;
    list.forEach(function (x, i) {
      var L = accentLayer(x, ctx, i); if (!L) return;
      if (L._on) { delete L._on; var m = size(L); a.add(L, Math.max(20, Math.min(HB.x1 - m.w * .78, W - 20 - m.w)), Math.max(a.T - 6, Math.min(HB.y1 - m.h * .62, BOTTOM - m.h)), 'accent'); n++; return; }
      var bleed = L._bleed; delete L._bleed;
      if (a.free(L, { near: HB, maxOverlap: L.type === 'sticker' || L.type === 'scribble' ? .3 : .08, role: bleed ? 'bleed' : 'accent' })) n++;
    });
    return n;
  }

  /* which visuals suit which category (the prompt only offers these) */
  var CORE = ['phone', 'record', 'document', 'checklist', 'versus', 'flow', 'chart', 'bignumber', 'board', 'chat', 'alerts', 'timeline', 'fan', 'spotlight', 'groups', 'reaction'];
  var IND_VIS = {
    fnb: ['paper', 'product', 'calendar', 'spreadsheet', 'scan', 'phases', 'appflow'],
    retail: ['product', 'store', 'scan', 'campaign', 'spreadsheet', 'phases'],
    ecommerce: ['store', 'product', 'campaign', 'scan', 'ticket', 'phases'],
    manufacturing: ['workorder', 'product', 'scan', 'spreadsheet', 'approval', 'phases'],
    construction: ['approval', 'documents', 'calendar', 'spreadsheet', 'paper', 'phases'],
    medical: ['calendar', 'people', 'ticket', 'documents', 'phases'],
    travel: ['calendar', 'store', 'ticket', 'campaign', 'phases'],
    'health-wellness': ['calendar', 'store', 'people', 'campaign', 'phases'],
    kitchen: ['workorder', 'calendar', 'ticket', 'product', 'approval', 'documents', 'pyramid', 'phases'],
    it: ['ticket', 'calendar', 'product', 'approval', 'reconcile', 'documents', 'pyramid', 'phases'],
    'field-service': ['calendar', 'ticket', 'workorder', 'product', 'scan', 'phases']
  };
  var FOR_CAT = {
    odoo20: CORE.concat(['paper', 'reconcile', 'spreadsheet', 'scan', 'workorder', 'orbit']),
    apps: CORE.concat(['paper', 'product', 'workorder', 'ticket', 'calendar', 'people', 'campaign', 'store', 'reconcile', 'approval', 'spreadsheet', 'documents', 'appflow', 'scan', 'orbit']),
    ai: ['record', 'paper', 'document', 'reconcile', 'documents', 'chat', 'alerts', 'checklist', 'versus', 'timeline', 'board', 'phone', 'bignumber', 'fan', 'spotlight', 'reaction'],
    services: ['website', 'webdesign', 'google', 'checklist', 'versus', 'chat', 'timeline', 'reaction', 'proof', 'spotlight', 'bignumber', 'pyramid', 'groups']
  };
  function forCat(cat, industry) {
    var l = FOR_CAT[cat];
    if (!l) l = CORE.concat(IND_VIS[industry] || IND_VIS[cat] || ['paper', 'product', 'calendar', 'phases']);
    else if (industry && cat !== 'services') l = l.concat((IND_VIS[industry] || []).filter(function (v) { return l.indexOf(v) < 0; }));
    return l.filter(function (v, i, all) { return VIS[v] && all.indexOf(v) === i && (v !== 'phases' || industry); });
  }

  function guess(p) {
    if (p.site) return 'website'; if (p.query) return 'google'; if (p.sitehead) return 'webdesign';
    if (p.levels) return 'pyramid'; if (p.groups) return 'groups'; if (p.docs) return 'fan'; if (p.events) return 'calendar'; if (p.files) return 'documents';
    if (p.bank || p.match) return 'reconcile'; if (p.approvers) return 'approval'; if (p.formula || p.cols && p.rows && !p.view) return 'spreadsheet'; if (p.subject) return 'campaign';
    if (p.product && p.brand) return 'store'; if (p.scan) return 'scan'; if (p.sla) return 'ticket'; if (p.timer || p.progress != null) return 'workorder'; if (p.job) return 'people';
    if (p.kind) return 'document'; if (p.stock || p.level != null) return 'product'; if (p.stat || p.value) return 'bignumber'; if (p.prop) return 'spotlight';
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
      id: '', v: 4, cat: ctx.cat || 'apps', industry: ctx.industry || undefined, name: t(p.name, 60) || head.replace(/\s*\|\s*/g, ' ').replace(/[*~=\[\]]/g, '').replace(/\s+/g, ' ').trim(), angle: t(p.angle, 20) || undefined,
      visual: vis, variant: (({ a: 0, b: 1, c: 2 })[clean(p.arrangement).toLowerCase()] != null ? ({ a: 0, b: 1, c: 2 })[clean(p.arrangement).toLowerCase()] : parseInt(p.variant, 10) || 0) % (VIS[vis].variants || 1),
      mirror: !!p.mirror && !!VIS[vis].mirror, ground: p.ground != null ? p.ground : GROUND,
      pattern: PATTERNS.indexOf(p.background) > -1 ? p.background : undefined, tint: TINTS.indexOf(p.tint) > -1 ? p.tint : undefined,
      look: pick(LOOKS, p.look, 'clean'), heroSize: pick(HERO, p.heroSize, 'normal'), tilt: pick(TILTS, p.tilt, 'soft'),
      badge: ctx.cat === 'services' ? '' : ctx.cat === 'odoo20' || p.badge === 'o20' ? 'o20' : 'ready',
      copy: ctx.copy ? JSON.parse(JSON.stringify(ctx.copy)) : { head: head, sub: sub || undefined, kicker: t(p.kicker, 28) || undefined, decor: pick(DECORS, p.decor, 'none') }, layers: [],
      caption: t(p.caption, 900) || undefined, hashtags: strs(p.hashtags, 6, 30).map(function (h) { h = h.replace(/\s+/g, ''); return h.charAt(0) === '#' ? h : '#' + h; }),
      source: ctx.source || '', post: p
    };
    d.accent = LOOK_ACC[d.look] || pick(ACCENTS, p.accent, 'blue');
    if (d.look === 'paper' && !d.tint) d.tint = 'sand';
    if (d.look === 'stack') { if (p.tilt == null) d.tilt = 'strong'; if (!d.pattern && p.background !== 'none') d.pattern = 'floor'; }
    if (d.look === 'spotlight') d.watermark = propName(p.prop, ctx) || propName('', ctx, (ctx.index || 0) + 2) || 'rocket';
    d._tiltK = TILT_K[d.tilt];
    var a = stage(d);
    VIS[vis].build(p, a, ctx, d);
    if (d.look === 'stack') d.layers.forEach(function (L) { if (L._r === 'main' && CARDISH[L.type] && !L.stack) L.stack = 2; });
    var hk = { big: 1.1, small: .9 }[d.heroSize] || 1;
    if (hk !== 1) {
      var grp = d.layers.filter(function (L) { return L._r && L.type !== 'sparkles' && L.type !== 'sphere'; }), gtop = Infinity;
      grp.forEach(function (L) { gtop = Math.min(gtop, vbox(L).y); });
      grp.forEach(function (L) { scaleAbout(L, W / 2, gtop, hk); });
    }
    var acc = arr(p.accents).slice(0, 3);
    strs(p.props, 2, 20).forEach(function (n) { acc.push({ type: 'prop', name: n }); });
    if (p.sticker) acc.push(Object.assign({ type: 'sticker' }, obj(p.sticker)));
    if (p.stamp) acc.push(Object.assign({ type: 'stamp' }, obj(p.stamp)));
    var hasProp = acc.some(function (x) { x = obj(x); return x.type === 'prop' || (!x.type && x.name); }) || vis === 'spotlight' || d.layers.some(function (L) { return L.type === 'prop'; });
    if (!hasProp && ctx.industry && p.autoProp !== false) acc.push({ type: 'prop', name: '', w: 150 });
    if (/^(band|navy|corner)$/.test(d.look)) acc.forEach(function (x) { if (x && typeof x === 'object' && (x.type === 'prop' || (!x.type && x.name))) x.tile = true; });
    placeAccents(a, d, acc.slice(0, 4), ctx);
    if (d.mirror) mirror(d);
    var T2 = copyBottom(d.copy) + 34;
    settle(d, T2, VIS[vis].center);
    if (/^(band|navy|spotlight)$/.test(d.look)) d.panelY = T2 - 30;
    delete d._tiltK;
    if (d.look === 'clean') delete d.look; if (d.accent === 'blue') delete d.accent; if (d.heroSize === 'normal') delete d.heroSize; if (d.tilt === 'soft') delete d.tilt;
    if (d.copy && d.copy.decor === 'none') delete d.copy.decor;
    d.layers.forEach(function (L) { delete L._m; delete L._r; Object.keys(L).forEach(function (k) { if (L[k] === undefined) delete L[k]; }); });
    if (!d.hashtags.length) delete d.hashtags;
    Object.keys(d).forEach(function (k) { if (d[k] === undefined) delete d[k]; });
    return d;
  }
  /* every post in a set gets its own design: visual, arrangement, side, look, accent colour, headline
     decoration, hero size, tilt and background pattern, all different from the other posts in the set and
     from the visual+look pairs already in the library (usedLib), so a second generation never repeats the first */
  function diversify(posts, seed, usedLib) {
    var seen = {}, last = {}, used = {}, r = R.rng((seed || Date.now()) % 1e9), pool = shuffle(PATTERNS, r), pi = 0;
    var looksPool = shuffle(LOOKS, r), accPool = shuffle(ACCENTS, r), decPool = shuffle(DECORS.slice(1), r).concat(['none']), li = 0, ai = 0, di = 0;
    var libPairs = {}, setLooks = {}, setAcc = {}, setDec = {}, list = arr(posts), n = list.length, nexiN = 0, quota = Math.ceil(n / 3);
    arr(usedLib).forEach(function (u) { if (u) libPairs[(u.visual || '') + '|' + (u.look || 'clean')] = 1; });
    return list.map(function (p, i) {
      p = p || {}; var v = VIS[p.visual] ? p.visual : guess(p), k = seen[v] || 0; seen[v] = k + 1;
      p.visual = v;
      if (p.mirror == null) p.mirror = !!VIS[v].mirror && (k ? !last[v] : i % 2 === 1);
      last[v] = !!p.mirror;
      if (p.variant == null && p.arrangement == null) p.variant = k;
      var lk = LOOKS.indexOf(p.look) > -1 && !setLooks[p.look] && !libPairs[v + '|' + p.look] ? p.look : null, g;
      if (!lk) { for (g = 0; g < LOOKS.length && !lk; g++) { var c1 = looksPool[(li + g) % LOOKS.length]; if (!setLooks[c1] && !libPairs[v + '|' + c1]) lk = c1; } }
      if (!lk) { for (g = 0; g < LOOKS.length && !lk; g++) { var c1b = looksPool[(li + g) % LOOKS.length]; if (!setLooks[c1b]) lk = c1b; } }
      if (!lk) lk = looksPool[li % LOOKS.length];
      li++; setLooks[lk] = 1; p.look = lk;
      var ac = LOOK_ACC[lk] || (ACCENTS.indexOf(p.accent) > -1 && !setAcc[p.accent] ? p.accent : null);
      if (!ac) { for (g = 0; g < ACCENTS.length && !ac; g++) { var c2 = accPool[(ai + g) % ACCENTS.length]; if (!setAcc[c2]) ac = c2; } ai++; }
      if (!ac) ac = accPool[ai++ % ACCENTS.length];
      setAcc[ac] = 1; p.accent = ac;
      var dc = DECORS.indexOf(p.decor) > -1 && !setDec[p.decor] ? p.decor : null;
      if (!dc) { for (g = 0; g < DECORS.length && !dc; g++) { var c3 = decPool[(di + g) % DECORS.length]; if (!setDec[c3]) dc = c3; } di++; }
      if (!dc) dc = decPool[di++ % DECORS.length];
      setDec[dc] = 1; p.decor = dc;
      if (HERO.indexOf(p.heroSize) < 0) p.heroSize = HERO[i % 3];
      if (TILTS.indexOf(p.tilt) < 0) p.tilt = TILTS[(i + 1) % 3];
      if (p.nexi) { if (nexiN >= quota && NEXI_OPT[v]) delete p.nexi; else nexiN++; }
      var bg = p.background;
      if (bg !== 'none' && (PATTERNS.indexOf(bg) < 0 || used[bg])) { var guard = 0; while (used[pool[pi % pool.length]] && guard++ < pool.length) pi++; bg = pool[pi % pool.length]; pi++; }
      if (bg !== 'none') used[bg] = 1;
      p.background = bg;
      return p;
    });
  }
  /* a design the drip does not have yet, for the editor's "Fresh design" button */
  function fresh(d) {
    var r = R.rng(Date.now() % 1e9), not = function (list, cur) { var o = list.filter(function (x) { return x !== cur; }); return o[Math.floor(r() * o.length)]; };
    var look = not(LOOKS, d.look || 'clean');
    return { look: look, accent: LOOK_ACC[look] || not(ACCENTS, d.accent || 'blue'), decor: not(DECORS, (d.copy && d.copy.decor) || 'none'), pattern: not(PATTERNS, d.pattern || ''),
      tilt: not(TILTS, d.tilt || 'soft'), heroSize: not(HERO, d.heroSize || 'normal'), variant: (d.variant || 0) + 1, mirror: !d.mirror };
  }
  /* the editor's "Mirror" and "Re-layout": rebuild from the post, keeping the edited headline, subline and caption */
  function relayout(d, change, ctx) {
    var p = JSON.parse(JSON.stringify(d.post || {}));
    p.head = (d.copy && d.copy.head) || p.head; p.sub = (d.copy && d.copy.sub) || p.sub;
    p.caption = d.caption || p.caption; p.hashtags = d.hashtags || p.hashtags; p.name = d.name || p.name; p.ground = d.ground;
    p.mirror = change && change.mirror != null ? change.mirror : d.mirror; p.variant = change && change.variant != null ? change.variant : d.variant; delete p.arrangement;
    change = change || {};
    p.background = change.pattern != null ? change.pattern : (d.pattern || 'none'); p.tint = change.tint != null ? change.tint : d.tint;
    ['look', 'accent', 'tilt', 'heroSize'].forEach(function (k) { p[k] = change[k] != null ? change[k] : d[k]; });
    if (change.look != null && !LOOK_ACC[change.look] && change.accent == null && LOOK_ACC[d.look]) p.accent = undefined;
    var c2 = {}; Object.keys(ctx || {}).forEach(function (k) { c2[k] = ctx[k]; }); c2.copy = JSON.parse(JSON.stringify(d.copy || {}));
    if (change.decor != null) c2.copy.decor = change.decor;
    var n = compose(p, c2);
    if (n.copy && (n.copy.decor === 'none' || !n.copy.decor)) delete n.copy.decor;
    if (d.badge != null) n.badge = d.badge;
    return n;
  }

  window.TNSimple = { compose: compose, diversify: diversify, relayout: relayout, fresh: fresh, forCat: forCat, VIS: VIS, POSES: POSES, GROUND: GROUND, PATTERNS: PATTERNS, TINTS: TINTS, IND_VIS: IND_VIS,
    LOOKS: LOOKS, LOOK_ABOUT: LOOK_ABOUT, LOOK_ACC: LOOK_ACC, ACCENTS: ACCENTS, DECORS: DECORS, HERO: HERO, TILTS: TILTS,
    canMirror: function (v) { return !!(VIS[v] && VIS[v].mirror); }, hasVariants: function (v) { return !!(VIS[v] && (VIS[v].variants || 1) > 1); } };
})();
