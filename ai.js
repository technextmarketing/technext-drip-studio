/* TechNext Drip Studio — content generation with Claude.
   Claude writes the content (angle, headline, subline, caption, the facts each layout shows);
   recipes.js turns every answer into a finished drip. The prompt carries only technext.asia content,
   so Claude has nothing else to draw facts from. In the claude.ai hub the call runs on the viewer's
   own Claude account through the `sample` capability; elsewhere the feature is hidden. */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {}, RC = window.TNRecipes;

  var ANGLES = [
    ['pain', 'A pain point the business feels today'],
    ['workflow', 'How the work flows in Odoo, step by step'],
    ['beforeafter', 'The old way vs Odoo'],
    ['feature', 'One Odoo app feature up close'],
    ['odoo20', 'What is new in Odoo 20'],
    ['ai', 'Where AI helps inside Odoo'],
    ['hook', 'A question hook with an exaggerated Nexi reaction'],
    ['proof', 'How TechNext rolls it out (phases, training, support)'],
    ['web', 'Websites and being found online']
  ];
  var TIERS = [['default', 'Balanced'], ['quick', 'Fast'], ['complex', 'Best']];

  function trim(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t; }
  function svc(key, n) { var v = (C.services || {})[key]; return v ? '- ' + v.title + ': ' + trim(v.para || v.desc, n || 420) : ''; }
  function appName(m) { return (C.apps && C.apps[m] && C.apps[m].name) || m; }

  function industryBlock(k) {
    var i = (C.industries || {})[k]; if (!i) return '';
    var out = ['INDUSTRY: ' + i.name + ' (' + i.noun + ')', 'Intro: ' + trim(i.intro, 500), 'Workflow title: ' + i.flow_title, 'WORKFLOW (6 steps, index 0-5):'];
    (i.flow || []).forEach(function (f, n) { out.push('  ' + n + '. ' + f.t + ' — ' + f.h + ' (' + (f.app ? appName(f.app) + ' app' : 'Odoo') + '): ' + trim(f.p, 170) + ' Before Odoo: ' + f.was); });
    out.push('BEFORE/AFTER [topic | old way | with Odoo]:');
    (i.ba || []).forEach(function (r) { out.push('  ' + r.join(' | ')); });
    if (i.new20 && i.new20.length) { out.push('NEW IN ODOO 20 for ' + i.name + ':'); i.new20.forEach(function (t) { out.push('  - ' + t); }); }
    if (i.phases) { out.push('ROLLOUT PHASES:'); i.phases.forEach(function (p, n) { out.push('  Phase ' + (n + 1) + ': ' + p.h + ' — ' + p.items.join('; ')); }); }
    if (i.chart) out.push('DASHBOARD (sample data on the website): ' + i.chart.title + '; KPIs: ' + i.chart.kpis.map(function (x) { return x.join(' '); }).join(', '));
    if (i.integrations) out.push('INTEGRATIONS: ' + i.integrations.map(function (x) { return x[1]; }).join('; '));
    return out.join('\n');
  }
  function odoo20Block() {
    var out = ['ODOO 20 (from the technext.asia Odoo 20 article; tag n=new, c=changed, m=moved, r=removed, $=cost):'];
    (C.odoo20 || []).forEach(function (a) { (a[2] || []).forEach(function (c) { out.push('  [' + a[1] + '] (' + c[0] + ') ' + c[1] + ': ' + c[2]); }); });
    out.push('  Note: every AI feature in Odoo 20 uses paid IAP credits. Field Service is folded into Planning.');
    return out.join('\n');
  }
  function appsBlock(focusOnly) {
    var out = ['ODOO APPS (module: name, what it does; * = TechNext focus app):'];
    Object.keys(C.apps || {}).forEach(function (m) { var a = C.apps[m]; if (!focusOnly || a.focus) out.push('  ' + m + ': ' + a.name + (a.focus ? '*' : '') + ' — ' + a.desc); });
    return out.join('\n');
  }
  function flowsBlock() {
    var out = ['APP RECORD FLOWS available for the appflow recipe (module: record — states):'];
    Object.keys(C.appFlows || {}).forEach(function (m) { var f = C.appFlows[m]; out.push('  ' + m + ': ' + f.record + ' — ' + f.states.map(function (x) { return x[1]; }).join(' > ')); });
    return out.join('\n');
  }
  function sitesBlock() {
    var out = ['WEBSITES TECHNEXT BUILT (for the website recipe):'];
    Object.keys(C.sites || {}).forEach(function (k) { out.push('  ' + k + ': ' + C.sites[k].name + ' — ' + C.sites[k].what); });
    return out.join('\n');
  }

  function sourceFor(cat, industry) {
    var b = [];
    if (industry) b.push(industryBlock(industry));
    if (cat === 'odoo20') b.push(odoo20Block());
    if (cat === 'ai') b.push('AI SERVICES:', svc('solutions/ai'), svc('odoo/ai-integration'), svc('solutions/ai-automation'), svc('solutions/ai-chatbots'), svc('solutions/ai-knowledge'),
      'ODOO 20 AI: ' + ((C.odoo20 || [])[0] || [0, 0, []])[2].map(function (c) { return c[1]; }).join('; ') + '. Every AI feature uses paid IAP credits.');
    if (cat === 'services') b.push('MARKETING SERVICES (standalone, not part of Odoo):', svc('solutions/website', 600), svc('solutions/social-media'), svc('solutions/marketing'), svc('solutions/brand-assets'), sitesBlock());
    if (cat === 'field-service') b.push('FIELD SERVICE: technicians, worksheets, parts and customer signatures on site. In Odoo 20 the Field Service app is folded into Planning.', odoo20Block());
    if (cat !== 'services') b.push('TECHNEXT ODOO SERVICES:', svc('solutions/odoo-erp'), svc('odoo/support', 260), svc('odoo/training', 260));
    if (cat === 'apps' || cat === 'field-service' || cat === 'odoo20') b.push(flowsBlock());
    if (cat !== 'services') b.push(appsBlock(cat !== 'apps'));
    return b.filter(Boolean).join('\n\n');
  }

  function buildPrompt(o) {
    var recipes = RC.forCat(o.cat, o.industry).filter(function (r) { return !RC.RECIPES[r].needs || o.industry; });
    var angles = ANGLES.filter(function (a) { return o.angles.indexOf(a[0]) > -1; });
    var who = o.industry ? C.industries[o.industry].name + ' businesses in Singapore and Southeast Asia' : 'small and mid-sized companies in Singapore and Southeast Asia';
    var existing = (o.existing || []).slice(0, 30);
    return [
      'You write social media "drip" posts for TechNext (technext.asia), an Odoo Partner headquartered in Singapore that implements Odoo, builds AI systems inside Odoo, and separately designs websites and runs social media.',
      'Write ' + o.count + ' different posts for ' + who + ', for the "' + o.catName + '" series.' + (o.brief ? ' Brief from the marketing team: ' + trim(o.brief, 600) : ''),
      '',
      'RULES',
      '- Use only facts from SOURCE. Never invent numbers, client names, results, awards, prices or dates. The only company figures allowed: 10+ countries, 11+ enterprise clients, 4 AI disciplines (use rarely).',
      '- Say "Odoo Partner"; never "Certified". Never say websites or social media are part of Odoo.',
      '- Odoo 20 claims only from the Odoo 20 list. Do not promise free AI (AI features use paid credits).',
      '- Voice: plain, specific, confident; short words. No hype words (revolutionary, seamless, unlock, leverage, game-changer), no emoji, no exclamation marks in the headline.',
      '- head: max 9 words, two parts split by | . Wrap 1-3 key words of the second part in *asterisks* (shown in blue). Optionally wrap one word in ~tildes~ (yellow underline).',
      '- sub: one sentence, max 22 words, says what changes for the business.',
      '- caption: 2-4 short sentences for LinkedIn/Facebook that expand the post, ending with a question or a call to book a call at technext.asia. hashtags: 3-5.',
      '- Every post takes a different angle, one each from: ' + angles.map(function (a) { return a[1]; }).join('; ') + '. Repeat an angle only if there are more posts than angles.',
      '- Pick the recipe that best shows each angle, and never use the same recipe twice in a row.',
      existing.length ? '- Do not repeat these existing headlines: ' + existing.join(' / ') : '',
      '',
      'RECIPES (layouts the studio draws; fill only the fields of the recipe you pick)',
      recipes.map(function (r) { return '- ' + r + ': ' + RC.RECIPES[r].about + '. Fields: ' + RC.RECIPES[r].fields; }).join('\n'),
      '',
      'OUTPUT: only a JSON array of ' + o.count + ' objects, no other text. Each object:',
      '{"name":"short library name","angle":"' + angles.map(function (a) { return a[0]; }).join('|') + '","recipe":"' + recipes.join('|') + '","head":"...|*...*","sub":"...","caption":"...","hashtags":["#Odoo"], ...fields of the recipe}',
      'Module names in app/apps fields must be keys from the ODOO APPS or APP RECORD FLOWS lists (for example "sale", "stock", "accountant").',
      '',
      'SOURCE',
      sourceFor(o.cat, o.industry)
    ].filter(function (l) { return l !== ''; }).join('\n');
  }

  function tokens(text) { return Math.ceil(String(text || '').length / 4); }
  var OUT_PER_POST = 330;
  function estimate(o) { var p = buildPrompt(o); return { prompt: p, input: tokens(p), output: o.count * OUT_PER_POST }; }

  var SAMPLE = null;
  function available() {
    if (!window.claude || !window.claude.use) return Promise.resolve(null);
    return SAMPLE || (SAMPLE = window.claude.use('sample').catch(function () { return null; }));
  }

  /* runs one generation; resolves {concepts, input, output, ms, tier} */
  function generate(o, onProgress, signal) {
    var t0 = Date.now(), prompt = buildPrompt(o), seen = 0;
    return available().then(function (sample) {
      if (!sample) throw { code: 'unavailable', message: 'Claude is not available in this view' };
      return sample.json(prompt, {
        modelTier: o.tier || 'default', cache: false, signal: signal,
        onText: function (u) { var n = (u.text.match(/"recipe"\s*:/g) || []).length; if (n !== seen) { seen = n; onProgress && onProgress(n, u.text); } }
      }).then(function (data) {
        var list = Array.isArray(data) ? data : data && Array.isArray(data.posts) ? data.posts : [];
        var raw = JSON.stringify(data);
        return { concepts: list.filter(function (x) { return x && typeof x === 'object' && x.head; }), input: tokens(prompt), output: tokens(raw), ms: Date.now() - t0, tier: o.tier || 'default' };
      });
    });
  }

  window.TNAI = { ANGLES: ANGLES, TIERS: TIERS, buildPrompt: buildPrompt, estimate: estimate, tokens: tokens, generate: generate, available: available, OUT_PER_POST: OUT_PER_POST };
})();
