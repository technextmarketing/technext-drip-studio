/* TechNext Drip Studio — the starter library (v3 designs). The claude.ai hub keeps its own live copy in
   its database; this file seeds new hubs and the GitHub mirror. See README.md for the fields. */

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
    "id": "o20-offline-pos",
    "cat": "odoo20",
    "name": "Offline POS",
    "angle": "",
    "v": 3,
    "bg": {
      "style": "navy",
      "palette": "night",
      "seed": 389370,
      "focus": [
        883,
        801
      ]
    },
    "cam": "dutch",
    "badge": "o20",
    "copy": {
      "head": "No signal?|*The till keeps selling.*",
      "sub": "Odoo keeps taking sales offline and syncs every order when the connection is back."
    },
    "layers": [
      {
        "type": "glow",
        "x": 699,
        "y": 618,
        "w": 367,
        "z": 1,
        "op": 0.8
      },
      {
        "type": "ophone",
        "app": "point_of_sale",
        "view": "pos",
        "crumbs": [
          "Shop 2"
        ],
        "table": "Order 0417",
        "products": [
          [
            "Linen shirt",
            "S$ 49"
          ],
          [
            "Canvas tote",
            "S$ 29"
          ],
          [
            "Silk scarf",
            "S$ 39"
          ],
          [
            "Cap",
            "S$ 19"
          ]
        ],
        "order": [
          [
            "Linen shirt",
            "1",
            "S$ 49",
            "S$ 49.00"
          ],
          [
            "Canvas tote",
            "2",
            "S$ 29",
            "S$ 58.00"
          ]
        ],
        "total": "S$ 107.00",
        "btn": "Payment",
        "role": "hero",
        "w": 306,
        "x": 730,
        "y": 485,
        "cam": true,
        "z": 10
      },
      {
        "type": "notif",
        "app": "point_of_sale",
        "title": "Back online",
        "text": "14 orders synced to Odoo",
        "time": "now",
        "role": "support",
        "w": 464,
        "x": 359,
        "y": 750,
        "cam": true,
        "z": 12
      },
      {
        "type": "note",
        "z": 40,
        "text": "sales lost",
        "variant": "red strike",
        "size": 44,
        "rot": 3,
        "x": 42,
        "y": 1000
      },
      {
        "type": "sparkles",
        "x": 40,
        "y": 488,
        "w": 100,
        "z": 41
      }
    ],
    "caption": "No signal on the shop floor? Odoo 20 keeps the till selling offline and syncs every order when the connection is back. Book a call at technext.asia.",
    "hashtags": [
      "#Odoo20",
      "#OdooPOS",
      "#Retail"
    ],
    "source": "Starter: Offline on the phone",
    "scene": {
      "name": "Offline POS",
      "head": "No signal?|*The till keeps selling.*",
      "sub": "Odoo keeps taking sales offline and syncs every order when the connection is back.",
      "badge": "o20",
      "hero": {
        "type": "ophone",
        "app": "point_of_sale",
        "view": "pos",
        "crumbs": [
          "Shop 2"
        ],
        "table": "Order 0417",
        "products": [
          [
            "Linen shirt",
            "S$ 49"
          ],
          [
            "Canvas tote",
            "S$ 29"
          ],
          [
            "Silk scarf",
            "S$ 39"
          ],
          [
            "Cap",
            "S$ 19"
          ]
        ],
        "order": [
          [
            "Linen shirt",
            "1",
            "S$ 49",
            "S$ 49.00"
          ],
          [
            "Canvas tote",
            "2",
            "S$ 29",
            "S$ 58.00"
          ]
        ],
        "total": "S$ 107.00",
        "btn": "Payment"
      },
      "support": [
        {
          "type": "notif",
          "app": "point_of_sale",
          "title": "Back online",
          "text": "14 orders synced to Odoo",
          "time": "now"
        }
      ],
      "accents": [
        {
          "type": "note",
          "text": "sales lost",
          "strike": true
        }
      ],
      "look": {
        "layout": "left",
        "camera": "dutch",
        "bg": "navy"
      }
    },
    "order": 0,
    "createdAt": "2026-09-28T12:00:00Z"
  },
  {
    "id": "fnb-pos-to-kitchen",
    "cat": "fnb",
    "name": "POS to kitchen",
    "angle": "",
    "v": 3,
    "bg": {
      "style": "floor",
      "palette": "sunrise",
      "seed": 286719,
      "focus": [
        387,
        748
      ]
    },
    "cam": "tilt-r",
    "badge": "ready",
    "copy": {
      "head": "The order hits the kitchen|*before the waiter walks back.*",
      "sub": "Odoo POS sends every table order straight to the kitchen display, so nothing is lost on paper."
    },
    "layers": [
      {
        "type": "glow",
        "x": -24,
        "y": 337,
        "w": 822,
        "z": 1,
        "op": 0.8
      },
      {
        "type": "window",
        "app": "pos_restaurant",
        "view": "pos",
        "appLabel": "Point of Sale",
        "table": "Table 12 · 4 guests",
        "products": [
          [
            "Laksa",
            "S$ 9.50"
          ],
          [
            "Chicken rice",
            "S$ 7.80"
          ],
          [
            "Satay (10)",
            "S$ 12.00"
          ],
          [
            "Iced lemon tea",
            "S$ 3.20"
          ],
          [
            "Kaya toast",
            "S$ 4.50"
          ],
          [
            "Teh tarik",
            "S$ 2.80"
          ]
        ],
        "order": [
          [
            "Laksa",
            "2",
            "S$ 9.50",
            "S$ 19.00"
          ],
          [
            "Chicken rice",
            "1",
            "S$ 7.80",
            "S$ 7.80"
          ],
          [
            "Iced lemon tea",
            "3",
            "S$ 3.20",
            "S$ 9.60"
          ]
        ],
        "total": "S$ 36.40",
        "btn": "Order",
        "role": "hero",
        "w": 685,
        "x": 44,
        "y": 547,
        "cam": true,
        "z": 10
      },
      {
        "type": "window",
        "app": "pos_restaurant",
        "view": "kds",
        "frame": false,
        "appLabel": "Kitchen Display",
        "tickets": [
          [
            "Table 12",
            [
              [
                "Laksa",
                "2"
              ],
              [
                "Chicken rice",
                "1"
              ]
            ],
            "Cooking",
            "2 min"
          ],
          [
            "Table 7",
            [
              [
                "Satay (10)",
                "1"
              ],
              [
                "Kaya toast",
                "2"
              ]
            ],
            "Ready",
            "6 min"
          ]
        ],
        "role": "support",
        "w": 504,
        "x": 552,
        "y": 703,
        "cam": true,
        "z": 12
      },
      {
        "type": "link",
        "labelOnly": true,
        "x1": 622,
        "y1": 697,
        "x2": 622,
        "y2": 697,
        "label": "→ Sent to the kitchen",
        "tone": "",
        "z": 45
      },
      {
        "type": "pill",
        "z": 40,
        "text": "No paper tickets",
        "rot": -3,
        "x": 30,
        "y": 974
      },
      {
        "type": "sparkles",
        "x": 931,
        "y": 922,
        "w": 100,
        "z": 41
      }
    ],
    "caption": "Paper tickets get lost. In Odoo POS every table order goes straight to the kitchen display. How does your kitchen get orders today?",
    "hashtags": [
      "#OdooPOS",
      "#FnB",
      "#Singapore"
    ],
    "source": "Starter: POS to kitchen",
    "scene": {
      "name": "POS to kitchen",
      "head": "The order hits the kitchen|*before the waiter walks back.*",
      "sub": "Odoo POS sends every table order straight to the kitchen display, so nothing is lost on paper.",
      "hero": {
        "type": "window",
        "app": "pos_restaurant",
        "view": "pos",
        "appLabel": "Point of Sale",
        "table": "Table 12 · 4 guests",
        "products": [
          [
            "Laksa",
            "S$ 9.50"
          ],
          [
            "Chicken rice",
            "S$ 7.80"
          ],
          [
            "Satay (10)",
            "S$ 12.00"
          ],
          [
            "Iced lemon tea",
            "S$ 3.20"
          ],
          [
            "Kaya toast",
            "S$ 4.50"
          ],
          [
            "Teh tarik",
            "S$ 2.80"
          ]
        ],
        "order": [
          [
            "Laksa",
            "2",
            "S$ 9.50",
            "S$ 19.00"
          ],
          [
            "Chicken rice",
            "1",
            "S$ 7.80",
            "S$ 7.80"
          ],
          [
            "Iced lemon tea",
            "3",
            "S$ 3.20",
            "S$ 9.60"
          ]
        ],
        "total": "S$ 36.40",
        "btn": "Order"
      },
      "support": [
        {
          "type": "window",
          "app": "pos_restaurant",
          "view": "kds",
          "frame": false,
          "appLabel": "Kitchen Display",
          "tickets": [
            [
              "Table 12",
              [
                [
                  "Laksa",
                  "2"
                ],
                [
                  "Chicken rice",
                  "1"
                ]
              ],
              "Cooking",
              "2 min"
            ],
            [
              "Table 7",
              [
                [
                  "Satay (10)",
                  "1"
                ],
                [
                  "Kaya toast",
                  "2"
                ]
              ],
              "Ready",
              "6 min"
            ]
          ]
        }
      ],
      "links": [
        {
          "from": "hero",
          "to": "s0",
          "label": "Sent to the kitchen"
        }
      ],
      "accents": [
        {
          "type": "pill",
          "text": "No paper tickets"
        }
      ],
      "look": {
        "layout": "top",
        "camera": "tilt-r",
        "bg": "floor",
        "palette": "sunrise"
      }
    },
    "order": 1,
    "createdAt": "2026-09-28T12:00:01Z"
  },
  {
    "id": "ai-bill-reads-itself",
    "cat": "ai",
    "name": "AI vendor bill",
    "angle": "",
    "v": 3,
    "bg": {
      "style": "rays",
      "palette": "sky",
      "seed": 366240,
      "focus": [
        387,
        764
      ]
    },
    "cam": "iso-l",
    "badge": "ready",
    "copy": {
      "head": "The bill reads itself.|*You just approve.*",
      "sub": "AI inside Odoo reads the supplier PDF, fills the vendor bill and matches the purchase order."
    },
    "layers": [
      {
        "type": "glow",
        "x": -24,
        "y": 353,
        "w": 822,
        "z": 1,
        "op": 0.8
      },
      {
        "type": "window",
        "app": "accountant",
        "view": "form",
        "crumbs": [
          "Vendor Bills",
          "BILL/2026/0311"
        ],
        "status": [
          "Draft",
          "Posted"
        ],
        "statusAt": 0,
        "buttons": [
          "Confirm"
        ],
        "record": "Draft Bill",
        "fields": [
          [
            "Vendor",
            "Sample Seafood Pte Ltd"
          ],
          [
            "Bill date",
            "24 Sep 2026"
          ],
          [
            "Reference",
            "INV-88213"
          ],
          [
            "Purchase order",
            "P00088"
          ]
        ],
        "highlight": [
          "Vendor",
          "Bill date",
          "Reference",
          "Purchase order"
        ],
        "ai": true,
        "lines": [
          [
            "Prawns 2 kg",
            "6",
            "S$ 32.00",
            "S$ 192.00"
          ],
          [
            "Salmon fillet",
            "4",
            "S$ 28.50",
            "S$ 114.00"
          ]
        ],
        "total": "S$ 333.54",
        "chatter": "Odoo AI filled 4 fields from the PDF and matched P00088. Waiting for your approval.",
        "role": "hero",
        "w": 685,
        "x": 44,
        "y": 489,
        "cam": true,
        "z": 10
      },
      {
        "type": "receipt",
        "vendor": "Sample Seafood Pte Ltd",
        "doc": "TAX INVOICE",
        "lines": [
          [
            "Prawns 2 kg ×6",
            "192.00"
          ],
          [
            "Salmon fillet ×4",
            "114.00"
          ],
          [
            "GST 9%",
            "27.54"
          ]
        ],
        "total": "S$ 333.54",
        "stamp": "SCANNED",
        "role": "support",
        "w": 343,
        "x": 660,
        "y": 676,
        "cam": true,
        "z": 12,
        "rot": 3
      },
      {
        "type": "link",
        "labelOnly": true,
        "x1": 661,
        "y1": 823,
        "x2": 661,
        "y2": 823,
        "label": "→ AI reads the PDF",
        "tone": "",
        "z": 45
      },
      {
        "type": "nexi",
        "z": 40,
        "pose": "point",
        "w": 254,
        "glow": false,
        "x": 791,
        "y": 486
      },
      {
        "type": "sparkles",
        "x": 18,
        "y": 944,
        "w": 100,
        "z": 41
      }
    ],
    "caption": "Supplier bills still typed by hand? With AI inside Odoo, the PDF fills the bill and the purchase order is matched. Finance only approves. Book a call at technext.asia.",
    "hashtags": [
      "#Odoo",
      "#AI",
      "#Accounting"
    ],
    "source": "Starter: AI reads the bill",
    "scene": {
      "name": "AI vendor bill",
      "head": "The bill reads itself.|*You just approve.*",
      "sub": "AI inside Odoo reads the supplier PDF, fills the vendor bill and matches the purchase order.",
      "hero": {
        "type": "window",
        "app": "accountant",
        "view": "form",
        "crumbs": [
          "Vendor Bills",
          "BILL/2026/0311"
        ],
        "status": [
          "Draft",
          "Posted"
        ],
        "statusAt": 0,
        "buttons": [
          "Confirm"
        ],
        "record": "Draft Bill",
        "fields": [
          [
            "Vendor",
            "Sample Seafood Pte Ltd"
          ],
          [
            "Bill date",
            "24 Sep 2026"
          ],
          [
            "Reference",
            "INV-88213"
          ],
          [
            "Purchase order",
            "P00088"
          ]
        ],
        "highlight": [
          "Vendor",
          "Bill date",
          "Reference",
          "Purchase order"
        ],
        "ai": true,
        "lines": [
          [
            "Prawns 2 kg",
            "6",
            "S$ 32.00",
            "S$ 192.00"
          ],
          [
            "Salmon fillet",
            "4",
            "S$ 28.50",
            "S$ 114.00"
          ]
        ],
        "total": "S$ 333.54",
        "chatter": "Odoo AI filled 4 fields from the PDF and matched P00088. Waiting for your approval."
      },
      "support": [
        {
          "type": "receipt",
          "vendor": "Sample Seafood Pte Ltd",
          "doc": "TAX INVOICE",
          "lines": [
            [
              "Prawns 2 kg ×6",
              "192.00"
            ],
            [
              "Salmon fillet ×4",
              "114.00"
            ],
            [
              "GST 9%",
              "27.54"
            ]
          ],
          "total": "S$ 333.54",
          "stamp": "SCANNED"
        }
      ],
      "links": [
        {
          "from": "s0",
          "to": "hero",
          "label": "AI reads the PDF"
        }
      ],
      "accents": [
        {
          "type": "nexi",
          "pose": "point"
        }
      ],
      "look": {
        "layout": "top",
        "camera": "iso-l",
        "bg": "rays",
        "palette": "sky",
        "logo": "bl"
      }
    },
    "order": 2,
    "createdAt": "2026-09-28T12:00:02Z"
  }
];
