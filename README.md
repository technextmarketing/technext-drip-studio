# TechNext Drip Studio

Design TechNext marketing drip images (Odoo apps, Odoo 20, AI, industries, websites) in the
technext.asia brand, in the style of the first drips: the standard frame and one clean visual.

**The frame never moves.** The TechNext logo sits top left and the Odoo Ready Partner (or Meet Odoo 20)
badge top right. The headline and subline are centred on top at the standard size. Website posts carry
no Odoo badge. A short blue bar above the headline (the "kicker", such as "Reasons your customer") is
optional.

**Under the subline sits one visual** that shows the headline, in flat white cards:

- the visuals: Odoo documents and screens, a phone, Nexi (the TechNext robot), handwritten blue pills,
  step chips and sparkles;
- depth effects: stacked paper sheets, tilts and pop-outs;
- stamps, stickers and industry props (a chef hat, an oven, a hard hat, a server…);
- a light background: plain, a soft blue floor, or one of ten patterns (dots, grid lines, fine grid,
  diagonal, rings, plus, hexagons, waves, light spots, floor grid). The patterns fade out behind the
  headline.

## Where it runs

| Copy | Link | Saving | Claude |
|---|---|---|---|
| **The hub** (use this) | https://claude.ai/artifact/F2LKF69gAzjvQx6nkWFeKM | Automatic, shared with everyone the hub is shared with (the Artifact's database). Photos go to its file store. | Yes, on the viewer's own Claude plan |
| GitHub mirror | https://technextmarketing.github.io/technext-drip-studio/ | Automatic, in this browser only | No |
| This folder | `Open Drip Studio.bat` → http://localhost:8807 | Automatic, in this browser; "Write drips.js" saves to the file | No |

The hub is private until you share it from its Share menu. People need Contributor access or above to edit.

## The visuals

Claude, or a starter, picks the one that shows the headline best. Every word inside it is written for
that post. Visuals marked **b** have a second arrangement.

| Visual | What it shows |
|---|---|
| Phone screen | An Odoo screen on a phone with handwritten callouts and a result chip; optionally a storm and no-signal badge, a QR card or a notification |
| Record + Nexi **b** | Nexi pointing at one Odoo record (fields AI filled, checks) and three step chips |
| Odoo document **b** | A quotation, sales order, invoice, vendor bill, purchase order, delivery or receipt with its status bar, lines, total and ribbon |
| Three documents | Quote → order → invoice (or any three) fanned out: one record handed on |
| Paper to Odoo | A paper or PDF document, an arrow, the record it became |
| Checklist **b** | A card of 3-4 points with Nexi, or with a big industry prop |
| Old way vs Odoo **b** | The old way (red crosses) next to the same job in Odoo (green ticks) |
| Workflow steps | 3-6 steps across Odoo apps, with "old habit → new way" in handwriting |
| Chart + numbers **b**, Big number | A chart card with one big number and the insight (demo data) |
| Spreadsheet | An Odoo spreadsheet with live numbers and a small chart |
| Odoo board **b** | Pipeline, list, planning board, kitchen tickets, till or dashboard as a clean card; b tilts it and pops the highlighted card out |
| Product **b**, Scan it | A product with stock and price, a barcode or a handheld scanner, the reorder |
| Online store page | A product page in the Odoo shop and the order it brings |
| Work order | A manufacturing work order with its steps, timer and progress ring |
| Helpdesk ticket | A ticket with its SLA, the customer's WhatsApp message and the rating |
| Calendar **b** | A week of bookings, appointments or visits, with the confirmation or Nexi |
| Employee | An employee record with leave, payslips, the team and a toggle |
| Email campaign | An Odoo Email Marketing campaign with opens, clicks and orders |
| Bank reconciliation, Approval, Documents | A bank line matched to its invoice; a request with its approvers; files sorted in Odoo Documents |
| Chat to Odoo, Nexi + alerts, Timeline | A WhatsApp chat and what it created; Odoo notifications; one record's day |
| Spotlight | One big industry prop with three callouts, like a poster |
| Growth pyramid, One operating system | Stages from the foundation up; groups of Odoo apps on one database (from the Kitchen drips) |
| Nexi reaction, App orbit, Record flow, Rollout phases | Question hooks; one database; record states; how TechNext rolls out |
| Website, Web design, Google result, TechNext in numbers | Websites & marketing posts |

Everything is measured, so nothing covers the headline or runs off the canvas. Posts in a set alternate
sides and arrangements, and each one gets a different background pattern (in a new order every run).

### Industries and their props

Every industry has its own props, placed in free space around the visual. When a post is for an
industry and has none, one is added.

| Industry | Props |
|---|---|
| Kitchen (commercial kitchens) | chef hat, combi oven, stock pot, extractor hood, reach-in fridge, knife and board |
| F&B | plate, noodle bowl, coffee, service bell, menu, receipt |
| Retail / Ecommerce | shopping bag, price tag, shirt, storefront, parcel, delivery truck, cart |
| Manufacturing / Construction | gears, factory, pallet, robot arm; hard hat, crane, bricks, blueprint, cone |
| Medical / Health & wellness | stethoscope, clipboard, pills, heartbeat, tooth; lotus, leaf, dumbbell, stones, bottle |
| Travel | plane, suitcase, passport, globe, boarding pass |
| Field service / IT & tech | van, toolbox, aircon; server, laptop, cloud, shield, CCTV camera, router |
| Any post | rocket, bulb, coins, growth chart, megaphone, trophy, target, clock, calendar, magnifier, invoice, bolt, thumbs up, handshake, puzzle |

**Kitchen, IT & Tech and Field Service** have industry profiles written for the studio in
`industries-extra.js`: a six-step workflow, a before/after table, a dashboard, Odoo 20 notes and rollout
phases. technext.asia has no page for them yet. They describe only what Odoo's apps do, with no client
names, results or prices. Categories for Kitchen and IT & Tech are added to the library automatically.

## Generate with Claude

Pick a category (and an industry), 3, 6 or 9 posts, the angles, and an optional brief. If you leave the
industry empty, an industry named in the brief ("commercial kitchen", "clinic", "CCTV"…) is used. Claude
gets the technext.asia content for that category (workflow, before/after table, Odoo 20 changes, rollout
phases, dashboard, app record flows, service pages, portfolio sites). For every post it writes:

- the headline, subline, caption and hashtags;
- which visual to use (a different one for every post);
- every word inside the visual, tied to the headline, using sample data only;
- the **design knobs**, so each post looks like its own poster:
  - arrangement (a or b), background pattern, tint and a kicker bar;
  - 1-2 industry props;
  - up to two accents: sticker, stamp, sticky note, avatars, toggle, timer, progress ring, search bar,
    map pin, barcode, button or scribble.

`simple.js` lays each post out. Posts arrive as **drafts**: Keep, Edit or Discard. Drafts are saved too.

**Token use per generation** (estimates: the page cannot read exact counts; about 4 characters per token):

| Category | 3 posts | 6 posts | 9 posts |
|---|---|---|---|
| Industry (F&B, Kitchen, Retail…) | ~7,200 | ~8,600 | ~9,900 |
| Meet Odoo 20 | ~7,200 | ~8,500 | ~9,800 |
| Meet Odoo 20 + an industry focus | ~8,400 | ~9,700 | ~11,000 |
| Odoo apps | ~8,600 | ~9,900 | ~11,200 |
| AI in Odoo | ~7,300 | ~8,700 | ~10,000 |
| Websites & marketing | ~4,100 | ~5,400 | ~6,700 |

The prompt (input) is about 2,700-7,300 tokens. Each post adds about 440 output tokens (the post, its
visual's data and its design knobs). The Balanced and Best models also think before answering; that is
billed on the plan but not reported. Fast does not think first. Everything runs on the viewer's own
Claude plan, not an API bill. **Claude usage** logs every run.

## Editing (like a slide or website builder)

- **Select:** click; **Shift-click** or **drag a box** on empty canvas to select several; Ctrl+A selects all.
- **Move:** drag. Smart guides snap to the canvas centre, the margins and other elements' edges and centres (Alt = free).
- **Resize:** corner handle. **Rotate:** top dot (Shift = 15° steps).
- **Text:** double-click text on the canvas to type in place (Enter saves, Esc cancels). Double-click a
  card, chart or list to edit its data in a small panel. The headline toolbar changes its size (A− A+)
  and colour. The headline stays in the standard position; if you drag it, "Reset position" puts it back.
- **Toolbar over the selection:** Edit, Replace image or Swap Nexi for a photo, Nexi pose, Odoo view,
  Lock, Forward, Backward, Duplicate, Delete. With several selected: align and distribute.
- **Right-click** for Copy, Paste, Bring to front, Send to back, Lock, Delete.
- **Keyboard:** arrows nudge (Shift = 10 px), Delete, Ctrl+D duplicate, Ctrl+C / Ctrl+V (also between drips),
  `]` / `[` forward / backward, Ctrl+Z / Ctrl+Shift+Z undo / redo, Esc deselects. Zoom with − Fit + in the bar.
- **Design panel:**
  - Background: Clean, Soft blue floor, or Blue shapes (the old blobs).
  - Pattern: the ten patterns, or none.
  - Tint: white, sky, mint, lilac or sand.
  - Layout: **Mirror**, **Other arrangement** and **Reset layout**, which rebuilds the visual from its
    content and keeps the headline you edited.
  - The Odoo badge.
  - Drips made in the older v3 look get a **Switch to the clean style** button.
- **Cards** can carry one or two paper sheets behind them ("Paper sheets behind" in the panel).
- **Drop an image** on the canvas to add a person or product cut-out; a selected photo or Nexi gets replaced.
- Every drip has a **Post caption** and hashtags, with a Copy button. **4:5** portrait is in the bar.

## Elements

| Group | Elements |
|---|---|
| Odoo documents | quotation, sales order, invoice (paid), vendor bill, purchase order, delivery, small document |
| Odoo cards | board (pipeline), list, planning board, kitchen tickets, phone screen, product, work order, helpdesk ticket, calendar week, employee, email campaign, online shop page, bank reconciliation, approval, spreadsheet, Documents, rating, lead card |
| Odoo windows | form, list, kanban, dashboard, planning, point of sale, kitchen display, app home screen, Discuss / Odoo AI |
| Poster elements | stamp, round sticker, progress ring, team avatars, sticky note, toggle, big button, search bar, barcode, map pin, timer, barcode scanner, growth pyramid, one-system map, scribbles (circle, underline, arrow, tick) |
| Industry props | 65 illustrations, grouped by industry (thumbnails in the rail) |
| Charts & numbers | bar, line, donut, funnel, progress bars, KPI tiles, big number (all marked "Demo data") |
| Workflow | steps across apps, timeline, arrow with label, how a record moves (50 apps), industry workflow / before-after / rollout phases / dashboard from the website |
| Cards | record card, checklist (also "old way"), notification, chat (WhatsApp, web, Odoo), paper invoice, QR code card, delivery route, app orbit, app cloud |
| Website design | laptop + phone with TechNext-built sites, website mockup, code window, colour palette, wireframe, Google result, score gauge, cursor |
| Nexi | wave, point, present, celebrate, cheer, surprise, love, think, clap |
| Photos, callouts, effects | person, screenshot, image; pill, chip, note, bubble, text, arrow, icons; glow, sparkles, sphere, burst, confetti, halftone, scan, storm, speed lines, no-signal |

## Files

| Path | Role |
|---|---|
| `drips.js` | Categories and the starter library (13 drips; seeds new hubs and the mirror; the hub's database is the live copy). Each drip keeps the post it was built from, so Mirror and Reset layout work. |
| `content.js` | technext.asia content. Refresh: `python tools/export_content.py` |
| `industries-extra.js` | The Kitchen, IT & Tech and Field Service profiles written for the studio |
| `drip.css`, `drip-render.js` | The drip design system, patterns, tints, logo, badge and renderer |
| `odoo-ui.js`, `cards.js` | Inside-Odoo screens and cards (documents, product, work order, ticket, calendar…), charts, poster elements |
| `props.js` | The industry props |
| `simple.js` | The layout engine: one post → a drip, accents in free space, and the variety across a set |
| `starters.js` | The 30 starters for "New drip" (built from the website content; some follow the chosen industry) |
| `ai.js` | The prompt (visuals, design knobs, props), industry detection, the Claude call and token estimates |
| `store.js` | Saving: hub database / asset store / downloads, or this browser |
| `index.html`, `studio.css`, `studio.js` | The studio |
| `hub.html` | The Artifact page, built by `python tools/build_hub.py` |
| `render.html`, `tools/render.py`, `tools/serve.py` | Full-size render, batch PNG export (`python tools/render.py`), local server. Renders stay in `exports/` on this computer. |
| `exports/samples/` | The 13 starter drips as PNGs |

**Publishing changes:** GitHub: commit and push (Pages rebuilds in a minute). Hub: run `python tools/build_hub.py`,
then republish `hub.html` with the files in `hub-files.json` to the same Artifact URL.

## Content rules (from technext.asia)

- Say "Odoo Partner"; never "Certified". Only the approved figures: 10+ countries, 11+ enterprise clients, 4 AI disciplines.
- Marketing (websites, social) is its own TechNext service; never tie it to Odoo (those posts carry no Odoo badge).
- Odoo 20 claims come from the site's Odoo 20 article; AI features in Odoo 20 use paid credits.
- Screens use sample data ("Sample Trading Pte Ltd", first names), never a real client's; charts say "Demo data".
