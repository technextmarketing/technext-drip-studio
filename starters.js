/* TechNext Drip Studio — starter scenes for "New drip" (no Claude needed). Each one tells one story from
   the technext.asia content and is composed like a generated post, so it can be restyled the same way. */
(function () {
  'use strict';
  var C = window.TN_CONTENT || {};
  function ind(k) { return (C.industries || {})[k] || C.industries.retail; }
  function headFrom(t) { t = (t || '').replace(/\.$/, ''); var i = t.lastIndexOf(', '); return i > 0 ? t.slice(0, i + 1) + '|*' + t.slice(i + 2) + '.*' : t + '.'; }

  var S = {
    flow: { label: 'Workflow across apps', about: "The industry's steps as one flow, with the first step's Odoo screen", make: function (k) {
      var I = ind(k), f = (I.flow || []).slice(0, 5);
      return { name: I.name + ' · workflow', head: headFrom(I.flow_title), sub: 'The steps ' + I.noun + ' run every day, each in its own Odoo app, on one database.',
        hero: { type: 'steps', dir: 'h', items: f.map(function (x) { return [x.app || '', x.t, x.h]; }), hot: 0 },
        support: [{ type: 'window', app: f[0] && f[0].app || 'purchase', view: 'list', crumbs: [f[0] ? f[0].t : 'Orders'], cols: ['Reference', 'Partner', 'Total', 'Status'], rows: [['P00088', 'Sample Supplier', 'S$ 1,240.00', 'Confirmed'], ['P00089', 'Sample Foods', 'S$ 860.00', 'Draft'], ['P00090', 'Sample Trading', 'S$ 2,310.00', 'Done']], highlight: 0 }],
        accents: [{ type: 'pill', text: 'One database' }], look: { layout: 'top', camera: 'iso-l', bg: 'floor', palette: 'blue' } }; } },
    quote: { label: 'Quote to paid', about: 'A sales order form and the payment that follows', make: function () {
      return { name: 'Quote to paid', head: 'Quote in the morning.|*Paid by lunch.*', sub: 'Customers sign and pay the Odoo quotation online, and the invoice follows the sales order.',
        hero: { type: 'window', app: 'sale', view: 'form', crumbs: ['Quotations', 'S00118'], status: ['Quotation', 'Quotation Sent', 'Sales Order'], statusAt: 2, buttons: ['Create Invoice', 'Send by Email'], record: 'S00118', fields: [['Customer', 'Sample Trading Pte Ltd'], ['Validity', '15 Oct 2026'], ['Payment terms', 'Immediate'], ['Signed by', 'A. Tan']], highlight: ['Signed by'], lines: [['Office chair', '10', 'S$ 180.00', 'S$ 1,800.00'], ['Standing desk', '4', 'S$ 620.00', 'S$ 2,480.00']], total: 'S$ 4,665.20' },
        support: [{ type: 'notif', app: 'account', title: 'Invoice INV/2026/0142 paid', text: 'S$ 4,665.20 received online', time: '11:52' }], links: [{ from: 'hero', to: 's0', label: 'Paid online' }],
        accents: [{ type: 'chip', text: 'Signed online', icon: 'check' }], look: { layout: 'left', camera: 'iso-r', bg: 'aurora', palette: 'blue' } }; } },
    pipeline: { label: 'CRM pipeline', about: 'Opportunities by stage, with the funnel', make: function () {
      return { name: 'CRM pipeline', head: 'Every lead,|*one pipeline.*', sub: 'Odoo CRM shows every opportunity by stage, so nobody chases a deal twice.',
        hero: { type: 'window', app: 'crm', view: 'kanban', crumbs: ['Pipeline'], menus: ['Sales', 'Leads', 'Reporting'], stages: [['New', [['Office fit-out', 'Sample Build Co', 'S$ 18,000', 'KL'], ['POS for 3 outlets', 'Sample Cafe', 'S$ 9,400', 'MT']]], ['Qualified', [['Warehouse barcodes', 'Sample Logistics', 'S$ 12,500', 'RS']]], ['Proposition', [['Payroll + HR', 'Sample Clinic', 'S$ 7,200', 'JW'], ['Online store', 'Sample Retail', 'S$ 15,800', 'AN']]], ['Won', [['Accounting', 'Sample Foods', 'S$ 11,000', 'LT']]]], highlight: ['2.1'] },
        support: [{ type: 'graph', kind: 'funnel', title: 'Pipeline this month', data: [['Leads', 48], ['Qualified', 26], ['Proposition', 14], ['Won', 6]] }],
        accents: [{ type: 'pill', text: 'Drag to Won' }], look: { layout: 'right', camera: 'tilt-l', bg: 'grid', palette: 'violet' } }; } },
    aibill: { label: 'AI reads the bill', about: 'The vendor bill form filled by AI from the PDF', make: function () {
      return { name: 'AI vendor bill', head: 'The bill reads itself.|*You just approve.*', sub: 'AI inside Odoo reads the supplier PDF, fills the vendor bill and matches the purchase order.',
        hero: { type: 'window', app: 'accountant', view: 'form', crumbs: ['Vendor Bills', 'BILL/2026/0311'], status: ['Draft', 'Posted'], statusAt: 0, buttons: ['Confirm'], record: 'Draft Bill', fields: [['Vendor', 'Sample Seafood Pte Ltd'], ['Bill date', '24 Sep 2026'], ['Reference', 'INV-88213'], ['Purchase order', 'P00088']], highlight: ['Vendor', 'Bill date', 'Reference', 'Purchase order'], ai: true, lines: [['Prawns 2 kg', '6', 'S$ 32.00', 'S$ 192.00'], ['Salmon fillet', '4', 'S$ 28.50', 'S$ 114.00']], total: 'S$ 333.54', chatter: 'Odoo AI filled 4 fields from the PDF and matched P00088. Waiting for your approval.' },
        support: [{ type: 'receipt', vendor: 'Sample Seafood Pte Ltd', doc: 'TAX INVOICE', lines: [['Prawns 2 kg ×6', '192.00'], ['Salmon fillet ×4', '114.00'], ['GST 9%', '27.54']], total: 'S$ 333.54', stamp: 'SCANNED' }],
        links: [{ from: 's0', to: 'hero', label: 'AI reads the PDF' }], accents: [{ type: 'nexi', pose: 'point' }], look: { layout: 'top', camera: 'iso-l', bg: 'rays', palette: 'sky', logo: 'bl' } }; } },
    dashboard: { label: 'Industry dashboard', about: "The industry's reporting dashboard from the website", make: function (k) {
      var I = ind(k), ch = I.chart || { title: 'Sales by week', kpis: [], views: [{ bars: [] }] };
      return { name: I.name + ' · dashboard', head: 'Your numbers,|*live from Odoo.*', sub: ch.title + ' and the numbers behind it, straight from the records your team already keeps.',
        hero: { type: 'window', app: 'spreadsheet_dashboard', view: 'dashboard', appLabel: 'Dashboards', crumbs: ['Dashboards', ch.title], kpis: (ch.kpis || []).slice(0, 3), chart: { kind: 'bar', title: ch.title, data: (ch.views[0].bars || []).slice(0, 7), highlight: 1 } },
        support: [], accents: [{ type: 'pill', text: 'Live, not month-end' }, { type: 'nexi', pose: 'celebrate' }], look: { layout: 'top', camera: 'low', bg: 'mesh', palette: 'slate' } }; } },
    pos: { label: 'POS to kitchen', about: 'The restaurant POS and the kitchen display', make: function () {
      return { name: 'POS to kitchen', head: 'The order hits the kitchen|*before the waiter walks back.*', sub: 'Odoo POS sends every table order straight to the kitchen display, so nothing is lost on paper.',
        hero: { type: 'window', app: 'pos_restaurant', view: 'pos', appLabel: 'Point of Sale', table: 'Table 12 · 4 guests', products: [['Laksa', 'S$ 9.50'], ['Chicken rice', 'S$ 7.80'], ['Satay (10)', 'S$ 12.00'], ['Iced lemon tea', 'S$ 3.20'], ['Kaya toast', 'S$ 4.50'], ['Teh tarik', 'S$ 2.80']], order: [['Laksa', '2', 'S$ 9.50', 'S$ 19.00'], ['Chicken rice', '1', 'S$ 7.80', 'S$ 7.80'], ['Iced lemon tea', '3', 'S$ 3.20', 'S$ 9.60']], total: 'S$ 36.40', btn: 'Order' },
        support: [{ type: 'window', app: 'pos_restaurant', view: 'kds', frame: false, appLabel: 'Kitchen Display', tickets: [['Table 12', [['Laksa', '2'], ['Chicken rice', '1']], 'Cooking', '2 min'], ['Table 7', [['Satay (10)', '1'], ['Kaya toast', '2']], 'Ready', '6 min']] }],
        links: [{ from: 'hero', to: 's0', label: 'Sent to the kitchen' }], accents: [{ type: 'pill', text: 'No paper tickets' }], look: { layout: 'top', camera: 'tilt-r', bg: 'floor', palette: 'sunrise' } }; } },
    planning: { label: 'Planning board', about: 'Crews on the planning board and the route', make: function () {
      return { name: 'Planning board', head: "Today's jobs,|*on one board.*", sub: 'Odoo Planning shows who works where, and the route each technician drives.',
        hero: { type: 'window', app: 'planning', view: 'planning', crumbs: ['Planning', 'Schedule'], days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], rows: [['Ravi S.', [[0, 2, 'Aircon service'], [3, 1, 'Install']]], ['Mei Ling T.', [[1, 2, 'Repair'], [4, 1, 'Check-up']]], ['Daniel K.', [[0, 1, 'Survey'], [2, 3, 'Maintenance']]]] },
        support: [{ type: 'route', stops: [['Tampines', '09:00'], ['Bedok', '10:30'], ['Marine Parade', '13:00'], ['Katong', '15:00']], hot: 1 }], links: [{ from: 'hero', to: 's0', label: 'Route for Ravi' }],
        look: { layout: 'bottom', camera: 'top', bg: 'dots', palette: 'mint' } }; } },
    offline: { label: 'Offline on the phone', about: 'Odoo 20 offline mode on a phone', make: function () {
      return { name: 'Offline POS', head: 'No signal?|*The till keeps selling.*', sub: 'Odoo keeps taking sales offline and syncs every order when the connection is back.', badge: 'o20',
        hero: { type: 'ophone', app: 'point_of_sale', view: 'pos', crumbs: ['Shop 2'], table: 'Order 0417', products: [['Linen shirt', 'S$ 49'], ['Canvas tote', 'S$ 29'], ['Silk scarf', 'S$ 39'], ['Cap', 'S$ 19']], order: [['Linen shirt', '1', 'S$ 49', 'S$ 49.00'], ['Canvas tote', '2', 'S$ 29', 'S$ 58.00']], total: 'S$ 107.00', btn: 'Payment' },
        support: [{ type: 'notif', app: 'point_of_sale', title: 'Back online', text: '14 orders synced to Odoo', time: 'now' }], accents: [{ type: 'note', text: 'sales lost', strike: true }], look: { layout: 'left', camera: 'dutch', bg: 'navy' } }; } },
    before: { label: 'Before / after', about: "The website's old way vs Odoo table", make: function (k) {
      var I = ind(k);
      return { name: I.name + ' · before and after', head: 'Still doing it|*the old way?*', sub: 'What changes for ' + I.noun + ' when every step runs in one Odoo.',
        hero: { type: 'ba', rows: (I.ba || []).slice(0, 3) }, accents: [{ type: 'nexi', pose: 'think' }, { type: 'pill', text: 'One system' }], look: { layout: 'top', camera: 'front', bg: 'grid', palette: 'mint' } }; } },
    odoo20: { label: 'Odoo 20 changes', about: "What Odoo 20 changes for the industry, from the website", make: function (k) {
      var I = ind(k);
      return { name: 'Odoo 20 · ' + I.name, head: 'What Odoo 20 changes|*for ' + I.noun + '.*', sub: 'Worth testing on a copy of your database before you upgrade.', badge: 'o20',
        hero: { type: 'checklist', title: 'Odoo 20 for ' + I.name, tag: 'New in Odoo 20', items: (I.new20 || []).slice(0, 4) },
        support: [{ type: 'window', app: 'sale', view: 'apps', frame: false, apps: (I.flow || []).map(function (f) { return f.app; }).filter(Boolean).slice(0, 6) }], accents: [{ type: 'nexi', pose: 'present' }], look: { layout: 'left', camera: 'tilt-r', bg: 'rings', palette: 'violet' } }; } },
    website: { label: 'Website we built', about: 'A TechNext-built site, with the chat and the lead it creates', make: function () {
      return { name: 'Website salesperson', head: 'Your website,|*your best salesperson.*', sub: 'TechNext builds fast, mobile-first sites where every inquiry reaches the right person.',
        hero: { type: 'devices', site: 'movewithease' },
        support: [{ type: 'chat', channel: 'web', title: 'Move with Ease', status: 'Website chat', msgs: [['in', 'Do you have a gift voucher for a massage?'], ['out', 'Yes! Pick one online, it arrives by email.']] }, { type: 'notif', app: 'crm', title: 'New lead from the website', text: 'Gift voucher inquiry · assigned to Sales', time: 'now' }],
        links: [{ from: 's0', to: 's1', label: 'Lead created' }], look: { layout: 'top', camera: 'tilt-l', bg: 'rings', palette: 'blue' } }; } },
    chatbot: { label: 'AI chatbot', about: 'A WhatsApp chat answered from Odoo, and the hand-off', make: function () {
      return { name: 'AI chatbot', head: 'Answers at 2am.|*A person by 9.*', sub: 'A TechNext chatbot answers from your Odoo records and hands the chat to your team with the context.',
        hero: { type: 'chat', channel: 'whatsapp', title: 'Sample Store', msgs: [['in', 'Is my order S00231 out for delivery?'], ['bot', 'Yes. It left the warehouse at 8:40 and arrives today before 6pm.'], ['in', 'Can I change the address?'], ['bot', 'I am passing you to our team with this chat.']] },
        support: [{ type: 'window', app: 'helpdesk', view: 'list', crumbs: ['Tickets'], cols: ['Ticket', 'Customer', 'Channel', 'Status'], rows: [['#1042 Change address', 'Sample Buyer', 'WhatsApp', 'New'], ['#1041 Invoice copy', 'Sample Trading', 'Email', 'Done']], highlight: 0 }],
        links: [{ from: 'hero', to: 's0', label: 'Handed to a person' }], accents: [{ type: 'nexi', pose: 'wave' }], look: { layout: 'right', camera: 'iso-r', bg: 'aurora', palette: 'mint' } }; } },
    phases: { label: 'Rollout phases', about: "How TechNext rolls Odoo out for the industry", make: function (k) {
      var I = ind(k);
      return { name: I.name + ' · rollout', head: 'Three phases.|*One Odoo rollout.*', sub: 'How TechNext rolls out Odoo for ' + I.noun + ', from set-up to reporting.',
        hero: { type: 'phases', from: 'industry:' + k }, accents: [{ type: 'pill', text: 'Live in phases' }], look: { layout: 'top', camera: 'iso-r', bg: 'aurora', palette: 'sky' } }; } }
  };
  window.TNStarters = S;
})();
