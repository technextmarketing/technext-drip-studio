/* TechNext Drip Studio — industry profiles written for the studio, for series in the Drive drips folder
   that technext.asia has no industry page for yet: commercial kitchens, IT services and field service.
   They follow the website's format (six-step workflow, before/after table, dashboard, Odoo 20 notes,
   rollout phases) and describe only what Odoo's apps do; no client names, results or prices.
   The Odoo 20 notes come from the technext.asia Odoo 20 article. Loaded after content.js. */
(function () {
  'use strict';
  var C = window.TN_CONTENT = window.TN_CONTENT || {};
  C.industries = C.industries || {};
  var X = {
    kitchen: {
      name: 'Kitchen', noun: 'commercial kitchen companies',
      intro: 'Odoo for commercial kitchen companies runs design-and-build projects, equipment sales and rental, stainless-steel fabrication, installation and maintenance plans on one system: CRM and quotations with e-signature, Manufacturing for fabrication, Inventory for equipment and spare parts, Field Service for installs and service calls, Rental and Subscriptions for rental and maintenance plans, and Accounting.',
      flow_title: 'From site visit to installed kitchen to maintenance plan.',
      flow_lead: 'How a commercial kitchen project moves through Odoo, from the first site visit to the service plan.',
      flow: [
        { app: 'crm', t: 'Lead', h: 'Site visit and head chef brief in CRM', p: 'Every inquiry becomes an opportunity with the site, the kitchen size and the next visit, so sales can see every open project.', odoo: 'CRM · pipeline, activities', was: 'Leads kept in notebooks and chat groups' },
        { app: 'sale', t: 'Quote', h: 'Layout and equipment quoted, signed online', p: 'Quotation templates hold the equipment, fabrication and installation lines, with optional items the owner can tick, and the customer signs online.', odoo: 'Sales · quotation templates, optional products, Sign', was: 'Quotes typed in spreadsheets and emailed as PDFs' },
        { app: 'mrp', t: 'Fabricate', h: 'Stainless steel built to the drawing', p: 'Manufacturing orders take the bill of materials for each counter, sink or hood, and the workshop records each work order as it is done.', odoo: 'Manufacturing · bills of materials, work orders', was: 'Workshop jobs on paper job cards' },
        { app: 'stock', t: 'Deliver', h: 'Equipment and parts picked and delivered', p: 'Equipment, serial numbers and spare parts are reserved for the project and delivered to site with the right paperwork.', odoo: 'Inventory · serial numbers, deliveries', was: 'Stock checked by walking the warehouse' },
        { app: 'industry_fsm', t: 'Install', h: 'Technicians install and get sign-off', p: 'Installers see the job on their phone, fill in the worksheet, add photos and take the customer\'s signature on site.', odoo: 'Field Service · worksheets, signatures', was: 'Install reports on paper, photos in chat groups' },
        { app: 'sale_subscription', t: 'Maintain', h: 'Maintenance plans and service calls', p: 'Maintenance plans renew and invoice on their own; service calls come in as helpdesk tickets and go out as field service jobs.', odoo: 'Subscriptions + Helpdesk · recurring plans, tickets', was: 'Service contracts tracked in a calendar' }
      ],
      ba: [
        ['Quotes', 'Typed in spreadsheets, emailed as PDFs', 'Quotation templates, signed online'],
        ['Fabrication', 'Paper job cards in the workshop', 'Work orders from the bill of materials'],
        ['Spare parts', 'Stock checked by walking the warehouse', 'On-hand quantities and reorder rules per part'],
        ['Installation', 'Photos and sign-off in chat groups', 'Worksheet and customer signature on the phone'],
        ['Maintenance', 'Contracts kept in a calendar', 'Recurring visits and invoices from the plan'],
        ['Rental', 'Rental units tracked in a spreadsheet', 'Rental orders with pickup and return dates']
      ],
      chart: { title: 'Service calls by week', kpis: [['Open service calls', '14'], ['Installs this month', '9'], ['Maintenance plans', '46']], views: [{ label: 'Weeks', unit: 'calls', bars: [['W36', 18], ['W37', 22], ['W38', 17], ['W39', 25], ['W40', 21]] }] },
      new20: [
        'Technicians keep working offline, and changes sync when the connection is back',
        'Field Service moves into Planning: live map, routing, travel fees and worksheets',
        'AI agents can draft a purchase order from an uploaded supplier PDF',
        'Suggested stock levels for reordering rules, from the last 30 days of sales'
      ],
      phases: [
        { h: 'Sell and quote', apps: ['crm', 'sale', 'sign'], items: ['Pipeline and site-visit activities set up', 'Quotation templates for equipment, fabrication and installation', 'E-signature on quotations'] },
        { h: 'Build and install', apps: ['mrp', 'stock', 'industry_fsm'], items: ['Bills of materials for fabricated items', 'Equipment, spare parts and serial numbers in Inventory', 'Installation worksheets and signatures on the phone'] },
        { h: 'Maintain and rent', apps: ['sale_subscription', 'helpdesk', 'sale_renting'], items: ['Maintenance plans that renew and invoice', 'Service calls as tickets and field jobs', 'Rental orders for equipment'] }
      ]
    },
    it: {
      name: 'IT & Tech', noun: 'IT service companies',
      intro: 'Odoo for IT service companies runs quotations, hardware, installations, support tickets and managed-service contracts on one system: CRM and Sales for hardware, licences and labour, Purchase and Inventory with serial numbers, Field Service for on-site installs, Helpdesk with SLA timers, Subscriptions for recurring contracts, Timesheets and Accounting.',
      flow_title: 'From the quote to the install to the support ticket.',
      flow_lead: 'How an IT project and its support contract move through Odoo.',
      flow: [
        { app: 'crm', t: 'Lead', h: 'Inquiry logged with the site details', p: 'Every inquiry becomes an opportunity with the site, the number of users and the systems involved.', odoo: 'CRM · pipeline, activities', was: 'Inquiries scattered across email and chat' },
        { app: 'sale', t: 'Quote', h: 'Hardware, licences and labour in one quote', p: 'One quotation carries the hardware, the licences and the installation hours, with optional items and online signature.', odoo: 'Sales · quotation templates, optional products', was: 'Hardware and labour quoted in separate spreadsheets' },
        { app: 'purchase', t: 'Buy', h: 'Hardware ordered from distributors', p: 'Confirmed quotes raise purchase orders for the hardware, and receipts record each serial number.', odoo: 'Purchase + Inventory · serial numbers', was: 'Serial numbers copied into a spreadsheet' },
        { app: 'industry_fsm', t: 'Install', h: 'Engineers install on site, customer signs', p: 'Engineers get the job on their phone, log the devices installed, add photos and take the customer\'s signature.', odoo: 'Field Service · worksheets, signatures', was: 'Site reports in chat groups' },
        { app: 'helpdesk', t: 'Support', h: 'Tickets with SLA timers', p: 'Support requests from email, the website or chat become tickets with an SLA, assigned to the right engineer.', odoo: 'Helpdesk · SLA policies, teams', was: 'Support requests lost in a shared inbox' },
        { app: 'sale_subscription', t: 'Renew', h: 'Managed-service contracts billed monthly', p: 'Managed-service and licence contracts invoice on their own and remind the team before they renew.', odoo: 'Subscriptions · recurring invoices, renewals', was: 'Renewals tracked in a calendar and missed' }
      ],
      ba: [
        ['Quotes', 'Hardware and labour in separate spreadsheets', 'One quotation with optional items'],
        ['Serial numbers', 'Copied into a spreadsheet', 'Tracked from receipt to installation'],
        ['Site visits', 'Photos and notes in chat groups', 'Field jobs with worksheets and signatures'],
        ['Support', 'Requests in a shared inbox', 'Helpdesk tickets with SLA timers'],
        ['Contracts', 'Renewals tracked by hand', 'Subscriptions that invoice and renew'],
        ['Timesheets', 'Hours guessed at month end', 'Hours logged per ticket and task']
      ],
      chart: { title: 'Tickets by week', kpis: [['Open tickets', '23'], ['Solved this week', '41'], ['Contracts renewing', '8']], views: [{ label: 'Weeks', unit: 'tickets', bars: [['W36', 34], ['W37', 29], ['W38', 38], ['W39', 31], ['W40', 27]] }] },
      new20: [
        'Engineers keep working offline, and changes sync when the connection is back',
        'Field Service moves into Planning: live map, routing, travel fees and worksheets',
        'An MCP connector links AI assistants to the live database, within access rights',
        'AI agents create records, even from an uploaded PDF'
      ],
      phases: [
        { h: 'Sell and buy', apps: ['crm', 'sale', 'purchase'], items: ['Pipeline and quotation templates', 'Hardware, licences and labour as products', 'Purchase orders from confirmed quotes'] },
        { h: 'Install and track', apps: ['stock', 'industry_fsm', 'project'], items: ['Serial numbers from receipt to site', 'Installation jobs with worksheets', 'Projects and timesheets for larger rollouts'] },
        { h: 'Support and renew', apps: ['helpdesk', 'sale_subscription', 'accountant'], items: ['Helpdesk teams and SLA policies', 'Managed-service contracts as subscriptions', 'Recurring invoices to Accounting'] }
      ]
    },
    'field-service': {
      name: 'Field Service', noun: 'field service teams',
      intro: 'Odoo for field service companies plans technicians, routes, on-site worksheets, parts and invoices on one system: requests from the website or Helpdesk, the Planning board and map, Field Service worksheets and signatures, Inventory for parts on the van, and invoicing from the job. In Odoo 20, Field Service moves into Planning.',
      flow_title: 'From the request to the route to the invoice.',
      flow_lead: 'How one service job moves through Odoo, from the customer\'s request to the paid invoice.',
      flow: [
        { app: 'helpdesk', t: 'Request', h: 'Job booked from the website or a ticket', p: 'Customers book a visit online or open a ticket, and the request becomes a job with the address and the equipment.', odoo: 'Helpdesk + Website · request form', was: 'Requests taken by phone and written on paper' },
        { app: 'planning', t: 'Schedule', h: 'Technicians planned on one board', p: 'The planning board shows who is free, with skills and travel time, and a job moves with one drag.', odoo: 'Planning · shifts, roles', was: 'A whiteboard in the office' },
        { app: 'planning', t: 'Route', h: 'The day\'s jobs on the live map', p: 'Each technician sees the day\'s jobs in order on the map, with directions and travel fees.', odoo: 'Planning · live map, routing (Odoo 20)', was: 'Addresses sent one by one in chat' },
        { app: 'industry_fsm', t: 'Work', h: 'Worksheet, photos and signature on site', p: 'The technician fills in the worksheet, adds photos, notes the parts used and takes the customer\'s signature.', odoo: 'Field Service · worksheets, signatures', was: 'Paper job sheets typed in later' },
        { app: 'stock', t: 'Parts', h: 'Parts used come off the van stock', p: 'Parts used on the job come off the van\'s stock location, and reordering rules refill it.', odoo: 'Inventory · locations, reordering rules', was: 'Van stock counted at month end' },
        { app: 'accountant', t: 'Invoice', h: 'Invoice sent from the finished job', p: 'Time, parts and travel go onto the invoice from the job, sent the same day.', odoo: 'Accounting · invoicing from tasks', was: 'Invoices typed from job sheets a week later' }
      ],
      ba: [
        ['Requests', 'Taken by phone, written on paper', 'Booked online or from a ticket'],
        ['Scheduling', 'A whiteboard in the office', 'The planning board, one drag to move'],
        ['Routes', 'Addresses sent in chat', 'The day\'s jobs on the live map'],
        ['Job sheets', 'Paper, typed in later', 'Worksheet and signature on the phone'],
        ['Van stock', 'Counted at month end', 'Parts used come off the van\'s stock'],
        ['Invoicing', 'A week after the job', 'Sent from the finished job']
      ],
      chart: { title: 'Jobs done by day', kpis: [['Jobs today', '38'], ['Technicians out', '12'], ['First-visit fixes', '31']], views: [{ label: 'Days', unit: 'jobs', bars: [['Mon', 34], ['Tue', 41], ['Wed', 38], ['Thu', 44], ['Fri', 36]] }] },
      new20: [
        'Field Service moves into Planning: live map, routing preferences, travel fees, the website request form and worksheets',
        'Technicians keep working offline, and changes sync when the connection is back',
        'If your technicians use Field Service today, test the upgrade on a copy of your database first',
        'A better phone experience: a swipe-down command palette and better forms on touchscreens'
      ],
      phases: [
        { h: 'Requests and planning', apps: ['helpdesk', 'planning', 'website'], items: ['Website request form and helpdesk teams', 'Technicians, skills and shifts on the planning board', 'Service areas and travel fees'] },
        { h: 'On site', apps: ['industry_fsm', 'stock'], items: ['Worksheets and signatures on the phone', 'Van stock locations and parts', 'Photos and notes on every job'] },
        { h: 'Billing and reporting', apps: ['accountant', 'spreadsheet_dashboard'], items: ['Invoices from finished jobs', 'Jobs, travel and first-visit fixes on a dashboard', 'Maintenance contracts that renew'] }
      ]
    }
  };
  Object.keys(X).forEach(function (k) { if (!C.industries[k]) C.industries[k] = X[k]; });
  C.extraIndustries = Object.keys(X);
})();
