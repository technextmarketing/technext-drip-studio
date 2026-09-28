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
    "id": "field-service",
    "group": "Industries",
    "name": "Field Service"
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
   "variant": 0
  }
 },
 {
  "id": "fnb-supplier-to-books",
  "cat": "fnb",
  "name": "F&B · Supplier to the books",
  "v": 4,
  "visual": "flow",
  "variant": 0,
  "mirror": false,
  "ground": "haze",
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
    "y": 454
   },
   {
    "type": "note",
    "text": "paper tickets",
    "variant": "red strike",
    "size": 46,
    "rot": -4,
    "z": 20,
    "x": 267,
    "y": 950
   },
   {
    "type": "arrow",
    "w": 100,
    "rot": 8,
    "z": 20,
    "kind": "right",
    "x": 486,
    "y": 936
   },
   {
    "type": "note",
    "text": "kitchen display",
    "size": 46,
    "rot": -3,
    "z": 20,
    "x": 606,
    "y": 946
   },
   {
    "type": "sparkles",
    "w": 100,
    "z": 21,
    "x": 946,
    "y": 402
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
   "variant": 0
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
   "variant": 0
  }
 },
 {
  "id": "fnb-food-cost-per-outlet",
  "cat": "fnb",
  "name": "F&B · Food cost per outlet",
  "v": 4,
  "visual": "chart",
  "variant": 0,
  "mirror": true,
  "ground": "haze",
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
    "y": 487
   },
   {
    "type": "stat",
    "w": 300,
    "rot": -3,
    "z": 13,
    "value": "30.8%",
    "label": "Food cost today · -1.2%",
    "x": 64,
    "y": 501
   },
   {
    "type": "chip",
    "text": "Jurong is over target",
    "small": "36% vs 32% target",
    "icon": "bell",
    "z": 18,
    "rot": 2,
    "x": 76,
    "y": 646
   },
   {
    "type": "nexi",
    "pose": "think",
    "w": 217,
    "z": 16,
    "x": 46,
    "y": 777
   },
   {
    "type": "sparkles",
    "w": 92,
    "z": 21,
    "x": 372,
    "y": 447
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
   "variant": 0
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
   "variant": 0
  }
 },
 {
  "id": "retail-whatsapp-orders",
  "cat": "retail",
  "name": "WhatsApp orders",
  "v": 4,
  "visual": "chat",
  "variant": 0,
  "mirror": true,
  "ground": "haze",
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
   "variant": 0
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
   "variant": 0
  }
 }
];
