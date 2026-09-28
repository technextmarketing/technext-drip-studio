/* TechNext Drip Studio — starters for "New drip" (no Claude needed). Each one is a post in the simple style
   (see simple.js): one story from the technext.asia content and the visual that shows it. The industry
   starters read the chosen industry's workflow, before/after table, dashboard and Odoo 20 notes. */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {};
  function ind(k) { return (C.industries || {})[k] || C.industries.retail; }
  function headFrom(t) { t = (t || '').replace(/\.$/, ''); var i = t.lastIndexOf(', '); return i > 0 ? t.slice(0, i + 1) + '|*' + t.slice(i + 2) + '.*' : t + '.'; }
  function short(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') : t; }

  var S = {
    flow: { label: 'Workflow across apps', about: "The industry's steps on the website, one Odoo app each", make: function (k) {
      var I = ind(k), f = (I.flow || []).slice(0, 6);
      return { visual: 'flow', name: I.name + ' · workflow', head: headFrom(I.flow_title), sub: 'The steps ' + I.noun + ' run every day, each in its own Odoo app, on one database.',
        steps: f.map(function (x) { return { app: x.app, t: x.t, h: x.h }; }), hot: Math.min(4, f.length - 1) }; } },
    versus: { label: 'Old way vs Odoo', about: "Three rows of the website's before/after table", make: function (k) {
      var I = ind(k), rows = (I.ba || []).slice(0, 3);
      return { visual: 'versus', name: I.name + ' · old way vs Odoo', head: 'Still doing it|*the old way?*', sub: 'What changes for ' + I.noun + ' when every step runs in one Odoo.',
        old: { title: 'Without one system', tag: 'The old way', items: rows.map(function (r) { return short(r[1], 44); }) },
        new: { app: ((I.flow || [])[0] || {}).app, title: 'With Odoo', tag: 'One system', items: rows.map(function (r) { return short(r[2], 48); }) }, pills: ['Nothing typed twice'] }; } },
    chart: { label: 'Industry numbers', about: "The industry's dashboard from the website, as one chart", make: function (k) {
      var I = ind(k), ch = I.chart || { title: 'Sales by week', kpis: [['Orders', '312']], views: [{ bars: [['Mon', 12], ['Tue', 18], ['Wed', 15]] }] }, bars = (ch.views[0].bars || []).slice(0, 7), kp = (ch.kpis || [])[0] || ['Today', '—'];
      var hi = 0; bars.forEach(function (b, i) { if (b[1] > bars[hi][1]) hi = i; });
      return { visual: 'chart', name: I.name + ' · numbers', head: 'Your numbers,|*live from Odoo.*', sub: ch.title + ' and the figures behind it, straight from the records your team already keeps.',
        chart: { kind: 'bar', title: ch.title, tag: 'Demo data', data: bars, highlight: hi }, kpi: [kp[0], kp[1], ''], chip: { text: 'Updated as you sell', small: 'No month-end export', icon: 'chart' }, nexi: 'celebrate' }; } },
    odoo20: { label: 'What Odoo 20 changes', about: "The Odoo 20 notes for the industry, from the website", make: function (k) {
      var I = ind(k);
      return { visual: 'checklist', badge: 'o20', name: 'Odoo 20 · ' + I.name, head: 'What Odoo 20 changes|*for ' + I.noun + '.*', sub: 'Worth testing on a copy of your database before you upgrade.',
        title: 'Odoo 20 for ' + I.name, tag: 'New in Odoo 20', items: (I.new20 || []).slice(0, 4), apps: (I.flow || []).map(function (f) { return f.app; }).filter(Boolean).slice(0, 4), nexi: 'present' }; } },
    phases: { label: 'Rollout phases', about: 'How TechNext rolls Odoo out for the industry', make: function (k) {
      var I = ind(k);
      return { visual: 'phases', name: I.name + ' · rollout', head: 'Three phases.|*One Odoo rollout.*', sub: 'How TechNext rolls out Odoo for ' + I.noun + ', from set-up to reporting.', pills: ['Live in phases'] }; } },
    offline: { label: 'Offline on the phone', about: 'Odoo 20 offline mode on a phone', make: function () {
      return { visual: 'phone', badge: 'o20', offline: true, name: 'Odoo 20 · offline', head: 'No signal? *Keep working.*', sub: 'Odoo 20 lets on-site teams create and edit records offline. Everything syncs when you are back online.',
        app: 'stock', title: 'Receipt WH/IN/00042', crumb: 'Inventory · Receipts', field: ['Receive from', 'Sample Supplier Pte Ltd'], lines: [['Cement, 40 kg bags', '20 / 20', true], ['Rebar, 12 mm', '150 / 150', true], ['Tile adhesive, 25 kg', '18 / 35', false]], btn: 'Validate',
        pills: ['Warehouse floor', 'Construction site', 'Field visit'], chip: { text: 'Back online', small: '3 changes synced', icon: 'cloudOk' } }; } },
    aibill: { label: 'AI prepares the bill', about: 'Nexi and the vendor bill AI filled, with three steps', make: function () {
      return { visual: 'record', name: 'AI vendor bill', head: 'AI prepares the bill.|*You approve it.*', sub: 'TechNext builds AI inside your Odoo. It reads the vendor bill, matches the purchase order and waits for your OK.',
        app: 'accountant', title: 'Vendor bill', crumb: 'Accounting · Draft', status: 'Draft', rows: [['Vendor', 'Harbourline Supplies', 'ai'], ['Bill date', '12 Sep 2026', 'ai'], ['Total', 'S$ 1,284.00', 'ai'], ['PO match', 'PO00123', 'ok']],
        note: 'Prepared by AI · a person approves', btn: 'Approve', steps: ['AI read the bill', 'Matched to PO00123', 'Approved by Finance'], bubble: 'PO matched!', nexi: 'point' }; } },
    paper: { label: 'Paper to Odoo', about: 'A supplier PDF read into a draft bill', make: function () {
      return { visual: 'paper', name: 'Bills that read themselves', head: 'Bills that *read themselves.*', sub: 'Odoo AI reads the supplier PDF and fills the bill lines, so your team only checks and approves.',
        doc: { vendor: 'Sample Seafood Pte Ltd', doc: 'TAX INVOICE', lines: [['Prawns 2 kg x6', '192.00'], ['Salmon fillet x4', '114.00'], ['GST 9%', '27.54']], total: 'S$ 333.54', stamp: 'SCANNED' },
        record: { app: 'accountant', title: 'BILL/2026/0311', crumb: 'Accounting · Vendor bills', status: 'Draft', rows: [['Vendor', 'Sample Seafood', 'ai'], ['Bill date', '24 Sep 2026', 'ai'], ['Total', 'S$ 333.54', 'ai'], ['PO', 'P00088', 'ok']], btn: 'Confirm' },
        label: 'AI reads the PDF', steps: ['3 lines filled by AI', 'Checked against P00088'] }; } },
    pipeline: { label: 'CRM pipeline', about: 'Opportunities by stage on one board', make: function () {
      return { visual: 'board', view: 'kanban', name: 'CRM pipeline', head: 'Every lead,|*one pipeline.*', sub: 'Odoo CRM shows every opportunity by stage, so nobody chases the same deal twice.',
        app: 'crm', title: 'Pipeline', crumb: 'CRM · Sales team SG', tag: '12 open deals',
        stages: [['New', [['Office fit-out', 'Sample Build Co', 'S$ 18,000', 'KL'], ['POS for 3 outlets', 'Sample Cafe', 'S$ 9,400', 'MT']]], ['Qualified', [['Warehouse barcodes', 'Sample Logistics', 'S$ 12,500', 'RS']]], ['Proposition', [['Payroll + HR', 'Sample Clinic', 'S$ 7,200', 'JW'], ['Online store', 'Sample Retail', 'S$ 15,800', 'AN']]], ['Won', [['Accounting', 'Sample Foods', 'S$ 11,000', 'LT']]]],
        highlight: ['2.1'], pills: ['Drag it to Won'], chip: { text: 'Quote sent', small: 'Online store · S$ 15,800' } }; } },
    kitchen: { label: 'Kitchen display', about: 'Table orders on the kitchen screen', make: function () {
      return { visual: 'board', view: 'kds', name: 'Kitchen display', head: 'The order hits the kitchen|*before the waiter walks back.*', sub: 'Odoo POS sends every table order straight to the kitchen display, so nothing is lost on paper.',
        app: 'pos_restaurant', title: 'Kitchen display', crumb: 'POS · Main kitchen', tag: '3 tables',
        tickets: [['Table 12', [['Laksa', '2'], ['Chicken rice', '1']], 'cooking', '2 min'], ['Table 7', [['Satay (10)', '1'], ['Kaya toast', '2']], 'ready', '6 min'], ['Takeaway 41', [['Nasi lemak', '3']], 'late', '14 min']],
        pills: ['No paper tickets'], chip: { text: 'Table 7 is ready', small: 'Served in 6 min' } }; } },
    planning: { label: 'Planning board', about: 'Who works where this week, with Nexi', make: function () {
      return { visual: 'board', view: 'planning', name: 'Planning board', head: "Today's jobs,|*on one board.*", sub: 'Odoo Planning shows who works where, and moves a job in one drag when a customer reschedules.',
        app: 'planning', title: 'Technicians · this week', crumb: 'Planning · Schedule', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        rows: [['Ravi S.', [[0, 2, 'Aircon service'], [3, 1, 'Install']]], ['Mei Ling T.', [[1, 2, 'Repair'], [4, 1, 'Check-up']]], ['Daniel K.', [[0, 1, 'Survey'], [2, 3, 'Maintenance']]], ['Aisha R.', [[1, 1, 'Install'], [3, 2, 'Service']]]],
        pills: ['Drag to reschedule'], nexi: 'point' }; } },
    whatsapp: { label: 'WhatsApp to Odoo', about: 'A WhatsApp order and the sales order it creates', make: function () {
      return { visual: 'chat', name: 'WhatsApp orders', head: 'WhatsApp orders|*land in Odoo.*', sub: 'A customer orders on WhatsApp and the sales order is waiting in Odoo, stock reserved.',
        chat: { channel: 'whatsapp', title: 'Sample Store', status: 'WhatsApp · online', msgs: [['in', 'Hi! 2 linen shirts, size M, for pickup tomorrow?'], ['out', 'Sure, reserved for you. Pay at pickup or online.'], ['in', 'Online please, thanks']] },
        record: { app: 'sale', title: 'S00231', crumb: 'Sales · Quotation', status: 'Sent', rows: [['Customer', 'Mei Ling T.', 'ok'], ['Linen shirt (M)', '2 × S$ 49', ''], ['Pickup', 'Tomorrow, 11 am', '']], btn: 'Confirm' },
        chip: { text: 'Stock reserved', small: '2 × Linen shirt (M)' } }; } },
    chatbot: { label: 'AI chatbot', about: 'A chatbot answering from Odoo, with Nexi', make: function () {
      return { visual: 'chat', name: 'AI chatbot', head: 'Answers at 2am.|*A person by 9.*', sub: 'A TechNext chatbot answers from your Odoo records and hands the chat to your team with the context.',
        chat: { channel: 'whatsapp', title: 'Sample Store', msgs: [['in', 'Is my order S00231 out for delivery?'], ['bot', 'Yes. It left the warehouse at 8:40 and arrives today before 6pm.'], ['in', 'Can I change the address?'], ['bot', 'I am passing you to our team with this chat.']] },
        nexi: 'wave', bubble: 'On it!', chip: { text: 'Ticket #1042 created', small: 'Handed to Support', icon: 'sync' }, label: 'Answers from Odoo' }; } },
    alerts: { label: 'Low-stock alerts', about: 'Nexi and the notifications Odoo raises', make: function () {
      return { visual: 'alerts', name: 'Low stock alerts', head: 'Odoo tells you|*before the shelf is empty.*', sub: 'Reordering rules watch stock in every store and raise the purchase order before you run out.', nexi: 'surprise', bubble: 'Heads up!',
        alerts: [{ app: 'stock', title: 'Low stock: Linen shirt M', text: '4 left in Orchard · reorder rule triggered', time: '09:12' }, { app: 'purchase', title: 'Purchase order P00231 drafted', text: '60 units from Sample Textiles', time: '09:12' }, { app: 'stock', title: 'Transfer to Tampines', text: '12 units moved from the warehouse', time: '10:40' }] }; } },
    quote: { label: 'Quote to paid', about: 'One order in one morning, as a timeline', make: function () {
      return { visual: 'timeline', name: 'Quote to paid', head: 'Quote in the morning.|*Paid by lunch.*', sub: 'Customers sign and pay the Odoo quotation online, and the invoice follows the sales order.',
        title: 'One order, one morning', items: [['09:10', 'Quotation sent', 'sale', 'S00118 · S$ 4,665.20'], ['09:42', 'Signed online', 'sign', 'by A. Tan'], ['10:05', 'Delivery booked', 'stock', 'WH/OUT/0231'], ['11:52', 'Invoice paid', 'accountant', 'Card payment online']], hot: 3,
        chip: { text: 'Paid online', small: 'S$ 4,665.20 · 11:52' }, nexi: 'celebrate' }; } },
    hook: { label: 'Question hook', about: 'A big Nexi reaction with three callouts', make: function () {
      return { visual: 'reaction', name: 'Stock count hook', head: 'Still counting stock|*on a Sunday?*', sub: 'Odoo counts as you sell, receive and move stock, so the numbers are right every morning.', nexi: 'surprise', pills: ['Counts as you sell', 'Right every morning', 'Sundays off'] }; } },
    website: { label: 'Website we built', about: 'A TechNext-built site on a laptop and phone', make: function () {
      return { visual: 'website', site: 'movewithease', name: 'Website salesperson', head: 'Your website,|*your best salesperson.*', sub: 'TechNext builds fast, mobile-first sites where every inquiry reaches the right person.', chips: ['Fast on every phone', 'Every inquiry routed', 'Built to be found'] }; } },
    spotlight: { label: 'Industry poster', about: "A big prop from the industry with three callouts", make: function (k) {
      var I = ind(k), P = window.TNProps, prop = P && P.BY_IND[k] ? P.BY_IND[k][0] : 'rocket', f = I.flow || [];
      return { visual: 'spotlight', prop: prop, kicker: 'Reasons your customer', name: I.name + ' · poster', head: 'One system|*for ' + I.noun + '.*', sub: I.flow_title || 'Every step in its own Odoo app, on one database.',
        pills: f.slice(0, 3).map(function (x) { return x.t + ' in Odoo'; }), chip: { text: 'Book a call', small: 'technext.asia', icon: 'check' } }; } },
    groups: { label: 'One operating system', about: "The industry's apps in two groups on one database", make: function (k) {
      var I = ind(k), f = (I.flow || []).filter(function (x) { return x.app; }), half = Math.ceil(f.length / 2);
      return { visual: 'groups', name: I.name + ' · one system', head: 'One operating|*system.*', sub: 'Sales and operations on one database, so nobody asks what a job actually cost.',
        groups: [{ title: 'Sales & growth', apps: f.slice(0, half).map(function (x) { return [x.app, x.t]; }) }, { title: 'Operations', apps: f.slice(half).map(function (x) { return [x.app, x.t]; }) }], base: 'One database for ' + I.noun, pills: ['One system, not five'] }; } },
    pyramid: { label: 'Growth pyramid', about: 'Stages that build on each other, ERP at the base', make: function () {
      return { visual: 'pyramid', name: 'Growth pyramid', head: 'The business growth|*pyramid.*', sub: 'Each stage builds on the one below it: operations first, then growth, then scale.',
        levels: [['Scale', 'New outlets, new markets'], ['Automation', 'AI inside Odoo'], ['Marketing', 'Growth'], ['ERP', 'Sales · Ops · Admin']], hot: 3, pills: ['Start here', 'Then scale'] }; } },
    document: { label: 'Quotation signed', about: 'An Odoo quotation with its status bar and Nexi', make: function () {
      return { visual: 'document', kind: 'quote', name: 'Quotation signed', head: 'The quote,|*signed the same day.*', sub: 'Odoo quotations carry every line and option, and the customer signs online.',
        number: 'S00118', partner: 'Sample Trading Pte Ltd', fields: [['Expiration', '15 Oct 2026']], lines: [['Office chair', '10', 'S$ 1,800.00'], ['Standing desk', '4', 'S$ 2,480.00']], total: 'S$ 4,665.20', note: 'Signed online by A. Tan',
        steps: ['Sent from a template', 'Signed online'], bubble: 'Signed!', nexi: 'point', accents: [{ type: 'stamp', text: 'SIGNED', tone: 'blue' }] }; } },
    fan: { label: 'Quote, order, invoice', about: 'Three documents: one record handed on', make: function () {
      return { visual: 'fan', name: 'Quote to invoice', head: 'Quote, order, invoice:|*one record, handed on.*', sub: 'The sales order carries the customer and the lines from the quote to the invoice, so nothing is typed twice.',
        docs: [{ kind: 'quote', number: 'S00118', partner: 'Sample Trading Pte Ltd', total: 'S$ 4,665.20' }, { kind: 'order', number: 'S00118', partner: 'Sample Trading Pte Ltd', total: 'S$ 4,665.20' }, { kind: 'invoice', number: 'INV/2026/0142', partner: 'Sample Trading Pte Ltd', total: 'S$ 4,665.20', ribbon: 'PAID' }], pills: ['Nothing retyped', 'Paid online'] }; } },
    product: { label: 'Product and stock', about: 'A product card with stock, a barcode and the reorder', make: function () {
      return { visual: 'product', name: 'Stock per product', head: 'Know what is on the shelf|*before you promise it.*', sub: 'On-hand and forecast stock per product, and a reorder rule that raises the purchase order.',
        item: 'Sample product', icon: 'box', price: 'S$ 38.00', stock: [['On hand', '6 units'], ['Forecast', '46 units']], level: 14, tags: ['Reorder at 10'], badge: 'Low stock', barcode: { code: '8 88012 34567 1', label: 'Sample product' }, chip: { text: 'PO P00231 drafted', small: '40 units · due Fri' }, pills: ['Reorder rule on'] }; } },
    workorder: { label: 'Work order', about: 'A manufacturing work order with its steps and timer', make: function () {
      return { visual: 'workorder', name: 'Work order', head: 'The shop floor,|*live in Odoo.*', sub: 'Each work order shows its steps, the time on the current one and how many are done.',
        title: 'WO/00042 · Painting', crumb: 'Oak dining table x20', status: 'In progress', timer: '00:24:10', timerLabel: 'on painting', steps: [['Cutting', 'done', '12:40'], ['Painting', 'now', 'Work center 2'], ['Packing', 'todo', '']], progress: 60, progressLabel: '12 of 20 done', btn: 'Mark as done', chip: { text: 'Next: packing', small: 'Work center 3' } }; } },
    ticket: { label: 'Helpdesk ticket', about: 'A ticket, the customer message and the rating', make: function () {
      return { visual: 'ticket', name: 'Support ticket', head: 'Every request,|*tracked to solved.*', sub: 'Requests from email or WhatsApp become tickets with an SLA, and the customer rates the fix.',
        title: '#1042 · Change delivery address', crumb: 'Sample Buyer · WhatsApp', stage: 'In progress', priority: 2, sla: '2h left', channel: 'WhatsApp', text: 'Can you deliver to our Tampines outlet instead?', assignee: 'Mei Ling T.', tags: ['Delivery'],
        chat: { channel: 'whatsapp', title: 'Sample Store', msgs: [['in', 'Can you deliver to Tampines instead?'], ['out', 'Ticket #1042 opened, done by 3 pm.']] }, rating: { stars: 5, text: 'Sorted in an hour. Thank you!', who: 'Daniel K.', meta: 'Rated ticket #1042' } }; } },
    calendar: { label: 'Bookings calendar', about: 'A week of appointments with the confirmation', make: function () {
      return { visual: 'calendar', name: 'Bookings', head: 'Every booking,|*on one calendar.*', sub: 'Customers book online, the team sees the week, and the confirmation goes out on its own.',
        app: 'appointment', title: 'Appointments', crumb: 'This week', tag: '12 booked', days: ['Mon 5', 'Tue 6', 'Wed 7', 'Thu 8', 'Fri 9'], from: 9, to: 16, today: 1, events: [[0, 9, 1, 'Check-up'], [1, 10.5, 1.5, 'Consultation', 1], [2, 13, 2, 'Treatment'], [3, 11, 1, 'Check-up'], [4, 14, 1.5, 'Follow-up']],
        notif: { app: 'appointment', title: 'Booking confirmed', text: 'Consultation · Tue 10:30', time: 'now' }, pills: ['Booked online'] }; } },
    store: { label: 'Online shop', about: 'A product page in the Odoo shop and the order it brings', make: function () {
      return { visual: 'store', name: 'Online shop', head: 'Your shop|*open all night.*', sub: 'The Odoo online shop shares stock and prices with your stores, and orders arrive paid.',
        brand: 'Sample Store', url: 'samplestore.sg/shop', product: 'Linen shirt', category: 'Apparel', icon: 'shirt', price: 'S$ 49.00', rating: 4.5, reviews: '128 reviews', stock: 'In stock · ships today', options: ['S', 'M', 'L', 'XL'], cart: '2',
        notif: { app: 'website_sale', title: 'New order S00412', text: 'Paid online · 2 items', time: '02:14' }, pills: ['Same stock as the store'] }; } },
    reconcile: { label: 'Bank match', about: 'A bank line matched to its invoice, with Nexi', make: function () {
      return { visual: 'reconcile', name: 'Bank reconciliation', head: 'The bank line finds|*its invoice.*', sub: 'Odoo matches each payment to its invoice by amount and reference, so month-end is shorter.',
        title: 'Bank reconciliation', crumb: 'DBS · September 2026', status: 'Reconciled', bank: ['24 Sep · PayNow', 'SAMPLE TRADING PTE LTD', 'S$ 4,665.20'], match: ['INV/2026/0142', 'Sample Trading Pte Ltd', 'S$ 4,665.20'], label: 'Matched by amount and reference', btn: 'Validate',
        steps: ['Bank feed imported', 'Invoice marked paid'], nexi: 'think', bubble: 'Matched!', accents: [{ type: 'stamp', text: 'MATCHED' }] }; } },
    bignumber: { label: 'Big number', about: 'One big number with its chart', make: function (k) {
      var I = ind(k), ch = I.chart || { kpis: [['Orders today', '312']], views: [{ bars: [['Mon', 12], ['Tue', 18], ['Wed', 15]] }] }, kp = (ch.kpis || [])[0] || ['Today', '—'];
      return { visual: 'bignumber', name: I.name + ' · big number', head: 'One number|*worth watching.*', sub: ch.title ? ch.title + ', live from the records your team already keeps.' : 'Live from the records your team already keeps.',
        stat: { value: kp[1], label: kp[0] + ' · demo data' }, chart: { kind: 'bar', title: ch.title || 'This week', data: (ch.views[0].bars || []).slice(0, 6) }, chip: { text: 'Updated as you work', small: 'No month-end export', icon: 'chart' } }; } },
    proof: { label: 'TechNext in numbers', about: 'The three approved company figures', make: function () {
      return { visual: 'proof', name: 'TechNext in numbers', head: 'Trusted across|*the region.*', sub: 'TechNext implements Odoo and builds AI for companies across Singapore and Southeast Asia.', pills: ['Odoo Partner', 'Singapore HQ'], nexi: 'celebrate' }; } }
  };
  window.TNStarters = S;
})();
