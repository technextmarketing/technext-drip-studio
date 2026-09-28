/* TechNext Drip Studio — content generation with Claude (v3).
   Claude acts as copywriter and art director: for every post it writes the headline, subline and
   caption, then designs the visual as a SCENE: which Odoo screens appear, the demo data inside them
   (tied to the headline), the hand-offs between them, the callouts and the look (headline placement,
   camera angle, background, palette). compose.js lays the scene out. The prompt carries only
   technext.asia content, so Claude has nothing else to draw facts from. */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {};

  var ANGLES = [
    ['pain', 'A pain point the business feels today'],
    ['workflow', 'How the work flows between Odoo apps'],
    ['beforeafter', 'The old way vs Odoo'],
    ['feature', 'One Odoo app feature up close'],
    ['odoo20', 'What is new in Odoo 20'],
    ['ai', 'Where AI helps inside Odoo'],
    ['hook', 'A question hook with an exaggerated reaction'],
    ['proof', 'How TechNext rolls it out (phases, training, support)'],
    ['web', 'Websites and being found online']
  ];
  var TIERS = [['default', 'Balanced'], ['quick', 'Fast'], ['complex', 'Best']];

  function trim(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t; }
  function svc(key, n) { var v = (C.services || {})[key]; return v ? '- ' + v.title + ': ' + trim(v.para || v.desc, n || 380) : ''; }
  function appName(m) { return (C.apps && C.apps[m] && C.apps[m].name) || m; }

  function industryBlock(k) {
    var i = (C.industries || {})[k]; if (!i) return '';
    var out = ['INDUSTRY: ' + i.name + ' (' + i.noun + ')', 'Intro: ' + trim(i.intro, 420), 'WORKFLOW (from the website):'];
    (i.flow || []).forEach(function (f, n) { out.push('  ' + (n + 1) + '. ' + f.t + ' — ' + f.h + ' [' + (f.app || 'odoo') + ']: ' + trim(f.p, 150) + ' Before Odoo: ' + f.was); });
    out.push('BEFORE/AFTER [topic | old way | with Odoo]:'); (i.ba || []).forEach(function (r) { out.push('  ' + r.join(' | ')); });
    if (i.new20 && i.new20.length) { out.push('NEW IN ODOO 20 for ' + i.name + ':'); i.new20.forEach(function (t) { out.push('  - ' + t); }); }
    if (i.phases) { out.push('ROLLOUT PHASES:'); i.phases.forEach(function (p, n) { out.push('  ' + (n + 1) + '. ' + p.h + ' [' + p.apps.join(',') + ']: ' + p.items.join('; ')); }); }
    if (i.chart) out.push('DASHBOARD on the website (demo data): ' + i.chart.title + '; KPIs ' + i.chart.kpis.map(function (x) { return x.join(' '); }).join(', ') + '; bars ' + i.chart.views[0].bars.map(function (b) { return b.join(' '); }).join(', '));
    if (i.integrations) out.push('INTEGRATIONS: ' + i.integrations.map(function (x) { return x[1]; }).join('; '));
    return out.join('\n');
  }
  function odoo20Block() {
    var out = ['ODOO 20 (from the technext.asia Odoo 20 article):'];
    (C.odoo20 || []).forEach(function (a) { (a[2] || []).forEach(function (c) { if (c[0] !== 's') out.push('  [' + a[1] + '] ' + c[1] + ': ' + c[2]); }); });
    out.push('  Every AI feature in Odoo 20 uses paid IAP credits. Field Service is folded into Planning.');
    return out.join('\n');
  }
  function appsBlock(focusOnly) {
    var out = ['ODOO APPS (module: name — what it does; * = TechNext focus app):'];
    Object.keys(C.apps || {}).forEach(function (m) { var a = C.apps[m]; if (!focusOnly || a.focus || /stock|sale|crm|account|purchase|point_of_sale|mrp|planning|project|helpdesk|website/.test(m)) out.push('  ' + m + ': ' + a.name + (a.focus ? '*' : '') + ' — ' + a.desc); });
    out.push('  also: pos_restaurant (restaurant POS + kitchen display), ai_app (Odoo AI), industry_fsm (Field Service), appointment, whatsapp, mail (Discuss)');
    return out.join('\n');
  }
  function flowsBlock(limit) {
    var out = ['APP RECORD FLOWS (module: record — states > ...; hand-offs):'];
    Object.keys(C.appFlows || {}).slice(0, limit || 50).forEach(function (m) { var f = C.appFlows[m]; out.push('  ' + m + ': ' + f.record + ' — ' + f.states.map(function (x) { return x[1]; }).join(' > ') + (f.handoffs && f.handoffs.length ? '; hands off to ' + f.handoffs.map(function (h) { return h[1] + ' (' + h[2] + ')'; }).join(', ') : '')); });
    return out.join('\n');
  }
  function sitesBlock() {
    var out = ['WEBSITES TECHNEXT BUILT (use with the devices component):'];
    Object.keys(C.sites || {}).forEach(function (k) { out.push('  ' + k + ': ' + C.sites[k].name + ' — ' + C.sites[k].what); });
    return out.join('\n');
  }
  function sourceFor(cat, industry) {
    var b = [];
    if (industry) b.push(industryBlock(industry));
    if (cat === 'odoo20') b.push(odoo20Block());
    if (cat === 'ai') b.push('AI SERVICES:', svc('solutions/ai'), svc('odoo/ai-integration'), svc('solutions/ai-automation'), svc('solutions/ai-chatbots'), svc('solutions/ai-knowledge'), odoo20Block());
    if (cat === 'services') b.push('MARKETING SERVICES (a separate TechNext service, never part of Odoo):', svc('solutions/website', 560), svc('solutions/social-media'), svc('solutions/marketing'), svc('solutions/brand-assets'), sitesBlock());
    if (cat === 'field-service') b.push('FIELD SERVICE: technicians, worksheets, parts and signatures on site. In Odoo 20 the Field Service app is folded into Planning (live map, routing, travel fees, worksheets).', odoo20Block());
    if (cat !== 'services') b.push('TECHNEXT ODOO SERVICES:', svc('solutions/odoo-erp'), svc('odoo/integration', 240), svc('odoo/support', 220));
    if (cat !== 'services') b.push(flowsBlock(cat === 'apps' ? 50 : 22), appsBlock(cat !== 'apps'));
    return b.filter(Boolean).join('\n\n');
  }

  var CATALOG = [
    'COMPONENTS (hero = the main visual, support = 0-3 smaller cards around it). Types and their fields:',
    '- window: an Odoo app window, drawn like the real Odoo 17-20 web client. {"type":"window","app":module,"view":VIEW,"crumbs":["Menu","Record"],"menus":[3 top menus]} + the VIEW fields:',
    '    form: "status":[2-4 stages],"statusAt":index,"buttons":[1-3],"record":"S00042","fields":[[label,value] x4-6],"highlight":[labels to glow],"ai":true to add AI sparkles on highlighted fields,"lines":[[product,qty,price,subtotal] x2-4],"cols":[4 headers],"total":"S$ …","ribbon":"PAID" (optional),"chatter":"one note under the form (e.g. what Odoo AI did)"',
    '    list: "cols":[4-5],"rows":[[…] x4-6] (last column is a status badge: Draft, Sent, Posted, Paid, Late, Done…),"highlight":rowIndex,"sum":"Total S$ …"',
    '    kanban: "stages":[[name,[[title,subtitle,amount,initials] x1-3]] x3-4],"highlight":["stage.card" e.g. "2.0"]',
    '    dashboard: "kpis":[[label,value,delta] x3],"chart":{"kind":"bar|line|area|donut|funnel|progress","title","data":[[label,number] x4-7],"highlight":index,"unit":"%"}',
    '    planning: "days":[5 labels],"rows":[[person,[[startIndex,lengthDays,label] x1-3]] x3-5]',
    '    pos: "table","products":[[name,price] x6],"order":[[item,qty,unit,subtotal] x2-4],"total","btn"',
    '    kds: "tickets":[[table,[[item,qty] x2-3],"cooking|ready|late",minutes] x2-3]',
    '    apps: "apps":[8-12 modules],"highlight":[modules] (the Odoo home screen)',
    '    discuss: "channels":[3],"msgs":[[who,text,attachment] x2-4] (who = "Odoo AI" for the agent)',
    '- ophone: the same views on a phone (on site, offline, mobile, on the go). Same fields as window.',
    '- graph: {"kind","title","data","highlight","unit","note","tag"}   - kpis: {"items":[[label,value,delta,module] x2-4]}',
    '- timeline: {"title","items":[[time,event,module,detail] x3-5],"hot":index}   - steps: {"dir":"h|v","items":[[module,step,detail] x3-5],"hot":index}',
    '- chat: {"channel":"whatsapp|web|odoo","title","msgs":[["in|out|bot",text] x2-4]}   - receipt: {"vendor","doc","lines":[[item,amount] x2-4],"total","stamp":"PAID|SCANNED"}',
    '- notif: {"app":module,"title","text","time"}   - route: {"stops":[[place,time] x3-5],"hot":index}   - stat: {"value","label"} (only neutral values or the approved figures)',
    '- checklist: {"title","tag","items":[3-4 lines],"apps":[modules]}   - ba: {"rows":[[topic,old way,with Odoo] x3]} from BEFORE/AFTER   - phases: {"from":"industry:<key>"}',
    '- appflow: {"app":module from APP RECORD FLOWS}   - orbit: {"apps":[6-10 modules],"label"}   - devices: {"site": a key from WEBSITES}   - serp: {"query","title","desc"}   - code: {"file","lines":[4-6 short HTML lines]}',
    'LINKS (workflow arrows between components): [{"from":"hero|s0|s1|s2","to":"…","label":"what is handed over, max 26 chars"}]',
    'ACCENTS (flat callouts, 0-3): {"type":"nexi","pose":"wave|point|present|celebrate|cheer|surprise|love|think|clap"} (Nexi is the TechNext robot), {"type":"pill","text":"max 22 chars"} (handwritten), {"type":"chip","text","small","icon":"check|spark|search|sync"}, {"type":"note","text","strike":true for the old way}',
    'LOOK: {"camera":"front|tilt-l|tilt-r|iso-l|iso-r|top|low|dutch" (3D angle of the screens),"bg":"aurora|grid|floor|rays|dots|mesh|rings|navy","palette":"blue|sky|mint|violet|sunrise|slate"}. The frame is fixed for every post (TechNext logo top left, Odoo badge top right, headline and subline centred on top); only the picture under the subline changes.'
  ].join('\n');

  var EXAMPLE = JSON.stringify({ name: 'AI vendor bill', angle: 'ai', head: 'The bill reads itself.|*You just approve.*', sub: 'AI inside Odoo reads the supplier PDF, fills the vendor bill and matches the purchase order.',
    caption: 'Supplier bills still typed by hand? With AI inside Odoo, the PDF fills the bill and the purchase order is matched. Finance only approves. Book a call at technext.asia.', hashtags: ['#Odoo', '#AI', '#Accounting'],
    look: { camera: 'iso-l', bg: 'rays', palette: 'sky' },
    hero: { type: 'window', app: 'accountant', view: 'form', crumbs: ['Vendor Bills', 'BILL/2026/0311'], status: ['Draft', 'Posted'], statusAt: 0, buttons: ['Confirm'], record: 'Draft Bill', fields: [['Vendor', 'Sample Seafood Pte Ltd'], ['Bill date', '24 Sep 2026'], ['Purchase order', 'P00088']], highlight: ['Vendor', 'Bill date', 'Purchase order'], ai: true, lines: [['Prawns 2 kg', '6', 'S$ 32.00', 'S$ 192.00']], total: 'S$ 209.28', chatter: 'Odoo AI filled 3 fields from the PDF and matched P00088.' },
    support: [{ type: 'receipt', vendor: 'Sample Seafood Pte Ltd', doc: 'TAX INVOICE', lines: [['Prawns 2 kg x6', '192.00'], ['GST 9%', '17.28']], total: 'S$ 209.28', stamp: 'SCANNED' }],
    links: [{ from: 's0', to: 'hero', label: 'AI reads the PDF' }], accents: [{ type: 'nexi', pose: 'point' }] });

  function buildPrompt(o) {
    var angles = ANGLES.filter(function (a) { return o.angles.indexOf(a[0]) > -1; });
    var who = o.industry ? C.industries[o.industry].name + ' businesses in Singapore and Southeast Asia' : 'small and mid-sized companies in Singapore and Southeast Asia';
    return [
      'You are the copywriter AND art director for TechNext (technext.asia), an Odoo Partner headquartered in Singapore that implements Odoo, builds AI inside Odoo, and separately designs websites and runs social media.',
      'Design ' + o.count + ' social media posts ("drips", 1080x1080) for ' + who + ', for the "' + o.catName + '" series.' + (o.brief ? ' Brief from the marketing team: ' + trim(o.brief, 600) : ''),
      '',
      'HOW TO DESIGN EACH POST',
      '1. Pick one concrete moment from SOURCE and write the headline about it.',
      '2. Design the picture from the headline: the hero is the exact Odoo screen where that moment happens, filled with sample data that shows it (the highlighted field, the stage the record just reached, the bar that matters). Supports show the step before or after, or the result. Links name what is handed from one app to the next. A reader must understand the headline from the picture alone.',
      '3. Show Odoo from the inside (forms, lists, kanban, dashboards, POS, planning, phones) whenever the post is about Odoo. Use charts only when the story is about numbers.',
      '4. Choose a look that suits the story (a calm grid for finance, floor for operations, navy for a bold hook...).',
      '',
      'EVERY POST MUST BE DIFFERENT',
      '- Each post uses a different hero (a different type or view, and a different app where possible) and a different set of supports.',
      '- No two posts share the same camera angle or the same bg+palette. Vary the number of supports (0-3) and accents.',
      '- Each post takes a different angle, from: ' + angles.map(function (a) { return a[1]; }).join('; ') + '.',
      '- No two headlines start with the same word.' + ((o.existing || []).length ? ' Do not repeat these existing headlines: ' + o.existing.slice(0, 25).join(' / ') : ''),
      '',
      'RULES',
      '- Facts only from SOURCE. Never invent client names, results, awards, prices or dates as claims. Company figures allowed: 10+ countries, 11+ enterprise clients, 4 AI disciplines.',
      '- Inside screens use sample data only: generic names ("Sample Trading Pte Ltd", "Mei Ling T."), realistic S$ amounts, dates in Sep-Oct 2026. KPI numbers are demo data.',
      '- Say "Odoo Partner", never "Certified". Never say websites or social media are part of Odoo. Odoo 20 claims only from the Odoo 20 list; AI features use paid credits.',
      '- head: max 9 words, two parts split by | ; wrap 1-3 key words of the second part in *asterisks* (blue); optionally one ~word~ (yellow underline). sub: one sentence, max 22 words.',
      '- caption: 2-4 short sentences for LinkedIn/Facebook, ending with a question or "Book a call at technext.asia". hashtags: 3-5.',
      '- Voice: plain and specific. No hype words (revolutionary, seamless, unlock, leverage, game-changer), no emoji.',
      '',
      CATALOG,
      '',
      'OUTPUT: only a JSON array of ' + o.count + ' post objects, no other text. Shape of one post (a complete example):',
      EXAMPLE,
      'Module names must be keys from the ODOO APPS or APP RECORD FLOWS lists.',
      '',
      'SOURCE',
      sourceFor(o.cat, o.industry)
    ].join('\n');
  }

  function tokens(text) { return Math.ceil(String(text || '').length / 4); }
  var OUT_PER_POST = 520;
  function estimate(o) { var p = buildPrompt(o); return { prompt: p, input: tokens(p), output: o.count * OUT_PER_POST }; }

  var SAMPLE = null;
  function available() {
    if (!window.claude || !window.claude.use) return Promise.resolve(null);
    return SAMPLE || (SAMPLE = window.claude.use('sample').catch(function () { return null; }));
  }
  function generate(o, onProgress, signal) {
    var t0 = Date.now(), prompt = buildPrompt(o), seen = 0;
    return available().then(function (sample) {
      if (!sample) throw { code: 'unavailable', message: 'Claude is not available in this view' };
      return sample.json(prompt, {
        modelTier: o.tier || 'default', cache: false, signal: signal,
        onText: function (u) { var n = (u.text.match(/"hero"\s*:/g) || []).length; if (n !== seen) { seen = n; onProgress && onProgress(n, u.text); } }
      }).then(function (data) {
        var list = Array.isArray(data) ? data : data && Array.isArray(data.posts) ? data.posts : [];
        return { concepts: list.filter(function (x) { return x && typeof x === 'object' && x.head; }), input: tokens(prompt), output: tokens(JSON.stringify(data)), ms: Date.now() - t0, tier: o.tier || 'default' };
      });
    });
  }

  window.TNAI = { ANGLES: ANGLES, TIERS: TIERS, buildPrompt: buildPrompt, estimate: estimate, tokens: tokens, generate: generate, available: available, OUT_PER_POST: OUT_PER_POST };
})();
