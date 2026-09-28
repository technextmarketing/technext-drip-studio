/* TechNext Drip Studio — "inside Odoo" screens, drawn in HTML so every word stays editable.
   One app window (navbar, control panel, view) or one phone, with the views Odoo 17-20 uses:
   form, list, kanban, dashboard, planning, pos, kds, apps, discuss. All sizes are in cqw (percent of
   the component's own width), so a window reads the same at any size and in any camera angle.
   Data is sample data written for the post; never a real client's. */
(function () {
  'use strict';
  var R = window.TNDrip, C = window.TN_CONTENT || {};
  var esc = function (s) { return R.esc(s); };
  function oi(app) { return '<img class="oi" src="' + R.asset('assets/odoo/' + app + '.svg') + '" alt="">'; }
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  var SPARK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.6 2.4 7.1 7 8-4.6.9-6.4 3.4-7 8-.6-4.6-2.4-7.1-7-8 4.6-.9 6.4-3.4 7-8Z"/></svg>';
  var SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';
  function arr(v) { return Array.isArray(v) ? v : v == null || v === '' ? [] : [v]; }
  function initials(n) { var w = String(n || '?').replace(/[^A-Za-z\s]/g, ' ').trim().split(/\s+/); return (w.length > 1 ? w[0].charAt(0) + w[1].charAt(0) : (w[0] || '?').slice(0, 2)).toUpperCase(); }
  var HUES = ['#3167CA', '#21B799', '#E8A33D', '#D9567A', '#8A63D2', '#2FA7E6', '#E36C3A'];
  function hue(s) { var h = 0; String(s).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 997; }); return HUES[h % HUES.length]; }
  var BADGE = { draft: 'g', quotation: 'g', new: 'b', sent: 'b', 'to approve': 'o', waiting: 'o', ready: 'b', 'in progress': 'b', confirmed: 'b', 'sales order': 'b',
    done: 'ok', paid: 'ok', posted: 'ok', delivered: 'ok', validated: 'ok', won: 'ok', approved: 'ok', 'on track': 'ok', late: 'r', overdue: 'r', blocked: 'r', lost: 'r', cancelled: 'r' };
  function badge(t) { var k = BADGE[String(t).toLowerCase()] || (/(paid|done|posted|ok|✓)/i.test(t) ? 'ok' : /(late|overdue|due)/i.test(t) ? 'r' : 'b'); return '<span class="ob ob-' + k + '">' + esc(t) + '</span>'; }
  function money(v) { return esc(v); }
  function appName(m) { return R.appName(m); }

  /* ---------- views ---------- */
  var V = {};
  V.form = function (L) {
    var st = arr(L.status), at = L.statusAt == null ? st.length - 1 : +L.statusAt, hl = arr(L.highlight).map(String);
    var fields = arr(L.fields).slice(0, 6), lines = arr(L.lines).slice(0, 5);
    return '<div class="ow-form">' +
      '<div class="ow-bb"><div class="ow-btns">' + arr(L.buttons || ['Confirm']).slice(0, 3).map(function (b, i) { return '<span class="obtn' + (i === 0 ? ' pri' : '') + '">' + esc(b) + '</span>'; }).join('') + '</div>' +
      (st.length ? '<div class="ow-sb">' + st.slice(0, 4).map(function (s, i) { return '<span class="' + (i === at ? 'on' : i < at ? 'past' : '') + '">' + esc(s) + '</span>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="ow-sheet">' + (L.ribbon ? '<span class="ow-ribbon">' + esc(L.ribbon) + '</span>' : '') +
      '<div class="ow-title">' + esc(L.record || L.title || 'S00042') + '</div>' +
      '<div class="ow-fields">' + fields.map(function (f) { var on = hl.indexOf(String(f[0])) > -1; return '<div class="of' + (on ? ' hl' : '') + '"><span>' + esc(f[0]) + '</span><b>' + esc(f[1]) + (on && L.ai ? '<i class="ai">' + SPARK + '</i>' : '') + '</b></div>'; }).join('') + '</div>' +
      (lines.length ? '<div class="ow-tabs"><span class="on">' + esc(L.tab || 'Order Lines') + '</span><span>Other Info</span></div>' +
        '<table class="ow-tbl"><thead><tr>' + arr(L.cols || ['Product', 'Qty', 'Price', 'Subtotal']).map(function (c, i) { return '<th' + (i ? ' class="n"' : '') + '>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        lines.map(function (r, i) { return '<tr' + (hl.indexOf('line' + i) > -1 ? ' class="hl"' : '') + '>' + arr(r).map(function (c, j) { return '<td' + (j ? ' class="n"' : '') + '>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>' : '') +
      (L.total ? '<div class="ow-total"><span>Total</span><b>' + money(L.total) + '</b></div>' : '') +
      '</div>' + (L.chatter ? '<div class="ow-chat"><i>' + SPARK + '</i><span>' + esc(L.chatter) + '</span></div>' : '') + '</div>';
  };
  V.list = function (L) {
    var cols = arr(L.cols || ['Reference', 'Customer', 'Date', 'Total', 'Status']), rows = arr(L.rows).slice(0, 7), bcol = L.badgeCol == null ? cols.length - 1 : +L.badgeCol, hl = L.highlight == null ? -1 : +L.highlight;
    return '<div class="ow-list"><table class="ow-tbl lst"><thead><tr><th class="cb"><i></i></th>' + cols.map(function (c, i) { return '<th' + (i === cols.length - 2 && /total|amount|s\$|price/i.test(c) ? ' class="n"' : '') + '>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r, i) { return '<tr' + (i === hl ? ' class="hl"' : '') + '><td class="cb"><i' + (i === hl ? ' class="on"' : '') + '></i></td>' + arr(r).map(function (c, j) { return '<td' + (j === bcol ? '' : j === cols.length - 2 && /total|amount|s\$|price/i.test(cols[j] || '') ? ' class="n"' : '') + '>' + (j === bcol ? badge(c) : esc(c)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>' +
      (L.sum ? '<div class="ow-sum">' + esc(L.sum) + '</div>' : '') + '</div>';
  };
  V.kanban = function (L) {
    var stages = arr(L.stages).slice(0, 4), hl = arr(L.highlight).map(String);
    return '<div class="ow-kb" style="grid-template-columns:repeat(' + Math.max(1, stages.length) + ',1fr)">' + stages.map(function (s, si) {
      var cards = arr(s[1] || s.cards).slice(0, 3), name = s[0] || s.name;
      return '<div class="kb-col"><div class="kb-h"><b>' + esc(name) + '</b><span>' + (s[2] || cards.length) + '</span></div><div class="kb-bar"><i style="width:' + (40 + (si * 17) % 55) + '%"></i></div>' +
        cards.map(function (c, ci) { c = arr(c); var on = hl.indexOf(si + '.' + ci) > -1;
          return '<div class="kb-card' + (on ? ' hl' : '') + '"><b>' + esc(c[0]) + '</b>' + (c[1] ? '<span>' + esc(c[1]) + '</span>' : '') + '<div class="kb-ft">' + (c[2] ? '<em>' + esc(c[2]) + '</em>' : '<em></em>') + '<i style="background:' + hue(c[0]) + '">' + initials(c[3] || c[0]) + '</i></div></div>'; }).join('') + '</div>';
    }).join('') + '</div>';
  };
  V.dashboard = function (L) {
    var k = arr(L.kpis).slice(0, 4);
    return '<div class="ow-dash">' + (k.length ? '<div class="od-kpis" style="grid-template-columns:repeat(' + k.length + ',1fr)">' + k.map(function (x) { x = arr(x); return '<div><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b>' + (x[2] ? '<em class="' + (/^-/.test(x[2]) ? 'dn' : 'up') + '">' + esc(x[2]) + '</em>' : '') + '</div>'; }).join('') + '</div>' : '') +
      (L.chart ? '<div class="od-chart"><div class="od-ct">' + esc(L.chart.title || '') + '</div>' + chartSVG(L.chart) + '</div>' : '') +
      (L.demo === false ? '' : '<span class="od-demo">Demo data</span>') + '</div>';
  };
  V.planning = function (L) {
    var days = arr(L.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']), rows = arr(L.rows).slice(0, 6), n = days.length;
    return '<div class="ow-pl"><div class="pl-h"><span></span>' + days.map(function (d) { return '<span>' + esc(d) + '</span>'; }).join('') + '</div>' +
      rows.map(function (r) { r = arr(r); return '<div class="pl-r"><span class="pl-n"><i style="background:' + hue(r[0]) + '">' + initials(r[0]) + '</i>' + esc(r[0]) + '</span><div class="pl-t" style="grid-template-columns:repeat(' + n + ',1fr)">' +
        arr(r[1]).slice(0, 4).map(function (b) { b = arr(b); var s = Math.max(0, Math.min(n - 1, +b[0] || 0)), len = Math.max(1, Math.min(n - s, +b[1] || 1)); return '<em class="' + (b[3] || '') + '" style="grid-column:' + (s + 1) + ' / span ' + len + ';background:' + (b[3] && b[3].charAt(0) === '#' ? b[3] : hue(b[2])) + '">' + esc(b[2]) + '</em>'; }).join('') + '</div></div>'; }).join('') + '</div>';
  };
  V.pos = function (L) {
    var prods = arr(L.products).slice(0, 8), order = arr(L.order).slice(0, 5);
    return '<div class="ow-pos"><div class="pos-grid">' + prods.map(function (p) { p = arr(p); return '<div class="pos-p"><i style="background:linear-gradient(135deg,' + hue(p[0]) + '2E,' + hue(p[0]) + '66);color:' + hue(p[0]) + '">' + esc(initials(p[0])) + '</i><b>' + esc(p[0]) + '</b><span>' + esc(p[1] || '') + '</span></div>'; }).join('') + '</div>' +
      '<div class="pos-o"><div class="pos-oh">' + esc(L.table || 'Order 0042') + '</div>' + order.map(function (o) { o = arr(o); return '<div class="pos-l"><span><b>' + esc(o[0]) + '</b><small>' + esc(o[1] || '1') + ' × ' + esc(o[2] || '') + '</small></span><em>' + esc(o[3] || o[2] || '') + '</em></div>'; }).join('') +
      '<div class="pos-t"><span>Total</span><b>' + esc(L.total || '') + '</b></div><span class="pos-pay">' + esc(L.btn || 'Payment') + '</span></div></div>';
  };
  V.kds = function (L) {
    var t = arr(L.tickets).slice(0, 4);
    return '<div class="ow-kds" style="grid-template-columns:repeat(' + Math.max(1, t.length) + ',1fr)">' + t.map(function (k) { k = arr(k); var s = String(k[2] || 'cooking').toLowerCase();
      return '<div class="kds-t ' + (/ready|done/.test(s) ? 'ok' : /late/.test(s) ? 'late' : 'cook') + '"><div class="kds-h"><b>' + esc(k[0]) + '</b><span>' + esc(k[3] || '') + '</span></div>' +
        arr(k[1]).slice(0, 4).map(function (it) { it = arr(it); return '<div class="kds-i"><em>' + esc(it[1] || '1') + '</em>' + esc(it[0]) + '</div>'; }).join('') + '<div class="kds-f">' + esc(k[2] || 'Cooking') + '</div></div>'; }).join('') + '</div>';
  };
  V.apps = function (L) {
    var apps = arr(L.apps || ['sale', 'crm', 'accountant', 'stock', 'purchase', 'mrp', 'point_of_sale', 'project', 'planning', 'website', 'hr', 'helpdesk']).slice(0, 12), hl = arr(L.highlight);
    return '<div class="ow-home">' + apps.map(function (a) { return '<div class="oh-a' + (hl.indexOf(a) > -1 ? ' hl' : '') + '"><span>' + oi(a) + '</span><b>' + esc(appName(a)) + '</b></div>'; }).join('') + '</div>';
  };
  V.discuss = function (L) {
    var msgs = arr(L.msgs).slice(0, 5);
    return '<div class="ow-disc"><div class="dc-side">' + arr(L.channels || ['# general', 'Odoo AI', '# sales']).slice(0, 4).map(function (c, i) { return '<span' + (i === (L.channelAt || 1) ? ' class="on"' : '') + '>' + esc(c) + '</span>'; }).join('') + '</div>' +
      '<div class="dc-main">' + msgs.map(function (m) { m = arr(m); var who = m[0] || 'user', bot = /ai|bot|agent|nexi/i.test(who);
        return '<div class="dc-m' + (bot ? ' bot' : '') + '"><i style="background:' + (bot ? '#3167CA' : hue(who)) + '">' + (bot ? SPARK : initials(who)) + '</i><div><b>' + esc(who) + '</b><p>' + esc(m[1]) + '</p>' + (m[2] ? '<span class="dc-att">' + esc(m[2]) + '</span>' : '') + '</div></div>'; }).join('') + '</div></div>';
  };

  /* ---------- charts (static SVG) ---------- */
  function chartSVG(ch) {
    var kind = ch.kind || 'bar', data = arr(ch.data).slice(0, 8).map(function (d) { d = arr(d); return [String(d[0]), +d[1] || 0]; }), hl = ch.highlight == null ? -1 : +ch.highlight;
    if (!data.length) return '';
    var max = Math.max.apply(null, data.map(function (d) { return d[1]; })) || 1, W = 600, H = 300, n = data.length;
    if (kind === 'donut') {
      var tot = data.reduce(function (a, d) { return a + d[1]; }, 0) || 1, a0 = -Math.PI / 2, s = '';
      data.forEach(function (d, i) { var a1 = a0 + d[1] / tot * Math.PI * 2, r = 110, cx = 150, cy = 150, big = a1 - a0 > Math.PI ? 1 : 0;
        s += '<path d="M' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + 'A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + '" fill="none" stroke="' + (i === hl || (hl < 0 && i === 0) ? '#3167CA' : ['#6FA0F5', '#A9C6F6', '#21B799', '#FFC83D', '#8A63D2', '#D9567A', '#E36C3A'][i % 7]) + '" stroke-width="44"/>'; a0 = a1; });
      return '<svg class="chart" viewBox="0 0 600 300" aria-hidden="true">' + s + '<text x="150" y="146" text-anchor="middle" class="cv">' + esc(ch.center || '') + '</text><text x="150" y="178" text-anchor="middle" class="cl">' + esc(ch.centerLabel || '') + '</text>' +
        data.map(function (d, i) { return '<g transform="translate(320 ' + (60 + i * 34) + ')"><rect width="18" height="18" rx="5" fill="' + (i === hl || (hl < 0 && i === 0) ? '#3167CA' : ['#6FA0F5', '#A9C6F6', '#21B799', '#FFC83D', '#8A63D2', '#D9567A', '#E36C3A'][i % 7]) + '"/><text x="30" y="15" class="cx">' + esc(d[0]) + '</text><text x="270" y="15" text-anchor="end" class="cx b">' + esc(d[1]) + (ch.unit || '') + '</text></g>'; }).join('') + '</svg>';
    }
    if (kind === 'funnel') {
      return '<svg class="chart" viewBox="0 0 600 300" aria-hidden="true">' + data.map(function (d, i) {
        var h = 280 / n, w = 560 * (d[1] / max), w2 = i < n - 1 ? 560 * (data[i + 1][1] / max) : w * .8, y = 10 + i * h;
        return '<path d="M' + (300 - w / 2) + ' ' + y + 'H' + (300 + w / 2) + 'L' + (300 + w2 / 2) + ' ' + (y + h - 6) + 'H' + (300 - w2 / 2) + 'Z" fill="' + (i === hl ? '#3167CA' : ['#1E4691', '#3167CA', '#6FA0F5', '#A9C6F6', '#DDE7F8'][i % 5]) + '"/>' +
          '<text x="300" y="' + (y + h / 2 + 9) + '" text-anchor="middle" class="cx fz ' + (i < 3 ? 'w' : '') + '">' + esc(d[0]) + ' · ' + esc(d[1]) + (ch.unit || '') + '</text>';
      }).join('') + '</svg>';
    }
    if (kind === 'progress') {
      return '<div class="pbars">' + data.map(function (d, i) { var pct = Math.max(0, Math.min(100, d[1] / (ch.max || 100) * 100)); return '<div class="pb' + (i === hl ? ' hl' : '') + '"><span>' + esc(d[0]) + '</span><b>' + esc(d[1]) + (ch.unit || '') + '</b><i><em style="width:' + pct + '%"></em></i></div>'; }).join('') + '</div>';
    }
    var pl = 20, pr = 20, pt = 26, pb = 40, iw = W - pl - pr, ih = H - pt - pb;
    var grid = [0, .25, .5, .75, 1].map(function (g) { var y = pt + ih * (1 - g); return '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '" class="gl"/>'; }).join('');
    var labels = data.map(function (d, i) { var x = pl + iw * (n === 1 ? .5 : kind === 'bar' || kind === 'hbar' ? (i + .5) / n : i / (n - 1)); return '<text x="' + x.toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" class="cx">' + esc(d[0]) + '</text>'; }).join('');
    if (kind === 'line' || kind === 'area') {
      var pts = data.map(function (d, i) { return [pl + iw * (n === 1 ? .5 : i / (n - 1)), pt + ih * (1 - d[1] / max)]; });
      var path = pts.map(function (p, i) { if (!i) return 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1); var q = pts[i - 1], mx = (q[0] + p[0]) / 2; return 'C' + mx.toFixed(1) + ' ' + q[1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + p[1].toFixed(1) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
      var gid = 'ga' + Math.round(Math.random() * 1e6);
      return '<svg class="chart" viewBox="0 0 600 300" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3167CA" stop-opacity=".32"/><stop offset="1" stop-color="#3167CA" stop-opacity="0"/></linearGradient></defs>' + grid +
        (kind === 'area' || true ? '<path d="' + path + 'L' + pts[n - 1][0].toFixed(1) + ' ' + (pt + ih) + 'L' + pts[0][0].toFixed(1) + ' ' + (pt + ih) + 'Z" fill="url(#' + gid + ')"/>' : '') +
        '<path d="' + path + '" fill="none" stroke="#3167CA" stroke-width="5" stroke-linecap="round"/>' +
        pts.map(function (p, i) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (i === hl || (hl < 0 && i === n - 1) ? 10 : 6) + '" fill="#fff" stroke="#3167CA" stroke-width="4"/>'; }).join('') +
        (hl >= 0 || true ? (function () { var i = hl >= 0 ? hl : n - 1, p = pts[i]; return '<g transform="translate(' + Math.min(W - 90, Math.max(50, p[0])).toFixed(1) + ' ' + Math.max(18, p[1] - 30).toFixed(1) + ')"><rect x="-44" y="-22" width="88" height="30" rx="9" fill="#1F1F3D"/><text x="0" y="-2" text-anchor="middle" class="tip">' + esc(data[i][1]) + (ch.unit || '') + '</text></g>'; })() : '') + labels + '</svg>';
    }
    var bw = iw / n * .56;
    return '<svg class="chart" viewBox="0 0 600 300" aria-hidden="true"><defs><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FA0F5"/><stop offset="1" stop-color="#3167CA"/></linearGradient></defs>' + grid +
      data.map(function (d, i) { var x = pl + iw * (i + .5) / n - bw / 2, h = ih * d[1] / max, y = pt + ih - h, on = i === hl;
        return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="8" fill="' + (on ? '#1E4691' : hl >= 0 ? '#A9C6F6' : 'url(#gb)') + '"/>' + (on ? '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 10).toFixed(1) + '" text-anchor="middle" class="cx b">' + esc(d[1]) + (ch.unit || '') + '</text>' : ''); }).join('') + labels + '</svg>';
  }

  /* ---------- the window and the phone ---------- */
  function control(L) {
    var crumbs = arr(L.crumbs || [L.menu || appName(L.app || 'sale')]);
    var views = { form: 'form', list: 'list', kanban: 'kanban', dashboard: 'graph', planning: 'gantt', pos: '', kds: '', apps: '', discuss: '' }[L.view || 'form'];
    return '<div class="ow-cp"><div class="ow-bc">' + crumbs.slice(0, 3).map(function (c, i, a) { return '<span' + (i === a.length - 1 ? ' class="cur"' : '') + '>' + esc(c) + '</span>'; }).join('<i>/</i>') + '</div>' +
      (views ? '<div class="ow-srch">' + SEARCH + '<span>' + esc(L.search || 'Search…') + '</span></div><div class="ow-vs">' + ['list', 'kanban', 'graph', 'form'].map(function (v) { return '<i class="' + (v === views ? 'on' : '') + '"></i>'; }).join('') + '</div>' : '') + '</div>';
  }
  function windowHTML(L) {
    var view = V[L.view] ? L.view : 'form', app = L.app || 'sale';
    var chrome = view === 'apps' ? '' : '<div class="ow-nav">' + oi(app) + '<b>' + esc(L.appLabel || appName(app)) + '</b>' + arr(L.menus || ['Orders', 'Products', 'Reporting']).slice(0, 3).map(function (m, i) { return '<span' + (i === 0 ? ' class="on"' : '') + '>' + esc(m) + '</span>'; }).join('') +
      '<em class="ow-me"><i></i><i></i><u>' + initials(L.user || 'TN') + '</u></em></div>' + (view === 'pos' || view === 'kds' ? '' : control(L));
    var k = L.w ? Math.max(1, Math.min(2.1, 820 / L.w)) : 1;
    return '<div class="ow' + (L.dark ? ' dark' : '') + ' v-' + view + '" style="--k:' + k.toFixed(2) + '">' + (L.frame === false ? '' : '<div class="ow-bar"><i></i><i></i><i></i><span>' + esc(L.url || 'yourcompany.odoo.com') + '</span></div>') + chrome + '<div class="ow-body">' + V[view](L) + '</div></div>';
  }
  function phoneHTML(L) {
    var view = V[L.view] ? L.view : 'form', app = L.app || 'sale';
    return '<div class="phone op"><div class="scr"><div class="op-status"><span>9:41</span><span class="op-sig"><i></i><i></i><i></i><i></i></span></div>' +
      '<div class="op-nav">' + oi(app) + '<b>' + esc(arr(L.crumbs).slice(-1)[0] || L.title || appName(app)) + '</b></div><div class="op-body ow mob v-' + view + '">' + V[view](L) + '</div></div></div>';
  }

  var LAYERS = R.LAYERS;
  LAYERS.window = function (L) { return windowHTML(L); };
  LAYERS.ophone = function (L) { return phoneHTML(L); };
  LAYERS.graph = function (L) {
    return '<div class="gcard' + (L.glass ? ' glass' : '') + '">' + (L.title ? '<div class="gc-h"><b data-e="title">' + esc(L.title) + '</b>' + (L.tag ? '<span>' + esc(L.tag) + '</span>' : '') + '</div>' : '') + chartSVG(L) + (L.note ? '<div class="gc-note">' + esc(L.note) + '</div>' : '') + (L.demo === false ? '' : '<span class="od-demo">Demo data</span>') + '</div>';
  };
  LAYERS.kpis = function (L) {
    var k = arr(L.items).slice(0, 4);
    return '<div class="kpis' + (L.glass ? ' glass' : '') + '" style="grid-template-columns:repeat(' + Math.max(1, Math.min(k.length, L.cols || k.length)) + ',1fr)">' + k.map(function (x) { x = arr(x); return '<div class="kp">' + (x[3] ? oi(x[3]) : '') + '<span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b>' + (x[2] ? '<em class="' + (/^-/.test(x[2]) ? 'dn' : 'up') + '">' + esc(x[2]) + '</em>' : '') + '</div>'; }).join('') + '</div>';
  };
  LAYERS.timeline = function (L) {
    var it = arr(L.items).slice(0, 6);
    return '<div class="tl' + (L.glass ? ' glass' : '') + '">' + (L.title ? '<div class="tl-h" data-e="title">' + esc(L.title) + '</div>' : '') + it.map(function (x, i) { x = arr(x); return '<div class="tl-i' + (i === +L.hot ? ' hot' : '') + '"><span class="tl-w">' + esc(x[0]) + '</span><i>' + (x[2] ? oi(x[2]) : '') + '</i><div><b>' + esc(x[1]) + '</b>' + (x[3] ? '<small>' + esc(x[3]) + '</small>' : '') + '</div></div>'; }).join('') + '</div>';
  };
  LAYERS.steps = function (L) {
    var it = arr(L.items).slice(0, 6), dir = L.dir === 'v' ? 'v' : 'h';
    return '<div class="stp ' + dir + '">' + it.map(function (x, i) { x = arr(x); return '<div class="st' + (i === +L.hot ? ' hot' : '') + '"><span class="st-ic">' + (x[0] ? oi(x[0]) : '<b>' + (i + 1) + '</b>') + '</span><b>' + esc(x[1]) + '</b>' + (x[2] ? '<small>' + esc(x[2]) + '</small>' : '') + '</div>' + (i < it.length - 1 ? '<span class="st-ar"></span>' : ''); }).join('') + '</div>';
  };
  LAYERS.chat = function (L) {
    var ch = L.channel || 'whatsapp', msgs = arr(L.msgs).slice(0, 6);
    return '<div class="cht ' + esc(ch) + '"><div class="cht-h"><i>' + (ch === 'whatsapp' ? 'W' : ch === 'web' ? '●' : SPARK) + '</i><div><b data-e="title">' + esc(L.title || (ch === 'whatsapp' ? 'Sample Store' : 'Chat')) + '</b><small>' + esc(L.status || (ch === 'whatsapp' ? 'WhatsApp · online' : 'Website chat')) + '</small></div></div><div class="cht-b">' +
      msgs.map(function (m) { m = arr(m); return '<div class="cm ' + (m[0] === 'in' ? 'in' : m[0] === 'bot' ? 'bot' : 'out') + '">' + (m[0] === 'bot' ? '<i>' + SPARK + '</i>' : '') + '<p>' + esc(m[1]) + '</p>' + (m[2] ? '<small>' + esc(m[2]) + '</small>' : '') + '</div>'; }).join('') + '</div></div>';
  };
  LAYERS.receipt = function (L) {
    var ln = arr(L.lines).slice(0, 5);
    return '<div class="rcp"><div class="rcp-h"><b data-e="vendor">' + esc(L.vendor || 'Sample Supplier Pte Ltd') + '</b><small>' + esc(L.doc || 'INVOICE') + '</small></div>' + ln.map(function (x) { x = arr(x); return '<div class="rcp-l"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>'; }).join('') +
      '<div class="rcp-t"><span>Total</span><b>' + esc(L.total || '') + '</b></div>' + (L.stamp ? '<span class="rcp-s">' + esc(L.stamp) + '</span>' : '') + '<span class="rcp-z"></span></div>';
  };
  LAYERS.notif = function (L) {
    return '<div class="ntf">' + oi(L.app || 'mail') + '<div><b data-e="title">' + esc(L.title || 'Notification') + '</b><span data-e="text">' + esc(L.text || '') + '</span></div><em>' + esc(L.time || 'now') + '</em></div>';
  };
  LAYERS.stat = function (L) {
    var n = String(L.value || '').length;
    return '<div class="stt' + (L.glass ? ' glass' : '') + (L.variant === 'big' ? ' big' : '') + '"><b data-e="value"' + (n > 6 ? ' style="font-size:' + (132 / n).toFixed(1) + 'cqw"' : '') + '>' + esc(L.value || '') + '</b><span data-e="label">' + esc(L.label || '') + '</span></div>';
  };
  LAYERS.route = function (L) {
    var st = arr(L.stops).slice(0, 5), n = st.length || 1;
    var pts = st.map(function (s, i) { var t = n === 1 ? .5 : i / (n - 1); return [60 + t * 480, 190 + Math.sin(t * Math.PI * 1.6 + .6) * 90]; });
    var path = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(0) + ' ' + p[1].toFixed(0); }).join('');
    return '<div class="rte"><svg viewBox="0 0 600 380" aria-hidden="true"><rect width="600" height="380" rx="0" fill="#EEF3FA"/><g stroke="#DCE5F2" stroke-width="16" fill="none"><path d="M0 120H600M0 280H600M170 0V380M420 0V380"/></g>' +
      '<path d="' + path + '" fill="none" stroke="#3167CA" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 16"/>' +
      pts.map(function (p, i) { return '<g transform="translate(' + p[0].toFixed(0) + ' ' + p[1].toFixed(0) + ')"><circle r="20" fill="' + (i === +L.hot ? '#3167CA' : '#fff') + '" stroke="#3167CA" stroke-width="5"/><text y="7" text-anchor="middle" class="rn' + (i === +L.hot ? ' w' : '') + '">' + (i + 1) + '</text></g>'; }).join('') + '</svg>' +
      '<div class="rte-l">' + st.map(function (s, i) { s = arr(s); return '<span' + (i === +L.hot ? ' class="hot"' : '') + '><em>' + (i + 1) + '</em><b>' + esc(s[0]) + '</b><small>' + esc(s[1] || '') + '</small></span>'; }).join('') + '</div></div>';
  };

  /* ---------- one Odoo view as a clean card (no browser chrome): the simple style ---------- */
  var APC_K = { kanban: 1.75, list: 1.6, planning: 1.55, kds: 1.8, pos: 1.5, dashboard: 1.45, discuss: 1.6, form: 1.5, apps: 1.35 };
  LAYERS.appcard = function (L) {
    var view = V[L.view] ? L.view : 'kanban', app = L.app || 'sale';
    return '<div class="apc">' +
      '<div class="apc-top">' + oi(app) + '<div><b data-e="title">' + esc(L.title || appName(app)) + '</b>' + (L.crumb ? '<small data-e="crumb">' + esc(L.crumb) + '</small>' : '') + '</div>' +
      (L.tag ? '<span class="apc-tag" data-e="tag">' + esc(L.tag) + '</span>' : '') + '</div>' +
      '<div class="apc-body ow v-' + view + '" style="--k:' + (+L.k || APC_K[view] || 1.6) + '">' + V[view](L) + '</div></div>';
  };

  R.chartSVG = chartSVG;
  window.TNOdooUI = { views: Object.keys(V) };
})();
