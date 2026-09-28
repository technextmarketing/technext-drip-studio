/* Content library for the TechNext Drip Studio, exported from the live technext.asia source
   (_src/industries.py, _src/app_flows.py, assets/js/demo-o20.js, _src/sitedata.py). Re-export with tools/export_content.py. */
window.TN_CONTENT = {
"industries": {
"retail": {
"name": "Retail",
"noun": "retailers",
"intro": "Odoo for retail connects the till, stock, purchasing, the online store and accounting in one database. Every sale at any store moves stock, reorders are raised from minimum levels, and each day's takings post to the books without a spreadsheet in between.",
"flow_title": "From supplier to till to the books, in one system.",
"flow_lead": "Six steps every retailer runs, and where each one lives in Odoo. Pick a step to see what changes.",
"flow": [
{
"app": "purchase",
"t": "Buy",
"h": "Suppliers ordered from stock rules",
"p": "Minimum-stock rules at each store raise purchase orders with the vendor's price and lead time, so buyers approve orders instead of walking the shelves.",
"odoo": "Purchase · reordering rules, vendor pricelists",
"was": "A weekly stock walk and a reorder spreadsheet"
},
{
"app": "stock",
"t": "Receive",
"h": "Goods scanned in, stock live",
"p": "Receipts are scanned with a barcode device. Stock at that store updates at once, and the vendor bill is matched to what actually arrived.",
"odoo": "Inventory + Barcode · receipts, three-way match",
"was": "Delivery notes filed, stock updated later"
},
{
"app": "stock",
"t": "Move",
"h": "Transfers between stores",
"p": "A store short of an item requests it from another. The transfer shows in both stores until it is received, so nothing goes missing in between.",
"odoo": "Inventory · transfers between warehouses",
"was": "Messages between store managers"
},
{
"app": "point_of_sale",
"t": "Sell",
"h": "Sell at the till, even offline",
"p": "The Point of Sale keeps selling when the internet drops and syncs later. Barcodes, promotions, loyalty and gift cards run at the till, and every sale moves stock.",
"odoo": "Point of Sale · offline selling, loyalty",
"was": "A standalone till system"
},
{
"app": "website_sale",
"t": "Online",
"h": "The same stock online",
"p": "The online store sells the same products with live stock, and store-pickup orders reserve items at the chosen store.",
"odoo": "eCommerce · shared catalogue and stock",
"was": "A separate web shop with its own stock count"
},
{
"app": "accountant",
"t": "Close",
"h": "Takings posted, settlements matched",
"p": "Closing a POS session posts sales, taxes and payment methods to Accounting. Card settlements are matched from the bank feed.",
"odoo": "Accounting · POS journals, bank reconciliation",
"was": "Z-reports typed in every evening"
}
],
"ba": [
[
"Daily takings",
"Z-report typed into accounting each evening",
"POS session closes to a journal entry"
],
[
"Stock on hand",
"Counted per store, merged in a spreadsheet",
"Live per store and online"
],
[
"Reordering",
"Buyer walks the shelves and emails suppliers",
"Reordering rules raise purchase orders"
],
[
"Store transfers",
"Arranged by message, counts drift",
"Transfer documents both stores can see"
],
[
"Promotions",
"Set up separately on each till",
"One loyalty and promotion setup for every store"
],
[
"Card settlements",
"Ticked off against bank statements",
"Matched from the bank feed"
]
],
"chart": {
"title": "Sales by store",
"kpis": [
[
"Takings today",
"S$ 18.4k"
],
[
"Items below minimum",
"12"
],
[
"Transfers in transit",
"4"
]
],
"shared": true,
"views": [
{
"label": "This week",
"unit": "S$k",
"bars": [
[
"Store A",
42.6
],
[
"Store B",
35.2
],
[
"Store C",
27.9
],
[
"Online",
18.4
]
]
},
{
"label": "Last week",
"unit": "S$k",
"bars": [
[
"Store A",
39.1
],
[
"Store B",
36.8
],
[
"Store C",
25.4
],
[
"Online",
15.2
]
]
}
],
"reports": [
"POS sales by store, product and hour",
"Margin by product and category",
"Stock valuation per location",
"Best and slowest sellers"
]
},
"new20": [
"Snooze products to make them temporarily unavailable on the POS or the self-ordering menu",
"Take several currencies at checkout in the same point of sale",
"Suggested minimum and maximum stock levels for reordering rules, from demand history",
"A stock aging report, and loyalty points that can expire"
]
},
"fnb": {
"name": "F&B",
"noun": "restaurants and cafés",
"intro": "Odoo for F&B runs the front and back of a restaurant on one system: Point of Sale for tables, takeaway and self-ordering, a kitchen display, recipes that deduct ingredients, purchasing for the central kitchen, and each outlet's takings posted to Accounting.",
"flow_title": "From the supplier to the table to the books.",
"flow_lead": "How an order and its ingredients move through a restaurant group in Odoo. Pick a step to see what changes.",
"flow": [
{
"app": "purchase",
"t": "Buy",
"h": "Ingredients ordered from par levels",
"p": "Reordering rules at each outlet and the central kitchen raise purchase orders from par levels, with each supplier's prices and delivery days.",
"odoo": "Purchase · reordering rules, supplier pricelists",
"was": "Daily orders phoned or messaged to suppliers"
},
{
"app": "mrp",
"t": "Prep",
"h": "Central kitchen batches",
"p": "Sauces, doughs and prepared items run as manufacturing orders from recipes (bills of materials), so ingredient use and cost are recorded.",
"odoo": "Manufacturing · recipes and batch production",
"was": "Prep sheets on paper, costs guessed"
},
{
"app": "stock",
"t": "Deliver",
"h": "Outlets replenished",
"p": "Transfers move prepared items and dry goods from the central kitchen to each outlet. Outlet stock updates when the delivery is received.",
"odoo": "Inventory · transfers between outlets",
"was": "Delivery lists and phone calls"
},
{
"app": "pos_restaurant",
"t": "Serve",
"h": "Tables, takeaway and self-ordering",
"p": "The restaurant POS handles floor plans, split bills and tips. Guests can order from a kiosk or a QR code at the table, and orders go straight to the kitchen.",
"odoo": "Point of Sale · floor plans, self-ordering",
"was": "Handwritten tickets and a separate ordering app"
},
{
"app": "pos_restaurant",
"t": "Cook",
"h": "Kitchen display and printers",
"p": "Orders appear on the kitchen display or print at the right station, with the guest's notes. Selling a dish deducts its ingredients through its recipe.",
"odoo": "Point of Sale · kitchen display, preparation printers",
"was": "Shouted orders and lost tickets"
},
{
"app": "accountant",
"t": "Close",
"h": "Takings and food cost per outlet",
"p": "Closing each POS session posts sales, taxes and payments per outlet, and food cost shows from recipe usage against sales.",
"odoo": "Accounting · outlet journals, cost of sales",
"was": "Z-reports and supplier invoices keyed in by hand"
}
],
"ba": [
[
"Orders to the kitchen",
"Paper tickets or a separate app",
"Sent from the POS to the kitchen display"
],
[
"Delivery platforms",
"A tablet per platform, orders re-keyed",
"GrabFood orders arrive in the POS"
],
[
"Ingredient stock",
"Counted weekly, usage guessed",
"Deducted through recipes as dishes sell"
],
[
"Supplier orders",
"Messaged daily from memory",
"Raised from par levels per outlet"
],
[
"Food cost",
"Worked out at month-end, if at all",
"Visible per dish and per outlet"
],
[
"Outlet takings",
"Z-reports typed into accounting",
"POS sessions post to the books"
]
],
"chart": {
"title": "Covers by hour",
"kpis": [
[
"Covers today",
"312"
],
[
"Average bill",
"S$ 38.50"
],
[
"Food cost",
"29.4%"
]
],
"shared": true,
"views": [
{
"label": "Weekday",
"unit": "covers",
"bars": [
[
"11am",
18
],
[
"12pm",
64
],
[
"1pm",
58
],
[
"2pm",
22
],
[
"6pm",
30
],
[
"7pm",
71
],
[
"8pm",
66
],
[
"9pm",
34
]
]
},
{
"label": "Weekend",
"unit": "covers",
"bars": [
[
"11am",
26
],
[
"12pm",
82
],
[
"1pm",
79
],
[
"2pm",
41
],
[
"6pm",
44
],
[
"7pm",
90
],
[
"8pm",
88
],
[
"9pm",
52
]
]
}
],
"reports": [
"Sales by outlet, dish and hour",
"Food cost per dish from recipes",
"Top and slowest dishes",
"Payment methods and tips per session"
]
},
"new20": [
"Snooze a dish to take it off the POS or self-ordering menu for a while",
"Print an order-specific QR code so guests can order, then pay after the meal",
"Self-ordering notes show on the kitchen display, and optional products appear on mobile and kiosk",
"Print one preparation ticket per product with Split per product"
]
},
"manufacturing": {
"name": "Manufacturing",
"noun": "manufacturers",
"intro": "Odoo for manufacturing connects bills of materials, work orders, the shop floor, quality checks, maintenance and purchasing to Inventory and Accounting, so every finished unit carries its real cost and every component can be traced back to its supplier.",
"flow_title": "From sales order to finished goods, costed.",
"flow_lead": "How an order becomes a product in Odoo, and what each step replaces. Pick a step to see the detail.",
"flow": [
{
"app": "sale",
"t": "Order",
"h": "Sales order in",
"p": "A confirmed sales order reserves stock or triggers production, depending on the route you choose for the product: make to order or make to stock.",
"odoo": "Sales · make-to-order and make-to-stock routes",
"was": "Orders printed and walked to production"
},
{
"app": "mrp",
"t": "Plan",
"h": "Production planned on capacity",
"p": "Manufacturing orders are scheduled against work center capacity, and the Master Production Schedule plans ahead from forecasts.",
"odoo": "Manufacturing · work centers, MPS",
"was": "A whiteboard and a spreadsheet"
},
{
"app": "purchase",
"t": "Source",
"h": "Components bought on time",
"p": "Missing components raise purchase orders from reordering rules or straight from the manufacturing order, using each vendor's lead time.",
"odoo": "Purchase · reordering rules, vendor lead times",
"was": "Shortages found on the day"
},
{
"app": "mrp",
"t": "Make",
"h": "The shop floor, on a tablet",
"p": "Operators follow work orders on a tablet, record quantities with barcodes and log their time. With continuous production in Odoo 20, the next operation can start as soon as some units are ready.",
"odoo": "Shop Floor · work orders, barcodes",
"was": "Paper travellers and end-of-shift tallies"
},
{
"app": "quality_control",
"t": "Check",
"h": "Quality checks in the flow",
"p": "Quality control points trigger checks at receipt, during operations or before delivery. Failed checks raise quality alerts for follow-up.",
"odoo": "Quality · control points, alerts, worksheets",
"was": "Checks on clipboards, filed later"
},
{
"app": "accountant",
"t": "Cost",
"h": "The real cost of each order",
"p": "Component, work center and extra costs roll up to each manufacturing order, and stock valuation posts to Accounting automatically.",
"odoo": "Accounting · stock valuation, order costing",
"was": "Standard costs updated once a year"
}
],
"ba": [
[
"Production plan",
"Whiteboard updated by the planner",
"Work orders scheduled on work center capacity"
],
[
"Material shortages",
"Found when the line stops",
"Visible before the order starts, purchases raised"
],
[
"Shop floor records",
"Paper travellers typed in later",
"Quantities and time recorded at the work center"
],
[
"Traceability",
"Searching through batch sheets",
"Lots and serials traced from supplier to customer"
],
[
"Quality checks",
"Clipboards filed in a drawer",
"Control points on receipts, operations and deliveries"
],
[
"Product cost",
"Estimated once a year",
"Actual cost per manufacturing order"
]
],
"chart": {
"title": "Output by work center",
"kpis": [
[
"Orders in progress",
"18"
],
[
"On-time completion",
"94%"
],
[
"Scrap this week",
"1.8%"
]
],
"shared": true,
"views": [
{
"label": "Planned",
"unit": "units",
"bars": [
[
"Cutting",
420
],
[
"Welding",
310
],
[
"Assembly",
360
],
[
"Painting",
260
],
[
"Packing",
280
]
]
},
{
"label": "Done",
"unit": "units",
"bars": [
[
"Cutting",
398
],
[
"Welding",
296
],
[
"Assembly",
341
],
[
"Painting",
233
],
[
"Packing",
279
]
]
}
],
"reports": [
"Production analysis by work center and product",
"Overall equipment effectiveness (OEE) per work center",
"Cost analysis per manufacturing order",
"Quality alerts and check results"
]
},
"new20": [
"Continuous production: record quantities on work orders so the next operation starts as soon as some units are ready",
"Split an ongoing manufacturing order and produce the remaining amount later",
"Compare bills of materials to see what changed, in PLM",
"Scan a work center's barcode to select it on the shop floor, and see each vendor's quality rate"
]
},
"construction": {
"name": "Construction",
"noun": "contractors",
"intro": "Odoo for construction runs each job as a project with its own budget, purchases, timesheets and progress billing, so you see cost to date against budget and invoice milestones without rebuilding spreadsheets. Site teams work from their phones, and in Odoo 20 even offline.",
"flow_title": "From tender to final claim, job by job.",
"flow_lead": "How a contract runs through Odoo, from winning it to billing it. Pick a step to see what changes.",
"flow": [
{
"app": "crm",
"t": "Win",
"h": "Tender to contract",
"p": "Opportunities track tenders. The accepted quotation becomes the contract value, with milestones for progress billing.",
"odoo": "CRM + Sales · quotations with milestones",
"was": "Tender files in folders, values in email"
},
{
"app": "project",
"t": "Set up",
"h": "Each job becomes a project",
"p": "Every job gets a project with stages, tasks and an analytic budget, so every cost and hour lands against the right job.",
"odoo": "Project · analytic budget per job",
"was": "A job spreadsheet per project"
},
{
"app": "purchase",
"t": "Buy",
"h": "Materials and subcontractors",
"p": "Purchase orders for materials, plant hire and subcontractors are coded to the job, and bills are matched to what was delivered.",
"odoo": "Purchase · analytic distribution per job",
"was": "Supplier invoices allocated at month-end"
},
{
"app": "planning",
"t": "Site",
"h": "Crews and site work",
"p": "Crews are scheduled in Planning. In Odoo 20, field work lives in Planning with a live map, and site teams can keep working offline.",
"odoo": "Planning · field service, offline mode",
"was": "Group chats and paper timesheets"
},
{
"app": "hr_timesheet",
"t": "Track",
"h": "Hours and progress",
"p": "Site timesheets record labour against tasks, and progress notes and photos are logged on the task for the office to see.",
"odoo": "Timesheets · hours against tasks",
"was": "Timesheets collected weekly on paper"
},
{
"app": "accountant",
"t": "Bill",
"h": "Progress claims and job P&L",
"p": "Milestones are invoiced as they are reached, and the project overview shows budget, cost to date and margin for each job.",
"odoo": "Sales + Accounting · milestone invoicing, job P&L",
"was": "Progress claims built in Excel"
}
],
"ba": [
[
"Job cost",
"Pieced together at month-end",
"Live per job: materials, labour, subcontractors"
],
[
"Progress claims",
"Built in a spreadsheet each month",
"Milestones invoiced from the contract"
],
[
"Site timesheets",
"Paper sheets collected weekly",
"Logged on phones against tasks"
],
[
"Purchase orders",
"Emailed with no job reference",
"Coded to the job, bills matched to delivery"
],
[
"Drawings and contracts",
"Spread across shared drives",
"Attached to the project, signed in Sign"
],
[
"Crew schedule",
"A group chat and a whiteboard",
"Planned in Planning, visible on a map"
]
],
"chart": {
"title": "Budget and cost to date by job",
"kpis": [
[
"Active jobs",
"9"
],
[
"Unbilled milestones",
"S$ 412k"
],
[
"Hours logged this week",
"1,284"
]
],
"views": [
{
"label": "Budget vs cost",
"unit": "S$k",
"legend": [
"Budget",
"Cost to date"
],
"pairs": [
[
"Tower A",
1200,
860
],
[
"Retail fit-out",
340,
310
],
[
"Warehouse",
780,
520
],
[
"Condo renovation",
220,
204
],
[
"School block",
960,
610
]
]
},
{
"label": "Margin",
"unit": "%",
"bars": [
[
"Tower A",
18
],
[
"Retail fit-out",
9
],
[
"Warehouse",
21
],
[
"Condo renovation",
7
],
[
"School block",
16
]
]
}
],
"reports": [
"Project overview: budget, cost to date and margin",
"Timesheets by job, task and employee",
"Purchases and subcontractor bills by job",
"Milestones invoiced and still to bill"
]
},
"new20": [
"Field Service merged into Planning, with a live map of technicians and a map view of shift locations",
"Offline mode: create and edit records on site without a connection",
"Project roles, and customer access to a project in the portal without adding them as followers",
"Automated signature requests, and billing targets versus billable time in the Timesheets dashboard"
]
},
"medical": {
"name": "Medical",
"noun": "clinics",
"intro": "Odoo for clinics runs the business side of healthcare: online appointments, staff rosters, medicine and consumable stock with lot and expiry tracking, purchasing, the retail counter and accounting per branch. Clinical records stay in your medical record system; Odoo handles everything around them.",
"flow_title": "From booking to billing, branch by branch.",
"flow_lead": "The business flow of a clinic group in Odoo. Pick a step to see what changes.",
"flow": [
{
"app": "appointment",
"t": "Book",
"h": "Online booking",
"p": "Patients book online by doctor, service or branch. Reminders go out automatically and staff calendars stay in sync.",
"odoo": "Appointments · booking pages, reminders",
"was": "Phone bookings in a paper diary"
},
{
"app": "planning",
"t": "Roster",
"h": "Staff rosters",
"p": "Doctors, nurses and front-desk staff are rostered per branch, so bookable slots match who is actually on duty.",
"odoo": "Planning · shifts per branch",
"was": "Rosters in a spreadsheet"
},
{
"app": "stock",
"t": "Stock",
"h": "Medicines and consumables",
"p": "Stock is tracked per branch with lot numbers and expiry dates, and first-expiry-first-out picking keeps older stock moving.",
"odoo": "Inventory · lots, expiry dates, FEFO",
"was": "Expiry dates checked by hand"
},
{
"app": "purchase",
"t": "Buy",
"h": "Supplier orders",
"p": "Reordering rules raise purchase orders to approved suppliers, and receipts record the lot and expiry date at the door.",
"odoo": "Purchase · reordering rules, approved vendors",
"was": "Orders placed from memory"
},
{
"app": "point_of_sale",
"t": "Counter",
"h": "The retail counter",
"p": "The counter sells products through Point of Sale, deducting the right lots from stock.",
"odoo": "Point of Sale · counter sales with lots",
"was": "A separate till"
},
{
"app": "accountant",
"t": "Bill",
"h": "Billing and branch accounts",
"p": "Invoices go to patients, companies or insurers as customers. Payments reconcile from the bank feed and each branch has its own P&L.",
"odoo": "Invoicing + Accounting · analytic per branch",
"was": "Billing re-keyed into accounting"
}
],
"ba": [
[
"Appointments",
"Phone calls and a diary",
"Online booking with reminders"
],
[
"Rosters",
"A spreadsheet per branch",
"Planning linked to bookable slots"
],
[
"Medicine expiry",
"Checked by hand on the shelves",
"Lots and expiry dates tracked, FEFO picking"
],
[
"Stock across branches",
"Unknown until someone counts",
"Live per branch, with transfers"
],
[
"Corporate billing",
"Invoices built in Word",
"Invoices from Odoo with payment links"
],
[
"Branch results",
"Consolidated at year-end",
"P&L per branch in Accounting"
]
],
"chart": {
"title": "Appointments by day",
"kpis": [
[
"Booked online",
"68%"
],
[
"Lots expiring in 60 days",
"23"
],
[
"Unpaid invoices",
"S$ 14.2k"
]
],
"shared": true,
"views": [
{
"label": "This week",
"unit": "visits",
"bars": [
[
"Mon",
142
],
[
"Tue",
128
],
[
"Wed",
136
],
[
"Thu",
120
],
[
"Fri",
151
],
[
"Sat",
98
]
]
},
{
"label": "Last week",
"unit": "visits",
"bars": [
[
"Mon",
131
],
[
"Tue",
125
],
[
"Wed",
129
],
[
"Thu",
118
],
[
"Fri",
139
],
[
"Sat",
92
]
]
}
],
"reports": [
"Bookings by doctor, service and branch",
"Stock expiring by date and branch",
"Revenue by service and branch",
"Aged receivables for corporate clients"
]
},
"new20": [
"Request feedback from patients after their appointments",
"Choosing a doctor or resource now happens on the same page as picking the date",
"Bill line prediction pre-fills supplier bills from their history",
"Customer invoice reminders, sent manually or automatically"
]
},
"travel": {
"name": "Travel",
"noun": "travel businesses",
"intro": "Odoo for travel businesses keeps enquiries, itineraries, supplier costs, deposits and margin in one place. Each booking is a quotation built from supplier services, confirmed with a deposit, paid to suppliers from purchase orders and closed with its real margin, in any currency.",
"flow_title": "From enquiry to margin, trip by trip.",
"flow_lead": "How a booking moves through a travel business in Odoo. Pick a step to see what changes.",
"flow": [
{
"app": "crm",
"t": "Enquire",
"h": "Enquiry in",
"p": "Enquiries from the website, email or WhatsApp land in CRM with travel dates and group size, so nothing lives only in an inbox.",
"odoo": "CRM · pipeline with activities",
"was": "Enquiries scattered across inboxes"
},
{
"app": "sale",
"t": "Quote",
"h": "The itinerary as a quotation",
"p": "Flights, hotels, transfers and tours are products with supplier costs. The quotation shows the client the trip, while your margin stays visible internally.",
"odoo": "Sales · quotation templates, optional extras",
"was": "Itineraries in Word, costs in Excel"
},
{
"app": "account",
"t": "Deposit",
"h": "Deposit by payment link",
"p": "The client signs the quotation online and pays a deposit through a payment link. The balance is invoiced before departure.",
"odoo": "Sales + Invoicing · online signature, down payments",
"was": "Bank transfers chased by email"
},
{
"app": "purchase",
"t": "Book",
"h": "Suppliers booked",
"p": "Supplier services can create purchase orders to hotels, airlines and ground handlers when the trip is confirmed, so every commitment is recorded.",
"odoo": "Purchase · services bought per booking",
"was": "Supplier bookings tracked in a spreadsheet"
},
{
"app": "accountant",
"t": "Pay",
"h": "Supplier bills in any currency",
"p": "Supplier bills are matched to purchase orders and paid in their own currency, and exchange differences post automatically.",
"odoo": "Accounting · multi-currency, exchange differences",
"was": "FX differences worked out by hand"
},
{
"app": "spreadsheet_dashboard",
"t": "Review",
"h": "Margin per trip",
"p": "Each trip shows revenue, supplier cost and margin, and reports compare margin by product line, destination and salesperson.",
"odoo": "Dashboards · margin analysis",
"was": "Margins known long after the trip"
}
],
"ba": [
[
"Enquiries",
"Spread across inboxes and chats",
"One CRM pipeline with dates and group size"
],
[
"Itineraries",
"Word documents rebuilt per client",
"Quotation templates with optional extras"
],
[
"Deposits",
"Transfers chased by email",
"Online signature and payment link on the quote"
],
[
"Supplier bookings",
"A spreadsheet of confirmations",
"Purchase orders linked to the trip"
],
[
"Currencies",
"Rates looked up by hand",
"Multi-currency bills, automatic exchange differences"
],
[
"Margin",
"Worked out after the trip",
"Visible per trip before and after travel"
]
],
"chart": {
"title": "Revenue and margin by product line",
"kpis": [
[
"Open enquiries",
"46"
],
[
"Deposits due this week",
"S$ 38.6k"
],
[
"Average margin",
"13.8%"
]
],
"views": [
{
"label": "Revenue",
"unit": "S$k",
"bars": [
[
"Packages",
420
],
[
"Tailor-made",
280
],
[
"Corporate",
360
],
[
"Groups",
510
],
[
"Events",
190
]
]
},
{
"label": "Margin",
"unit": "S$k",
"bars": [
[
"Packages",
63
],
[
"Tailor-made",
39
],
[
"Corporate",
29
],
[
"Groups",
71
],
[
"Events",
34
]
]
}
],
"reports": [
"Margin by trip, product line and destination",
"Pipeline by stage and travel month",
"Deposits and balances due",
"Supplier spend and open bills by currency"
]
},
"new20": [
"Event combos: one ticket that combines registration with food and beverages, each with its own VAT rate",
"AI agents can create records from an uploaded PDF, such as a supplier confirmation",
"Pay supplier bills individually or in batches with one signature",
"Customer invoice reminders, and bill line prediction for supplier bills"
]
},
"ecommerce": {
"name": "Ecommerce",
"noun": "online sellers",
"intro": "Odoo for ecommerce runs the online store, marketplaces, stock, fulfilment, customer service and accounting on one database. An order placed anywhere reserves stock, ships from the right warehouse and reconciles to its payment without re-keying.",
"flow_title": "From checkout to payout, on one stock.",
"flow_lead": "How an online order moves through Odoo, whichever channel it came from. Pick a step to see what changes.",
"flow": [
{
"app": "website_sale",
"t": "Order",
"h": "Orders from every channel",
"p": "The Odoo store takes orders with live stock, pricelists and promotions, and marketplace orders from Lazada and TikTok arrive in the same place.",
"odoo": "eCommerce · marketplace connectors",
"was": "Orders exported from each channel"
},
{
"app": "account",
"t": "Pay",
"h": "Payment captured",
"p": "Online payments are captured by the payment provider and recorded against the order, and payouts are reconciled in Accounting.",
"odoo": "Payment providers · Accounting",
"was": "Payouts matched by hand"
},
{
"app": "stock",
"t": "Ship",
"h": "Pick, pack and ship",
"p": "The order reserves stock, pickers work from barcode picking lists, and shipping labels come from the carrier integration.",
"odoo": "Inventory + Barcode · carrier labels",
"was": "Printing orders and copying addresses"
},
{
"app": "purchase",
"t": "Restock",
"h": "Restock from demand",
"p": "Reordering rules suggest minimum and maximum levels from sales history in Odoo 20, and raise purchase orders before items run out.",
"odoo": "Purchase · suggested stock levels",
"was": "Stock-outs found by customers"
},
{
"app": "helpdesk",
"t": "Support",
"h": "Returns and support",
"p": "Customer emails become helpdesk tickets. Returns are processed from the delivery with Odoo 20's simpler flow, and refunds post to Accounting.",
"odoo": "Helpdesk + Inventory · returns",
"was": "Returns tracked in an inbox"
},
{
"app": "spreadsheet_dashboard",
"t": "Report",
"h": "Sales by channel",
"p": "Sales and cost of goods roll up by channel and product, so you can see which channel actually makes money.",
"odoo": "Dashboards · sales and margin by channel",
"was": "A monthly spreadsheet built from exports"
}
],
"ba": [
[
"Marketplace orders",
"Downloaded and re-keyed",
"Fetched from Lazada and TikTok into Odoo"
],
[
"Stock across channels",
"Updated by hand, items oversold",
"One stock level synchronised to channels"
],
[
"Shipping labels",
"Copied into carrier websites",
"Printed from the delivery order"
],
[
"Reordering",
"Noticed when an item sells out",
"Suggested min and max levels from demand"
],
[
"Returns",
"Emails and a spreadsheet",
"A return on the delivery, refund in Accounting"
],
[
"Payouts",
"Matched manually",
"Reconciled against orders"
]
],
"chart": {
"title": "Orders by channel",
"kpis": [
[
"Orders today",
"184"
],
[
"Ready to ship",
"62"
],
[
"Items below minimum",
"9"
]
],
"views": [
{
"label": "Orders",
"unit": "orders",
"bars": [
[
"Website",
1240
],
[
"Lazada",
860
],
[
"TikTok",
520
],
[
"Store pickup",
180
]
]
},
{
"label": "Returns",
"unit": "returns",
"bars": [
[
"Website",
38
],
[
"Lazada",
41
],
[
"TikTok",
22
],
[
"Store pickup",
3
]
]
}
],
"reports": [
"Sales by channel, product and country",
"Margin by product after cost of goods",
"Orders waiting to ship, by carrier",
"Returns by product and reason"
]
},
"new20": [
"Suggested minimum and maximum stock levels for reordering rules, from demand history",
"A simpler returns process, with the return wizard removed",
"Loyalty progress bars in the cart, and a minimum order quantity per product",
"The AI Website Assistant, with structured data on by default and AI-assisted SEO"
]
},
"health-wellness": {
"name": "Health & Wellness",
"noun": "studios, spas and gyms",
"intro": "Odoo for health and wellness businesses runs bookings, memberships and retail on one system. Clients book classes or treatments online, memberships renew and bill automatically, the front desk sells products and packages at the Point of Sale, and every payment lands in Accounting.",
"flow_title": "From first booking to renewal.",
"flow_lead": "How a client moves through a studio, spa or gym in Odoo. Pick a step to see what changes.",
"flow": [
{
"app": "appointment",
"t": "Book",
"h": "Online booking",
"p": "Clients book classes, treatments or rooms online by staff member or resource, with capacity limits and reminders.",
"odoo": "Appointments · resources, capacity, reminders",
"was": "Bookings by message"
},
{
"app": "sale_subscription",
"t": "Join",
"h": "Memberships that renew",
"p": "Memberships and class packs run as subscriptions that renew and bill automatically, with upgrades handled on the contract.",
"odoo": "Subscriptions · recurring billing",
"was": "Renewals chased one by one"
},
{
"icon": "usercheck",
"t": "Check in",
"h": "Front desk check-in",
"p": "Members check in at the front desk. In Odoo 20, check-ins can be limited to members, or to specific membership tiers.",
"odoo": "Frontdesk · member entry",
"was": "Names ticked off on a list"
},
{
"app": "point_of_sale",
"t": "Sell",
"h": "Retail and packages",
"p": "The front desk sells products, gift cards and packages at the Point of Sale, and loyalty points and eWallets work across visits.",
"odoo": "Point of Sale · loyalty, gift cards, eWallets",
"was": "A separate till for retail"
},
{
"app": "planning",
"t": "Staff",
"h": "Therapists and instructors",
"p": "Staff schedules decide which slots are bookable, so the online calendar matches who is working.",
"odoo": "Planning · shifts linked to availability",
"was": "Rosters in a spreadsheet"
},
{
"app": "accountant",
"t": "Close",
"h": "Recurring revenue, visible",
"p": "Membership revenue, retail sales and payouts post to Accounting, and subscription reports show recurring revenue and churn.",
"odoo": "Accounting + Subscriptions · MRR, churn",
"was": "Month-end in spreadsheets"
}
],
"ba": [
[
"Bookings",
"Messages, calls and a paper diary",
"Online booking with capacity and reminders"
],
[
"Memberships",
"Renewals chased one by one",
"Subscriptions that bill and renew automatically"
],
[
"Check-in",
"Names ticked off on a list",
"Front desk check-in, members-only if needed"
],
[
"Retail",
"A separate till and stock book",
"Point of Sale with stock and loyalty"
],
[
"Staff schedules",
"Spreadsheets",
"Planning linked to bookable slots"
],
[
"Recurring revenue",
"Unknown until month-end",
"Recurring revenue and churn in reports"
]
],
"chart": {
"title": "Bookings by day",
"kpis": [
[
"Active members",
"1,240"
],
[
"Renewals this month",
"186"
],
[
"Retail sales today",
"S$ 2.3k"
]
],
"views": [
{
"label": "Classes",
"unit": "bookings",
"bars": [
[
"Mon",
86
],
[
"Tue",
92
],
[
"Wed",
88
],
[
"Thu",
95
],
[
"Fri",
78
],
[
"Sat",
124
],
[
"Sun",
102
]
]
},
{
"label": "Treatments",
"unit": "bookings",
"bars": [
[
"Mon",
24
],
[
"Tue",
28
],
[
"Wed",
31
],
[
"Thu",
29
],
[
"Fri",
36
],
[
"Sat",
48
],
[
"Sun",
41
]
]
}
],
"reports": [
"Bookings by service, staff member and day",
"Recurring revenue, renewals and churn",
"Retail sales and stock",
"Staff utilisation from shifts and bookings"
]
},
"new20": [
"Frontdesk member entry: limit check-ins to members, or to specific membership tiers",
"Request feedback from clients after their appointments",
"A default party size and a maximum capacity override for group bookings",
"Expiry dates for loyalty points"
]
}
},
"appFlows": {
"accountant": {
"record": "bank statement line",
"article": "a",
"states": [
[
"feed",
"Imported",
"Bank feed brings the line in"
],
[
"match",
"Matched",
"Reconciliation rules propose the match"
],
[
"rec",
"Reconciled",
"Invoice or bill closed"
],
[
"close",
"Period closed",
"Lock date set after the review"
],
[
"report",
"Reported",
"P&L, balance sheet, GST report"
]
],
"path": [
"feed",
"match",
"rec",
"close",
"report"
],
"branches": [
[
"match",
"feed",
"No match: manual search or write-off"
],
[
"rec",
"match",
"Partial payment: open balance kept"
]
],
"handoffs": [
[
"rec",
"account",
"Invoices and bills marked paid"
],
[
"report",
"spreadsheet_dashboard",
"Finance dashboard refreshed"
]
],
"auto": [
"Bank synchronisation where your bank supports it",
"Reconciliation models for recurring lines",
"Lock dates so closed months stay closed"
]
},
"account": {
"record": "customer invoice",
"article": "a",
"states": [
[
"draft",
"Draft",
"Created from the sales order or by hand"
],
[
"posted",
"Posted",
"Journal entry booked"
],
[
"sent",
"Sent",
"Emailed with a payment link"
],
[
"inpay",
"In payment",
"Payment registered, waiting for the bank"
],
[
"paid",
"Paid",
"Matched on the bank statement"
]
],
"path": [
"draft",
"posted",
"sent",
"inpay",
"paid"
],
"branches": [
[
"sent",
"sent",
"Overdue: follow-up reminder sent"
],
[
"posted",
"draft",
"Reset to draft to correct a mistake"
]
],
"handoffs": [
[
"draft",
"sale",
"Invoiced quantities written back to the order"
],
[
"paid",
"accountant",
"Receivable cleared in the ledger"
],
[
"sent",
"mail",
"Customer sees it in the portal"
]
],
"auto": [
"Invoicing policy per product: on order or on delivery",
"Follow-up levels for overdue invoices",
"Online payment through your payment provider"
]
},
"hr_expense": {
"record": "expense",
"article": "an",
"states": [
[
"draft",
"Draft",
"Receipt photographed, fields filled by OCR"
],
[
"sub",
"Submitted",
"Sent to the manager"
],
[
"appr",
"Approved",
"Manager approves"
],
[
"post",
"Posted",
"Journal entry booked"
],
[
"paid",
"Paid",
"Reimbursed in a batch"
]
],
"path": [
"draft",
"sub",
"appr",
"post",
"paid"
],
"branches": [
[
"sub",
"draft",
"Refused: sent back with a reason"
]
],
"handoffs": [
[
"post",
"accountant",
"Expense and employee payable booked"
],
[
"appr",
"sale",
"Billable expense added to the sales order"
],
[
"paid",
"hr",
"Reimbursement recorded on the employee"
]
],
"auto": [
"Expense categories with accounts and taxes",
"Approval by the employee's manager",
"Company card expenses that need no reimbursement"
]
},
"spreadsheet_dashboard": {
"record": "dashboard",
"article": "a",
"states": [
[
"src",
"Data source",
"Pivot or list from any Odoo app"
],
[
"sheet",
"Spreadsheet",
"Formulas on live Odoo data"
],
[
"dash",
"Dashboard",
"Published for a team"
],
[
"share",
"Shared",
"Access by user group"
],
[
"fresh",
"Refreshed",
"Always the latest data"
]
],
"path": [
"src",
"sheet",
"dash",
"share",
"fresh"
],
"branches": [
[
"fresh",
"sheet",
"New question: add a pivot, keep the sheet"
]
],
"handoffs": [
[
"src",
"sale",
"Sales pivots"
],
[
"src",
"accountant",
"Accounting figures"
],
[
"src",
"stock",
"Stock levels"
]
],
"auto": [
"Ready-made dashboards per app",
"Global filters by period, company and team",
"No exports to keep up to date"
]
},
"documents": {
"record": "document",
"article": "a",
"states": [
[
"in",
"Inbox",
"Arrives by email alias, upload or scan"
],
[
"tag",
"Tagged",
"Workspace and tags set"
],
[
"act",
"Actioned",
"Action run on the file"
],
[
"link",
"Linked",
"Attached to its Odoo record"
],
[
"arch",
"Archived",
"Kept, searchable"
]
],
"path": [
"in",
"tag",
"act",
"link",
"arch"
],
"branches": [
[
"act",
"tag",
"Split a PDF into separate documents"
],
[
"tag",
"arch",
"Not needed: archived"
]
],
"handoffs": [
[
"act",
"account",
"Vendor bill created and digitised"
],
[
"act",
"sign",
"Signature requested"
],
[
"link",
"hr",
"Filed on the employee"
]
],
"auto": [
"Email aliases per workspace",
"Workflow actions: create a bill, request a signature, move",
"Access rules per workspace"
]
},
"sign": {
"record": "signature request",
"article": "a",
"states": [
[
"draft",
"Draft",
"Template with signer roles"
],
[
"sent",
"Sent",
"Email with a secure link"
],
[
"part",
"Partially signed",
"First signer done"
],
[
"signed",
"Fully signed",
"Certificate and audit trail"
],
[
"arch",
"Archived",
"Stored with the record"
]
],
"path": [
"draft",
"sent",
"part",
"signed",
"arch"
],
"branches": [
[
"sent",
"draft",
"Refused by a signer: corrected and resent"
],
[
"sent",
"sent",
"Reminder sent"
]
],
"handoffs": [
[
"signed",
"sale",
"Signed quotation confirms the order"
],
[
"signed",
"hr",
"Signed contract filed on the employee"
],
[
"arch",
"documents",
"Signed PDF in Documents"
]
],
"auto": [
"Templates with roles and fields",
"Signing order for several signers",
"Reminders until signed"
]
},
"crm": {
"record": "opportunity",
"article": "an",
"states": [
[
"new",
"New",
"From a web form, email alias, chat or event list"
],
[
"qual",
"Qualified",
"Need, budget and timing checked"
],
[
"prop",
"Proposition",
"Quotation sent"
],
[
"won",
"Won",
"Deal closed"
],
[
"lost",
"Lost",
"Reason recorded"
]
],
"path": [
"new",
"qual",
"prop",
"won"
],
"branches": [
[
"qual",
"lost",
"Not a fit: lost reason logged"
],
[
"prop",
"qual",
"Needs change: back to qualified"
],
[
"prop",
"lost",
"Lost to a competitor"
]
],
"handoffs": [
[
"won",
"sale",
"Quotation becomes a sales order"
],
[
"new",
"mass_mailing",
"Added to a nurture list"
],
[
"prop",
"sign",
"Quotation sent to sign"
]
],
"auto": [
"Assignment rules by team and territory",
"Lead scoring",
"Scheduled activities per stage"
]
},
"sale": {
"record": "sales order",
"article": "a",
"states": [
[
"quo",
"Quotation",
"From a template, with your pricelist"
],
[
"sent",
"Quotation sent",
"Customer signs or pays online"
],
[
"so",
"Sales order",
"Confirmed, stock reserved"
],
[
"dlv",
"Delivered",
"Warehouse validates the delivery"
],
[
"inv",
"Invoiced",
"Invoice from delivered quantities"
]
],
"path": [
"quo",
"sent",
"so",
"dlv",
"inv"
],
"branches": [
[
"sent",
"quo",
"Customer asks for changes: new version"
],
[
"sent",
"sent",
"Expired: reminder and new validity date"
]
],
"handoffs": [
[
"so",
"stock",
"Delivery order created"
],
[
"inv",
"account",
"Invoice posted"
],
[
"so",
"mrp",
"Make to order: manufacturing order"
]
],
"auto": [
"Quotation templates and optional products",
"Online signature and payment",
"Invoicing policy: on order or on delivery"
]
},
"point_of_sale": {
"record": "POS session",
"article": "a",
"states": [
[
"open",
"Opened",
"Cash float counted"
],
[
"sell",
"Selling",
"Orders paid by cash, card or wallet"
],
[
"clos",
"Closing",
"Cash control and differences"
],
[
"post",
"Posted",
"One journal entry per session"
],
[
"done",
"Closed",
"Stock and sales reported"
]
],
"path": [
"open",
"sell",
"clos",
"post",
"done"
],
"branches": [
[
"sell",
"sell",
"Refund or exchange at the till"
],
[
"clos",
"sell",
"Difference found: recount"
]
],
"handoffs": [
[
"sell",
"stock",
"Stock moves for every product sold"
],
[
"post",
"accountant",
"Sales, payments and taxes posted"
],
[
"sell",
"crm",
"Loyalty points on the customer"
]
],
"auto": [
"Offline mode that syncs when back online",
"Loyalty, promotions and gift cards",
"Payment terminals and receipt printers"
]
},
"pos_restaurant": {
"record": "table order",
"article": "a",
"states": [
[
"seat",
"Seated",
"Table opened on the floor plan"
],
[
"order",
"Ordered",
"Sent to the kitchen display"
],
[
"serve",
"Served",
"Kitchen marks it ready"
],
[
"bill",
"Bill",
"Split by seat or amount"
],
[
"paid",
"Paid",
"Table free again"
]
],
"path": [
"seat",
"order",
"serve",
"bill",
"paid"
],
"branches": [
[
"serve",
"order",
"More dishes ordered"
],
[
"bill",
"bill",
"Bill split between guests"
]
],
"handoffs": [
[
"order",
"mrp",
"Recipe components deducted"
],
[
"paid",
"accountant",
"Session posted at closing"
],
[
"order",
"stock",
"Ingredient stock updated"
]
],
"auto": [
"Floor plans with table status",
"Preparation display per kitchen station",
"Tips and split bills"
]
},
"sale_subscription": {
"record": "subscription",
"article": "a",
"states": [
[
"quo",
"Quotation",
"Plan and recurrence chosen"
],
[
"run",
"In progress",
"Recurring invoices raised"
],
[
"up",
"Upsell",
"Extra seats or options added"
],
[
"renew",
"To renew",
"Renewal quotation sent"
],
[
"churn",
"Churned",
"Closed with a reason"
]
],
"path": [
"quo",
"run",
"up",
"renew",
"run"
],
"branches": [
[
"run",
"churn",
"Cancelled by the customer"
],
[
"renew",
"churn",
"Not renewed"
],
[
"run",
"run",
"Payment failed: retried"
]
],
"handoffs": [
[
"run",
"account",
"Invoice each period"
],
[
"renew",
"crm",
"Renewal opportunity"
],
[
"run",
"spreadsheet_dashboard",
"MRR and churn reported"
]
],
"auto": [
"Recurring plans: monthly, yearly or custom",
"Automatic payment with saved cards",
"Health checks and closing reasons"
]
},
"sale_renting": {
"record": "rental order",
"article": "a",
"states": [
[
"quo",
"Quotation",
"Rental period and pricing"
],
[
"res",
"Reserved",
"Unit booked for the dates"
],
[
"pick",
"Picked up",
"Handed over, serial recorded"
],
[
"ret",
"Returned",
"Checked back in"
],
[
"inv",
"Invoiced",
"Rental and any extras billed"
]
],
"path": [
"quo",
"res",
"pick",
"ret",
"inv"
],
"branches": [
[
"pick",
"pick",
"Late return: late fee added"
],
[
"ret",
"ret",
"Damage found: repair charged"
]
],
"handoffs": [
[
"pick",
"stock",
"Unit moves out of stock"
],
[
"inv",
"account",
"Invoice and deposit handled"
],
[
"res",
"sign",
"Rental agreement signed"
]
],
"auto": [
"Pricing per hour, day or week",
"Availability calendar per product",
"Deposits and late fees"
]
},
"website": {
"record": "visitor",
"article": "a",
"states": [
[
"land",
"Landing",
"Arrives from search, social or email"
],
[
"browse",
"Browsing",
"Pages tracked on the visitor"
],
[
"engage",
"Engaged",
"Chat, form or download"
],
[
"lead",
"Lead",
"Created in CRM with the source"
],
[
"cust",
"Customer",
"Order or signed quotation"
]
],
"path": [
"land",
"browse",
"engage",
"lead",
"cust"
],
"branches": [
[
"browse",
"land",
"Leaves, comes back from an email"
],
[
"engage",
"browse",
"Reads more first"
]
],
"handoffs": [
[
"lead",
"crm",
"Lead with UTM source and pages seen"
],
[
"engage",
"im_livechat",
"Live chat started"
],
[
"cust",
"sale",
"Quotation or order"
]
],
"auto": [
"Forms that create leads, tickets or applicants",
"Visitor tracking and UTM sources",
"SEO fields per page"
]
},
"website_sale": {
"record": "web order",
"article": "a",
"states": [
[
"cart",
"Cart",
"Products with live stock"
],
[
"chk",
"Checkout",
"Address and delivery method"
],
[
"pay",
"Paid",
"Payment provider confirms"
],
[
"so",
"Order",
"Sales order confirmed"
],
[
"ship",
"Shipped",
"Delivery and tracking"
]
],
"path": [
"cart",
"chk",
"pay",
"so",
"ship"
],
"branches": [
[
"cart",
"cart",
"Abandoned: reminder email"
],
[
"pay",
"chk",
"Payment failed: try another method"
]
],
"handoffs": [
[
"so",
"stock",
"Stock reserved, delivery created"
],
[
"so",
"account",
"Invoice after payment"
],
[
"cart",
"mass_mailing",
"Cart recovery email"
]
],
"auto": [
"Payment providers and delivery carriers",
"Pricelists and promotions online",
"Stock shown on the product page"
]
},
"website_blog": {
"record": "blog post",
"article": "a",
"states": [
[
"draft",
"Draft",
"Written in the website editor"
],
[
"seo",
"Optimised",
"Title, meta and cover set"
],
[
"pub",
"Published",
"Live on the blog"
],
[
"promo",
"Promoted",
"Shared by email and social"
],
[
"lead",
"Leads",
"Readers sign up or enquire"
]
],
"path": [
"draft",
"seo",
"pub",
"promo",
"lead"
],
"branches": [
[
"pub",
"draft",
"Update: edited and republished"
]
],
"handoffs": [
[
"promo",
"social",
"Scheduled social posts"
],
[
"promo",
"mass_mailing",
"Newsletter"
],
[
"lead",
"crm",
"Leads from the post"
]
],
"auto": [
"Scheduled publishing",
"Tags and blog categories",
"Visitor tracking to leads"
]
},
"website_forum": {
"record": "forum question",
"article": "a",
"states": [
[
"ask",
"Asked",
"Posted by a user"
],
[
"mod",
"Moderated",
"Checked by karma rules"
],
[
"ans",
"Answered",
"Community or staff reply"
],
[
"acc",
"Accepted",
"Best answer marked"
],
[
"karma",
"Rewarded",
"Karma and badges earned"
]
],
"path": [
"ask",
"mod",
"ans",
"acc",
"karma"
],
"branches": [
[
"mod",
"ask",
"Flagged: edited or closed"
],
[
"ans",
"ans",
"More answers voted up"
]
],
"handoffs": [
[
"ask",
"helpdesk",
"Unanswered question becomes a ticket"
],
[
"acc",
"knowledge",
"Answer turned into an article"
]
],
"auto": [
"Karma levels that unlock moderation",
"Badges and votes",
"Tags and duplicates merged"
]
},
"im_livechat": {
"record": "chat",
"article": "a",
"states": [
[
"vis",
"Visitor",
"Browsing a page"
],
[
"bot",
"Chatbot",
"Answers the first questions"
],
[
"op",
"Operator",
"Handed to a person"
],
[
"conv",
"Conversation",
"Answered in Discuss"
],
[
"rate",
"Rated",
"Visitor rates the chat"
]
],
"path": [
"vis",
"bot",
"op",
"conv",
"rate"
],
"branches": [
[
"bot",
"rate",
"Solved by the chatbot"
],
[
"op",
"op",
"No operator: leave a message"
]
],
"handoffs": [
[
"conv",
"crm",
"Lead created from the chat"
],
[
"conv",
"helpdesk",
"Ticket created"
],
[
"op",
"mail",
"Chat in Discuss"
]
],
"auto": [
"Chatbot scripts",
"Rules by page and country",
"Canned responses"
]
},
"website_slides": {
"record": "course",
"article": "a",
"states": [
[
"pub",
"Published",
"Course on the website"
],
[
"enrol",
"Enrolled",
"Free, invited or paid"
],
[
"learn",
"Learning",
"Lessons and videos"
],
[
"quiz",
"Quizzed",
"Quizzes per lesson"
],
[
"cert",
"Certified",
"Certification passed"
]
],
"path": [
"pub",
"enrol",
"learn",
"quiz",
"cert"
],
"branches": [
[
"quiz",
"learn",
"Failed: retake the lesson"
]
],
"handoffs": [
[
"enrol",
"website_sale",
"Paid course sold online"
],
[
"cert",
"survey",
"Certification survey"
],
[
"learn",
"website_forum",
"Course forum"
]
],
"auto": [
"Paid or free courses",
"Karma and badges",
"Progress per attendee"
]
},
"stock": {
"record": "transfer",
"article": "a",
"states": [
[
"rec",
"Receipt",
"Goods in from the vendor"
],
[
"put",
"Put away",
"To the right location"
],
[
"stk",
"In stock",
"Available to reserve"
],
[
"pick",
"Picked",
"By barcode"
],
[
"ship",
"Shipped",
"Delivery validated"
]
],
"path": [
"rec",
"put",
"stk",
"pick",
"ship"
],
"branches": [
[
"pick",
"stk",
"Short pick: backorder created"
],
[
"stk",
"rec",
"Below minimum: reordering rule"
]
],
"handoffs": [
[
"stk",
"purchase",
"Reordering rule raises an RFQ"
],
[
"ship",
"account",
"Invoice on delivered quantities"
],
[
"rec",
"quality_control",
"Quality check on receipt"
]
],
"auto": [
"Routes: one, two or three steps",
"Reordering rules per warehouse",
"Lots, serial numbers and expiry"
]
},
"mrp": {
"record": "manufacturing order",
"article": "a",
"states": [
[
"draft",
"Draft",
"From demand or a reorder rule"
],
[
"conf",
"Confirmed",
"Components reserved"
],
[
"prog",
"In progress",
"Work orders at work centres"
],
[
"close",
"To close",
"Quantities produced"
],
[
"done",
"Done",
"Finished goods in stock"
]
],
"path": [
"draft",
"conf",
"prog",
"close",
"done"
],
"branches": [
[
"prog",
"prog",
"Scrap recorded on a work order"
],
[
"conf",
"conf",
"Waiting for components"
]
],
"handoffs": [
[
"conf",
"purchase",
"Missing components ordered"
],
[
"prog",
"quality_control",
"Quality checks on operations"
],
[
"done",
"accountant",
"Production cost valued"
]
],
"auto": [
"Multi-level bills of materials",
"Work centres with capacity",
"Backorders and by-products"
]
},
"mrp_plm": {
"record": "engineering change",
"article": "an",
"states": [
[
"new",
"New",
"Change requested"
],
[
"prog",
"In progress",
"New BoM version drafted"
],
[
"appr",
"To approve",
"Reviewers sign off"
],
[
"eff",
"Effective",
"New version applied"
],
[
"done",
"Done",
"Old version archived"
]
],
"path": [
"new",
"prog",
"appr",
"eff",
"done"
],
"branches": [
[
"appr",
"prog",
"Rejected: changes requested"
]
],
"handoffs": [
[
"eff",
"mrp",
"Manufacturing uses the new BoM"
],
[
"prog",
"documents",
"Drawings attached"
],
[
"appr",
"approvals",
"Approval by the right team"
]
],
"auto": [
"BoM versions and revision history",
"Approval stages per change type",
"Effective date for the switch"
]
},
"purchase": {
"record": "purchase order",
"article": "a",
"states": [
[
"rfq",
"RFQ",
"From a reordering rule or by hand"
],
[
"sent",
"RFQ sent",
"Vendor confirms price and date"
],
[
"po",
"Purchase order",
"Confirmed"
],
[
"recv",
"Received",
"Receipt validated"
],
[
"bill",
"Billed",
"Vendor bill matched"
]
],
"path": [
"rfq",
"sent",
"po",
"recv",
"bill"
],
"branches": [
[
"sent",
"rfq",
"Better price from another vendor"
],
[
"recv",
"po",
"Partial receipt: backorder"
]
],
"handoffs": [
[
"po",
"stock",
"Receipt expected"
],
[
"bill",
"account",
"Bill posted to payables"
],
[
"po",
"approvals",
"Approval above a set amount"
]
],
"auto": [
"Vendor pricelists and lead times",
"3-way match: order, receipt, bill",
"Purchase agreements and tenders"
]
},
"maintenance": {
"record": "maintenance request",
"article": "a",
"states": [
[
"new",
"New request",
"Reported by an operator"
],
[
"plan",
"Scheduled",
"Technician and date set"
],
[
"prog",
"In progress",
"Work on the equipment"
],
[
"rep",
"Repaired",
"Back in service"
],
[
"close",
"Closed",
"Downtime recorded"
]
],
"path": [
"new",
"plan",
"prog",
"rep",
"close"
],
"branches": [
[
"prog",
"close",
"Beyond repair: scrapped"
],
[
"close",
"plan",
"Preventive: next date planned"
]
],
"handoffs": [
[
"prog",
"stock",
"Spare parts used"
],
[
"new",
"mrp",
"Work centre blocked"
],
[
"close",
"spreadsheet_dashboard",
"MTBF and downtime"
]
],
"auto": [
"Preventive maintenance by date or usage",
"Equipment per work centre",
"Maintenance teams and calendars"
]
},
"quality_control": {
"record": "quality check",
"article": "a",
"states": [
[
"point",
"Control point",
"On a product or operation"
],
[
"check",
"Check",
"Pass/fail, measure or photo"
],
[
"alert",
"Alert",
"Raised on a failure"
],
[
"act",
"Corrective action",
"Root cause and fix"
],
[
"closed",
"Closed",
"Solved and recorded"
]
],
"path": [
"point",
"check",
"alert",
"act",
"closed"
],
"branches": [
[
"check",
"closed",
"Passed: nothing to do"
]
],
"handoffs": [
[
"check",
"stock",
"Receipts and deliveries checked"
],
[
"check",
"mrp",
"Work order checks"
],
[
"alert",
"maintenance",
"Equipment issue logged"
]
],
"auto": [
"Control points by product, operation or work centre",
"Measurement tolerances",
"Quality alerts with teams and stages"
]
},
"hr": {
"record": "employee",
"article": "an",
"states": [
[
"hire",
"Hired",
"From Recruitment"
],
[
"onb",
"Onboarding",
"Plan of activities"
],
[
"act",
"Active",
"Contract and schedule"
],
[
"chg",
"Changes",
"Role, team or contract updated"
],
[
"off",
"Offboarding",
"Plan and access removed"
]
],
"path": [
"hire",
"onb",
"act",
"chg",
"off"
],
"branches": [
[
"chg",
"act",
"Promotion: new contract"
]
],
"handoffs": [
[
"onb",
"hr_holidays",
"Leave allocation"
],
[
"act",
"hr_payroll",
"Payroll from the contract"
],
[
"off",
"fleet",
"Company car returned"
]
],
"auto": [
"Onboarding and offboarding plans",
"Org chart and departments",
"Documents on the employee record"
]
},
"hr_recruitment": {
"record": "applicant",
"article": "an",
"states": [
[
"new",
"New",
"Applied from the job page"
],
[
"qual",
"Initial qualification",
"CV reviewed"
],
[
"int1",
"First interview",
"Scheduled from the record"
],
[
"int2",
"Second interview",
"Team interview"
],
[
"prop",
"Contract proposal",
"Offer sent"
],
[
"sign",
"Contract signed",
"Hired"
]
],
"path": [
"new",
"qual",
"int1",
"int2",
"prop",
"sign"
],
"branches": [
[
"qual",
"new",
"Refused: kept in the talent pool"
],
[
"int2",
"int1",
"Needs another interview"
]
],
"handoffs": [
[
"sign",
"hr",
"Employee created"
],
[
"prop",
"sign",
"Offer signed online"
],
[
"int1",
"mail",
"Interview invitation sent"
]
],
"auto": [
"Job pages that receive applications",
"Stages per job",
"Email templates for every stage"
]
},
"hr_holidays": {
"record": "time-off request",
"article": "a",
"states": [
[
"sub",
"To submit",
"Employee picks dates"
],
[
"appr",
"To approve",
"Manager notified"
],
[
"second",
"Second approval",
"HR, where needed"
],
[
"ok",
"Approved",
"On the team calendar"
],
[
"taken",
"Taken",
"Deducted from the allocation"
]
],
"path": [
"sub",
"appr",
"second",
"ok",
"taken"
],
"branches": [
[
"appr",
"sub",
"Refused with a reason"
]
],
"handoffs": [
[
"ok",
"hr_payroll",
"Unpaid leave in payroll"
],
[
"ok",
"planning",
"Shifts blocked"
],
[
"appr",
"mail",
"Notification to the manager"
]
],
"auto": [
"Accrual plans for allocations",
"Approval by manager or HR",
"Public holidays per country"
]
},
"hr_appraisal": {
"record": "appraisal",
"article": "an",
"states": [
[
"start",
"To start",
"Scheduled from the plan"
],
[
"sent",
"Appraisal sent",
"Forms to employee and manager"
],
[
"self",
"Self-assessment",
"Employee's view"
],
[
"mgr",
"Manager review",
"Manager's view"
],
[
"done",
"Done",
"Goals set for next period"
]
],
"path": [
"start",
"sent",
"self",
"mgr",
"done"
],
"branches": [
[
"mgr",
"self",
"Discussion: revised together"
]
],
"handoffs": [
[
"done",
"hr",
"Skills and goals updated on the employee"
],
[
"sent",
"survey",
"Feedback forms from colleagues"
]
],
"auto": [
"Appraisal plans after hiring and yearly",
"Goals and skills",
"360 feedback from colleagues"
]
},
"hr_referral": {
"record": "referral",
"article": "a",
"states": [
[
"share",
"Shared",
"Job shared by an employee"
],
[
"apply",
"Applied",
"Friend applies"
],
[
"prog",
"In progress",
"Moves through recruitment"
],
[
"hired",
"Hired",
"Referral successful"
],
[
"reward",
"Rewarded",
"Points and rewards"
]
],
"path": [
"share",
"apply",
"prog",
"hired",
"reward"
],
"branches": [
[
"prog",
"apply",
"Not hired: points kept"
]
],
"handoffs": [
[
"apply",
"hr_recruitment",
"Applicant with the referrer"
],
[
"share",
"social",
"Shared on social"
]
],
"auto": [
"Points per stage",
"Rewards shop",
"Share links per employee"
]
},
"fleet": {
"record": "vehicle",
"article": "a",
"states": [
[
"req",
"New request",
"Vehicle needed for a role"
],
[
"ord",
"To order",
"Model and contract chosen"
],
[
"reg",
"Registered",
"Assigned to a driver"
],
[
"down",
"Downgraded",
"End of contract, returned"
]
],
"path": [
"req",
"ord",
"reg",
"down"
],
"branches": [
[
"reg",
"reg",
"Service and costs logged"
],
[
"reg",
"ord",
"Replacement ordered"
]
],
"handoffs": [
[
"reg",
"hr",
"Driver is an employee"
],
[
"reg",
"account",
"Service bills posted"
],
[
"ord",
"documents",
"Contract documents filed"
]
],
"auto": [
"Contract renewal reminders",
"Odometer and fuel logs",
"Cost analysis per vehicle"
]
},
"hr_payroll": {
"record": "payslip batch",
"article": "a",
"states": [
[
"draft",
"Draft",
"From contracts and schedules"
],
[
"comp",
"Computed",
"Salary rules applied"
],
[
"wait",
"Waiting",
"Warnings reviewed"
],
[
"done",
"Done",
"Journal entry posted"
],
[
"paid",
"Paid",
"Bank payment made"
]
],
"path": [
"draft",
"comp",
"wait",
"done",
"paid"
],
"branches": [
[
"wait",
"comp",
"Correction: recomputed"
]
],
"handoffs": [
[
"done",
"accountant",
"Salaries and liabilities booked"
],
[
"draft",
"hr_holidays",
"Unpaid leave taken into account"
],
[
"paid",
"hr",
"Payslips on the employee"
]
],
"auto": [
"Salary structures by country where Odoo provides them",
"Test print of a pay run",
"Net-to-gross simulation"
]
},
"social": {
"record": "social post",
"article": "a",
"states": [
[
"draft",
"Draft",
"One post for several accounts"
],
[
"sched",
"Scheduled",
"Date and time set"
],
[
"pub",
"Published",
"Live on each network"
],
[
"eng",
"Engagement",
"Comments and reactions in the stream"
],
[
"lead",
"Leads",
"Clicks tracked to CRM"
]
],
"path": [
"draft",
"sched",
"pub",
"eng",
"lead"
],
"branches": [
[
"eng",
"eng",
"Reply from the stream"
]
],
"handoffs": [
[
"lead",
"crm",
"Leads with the post as source"
],
[
"pub",
"website",
"Visitors tracked on the site"
]
],
"auto": [
"Scheduling across accounts",
"Streams per network",
"UTM tracking on links"
]
},
"mass_mailing": {
"record": "mailing",
"article": "a",
"states": [
[
"draft",
"Draft",
"Template and mailing list"
],
[
"test",
"Tested",
"Test sent, A/B split set"
],
[
"sent",
"Sent",
"Delivered to the list"
],
[
"open",
"Opened",
"Opens and clicks tracked"
],
[
"conv",
"Converted",
"Leads or orders"
]
],
"path": [
"draft",
"test",
"sent",
"open",
"conv"
],
"branches": [
[
"sent",
"sent",
"Bounced: contact flagged"
],
[
"open",
"test",
"A/B winner sent to the rest"
]
],
"handoffs": [
[
"conv",
"crm",
"Opportunities from the mailing"
],
[
"conv",
"sale",
"Orders attributed"
],
[
"open",
"marketing_automation",
"Follow-up campaign"
]
],
"auto": [
"Mailing lists and blacklist",
"A/B testing with a winner",
"UTM and revenue attribution"
]
},
"mass_mailing_sms": {
"record": "SMS campaign",
"article": "an",
"states": [
[
"draft",
"Draft",
"Short message and list"
],
[
"sent",
"Sent",
"Credits used per message"
],
[
"dlv",
"Delivered",
"Delivery reports"
],
[
"click",
"Clicked",
"Short links tracked"
],
[
"conv",
"Converted",
"Lead or order"
]
],
"path": [
"draft",
"sent",
"dlv",
"click",
"conv"
],
"branches": [
[
"sent",
"sent",
"Invalid number: excluded next time"
]
],
"handoffs": [
[
"conv",
"crm",
"Lead from the SMS"
],
[
"click",
"website",
"Visit tracked"
]
],
"auto": [
"Opt-out handling",
"Link tracking",
"Lists shared with email marketing"
]
},
"event": {
"record": "event registration",
"article": "an",
"states": [
[
"pub",
"Published",
"Event page with tickets"
],
[
"reg",
"Registered",
"Ticket booked or bought"
],
[
"conf",
"Confirmed",
"Reminder emails"
],
[
"att",
"Attended",
"Badge scanned at the door"
],
[
"fol",
"Followed up",
"Leads for sales"
]
],
"path": [
"pub",
"reg",
"conf",
"att",
"fol"
],
"branches": [
[
"reg",
"reg",
"Sold out: waiting list"
],
[
"conf",
"pub",
"Cancelled: seat released"
]
],
"handoffs": [
[
"reg",
"website_sale",
"Paid tickets"
],
[
"fol",
"crm",
"Leads from attendees"
],
[
"conf",
"mass_mailing",
"Reminders"
]
],
"auto": [
"Ticket types and seats",
"Scheduled communications",
"Badge printing and scanning"
]
},
"marketing_automation": {
"record": "campaign participant",
"article": "a",
"states": [
[
"in",
"Entered",
"Matches the campaign filter"
],
[
"act1",
"First email",
"Sent on entry"
],
[
"wait",
"Waiting",
"Trigger or delay"
],
[
"act2",
"Next step",
"Depends on what they did"
],
[
"out",
"Completed",
"Converted or finished"
]
],
"path": [
"in",
"act1",
"wait",
"act2",
"out"
],
"branches": [
[
"wait",
"act2",
"Opened: sales follow-up"
],
[
"wait",
"act1",
"Not opened: resend with a new subject"
]
],
"handoffs": [
[
"act2",
"crm",
"Opportunity for a salesperson"
],
[
"act1",
"mass_mailing",
"Emails from templates"
],
[
"act2",
"mass_mailing_sms",
"SMS step"
]
],
"auto": [
"Triggers: opened, clicked, replied, not opened",
"Test mode on real data",
"Server actions as steps"
]
},
"survey": {
"record": "survey response",
"article": "a",
"states": [
[
"pub",
"Published",
"Link or invitation"
],
[
"start",
"Started",
"Participant begins"
],
[
"done",
"Completed",
"Answers saved"
],
[
"score",
"Scored",
"Points or certification"
],
[
"act",
"Actioned",
"Results used"
]
],
"path": [
"pub",
"start",
"done",
"score",
"act"
],
"branches": [
[
"start",
"pub",
"Abandoned: reminder sent"
]
],
"handoffs": [
[
"act",
"crm",
"Lead from a qualifying answer"
],
[
"score",
"website_slides",
"Certification for a course"
],
[
"act",
"hr_appraisal",
"Feedback for an appraisal"
]
],
"auto": [
"Scoring and certifications",
"Conditional questions",
"Live sessions for events"
]
},
"project": {
"record": "task",
"article": "a",
"states": [
[
"new",
"New",
"From a sales order, email or by hand"
],
[
"prog",
"In progress",
"Assignee and deadline"
],
[
"chg",
"Changes requested",
"Customer or reviewer asks"
],
[
"appr",
"Approved",
"Signed off"
],
[
"done",
"Done",
"Milestone reached"
]
],
"path": [
"new",
"prog",
"chg",
"appr",
"done"
],
"branches": [
[
"chg",
"prog",
"Reworked"
],
[
"prog",
"prog",
"Blocked by another task"
]
],
"handoffs": [
[
"done",
"sale",
"Milestone invoiced"
],
[
"prog",
"hr_timesheet",
"Time logged"
],
[
"new",
"planning",
"Scheduled in Planning"
]
],
"auto": [
"Stages and task dependencies",
"Customer portal and ratings",
"Recurring tasks"
]
},
"hr_timesheet": {
"record": "timesheet",
"article": "a",
"states": [
[
"log",
"Logged",
"Timer or grid"
],
[
"sub",
"Submitted",
"Week sent"
],
[
"val",
"Validated",
"Manager approves"
],
[
"bill",
"Billable",
"Linked to a sales order line"
],
[
"inv",
"Invoiced",
"On the next invoice"
]
],
"path": [
"log",
"sub",
"val",
"bill",
"inv"
],
"branches": [
[
"val",
"log",
"Corrected before validation"
]
],
"handoffs": [
[
"bill",
"sale",
"Delivered quantity on the order"
],
[
"inv",
"account",
"Invoice posted"
],
[
"val",
"project",
"Project profitability"
]
],
"auto": [
"Timers on tasks",
"Validation by manager",
"Billable rates per employee or service"
]
},
"industry_fsm": {
"record": "field service task",
"article": "a",
"states": [
[
"new",
"New",
"From a sales order or ticket"
],
[
"plan",
"Planned",
"Technician and slot set"
],
[
"site",
"On site",
"Worksheet filled"
],
[
"sign",
"Signed",
"Customer signs on the phone"
],
[
"inv",
"Invoiced",
"Time and parts billed"
]
],
"path": [
"new",
"plan",
"site",
"sign",
"inv"
],
"branches": [
[
"site",
"plan",
"Parts missing: second visit"
]
],
"handoffs": [
[
"plan",
"planning",
"Odoo 20 runs this in Planning"
],
[
"site",
"stock",
"Parts used from the van"
],
[
"inv",
"account",
"Invoice posted"
]
],
"auto": [
"Worksheets per service",
"Routes and maps (in Planning from Odoo 20)",
"Customer signature on site"
]
},
"helpdesk": {
"record": "ticket",
"article": "a",
"states": [
[
"new",
"New",
"Email, form, chat or phone"
],
[
"prog",
"In progress",
"Assigned by rule"
],
[
"hold",
"On hold",
"Waiting on the customer"
],
[
"solved",
"Solved",
"Answer or fix sent"
],
[
"rated",
"Rated",
"Customer rates the reply"
]
],
"path": [
"new",
"prog",
"hold",
"solved",
"rated"
],
"branches": [
[
"prog",
"prog",
"SLA at risk: escalated"
],
[
"solved",
"prog",
"Reopened by the customer"
]
],
"handoffs": [
[
"prog",
"stock",
"Return or replacement"
],
[
"prog",
"account",
"Refund or credit note"
],
[
"solved",
"knowledge",
"Answer saved as an article"
]
],
"auto": [
"SLA policies by priority and team",
"Assignment: balanced or random",
"Email aliases per team"
]
},
"planning": {
"record": "shift",
"article": "a",
"states": [
[
"open",
"Open",
"Shift from a template"
],
[
"assign",
"Assigned",
"To a person with the role"
],
[
"pub",
"Published",
"Sent to the team"
],
[
"done",
"Done",
"Worked and timed"
]
],
"path": [
"open",
"assign",
"pub",
"done"
],
"branches": [
[
"assign",
"open",
"Conflict with time off: unassigned"
],
[
"pub",
"assign",
"Swap requested: reassigned"
]
],
"handoffs": [
[
"pub",
"mail",
"Schedule sent"
],
[
"done",
"hr_timesheet",
"Time from the shift"
],
[
"assign",
"hr_holidays",
"Time off checked"
]
],
"auto": [
"Templates and recurring shifts",
"Roles and skills",
"Field service map and routes from Odoo 20"
]
},
"appointment": {
"record": "appointment",
"article": "an",
"states": [
[
"page",
"Booking page",
"Services and staff"
],
[
"slot",
"Slot chosen",
"From live availability"
],
[
"conf",
"Confirmed",
"Invitation and video link"
],
[
"rem",
"Reminded",
"Email or SMS reminder"
],
[
"att",
"Attended",
"Meeting held"
]
],
"path": [
"page",
"slot",
"conf",
"rem",
"att"
],
"branches": [
[
"conf",
"slot",
"Rescheduled by the customer"
],
[
"rem",
"rem",
"No-show recorded"
]
],
"handoffs": [
[
"conf",
"crm",
"Lead or opportunity"
],
[
"att",
"account",
"Paid booking invoiced"
],
[
"conf",
"mail",
"Calendar invite"
]
],
"auto": [
"Availability by staff and resource",
"Questions before booking",
"Online payment for paid slots"
]
},
"mail": {
"record": "message",
"article": "a",
"states": [
[
"post",
"Posted",
"In a channel or on a record"
],
[
"men",
"Mentioned",
"@person notified"
],
[
"act",
"Activity",
"Scheduled with a deadline"
],
[
"done",
"Done",
"Marked done, feedback logged"
],
[
"hist",
"History",
"Kept in the chatter"
]
],
"path": [
"post",
"men",
"act",
"done",
"hist"
],
"branches": [
[
"act",
"act",
"Overdue: shown in red"
]
],
"handoffs": [
[
"post",
"crm",
"Chatter on the opportunity"
],
[
"act",
"project",
"Task follow-up"
],
[
"men",
"voip",
"Call back"
]
],
"auto": [
"Activity types with default deadlines",
"Channels per team",
"Email in and out of the chatter"
]
},
"approvals": {
"record": "approval request",
"article": "an",
"states": [
[
"new",
"To submit",
"Category with its rules"
],
[
"sub",
"Submitted",
"Approvers notified"
],
[
"appr",
"Approved",
"The required approvers agreed"
],
[
"done",
"Done",
"Order or payment made"
]
],
"path": [
"new",
"sub",
"appr",
"done"
],
"branches": [
[
"sub",
"new",
"Refused: reason sent back"
]
],
"handoffs": [
[
"done",
"purchase",
"Purchase order created"
],
[
"sub",
"mail",
"Approvers notified"
],
[
"appr",
"account",
"Payment approved"
]
],
"auto": [
"Minimum approvers per category",
"Approval order",
"Documents required before submitting"
]
},
"iot": {
"record": "device reading",
"article": "a",
"states": [
[
"dev",
"Device",
"Scale, printer, scanner or terminal"
],
[
"box",
"IoT box",
"Connects devices to Odoo"
],
[
"read",
"Reading",
"Weight, scan or payment"
],
[
"app",
"In the app",
"Used on the operation"
],
[
"log",
"Recorded",
"Stored on the record"
]
],
"path": [
"dev",
"box",
"read",
"app",
"log"
],
"branches": [
[
"read",
"dev",
"Device offline: retry"
]
],
"handoffs": [
[
"app",
"point_of_sale",
"Payment terminal and printer"
],
[
"app",
"mrp",
"Measurements on work orders"
],
[
"app",
"quality_control",
"Quality measurements"
]
],
"auto": [
"Device auto-detection",
"Triggers on work orders",
"Printers per operation"
]
},
"voip": {
"record": "call",
"article": "a",
"states": [
[
"ring",
"Incoming",
"Number matched to a contact"
],
[
"talk",
"Answered",
"Record opens on screen"
],
[
"note",
"Logged",
"Notes on the chatter"
],
[
"act",
"Follow-up",
"Activity scheduled"
],
[
"done",
"Closed",
"Next step done"
]
],
"path": [
"ring",
"talk",
"note",
"act",
"done"
],
"branches": [
[
"ring",
"act",
"Missed: call-back activity"
]
],
"handoffs": [
[
"talk",
"crm",
"Opportunity opened"
],
[
"talk",
"helpdesk",
"Ticket opened"
],
[
"act",
"mail",
"Activity in the chatter"
]
],
"auto": [
"Click to call from any record",
"Call queues from activities",
"Call history per contact"
]
},
"knowledge": {
"record": "article",
"article": "an",
"states": [
[
"draft",
"Draft",
"Written with templates"
],
[
"rev",
"Reviewed",
"Shared with editors"
],
[
"pub",
"Published",
"Workspace or public"
],
[
"emb",
"Embedded",
"Linked from records and tickets"
],
[
"upd",
"Updated",
"Versions kept"
]
],
"path": [
"draft",
"rev",
"pub",
"emb",
"upd"
],
"branches": [
[
"upd",
"rev",
"Change reviewed again"
]
],
"handoffs": [
[
"emb",
"helpdesk",
"Answers for tickets"
],
[
"pub",
"website",
"Shared online"
],
[
"emb",
"project",
"Procedures on tasks"
]
],
"auto": [
"Nested workspaces",
"Templates and embedded views",
"Access per workspace"
]
},
"whatsapp": {
"record": "WhatsApp message",
"article": "a",
"states": [
[
"tpl",
"Template",
"Approved by Meta"
],
[
"sent",
"Sent",
"From a record or automation"
],
[
"read",
"Read",
"Delivery and read status"
],
[
"reply",
"Replied",
"Conversation opens"
],
[
"act",
"Actioned",
"Lead, ticket or order"
]
],
"path": [
"tpl",
"sent",
"read",
"reply",
"act"
],
"branches": [
[
"sent",
"sent",
"Failed: number not on WhatsApp"
]
],
"handoffs": [
[
"act",
"crm",
"Lead from the chat"
],
[
"act",
"helpdesk",
"Ticket from the chat"
],
[
"sent",
"sale",
"Order confirmation sent"
]
],
"auto": [
"Templates with variables",
"Automated sends on events",
"Conversations in Discuss"
]
},
"ai_app": {
"record": "AI request",
"article": "an",
"states": [
[
"ask",
"Asked",
"From a record or a chat"
],
[
"read",
"Reads data",
"Records the user may see"
],
[
"draft",
"Drafted",
"Text, summary or fields"
],
[
"rev",
"Reviewed",
"A person checks it"
],
[
"write",
"Written back",
"Saved on the record"
]
],
"path": [
"ask",
"read",
"draft",
"rev",
"write"
],
"branches": [
[
"rev",
"draft",
"Edited or regenerated"
]
],
"handoffs": [
[
"write",
"crm",
"Lead fields filled"
],
[
"write",
"helpdesk",
"Reply drafted"
],
[
"read",
"knowledge",
"Answers from articles"
]
],
"auto": [
"Access rights respected",
"Prompts saved per use",
"Human review before anything is sent"
]
}
},
"appLayout": {
"finance": "ladder",
"sales": "rail",
"websites": "journey",
"supply-chain": "rail",
"hr": "ring",
"marketing": "funnel",
"services": "lanes",
"productivity": "hub"
},
"odoo20": [
[
"ai",
"AI agents",
[
[
"n",
"Automated and scheduled actions can call an AI agent",
"Describe a process in plain language and let the agent carry it out."
],
[
"n",
"Agents create records, even from an uploaded PDF",
"Such as a vendor bill or a purchase order."
],
[
"n",
"Agents update existing records",
"And answer questions about a file you give them."
],
[
"n",
"Images and voice",
"Agents generate images and take instructions by voice."
],
[
"c",
"Conversations kept up to 30 days",
"Odoo picks the AI model automatically, and \"topics\" are now \"skills\"."
],
[
"$",
"Every AI feature uses paid IAP credits",
"Budget for usage, not just for the subscription.",
"ai"
]
]
],
[
"mcp",
"MCP connector",
[
[
"n",
"A connector for the Model Context Protocol",
"The open standard AI assistants use to reach business systems."
],
[
"n",
"Link any AI system to your database",
"Odoo's own description of the connector."
],
[
"c",
"Access rights still apply",
"The external tool works within the user's existing access rights."
],
[
"n",
"Ask the live system",
"For companies already using AI assistants: ask questions of the live system instead of copying data out."
]
]
],
[
"off",
"Offline & mobile",
[
[
"n",
"Work without a connection",
"Create, edit, archive and delete records, and rerun earlier searches."
],
[
"n",
"Changes sync when you are back online",
"Pitched at warehouse floors, construction sites and field technicians."
],
[
"c",
"A better phone experience",
"A swipe-down command palette, a bottom-sheet date picker and better forms on touchscreens."
],
[
"n",
"File sharing from the phone",
"Part of the refreshed mobile interface."
]
]
],
[
"fsm",
"Field Service → Planning",
[
[
"r",
"The standalone Field Service app is discontinued",
"Its features move rather than disappear.",
"fs"
],
[
"m",
"Now in Planning",
"The live map, routing preferences, travel fees, the website request form and worksheets.",
"fs"
],
[
"t",
"The first thing to test",
"If your technicians use Field Service today, test it on a copy of your database before upgrading.",
"fs"
]
]
],
[
"acc",
"Accounting",
[
[
"n",
"Pay bills from Odoo",
"Approve and pay vendor bills singly or in batches with one signature, where your bank supports payment initiation."
],
[
"n",
"Bill line prediction",
"Suggests how new vendor bills should be coded."
],
[
"c",
"Parent accounts replace account groups",
"And account codes become optional.",
"ag"
],
[
"n",
"Invoice reminders and valuation without Inventory",
"Both are built in."
],
[
"n",
"The Accounting Assistant",
"Answers finance questions and audits reconciliations."
]
]
],
[
"apps",
"Payroll, inventory & more",
[
[
"c",
"Payroll: a dashboard built around warnings",
"Test print of pay runs, net-to-gross simulation and working schedules in hours per day."
],
[
"r",
"Payroll: work entries are removed",
"And so is the Planning-to-Payroll link.",
"we"
],
[
"n",
"Inventory & Purchase: suggested stock levels",
"For reordering rules, from the last 30 days of sales, plus inventory at a past date, stock aging and a vendor quality rate."
],
[
"n",
"Manufacturing: continuous production",
"Bill of materials comparison, split manufacturing orders and new work order views."
],
[
"n",
"Spreadsheet: bubble and calendar charts",
"Named ranges, locked sheets, regex formulas and calculated columns."
],
[
"n",
"Point of Sale, CRM and Website",
"Snoozed products and combos in POS, Dun & Bradstreet lead data in CRM, an AI Website Assistant."
]
]
],
[
"price",
"Pricing",
[
[
"s",
"Prices held since 2022",
"Despite 26% cumulative inflation, Odoo said at Odoo Experience."
],
[
"s",
"One App Free stays",
"And the Standard plan is unchanged."
],
[
"$",
"The Custom plan rises by 20%",
"The one plan with a price rise."
],
[
"n",
"A new Light User access type",
"For employees who only need things like HR self-service."
],
[
"c",
"Prices differ by country and currency",
"Check odoo.com/pricing for your market, or ask TechNext for the licence estimate in your quotation."
]
]
]
],
"icons": {
"hardhat": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 18a10 10 0 0 1 20 0z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M2 18a10 10 0 0 1 20 0\"/><path d=\"M2 18h20\"/><path d=\"M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3\"/><path d=\"M12 4v6\"/></svg>",
"utensils": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M17 2c-2 3-2 8 0 9v11z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M3 2v7a3 3 0 0 0 6 0V2\"/><path d=\"M6 2v20\"/><path d=\"M17 2c-2 3-2 8 0 9v11\"/><path d=\"M21 2c-1 4-1 8-4 9\"/></svg>",
"gear": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"7\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></svg>",
"heart": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z\"/><path d=\"M8 12h2l1.5-2.5 1.5 4 1-1.5H16\"/></svg>",
"ruler": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m3 17 14-14 4 4L7 21z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"m3 17 14-14 4 4L7 21z\"/><path d=\"m14 6 1.5 1.5M11 9l1.5 1.5M8 12l1.5 1.5\"/></svg>",
"layers": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 2 2 7l10 5 10-5z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M12 2 2 7l10 5 10-5-10-5z\"/><path d=\"m2 17 10 5 10-5\"/><path d=\"m2 12 10 5 10-5\"/></svg>",
"globe": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M2 12h20\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/></svg>",
"megaphone": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m3 11 18-5v12L3 13z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"m3 11 18-5v12L3 13v-2z\"/><path d=\"M11.6 16.8a3 3 0 1 1-5.8-1.6\"/></svg>",
"pulse": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"8\" width=\"20\" height=\"8\" rx=\"4\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M22 12h-4l-3 9L9 3l-3 9H2\"/></svg>",
"plane": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m22 2-7 20-4-9-9-4z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M22 2 11 13\"/><path d=\"m22 2-7 20-4-9-9-4 20-7z\"/></svg>",
"bag": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\"/><path d=\"M3 6h18\"/><path d=\"M16 10a4 4 0 0 1-8 0\"/></svg>",
"cart": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 6h17l-1.6 8.4a2 2 0 0 1-2 1.6H9.7a2 2 0 0 1-2-1.6z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><circle cx=\"9\" cy=\"21\" r=\"1\"/><circle cx=\"20\" cy=\"21\" r=\"1\"/><path d=\"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6\"/></svg>",
"search": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m21 21-4.35-4.35\"/></svg>",
"graduation": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M22 10 12 5 2 10l10 5z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M22 10 12 5 2 10l10 5 10-5z\"/><path d=\"M6 12v5c3 3 9 3 12 0v-5\"/></svg>",
"plug": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M18 8H6v4a6 6 0 0 0 12 0z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M12 22v-5\"/><path d=\"M9 8V2\"/><path d=\"M15 8V2\"/><path d=\"M18 8H6v4a6 6 0 0 0 12 0V8z\"/></svg>",
"lifebuoy": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zm0 6a4 4 0 1 1 0 8 4 4 0 1 1 0-8z\" fill-rule=\"evenodd\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"m4.93 4.93 4.24 4.24\"/><path d=\"m14.83 14.83 4.24 4.24\"/><path d=\"m14.83 9.17 4.24-4.24\"/><path d=\"m4.93 19.07 4.24-4.24\"/></svg>",
"grid": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/></svg>",
"calculator": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"/><path d=\"M8 6h8\"/><path d=\"M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01\"/></svg>",
"trend": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m3 17 6-6 4 4 8-8v10H3z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"m3 17 6-6 4 4 8-8\"/><path d=\"M14 7h7v7\"/></svg>",
"box": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 12v10l7-4a2 2 0 0 0 2-1.73V8z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"/><path d=\"m3.3 7 8.7 5 8.7-5\"/><path d=\"M12 22V12\"/></svg>",
"cpu": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"/><path d=\"M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3\"/></svg>",
"usercheck": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"7\" r=\"4\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"m16 11 2 2 4-4\"/></svg>",
"users": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"7\" r=\"4\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/></svg>",
"check": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 6 9 17l-5-5\"/></svg>",
"arrow": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/></svg>",
"mail": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"m22 6-10 7L2 6\"/></svg>",
"chat": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\"/></svg>",
"pin": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/></svg>",
"shield": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/></svg>",
"file": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><path d=\"M14 2v6h6\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/></svg>",
"receipt": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z\"/><path d=\"M8 8h8M8 12h8M8 16h5\"/></svg>",
"truck": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"1\" y=\"3\" width=\"15\" height=\"13\" rx=\"1\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"1\" y=\"3\" width=\"15\" height=\"13\" rx=\"1\"/><path d=\"M16 8h4l3 3v5h-7z\"/><circle cx=\"5.5\" cy=\"18.5\" r=\"2.5\"/><circle cx=\"18.5\" cy=\"18.5\" r=\"2.5\"/></svg>",
"factory": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2z\"/></svg>",
"briefcase": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/></svg>",
"calendar": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M16 2v4M8 2v4M3 10h18\"/></svg>",
"wrench": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/></svg>",
"zap": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M13 2 3 14h9l-1 8 10-12h-9l1-8z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M13 2 3 14h9l-1 8 10-12h-9l1-8z\"/></svg>",
"bars": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"15\" width=\"4\" height=\"6\" rx=\"1\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"10\" y=\"9\" width=\"4\" height=\"12\" rx=\"1\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"16\" y=\"3\" width=\"4\" height=\"18\" rx=\"1\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M12 20V10\"/><path d=\"M18 20V4\"/><path d=\"M6 20v-4\"/></svg>",
"clock": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/></svg>",
"x": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/></svg>",
"menu": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 7h16\"/><path d=\"M4 12h16\"/><path d=\"M4 17h16\"/></svg>",
"chevron": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg>",
"bank": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m12 3 10 6H2z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M3 10h18\"/><path d=\"M5 10v9M9 10v9M15 10v9M19 10v9\"/><path d=\"M2 21h20\"/><path d=\"m12 3 10 6H2z\"/></svg>",
"refresh": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M21 12a9 9 0 1 1-2.64-6.36\"/><path d=\"M21 3v6h-6\"/></svg>",
"target": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12zm0 4a2 2 0 1 1 0 4 2 2 0 1 1 0-4z\" fill-rule=\"evenodd\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/></svg>",
"database": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 5c0-1.66 4-3 9-3s9 1.34 9 3v14c0 1.66-4 3-9 3s-9-1.34-9-3z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"/><path d=\"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\"/><path d=\"M3 12c0 1.66 4 3 9 3s9-1.34 9-3\"/></svg>",
"sparkle": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 6l1.8 4.2L18 12l-4.2 1.8L12 18l-1.8-4.2L6 12l4.2-1.8z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8\"/></svg>",
"quote": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><path d=\"M14 2v6h6\"/><path d=\"M9 15h6\"/><path d=\"M9 11h2\"/></svg>",
"camera": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"/><circle cx=\"12\" cy=\"13\" r=\"4\"/></svg>",
"layout": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"3\" y=\"9\" width=\"6\" height=\"12\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M9 21V9\"/></svg>",
"lock": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/></svg>",
"star": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\"/></svg>",
"smile": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"/><path d=\"M9 9h.01M15 9h.01\"/></svg>",
"code": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"3\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"m16 18 6-6-6-6\"/><path d=\"m8 6-6 6 6 6\"/></svg>",
"send": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m22 2-7 20-4-9-9-4z\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><path d=\"m22 2-7 20-4-9-9-4z\"/><path d=\"M22 2 11 13\"/></svg>",
"bot": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"8\" width=\"18\" height=\"12\" rx=\"3\" fill=\"currentColor\" fill-opacity=\".2\" stroke=\"none\"/><rect x=\"3\" y=\"8\" width=\"18\" height=\"12\" rx=\"3\"/><path d=\"M12 8V4\"/><circle cx=\"12\" cy=\"3\" r=\"1\"/><path d=\"M8 14h.01M16 14h.01\"/><path d=\"M9 17.5c1.5 1 4.5 1 6 0\"/></svg>",
"whatsapp": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z\"/></svg>",
"expand": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M15 3h6v6\"/><path d=\"M9 21H3v-6\"/><path d=\"m21 3-7 7\"/><path d=\"m3 21 7-7\"/></svg>",
"play": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M8 5v14l11-7z\"/></svg>"
},
"company": {
"legal": "TechNext Pte. Ltd.",
"short": "TechNext",
"uen": "202699888G",
"sales_email": "sales@technext.asia",
"whatsapp": "+65 8839 6998",
"whatsapp_link": "https://wa.me/6588396998",
"whatsapp_msg_link": "https://wa.me/6588396998?text=Hello%20TechNext%2C%20I%27d%20like%20to%20ask%20about%20Odoo%20for%20my%20company.",
"linkedin": "https://www.linkedin.com/company/technextasia",
"hubs": "Singapore HQ · Philippines · Vietnam",
"odoo_listing": "https://www.odoo.com/partners/technext-pte-ltd-28073844",
"careers_email": "career@technext.asia",
"meeting_link": "https://technext.odoo.com/book/c82cf8a9"
}
};
