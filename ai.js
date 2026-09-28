/* TechNext Drip Studio — content generation with Claude (v4, the simple style).
   Claude writes the headline, subline and caption of every post, picks the one visual that shows the
   headline (phone, record + Nexi, chart, Odoo board, chat…) and writes every word inside it. simple.js lays
   it out in the standard frame. The prompt carries only technext.asia content, so Claude has nothing else
   to draw facts from. */
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
    if (cat === 'field-service' && !industry) b.push('FIELD SERVICE: technicians, worksheets, parts and signatures on site. In Odoo 20 the Field Service app is folded into Planning (live map, routing, travel fees, worksheets).', odoo20Block());
    if ((cat === 'field-service' || cat === 'kitchen' || cat === 'it') && industry && cat !== 'odoo20') b.push(odoo20Block());
    if (cat !== 'services') b.push('TECHNEXT ODOO SERVICES:', svc('solutions/odoo-erp'), svc('odoo/integration', 240), svc('odoo/support', 220));
    if (cat !== 'services') b.push(flowsBlock(cat === 'apps' ? 50 : 22), appsBlock(cat !== 'apps'));
    return b.filter(Boolean).join('\n\n');
  }

  var POSE = '"wave|point|present|celebrate|cheer|surprise|love|think|clap"';
  var VSPEC = {
    phone: 'phone: an Odoo screen on a phone (on site, on the go, offline, scanning, ordering at the table). {"app":module,"title":"≤26","crumb":"App · Menu ≤30","banner":"one status line on the screen ≤60 (optional)","field":["label","value"],"lines":[["item ≤24","qty or done/total ≤10",true|false] x3-4],"btn":"≤18","pills":["2-3 handwritten callouts ≤20"],"chip":{"text":"the result ≤24","small":"≤28","icon":"check|spark|sync|cloudOk|bell"}} plus at most ONE of: "offline":true (storm cloud + no-signal badge), "qr":{"title":"≤20","text":"≤30"} (a QR card), "notif":{"app","title":"≤24","text":"≤40","time"}',
    record: 'record: Nexi pointing at one Odoo record, with 3 step chips (AI fills or checks a record; an approval); b = the record tilted with the steps beside it. {"app","title":"≤30","crumb":"App · State","status":"≤14","rows":[["label ≤16","value ≤26","ai" (AI filled it) or "ok" (checked) or ""] x3-4],"note":"≤46","btn":"≤16","steps":["3 steps ≤26"],"bubble":"what Nexi says ≤18","nexi":' + POSE + '}',
    paper: 'paper: a paper or PDF document turned into an Odoo record. {"doc":{"vendor","doc":"TAX INVOICE, DELIVERY ORDER…","lines":[["item ≤22","amount"] x2-4],"total","stamp":"SCANNED|PAID"},"record":{the record fields},"label":"≤22","steps":["2 ≤26"]}',
    checklist: 'checklist: a card of 3-4 points with Nexi presenting it (what is new, what you get); b = a big industry prop instead of Nexi. {"app","title":"≤34","tag":"≤20","items":["3-4 points ≤70"],"apps":[modules],"nexi":' + POSE + ',"pills":["0-1 ≤22"]}',
    versus: 'versus: the old way next to the same job in Odoo; b = the Odoo card overlapping the old one. {"old":{"title":"≤26","tag":"≤16","items":["3 ≤44"]},"new":{"app","title":"≤26","tag":"≤16","items":["3 ≤48"]},"pills":["0-1 ≤22"]}',
    flow: 'flow: 3-6 steps across Odoo apps (one row for 3-4 steps, two rows for 5-6). {"steps":[{"app","t":"one word ≤12","h":"≤44"}],"hot":index,"old":"the habit it replaces ≤22","new":"≤26"}',
    chart: 'chart: a chart card with one big number and the insight (costs, sales, stock, hours); b = the big number beside the chart. {"chart":{"kind":"bar|line|area|donut|funnel|progress","title":"≤30","tag":"≤16","data":[["label ≤12",number] x4-7],"highlight":index,"unit":"% or k or h"},"kpi":["label ≤22","value ≤10","change ≤10"],"chip":{"text","small","icon"},"nexi":' + POSE + ' (optional),"pills":["0-1"]}',
    board: 'board: one Odoo view as a clean card; b = tilted, with the highlighted kanban card popping out. {"view":"kanban|list|planning|kds|pos|dashboard","app","title":"≤30","crumb","tag":"≤18", the view data, "pills":["0-1"],"chip":{…},"nexi":' + POSE + ' (optional)}. kanban: "stages":[["name",[["title ≤22","subtitle ≤22","amount","initials"] x1-2]] x3-4],"highlight":["stage.card", e.g. "2.0"]. list: "cols":[3-4],"rows":[[…] x3-5] (last column a status: Draft, Sent, Paid, Late, Done…),"highlight":row,"sum". planning: "days":[5],"rows":[["person",[[startDay 0-4,days,"label ≤14"] x1-2]] x3-4]. kds: "tickets":[["table",[["item","qty"] x2-3],"cooking|ready|late","minutes"] x2-3]. pos: "table","products":[["name","price"] x6],"order":[["item","qty","unit","subtotal"] x2-3],"total","btn". dashboard: "kpis":[["label","value","change"] x3],"chart":{kind,title,data,highlight,unit}',
    chat: 'chat: a WhatsApp or website chat and what it creates in Odoo. {"chat":{"channel":"whatsapp|web|odoo","title":"≤24","status":"≤28","msgs":[["in" or "out" or "bot","text ≤70"] x2-4]}, then EITHER "record":{the record fields} (what the chat created) OR "nexi":' + POSE + ' with "bubble":"≤18" (a chatbot), "label":"≤22","chip":{…}}',
    alerts: 'alerts: Nexi with 2-3 Odoo notifications (Odoo warns you before something goes wrong). {"alerts":[{"app","title":"≤30","text":"≤48","time":"≤8"}],"nexi":' + POSE + ',"bubble":"≤18"}',
    timeline: 'timeline: one record or one day, step by step with times. {"title":"≤30","items":[["time ≤8","event ≤28",module,"detail ≤34"] x3-5],"hot":index,"chip":{…},"nexi":' + POSE + '}',
    reaction: 'reaction: a big Nexi reaction with 3 handwritten callouts, for a question hook. {"nexi":"surprise|love|celebrate|cheer|think|wave|clap","pills":["3 ≤20"]}',
    orbit: 'orbit: Odoo apps around one database. {"apps":[6-10 modules],"label":"≤16","pills":["2 ≤20"]}',
    appflow: 'appflow: the states of one Odoo record and its hand-offs, from APP RECORD FLOWS. {"app":module,"hot":0-4,"title":"≤40","pills":["2 ≤20"],"nexi":' + POSE + '}',
    phases: 'phases: the website\'s three rollout phases for this industry. {"pills":["1 ≤22"],"nexi":' + POSE + ' (optional)}',
    website: 'website: a TechNext-built website on a laptop and phone. {"site":"technext|movewithease|tre|immaculate","chips":["3 benefits ≤26"]}',
    webdesign: 'webdesign: a website mockup, its code and a score. {"brand":"≤18","sitehead":"≤40 with *blue* words","cta":"≤16","gauge":"≤14","pills":["0-1"]}',
    google: 'google: a Google result for TechNext. {"query":"≤44","title":"≤64","desc":"≤150","chips":["2 ≤26"]}',
    document: 'document: an Odoo document with its status bar (quotation, sales order, invoice, vendor bill, purchase order, delivery, receipt); b = with a notification beside it. {"kind":"quote|order|invoice|bill|po|delivery|receipt","number":"S00118","partner":"≤30","fields":[["label","value"] x0-2],"lines":[["product ≤26","qty","amount"] x2-4],"total","stage":"the current status","ribbon":"PAID (optional)","note":"≤40","steps":["0-2 ≤26"],"notif":{"app","title","text","time"} (b),"nexi":' + POSE + ',"bubble":"≤18"}',
    product: 'product: one product with its stock and price; b = centred. {"item":"product name ≤26","ref":"[CODE] Category","icon":"box|shirt|cup|bag|bowl|bottle|tool|pill|chair|plant","price","stock":[["On hand","6 units"],["Forecast","46 units"]],"level":0-100,"tags":["≤18" x0-3],"badge":"≤16","barcode":{"code","label"} OR "scan":{"title","text"},"ring":{"value","label"},"chip":{…},"pills":["0-1"]}',
    workorder: 'workorder: a manufacturing work order on the shop floor. {"title":"WO/00042 · operation","crumb":"product x qty","status","timer":"01:12:40","timerLabel","steps":[["step","done|now|todo","time or place"] x3-4],"progress":0-100,"progressLabel","btn","chip":{…},"nexi":' + POSE + ' (optional)}',
    ticket: 'ticket: a helpdesk ticket with the customer\'s message and the rating. {"title":"#1042 · subject ≤30","crumb":"customer · channel","stage","priority":0-3,"sla":"2h left","channel","text":"≤90","assignee","tags":["≤12" x0-2],"chat":{"channel","title","msgs":[["in|out","text"] x2]},"rating":{"stars":1-5,"text":"≤80","who","meta"}}',
    calendar: 'calendar: a week of bookings, appointments or visits; b = with Nexi. {"app":"appointment|planning","title","crumb","tag","days":["Mon 5" x5],"from":9,"to":16,"today":index,"events":[[dayIndex,startHour (9.5 = 9:30),hours,"label ≤16",highlight] x4-7],"notif":{…},"pills":["0-1"],"nexi","bubble","chip"}',
    people: 'people: an employee record with leave, payslips or shifts. {"person":"Aisha R.","job","dept","rows":[["label","value","status"] x2-4],"team":{"names":[…],"more":"+6","label"},"steps":["0-2 ≤26"],"toggle":{"text","on"},"pills":["0-1"]}',
    campaign: 'campaign: an Odoo Email Marketing campaign and its results (Odoo posts only). {"subject":"≤44","from":"From: Sample Store","headline":"≤40 with one *word*","cta","stats":[["42%","opened"] x3],"ring":{"value","label"},"chip":{…},"pills":["0-1"]}',
    store: 'store: a product page in the Odoo online shop and the order it brings. {"brand","url","product","category","icon":"shirt|bag|cup|bottle|box|…","price","rating":1-5,"reviews","stock":"≤24","options":["S","M",…],"cart":"2","btn","notif":{…},"pills":["0-1"]}',
    reconcile: 'reconcile: a bank line matched to its invoice. {"title","crumb","status":"Reconciled","bank":["date · method","payer","amount"],"match":["INV/…","customer","amount"],"label":"why it matched ≤34","btn","note","steps":["0-2"],"nexi","bubble"}',
    approval: 'approval: a request waiting for approval, with the approvers. {"title","crumb","status":"To approve","fields":[["label","value"] x2-3],"approvers":[["name","Approved|Waiting"] x2],"btns":["Approve","Refuse"],"steps":["0-2"],"nexi","bubble"}',
    spreadsheet: 'spreadsheet: an Odoo spreadsheet with live numbers and a small chart. {"title","tag","formula":"=ODOO.PIVOT(…)","cols":[4],"rows":[[4 cells] x3-5],"highlight":[row,col],"totalRow":true,"chart":{"kind","title","data","highlight","unit"},"pills":["0-1"]}',
    documents: 'documents: files in Odoo Documents, sorted and tagged. {"title","crumb","tag","files":[["name ≤22","pdf|xls|doc|img","tag ≤12",highlight] x6],"nexi","bubble","chip"}',
    fan: 'fan: three Odoo documents in a row, one record handed on to the next. {"docs":[{"kind","number","partner","total","ribbon"} x3],"pills":["0-2"]}',
    bignumber: 'bignumber: one big number from Odoo with its chart (demo data, never a claimed result). {"stat":{"value":"≤8 chars","label":"≤34"},"chart":{"kind":"line|bar","title","data","unit"},"chip":{…},"pills":["0-1"]}',
    spotlight: 'spotlight: one big illustration from PROPS with 2-3 callouts, like a poster; good with a "kicker". {"prop":"a PROPS name","pills":["2-3 ≤20"],"chip":{…},"nexi":' + POSE + ' (optional)}',
    pyramid: 'pyramid: 3-5 stages that build on each other, the foundation at the bottom. {"levels":[["title ≤14","sub ≤24"] top to bottom],"hot":index,"note":"≤80","pills":["0-2"]}',
    groups: 'groups: how the business runs on one system: 2-3 groups of Odoo apps on one base. {"groups":[{"title":"≤20","apps":[[module,"label ≤16"] x2-6]}],"base":"≤30","pills":["0-1"]}',
    scan: 'scan: a handheld scanner reading a barcode into Odoo. {"scan":{"title","text":"≤22"},"product":{"item" and the other product fields} OR "doc":{the document fields},"chip":{…},"pills":["0-1"]}',
    proof: 'proof: the three approved company figures (10+ countries, 11+ enterprise clients, 4 AI disciplines) as big numbers. {"pills":["0-2 ≤20"],"nexi":' + POSE + '}'
  };
  var KNOBS = [
    'DESIGN KNOBS (optional, per post), so every post looks like its own poster; the layout engine places everything cleanly:',
    '- "arrangement": "a" or "b" (visuals marked "b =" have a second arrangement).',
    '- "background": dots | grid | fine | diagonal | rings | plus | hex | waves | spots | floor | none: a light pattern under the visual. Every post in a set gets a different one.',
    '- "tint": sky | mint | lilac | sand: a light colour wash, for at most one post in three.',
    '- "kicker": a short blue bar above the headline, max 26 chars (for example "Reasons your customer" or "New in Odoo 20").',
    '- "props": 1-2 illustrations from PROPS, placed around the visual. Use them to show the industry.',
    '- "accents": up to 2 of {"type":"sticker","text":"≤12","small":"≤18","tone":"yellow|blue|white"}, {"type":"stamp","text":"PAID|APPROVED|SIGNED|MATCHED…","tone":"green|blue|red"} (lands on the main card), {"type":"sticky","text":"≤36"}, {"type":"avatars","names":[…],"label"}, {"type":"toggle","text","on"}, {"type":"timer","time","label"}, {"type":"ring","value":0-100,"label"}, {"type":"search","query","filters":[…]}, {"type":"pin","label"}, {"type":"barcode","code","label"}, {"type":"button","text"}, {"type":"scribble","kind":"circle|underline|arrow|check"}.'
  ].join('\n');
  function propsLine(o) {
    var P = window.TNProps; if (!P) return '';
    var ind = o.industry && P.BY_IND[o.industry], name = o.industry && C.industries[o.industry] ? C.industries[o.industry].name : '';
    return 'PROPS' + (ind ? ' for ' + name + ': ' + ind.join(', ') + '; for any post' : '') + ': ' + P.ANY.join(', ') + (ind ? '' : ', ' + Object.keys(P.BY_IND).map(function (k) { return P.BY_IND[k].slice(0, 2).join(', '); }).join(', ')) + '.';
  }
  /* an industry named in the brief ("kitchen", "clinic", "CCTV"…) brings its workflow and its props */
  var IND_WORDS = [
    ['kitchen', /\b(commercial kitchens?|kitchen (?:equipment|design|companies|company|business|solutions?|contractors?|projects?)|head chefs?|stainless steel|combi ovens?|exhaust hoods?)\b/i],
    ['fnb', /\b(restaurants?|caf[eé]s?|f&b|food and beverage|food & beverage|hawkers?|bakery|bakeries|dining|eatery|eateries)\b/i],
    ['kitchen', /\bkitchens?\b(?!\s+display)/i],
    ['ecommerce', /\b(e-?commerce|online (?:store|shop)s?|shopee|lazada|shopify|marketplaces?)\b/i],
    ['retail', /\b(retail|retailers?|boutiques?|fashion stores?|shops?)\b/i],
    ['manufacturing', /\b(manufactur\w*|factor(?:y|ies)|production lines?|fabricat\w*)\b/i],
    ['construction', /\b(construction|contractors?|renovation|builders?|site works?)\b/i],
    ['medical', /\b(clinics?|medical|dental|dentists?|hospitals?|patients?|healthcare)\b/i],
    ['travel', /\b(travel|tours?|hotels?|travel agenc\w*|flights?|tourism)\b/i],
    ['health-wellness', /\b(wellness|spas?|gyms?|yoga|massage|fitness|salons?|beauty)\b/i],
    ['field-service', /\b(field service|technicians?|aircon|servicing|maintenance visits?)\b/i],
    ['it', /\b(IT services?|IT support|IT companies|cctv|networking|servers?|voip|cyber\w*|system integrators?|managed services?)\b/i]
  ];
  function detectIndustry(text) { text = String(text || ''); for (var i = 0; i < IND_WORDS.length; i++) if (C.industries && C.industries[IND_WORDS[i][0]] && IND_WORDS[i][1].test(text)) return IND_WORDS[i][0]; return null; }
  function visualsFor(o) { return (window.TNSimple ? window.TNSimple.forCat(o.cat, o.industry) : Object.keys(VSPEC)).filter(function (v) { return VSPEC[v]; }); }

  var EXAMPLE = JSON.stringify({ name: 'AI vendor bill', angle: 'ai', head: 'AI prepares the bill.|*You approve it.*', sub: 'TechNext builds AI inside your Odoo. It reads the vendor bill, matches the purchase order and waits for your OK.',
    caption: 'Supplier bills still typed by hand? With AI inside Odoo, the bill is read, filled and matched to the purchase order. Finance only approves. Book a call at technext.asia.', hashtags: ['#Odoo', '#AI', '#Accounting'],
    visual: 'record', app: 'accountant', title: 'Vendor bill', crumb: 'Accounting · Draft', status: 'Draft', rows: [['Vendor', 'Harbourline Supplies', 'ai'], ['Bill date', '12 Sep 2026', 'ai'], ['Total', 'S$ 1,284.00', 'ai'], ['PO match', 'PO00123', 'ok']],
    note: 'Prepared by AI · a person approves', btn: 'Approve', steps: ['AI read the bill', 'Matched to PO00123', 'Approved by Finance'], bubble: 'PO matched!', nexi: 'point',
    background: 'hex', props: ['invoice'], accents: [{ type: 'stamp', text: 'MATCHED', tone: 'blue' }] });

  function buildPrompt(o) {
    var angles = ANGLES.filter(function (a) { return o.angles.indexOf(a[0]) > -1; }), vis = visualsFor(o);
    var who = o.industry ? C.industries[o.industry].name + ' businesses in Singapore and Southeast Asia' : 'small and mid-sized companies in Singapore and Southeast Asia';
    return [
      'You are the copywriter AND designer for TechNext (technext.asia), an Odoo Partner headquartered in Singapore that implements Odoo, builds AI inside Odoo, and separately designs websites and runs social media.',
      'Write ' + o.count + ' social media posts ("drips", 1080x1080) for ' + who + ', for the "' + o.catName + '" series.' + (o.brief ? ' Brief from the marketing team: ' + trim(o.brief, 600) : ''),
      '',
      'THE LOOK IS FIXED',
      'Every post has the same frame: the TechNext logo top left, the Odoo badge top right, the headline and subline centred on top. Under the subline sits ONE simple visual in a clean, flat style: white cards, a phone, Nexi (the TechNext robot), blue handwritten pills, step chips and sparkles, on a plain light background. You choose the visual and write every word in it; the layout is done for you.',
      '',
      'HOW TO WRITE EACH POST',
      '1. Pick one concrete moment from SOURCE and write the headline about it.',
      '2. Pick the VISUAL that shows that moment best. A reader must get the headline from the picture alone: a post about food cost shows food cost numbers; a post about WhatsApp orders shows the chat and the order it created.',
      '3. Write every word in the visual for THIS headline: screen titles, field values, list lines, chart bars, pills and chips. Never generic filler such as "Item one" or "Step 2".',
      '4. When the post is about Odoo, show Odoo from the inside: the right app (module), its menu, realistic record names (S00231, BILL/2026/0311, WH/IN/00042) and sample data.',
      '5. Make it look like a poster: mix the visuals, arrangements, backgrounds, props and accents (see DESIGN KNOBS) so no two posts look alike.' + (o.industry ? ' Every post should show ' + C.industries[o.industry].noun + ': their records, their products, their props.' : ''),
      '',
      'EVERY POST DIFFERENT',
      '- Use a different visual for every post; repeat one only when there are more posts than visuals, and then with different content and callouts.',
      '- Each post takes a different angle, from: ' + angles.map(function (a) { return a[1]; }).join('; ') + '.',
      '- No two headlines start with the same word.' + ((o.existing || []).length ? ' Do not repeat these existing headlines: ' + o.existing.slice(0, 25).join(' / ') : ''),
      '',
      'RULES',
      '- Facts only from SOURCE. Never invent client names, results, awards, prices or dates as claims. Company figures allowed: 10+ countries, 11+ enterprise clients, 4 AI disciplines.',
      '- Visuals use sample data only: generic names ("Sample Trading Pte Ltd", "Mei Ling T."), realistic S$ amounts, dates in Sep-Oct 2026. Chart numbers are demo data.',
      '- Say "Odoo Partner", never "Certified". Never say websites or social media are part of Odoo. Odoo 20 claims only from the Odoo 20 list; AI features use paid credits.',
      '- head: max 9 words, two parts split by | ; wrap 1-3 key words of the second part in *asterisks* (blue); optionally one ~word~ (yellow underline). sub: one sentence, max 22 words.',
      '- caption: 2-4 short sentences for LinkedIn/Facebook, ending with a question or "Book a call at technext.asia". hashtags: 3-5.',
      '- Voice: plain and specific. No hype words (revolutionary, seamless, unlock, leverage, game-changer), no emoji.',
      '',
      'VISUALS (pick one per post; stay within the character limits):',
      vis.map(function (v) { return '- ' + VSPEC[v]; }).join('\n'),
      '',
      KNOBS,
      propsLine(o),
      '',
      'OUTPUT: only a JSON array of ' + o.count + ' post objects, no other text. Every post: {"name","angle","head","sub","caption","hashtags","visual"} plus the fields of its visual. A complete example:',
      EXAMPLE,
      'Module names must be keys from the ODOO APPS or APP RECORD FLOWS lists.',
      '',
      'SOURCE',
      sourceFor(o.cat, o.industry)
    ].join('\n');
  }

  function tokens(text) { return Math.ceil(String(text || '').length / 4); }
  var OUT_PER_POST = 440;
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
        onText: function (u) { var n = (u.text.match(/"visual"\s*:/g) || []).length; if (n !== seen) { seen = n; onProgress && onProgress(n, u.text); } }
      }).then(function (data) {
        var list = Array.isArray(data) ? data : data && Array.isArray(data.posts) ? data.posts : [];
        return { concepts: list.filter(function (x) { return x && typeof x === 'object' && x.head; }), input: tokens(prompt), output: tokens(JSON.stringify(data)), ms: Date.now() - t0, tier: o.tier || 'default' };
      });
    });
  }

  window.TNAI = { VSPEC: VSPEC, detectIndustry: detectIndustry, ANGLES: ANGLES, TIERS: TIERS, buildPrompt: buildPrompt, estimate: estimate, tokens: tokens, generate: generate, available: available, OUT_PER_POST: OUT_PER_POST };
})();
