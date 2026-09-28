/* TechNext Drip Studio — renderer. Turns one drip object (see drips.js) into a 1080px canvas.
   Used by the studio (index.html) and by tools/render.py for batch PNG export. */
(function () {
  var C = window.TN_CONTENT || {};
  var uid = 0;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* headline markup: *blue*  ~brush underline~  ==marker==  [[blue box]]  {odoo}purple{/odoo}  | line break */
  function rich(s) {
    return esc(s)
      .replace(/\[\[(.+?)\]\]/g, '<span class="hl">$1</span>')
      .replace(/==(.+?)==/g, '<mark>$1</mark>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/~(.+?)~/g, '<u>$1</u>')
      .replace(/\{odoo\}(.+?)\{\/odoo\}/g, '<span class="odoo">$1</span>')
      .replace(/\s*\|\s*/g, '<br>');
  }
  function asset(p) { if (!p) return ''; if (/^(data:|blob:|https?:)/.test(p)) return p; return (window.TN_ASSET_BASE || '') + p; }
  function oi(app, cls) { return '<img class="oi' + (cls ? ' ' + cls : '') + '" src="' + asset('assets/odoo/' + app + '.svg') + '" alt="">'; }
  function icon(name) {
    var s = (C.icons && C.icons[name]) || '';
    return s.replace('class="ic"', 'class="ic" style="width:100%;height:100%"');
  }

  /* ---------- inline SVG kit ---------- */
  var SVG = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.6 2.4 7.1 7 8-4.6.9-6.4 3.4-7 8-.6-4.6-2.4-7.1-7-8 4.6-.9 6.4-3.4 7-8Z"/><path d="M19 15c.3 2 1 3 3 3.4-2 .4-2.7 1.4-3 3.6-.3-2.2-1-3.2-3-3.6 2-.4 2.7-1.4 3-3.4Z"/></svg>',
    wifiOff: '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#1F1F3D" stroke-width="2.3"><path d="M3.5 9.2a12 12 0 0 1 17 0"/><path d="M6.8 12.6a7.3 7.3 0 0 1 10.4 0"/><path d="M10 15.9a2.8 2.8 0 0 1 4 0"/></g><circle cx="12" cy="19.2" r="1.3" fill="#1F1F3D"/><path d="M4 3.5 20 20.5" stroke="#fff" stroke-width="5.5"/><path d="M4 3.5 20 20.5" stroke="#D93A30" stroke-width="2.8"/></svg>',
    cloudOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10.5a3.5 3.5 0 0 0 .9-6.9A6 6 0 0 0 7.2 9.1 4.5 4.5 0 0 0 7 18Z"/><path d="m3 3 18 18"/></svg>',
    cloudOk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10.5a3.5 3.5 0 0 0 .9-6.9A6 6 0 0 0 7.2 9.1 4.5 4.5 0 0 0 7 18Z"/><path d="m9.5 13.5 2 2 3.5-4"/></svg>',
    sync: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.3-4.3L4 8.5"/><path d="M4 4v4.5h4.5"/><path d="M4 13a8 8 0 0 0 14.3 4.3l1.7-1.8"/><path d="M20 20v-4.5h-4.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M7 16v-4M12 16V7M17 16v-6"/></svg>'
  };
  function kit(name) { return SVG[name] || icon(name); }

  function blobs(variant) {
    var g = 'b' + (++uid);
    var dy = variant === 'blobs-low' ? 70 : 0;
    var L = 'M-60 300C-10 178 170 150 282 226C372 288 356 372 318 440H-60Z', R = 'M1140 236C1052 170 884 196 846 290C814 368 858 420 884 440H1140Z';
    return '<svg viewBox="0 0 1080 440" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs>' +
      '<linearGradient id="' + g + 'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DFE9FC"/><stop offset="1" stop-color="#B3CCF6"/></linearGradient>' +
      '<linearGradient id="' + g + 'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#63A8FF"/><stop offset=".5" stop-color="#2F72EA"/><stop offset="1" stop-color="#1A48A8"/></linearGradient>' +
      '<linearGradient id="' + g + 'c" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#72B4FF"/><stop offset=".55" stop-color="#3474E8"/><stop offset="1" stop-color="#1A46A6"/></linearGradient>' +
      '<radialGradient id="' + g + 'h" cx=".32" cy=".18" r=".62"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset=".45" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + g + 'k" cx=".7" cy=".16" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".58"/><stop offset=".45" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + g + 's" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<g transform="translate(0 ' + dy + ')">' +
      '<path d="M0 262C130 196 262 182 392 232C520 282 628 318 780 286C914 258 1004 206 1080 214V440H0Z" fill="url(#' + g + 'a)" opacity=".9"/>' +
      '<path d="M120 300C300 250 460 330 620 320C780 310 900 250 1080 262" stroke="url(#' + g + 's)" stroke-width="5" fill="none" opacity=".8"/>' +
      '<path d="' + L + '" fill="url(#' + g + 'b)"/><path d="' + L + '" fill="url(#' + g + 'h)"/>' +
      '<path d="M-24 250C30 200 118 190 176 214" stroke="#fff" stroke-opacity=".55" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<path d="' + R + '" fill="url(#' + g + 'c)"/><path d="' + R + '" fill="url(#' + g + 'k)"/>' +
      '<path d="M916 228C962 204 1022 200 1076 216" stroke="#fff" stroke-opacity=".5" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '</g></svg>';
  }
  function wave() {
    var g = 'w' + (++uid);
    return '<svg viewBox="0 0 1080 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><linearGradient id="' + g + '" x1="0" x2="1"><stop offset="0" stop-color="#2F72EA"/><stop offset="1" stop-color="#5DA4FF"/></linearGradient></defs>' +
      '<path d="M0 180C180 120 320 230 540 190C760 150 880 90 1080 130V300H0Z" fill="#DCE8FC"/>' +
      '<path d="M0 230C200 170 360 270 560 236C780 198 900 170 1080 196V300H0Z" fill="url(#' + g + ')"/></svg>';
  }
  function sparkles(color) {
    var c = color || '#FFC83D', c2 = '#3F86F7';
    var star = function (x, y, s, f) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-50C6-10 10-6 50 0C10 6 6 10 0 50C-6 10-10 6-50 0C-10-6-6-10 0-50Z" fill="' + f + '"/>'; };
    return '<svg viewBox="0 0 200 200" aria-hidden="true">' + star(70, 80, 1, c) + star(150, 40, .45, c2) + star(160, 150, .55, c) + star(30, 170, .3, c2) + '</svg>';
  }
  function arrowSvg(kind) {
    var p = {
      down: 'M20 10C70 20 110 60 100 150', right: 'M10 80C60 20 140 20 190 60', loop: 'M10 120C40 40 120 20 130 80C138 130 70 130 90 70C110 20 170 30 190 60',
      left: 'M190 80C140 20 60 20 10 60', up: 'M100 150C60 120 40 80 60 10'
    }[kind || 'right'];
    var head = { down: 'M78 128 100 152 118 126', right: 'M164 40 192 62 162 78', loop: 'M166 40 192 62 164 76', left: 'M36 40 8 62 38 78', up: 'M40 30 60 8 80 30' }[kind || 'right'];
    return '<svg viewBox="0 0 200 160" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/><path d="' + head + '"/></svg>';
  }
  function storm() {
    var g = 's' + (++uid);
    return '<svg viewBox="0 0 320 300" aria-hidden="true"><defs>' +
      '<linearGradient id="' + g + 'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9B6D3"/><stop offset="1" stop-color="#5C6B90"/></linearGradient>' +
      '<linearGradient id="' + g + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#FFB21F"/></linearGradient></defs>' +
      '<g stroke="#6FA0F5" stroke-width="6" stroke-linecap="round" opacity=".85"><path d="M88 170 70 214"/><path d="M130 176 108 232"/><path d="M226 172 206 222"/><path d="M262 166 250 196"/></g>' +
      '<path d="M78 164C36 164 14 138 18 110C22 80 50 64 78 70C84 36 116 14 152 18C188 22 210 46 214 74C246 64 286 82 294 116C302 150 276 168 246 168Z" fill="url(#' + g + 'a)"/>' +
      '<path d="M60 96C70 80 90 74 108 80M150 40C172 38 190 48 198 64" stroke="#fff" stroke-opacity=".5" stroke-width="8" stroke-linecap="round" fill="none"/>' +
      '<path d="M168 140 128 214H164L140 292 222 188H182L206 140Z" fill="url(#' + g + 'b)" stroke="#E08A00" stroke-width="5" stroke-linejoin="round"/></svg>';
  }
  function speed() {
    return '<svg viewBox="0 0 300 200" fill="none" stroke="#3F86F7" stroke-linecap="round" aria-hidden="true"><path d="M20 40H200" stroke-width="10" opacity=".9"/><path d="M60 90H280" stroke-width="12"/><path d="M10 140H170" stroke-width="8" opacity=".7"/><path d="M90 185H240" stroke-width="6" opacity=".5"/></svg>';
  }
  function confetti() {
    var cols = ['#3F86F7', '#FFC83D', '#21B799', '#714B67', '#6FA0F5'], s = '';
    for (var i = 0; i < 26; i++) {
      var x = (i * 73) % 400, y = (i * 131) % 300, r = (i * 47) % 180, c = cols[i % cols.length];
      s += i % 3 ? '<rect x="' + x + '" y="' + y + '" width="16" height="7" rx="3" fill="' + c + '" transform="rotate(' + r + ' ' + x + ' ' + y + ')"/>' : '<circle cx="' + x + '" cy="' + y + '" r="5" fill="' + c + '"/>';
    }
    return '<svg viewBox="0 0 400 300" aria-hidden="true">' + s + '</svg>';
  }

  /* ---------- phone screens ---------- */
  function odooScreen(L, offline) {
    var lines = L.lines || (offline ? [['Cement, 40 kg bags', '20 / 20', 1], ['Rebar, 12 mm', '150 / 150', 1], ['Tile adhesive, 25 kg', '18 / 35', 0]] : [['Item one', '1 / 1', 1], ['Item two', '2 / 2', 1], ['Item three', '0 / 3', 0]]);
    var fields = L.fields || [[L.partnerLabel || (offline ? 'Receive from' : 'Customer'), L.partner || 'Sample Supplier Pte Ltd']];
    return '<div class="ph-status"><span>9:41</span><span class="sig"><span class="bars"><i></i><i></i><i></i><i></i></span>' + (offline ? '<span class="x">\u2715</span>' : '') + '</span></div>' +
      '<div class="ph-top">' + oi(L.app || 'stock') + '<div><b data-e="title">' + esc(L.title || (offline ? 'Receipt WH/IN/00042' : 'Record')) + '</b><small data-e="crumb">' + esc(L.crumb || (offline ? 'Inventory · Receipts' : 'Odoo')) + '</small></div></div>' +
      (offline || L.banner ? '<div class="ph-offline' + (offline ? '' : ' info') + '">' + (offline ? SVG.cloudOff : SVG.spark) + '<span data-e="banner">' + esc(L.banner || "You're offline. Changes are saved on this phone.") + '</span></div>' : '') +
      '<div class="ph-body">' + fields.map(function (f) { return '<div class="ph-field"><small>' + esc(f[0]) + '</small><span>' + esc(f[1]) + '</span></div>'; }).join('') +
      lines.map(function (l) { return '<div class="ph-line"><span class="ck' + (l[2] ? '' : ' todo') + '">' + (l[2] ? SVG.check : '') + '</span>' + esc(l[0]) + '<span class="q">' + esc(l[1]) + '</span></div>'; }).join('') +
      '</div><div class="ph-btn" data-e="btn">' + esc(L.btn || 'Validate') + '</div>' +
      (L.toast ? '<div class="ph-toast">' + SVG.sync + '<span data-e="toast">' + esc(L.toast) + '</span></div>' : '');
  }
  var SCREENS = {
    'offline-receipt': function (L) { return odooScreen(L, true); },
    odoo: function (L) { return odooScreen(L, false); }
  };

  /* ---------- layers ---------- */
  function flowSteps(L) {
    if (L.steps) return L.steps;
    var m = /^industry:(.+)$/.exec(L.from || '');
    var ind = m && C.industries && C.industries[m[1]];
    return ind ? ind.flow.map(function (f) { return { app: f.app, icon: f.icon, t: f.t, h: f.h }; }) : [];
  }
  function flow(L) {
    var steps = flowSteps(L), cols = L.cols || 3, nw = L.nodeW || 270, nh = L.nodeH || 214, gx = L.gapX || 65, gy = L.gapY || 46;
    var pos = steps.map(function (s, i) {
      var r = Math.floor(i / cols), c = i % cols;
      if ((L.layout || 'snake') === 'snake' && r % 2) c = cols - 1 - c;
      return { x: c * (nw + gx), y: r * (nh + gy) };
    });
    var rows = Math.ceil(steps.length / cols), W = cols * nw + (cols - 1) * gx, H = rows * nh + (rows - 1) * gy;
    var wires = '', mk = 'm' + (++uid);
    for (var i = 0; i < steps.length - 1; i++) {
      var a = pos[i], b = pos[i + 1], d;
      if (a.y === b.y) {
        var dir = b.x > a.x ? 1 : -1, y = a.y + nh / 2, x1 = dir > 0 ? a.x + nw + 8 : a.x - 8, x2 = dir > 0 ? b.x - 14 : b.x + nw + 14;
        d = 'M' + x1 + ' ' + y + 'L' + x2 + ' ' + y;
      } else {
        var xx = a.x + nw / 2; d = 'M' + xx + ' ' + (a.y + nh + 8) + 'L' + xx + ' ' + (b.y - 14);
      }
      wires += '<path d="' + d + '" marker-end="url(#' + mk + ')"/>';
    }
    var svg = '<svg class="wires" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" fill="none" stroke="#3167CA" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 14" aria-hidden="true">' +
      '<defs><marker id="' + mk + '" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#3167CA" stroke="none"/></marker></defs>' + wires + '</svg>';
    var nodes = steps.map(function (s, i) {
      return '<div class="fnode' + (L.hot === i ? ' hot' : '') + '" style="left:' + pos[i].x + 'px;top:' + pos[i].y + 'px;width:' + nw + 'px;height:' + nh + 'px">' +
        (L.numbers === false ? '' : '<span class="n">' + (i + 1) + '</span>') +
        (s.app ? oi(s.app) : '<span class="oi" style="color:#3167CA">' + icon(s.icon || 'check') + '</span>') +
        '<span class="t">' + esc(s.t) + '</span><span class="h">' + esc(s.h) + '</span></div>';
    }).join('');
    return '<div class="flow" style="width:' + W + 'px;height:' + H + 'px">' + svg + nodes + '</div>';
  }
  function record(L) {
    var rows = (L.rows || []).map(function (r) {
      var mode = r[2] || '';
      return '<div class="rec-row' + (mode === 'ai' ? ' ai' : '') + '"><span class="k">' + esc(r[0]) + '</span><span class="v">' + esc(r[1]) + '</span>' +
        (mode === 'ok' ? '<span class="flag">' + SVG.check + (r[3] ? esc(r[3]) : '') + '</span>' : mode === 'ai' ? '<span class="spark">' + SVG.spark + '</span>' : '') + '</div>';
    }).join('');
    return '<div class="rec"><div class="rec-top">' + oi(L.app || 'accountant') + '<div><b data-e="title">' + esc(L.title || '') + '</b><small data-e="crumb">' + esc(L.crumb || '') + '</small></div>' +
      (L.status ? '<span class="st' + (L.statusOk ? ' ok' : '') + '" data-e="status">' + esc(L.status) + '</span>' : '') + '</div>' +
      '<div class="rec-rows">' + rows + '</div>' +
      '<div class="rec-foot">' + (L.ai ? '<span class="ai">' + SVG.spark + '<span data-e="ai">' + esc(L.ai) + '</span></span>' : '') + (L.btn ? '<span class="btn" data-e="btn">' + esc(L.btn) + '</span>' : '') + '</div></div>';
  }
  function frameShot(L) {
    var img = '<img src="' + asset(L.src) + '" alt="">';
    switch (L.frame) {
      case 'browser': return '<div class="frame-browser"><div class="bar"><i></i><i></i><i></i><span>' + esc(L.url || 'yourcompany.odoo.com') + '</span></div>' + img + '</div>';
      case 'laptop': return '<div class="frame-laptop"><div class="lid">' + img + '</div><div class="base"></div></div>';
      case 'tablet': return '<div class="frame-tablet">' + img + '</div>';
      default: return '<div class="shot" style="border-radius:' + (L.radius == null ? 18 : L.radius) + 'px">' + img + '</div>';
    }
  }

  var LAYERS = {
    nexi: function (L) { return (L.glow === false ? '' : '<span class="glow"></span>') + '<img src="' + asset('assets/nexi/nexi-' + (L.pose || 'wave') + '.png') + '" alt="Nexi">'; },
    person: function (L, edit) {
      if (!L.src) return edit ? '<div class="placeholder">Drop a person cut-out here<br><small style="font:500 20px Inter">(transparent PNG)</small></div>' : '';
      return '<img src="' + asset(L.src) + '" alt="">' + (L.fade ? '<span class="fade"></span>' : '');
    },
    img: function (L) { return L.src ? '<img src="' + asset(L.src) + '" alt="" style="border-radius:' + (L.radius || 0) + 'px">' : ''; },
    shot: function (L, edit) { return L.src ? frameShot(L) : (edit ? '<div class="placeholder" style="aspect-ratio:16/10">Drop a screenshot here</div>' : ''); },
    phone: function (L) { var sc = L.src ? '<img src="' + asset(L.src) + '" alt="">' : (SCREENS[L.screen || 'odoo'] || SCREENS.odoo)(L); return '<div class="phone"><div class="scr">' + sc + '</div></div>'; },
    record: record,
    flow: flow,
    apps: function (L) {
      var list = L.list || [];
      return '<div class="apps" style="grid-template-columns:repeat(' + (L.cols || 4) + ',1fr)">' + list.map(function (a) {
        var p = a.split(':'); return '<span class="a">' + oi(p[0]) + (L.labels === false ? '' : esc(p[1] || '')) + '</span>';
      }).join('') + '</div>';
    },
    pill: function (L) { return '<span class="pill ' + esc(L.variant || '') + '">' + (L.icon ? kit(L.icon) : '') + '<span data-e="text">' + esc(L.text) + '</span></span>'; },
    chip: function (L) { return '<span class="chip"><span class="ico ' + esc(L.tone || '') + '">' + kit(L.icon || 'check') + '</span><span><span data-e="text">' + esc(L.text) + '</span>' + (L.small ? '<small data-e="small">' + esc(L.small) + '</small>' : '') + '</span></span>'; },
    note: function (L) { return '<span class="note ' + esc(L.variant || '') + '" style="' + (L.size ? 'font-size:' + L.size + 'px;' : '') + (L.color ? 'color:' + L.color : '') + '"><span data-e="text">' + esc(L.text) + '</span>' + (L.small ? '<span class="small" data-e="small">' + esc(L.small) + '</span>' : '') + '</span>'; },
    bubble: function (L) { return '<span class="bubble" data-e="text">' + esc(L.text) + '</span>'; },
    text: function (L) {
      var f = { hand: 'var(--font-hand)', display: 'var(--font-display)', body: 'var(--font-body)' }[L.font || 'display'];
      return '<div style="font-family:' + f + ';font-size:' + (L.size || 40) + 'px;font-weight:' + (L.weight || 700) + ';line-height:' + (L.lh || 1.15) + ';color:' + (L.color || 'var(--ink)') + ';text-align:' + (L.align || 'left') + ';letter-spacing:' + (L.ls || '-.01em') + '">' + rich(L.text) + '</div>';
    },
    icon: function (L) { return '<span style="display:block;aspect-ratio:1;color:' + (L.color || 'var(--blue)') + '">' + kit(L.name) + '</span>'; },
    odoo: function (L) { return oi(L.app, '') .replace('class="oi"', 'class="oi" style="width:100%;height:auto"'); },
    arrow: function (L) { return '<span style="display:block;color:' + (L.color || 'var(--blue)') + '">' + arrowSvg(L.kind) + '</span>'; },
    sparkles: function (L) { return sparkles(L.color); },
    storm: storm, speed: speed, confetti: confetti,
    nosignal: function () { return '<span style="display:grid;place-items:center;aspect-ratio:1;border-radius:50%;background:#fff;color:#D93A30;padding:22%;box-shadow:0 20px 40px -18px rgba(19,47,102,.6),0 0 0 8px rgba(217,58,48,.12)">' + SVG.wifiOff + '</span>'; },
    burst: function () { return ''; }, glow: function () { return ''; }, sphere: function () { return ''; }, halftone: function () { return ''; }, scan: function () { return ''; }
  };
  /* ---------- website design elements ---------- */
  var SITES = C.sites || {}, APPS = C.apps || {};
  function appName(m) { return (APPS[m] && APPS[m].name) || String(m || '').replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function fromInd(L, key) { var m = /^industry:(.+)$/.exec(L.from || ''); return m && C.industries && C.industries[m[1]] ? C.industries[m[1]][key] : null; }
  function hlCode(line) {
    return esc(line).replace(/(&lt;\/?)([a-z0-9-]+)/g, '$1<span class="tg">$2</span>')
      .replace(/([a-z-]+)=(&quot;.*?&quot;)/g, '<span class="at">$1</span>=<span class="st">$2</span>');
  }
  LAYERS.site = function (L) {
    return '<div class="web" style="--acc:' + esc(L.accent || '#3167CA') + '">' +
      '<div class="web-bar"><i></i><i></i><i></i><span data-e="url">' + esc(L.url || 'yourbrand.com') + '</span></div>' +
      '<div class="web-nav"><b><span class="dot"></span><span data-e="brand">' + esc(L.brand || 'Your Brand') + '</span></b><span>Home</span><span>Services</span><span>About</span><em>' + esc(L.navCta || 'Contact') + '</em></div>' +
      '<div class="web-hero"><div class="web-copy"><h4>' + rich(L.head || 'A website that *works as hard as you do.*') + '</h4>' +
      '<p data-e="sub">' + esc(L.sub || 'Clear pages, fast on every phone, and every inquiry sent to the right person.') + '</p>' +
      '<div class="web-btns"><span class="b1" data-e="cta">' + esc(L.cta || 'Book a call') + '</span><span class="b2">' + esc(L.cta2 || 'See our work') + '</span></div></div>' +
      '<div class="web-img">' + (L.src ? '<img src="' + asset(L.src) + '" alt="">' : '<span class="s1"></span><span class="s2"></span><span class="s3"></span>') + '</div></div>' +
      '<div class="web-cards"><span><i></i><b></b><b class="s"></b></span><span><i></i><b></b><b class="s"></b></span><span><i></i><b></b><b class="s"></b></span></div></div>';
  };
  LAYERS.devices = function (L) {
    var k = L.site || 'technext', d = L.desk || 'assets/sites/' + k + '-desktop.jpg', m = L.mob || 'assets/sites/' + k + '-phone.jpg';
    return '<div class="devs"><div class="lap"><div class="lid"><img src="' + asset(d) + '" alt=""></div><div class="base"></div></div>' +
      (L.phone === false ? '' : '<div class="phone mini"><div class="scr"><img src="' + asset(m) + '" alt=""></div></div>') +
      (L.label === false ? '' : '<span class="devs-tag" data-e="label">' + esc(L.label || (SITES[k] ? SITES[k].url : '')) + '</span>') + '</div>';
  };
  LAYERS.cursor = function (L) {
    return '<svg viewBox="0 0 100 120" aria-hidden="true">' + (L.click === false ? '' : '<g fill="none" stroke="#3167CA" stroke-width="4"><circle cx="18" cy="16" r="20" opacity=".7"/><circle cx="18" cy="16" r="34" opacity=".35"/></g>') +
      '<path d="M18 16 18 96 38 78 52 110 66 104 52 72 80 72Z" fill="#fff" stroke="#1F1F3D" stroke-width="6" stroke-linejoin="round"/></svg>';
  };
  LAYERS.code = function (L) {
    var lines = L.lines || ['<section class="hero">', '  <h1>Run your business', '      on one system.</h1>', '  <a class="btn" href="/quote">', '    Get a quotation</a>', '</section>'];
    return '<div class="code"><div class="code-bar"><i></i><i></i><i></i><span data-e="file">' + esc(L.file || 'index.html') + '</span></div><div class="code-body">' +
      lines.map(function (l, i) { return '<div class="cl"><span class="ln">' + (i + 1) + '</span><span class="cx">' + hlCode(l) + '</span></div>'; }).join('') + '</div></div>';
  };
  LAYERS.palette = function (L) {
    var cs = L.colors || ['#3167CA', '#1E4691', '#1F1F3D', '#FFC83D', '#F5F6FA'];
    return '<div class="pal">' + cs.map(function (c) { return '<span><i style="background:' + esc(c) + '"></i><b>' + esc(String(c).toUpperCase()) + '</b></span>'; }).join('') + '</div>';
  };
  LAYERS.wireframe = function () {
    return '<div class="wf"><div class="wf-nav"><i></i><b></b><b></b><b></b><em></em></div><div class="wf-hero"><div><b class="l"></b><b class="l s"></b><b class="m"></b><span></span></div><i></i></div><div class="wf-cols"><i></i><i></i><i></i></div></div>';
  };
  LAYERS.gauge = function (L) {
    var v = L.value, pct = typeof v === 'number' ? Math.max(0, Math.min(100, v)) : 100, r = 54, c = 2 * Math.PI * r;
    return '<div class="gauge"><div class="gauge-ring"><svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="' + r + '" fill="none" stroke="#E4E7EF" stroke-width="14"/>' +
      '<circle cx="70" cy="70" r="' + r + '" fill="none" stroke="' + esc(L.color || '#137A4A') + '" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + (c * pct / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 70 70)"/></svg>' +
      '<span class="gv" style="color:' + esc(L.color || '#137A4A') + '">' + (v == null || v === '' ? SVG.check : esc(v)) + '</span></div><b data-e="label">' + esc(L.label || 'Mobile-first') + '</b></div>';
  };
  LAYERS.serp = function (L) {
    var sv = (C.services || {})['solutions/odoo-erp'] || {};
    return '<div class="serp"><div class="serp-q"><b class="g">G</b><span data-e="query">' + esc(L.query || 'odoo partner singapore') + '</span>' + SVG.search + '</div>' +
      '<div class="serp-r"><div class="serp-site"><i><img src="' + asset('assets/brand/logo-plane.png') + '" alt=""></i><span><b data-e="site">' + esc(L.site || 'TechNext') + '</b><small data-e="url">' + esc(L.url || 'https://technext.asia') + '</small></span></div>' +
      '<h5 data-e="title">' + esc(L.title || sv.title || 'TechNext') + '</h5><p data-e="desc">' + esc(L.desc || sv.desc || '') + '</p></div></div>';
  };

  /* ---------- workflows and panels copied from technext.asia ---------- */
  LAYERS.appflow = function (L) {
    var app = L.app || 'sale', f = (C.appFlows || {})[app]; if (!f) return '';
    var st = {}; f.states.forEach(function (s) { st[s[0]] = s; });
    var path = (f.path || f.states.map(function (s) { return s[0]; })).slice(0, L.max || 5), hand = (f.handoffs || []).slice(0, L.handoffs == null ? 2 : L.handoffs);
    return '<div class="aflow"><div class="af-top">' + oi(app) + '<div><b data-e="title">' + esc(L.title || ('How ' + (f.article || 'a') + ' ' + f.record + ' moves')) + '</b><small>Odoo ' + esc(appName(app)) + '</small></div></div>' +
      '<div class="af-rail" style="grid-template-columns:repeat(' + path.length + ',1fr)">' + path.map(function (k, i) { var s = st[k] || [k, k, '']; return '<div class="af-st' + (L.hot === i ? ' hot' : '') + '"><span class="af-dot">' + (i + 1) + '</span><b>' + esc(s[1]) + '</b><small>' + esc(s[2]) + '</small></div>'; }).join('') + '</div>' +
      (hand.length ? '<div class="af-hand">' + hand.map(function (h) { return '<span>' + oi(h[1]) + '<em>' + esc(appName(h[1])) + '</em>' + esc(h[2]) + '</span>'; }).join('') + '</div>' : '') + '</div>';
  };
  LAYERS.orbit = function (L) {
    var apps = L.apps || ['accountant', 'sale', 'crm', 'stock', 'purchase', 'mrp', 'point_of_sale', 'website', 'project', 'hr'], n = apps.length, h = '';
    apps.forEach(function (a, i) { var ang = (i / n) * 2 * Math.PI - Math.PI / 2; h += '<span class="ob-app" style="left:' + (50 + 42 * Math.cos(ang)).toFixed(2) + '%;top:' + (50 + 42 * Math.sin(ang)).toFixed(2) + '%">' + oi(a) + '</span>'; });
    return '<div class="orbit"><i class="ring r1"></i><i class="ring r2"></i><span class="ob-core">' +
      (L.core === 'odoo' ? '<img src="' + asset('assets/brand/odoo-wordmark.png') + '" alt="Odoo" style="width:62%">' : '<img src="' + asset('assets/brand/logo-plane.png') + '" alt="TechNext" style="width:40%">') +
      '<small data-e="label">' + esc(L.label || 'One database') + '</small></span>' + h + '</div>';
  };
  LAYERS.chart = function (L) {
    var ch = L.data || fromInd(L, 'chart'); if (!ch || !ch.views) return '';
    var view = ch.views[L.view || 0], max = Math.max.apply(null, view.bars.map(function (b) { return b[1]; }));
    return '<div class="dash"><div class="dash-top"><b>' + esc(ch.title) + '</b><span class="dash-tag">Sample data</span></div>' +
      '<div class="dash-kpis">' + ch.kpis.slice(0, 3).map(function (k) { return '<span><small>' + esc(k[0]) + '</small><b>' + esc(k[1]) + '</b></span>'; }).join('') + '</div>' +
      '<div class="dash-bars">' + view.bars.map(function (b) { return '<span><i style="height:' + (b[1] / max * 100).toFixed(1) + '%"></i><small>' + esc(b[0]) + '</small></span>'; }).join('') + '</div></div>';
  };
  LAYERS.checklist = function (L) {
    var items = L.items || fromInd(L, 'new20') || [], old = L.variant === 'old';
    return '<div class="clist' + (old ? ' old' : '') + (L.big ? ' big' : '') + '">' + (L.title ? '<div class="cl-top">' + (L.app ? oi(L.app) : '') + '<b data-e="title">' + esc(L.title) + '</b>' + (L.tag ? '<span class="cl-tag">' + esc(L.tag) + '</span>' : '') + '</div>' : '') +
      '<ul>' + items.slice(0, L.max || 5).map(function (t) { return '<li><span class="ck' + (old ? ' x' : '') + '">' + (old ? SVG.x : SVG.check) + '</span><span>' + esc(t) + '</span></li>'; }).join('') + '</ul>' +
      (L.apps && L.apps.length ? '<div class="cl-apps">' + L.apps.map(function (a) { return oi(a); }).join('') + '</div>' : '') + '</div>';
  };
  /* a QR code card (the pattern is decorative, drawn from the text so it stays the same on every render) */
  function strHash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function qrSVG(seed) {
    var n = 25, r = rng(seed), s = '';
    var finder = function (x, y) { return '<rect x="' + x + '" y="' + y + '" width="7" height="7" rx="1.4"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" rx=".9" fill="#fff"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" rx=".7"/>'; };
    for (var y = 0; y < n; y++) {
      var run = -1;
      for (var x = 0; x <= n; x++) {
        var free = x < n && !((x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)) && !(x > 9 && x < 15 && y > 9 && y < 15);
        var on = free && r() > .5;
        if (on && run < 0) run = x;
        if (!on && run >= 0) { s += '<rect x="' + run + '" y="' + y + '" width="' + (x - run) + '" height="1"/>'; run = -1; }
      }
    }
    return '<svg viewBox="-1 -1 ' + (n + 2) + ' ' + (n + 2) + '" aria-hidden="true"><g fill="#1F1F3D">' + s + finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7) + '</g></svg>';
  }
  LAYERS.qr = function (L) {
    return '<div class="qrc">' + (L.title ? '<b class="qr-t" data-e="title">' + esc(L.title) + '</b>' : '') +
      '<div class="qr-box">' + qrSVG(strHash(L.title || L.text || 'qr')) + '<span class="qr-logo">' + oi(L.app || 'point_of_sale') + '</span></div>' +
      (L.text ? '<span class="qr-x" data-e="text">' + esc(L.text) + '</span>' : '') + '</div>';
  };
  LAYERS.phases = function (L) {
    var ph = L.data || fromInd(L, 'phases') || [];
    return '<div class="phs">' + ph.slice(0, 3).map(function (p, i) {
      return '<div class="ph"><span class="ph-n">Phase ' + (i + 1) + '</span><b>' + esc(p.h) + '</b><div class="ph-apps">' + (p.apps || []).map(function (a) { return oi(a); }).join('') + '</div>' +
        '<ul>' + (p.items || []).slice(0, 3).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';
  };
  LAYERS.ba = function (L) {
    var rows = L.rows || (fromInd(L, 'ba') || []).slice(0, L.n || 3);
    return '<div class="bat"><div class="bat-h"><span></span><span>' + esc(L.oldLabel || 'The old way') + '</span><span>' + esc(L.newLabel || 'With Odoo') + '</span></div>' +
      rows.map(function (r) { return '<div class="bat-r"><b>' + esc(r[0]) + '</b><span class="o">' + esc(r[1]) + '</span><span class="n"><span class="ck">' + SVG.check + '</span>' + esc(r[2]) + '</span></div>'; }).join('') + '</div>';
  };

  /* ---------- v3: camera, backgrounds, brand ---------- */
  var CAM = {
    front: '',
    'tilt-l': 'perspective(2400px) rotateY(16deg) rotateX(4deg)',
    'tilt-r': 'perspective(2400px) rotateY(-16deg) rotateX(4deg)',
    'iso-l': 'perspective(2600px) rotateX(22deg) rotateY(12deg) rotateZ(-7deg)',
    'iso-r': 'perspective(2600px) rotateX(22deg) rotateY(-12deg) rotateZ(7deg)',
    top: 'perspective(2200px) rotateX(28deg)',
    low: 'perspective(2200px) rotateX(-10deg) rotateY(9deg)',
    dutch: 'perspective(2400px) rotateY(9deg) rotateZ(-5deg)'
  };
  var PAL = {
    blue: { a: '#DDE7F8', b: '#E3F3F0', c: '#F1E9F3', glow: 'rgba(111,160,245,.18)', line: '#E4ECF9', base: '#FFFFFF' },
    sky: { a: '#D4E4FF', b: '#E2F0FF', c: '#ECEAFF', glow: 'rgba(79,134,238,.2)', line: '#DFE9FB', base: '#FBFCFF' },
    mint: { a: '#D8F2EA', b: '#E0EBFB', c: '#EEF6E4', glow: 'rgba(33,183,153,.16)', line: '#E1F0EB', base: '#FFFFFF' },
    violet: { a: '#E9E2FA', b: '#DFE7FB', c: '#F7E5F0', glow: 'rgba(113,75,103,.13)', line: '#ECE7F6', base: '#FFFFFF' },
    sunrise: { a: '#FFECD6', b: '#FCE3EA', c: '#E1EAFB', glow: 'rgba(255,160,80,.15)', line: '#F4EBE3', base: '#FFFDFB' },
    slate: { a: '#E2E8F1', b: '#EBEFF5', c: '#DEE6F3', glow: 'rgba(49,103,202,.1)', line: '#E6EBF2', base: '#FAFBFC' },
    night: { a: '#1E3A7A', b: '#133F5E', c: '#2B2466', glow: 'rgba(111,160,245,.28)', line: 'rgba(255,255,255,.07)', base: '#0D1A3A', dark: true }
  };
  function rng(seed) { var t = (seed >>> 0) || 1; return function () { t += 0x6D2B79F5; var r = Math.imul(t ^ t >>> 15, 1 | t); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
  function au(x, y, r, col, op) { return '<i class="au" style="left:' + (x - r).toFixed(0) + 'px;top:' + (y - r).toFixed(0) + 'px;width:' + (2 * r).toFixed(0) + 'px;height:' + (2 * r).toFixed(0) + 'px;opacity:' + (op || 1) + ';background:radial-gradient(closest-side,' + col + ' 0,' + col + ' 38%,transparent 100%)"></i>'; }
  function bgx(bg, H, dark) {
    var p = PAL[bg.palette] || (dark ? PAL.night : PAL.blue), r = rng(bg.seed || 7), s = bg.style || 'aurora', f = bg.focus || [540, H * .62], h = '';
    var mask = function (cx, cy, rx, ry) { return '-webkit-mask-image:radial-gradient(' + rx + '% ' + ry + '% at ' + cx + '% ' + cy + '%,#000 25%,transparent 100%);mask-image:radial-gradient(' + rx + '% ' + ry + '% at ' + cx + '% ' + cy + '%,#000 25%,transparent 100%);'; };
    var cols = [p.a, p.b, p.c], pts = [[r() * 360 - 60, r() * 300 - 80], [760 + r() * 360, r() * 420 + 40], [240 + r() * 600, H - 120 + r() * 240]];
    if (s !== 'mesh') pts.forEach(function (q, i) { h += au(q[0], q[1], 420 + r() * 220, cols[i], p.dark ? .9 : 1); });
    else [[0, 0], [1080, 0], [0, H], [1080, H]].forEach(function (q, i) { h += au(q[0] + (r() - .5) * 300, q[1] + (r() - .5) * 300, 620 + r() * 160, [p.a, p.b, p.c, p.a][i], 1); });
    var gs = [36, 40, 44, 48, 54][Math.floor(r() * 5)];
    if (s === 'aurora' || s === 'grid' || s === 'navy' || s === 'rings') {
      var lc = s === 'grid' ? (p.dark ? 'rgba(255,255,255,.1)' : '#D9E4F6') : p.line;
      h += '<i class="grid" style="background-image:linear-gradient(' + lc + ' 1.5px,transparent 1.5px),linear-gradient(90deg,' + lc + ' 1.5px,transparent 1.5px);background-size:' + gs + 'px ' + gs + 'px;' + mask(f[0] / 10.8, f[1] / H * 100, s === 'grid' ? 80 : 68, s === 'grid' ? 85 : 72) + '"></i>';
      if (s === 'grid') h += '<i class="grid" style="background-image:linear-gradient(' + lc + ' 1px,transparent 1px),linear-gradient(90deg,' + lc + ' 1px,transparent 1px);background-size:' + (gs / 4) + 'px ' + (gs / 4) + 'px;opacity:.35;' + mask(f[0] / 10.8, f[1] / H * 100, 55, 60) + '"></i>';
    }
    if (s === 'dots') h += '<i class="dotf" style="background-image:radial-gradient(' + (p.dark ? 'rgba(255,255,255,.18)' : '#C9D6EE') + ' 1.6px,transparent 1.8px);background-size:' + (gs * .5) + 'px ' + (gs * .5) + 'px;' + mask(f[0] / 10.8, f[1] / H * 100, 70, 70) + '"></i>';
    if (s === 'floor') {
      var fc = p.dark ? 'rgba(255,255,255,.16)' : '#CFDDF4';
      h += '<i class="floor" style="background-image:linear-gradient(' + fc + ' 2px,transparent 2px),linear-gradient(90deg,' + fc + ' 2px,transparent 2px);background-size:' + (gs * 1.6) + 'px ' + (gs * 1.6) + 'px;transform:perspective(900px) rotateX(64deg);-webkit-mask-image:linear-gradient(transparent,#000 45%);mask-image:linear-gradient(transparent,#000 45%)"></i>' +
        '<i class="spot" style="left:-10%;right:-10%;width:auto;top:' + (H * .38) + 'px;height:' + (H * .3) + 'px;background:radial-gradient(50% 50% at 50% 50%,' + p.glow.replace(/[\d.]+\)$/, '.35)') + ',transparent)"></i>';
    }
    if (s === 'rays') for (var k = 0; k < 3; k++) { var x = 120 + r() * 840, w = 120 + r() * 160; h += '<i class="ray" style="left:' + x.toFixed(0) + 'px;width:' + w.toFixed(0) + 'px;transform:rotate(' + (22 + r() * 16).toFixed(1) + 'deg);background:linear-gradient(90deg,transparent,' + (p.dark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.95)') + ',transparent)"></i>'; }
    if (s === 'rings') [1, 1.45, 1.95].forEach(function (m, i) { var rr = 230 * m; h += '<i class="ring" style="left:' + (f[0] - rr) + 'px;top:' + (f[1] - rr) + 'px;width:' + (2 * rr) + 'px;height:' + (2 * rr) + 'px;border:' + (i === 0 ? 2 : 1.5) + 'px ' + (i === 1 ? 'dashed' : 'solid') + ' ' + (p.dark ? 'rgba(255,255,255,.14)' : 'rgba(49,103,202,' + (.2 - i * .05) + ')') + '"></i>'; });
    h += '<i class="spot" style="left:' + (f[0] - 560) + 'px;top:' + (f[1] - 560) + 'px;width:1120px;height:1120px;background:radial-gradient(closest-side,' + p.glow + ',transparent 70%)"></i>';
    return { html: '<div class="bgx" style="background:' + p.base + '">' + h + '</div>', dark: !!p.dark };
  }
  var LOGO_POS = { tl: 'left:56px;top:52px', tr: 'right:56px;top:52px', bl: 'left:56px;bottom:50px', br: 'right:56px;bottom:50px', bc: 'left:50%;bottom:50px;transform:translateX(-50%)' };
  var BADGE_POS = { tl: 'right:56px;top:46px', tr: 'left:56px;top:46px', bl: 'right:56px;bottom:44px', br: 'left:56px;bottom:44px', bc: 'right:56px;top:46px' };
  function brandHTML(b, d) {
    if (!b || b.logo === 'none') return '';
    var pos = b.logo || 'tl', h = '<div class="d-brand' + (b.style === 'chip' ? ' chip' : '') + '" style="' + LOGO_POS[pos] + '"><img class="lg" src="' + asset('assets/brand/logo-horizontal.png') + '" alt="TechNext">' + (b.url === false ? '' : '<span class="url">technext.asia</span>') + '</div>';
    var bd = b.badge == null ? (d.cat === 'odoo20' ? 'o20' : 'ready') : b.badge;
    if (bd === 'ready') h += '<div class="pbadge" style="' + BADGE_POS[pos] + '"><img src="' + asset('assets/brand/odoo-ready-partner.png') + '" alt="Odoo Ready Partner"></div>';
    if (bd === 'o20') h += '<div class="pbadge o20" style="' + BADGE_POS[pos] + '">' + badge('o20') + '</div>';
    return h;
  }
  LAYERS.link = function (L) {
    var x1 = L.x1 || 0, y1 = L.y1 || 0, x2 = L.x2 || 0, y2 = L.y2 || 0, bend = L.bend == null ? .25 : +L.bend;
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, cx = mx - dy * bend, cy = my + dx * bend, id = 'lk' + (++uid);
    var lx = .25 * x1 + .5 * cx + .25 * x2, ly = .25 * y1 + .5 * cy + .25 * y2;
    if (L.labelOnly) return L.label ? '<span class="lk-lab ' + esc(L.tone || '') + '" data-e="label" style="left:' + x1 + 'px;top:' + y1 + 'px">' + esc(L.label) + '</span>' : '';
    return '<svg viewBox="0 0 1080 1350" width="1080" height="1350" aria-hidden="true"><defs><marker id="' + id + '" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="' + (L.color || '#3167CA') + '"/></marker></defs>' +
      '<path d="M' + x1 + ' ' + y1 + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + (L.color || '#3167CA') + '" stroke-width="' + (L.width || 5) + '" stroke-linecap="round" stroke-dasharray="' + (L.dash === false ? 'none' : '2 13') + '" marker-end="url(#' + id + ')"' + (L.both ? ' marker-start="url(#' + id + ')"' : '') + ' style="pointer-events:stroke"/>' +
      '<circle cx="' + x1 + '" cy="' + y1 + '" r="9" fill="#fff" stroke="' + (L.color || '#3167CA') + '" stroke-width="4"/></svg>' +
      (L.label ? '<span class="lk-lab ' + esc(L.tone || '') + '" data-e="label" style="left:' + lx.toFixed(0) + 'px;top:' + ly.toFixed(0) + 'px">' + esc(L.label) + '</span>' : '');
  };

  var FX = { burst: 1, glow: 1, sphere: 1, halftone: 1, scan: 1, sparkles: 1, storm: 1, speed: 1, confetti: 1, arrow: 1 };

  function layerHTML(L, i, edit, ctx) {
    if (L.hide) return '';
    ctx = ctx || {};
    var tall = !!ctx.tall;
    var fn = LAYERS[L.type]; if (!fn) return '';
    if (L.type === 'link') {
      var sh = function (v) { return tall && v >= 380 ? v + 150 : v; }, LL = {}; Object.keys(L).forEach(function (k) { LL[k] = L[k]; });
      if (tall) { LL.y1 = sh(L.y1 || 0); LL.y2 = sh(L.y2 || 0); }
      return '<div class="L L-link" data-i="' + i + '" style="left:0;top:0;width:1080px;height:' + (tall ? 1350 : 1080) + 'px;z-index:' + (L.z == null ? 9 : L.z) + ';' + (L.op != null && L.op !== 1 ? 'opacity:' + L.op + ';' : '') + '"><div class="in">' + fn(LL, edit) + '</div></div>';
    }
    var inner = fn(L, edit);
    if (!inner && !FX[L.type]) return '';
    var y = L.y || 0; if (tall) y = L.y45 != null ? L.y45 : y >= 380 ? y + 150 : y;
    var st = 'left:' + (L.x || 0) + 'px;' + (L.b != null ? 'bottom:' + L.b + 'px;' : 'top:' + y + 'px;') + (L.w ? 'width:' + L.w + 'px;' : '') +
      'z-index:' + (L.z == null ? 10 : L.z) + ';' + (L.op != null && L.op !== 1 ? 'opacity:' + L.op + ';' : '') +
      ((L.rot || L.flip || L.s || (L.cam && CAM[ctx.cam])) ? 'transform:' + (L.cam && CAM[ctx.cam] ? CAM[ctx.cam] + ' ' : '') + 'rotate(' + (L.rot || 0) + 'deg)' + (L.flip ? ' scaleX(-1)' : '') + (L.s ? ' scale(' + L.s + ')' : '') + ';' : '');
    var cls = 'L L-' + L.type + (FX[L.type] ? ' fx fx-' + L.type : '') + (L.variant && FX[L.type] ? ' ' + L.variant : '') + (L.sticker ? ' sticker' : '') + (L.stack ? ' stack' + (+L.stack > 1 ? ' stack2' : '') : '');
    return '<div class="' + cls + '" data-i="' + i + '" style="' + st + '"><div class="in">' + inner + '</div></div>';
  }

  function badge(b) {
    if (b === 'ready') return '<div class="d-badge ready"><img src="' + asset('assets/brand/odoo-ready-partner.png') + '" alt="Odoo Ready Partner"></div>';
    if (b === 'o20') return '<div class="d-badge o20"><span class="meet">Meet</span><img class="wm" src="' + asset('assets/brand/odoo-wordmark.png') + '" alt="Odoo"><span class="v">20</span></div>';
    return '';
  }

  function render(d, opts) {
    opts = opts || {};
    var el = document.createElement('div');
    var tall = d.format === '4:5', H = tall ? 1350 : 1080, v3 = d.bg && typeof d.bg === 'object', dark = false, h = '';
    if (v3) { var B = bgx(d.bg, H, false); h += B.html; dark = B.dark; }
    el.className = 'drip' + (tall ? ' r45' : '') + (v3 ? ' v3' + (dark ? ' dark' : '') : d.bg && d.bg !== 'light' ? ' bg-' + d.bg : '') + (!v3 && d.tint ? ' tint-' + d.tint : '');
    el.setAttribute('data-id', d.id);
    if (!v3) {
      var ground = d.ground == null ? 'blobs' : d.ground;
      if (d.grid) h += '<div class="d-grid"></div>';
      if (d.pattern) h += '<div class="d-pat pat-' + esc(d.pattern) + '"></div>';
      if (ground) h += '<div class="d-ground">' + (ground === 'wave' ? wave() : ground.indexOf('blobs') === 0 ? blobs(ground) : ground === 'haze' ? '<i class="haze"></i>' : '') + '</div>';
    }
    if (d.brand) h += brandHTML(d.brand, d);
    else h += '<img class="d-logo" src="' + asset('assets/brand/logo-horizontal.png') + '" alt="TechNext">' + badge(d.badge);
    var c = d.copy || {}, free = c.x != null;
    var cst = free ? 'left:' + c.x + 'px;top:' + ((c.y || 0) + (tall && (c.y || 0) >= 380 ? 150 : tall ? 40 : 0)) + 'px;width:' + (c.w || 952) + 'px;text-align:' + (c.align || 'left') + ';' : 'top:' + ((c.top != null ? c.top : 148) + (tall ? 40 : 0)) + 'px;';
    var hst = (c.fs ? 'font-size:' + c.fs + 'px;' : '') + (c.color ? 'color:' + c.color + ';' : '');
    h += '<div class="d-copy' + (free ? ' free' + (c.align === 'center' ? ' ctr' : '') : c.align === 'left' ? ' left' : '') + '" data-i="copy" style="' + cst + '">' +
      (c.quote ? '<span class="d-quote">“</span>' : '') +
      (c.kicker ? '<span class="d-kicker">' + esc(c.kicker) + '</span>' : '') +
      '<h2 class="d-head' + (c.size ? ' s-' + c.size : '') + '"' + (c.lines ? ' data-lines="' + (+c.lines) + '"' : '') + (c.fs ? ' data-fs="' + (+c.fs) + '"' : '') + (hst ? ' style="' + hst + '"' : '') + '>' + rich(c.head || '') + '</h2>' +
      (c.sub ? '<p class="d-sub"' + (c.subFs ? ' data-fs="' + (+c.subFs) + '" style="font-size:' + c.subFs + 'px"' : '') + '>' + rich(c.sub) + '</p>' : '') + '</div>';
    (d.layers || []).forEach(function (L, i) { h += layerHTML(L, i, opts.edit, { tall: tall, cam: d.cam }); });
    if (d.cta) h += '<div class="d-cta">' + esc(d.cta.text || '') + (d.cta.btn ? '<b>' + esc(d.cta.btn) + '</b>' : '') + '</div>';
    el.innerHTML = h;
    return el;
  }

  /* shrink the headline until it fits its line budget (copy.lines, default 2) and the subline to 3 lines */
  function fit(root) {
    [].slice.call((root || document).querySelectorAll('.drip')).forEach(function (el) {
      var h = el.querySelector('.d-head'), p = el.querySelector('.d-sub');
      [[h, +(h && h.dataset.lines) || 2, 44, 1.0], [p, 3, 22, 1.36]].forEach(function (a) {
        var n = a[0]; if (!n) return;
        n.style.fontSize = n.dataset.fs ? n.dataset.fs + 'px' : '';
        var fs = parseFloat(getComputedStyle(n).fontSize), fs0 = fs, guard = 40;
        while (n.offsetHeight > fs * a[3] * a[1] + 4 && fs > a[2] && guard--) { fs -= 2; n.style.fontSize = fs + 'px'; }
        n.dataset.fit = fs < fs0 ? 'shrunk' : '';
      });
    });
  }

  window.TNDrip = { render: render, fit: fit, appName: appName, CAM: CAM, PAL: PAL, rng: rng, rich: rich, esc: esc, asset: asset, LAYERS: LAYERS, SCREENS: SCREENS, flowSteps: flowSteps };
})();
