/* TechNext Drip Studio — the drip library.
   Edit a drip in the studio, then "Save library" downloads a new drips.js to replace this file.
   Or edit by hand: copy a drip object, give it a new id, change the copy and layers.

   Headline markup:  *blue words*   ~yellow brush underline~   ==yellow marker==   [[white on blue]]
                     {odoo}Odoo purple{/odoo}   |  = line break
   Layer fields (all in canvas px, the canvas is 1080 wide): x, y (or b = distance from the bottom), w, rot, z, op, flip, hide
   Layer types: nexi · person · shot · img · phone · record · flow · apps · pill · chip · note · bubble · text · icon · odoo
                burst · glow · sphere · halftone · scan · sparkles · storm · speed · confetti · arrow · nosignal
   Content rules (from technext.asia): say "Odoo Partner", never "Certified"; only the approved figures
   (10+ countries, 11+ enterprise clients, 4 AI disciplines); Marketing is its own service, never tied to Odoo. */

window.CATEGORIES = [
  { id: 'odoo20', group: 'Odoo', name: 'Meet Odoo 20' },
  { id: 'apps', group: 'Odoo', name: 'Odoo apps' },
  { id: 'ai', group: 'AI & Nexi', name: 'AI in Odoo' },
  { id: 'fnb', group: 'Industries', name: 'F&B', industry: 'fnb' },
  { id: 'retail', group: 'Industries', name: 'Retail', industry: 'retail' },
  { id: 'ecommerce', group: 'Industries', name: 'Ecommerce', industry: 'ecommerce' },
  { id: 'manufacturing', group: 'Industries', name: 'Manufacturing', industry: 'manufacturing' },
  { id: 'construction', group: 'Industries', name: 'Construction', industry: 'construction' },
  { id: 'medical', group: 'Industries', name: 'Medical', industry: 'medical' },
  { id: 'travel', group: 'Industries', name: 'Travel', industry: 'travel' },
  { id: 'health-wellness', group: 'Industries', name: 'Health & Wellness', industry: 'health-wellness' },
  { id: 'field-service', group: 'Industries', name: 'Field Service' },
  { id: 'services', group: 'TechNext', name: 'Websites & marketing' }
];

window.DRIPS = [
  {
    id: 'o20-offline-mode',
    cat: 'odoo20',
    name: 'Odoo 20 · Offline mode',
    source: 'technext.asia/blog/odoo-20-whats-new — "Offline mode and a better phone experience"',
    badge: 'o20',
    ground: 'blobs',
    copy: {
      head: 'No signal? *Keep working.*',
      size: 'l',
      sub: 'Odoo 20 lets on-site teams create and edit records offline. Everything syncs when you are back online.'
    },
    layers: [
      { type: 'glow', x: 250, y: 470, w: 600, z: 2 },
      { type: 'phone', x: 382, y: 452, w: 336, rot: -5, z: 12, screen: 'offline-receipt' },
      { type: 'storm', x: 706, y: 438, w: 290, rot: 6, z: 14 },
      { type: 'nosignal', x: 676, y: 628, w: 120, rot: 8, z: 16 },
      { type: 'pill', x: 62, y: 548, rot: -5, z: 18, text: 'Warehouse floor' },
      { type: 'pill', x: 44, y: 706, rot: 3, z: 18, text: 'Construction site' },
      { type: 'pill', x: 104, y: 862, rot: -3, z: 18, text: 'Field visit' },
      { type: 'chip', x: 700, y: 820, rot: 3, z: 18, icon: 'cloudOk', tone: 'ok', text: 'Back online', small: '3 changes synced' },
      { type: 'sparkles', x: 930, y: 760, w: 110, z: 19 },
      { type: 'arrow', x: 790, y: 712, w: 120, rot: 62, z: 17, kind: 'down' },
      { type: 'sphere', x: 968, y: 626, w: 58, z: 6 }
    ]
  },
  {
    id: 'fnb-supplier-to-books',
    cat: 'fnb',
    name: 'F&B · Supplier to the books',
    source: 'technext.asia/industries/fnb — the six-step flow and the before/after table',
    badge: 'ready',
    ground: 'blobs-low',
    copy: {
      head: 'From supplier to table|to the books, *in one Odoo.*',
      size: 'm',
      sub: 'Six steps every restaurant runs, and the Odoo app behind each one.'
    },
    layers: [
      { type: 'flow', x: 70, y: 410, z: 12, from: 'industry:fnb', cols: 3, nodeW: 270, nodeH: 200, gapX: 65, gapY: 50, layout: 'snake', hot: 4 },
      { type: 'note', x: 262, y: 906, rot: -4, z: 20, text: 'paper tickets', variant: 'red strike', size: 48 },
      { type: 'arrow', x: 500, y: 890, w: 110, rot: 8, z: 20, kind: 'right' },
      { type: 'note', x: 626, y: 900, rot: -3, z: 20, text: 'kitchen display', size: 48 },
      { type: 'sparkles', x: 906, y: 330, w: 120, z: 20 },
      { type: 'sphere', x: 44, y: 330, w: 46, z: 6 }
    ]
  },
  {
    id: 'ai-bill-you-approve',
    cat: 'ai',
    name: 'AI in Odoo · Vendor bills, with Nexi',
    source: 'technext.asia/odoo/ai-integration — the vendor bill record and its three steps',
    badge: 'ready',
    ground: 'blobs',
    copy: {
      head: 'AI prepares the bill.|*You approve it.*',
      sub: 'TechNext builds AI inside your Odoo. It reads the vendor bill, matches the purchase order and waits for your OK.'
    },
    layers: [
      { type: 'burst', x: -60, y: 470, w: 620, z: 2 },
      { type: 'nexi', x: 34, y: 520, w: 440, z: 16, pose: 'point' },
      { type: 'record', x: 486, y: 444, w: 540, rot: 2.5, z: 12, app: 'accountant', title: 'Vendor bill', crumb: 'Accounting · Draft', status: 'Draft',
        rows: [['Vendor', 'Harbourline Supplies', 'ai'], ['Bill date', '12 Sep 2026', 'ai'], ['Total', 'S$ 1,284.00', 'ai'], ['PO match', 'PO00123', 'ok']],
        ai: 'Prepared by AI · a person approves', btn: 'Approve' },
      { type: 'chip', x: 548, y: 842, z: 18, rot: -1.5, icon: 'spark', text: 'AI read the bill' },
      { type: 'chip', x: 606, y: 916, z: 18, rot: 1.5, icon: 'search', text: 'Matched to PO00123' },
      { type: 'chip', x: 560, y: 990, z: 18, rot: -1, icon: 'check', tone: 'ok', text: 'Approved by Finance' },
      { type: 'sphere', x: 986, y: 760, w: 54, z: 6 },
      { type: 'sparkles', x: 400, y: 470, w: 110, z: 20 },
      { type: 'bubble', x: 60, y: 440, z: 20, rot: -3, text: 'PO matched!' }
    ]
  }
];
