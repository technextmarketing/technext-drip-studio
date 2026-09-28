/* TechNext Drip Studio — content generation with Claude (v7).
   Claude is copywriter and art director: for every post it writes the headline, subline and caption, picks
   a style direction and a composition pattern (or invents one) and places every element itself, from the
   element catalogue, following poster design principles. A creative brief (hooks, personas, moments) changes
   on every run, and the library's existing headlines and compositions are excluded, so every run is fresh.
   simple.js checks the placement (safe zone, overlaps, bleed) and draws it. */
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

  /* ---------- v7: Claude composes every post itself, from the element catalogue ---------- */
  var ELEMENTS_DOC = [
    'ELEMENTS you can place (all drawn flat in white cards with the brand fonts; the sizes and words are yours):',
    'Odoo records: doc {kind:quote|order|invoice|bill|po|delivery|receipt, number, partner, fields:[[label,value]x0-2], lines:[[product,qty,amount]x2-4], total, stage, ribbon:"PAID", note, compact:true = a small card} · record {app, title, crumb, status, rows:[[label,value,"ai"|"ok"|""]x3-4], note, btn} · product {item, ref, icon:box|shirt|cup|bag|bowl|bottle|tool|pill|chair|plant, price, stock:[[label,value]x2], level:0-100, tags, badge} · phone {app, title, crumb, banner, field:[label,value], lines:[[item,qty,true|false]x3-4], btn, offline:true} · board {view:kanban|list|planning|kds|pos|dashboard, app, title, crumb, tag; kanban "stages":[[name,[[title,subtitle,amount,initials]x1-2]]x3-4],"highlight":["2.0"]; list "cols":[3-4],"rows":[[…]x3-5],"highlight":row; planning "days":[5],"rows":[[person,[[startDay,days,label]x1-2]]x3-4]; kds "tickets":[[table,[[item,qty]x2-3],"cooking|ready|late",minutes]x2-3]; pos "table","products":[[name,price]x6],"order":[[item,qty,unit,subtotal]x2-3],"total","btn"; dashboard "kpis":[[label,value,change]x3],"chart":{kind,title,data}} · workorder {title, crumb, status, timer, timerLabel, steps:[[step,done|now|todo,detail]x3-4], progress:0-100, progressLabel, btn} · ticket {title, crumb, stage, priority:0-3, sla, channel, text, assignee, tags} · calendar {app, title, crumb, tag, days:[5], from, to, today, events:[[day,startHour,hours,label,highlight]x4-7]} · employee {person, job, dept, rows:[[label,value,status]x2-4]} · email {subject, from, headline, cta, stats:[[value,label]x3]} · shop {brand, url, product, category, icon, price, rating, reviews, stock, options, cart, btn} · reconcile {title, crumb, status, bank:[date,payer,amount], match:[number,customer,amount], label, btn, note} · approval {title, crumb, status, fields:[[label,value]x2-3], approvers:[[name,Approved|Waiting]x2], btns} · sheet {title, tag, formula, cols:[4], rows:[[4]x3-5], highlight:[row,col], totalRow} · docs {title, crumb, tag, files:[[name,pdf|xls|doc|img,tag,highlight]x4-6]} · rating {stars, text, who, meta} · kcard {title, crumb, tags, priority, amount, owner, activity} · receipt {vendor, doc, lines:[[item,amount]x2-4], total, stamp} · notif {app, title, text, time}',
    'Numbers & flows: chart {kind:bar|line|area|donut|funnel|progress, title, tag, data:[[label,number]x4-7], highlight, unit} · kpis {items:[[label,value,delta,module]x2-4]} · stat {value ≤8 chars, label} · timeline {title, items:[[time,event,module,detail]x3-5], hot} · steps {dir:h|v, items:[[module,step,detail]x3-5], hot} · flow {steps:[{app,t,h}x3-6], hot} (leave steps out for the industry workflow) · pyramid {levels:[[title,sub] top to bottom x3-5], hot, note} · groups {groups:[{title, apps:[[module,label]x2-6]}x2-3], base} · checklist {title, tag, items x3-4, apps, old:true = the old way with red crosses} · chat {channel:whatsapp|web|odoo, title, status, msgs:[[in|out|bot,text]x2-4]} · appflow {app, hot} · orbit {apps:[6-10 modules], label} · phases {} (the industry rollout) · devices {site:technext|movewithease|tre|immaculate} · site {brand, head, cta} · serp {query, title, desc} · code {file, lines}',
    'Nexi & props: nexi {pose:' + POSE + '} · prop {name from PROPS, tile:true for a white tile, label}',
    'Callouts: pill {text ≤20, handwritten} · chip {text ≤26, small, icon:check|spark|search|sync|cloudOk|bell|clock|chart} · note {text ≤22 handwritten, strike:true} · bubble {text ≤18} · text {text ≤70, font:hand|display|body, size:28-130, align} · sticker {text ≤12, small, tone:yellow|blue|white|mint|pink} · stamp {text, tone:green|blue|red} · sticky {text ≤36, tone:yellow|blue|mint|pink} · avatars {names, more, label} · toggle {text, on} · timer {time, label} · ring {value:0-100, label} · button {text, tone:odoo|blue|white|green} · search {query, filters} · pin {label} · barcode {code, label} · scribble {kind:circle|underline|arrow|check|star|zigzag|cross} · scanner {title, text} · qr {title, text} · arrow {kind:right|left|down|up|loop} · sparkles {} · glow {}',
    'PLACEMENT, on every element: "x","y" = the top-left corner (x in % of the canvas width, y in % of the visual area: 0 is right under the subline, 100 the bottom edge) or "cx","cy" for the centre; "w" = width in % of the canvas width (records 45-70, a phone 28-34, a prop 14-40; chips, pills, stamps, notes and bubbles need no w); "rot" in degrees (-12 to 12); "z" 1-9 (9 = front); "role": hero|support|accent; "bleed": true lets the hero run off the bottom or a side edge (never the top); "over": true when it must sit on another element (a stamp on a document, a sticker on a card); "stack": 1-2 paper sheets behind a card.'
  ].join('\n');
  var PRINCIPLES = [
    'DESIGN PRINCIPLES (from banner and poster practice):',
    '- One focal point: the hero is at least twice the size of anything else; everything else supports it. Scale contrast makes a poster.',
    '- Safe zone: text and key content stay within the central 80% of the canvas; only a decorative edge of the hero may bleed off.',
    '- Breathing room: 3 to 6 elements (a collage up to 7). Leave empty space on purpose; never fill every corner.',
    '- Alignment and rhythm: align to thirds of the canvas; keep gaps consistent; rotate at most two elements, by 3 to 8 degrees, with intent.',
    '- Hierarchy: headline (fixed) > card title > body > callouts. The typefaces are fixed: Plus Jakarta Sans for titles, Inter for text, Caveat for handwriting.',
    '- Colour: brand blue plus ONE accent per post, from the industry mood: F&B and kitchens warm (coral, yellow); construction and field service safety yellow; IT, ERP and finance blue or navy; clinics and wellness teal; travel blue; retail and fashion purple or coral; marketing bold (coral, purple).',
    '- Anti-patterns: text on text, clipped words, cluttered corners, more than one call-to-action, decoration that says nothing, an element touching the headline, the same layout twice in one set, Nexi in every post.'
  ].join('\n');
  var STYLE_DOC = 'STYLE DIRECTIONS (one per post, all different in a set): bold = one huge hero, few elements, a big number or a big stamp · editorial = a neat grid, two columns, numbered steps, no rotation · doodle = handwritten notes, scribbles, stickers, sticky notes, imperfect rotations · spacious = one element and a lot of empty space · geometric = tiles and rows, aligned, props on white tiles · storytelling = a sequence: a timeline, steps, or three documents handed on with arrows · playful = Nexi, a sticker, a speech bubble, sparkles, confident tilts · perspective = stacked paper sheets, overlaps, depth.';
  var PATTERNS_DOC = [
    'COMPOSITION PATTERNS (pick one per post or invent your own; describe it in one line in "composition"):',
    '1 Hero bleed: one element at 62-76% width, cut by the bottom or right edge (bleed:true), two callouts in the empty space.',
    '2 Big number: a stat at 34% width on one side, a chart at 52% on the other, one chip under the stat.',
    '3 Diagonal cascade: three cards at 38-42% width stepping from top-left to bottom-right, overlapping 12%, rotations -4/0/4.',
    '4 Split: the old way (checklist old:true) at 42% left, the Odoo answer at 48% right, an arrow between.',
    '5 Strip: one wide element (timeline, steps, flow, groups) at 84-92% width starting at y 14, a pill at y 0 above it, a chip below it, a small prop in a corner.',
    '6 Collage: five to seven small elements (chips, stickers, a sticky note, a pin, a prop, a phone at 28%) scattered with small rotations, no hero: for "many small wins".',
    '7 Orbit: a centre element (a prop on a tile, a stat or a ring at 30%) with four to six chips or props around it.',
    '8 Grid: four cards at 44% in two rows and two columns, aligned, no rotation.',
    '9 Annotated screen: one board or doc at 70% centred, two or three chips beside it, scribble arrows pointing at the detail.',
    '10 Story: a vertical timeline at 50% on one side, Nexi or a prop on the other, a notification at the end.',
    '11 Prop poster: a big industry prop at 36-42% as the hero, three handwritten pills around it, one small doc or chip below.',
    '12 Typographic: no cards; one big handwritten text (text, font:hand, size 90-120, 2-5 words) plus a sticker and a scribble.',
    '13 Fan: three documents (compact:true, 32% each) with rotations -6/0/6 and stack:1, a stamp over the last one.',
    '14 Testimonial: a rating card at 58% (a sample persona, never a real client), Nexi love or clap beside it, avatars under.',
    '15 Before and after: a phone (offline:true) on the left, an arrow, a notif on the right, the result chip below.'
  ].join('\n');
  var LOOK_DOC = 'LOOK (the background feel, all clean): clean = white cards on a soft blue floor · paper = cream cards and coral handwriting on a sand tint · spotlight = a warm glow and a huge faded industry illustration behind the visual · stack = every card on paper sheets, a floor grid. "accent": blue|navy|teal|coral|purple|yellow. "decor" on the blue words of the headline: none|circle|underline|marker|strokes|box. "background": dots|grid|fine|diagonal|rings|plus|hex|waves|spots|floor|none. "tint": sky|mint|lilac|sand (at most one post in three). "kicker": a short blue bar above the headline, max 26 chars (optional).';
  var HOOKS = ['a question the owner asks at 7 am', 'a contrast: "X, not Y"', 'a tiny story in one line: what happened, then what Odoo did', 'a quote from a persona (a sample name, never a client)', 'a myth and the fact', '"three signs you need…"', 'a promise with a time ("by lunch", "before the shift ends")', 'the moment something goes wrong, and the fix', 'a checklist of what changes', 'a bold one-liner with one word highlighted', 'a "what if" scenario', 'what happens when… (no numbers)', 'an honest confession ("we used to…")', 'a before-and-after in one breath'];
  var PERSONAS = ['the owner', 'the head chef', 'the finance manager', 'the floor staff', 'the warehouse lead', 'the technician on site', 'the receptionist', 'the sales rep', 'the store manager', 'the operations manager', 'the new hire on day one', 'the accountant at month-end', 'the procurement officer', 'the night-shift supervisor'];
  var MOMENTS = ['Monday 7 am prep', 'month-end close', 'the GST quarter', 'payday', 'the festive rush', 'a supplier delivery', 'a customer complaint', 'opening a second outlet', 'onboarding new staff', 'the yearly audit', 'the year-end stock count', 'a rainy Sunday with a full house', 'a no-show appointment', 'a rush order at 5 pm', 'the first day back from holiday', 'a price change from a supplier', 'a public holiday weekend', 'the last hour before closing'];
  function shuffled(list, r) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t2 = a[i]; a[i] = a[j]; a[j] = t2; } return a; }
  function creativeBrief(o) {
    var r = (window.TNDrip && window.TNDrip.rng ? window.TNDrip.rng(o.seed || Date.now() % 1e9) : Math.random), n = o.count || 6;
    return { hooks: shuffled(HOOKS, r).slice(0, n), personas: shuffled(PERSONAS, r).slice(0, n), moments: shuffled(MOMENTS, r).slice(0, n) };
  }

  var EXAMPLE = JSON.stringify({ name: 'Kitchen display, not paper', angle: 'pain', head: 'Paper tickets fall.|*Screens do not.*', sub: 'Orders go from the POS to the kitchen display with the guest\'s notes, so nothing is lost on a busy Friday.',
    caption: 'Friday, 7.30 pm, and a ticket is on the floor. With Odoo POS the order is on the kitchen display the second it is placed, notes included. How many tickets does your kitchen lose a week?', hashtags: ['#Odoo', '#FandB', '#Restaurant'],
    visual: 'free', composition: 'hero bleed: the kitchen display cut by the bottom edge, callouts on the left, a service bell in the corner', style: 'playful', look: 'clean', accent: 'coral', decor: 'underline', background: 'dots',
    elements: [
      { type: 'board', view: 'kds', app: 'pos_restaurant', title: 'Kitchen display', crumb: 'POS · Main kitchen', tag: '3 tables', tickets: [['Table 12', [['Laksa', '2'], ['Chicken rice', '1']], 'cooking', '2 min'], ['Table 7', [['Satay (10)', '1']], 'ready', '6 min']], x: 30, y: 8, w: 74, rot: -3, role: 'hero', bleed: true },
      { type: 'pill', text: 'No paper tickets', x: 4, y: 12, rot: -5 },
      { type: 'chip', text: 'Guest notes carried over', small: 'No peanuts · Table 12', icon: 'check', x: 3, y: 40 },
      { type: 'prop', name: 'bell', x: 6, y: 66, w: 16, rot: 8 },
      { type: 'sparkles', x: 24, y: 2 }
    ] });
  var EXAMPLE2 = JSON.stringify({ name: 'Signed before lunch', angle: 'feature', head: 'Sent at nine.|*Signed before lunch.*', sub: 'The Odoo quotation goes out with an e-signature link, and the order is confirmed the moment the customer signs.',
    caption: 'No printing, no scanning, no chasing. The quotation carries its own signature link, and the sales order confirms itself. Book a call at technext.asia.', hashtags: ['#Odoo', '#Sales', '#eSign'],
    visual: 'free', composition: 'typographic: one big handwritten line, a sticker and a scribble, a small quotation with a stamp below', style: 'doodle', look: 'paper', accent: 'coral', decor: 'circle', background: 'waves',
    elements: [
      { type: 'text', text: 'Signed before lunch.', font: 'hand', size: 104, x: 6, y: 4, w: 88, rot: -3, role: 'hero' },
      { type: 'scribble', kind: 'underline', x: 12, y: 28, w: 42 },
      { type: 'sticker', text: 'eSign', small: 'inside Odoo', tone: 'yellow', x: 74, y: 34, w: 17, rot: 8 },
      { type: 'doc', kind: 'quote', compact: true, number: 'S00118', partner: 'Sample Trading Pte Ltd', total: 'S$ 4,665.20', stage: 'Quotation Sent', x: 18, y: 52, w: 42, rot: 2, stack: 1 },
      { type: 'stamp', text: 'SIGNED', tone: 'blue', x: 44, y: 74, over: true }
    ] });

  function buildPrompt(o) {
    var angles = ANGLES.filter(function (a) { return o.angles.indexOf(a[0]) > -1; }), cb = creativeBrief(o);
    var ind = o.industry && C.industries[o.industry], who = ind ? ind.name + ' businesses in Singapore and Southeast Asia' : 'small and mid-sized companies in Singapore and Southeast Asia';
    return [
      'You are the copywriter AND art director for TechNext (technext.asia), an Odoo Partner headquartered in Singapore that implements Odoo, builds AI inside Odoo, and separately designs websites and runs social media.',
      'Design ' + o.count + ' social media posts ("drips", 1080x1080) for ' + who + ', for the "' + o.catName + '" series.' + (o.brief ? ' Brief from the marketing team: ' + trim(o.brief, 600) : ''),
      '',
      'THE FRAME IS FIXED: TechNext logo top left, Odoo badge top right, headline and subline centred on top. Everything below the subline is yours: you place every element yourself, like a designer laying out a poster. Nothing else is templated.',
      '',
      PRINCIPLES,
      '',
      STYLE_DOC,
      '',
      PATTERNS_DOC,
      '',
      LOOK_DOC,
      '',
      ELEMENTS_DOC,
      propsLine(o),
      '',
      'CREATIVE BRIEF FOR THIS RUN (it changes every run)',
      '- One hook per post, all different: ' + cb.hooks.join(' · ') + '.',
      '- One point of view per post: ' + cb.personas.join(', ') + '.',
      '- One moment per post: ' + cb.moments.join(', ') + '.',
      '- Everyday situations, habits and frustrations of ' + (ind ? ind.noun : 'these companies') + ' may come from your own knowledge of the trade. Claims about what Odoo, Odoo 20 or TechNext does must come from SOURCE.',
      '',
      'FRESH CONTENT AND FRESH DESIGN, EVERY TIME',
      '- Every post: a different hook, persona, moment, angle (' + angles.map(function (a) { return a[1]; }).join('; ') + '), pattern, style, accent, decor and background. No two posts in the set may look alike or say the same thing.',
      '- Vary the weight: one post with a huge hero and nothing else, one busy collage, one carried by handwriting or a single number. Nexi in at most one post out of three.',
      '- No two headlines start with the same word.' + ((o.existing || []).length ? ' Existing posts, whose moment, idea and headline you must not reuse: ' + o.existing.slice(0, 60).join(' / ') : ''),
      ((o.existingDesigns || []).length ? '- Compositions already in the library, not to repeat: ' + o.existingDesigns.slice(0, 40).join(' · ') : ''),
      '',
      'RULES',
      '- Never invent client names, results, awards, prices or dates as claims. Company figures allowed: 10+ countries, 11+ enterprise clients, 4 AI disciplines.',
      '- Inside elements use sample data only: generic names ("Sample Trading Pte Ltd", "Mei Ling T."), realistic S$ amounts, dates in Sep-Oct 2026. Chart numbers are demo data.',
      '- Say "Odoo Partner", never "Certified". Never say websites or social media are part of Odoo. Odoo 20 claims only from the Odoo 20 list; AI features use paid credits.',
      '- head: max 9 words, two parts split by | ; wrap 1-3 key words of the second part in *asterisks* (blue). sub: one sentence, max 22 words.',
      '- caption: 2-4 short sentences for LinkedIn/Facebook, ending with a question or "Book a call at technext.asia". hashtags: 3-5.',
      '- Voice: plain and specific. No hype words (revolutionary, seamless, unlock, leverage, game-changer), no emoji.',
      '- Module names must be keys from the ODOO APPS or APP RECORD FLOWS lists.',
      '',
      'OUTPUT: only a JSON array of ' + o.count + ' post objects, no other text. Shape: {"name","angle","head","sub","caption","hashtags","visual":"free","composition","style","look","accent","decor","background","tint"(optional),"kicker"(optional),"elements":[3-7 elements with their placement]}. Two complete examples:',
      EXAMPLE,
      EXAMPLE2,
      '',
      'SOURCE',
      sourceFor(o.cat, o.industry)
    ].join('\n');
  }

  function tokens(text) { return Math.ceil(String(text || '').length / 4); }
  var OUT_PER_POST = 620;
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

  window.TNAI = { VSPEC: VSPEC, detectIndustry: detectIndustry, creativeBrief: creativeBrief, ANGLES: ANGLES, TIERS: TIERS, buildPrompt: buildPrompt, estimate: estimate, tokens: tokens, generate: generate, available: available, OUT_PER_POST: OUT_PER_POST };
})();
