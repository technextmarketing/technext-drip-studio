/* TechNext Drip Studio — compose. Turns a scene (what Claude designs for one post: the story, the Odoo
   screens and cards with their data, the look) into a drip the editor can change. Claude decides WHAT is
   shown and how it looks; this file decides WHERE, measuring every element so nothing covers the headline,
   runs off the canvas or collides. Each post in a set gets its own layout, camera, background and palette. */
(function () {
  'use strict';
  var R = window.TNDrip, C = window.TN_CONTENT || {};
  var LAYOUTS = ['top', 'left', 'right', 'bottom'];
  var CAMS = ['front', 'tilt-l', 'tilt-r', 'iso-l', 'iso-r', 'top', 'low', 'dutch'];
  var BGS = ['aurora', 'grid', 'floor', 'rays', 'dots', 'mesh', 'rings', 'navy'];
  var PALS = ['blue', 'sky', 'mint', 'violet', 'sunrise', 'slate'];
  var POSES = ['wave', 'point', 'present', 'celebrate', 'cheer', 'surprise', 'love', 'think', 'clap'];
  var HERO_TYPES = ['window', 'ophone', 'graph', 'kpis', 'timeline', 'steps', 'chat', 'receipt', 'notif', 'stat', 'route', 'record', 'checklist', 'ba', 'phases', 'appflow', 'orbit', 'devices', 'site', 'code', 'serp'];
  var MAXW = { window: 880, ophone: 350, graph: 700, kpis: 880, timeline: 620, steps: 900, chat: 480, receipt: 420, notif: 600, stat: 440, route: 640, record: 580, checklist: 620, ba: 940, phases: 940, appflow: 940, orbit: 540, devices: 800, site: 720, code: 520, serp: 840 };

  function s(v, max) { v = v == null ? '' : String(v).replace(/\s+/g, ' ').trim(); return max && v.length > max ? v.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : v; }
  function arr(v) { return Array.isArray(v) ? v : v == null || v === '' ? [] : [v]; }
  function pick(list, v, dflt) { return list.indexOf(v) > -1 ? v : dflt; }
  function modOK(m) { return !!((C.apps && C.apps[m]) || (C.appFlows && C.appFlows[m]) || ['pos_restaurant', 'ai_app', 'industry_fsm', 'appointment', 'mail', 'whatsapp', 'knowledge', 'documents', 'sign', 'voip', 'iot'].indexOf(m) > -1); }
  function mod(m, d) { m = s(m).toLowerCase().replace(/^odoo[ _-]?/, '').replace(/\s+/g, '_'); return modOK(m) ? m : d; }
  function deepClean(o, depth) {
    if (depth > 10) return undefined;
    if (typeof o === 'string') return s(o, 160);
    if (typeof o === 'number' || typeof o === 'boolean') return o;
    if (Array.isArray(o)) return o.slice(0, 12).map(function (x) { return deepClean(x, depth + 1); });
    if (o && typeof o === 'object') { var r = {}; Object.keys(o).slice(0, 40).forEach(function (k) { if (/^[a-zA-Z0-9_]+$/.test(k)) r[k] = deepClean(o[k], depth + 1); }); return r; }
    return undefined;
  }

  /* ---------- measuring ---------- */
  var host = null;
  function measure(L) {
    if (!host) { host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-30000px;top:0;width:1080px;visibility:hidden;pointer-events:none'; document.body.appendChild(host); }
    var c = JSON.parse(JSON.stringify(L)); delete c.cam; delete c.rot; delete c.s; c.x = 0; c.y = 0;
    var el = R.render({ id: 'm', bg: { style: 'aurora' }, brand: { logo: 'none' }, copy: {}, layers: [c] });
    host.innerHTML = ''; host.appendChild(el);
    var n = el.querySelector('.L'); if (!n) return { w: c.w || 100, h: 100 };
    return { w: n.offsetWidth, h: n.offsetHeight };
  }

  /* ---------- component normalisation (Claude's data → a layer) ---------- */
  function layerOf(c, role) {
    c = deepClean(c || {}, 0) || {};
    var t = pick(HERO_TYPES.concat(['pill', 'chip', 'note']), c.type, 'window'), L = { type: t };
    Object.keys(c).forEach(function (k) { if (k !== 'type' && k !== 'x' && k !== 'y' && k !== 'w') L[k] = c[k]; });
    if (t === 'window' || t === 'ophone') { L.app = mod(L.app, 'sale'); L.view = pick(['form', 'list', 'kanban', 'dashboard', 'planning', 'pos', 'kds', 'apps', 'discuss'], L.view, 'form'); if (L.view === 'apps' && L.apps) L.apps = arr(L.apps).map(function (a) { return mod(a, ''); }).filter(Boolean); }
    if (t === 'graph') { L.kind = pick(['bar', 'line', 'area', 'donut', 'funnel', 'progress'], L.kind, 'bar'); L.data = arr(L.data).filter(Array.isArray).map(function (d) { return [s(d[0], 14), +d[1] || 0]; }).slice(0, 8); if (L.data.length < 2) L.data = [['Mon', 12], ['Tue', 18], ['Wed', 15], ['Thu', 22], ['Fri', 26]]; }
    if (t === 'record' || t === 'checklist') L.app = L.app ? mod(L.app, 'accountant') : undefined;
    if (t === 'appflow') L.app = C.appFlows && C.appFlows[mod(L.app, '')] ? mod(L.app, '') : 'sale';
    if (t === 'orbit' && L.apps) L.apps = arr(L.apps).map(function (a) { return mod(a, ''); }).filter(Boolean);
    if (t === 'steps') L.items = arr(L.items).map(function (x) { x = arr(x); return [mod(x[0], ''), s(x[1], 22), s(x[2], 40)]; }).slice(0, 6);
    if (t === 'timeline') L.items = arr(L.items).map(function (x) { x = arr(x); return [s(x[0], 12), s(x[1], 34), mod(x[2], ''), s(x[3], 48)]; }).slice(0, 6);
    if (t === 'kpis') L.items = arr(L.items).map(function (x) { x = arr(x); return [s(x[0], 24), s(x[1], 12), s(x[2], 10), x[3] ? mod(x[3], '') : '']; }).slice(0, 4);
    if (t === 'devices') { L.site = (C.sites || {})[L.site] ? L.site : 'technext'; if (L.label == null) L.label = C.sites[L.site].name + ' · built by TechNext'; }
    if ((t === 'ba' || t === 'phases') && !L.rows && !L.data) L.from = L.from || null;
    L.role = role;
    return L;
  }

  /* ---------- geometry ---------- */
  function box(x, y, w, h) { return { x: x, y: y, w: w, h: h, x1: x + w, y1: y + h, cx: x + w / 2, cy: y + h / 2 }; }
  function hit(a, b, pad) { pad = pad || 0; return a.x < b.x1 + pad && a.x1 > b.x - pad && a.y < b.y1 + pad && a.y1 > b.y - pad; }
  function area(a, b) { var w = Math.min(a.x1, b.x1) - Math.max(a.x, b.x), h = Math.min(a.y1, b.y1) - Math.max(a.y, b.y); return w > 0 && h > 0 ? w * h : 0; }
  function clampBox(b, H, keepOut) {
    var inside = function (r) { return box(Math.max(24, Math.min(r.x, 1056 - r.w)), Math.max(24, Math.min(r.y, H - 24 - r.h)), r.w, r.h); };
    var r = inside(b);
    if (keepOut && hit(r, keepOut, 12)) {
      if (keepOut.w > 600) r = keepOut.cy < H / 2 ? box(r.x, keepOut.y1 + 18, r.w, r.h) : box(r.x, keepOut.y - 18 - r.h, r.w, r.h);
      else r = keepOut.cx > 540 ? box(keepOut.x - 18 - r.w, r.y, r.w, r.h) : box(keepOut.x1 + 18, r.y, r.w, r.h);
      r = inside(r);
    }
    return r;
  }

  /* ---------- the layout ---------- */
  function compose(scene, ctx) {
    ctx = ctx || {};
    var sc = deepClean(scene, 0) || {}, look = sc.look || {}, rnd = R.rng((+look.seed || hash(JSON.stringify(sc.head || '') + (ctx.index || 0))) >>> 0);
    var layout = pick(LAYOUTS, look.layout, 'top'), cam = pick(CAMS, look.camera, 'front');
    var bgStyle = pick(BGS, look.bg, 'aurora'), pal = bgStyle === 'navy' ? 'night' : pick(PALS, look.palette, 'blue');
    var H = 1080, d = {
      id: '', cat: ctx.cat || 'apps', name: s(sc.name, 60) || s(sc.head, 60).replace(/[*~|=]/g, ''), angle: s(sc.angle, 20), v: 3,
      bg: { style: bgStyle, palette: pal, seed: Math.floor(rnd() * 1e6) }, cam: cam,
      brand: { logo: 'tl', style: bgStyle === 'mesh' || bgStyle === 'rays' ? 'chip' : 'plain', badge: ctx.cat === 'services' ? 'none' : ctx.cat === 'odoo20' || sc.badge === 'o20' ? 'o20' : 'ready' },
      copy: {}, layers: [], caption: s(sc.caption, 900), hashtags: arr(sc.hashtags).slice(0, 6).map(function (h) { h = s(h, 30).replace(/\s+/g, ''); return h.charAt(0) === '#' ? h : '#' + h; }),
      source: ctx.source || '', scene: sc
    };
    /* headline block + visual area per layout */
    var head = s(sc.head, 110) || 'Your headline,|*in blue.*', sub = s(sc.sub, 170), kick = s(sc.kicker, 30);
    var logo = pick(['tl', 'tr', 'bl', 'br'], look.logo, layout === 'bottom' ? 'tl' : layout === 'right' ? 'tr' : 'tl'), V, cb;
    if (layout === 'top') {
      var top = logo.charAt(0) === 't' ? 138 : 70, align = look.align === 'left' ? 'left' : 'center';
      d.copy = { head: head, sub: sub, kicker: kick || undefined, x: 64, y: top, w: 952, align: align, fs: 74, subFs: 28 };
      cb = box(64, top, 952, estCopy(head, sub, 74, 952, !!kick)); V = box(36, cb.y1 + 26, 1008, H - cb.y1 - 26 - (logo.charAt(0) === 'b' ? 110 : 30));
    } else if (layout === 'bottom') {
      logo = logo.charAt(0) === 'b' ? 't' + logo.charAt(1) : logo;
      var hb = estCopy(head, sub, 70, 952, !!kick), y0 = Math.round(H - 70 - hb);
      d.copy = { head: head, sub: sub, kicker: kick || undefined, x: 64, y: y0, w: 952, align: look.align === 'center' ? 'center' : 'left', fs: 70, subFs: 27 };
      cb = box(64, y0, 952, hb); V = box(36, 130, 1008, y0 - 150);
    } else {
      var left = layout === 'left', cx = left ? 64 : 596, cw = 420, hh = estCopy(head, sub, 60, cw, !!kick), cy0 = Math.round(Math.max(170, Math.min(300, (H - hh) / 2 - 40)));
      if (left && logo === 'tr') logo = 'tl'; if (!left && logo === 'tl') logo = 'tr';
      d.copy = { head: head, sub: sub, kicker: kick || undefined, x: cx, y: cy0, w: cw, align: 'left', fs: 60, subFs: 25 };
      cb = box(cx, cy0, cw, hh); V = left ? box(500, 110, 560, H - 150) : box(20, 110, 560, H - 150);
    }
    d.brand.logo = logo;
    var brandBox = logo === 'tl' ? box(40, 40, 440, 70) : logo === 'tr' ? box(600, 40, 440, 70) : logo === 'bl' ? box(40, H - 110, 440, 70) : box(600, H - 110, 440, 70);
    var badgeBox = logo === 'tl' ? box(860, 30, 200, 80) : logo === 'tr' ? box(20, 30, 200, 80) : logo === 'bl' ? box(860, H - 120, 200, 90) : box(20, H - 120, 200, 90);
    var shield = [cb, brandBox, badgeBox];

    /* hero */
    var hero = layerOf(sc.hero || { type: 'window', app: 'sale', view: 'form' }, 'hero');
    var hw = Math.min(MAXW[hero.type] || 800, V.w * (hero.type === 'ophone' ? .62 : .94));
    var narrowBleed = (layout === 'left' || layout === 'right') && (hero.type === 'window' || hero.type === 'devices' || hero.type === 'site');
    if (narrowBleed) hw = hero.type === 'window' ? 690 : 680;
    var nSup = arr(sc.support).length, side = nSup && !narrowBleed && (layout === 'top' || layout === 'bottom') ? (rnd() > .5 ? 'l' : 'r') : '';
    if (side && hero.type !== 'ophone') hw = Math.min(hw, V.w * (nSup > 1 ? .7 : .76));
    hero.w = Math.round(hw);
    var m = measure(hero), bleed = hero.type === 'ophone' || hero.type === 'devices' || narrowBleed ? .12 : 0;
    var maxH = V.h * (1 + bleed);
    if (m.h > maxH && hero.type !== 'flow') { hero.w = Math.round(hero.w * maxH / m.h); m = measure(hero); }
    var hx = side === 'l' ? V.x + 8 : side === 'r' ? V.x1 - m.w - 8 : V.cx - m.w / 2 + (rnd() - .5) * Math.max(0, V.w - m.w) * .5, hy = V.y + Math.max(0, (V.h - m.h) / 2) * (layout === 'top' ? .5 : 1);
    var HB = box(hx, hy, m.w, m.h);
    if (narrowBleed) HB = box(layout === 'left' ? Math.max(cb.x1 + 30, 1080 - m.w * .86) : Math.min(cb.x - 30 - m.w, -m.w * .14), Math.max(V.y + 20, V.cy - m.h / 2), m.w, m.h);
    else if (!bleed) HB = clampBox(HB, H, cb); else HB = box(Math.max(24, Math.min(HB.x, 1056 - HB.w)), Math.max(V.y, HB.y), HB.w, HB.h);
    hero.x = Math.round(HB.x); hero.y = Math.round(HB.y); hero.cam = cam !== 'front'; hero.z = 10;
    d.layers.push({ type: 'glow', x: Math.round(HB.cx - HB.w * .6), y: Math.round(HB.cy - HB.w * .6), w: Math.round(HB.w * 1.2), z: 1, op: .8 });
    d.layers.push(hero);
    d.bg.focus = [Math.round(HB.cx), Math.round(HB.cy)];

    /* supporting cards around the hero */
    var placed = [HB], names = { hero: HB }, slots = ['br', 'tl', 'bl', 'tr', 'r', 'l'];
    if (rnd() > .5) slots = ['bl', 'tr', 'br', 'tl', 'l', 'r'];
    if (side === 'l') slots = ['r', 'br', 'tr', 'bl', 'tl', 'l'];
    if (side === 'r') slots = ['l', 'bl', 'tl', 'br', 'tr', 'r'];
    arr(sc.support).slice(0, 3).forEach(function (c, i) {
      var L = layerOf(c, 'support'), narrow = layout === 'left' || layout === 'right';
      var base = { window: .5, ophone: .28, graph: .42, kpis: .52, timeline: .42, steps: .66, chat: .4, receipt: .34, notif: .46, stat: .32, route: .36, record: .46, checklist: .46, code: .42, serp: .62 }[L.type] || .42;
      L.w = Math.round(Math.max({ notif: 380, chat: 360, stat: 260, receipt: 300 }[L.type] || 0, Math.min(MAXW[L.type] || 600, (narrow ? 560 : 1008) * base * (narrow ? 1.2 : 1))));
      var mm = measure(L); if (mm.h > 520) { L.w = Math.round(L.w * 520 / mm.h); mm = measure(L); }
      var best = null;
      slots.forEach(function (sl) {
        var x, y, o = .3 + rnd() * .12;
        if (sl === 'br') { x = HB.x1 - mm.w * (1 - o); y = HB.y1 - mm.h * .62; }
        if (sl === 'bl') { x = HB.x - mm.w * o; y = HB.y1 - mm.h * .58; }
        if (sl === 'tr') { x = HB.x1 - mm.w * (1 - o); y = HB.y - mm.h * .36; }
        if (sl === 'tl') { x = HB.x - mm.w * o; y = HB.y - mm.h * .32; }
        if (sl === 'r') { x = HB.x1 - mm.w * .3; y = HB.cy - mm.h * (.25 + i * .35); }
        if (sl === 'l') { x = HB.x - mm.w * .7; y = HB.cy - mm.h * (.25 + i * .35); }
        var b = clampBox(box(x, y, mm.w, mm.h), H, cb), score = 0;
        shield.forEach(function (z) { score += area(b, z) * 6; });
        placed.slice(1).forEach(function (z) { score += area(b, z) * 3; });
        score += area(b, HB) * (hero.type === 'window' ? .7 : .4) + Math.abs(b.cx - HB.cx) * .02;
        if (narrowBleed) { var vis = box(Math.max(HB.x, 0), HB.y, Math.min(HB.x1, 1080) - Math.max(HB.x, 0), HB.h); if (b.x < vis.x - 10 || b.x1 > vis.x1 + 10) score += 5e4; }
        if (!best || score < best.score) best = { b: b, sl: sl, score: score };
      });
      slots.splice(slots.indexOf(best.sl), 1);
      L.x = Math.round(best.b.x); L.y = Math.round(best.b.y); L.cam = cam !== 'front'; L.z = 12 + i; L.rot = L.type === 'receipt' || L.type === 'stat' ? Math.round((rnd() - .5) * 8) : undefined;
      if (hero.type === 'devices' && hit(best.b, box(HB.x, HB.y - 40, HB.w * .6, 120))) hero.label = false;
      d.layers.push(L); placed.push(best.b); names['s' + i] = best.b; names['support' + i] = best.b; names[String(i + 1)] = best.b;
    });

    /* workflow arrows */
    arr(sc.links).slice(0, 3).forEach(function (k, i) {
      var a = names[k && k.from] || names.hero, b = names[k && k.to] || names.s0; if (!a || !b || a === b) return;
      var p = edgePoint(a, b), q = edgePoint(b, a);
      if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 150) {
        var ov = box(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(10, Math.min(a.x1, b.x1) - Math.max(a.x, b.x)), Math.max(10, Math.min(a.y1, b.y1) - Math.max(a.y, b.y)));
        var mx = Math.max(90, Math.min(990, (a.cx + b.cx) / 2 * .4 + ov.cx * .6)), my = Math.max(60, Math.min(H - 60, b.y - 8 < a.y1 && b.y > a.y ? b.y - 6 : ov.cy));
        if (k && k.label) d.layers.push({ type: 'link', labelOnly: true, x1: Math.round(mx), y1: Math.round(my), x2: Math.round(mx), y2: Math.round(my), label: '→ ' + s(k.label, 28), tone: i % 2 ? 'blue' : '', z: 45 });
        return;
      }
      d.layers.push({ type: 'link', x1: Math.round(p[0]), y1: Math.round(p[1]), x2: Math.round(q[0]), y2: Math.round(q[1]), bend: i % 2 ? -.28 : .28, label: s(k && k.label, 28) || undefined, tone: i % 2 ? 'blue' : '', z: 30 });
    });

    /* accents: Nexi, handwritten callouts, chips */
    var taken = placed.slice(), acc = arr(sc.accents).slice(0, 5);
    acc.forEach(function (a) {
      a = deepClean(a, 0) || {};
      var t = pick(['nexi', 'pill', 'chip', 'note', 'bubble', 'sparkles', 'person'], a.type, 'pill'), L = { type: t, z: 40 };
      if (t === 'nexi') { L.pose = pick(POSES, a.pose, 'point'); L.w = Math.round(210 + rnd() * 70); L.glow = false; }
      if (t === 'pill') { L.text = s(a.text, 24) || 'Done in Odoo'; L.rot = Math.round((rnd() - .5) * 9); }
      if (t === 'chip') { L.text = s(a.text, 28) || 'Synced'; L.small = s(a.small, 30) || undefined; L.icon = pick(['check', 'spark', 'search', 'sync', 'cloudOk'], a.icon, 'check'); L.tone = L.icon === 'check' ? 'ok' : ''; L.rot = Math.round((rnd() - .5) * 4); }
      if (t === 'note') { L.text = s(a.text, 26); L.variant = a.strike ? 'red strike' : ''; L.size = 44; L.rot = Math.round((rnd() - .5) * 8); }
      if (t === 'bubble') { L.text = s(a.text, 22); L.rot = -3; }
      if (t === 'sparkles') { L.w = 110; }
      if (t === 'person') { L.w = 420; }
      var sz = t === 'nexi' ? [L.w, L.w * 1.28] : t === 'pill' ? [L.text.length * 21 + 70, 76] : t === 'chip' ? [Math.max(L.text.length, (L.small || '').length * .75) * 12.5 + 110, L.small ? 86 : 72] : t === 'note' ? [(L.text || '').length * 21, 60] : t === 'bubble' ? [(L.text || '').length * 17 + 60, 80] : [110, 110];
      var spot = freeSpot(sz[0], sz[1], HB, taken, shield, H, V, rnd, t === 'nexi');
      L.x = Math.round(spot.x); L.y = Math.round(spot.y);
      d.layers.push(L); taken.push(box(spot.x, spot.y, sz[0], sz[1]));
    });
    if (!acc.some(function (a) { return a && a.type === 'sparkles'; })) { var sp = freeSpot(110, 110, HB, taken, shield, H, V, rnd, false); d.layers.push({ type: 'sparkles', x: Math.round(sp.x), y: Math.round(sp.y), w: 100, z: 41 }); }
    return d;
  }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function estCopy(head, sub, fs, w, kick) {
    var perLine = w / (fs * .5), lines = Math.max(head.split('|').length, Math.ceil(head.replace(/[*~|=]/g, '').length / perLine));
    lines = Math.min(lines, 2);
    var subLines = sub ? Math.min(3, Math.ceil(sub.length / (w / (fs * .42 * .5 * 1.9)))) : 0;
    return (kick ? 62 : 0) + lines * fs * 1.02 + (sub ? 20 + subLines * fs * .38 * 1.36 : 0);
  }
  function edgePoint(a, b) {
    var dx = b.cx - a.cx, dy = b.cy - a.cy;
    if (Math.abs(dx) / a.w > Math.abs(dy) / a.h) return [dx > 0 ? a.x1 - 20 : a.x + 20, a.cy + Math.max(-a.h * .3, Math.min(a.h * .3, dy * .3))];
    return [a.cx + Math.max(-a.w * .3, Math.min(a.w * .3, dx * .3)), dy > 0 ? a.y1 - 18 : a.y + 18];
  }
  function freeSpot(w, h, HB, taken, shield, H, V, rnd, big) {
    var cands = [], j = function () { return (rnd() - .5) * 40; };
    [[HB.x - w * .55, HB.y1 - h * .8], [HB.x1 - w * .45, HB.y1 - h * .7], [HB.x - w * .5, HB.y - h * .25], [HB.x1 - w * .5, HB.y - h * .3],
      [HB.x - w * .6, HB.cy - h / 2], [HB.x1 - w * .4, HB.cy - h / 2], [HB.cx - w / 2, HB.y1 - h * .4], [V.x + 10, V.y1 - h], [V.x1 - w - 10, V.y1 - h], [V.x1 - w - 10, V.y + 10], [V.x + 10, V.y + 10]
    ].forEach(function (p) { cands.push([p[0] + j(), p[1] + j()]); });
    var best = null;
    cands.forEach(function (p) {
      var b = box(Math.max(18, Math.min(p[0], 1062 - w)), Math.max(18, Math.min(p[1], H - 18 - h)), w, h), sc = 0;
      shield.forEach(function (z) { sc += area(b, z) * 10; });
      taken.forEach(function (z, i) { sc += area(b, z) * (i === 0 ? (big ? .5 : .12) : 1.4); });
      var core = box(HB.x + HB.w * .2, HB.y + HB.h * .18, HB.w * .6, HB.h * .64); sc += area(b, core) * (big ? 3 : 1.2);
      if (!best || sc < best.sc) best = { x: b.x, y: b.y, sc: sc };
    });
    return best;
  }

  /* every post in one generation gets its own layout+camera and background+palette */
  function diversify(scenes, seed) {
    var r = R.rng(seed || 11), used = { lc: {}, bp: {}, hero: {} };
    return scenes.map(function (sc, i) {
      sc = sc || {}; var lk = sc.look = sc.look || {};
      lk.layout = pick(LAYOUTS, lk.layout, LAYOUTS[i % 4]); lk.camera = pick(CAMS, lk.camera, CAMS[(i * 3) % CAMS.length]);
      lk.bg = pick(BGS, lk.bg, BGS[i % BGS.length]); lk.palette = pick(PALS, lk.palette, PALS[i % PALS.length]);
      var n = 0;
      while (used.lc[lk.layout + lk.camera] && n++ < 40) { lk.camera = CAMS[Math.floor(r() * CAMS.length)]; if (n % 4 === 0) lk.layout = LAYOUTS[Math.floor(r() * 4)]; }
      n = 0;
      while (used.bp[lk.bg + (lk.bg === 'navy' ? '' : lk.palette)] && n++ < 40) { lk.palette = PALS[Math.floor(r() * PALS.length)]; if (n % 3 === 0) lk.bg = BGS[Math.floor(r() * BGS.length)]; }
      used.lc[lk.layout + lk.camera] = 1; used.bp[lk.bg + (lk.bg === 'navy' ? '' : lk.palette)] = 1;
      lk.seed = lk.seed || Math.floor(r() * 1e6);
      return sc;
    });
  }
  function shuffleLook(d) {
    var r = R.rng(Date.now() % 1e9), sc = d.scene || {};
    sc.look = { layout: LAYOUTS[Math.floor(r() * 4)], camera: CAMS[Math.floor(r() * CAMS.length)], bg: BGS[Math.floor(r() * BGS.length)], palette: PALS[Math.floor(r() * PALS.length)], seed: Math.floor(r() * 1e6) };
    return sc;
  }

  window.TNCompose = { compose: compose, diversify: diversify, shuffleLook: shuffleLook, measure: measure, LAYOUTS: LAYOUTS, CAMS: CAMS, BGS: BGS, PALS: PALS, HERO_TYPES: HERO_TYPES, POSES: POSES };
})();
