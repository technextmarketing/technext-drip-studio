/* TechNext Drip Studio — the starter library, in the clean style (v4): the standard frame and one visual.
   The claude.ai hub keeps its own live copy in its database; this file seeds new hubs and the GitHub mirror.
   Each drip keeps the post it was built from ("post"), so the editor can mirror or reset its layout. */

window.CATEGORIES = [
  {
    "id": "odoo20",
    "group": "Odoo",
    "name": "Meet Odoo 20"
  },
  {
    "id": "apps",
    "group": "Odoo",
    "name": "Odoo apps"
  },
  {
    "id": "ai",
    "group": "AI & Nexi",
    "name": "AI in Odoo"
  },
  {
    "id": "fnb",
    "group": "Industries",
    "name": "F&B",
    "industry": "fnb"
  },
  {
    "id": "retail",
    "group": "Industries",
    "name": "Retail",
    "industry": "retail"
  },
  {
    "id": "ecommerce",
    "group": "Industries",
    "name": "Ecommerce",
    "industry": "ecommerce"
  },
  {
    "id": "manufacturing",
    "group": "Industries",
    "name": "Manufacturing",
    "industry": "manufacturing"
  },
  {
    "id": "construction",
    "group": "Industries",
    "name": "Construction",
    "industry": "construction"
  },
  {
    "id": "medical",
    "group": "Industries",
    "name": "Medical",
    "industry": "medical"
  },
  {
    "id": "travel",
    "group": "Industries",
    "name": "Travel",
    "industry": "travel"
  },
  {
    "id": "health-wellness",
    "group": "Industries",
    "name": "Health & Wellness",
    "industry": "health-wellness"
  },
  {
    "id": "kitchen",
    "group": "Industries",
    "name": "Kitchen",
    "industry": "kitchen"
  },
  {
    "id": "field-service",
    "group": "Industries",
    "name": "Field Service",
    "industry": "field-service"
  },
  {
    "id": "it",
    "group": "Industries",
    "name": "IT & Tech",
    "industry": "it"
  },
  {
    "id": "services",
    "group": "TechNext",
    "name": "Websites & marketing"
  }
];

window.DRIPS = [
 {
  "id": "o20-offline-mode",
  "cat": "odoo20",
  "name": "Odoo 20 · offline",
  "v": 4,
  "visual": "phone",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
  "pattern": "dots",
  "badge": "o20",
  "copy": {
   "head": "No signal? *Keep working.*",
   "sub": "Odoo 20 lets on-site teams create and edit records offline. Everything syncs when you are back online."
  },
  "layers": [
   {
    "type": "glow",
    "w": 600,
    "z": 2,
    "x": 250,
    "y": 420
   },
   {
    "type": "phone",
    "w": 336,
    "rot": -5,
    "z": 12,
    "screen": "offline-receipt",
    "app": "stock",
    "title": "Receipt WH/IN/00042",
    "crumb": "Inventory · Receipts",
    "fields": [
     [
      "Receive from",
      "Sample Supplier Pte Ltd"
     ]
    ],
    "lines": [
     [
      "Cement, 40 kg bags",
      "20 / 20",
      true
     ],
     [
      "Rebar, 12 mm",
      "150 / 150",
      true
     ],
     [
      "Tile adhesive, 25 kg",
      "18 / 35",
      false
     ]
    ],
    "btn": "Validate",
    "x": 382,
    "y": 402
   },
   {
    "type": "pill",
    "text": "Warehouse floor",
    "rot": -5,
    "z": 19,
    "x": 62,
    "y": 498
   },
   {
    "type": "pill",
    "text": "Construction site",
    "rot": 3,
    "z": 19,
    "x": 44,
    "y": 656
   },
   {
    "type": "pill",
    "text": "Field visit",
    "rot": -3,
    "z": 19,
    "x": 104,
    "y": 812
   },
   {
    "type": "storm",
    "w": 290,
    "rot": 6,
    "z": 14,
    "x": 706,
    "y": 388
   },
   {
    "type": "nosignal",
    "w": 120,
    "rot": 8,
    "z": 16,
    "x": 676,
    "y": 578
   },
   {
    "type": "arrow",
    "w": 120,
    "rot": 62,
    "z": 17,
    "kind": "down",
    "x": 790,
    "y": 662
   },
   {
    "type": "chip",
    "text": "Back online",
    "small": "3 changes synced",
    "icon": "cloudOk",
    "tone": "ok",
    "z": 18,
    "rot": 3,
    "x": 700,
    "y": 770
   },
   {
    "type": "sparkles",
    "w": 110,
    "z": 21,
    "x": 930,
    "y": 708
   }
  ],
  "caption": "Signal drops on the warehouse floor, at a construction site or on a field visit. In Odoo 20, your team keeps creating and editing records on the phone, and everything syncs when the connection is back. Which of your teams works where the signal is weakest?",
  "hashtags": [
   "#Odoo20",
   "#Odoo",
   "#Inventory",
   "#FieldService",
   "#Singapore"
  ],
  "source": "technext.asia/blog/odoo-20-whats-new — \"Offline mode and a better phone experience\"",
  "post": {
   "visual": "phone",
   "badge": "o20",
   "offline": true,
   "name": "Odoo 20 · offline",
   "head": "No signal? *Keep working.*",
   "sub": "Odoo 20 lets on-site teams create and edit records offline. Everything syncs when you are back online.",
   "app": "stock",
   "title": "Receipt WH/IN/00042",
   "crumb": "Inventory · Receipts",
   "field": [
    "Receive from",
    "Sample Supplier Pte Ltd"
   ],
   "lines": [
    [
     "Cement, 40 kg bags",
     "20 / 20",
     true
    ],
    [
     "Rebar, 12 mm",
     "150 / 150",
     true
    ],
    [
     "Tile adhesive, 25 kg",
     "18 / 35",
     false
    ]
   ],
   "btn": "Validate",
   "pills": [
    "Warehouse floor",
    "Construction site",
    "Field visit"
   ],
   "chip": {
    "text": "Back online",
    "small": "3 changes synced",
    "icon": "cloudOk"
   },
   "caption": "Signal drops on the warehouse floor, at a construction site or on a field visit. In Odoo 20, your team keeps creating and editing records on the phone, and everything syncs when the connection is back. Which of your teams works where the signal is weakest?",
   "hashtags": [
    "#Odoo20",
    "#Odoo",
    "#Inventory",
    "#FieldService",
    "#Singapore"
   ],
   "mirror": false,
   "variant": 0,
   "background": "dots"
  }
 },
 {
  "id": "fnb-supplier-to-books",
  "cat": "fnb",
  "name": "F&B · Supplier to the books",
  "v": 4,
  "industry": "fnb",
  "visual": "flow",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
  "pattern": "hex",
  "badge": "ready",
  "copy": {
   "head": "From supplier to table|to the books, *in one Odoo.*",
   "sub": "Six steps every restaurant runs, and the Odoo app behind each one."
  },
  "layers": [
   {
    "type": "flow",
    "z": 12,
    "steps": [
     {
      "app": "purchase",
      "t": "Buy",
      "h": "Ingredients ordered from par levels"
     },
     {
      "app": "mrp",
      "t": "Prep",
      "h": "Central kitchen batches"
     },
     {
      "app": "stock",
      "t": "Deliver",
      "h": "Outlets replenished"
     },
     {
      "app": "pos_restaurant",
      "t": "Serve",
      "h": "Tables, takeaway and self-ordering"
     },
     {
      "app": "pos_restaurant",
      "t": "Cook",
      "h": "Kitchen display and printers"
     },
     {
      "app": "accountant",
      "t": "Close",
      "h": "Takings and food cost per outlet"
     }
    ],
    "cols": 3,
    "nodeW": 270,
    "nodeH": 200,
    "gapX": 65,
    "gapY": 50,
    "layout": "snake",
    "hot": 4,
    "x": 70,
    "y": 442
   },
   {
    "type": "note",
    "text": "paper tickets",
    "variant": "red strike",
    "size": 46,
    "rot": -4,
    "z": 20,
    "x": 267,
    "y": 938
   },
   {
    "type": "arrow",
    "w": 100,
    "rot": 8,
    "z": 20,
    "kind": "right",
    "x": 486,
    "y": 924
   },
   {
    "type": "note",
    "text": "kitchen display",
    "size": 46,
    "rot": -3,
    "z": 20,
    "x": 606,
    "y": 934
   },
   {
    "type": "sparkles",
    "w": 100,
    "z": 21,
    "x": 946,
    "y": 390
   },
   {
    "type": "prop",
    "name": "bowl",
    "w": 150,
    "rot": -6,
    "z": 17,
    "x": 106,
    "y": 898
   }
  ],
  "caption": "Buy, prep, deliver, serve, cook and close: six steps every restaurant group runs. In Odoo each one has its app, on one database, so food cost and takings per outlet are ready without retyping. Which step still runs on paper in your kitchen?",
  "hashtags": [
   "#Odoo",
   "#FandB",
   "#Restaurant",
   "#Singapore"
  ],
  "source": "technext.asia/industries/fnb — the six-step flow and the before/after table",
  "post": {
   "visual": "flow",
   "name": "F&B · Supplier to the books",
   "head": "From supplier to table|to the books, *in one Odoo.*",
   "sub": "Six steps every restaurant runs, and the Odoo app behind each one.",
   "steps": [
    {
     "app": "purchase",
     "t": "Buy",
     "h": "Ingredients ordered from par levels"
    },
    {
     "app": "mrp",
     "t": "Prep",
     "h": "Central kitchen batches"
    },
    {
     "app": "stock",
     "t": "Deliver",
     "h": "Outlets replenished"
    },
    {
     "app": "pos_restaurant",
     "t": "Serve",
     "h": "Tables, takeaway and self-ordering"
    },
    {
     "app": "pos_restaurant",
     "t": "Cook",
     "h": "Kitchen display and printers"
    },
    {
     "app": "accountant",
     "t": "Close",
     "h": "Takings and food cost per outlet"
    }
   ],
   "hot": 4,
   "old": "paper tickets",
   "new": "kitchen display",
   "caption": "Buy, prep, deliver, serve, cook and close: six steps every restaurant group runs. In Odoo each one has its app, on one database, so food cost and takings per outlet are ready without retyping. Which step still runs on paper in your kitchen?",
   "hashtags": [
    "#Odoo",
    "#FandB",
    "#Restaurant",
    "#Singapore"
   ],
   "mirror": false,
   "variant": 0,
   "background": "hex"
  }
 },
 {
  "id": "ai-bill-you-approve",
  "cat": "ai",
  "name": "AI vendor bill",
  "v": 4,
  "visual": "record",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
  "pattern": "rings",
  "badge": "ready",
  "copy": {
   "head": "AI prepares the bill.|*You approve it.*",
   "sub": "TechNext builds AI inside your Odoo. It reads the vendor bill, matches the purchase order and waits for your OK."
  },
  "layers": [
   {
    "type": "nexi",
    "pose": "point",
    "w": 444,
    "z": 16,
    "x": 43,
    "y": 510,
    "s": 0.956
   },
   {
    "type": "record",
    "app": "accountant",
    "title": "Vendor bill",
    "crumb": "Accounting · Draft",
    "status": "Draft",
    "rows": [
     [
      "Vendor",
      "Harbourline Supplies",
      "ai"
     ],
     [
      "Bill date",
      "12 Sep 2026",
      "ai"
     ],
     [
      "Total",
      "S$ 1,284.00",
      "ai"
     ],
     [
      "PO match",
      "PO00123",
      "ok"
     ]
    ],
    "ai": "Prepared by AI · a person approves",
    "btn": "Approve",
    "w": 540,
    "rot": 2.5,
    "z": 12,
    "x": 477,
    "y": 437,
    "s": 0.956
   },
   {
    "type": "bubble",
    "text": "PO matched!",
    "rot": -3,
    "z": 20,
    "x": 76,
    "y": 439,
    "s": 0.956
   },
   {
    "type": "chip",
    "text": "AI read the bill",
    "icon": "spark",
    "rot": -1.5,
    "z": 18,
    "x": 542,
    "y": 832,
    "s": 0.956
   },
   {
    "type": "chip",
    "text": "Matched to PO00123",
    "icon": "search",
    "rot": 1.5,
    "z": 19,
    "x": 596,
    "y": 907,
    "s": 0.956
   },
   {
    "type": "chip",
    "text": "Approved by Finance",
    "icon": "check",
    "tone": "ok",
    "rot": -1,
    "z": 20,
    "x": 552,
    "y": 982,
    "s": 0.956
   },
   {
    "type": "sparkles",
    "w": 110,
    "z": 21,
    "x": 408,
    "y": 465,
    "s": 0.956
   },
   {
    "type": "sphere",
    "w": 52,
    "z": 6,
    "x": 969,
    "y": 755,
    "s": 0.956
   }
  ],
  "caption": "Supplier bills still typed in by hand? TechNext builds AI inside your Odoo: it reads the bill, fills the fields and matches the purchase order. A person still approves every bill. Book a call at technext.asia.",
  "hashtags": [
   "#Odoo",
   "#AI",
   "#Accounting",
   "#Automation"
  ],
  "source": "technext.asia/odoo/ai-integration — the vendor bill record and its three steps",
  "post": {
   "visual": "record",
   "name": "AI vendor bill",
   "head": "AI prepares the bill.|*You approve it.*",
   "sub": "TechNext builds AI inside your Odoo. It reads the vendor bill, matches the purchase order and waits for your OK.",
   "app": "accountant",
   "title": "Vendor bill",
   "crumb": "Accounting · Draft",
   "status": "Draft",
   "rows": [
    [
     "Vendor",
     "Harbourline Supplies",
     "ai"
    ],
    [
     "Bill date",
     "12 Sep 2026",
     "ai"
    ],
    [
     "Total",
     "S$ 1,284.00",
     "ai"
    ],
    [
     "PO match",
     "PO00123",
     "ok"
    ]
   ],
   "note": "Prepared by AI · a person approves",
   "btn": "Approve",
   "steps": [
    "AI read the bill",
    "Matched to PO00123",
    "Approved by Finance"
   ],
   "bubble": "PO matched!",
   "nexi": "point",
   "caption": "Supplier bills still typed in by hand? TechNext builds AI inside your Odoo: it reads the bill, fills the fields and matches the purchase order. A person still approves every bill. Book a call at technext.asia.",
   "hashtags": [
    "#Odoo",
    "#AI",
    "#Accounting",
    "#Automation"
   ],
   "mirror": false,
   "variant": 0,
   "background": "rings"
  }
 },
 {
  "id": "fnb-food-cost-per-outlet",
  "cat": "fnb",
  "name": "F&B · Food cost per outlet",
  "v": 4,
  "industry": "fnb",
  "visual": "chart",
  "variant": 0,
  "mirror": true,
  "ground": "haze",
  "pattern": "diagonal",
  "badge": "ready",
  "copy": {
   "head": "Food cost per outlet,|*every single day.*",
   "sub": "Every dish sold deducts its recipe, so Odoo shows which outlet runs over target before month end."
  },
  "layers": [
   {
    "type": "graph",
    "w": 620,
    "z": 12,
    "kind": "bar",
    "title": "Food cost by outlet",
    "tag": "This week",
    "data": [
     [
      "Orchard",
      29
     ],
     [
      "Tampines",
      31
     ],
     [
      "Jurong",
      36
     ],
     [
      "Bugis",
      30
     ],
     [
      "Punggol",
      28
     ]
    ],
    "highlight": 2,
    "unit": "%",
    "x": 408,
    "y": 462
   },
   {
    "type": "stat",
    "w": 300,
    "rot": -3,
    "z": 13,
    "value": "30.8%",
    "label": "Food cost today · -1.2%",
    "x": 64,
    "y": 476
   },
   {
    "type": "chip",
    "text": "Jurong is over target",
    "small": "36% vs 32% target",
    "icon": "bell",
    "z": 18,
    "rot": 2,
    "x": 76,
    "y": 621
   },
   {
    "type": "nexi",
    "pose": "think",
    "w": 217,
    "z": 16,
    "x": 46,
    "y": 752
   },
   {
    "type": "sparkles",
    "w": 92,
    "z": 21,
    "x": 372,
    "y": 422
   },
   {
    "type": "prop",
    "name": "bell",
    "w": 150,
    "rot": 6,
    "z": 17,
    "x": 648,
    "y": 852
   }
  ],
  "caption": "Most restaurant groups see food cost once a month, after the stock count. In Odoo every dish sold deducts its recipe, so each outlet's food cost is there every day, while there is still time to act. How often do you see yours?",
  "hashtags": [
   "#Odoo",
   "#FandB",
   "#FoodCost",
   "#Restaurant",
   "#Singapore"
  ],
  "source": "technext.asia/industries/fnb — recipes that deduct ingredients, food cost per outlet",
  "post": {
   "visual": "chart",
   "name": "F&B · Food cost per outlet",
   "head": "Food cost per outlet,|*every single day.*",
   "sub": "Every dish sold deducts its recipe, so Odoo shows which outlet runs over target before month end.",
   "chart": {
    "kind": "bar",
    "title": "Food cost by outlet",
    "tag": "This week",
    "data": [
     [
      "Orchard",
      29
     ],
     [
      "Tampines",
      31
     ],
     [
      "Jurong",
      36
     ],
     [
      "Bugis",
      30
     ],
     [
      "Punggol",
      28
     ]
    ],
    "highlight": 2,
    "unit": "%"
   },
   "kpi": [
    "Food cost today",
    "30.8%",
    "-1.2%"
   ],
   "chip": {
    "text": "Jurong is over target",
    "small": "36% vs 32% target",
    "icon": "bell"
   },
   "nexi": "think",
   "caption": "Most restaurant groups see food cost once a month, after the stock count. In Odoo every dish sold deducts its recipe, so each outlet's food cost is there every day, while there is still time to act. How often do you see yours?",
   "hashtags": [
    "#Odoo",
    "#FandB",
    "#FoodCost",
    "#Restaurant",
    "#Singapore"
   ],
   "mirror": true,
   "variant": 0,
   "background": "diagonal"
  }
 },
 {
  "id": "crm-one-pipeline",
  "cat": "apps",
  "name": "CRM pipeline",
  "v": 4,
  "visual": "board",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
  "pattern": "waves",
  "badge": "ready",
  "copy": {
   "head": "Every lead,|*one pipeline.*",
   "sub": "Odoo CRM shows every opportunity by stage, so nobody chases the same deal twice."
  },
  "layers": [
   {
    "view": "kanban",
    "stages": [
     [
      "New",
      [
       [
        "Office fit-out",
        "Sample Build Co",
        "S$ 18,000",
        "KL"
       ],
       [
        "POS for 3 outlets",
        "Sample Cafe",
        "S$ 9,400",
        "MT"
       ]
      ]
     ],
     [
      "Qualified",
      [
       [
        "Warehouse barcodes",
        "Sample Logistics",
        "S$ 12,500",
        "RS"
       ]
      ]
     ],
     [
      "Proposition",
      [
       [
        "Payroll + HR",
        "Sample Clinic",
        "S$ 7,200",
        "JW"
       ],
       [
        "Online store",
        "Sample Retail",
        "S$ 15,800",
        "AN"
       ]
      ]
     ],
     [
      "Won",
      [
       [
        "Accounting",
        "Sample Foods",
        "S$ 11,000",
        "LT"
       ]
      ]
     ]
    ],
    "highlight": [
     "2.1"
    ],
    "type": "appcard",
    "z": 12,
    "app": "crm",
    "title": "Pipeline",
    "crumb": "CRM · Sales team SG",
    "tag": "12 open deals",
    "w": 920,
    "x": 80,
    "y": 456
   },
   {
    "type": "pill",
    "text": "Drag it to Won",
    "rot": -4,
    "z": 19,
    "x": 40,
    "y": 904
   },
   {
    "type": "chip",
    "text": "Quote sent",
    "small": "Online store · S$ 15,800",
    "icon": "check",
    "tone": "ok",
    "z": 18,
    "rot": 2,
    "x": 765,
    "y": 912
   },
   {
    "type": "sparkles",
    "w": 96,
    "z": 21,
    "x": 930,
    "y": 406
   }
  ],
  "caption": "When leads live in inboxes and spreadsheets, two people end up chasing the same deal. Odoo CRM puts every opportunity on one pipeline, by stage, with the next step on each card. Book a call at technext.asia.",
  "hashtags": [
   "#Odoo",
   "#CRM",
   "#Sales",
   "#Singapore"
  ],
  "source": "technext.asia/odoo — CRM: opportunities by stage",
  "post": {
   "visual": "board",
   "view": "kanban",
   "name": "CRM pipeline",
   "head": "Every lead,|*one pipeline.*",
   "sub": "Odoo CRM shows every opportunity by stage, so nobody chases the same deal twice.",
   "app": "crm",
   "title": "Pipeline",
   "crumb": "CRM · Sales team SG",
   "tag": "12 open deals",
   "stages": [
    [
     "New",
     [
      [
       "Office fit-out",
       "Sample Build Co",
       "S$ 18,000",
       "KL"
      ],
      [
       "POS for 3 outlets",
       "Sample Cafe",
       "S$ 9,400",
       "MT"
      ]
     ]
    ],
    [
     "Qualified",
     [
      [
       "Warehouse barcodes",
       "Sample Logistics",
       "S$ 12,500",
       "RS"
      ]
     ]
    ],
    [
     "Proposition",
     [
      [
       "Payroll + HR",
       "Sample Clinic",
       "S$ 7,200",
       "JW"
      ],
      [
       "Online store",
       "Sample Retail",
       "S$ 15,800",
       "AN"
      ]
     ]
    ],
    [
     "Won",
     [
      [
       "Accounting",
       "Sample Foods",
       "S$ 11,000",
       "LT"
      ]
     ]
    ]
   ],
   "highlight": [
    "2.1"
   ],
   "pills": [
    "Drag it to Won"
   ],
   "chip": {
    "text": "Quote sent",
    "small": "Online store · S$ 15,800"
   },
   "caption": "When leads live in inboxes and spreadsheets, two people end up chasing the same deal. Odoo CRM puts every opportunity on one pipeline, by stage, with the next step on each card. Book a call at technext.asia.",
   "hashtags": [
    "#Odoo",
    "#CRM",
    "#Sales",
    "#Singapore"
   ],
   "mirror": false,
   "variant": 0,
   "background": "waves"
  }
 },
 {
  "id": "retail-whatsapp-orders",
  "cat": "retail",
  "name": "WhatsApp orders",
  "v": 4,
  "industry": "retail",
  "visual": "chat",
  "variant": 0,
  "mirror": true,
  "ground": "haze",
  "pattern": "spots",
  "badge": "ready",
  "copy": {
   "head": "WhatsApp orders|*land in Odoo.*",
   "sub": "A customer orders on WhatsApp and the sales order is waiting in Odoo, stock reserved."
  },
  "layers": [
   {
    "type": "chat",
    "w": 440,
    "rot": 3,
    "z": 12,
    "channel": "whatsapp",
    "title": "Sample Store",
    "status": "WhatsApp · online",
    "msgs": [
     [
      "in",
      "Hi! 2 linen shirts, size M, for pickup tomorrow?"
     ],
     [
      "out",
      "Sure, reserved for you. Pay at pickup or online."
     ],
     [
      "in",
      "Online please, thanks"
     ]
    ],
    "x": 588,
    "y": 461
   },
   {
    "type": "record",
    "app": "sale",
    "title": "S00231",
    "crumb": "Sales · Quotation",
    "status": "Sent",
    "rows": [
     [
      "Customer",
      "Mei Ling T.",
      "ok"
     ],
     [
      "Linen shirt (M)",
      "2 × S$ 49",
      ""
     ],
     [
      "Pickup",
      "Tomorrow, 11 am",
      ""
     ]
    ],
    "btn": "Confirm",
    "w": 500,
    "rot": -2,
    "z": 13,
    "x": 46,
    "y": 545
   },
   {
    "type": "arrow",
    "w": 112,
    "rot": -10,
    "z": 22,
    "kind": "right",
    "x": 532,
    "y": 467,
    "flip": true
   },
   {
    "type": "chip",
    "text": "Stock reserved",
    "small": "2 × Linen shirt (M)",
    "icon": "check",
    "tone": "ok",
    "z": 18,
    "rot": 1.5,
    "x": 245,
    "y": 893
   },
   {
    "type": "sparkles",
    "w": 90,
    "z": 21,
    "x": 520,
    "y": 631
   },
   {
    "type": "prop",
    "name": "cart",
    "w": 150,
    "rot": 6,
    "z": 17,
    "x": 736,
    "y": 785
   }
  ],
  "caption": "Customers order on WhatsApp; your team re-types it into the system later. Connected to Odoo, the chat becomes a quotation with the stock reserved, ready to confirm. How many WhatsApp orders does your team re-type every day?",
  "hashtags": [
   "#Odoo",
   "#Retail",
   "#WhatsApp",
   "#Singapore"
  ],
  "source": "technext.asia/industries/retail — WhatsApp and online orders into Odoo",
  "post": {
   "visual": "chat",
   "name": "WhatsApp orders",
   "head": "WhatsApp orders|*land in Odoo.*",
   "sub": "A customer orders on WhatsApp and the sales order is waiting in Odoo, stock reserved.",
   "chat": {
    "channel": "whatsapp",
    "title": "Sample Store",
    "status": "WhatsApp · online",
    "msgs": [
     [
      "in",
      "Hi! 2 linen shirts, size M, for pickup tomorrow?"
     ],
     [
      "out",
      "Sure, reserved for you. Pay at pickup or online."
     ],
     [
      "in",
      "Online please, thanks"
     ]
    ]
   },
   "record": {
    "app": "sale",
    "title": "S00231",
    "crumb": "Sales · Quotation",
    "status": "Sent",
    "rows": [
     [
      "Customer",
      "Mei Ling T.",
      "ok"
     ],
     [
      "Linen shirt (M)",
      "2 × S$ 49",
      ""
     ],
     [
      "Pickup",
      "Tomorrow, 11 am",
      ""
     ]
    ],
    "btn": "Confirm"
   },
   "chip": {
    "text": "Stock reserved",
    "small": "2 × Linen shirt (M)"
   },
   "caption": "Customers order on WhatsApp; your team re-types it into the system later. Connected to Odoo, the chat becomes a quotation with the stock reserved, ready to confirm. How many WhatsApp orders does your team re-type every day?",
   "hashtags": [
    "#Odoo",
    "#Retail",
    "#WhatsApp",
    "#Singapore"
   ],
   "mirror": true,
   "variant": 0,
   "background": "spots"
  }
 },
 {
  "id": "web-best-salesperson",
  "cat": "services",
  "name": "Website salesperson",
  "v": 4,
  "visual": "website",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
  "pattern": "fine",
  "badge": "",
  "copy": {
   "head": "Your website,|*your best salesperson.*",
   "sub": "TechNext builds fast, mobile-first sites where every inquiry reaches the right person."
  },
  "layers": [
   {
    "type": "devices",
    "w": 720,
    "z": 12,
    "site": "movewithease",
    "label": "Move with Ease · built by TechNext",
    "x": 46,
    "y": 453
   },
   {
    "type": "cursor",
    "w": 64,
    "z": 19,
    "x": 360,
    "y": 701
   },
   {
    "type": "chip",
    "text": "Fast on every phone",
    "icon": "check",
    "tone": "ok",
    "rot": 2,
    "z": 18,
    "x": 750,
    "y": 523
   },
   {
    "type": "chip",
    "text": "Every inquiry routed",
    "icon": "check",
    "tone": "ok",
    "rot": -1.5,
    "z": 18,
    "x": 750,
    "y": 619
   },
   {
    "type": "chip",
    "text": "Built to be found",
    "icon": "check",
    "tone": "ok",
    "rot": 1.5,
    "z": 18,
    "x": 762,
    "y": 715
   },
   {
    "type": "sparkles",
    "w": 100,
    "z": 21,
    "x": 930,
    "y": 415
   },
   {
    "type": "sphere",
    "w": 50,
    "z": 6,
    "x": 990,
    "y": 889
   }
  ],
  "caption": "A website should bring in inquiries, not just look good. TechNext builds fast, mobile-first sites where every inquiry reaches the right person, like this one for Move with Ease. Book a call at technext.asia.",
  "hashtags": [
   "#WebDesign",
   "#Website",
   "#Singapore",
   "#SmallBusiness"
  ],
  "source": "technext.asia/solutions/website — a TechNext-built site",
  "post": {
   "visual": "website",
   "site": "movewithease",
   "name": "Website salesperson",
   "head": "Your website,|*your best salesperson.*",
   "sub": "TechNext builds fast, mobile-first sites where every inquiry reaches the right person.",
   "chips": [
    "Fast on every phone",
    "Every inquiry routed",
    "Built to be found"
   ],
   "caption": "A website should bring in inquiries, not just look good. TechNext builds fast, mobile-first sites where every inquiry reaches the right person, like this one for Move with Ease. Book a call at technext.asia.",
   "hashtags": [
    "#WebDesign",
    "#Website",
    "#Singapore",
    "#SmallBusiness"
   ],
   "mirror": false,
   "variant": 0,
   "background": "fine"
  }
 },
 {
  "id": "kitchen-quote-signed",
  "cat": "kitchen",
  "name": "Kitchen · quote signed",
  "v": 4,
  "industry": "kitchen",
  "visual": "document",
  "variant": 0,
  "mirror": true,
  "ground": "haze",
  "pattern": "plus",
  "badge": "ready",
  "copy": {
   "head": "The kitchen quote,|*signed the same day.*",
   "sub": "Equipment, fabrication and installation on one Odoo quotation that the owner signs online."
  },
  "layers": [
   {
    "type": "nexi",
    "pose": "point",
    "w": 418,
    "z": 16,
    "x": 611,
    "y": 505,
    "s": 0.917
   },
   {
    "type": "doc",
    "kind": "quote",
    "app": "sale",
    "number": "S00118",
    "partner": "Sample Dining Pte Ltd",
    "fields": [
     [
      "Site",
      "Tampines outlet"
     ]
    ],
    "lines": [
     [
      "Combi oven, 10 trays",
      "1",
      "S$ 18,400.00"
     ],
     [
      "Stainless prep table",
      "3",
      "S$ 4,650.00"
     ],
     [
      "Installation",
      "1",
      "S$ 1,200.00"
     ]
    ],
    "total": "S$ 24,250.00",
    "note": "Signed online by the owner",
    "btns": [],
    "w": 560,
    "rot": -2,
    "z": 12,
    "x": 45,
    "y": 421,
    "s": 0.917
   },
   {
    "type": "bubble",
    "text": "Signed!",
    "rot": 3,
    "z": 20,
    "x": 831,
    "y": 438,
    "s": 0.917
   },
   {
    "type": "chip",
    "text": "Layout approved",
    "icon": "spark",
    "rot": 1.5,
    "z": 18,
    "x": 261,
    "y": 911,
    "s": 0.917
   },
   {
    "type": "chip",
    "text": "Signed online",
    "icon": "check",
    "tone": "ok",
    "rot": -1.5,
    "z": 19,
    "x": 246,
    "y": 983,
    "s": 0.917
   },
   {
    "type": "sparkles",
    "w": 96,
    "z": 21,
    "x": 558,
    "y": 479,
    "s": 0.917
   },
   {
    "type": "stamp",
    "text": "SIGNED",
    "tone": "b",
    "rot": 9,
    "z": 24,
    "x": 53,
    "y": 837,
    "s": 0.917
   }
  ],
  "caption": "Commercial kitchen quotes still built in spreadsheets? In Odoo the equipment, the fabrication and the installation sit on one quotation, and the owner signs it online the same day. Book a call at technext.asia.",
  "hashtags": [
   "#Odoo",
   "#CommercialKitchen",
   "#Singapore"
  ],
  "source": "Studio kitchen profile: quotation templates with e-signature",
  "post": {
   "visual": "document",
   "kind": "quote",
   "head": "The kitchen quote,|*signed the same day.*",
   "sub": "Equipment, fabrication and installation on one Odoo quotation that the owner signs online.",
   "number": "S00118",
   "partner": "Sample Dining Pte Ltd",
   "fields": [
    [
     "Site",
     "Tampines outlet"
    ]
   ],
   "lines": [
    [
     "Combi oven, 10 trays",
     "1",
     "S$ 18,400.00"
    ],
    [
     "Stainless prep table",
     "3",
     "S$ 4,650.00"
    ],
    [
     "Installation",
     "1",
     "S$ 1,200.00"
    ]
   ],
   "total": "S$ 24,250.00",
   "note": "Signed online by the owner",
   "steps": [
    "Layout approved",
    "Signed online"
   ],
   "bubble": "Signed!",
   "nexi": "point",
   "props": [
    "oven"
   ],
   "accents": [
    {
     "type": "stamp",
     "text": "SIGNED",
     "tone": "blue"
    }
   ],
   "name": "Kitchen · quote signed",
   "caption": "Commercial kitchen quotes still built in spreadsheets? In Odoo the equipment, the fabrication and the installation sit on one quotation, and the owner signs it online the same day. Book a call at technext.asia.",
   "hashtags": [
    "#Odoo",
    "#CommercialKitchen",
    "#Singapore"
   ],
   "mirror": true,
   "variant": 0,
   "background": "plus"
  }
 },
 {
  "id": "kitchen-growth-pyramid",
  "cat": "kitchen",
  "name": "Kitchen · growth pyramid",
  "v": 4,
  "industry": "kitchen",
  "visual": "pyramid",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
  "pattern": "grid",
  "badge": "ready",
  "copy": {
   "head": "The business growth|*pyramid.*",
   "sub": "Each stage builds on the one below it: operations first, then growth, then scale."
  },
  "layers": [
   {
    "type": "pyramid",
    "w": 640,
    "z": 12,
    "levels": [
     [
      "Exit",
      "IPO or merger"
     ],
     [
      "IoT",
      "Connected equipment"
     ],
     [
      "ID | IT",
      "Design and technology"
     ],
     [
      "Marketing",
      "Growth"
     ],
     [
      "ERP",
      "Sales · Ops · Admin"
     ]
    ],
    "hot": 4,
    "x": 220,
    "y": 464
   },
   {
    "type": "pill",
    "text": "Start here",
    "rot": -4,
    "z": 19,
    "x": 30,
    "y": 806
   },
   {
    "type": "pill",
    "text": "Then scale",
    "rot": 4,
    "z": 19,
    "x": 821,
    "y": 553
   },
   {
    "type": "sparkles",
    "w": 96,
    "z": 21,
    "x": 490,
    "y": 414
   },
   {
    "type": "prop",
    "name": "chefhat",
    "w": 150,
    "rot": -6,
    "z": 17,
    "x": 62,
    "y": 634
   }
  ],
  "caption": "Growth starts at the bottom: one system for sales, operations and admin. Marketing, design and technology, and connected equipment come after. Which stage is your kitchen business at?",
  "hashtags": [
   "#Odoo",
   "#BusinessGrowth",
   "#CommercialKitchen"
  ],
  "source": "Drive drip \"The Business Growth Pyramid\", rebuilt in the clean style",
  "post": {
   "visual": "pyramid",
   "head": "The business growth|*pyramid.*",
   "sub": "Each stage builds on the one below it: operations first, then growth, then scale.",
   "levels": [
    [
     "Exit",
     "IPO or merger"
    ],
    [
     "IoT",
     "Connected equipment"
    ],
    [
     "ID | IT",
     "Design and technology"
    ],
    [
     "Marketing",
     "Growth"
    ],
    [
     "ERP",
     "Sales · Ops · Admin"
    ]
   ],
   "hot": 4,
   "pills": [
    "Start here",
    "Then scale"
   ],
   "background": "grid",
   "name": "Kitchen · growth pyramid",
   "caption": "Growth starts at the bottom: one system for sales, operations and admin. Marketing, design and technology, and connected equipment come after. Which stage is your kitchen business at?",
   "hashtags": [
    "#Odoo",
    "#BusinessGrowth",
    "#CommercialKitchen"
   ],
   "mirror": false,
   "variant": 0
  }
 },
 {
  "id": "kitchen-happy-head-chef",
  "cat": "kitchen",
  "name": "Kitchen · happy head chef",
  "v": 4,
  "industry": "kitchen",
  "visual": "spotlight",
  "variant": 0,
  "mirror": true,
  "ground": "haze",
  "pattern": "floor",
  "badge": "ready",
  "copy": {
   "head": "Happy head chef,|*happy kitchen.*",
   "sub": "Equipment, parts and service visits in one Odoo, so the kitchen team gets what it needs on time.",
   "kicker": "Reasons your customer"
  },
  "layers": [
   {
    "type": "glow",
    "w": 660,
    "z": 2,
    "x": 210,
    "y": 476
   },
   {
    "type": "prop",
    "name": "chefhat",
    "w": 400,
    "rot": 4,
    "z": 12,
    "x": 340,
    "y": 520
   },
   {
    "type": "pill",
    "text": "Parts in stock",
    "rot": 5,
    "z": 19,
    "x": 753,
    "y": 566
   },
   {
    "type": "pill",
    "text": "Service on time",
    "rot": -4,
    "z": 19,
    "x": 40,
    "y": 726
   },
   {
    "type": "pill",
    "text": "One call",
    "rot": 2,
    "z": 19,
    "x": 823,
    "y": 916
   },
   {
    "type": "chip",
    "text": "Service visit booked",
    "small": "Combi oven · Tue 10 am",
    "icon": "check",
    "tone": "ok",
    "z": 18,
    "rot": -3,
    "x": 130,
    "y": 936
   },
   {
    "type": "sparkles",
    "w": 116,
    "z": 21,
    "x": 140,
    "y": 500
   }
  ],
  "caption": "A head chef wants the parts in stock and the service visit on time. With equipment, spare parts and service calls in one Odoo, your team can promise both. Book a call at technext.asia.",
  "hashtags": [
   "#Odoo",
   "#CommercialKitchen",
   "#FieldService"
  ],
  "source": "Drive drip series \"Reasons your customer\", rebuilt with a prop",
  "post": {
   "visual": "spotlight",
   "prop": "chefhat",
   "head": "Happy head chef,|*happy kitchen.*",
   "sub": "Equipment, parts and service visits in one Odoo, so the kitchen team gets what it needs on time.",
   "kicker": "Reasons your customer",
   "pills": [
    "Parts in stock",
    "Service on time",
    "One call"
   ],
   "chip": {
    "text": "Service visit booked",
    "small": "Combi oven · Tue 10 am",
    "icon": "check"
   },
   "background": "floor",
   "name": "Kitchen · happy head chef",
   "caption": "A head chef wants the parts in stock and the service visit on time. With equipment, spare parts and service calls in one Odoo, your team can promise both. Book a call at technext.asia.",
   "hashtags": [
    "#Odoo",
    "#CommercialKitchen",
    "#FieldService"
   ],
   "mirror": true,
   "variant": 0
  }
 },
 {
  "id": "it-ticket-to-solved",
  "cat": "it",
  "name": "IT · ticket to solved",
  "v": 4,
  "industry": "it",
  "visual": "ticket",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
  "pattern": "dots",
  "badge": "ready",
  "copy": {
   "head": "Every IT issue,|*tracked to solved.*",
   "sub": "Requests from email or WhatsApp become tickets with an SLA, and the customer rates the fix."
  },
  "layers": [
   {
    "type": "chat",
    "w": 420,
    "rot": -3,
    "z": 12,
    "channel": "whatsapp",
    "title": "Sample Logistics",
    "msgs": [
     [
      "in",
      "Hi, camera 3 at the warehouse is offline"
     ],
     [
      "out",
      "Ticket #2041 opened. Ravi is on his way."
     ]
    ],
    "x": 44,
    "y": 446
   },
   {
    "type": "ticket",
    "w": 540,
    "rot": 2,
    "z": 13,
    "app": "helpdesk",
    "title": "#2041 · CCTV offline",
    "stage": "In progress",
    "priority": 3,
    "sla": "1h left",
    "channel": "WhatsApp",
    "text": "Camera 3 at the warehouse shows no signal since 9am.",
    "assignee": "Ravi S.",
    "tags": [
     "CCTV",
     "Onsite"
    ],
    "x": 496,
    "y": 556
   },
   {
    "type": "rating",
    "w": 400,
    "rot": -2,
    "z": 14,
    "stars": 5,
    "text": "Back online in an hour. Thanks team!",
    "who": "Daniel K.",
    "meta": "Rated ticket #2041",
    "x": 60,
    "y": 726
   },
   {
    "type": "sparkles",
    "w": 90,
    "z": 21,
    "x": 976,
    "y": 500
   },
   {
    "type": "prop",
    "name": "cctv",
    "w": 170,
    "rot": -6,
    "z": 17,
    "x": 458,
    "y": 858
   }
  ],
  "caption": "A camera goes offline and the customer messages on WhatsApp. In Odoo it becomes a ticket with an SLA, the engineer is assigned, and the customer rates the fix. How do your support requests arrive today?",
  "hashtags": [
   "#Odoo",
   "#Helpdesk",
   "#ITServices"
  ],
  "source": "Studio IT profile: Helpdesk with SLA timers and ratings",
  "post": {
   "visual": "ticket",
   "head": "Every IT issue,|*tracked to solved.*",
   "sub": "Requests from email or WhatsApp become tickets with an SLA, and the customer rates the fix.",
   "title": "#2041 · CCTV offline",
   "crumb": "",
   "stage": "In progress",
   "priority": 3,
   "sla": "1h left",
   "channel": "WhatsApp",
   "text": "Camera 3 at the warehouse shows no signal since 9am.",
   "assignee": "Ravi S.",
   "tags": [
    "CCTV",
    "Onsite"
   ],
   "chat": {
    "channel": "whatsapp",
    "title": "Sample Logistics",
    "msgs": [
     [
      "in",
      "Hi, camera 3 at the warehouse is offline"
     ],
     [
      "out",
      "Ticket #2041 opened. Ravi is on his way."
     ]
    ]
   },
   "rating": {
    "stars": 5,
    "text": "Back online in an hour. Thanks team!",
    "who": "Daniel K.",
    "meta": "Rated ticket #2041"
   },
   "props": [
    "cctv"
   ],
   "background": "dots",
   "name": "IT · ticket to solved",
   "caption": "A camera goes offline and the customer messages on WhatsApp. In Odoo it becomes a ticket with an SLA, the engineer is assigned, and the customer rates the fix. How do your support requests arrive today?",
   "hashtags": [
    "#Odoo",
    "#Helpdesk",
    "#ITServices"
   ],
   "mirror": false,
   "variant": 0
  }
 },
 {
  "id": "retail-shop-open-all-night",
  "cat": "retail",
  "name": "Retail · shop open all night",
  "v": 4,
  "industry": "retail",
  "visual": "store",
  "variant": 0,
  "mirror": true,
  "ground": "haze",
  "pattern": "hex",
  "badge": "ready",
  "copy": {
   "head": "Your shop|*open all night.*",
   "sub": "The Odoo online shop shares stock and prices with your stores, and orders arrive paid."
  },
  "layers": [
   {
    "type": "shop",
    "w": 640,
    "rot": 1.5,
    "z": 12,
    "brand": "Sample Store",
    "url": "samplestore.sg/shop",
    "product": "Linen shirt",
    "category": "Apparel",
    "icon": "shirt",
    "price": "S$ 49.00",
    "rating": 4.5,
    "reviews": "128 reviews",
    "stock": "In stock · ships today",
    "options": [
     "S",
     "M",
     "L",
     "XL"
    ],
    "cart": "2",
    "btn": "Add to cart",
    "x": 404,
    "y": 455
   },
   {
    "type": "notif",
    "w": 380,
    "rot": -3,
    "z": 14,
    "app": "website_sale",
    "title": "New order S00412",
    "text": "Paid online · 2 items",
    "time": "02:14",
    "x": 30,
    "y": 805
   },
   {
    "type": "pill",
    "text": "Same stock as the store",
    "rot": 3,
    "z": 19,
    "x": 582,
    "y": 921
   },
   {
    "type": "sparkles",
    "w": 90,
    "z": 21,
    "x": 354,
    "y": 409
   },
   {
    "type": "prop",
    "name": "bag",
    "w": 170,
    "rot": 6,
    "z": 17,
    "x": 232,
    "y": 597
   }
  ],
  "caption": "Your stores close at 10; your online shop does not. The Odoo shop sells from the same stock and prices as your stores, and every order arrives paid and ready to pick. Book a call at technext.asia.",
  "hashtags": [
   "#Odoo",
   "#Retail",
   "#eCommerce"
  ],
  "source": "technext.asia/industries/retail — the online shop on the same stock",
  "post": {
   "visual": "store",
   "head": "Your shop|*open all night.*",
   "sub": "The Odoo online shop shares stock and prices with your stores, and orders arrive paid.",
   "brand": "Sample Store",
   "url": "samplestore.sg/shop",
   "product": "Linen shirt",
   "category": "Apparel",
   "icon": "shirt",
   "price": "S$ 49.00",
   "rating": 4.5,
   "reviews": "128 reviews",
   "stock": "In stock · ships today",
   "options": [
    "S",
    "M",
    "L",
    "XL"
   ],
   "cart": "2",
   "btn": "Add to cart",
   "notif": {
    "app": "website_sale",
    "title": "New order S00412",
    "text": "Paid online · 2 items",
    "time": "02:14"
   },
   "pills": [
    "Same stock as the store"
   ],
   "props": [
    "bag"
   ],
   "background": "hex",
   "name": "Retail · shop open all night",
   "caption": "Your stores close at 10; your online shop does not. The Odoo shop sells from the same stock and prices as your stores, and every order arrives paid and ready to pick. Book a call at technext.asia.",
   "hashtags": [
    "#Odoo",
    "#Retail",
    "#eCommerce"
   ],
   "mirror": true,
   "variant": 0
  }
 },
 {
  "id": "apps-quote-order-invoice",
  "cat": "apps",
  "name": "Quote, order, invoice",
  "v": 4,
  "visual": "fan",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
  "pattern": "rings",
  "badge": "ready",
  "copy": {
   "head": "Quote, order, invoice:|*one record, handed on.*",
   "sub": "The sales order carries the customer and the lines from the quote to the invoice, so nothing is typed twice."
  },
  "layers": [
   {
    "type": "doc",
    "kind": "quote",
    "app": "sale",
    "number": "S00118",
    "partner": "Sample Trading Pte Ltd",
    "fields": [],
    "lines": [],
    "total": "S$ 4,665.20",
    "btns": [],
    "compact": true,
    "w": 336,
    "rot": -6,
    "z": 11,
    "x": 34,
    "y": 529
   },
   {
    "type": "doc",
    "kind": "order",
    "app": "sale",
    "number": "S00118",
    "partner": "Sample Trading Pte Ltd",
    "fields": [],
    "lines": [],
    "total": "S$ 4,665.20",
    "btns": [],
    "compact": true,
    "w": 336,
    "rot": 0,
    "z": 13,
    "x": 372,
    "y": 481
   },
   {
    "type": "doc",
    "kind": "invoice",
    "app": "accountant",
    "number": "INV/2026/0142",
    "partner": "Sample Trading Pte Ltd",
    "fields": [],
    "lines": [],
    "total": "S$ 4,665.20",
    "ribbon": "PAID",
    "btns": [],
    "compact": true,
    "w": 336,
    "rot": 6,
    "z": 12,
    "x": 710,
    "y": 529
   },
   {
    "type": "arrow",
    "w": 92,
    "rot": -8,
    "z": 26,
    "kind": "right",
    "x": 324,
    "y": 724
   },
   {
    "type": "arrow",
    "w": 92,
    "rot": -8,
    "z": 26,
    "kind": "right",
    "x": 662,
    "y": 724
   },
   {
    "type": "pill",
    "text": "Nothing retyped",
    "rot": -3,
    "z": 19,
    "x": 70,
    "y": 816
   },
   {
    "type": "pill",
    "text": "Paid online",
    "rot": 3,
    "z": 19,
    "x": 778,
    "y": 816
   },
   {
    "type": "sparkles",
    "w": 90,
    "z": 21,
    "x": 678,
    "y": 425
   }
  ],
  "caption": "The quotation becomes the sales order, and the sales order becomes the invoice. In Odoo it is one record handed on, so the customer and the lines are never typed twice. Book a call at technext.asia.",
  "hashtags": [
   "#Odoo",
   "#Sales",
   "#Accounting"
  ],
  "source": "technext.asia — the sales order record flow",
  "post": {
   "visual": "fan",
   "head": "Quote, order, invoice:|*one record, handed on.*",
   "sub": "The sales order carries the customer and the lines from the quote to the invoice, so nothing is typed twice.",
   "docs": [
    {
     "kind": "quote",
     "number": "S00118",
     "partner": "Sample Trading Pte Ltd",
     "total": "S$ 4,665.20"
    },
    {
     "kind": "order",
     "number": "S00118",
     "partner": "Sample Trading Pte Ltd",
     "total": "S$ 4,665.20"
    },
    {
     "kind": "invoice",
     "number": "INV/2026/0142",
     "partner": "Sample Trading Pte Ltd",
     "total": "S$ 4,665.20",
     "ribbon": "PAID"
    }
   ],
   "pills": [
    "Nothing retyped",
    "Paid online"
   ],
   "background": "rings",
   "name": "Quote, order, invoice",
   "caption": "The quotation becomes the sales order, and the sales order becomes the invoice. In Odoo it is one record handed on, so the customer and the lines are never typed twice. Book a call at technext.asia.",
   "hashtags": [
    "#Odoo",
    "#Sales",
    "#Accounting"
   ],
   "mirror": false,
   "variant": 0
  }
 }
];
