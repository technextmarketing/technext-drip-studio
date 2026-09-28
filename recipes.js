/* TechNext Drip Studio — recipes. A recipe turns one content concept (written by Claude or by hand)
   into a finished drip: the copy goes into the headline, the facts into website-sourced layouts.
   Claude never positions anything; every layout below is fixed and tested on the 1080 canvas. */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {};
  var POSES = ['wave', 'point', 'present', 'celebrate', 'cheer', 'surprise', 'love', 'think', 'clap'];

  var RECIPES = {
    workflow: { label: 'Industry workflow', needs: 'industry', about: "the industry's six-step Odoo flow from the website", fields: 'hot (0-5, the step the post is about), old (the old habit, max 22 chars), new (what Odoo does instead, max 26 chars)' },
    beforeafter: { label: 'Before / after', needs: 'industry', about: 'three rows of the old way vs Odoo from the website table', fields: 'rows: 3 arrays [topic, old way, Odoo way], copied or shortened from BEFORE/AFTER' },
    record: { label: 'Odoo record + Nexi', about: 'an Odoo record card with Nexi pointing at it and 3 step chips', fields: 'app (module), title, crumb ("App · state"), status, rows: 3-4 arrays [label, value, "ai"|"ok"|""], steps: 3 short step chips (max 24 chars), bubble (Nexi says, max 16 chars)' },
    phone: { label: 'Phone screen', about: 'a phone showing an Odoo screen, with handwritten callouts', fields: 'app (module), title, crumb, banner (one short line), fields: 1 array [label, value], lines: 3 arrays [item, "done / total", true|false], btn, pills: 3 callouts (max 18 chars), chip (max 22 chars)' },
    chart: { label: 'Industry dashboard', needs: 'industry', about: "the industry's reporting dashboard from the website (sample data)", fields: 'pills: 2 callouts (max 20 chars)' },
    checklist: { label: 'Checklist card', about: 'a card listing 3-4 short points (Odoo 20 changes, features, what is included)', fields: 'title (max 34 chars), items: 3-4 lines (max 70 chars each), apps: 0-4 modules, tag (max 18 chars)' },
    phases: { label: 'Rollout phases', needs: 'industry', about: "the website's three implementation phases for the industry", fields: 'pill (max 20 chars)' },
    appflow: { label: 'How a record moves', about: 'the lifecycle of one Odoo record (states and hand-offs) from the website', fields: 'app (module with a flow), hot (0-4), pills: 2 callouts (max 20 chars)' },
    orbit: { label: 'App orbit', about: 'Odoo apps around one database', fields: 'apps: 6-10 modules, label (max 16 chars), pills: 2 callouts (max 20 chars)' },
    reaction: { label: 'Nexi reaction', about: 'an exaggerated Nexi reaction with handwritten callouts; good for questions and hooks', fields: 'pose (surprise|love|celebrate|cheer|think|wave|clap), pills: 3 callouts (max 20 chars)' },
    website: { label: 'Website we built', about: 'a real TechNext-built website on a laptop and phone', fields: 'site (technext|movewithease|tre|immaculate), chips: 3 website benefits from the website service text (max 26 chars)' },
    webdesign: { label: 'Web design craft', about: 'a coded website mockup with a code window and a score gauge', fields: 'brand (max 18 chars), sitehead (mockup headline with *blue* words, max 40 chars), pill (max 18 chars), gauge (max 14 chars)' },
    seo: { label: 'Found on Google', about: 'a Google search result for TechNext', fields: 'query (a search a customer would type), title (max 60 chars), desc (max 150 chars), chips: 2 short points (max 26 chars)' }
  };
  var FOR_CAT = {
    industry: ['workflow', 'beforeafter', 'record', 'phone', 'chart', 'checklist', 'phases', 'appflow', 'orbit', 'reaction'],
    odoo20: ['checklist', 'phone', 'record', 'reaction', 'appflow', 'orbit'],
    apps: ['appflow', 'orbit', 'record', 'phone', 'checklist', 'reaction'],
    ai: ['record', 'reaction', 'checklist', 'phone', 'appflow'],
    services: ['website', 'webdesign', 'seo', 'checklist', 'reaction'],
    'field-service': ['appflow', 'phone', 'checklist', 'record', 'reaction']
  };

  function s(v, max) { v = v == null ? '' : String(v).replace(/\s+/g, ' ').trim(); return max && v.length > max ? v.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : v; }
  function arr(v) { return Array.isArray(v) ? v : v == null || v === '' ? [] : [v]; }
  function mod(m, fallback) { m = s(m).replace(/^odoo[ _-]?/i, ''); return (C.apps && C.apps[m]) || (C.appFlows && C.appFlows[m]) ? m : fallback; }
  function pills(list, n, max) { return arr(list).slice(0, n).map(function (t) { return s(t, max || 22); }).filter(Boolean); }

  function base(c, ctx) {
    return {
      id: '', cat: ctx.cat, name: s(c.name, 60) || s(c.head, 60).replace(/[*~|=]/g, ''),
      badge: c.badge === 'o20' || ctx.cat === 'odoo20' ? 'o20' : 'ready', ground: 'blobs',
      copy: { head: s(c.head, 110) || 'Your headline, *in blue.*', sub: s(c.sub, 170) },
      caption: s(c.caption, 900), hashtags: arr(c.hashtags).slice(0, 6).map(function (h) { h = s(h, 30).replace(/\s+/g, ''); return h.charAt(0) === '#' ? h : '#' + h; }),
      source: ctx.source || '', layers: []
    };
  }
  var fx = {
    sparkles: function (x, y, w) { return { type: 'sparkles', x: x, y: y, w: w || 110, z: 20 }; },
    sphere: function (x, y, w) { return { type: 'sphere', x: x, y: y, w: w || 54, z: 6 }; }
  };
  function leftPills(list, ys) {
    return list.map(function (t, i) { return { type: 'pill', x: [62, 44, 96][i], y: ys[i], rot: [-5, 3, -3][i], z: 18, text: t }; });
  }

  var BUILD = {
    workflow: function (d, c, ctx) {
      d.ground = 'blobs-low'; d.copy.size = 'm';
      var hot = +c.hot; hot = hot >= 0 && hot <= 5 ? hot : undefined;
      d.layers.push({ type: 'flow', x: 70, y: 410, z: 12, from: 'industry:' + ctx.industry, cols: 3, nodeW: 270, nodeH: 200, gapX: 65, gapY: 50, layout: 'snake', hot: hot },
        fx.sparkles(906, 330, 120), fx.sphere(44, 330, 46));
      var o = s(c.old, 24), n = s(c.new, 28);
      if (o && n) d.layers.push({ type: 'note', x: Math.max(40, 470 - o.length * 19), y: 906, rot: -4, z: 20, text: o.toLowerCase(), variant: 'red strike', size: 44 },
        { type: 'arrow', x: 486, y: 890, w: 100, rot: 8, z: 20, kind: 'right' }, { type: 'note', x: 606, y: 900, rot: -3, z: 20, text: n.toLowerCase(), size: 44 });
    },
    beforeafter: function (d, c, ctx) {
      var rows = arr(c.rows).filter(function (r) { return Array.isArray(r) && r.length >= 3; }).slice(0, 3).map(function (r) { return [s(r[0], 26), s(r[1], 52), s(r[2], 56)]; });
      d.layers.push({ type: 'ba', x: 70, y: 432, w: 940, z: 12, from: 'industry:' + ctx.industry, rows: rows.length ? rows : undefined },
        { type: 'nexi', x: 820, y: 790, w: 210, z: 16, pose: 'think', glow: false },
        { type: 'pill', x: 80, y: 912, rot: -4, z: 18, text: pills(c.pills, 1, 28)[0] || 'One system, zero retyping' }, fx.sphere(46, 380, 46));
    },
    record: function (d, c) {
      var rows = arr(c.rows).filter(Array.isArray).slice(0, 4).map(function (r) { return [s(r[0], 16), s(r[1], 26), /^(ai|ok)$/.test(r[2]) ? r[2] : '']; });
      var steps = pills(c.steps || c.chips, 3, 26);
      d.layers.push({ type: 'burst', x: -60, y: 470, w: 620, z: 2 }, { type: 'nexi', x: 34, y: 520, w: 440, z: 16, pose: 'point' },
        { type: 'record', x: 486, y: 444, w: 540, rot: 2.5, z: 12, app: mod(c.app, 'accountant'), title: s(c.title, 28) || 'Record', crumb: s(c.crumb, 34), status: s(c.status, 14),
          rows: rows.length ? rows : [['Status', 'Ready', 'ok']], ai: s(c.ai, 40), btn: s(c.btn, 14) || 'Confirm' },
        fx.sparkles(400, 470, 110));
      var icons = ['spark', 'search', 'check'];
      steps.forEach(function (t, i) { d.layers.push({ type: 'chip', x: [548, 606, 560][i], y: [842, 916, 990][i], z: 18, rot: [-1.5, 1.5, -1][i], icon: icons[i], tone: i === 2 ? 'ok' : '', text: t }); });
      if (s(c.bubble)) d.layers.push({ type: 'bubble', x: 60, y: 440, z: 20, rot: -3, text: s(c.bubble, 18) });
    },
    phone: function (d, c) {
      var lines = arr(c.lines).filter(Array.isArray).slice(0, 3).map(function (l) { return [s(l[0], 22), s(l[1], 10), !!l[2]]; });
      var f = arr(c.fields).filter(Array.isArray).slice(0, 1).map(function (x) { return [s(x[0], 18), s(x[1], 28)]; });
      d.layers.push({ type: 'glow', x: 250, y: 470, w: 600, z: 2 },
        { type: 'phone', x: 382, y: 452, w: 336, rot: -5, z: 12, screen: 'odoo', app: mod(c.app, 'sale'), title: s(c.title, 24), crumb: s(c.crumb, 28), banner: s(c.banner, 60) || undefined,
          fields: f.length ? f : undefined, lines: lines.length ? lines : undefined, btn: s(c.btn, 16) || 'Confirm' });
      leftPills(pills(c.pills, 3, 20), [548, 706, 862]).forEach(function (p) { d.layers.push(p); });
      if (s(c.chip)) d.layers.push({ type: 'chip', x: 700, y: 820, rot: 3, z: 18, icon: 'check', tone: 'ok', text: s(c.chip, 24) });
      d.layers.push(fx.sparkles(930, 760, 110), fx.sphere(968, 626, 58));
    },
    chart: function (d, c, ctx) {
      d.layers.push({ type: 'chart', x: 90, y: 436, w: 900, z: 12, from: 'industry:' + ctx.industry },
        { type: 'nexi', x: 826, y: 790, w: 210, z: 16, pose: 'celebrate', glow: false });
      pills(c.pills, 2, 22).forEach(function (t, i) { d.layers.push({ type: 'pill', x: [70, 400][i], y: [922, 950][i], rot: [-4, 2][i], z: 18, text: t }); });
    },
    checklist: function (d, c, ctx) {
      var items = pills(c.items, 4, 80);
      d.layers.push({ type: 'checklist', x: 80, y: 440, w: 640, z: 12, title: s(c.title, 36) || 'What changes', tag: s(c.tag, 20) || (ctx.cat === 'odoo20' ? 'New in Odoo 20' : ''),
        items: items.length ? items : undefined, from: ctx.industry ? 'industry:' + ctx.industry : undefined, apps: arr(c.apps).map(function (a) { return mod(a, ''); }).filter(Boolean).slice(0, 4), app: mod(arr(c.apps)[0], undefined) },
        { type: 'burst', x: 560, y: 460, w: 560, z: 2 }, { type: 'nexi', x: 700, y: 560, w: 340, z: 16, pose: 'present' }, fx.sparkles(930, 470, 100));
    },
    phases: function (d, c, ctx) {
      d.layers.push({ type: 'phases', x: 70, y: 446, w: 940, z: 12, from: 'industry:' + ctx.industry },
        { type: 'pill', x: 80, y: 900, rot: -4, z: 18, text: s(c.pill, 22) || pills(c.pills, 1, 22)[0] || 'Live in phases' }, fx.sphere(980, 380, 50), fx.sparkles(900, 880, 110));
    },
    appflow: function (d, c) {
      var app = C.appFlows && C.appFlows[mod(c.app, '')] ? mod(c.app, '') : 'sale', hot = +c.hot;
      d.layers.push({ type: 'appflow', x: 70, y: 460, w: 940, z: 12, app: app, hot: hot >= 0 && hot <= 4 ? hot : undefined },
        { type: 'nexi', x: 60, y: 808, w: 220, z: 16, pose: 'wave', glow: false });
      pills(c.pills, 2, 22).forEach(function (t, i) { d.layers.push({ type: 'pill', x: [330, 640][i], y: [900, 930][i], rot: [-3, 3][i], z: 18, text: t }); });
    },
    orbit: function (d, c) {
      var apps = arr(c.apps).map(function (a) { return mod(a, ''); }).filter(Boolean).slice(0, 10);
      d.layers.push({ type: 'orbit', x: 290, y: 424, w: 500, z: 12, apps: apps.length >= 5 ? apps : undefined, label: s(c.label, 18) || 'One database' }, fx.sparkles(820, 440, 110));
      pills(c.pills, 2, 22).forEach(function (t, i) { d.layers.push({ type: 'pill', x: [20, 790][i], y: [470, 884][i], rot: [-5, 4][i], z: 18, text: t }); });
    },
    reaction: function (d, c) {
      var pose = POSES.indexOf(c.pose) > -1 ? c.pose : 'surprise';
      d.layers.push({ type: 'burst', x: 250, y: 400, w: 600, z: 2, variant: 'yellow' }, { type: 'nexi', x: 330, y: 452, w: 440, z: 16, pose: pose }, { type: 'confetti', x: 140, y: 420, w: 800, z: 20, op: .7 });
      pills(c.pills, 3, 20).forEach(function (t, i) { d.layers.push({ type: 'pill', x: [50, 700, 80][i], y: [560, 700, 880][i], rot: [-5, 4, -2][i], z: 18, text: t }); });
    },
    website: function (d, c) {
      var site = (C.sites || {})[c.site] ? c.site : 'technext';
      d.layers.push({ type: 'devices', x: 60, y: 444, w: 720, z: 12, site: site }, { type: 'cursor', x: 360, y: 700, w: 64, z: 19 });
      pills(c.chips, 3, 26).forEach(function (t, i) { d.layers.push({ type: 'chip', x: [770, 790, 762][i], y: [520, 616, 712][i], rot: [2, -1.5, 1.5][i], z: 18, icon: 'check', tone: 'ok', text: t }); });
      d.layers.push(fx.sparkles(940, 430, 100), fx.sphere(990, 880, 50));
    },
    webdesign: function (d, c) {
      d.layers.push({ type: 'site', x: 70, y: 450, w: 640, rot: -2, z: 12, brand: s(c.brand, 18) || 'Your Brand', head: s(c.sitehead, 44) || 'A website that *works as hard as you do.*' },
        { type: 'code', x: 612, y: 560, w: 420, rot: 3, z: 14 }, { type: 'gauge', x: 830, y: 820, w: 190, z: 16, label: s(c.gauge, 14) || 'Mobile-first' },
        { type: 'cursor', x: 300, y: 700, w: 64, z: 19 }, { type: 'pill', x: 80, y: 930, rot: -3, z: 18, text: s(c.pill, 20) || 'Built to convert' });
    },
    seo: function (d, c) {
      d.layers.push({ type: 'serp', x: 110, y: 462, w: 860, z: 12, query: s(c.query, 44), title: s(c.title, 64), desc: s(c.desc, 160) },
        { type: 'nexi', x: 790, y: 700, w: 250, z: 16, pose: 'point', glow: false }, fx.sparkles(912, 404, 100));
      pills(c.chips, 2, 26).forEach(function (t, i) { d.layers.push({ type: 'chip', x: [130, 180][i], y: [800, 890][i], rot: [-1.5, 1.5][i], z: 18, icon: i ? 'search' : 'check', tone: i ? '' : 'ok', text: t }); });
    }
  };

  function build(c, ctx) {
    var r = BUILD[c.recipe] ? c.recipe : 'reaction';
    if (RECIPES[r].needs === 'industry' && !ctx.industry) r = 'reaction';
    var d = base(c, ctx); d.recipe = r;
    BUILD[r](d, c, ctx);
    return d;
  }
  function forCat(cat, industry) { return FOR_CAT[cat] || (industry ? FOR_CAT.industry : FOR_CAT.apps); }

  window.TNRecipes = { RECIPES: RECIPES, forCat: forCat, build: build, POSES: POSES };
})();
