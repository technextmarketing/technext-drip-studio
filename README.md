# TechNext Drip Studio

Design TechNext marketing drip images (Odoo apps, Odoo 20, AI, industries, websites) in the
technext.asia brand, in the style of the first drips: the standard frame and one clean visual.

**The frame never moves.** The TechNext logo sits top left and the Odoo Ready Partner (or Meet Odoo 20)
badge top right. The headline and subline are centred on top at the standard size. Website posts carry
no Odoo badge.

**Under the subline sits one visual** that shows the headline: flat white cards, a phone, Nexi (the
TechNext robot), handwritten blue pills, step chips and sparkles. The background is clean: plain, or with
a soft blue floor like the original Drive drips. There are no background shapes or camera angles.

## Where it runs

| Copy | Link | Saving | Claude |
|---|---|---|---|
| **The hub** (use this) | https://claude.ai/artifact/F2LKF69gAzjvQx6nkWFeKM | Automatic, shared with everyone the hub is shared with (the Artifact's database). Photos go to its file store. | Yes, on the viewer's own Claude plan |
| GitHub mirror | https://technextmarketing.github.io/technext-drip-studio/ | Automatic, in this browser only | No |
| This folder | `Open Drip Studio.bat` → http://localhost:8807 | Automatic, in this browser; "Write drips.js" saves to the file | No |

The hub is private until you share it from its Share menu. People need Contributor access or above to edit.

## The visuals

Claude, or a starter, picks the one that shows the headline best. Every word inside it is written for
that post.

| Visual | What it shows | Good for |
|---|---|---|
| Phone screen | An Odoo screen on a phone, 2-3 handwritten callouts, a result chip; optionally a storm and no-signal badge, a QR card or a notification | On site, offline, scanning, ordering at the table |
| Record + Nexi | Nexi pointing at one Odoo record (fields AI filled, checks), three step chips | AI fills or checks a record, approvals |
| Paper to Odoo | A paper or PDF document, an arrow, the Odoo record it became | Bills, delivery orders, receipts |
| Checklist + Nexi | A card of 3-4 points, Nexi presenting | What is new, what you get |
| Old way vs Odoo | The old way (red crosses) next to the same job in Odoo (green ticks); two arrangements | Pain points |
| Workflow steps | 3-6 steps across Odoo apps, with "old habit → new way" in handwriting | Flows across apps |
| Chart + numbers | A chart card (bar, line, donut, funnel, progress), one big number, the insight | Costs, sales, stock |
| Odoo board | One Odoo view as a clean card: pipeline, list, planning board, kitchen tickets, till or dashboard | Pipelines, rosters, orders |
| Chat to Odoo | A WhatsApp or website chat and the record it created, or Nexi answering | WhatsApp orders, chatbots |
| Nexi + alerts | Nexi with 2-3 Odoo notifications | Odoo warns you in time |
| Timeline | One record or one day with times | Quote to cash, a day on site |
| Nexi reaction | A big Nexi reaction and three callouts | Question hooks |
| App orbit, record flow, rollout phases | From the website | One database, record states, how TechNext rolls out |
| Website, web design, Google result, TechNext in numbers | Websites & marketing posts | Services |

Posts in a set alternate sides, so two posts with the same visual still look different. Everything is
measured, so nothing covers the headline or runs off the canvas.

## Generate with Claude

Pick a category (and an industry), 3, 6 or 9 posts, the angles, and an optional brief. Claude gets the
technext.asia content for that category (workflow, before/after table, Odoo 20 changes, rollout phases,
dashboard, app record flows, service pages, portfolio sites). For every post it writes:

- the headline, subline, caption and hashtags;
- which visual to use (a different one for every post);
- every word inside the visual, tied to the headline: the screen, the fields, the list lines, the chart
  bars, the pills and the chips. It uses sample data only.

`simple.js` lays each post out. Posts arrive as **drafts**: Keep, Edit or Discard. Drafts are saved too.

**Token use per generation** (estimates: the page cannot read exact counts; about 4 characters per token):

| Category | 3 posts | 6 posts | 9 posts |
|---|---|---|---|
| Industry (F&B, Retail, Manufacturing…) | ~6,000 | ~7,200 | ~8,400 |
| Meet Odoo 20 | ~5,900 | ~7,100 | ~8,300 |
| Meet Odoo 20 + an industry focus | ~6,900 | ~8,100 | ~9,300 |
| Odoo apps | ~6,800 | ~8,000 | ~9,200 |
| AI in Odoo | ~6,300 | ~7,500 | ~8,700 |
| Websites & marketing | ~3,300 | ~4,500 | ~5,700 |

The prompt (input) is about 2,000-5,700 tokens. Each post adds about 400 output tokens (the post and its
visual's data). The Balanced and Best models also think before answering; that is billed on the plan but
not reported. Fast does not think first. Everything runs on the viewer's own Claude plan, not an API bill.
**Claude usage** logs every run.

## Editing (like a slide or website builder)

- **Select:** click; **Shift-click** or **drag a box** on empty canvas to select several; Ctrl+A selects all.
- **Move:** drag. Smart guides snap to the canvas centre, the margins and other elements' edges and centres (Alt = free).
- **Resize:** corner handle. **Rotate:** top dot (Shift = 15° steps).
- **Text:** double-click text on the canvas to type in place (Enter saves, Esc cancels). Double-click a
  screen, chart or list to edit its data in a small panel. The headline toolbar changes its size (A− A+)
  and colour. The headline stays in the standard position; if you drag it, "Reset position" puts it back.
- **Toolbar over the selection:** Edit, Replace image or Swap Nexi for a photo, Nexi pose, Odoo view,
  Lock, Forward, Backward, Duplicate, Delete. With several selected: align left, centre or right, top,
  middle or bottom, and distribute across or down.
- **Right-click** for Copy, Paste, Bring to front, Send to back, Lock, Delete.
- **Keyboard:** arrows nudge (Shift = 10 px), Delete, Ctrl+D duplicate, Ctrl+C / Ctrl+V (also between drips),
  `]` / `[` forward / backward, Ctrl+Z / Ctrl+Shift+Z undo / redo, Esc deselects. Zoom with − Fit + in the bar.
- **Design panel:**
  - Background: Clean, Soft blue floor, or Blue shapes (the old blobs).
  - Layout: **Mirror**, **Other arrangement** (old way vs Odoo), and **Reset layout**, which rebuilds the
    visual from its content and keeps the headline you edited.
  - The Odoo badge.
  - Drips made in the older v3 look (background styles, camera angles) get a **Switch to the clean style** button.
- **Drop an image** on the canvas to add a person or product cut-out; a selected photo or Nexi gets replaced.
- Every drip has a **Post caption** and hashtags, with a Copy button. **4:5** portrait is in the bar.

## Elements

| Group | Elements |
|---|---|
| Odoo cards | board (pipeline), list, planning board, kitchen tickets, phone screen |
| Odoo windows | form (quotation, bill…), list, kanban, dashboard, planning, point of sale, kitchen display, app home screen, Discuss / Odoo AI |
| Charts & numbers | bar, line, donut, funnel, progress bars, KPI tiles, big number (all marked "Demo data") |
| Workflow | steps across apps, timeline, arrow with label, how a record moves (50 apps), industry workflow / before-after / rollout phases / dashboard from the website |
| Cards | record card, checklist (also "old way"), notification, chat (WhatsApp, web, Odoo), paper invoice, QR code card, delivery route, app orbit, app cloud |
| Website design | laptop + phone with TechNext-built sites, website mockup, code window, colour palette, wireframe, Google result, score gauge, cursor |
| Nexi | wave, point, present, celebrate, cheer, surprise, love, think, clap |
| Photos, callouts, effects | person, screenshot, image; pill, chip, note, bubble, text, arrow, icons; glow, sparkles, sphere, burst, confetti, halftone, scan, storm, speed lines, no-signal |

## Files

| Path | Role |
|---|---|
| `drips.js` | Starter library (seeds new hubs and the mirror; the hub's database is the live copy). Each drip keeps the post it was built from, so Mirror and Reset layout work. |
| `content.js` | technext.asia content. Refresh: `python tools/export_content.py` |
| `drip.css`, `drip-render.js` | The drip design system, logo, badge and renderer |
| `odoo-ui.js` | Inside-Odoo screens, Odoo cards, charts and workflow cards |
| `simple.js` | The layout engine: one post → a drip in the clean style, and the side alternation in a set |
| `starters.js` | The 18 starters for "New drip" (built from the website content) |
| `ai.js` | The prompt (the visuals and their fields), the Claude call and token estimates |
| `store.js` | Saving: hub database / asset store / downloads, or this browser |
| `index.html`, `studio.css`, `studio.js` | The studio |
| `hub.html` | The Artifact page, built by `python tools/build_hub.py` |
| `render.html`, `tools/render.py`, `tools/serve.py` | Full-size render, batch PNG export (`python tools/render.py`), local server |
| `exports/samples/` | The seven starter drips as PNGs |

**Publishing changes:** GitHub: commit and push (Pages rebuilds in a minute). Hub: run `python tools/build_hub.py`,
then republish `hub.html` with the files in `hub-files.json` to the same Artifact URL.

## Content rules (from technext.asia)

- Say "Odoo Partner"; never "Certified". Only the approved figures: 10+ countries, 11+ enterprise clients, 4 AI disciplines.
- Marketing (websites, social) is its own TechNext service; never tie it to Odoo (those posts carry no Odoo badge).
- Odoo 20 claims come from the site's Odoo 20 article; AI features in Odoo 20 use paid credits.
- Screens use sample data ("Sample Trading Pte Ltd", first names), never a real client's; charts say "Demo data".
