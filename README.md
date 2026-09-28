# TechNext Drip Studio

Design TechNext marketing drip images (Odoo apps, Odoo 20, AI, industries, websites) in the
technext.asia brand. Claude designs whole sets of posts from the website's own content; each post
shows Odoo from the inside (forms, lists, kanban, dashboards, POS, planning, phones) with the
workflow between screens, on a clean hero-style background with its own camera angle.

## Where it runs

| Copy | Link | Saving | Claude |
|---|---|---|---|
| **The hub** (use this) | https://claude.ai/artifact/F2LKF69gAzjvQx6nkWFeKM | Automatic, shared with everyone the hub is shared with (the Artifact's database). Photos go to its file store. | Yes, on the viewer's own Claude plan |
| GitHub mirror | https://technextmarketing.github.io/technext-drip-studio/ | Automatic, in this browser only | No |
| This folder | `Open Drip Studio.bat` → http://localhost:8807 | Automatic, in this browser; "Write drips.js" saves to the file | No |

The hub is private until you share it from its Share menu. People need Contributor access or above to edit.

## Generate with Claude

Pick a category (and an industry), 3, 6 or 9 posts, the angles, and an optional brief. Claude gets the
technext.asia content for that category (workflow, before/after table, Odoo 20 changes, rollout phases,
dashboard, app record flows, service pages, portfolio sites) and designs every post as a **scene**:

- the headline, subline, caption and hashtags;
- the **hero**: the exact Odoo screen where the headline happens, with sample data that shows it
  (the glowing AI-filled field, the stage the record reached, the bar that matters);
- 0-3 **supporting cards** (the step before or after, a notification, a chart, a chat, a receipt, a route);
- **workflow links** naming what one app hands to the next;
- callouts (Nexi, handwritten pills, chips, notes) and the **look**: headline placement, camera angle,
  background style and palette, logo corner.

The rules force every post in a set to differ (hero screen, supports, layout + camera, background + palette,
angle, first word). `compose.js` then lays each scene out, measuring every element so nothing covers the
headline or runs off the canvas. Posts arrive as **drafts**: Keep, Edit or Discard. Drafts are saved too.

**Token use per generation** (estimates: the page cannot read exact counts; about 4 characters per token):

| Category | 3 posts | 6 posts | 9 posts |
|---|---|---|---|
| Industry (F&B, Retail, Manufacturing…) | ~6,100 | ~7,650 | ~9,200 |
| Meet Odoo 20 | ~6,100 | ~7,700 | ~9,250 |
| Meet Odoo 20 + an industry focus | ~7,050 | ~8,600 | ~10,200 |
| Odoo apps | ~6,900 | ~8,450 | ~10,000 |
| AI in Odoo | ~6,650 | ~8,200 | ~9,750 |
| Websites & marketing | ~4,050 | ~5,600 | ~7,150 |

The prompt (input) is about 2,500-5,500 tokens; each post adds about 520 output tokens (a full scene with its
screen data). The Balanced and Best models also think before answering, which is billed on the plan but not
reported; Fast does not. It runs on the viewer's own Claude plan, not an API bill. **Claude usage** logs every run.

## Editing (like a slide or website builder)

- **Select:** click; **Shift-click** or **drag a box** on empty canvas to select several; Ctrl+A selects all.
- **Move:** drag. Smart guides snap to the canvas centre, the margins and other elements' edges and centres (Alt = free).
- **Resize:** corner handle. **Rotate:** top dot (Shift = 15° steps).
- **Text:** double-click text on the canvas to type in place (Enter saves, Esc cancels). Double-click a screen,
  chart or list to edit its data in a small panel. The headline is a free text box: drag it, widen it with its
  handle, and use its toolbar for size (A− A+), colour and alignment.
- **Toolbar over the selection:** Edit, Replace image / Swap Nexi for a photo, Nexi pose, Odoo view, Lock,
  Forward, Backward, Duplicate, Delete. With several selected: align left / centre / right / top / middle / bottom,
  distribute across / down.
- **Right-click** for Copy, Paste, Bring to front, Send to back, Lock, Follow the camera, Delete.
- **Keyboard:** arrows nudge (Shift = 10 px), Delete, Ctrl+D duplicate, Ctrl+C / Ctrl+V (also between drips),
  `]` / `[` forward / backward, Ctrl+Z / Ctrl+Shift+Z undo / redo, Esc deselects. Zoom with − Fit + in the bar.
- **Design panel:** background style (aurora, grid, floor, rays, dots, mesh, rings, navy) and palette, "New shapes",
  camera angle (front, tilt-l, tilt-r, iso-l, iso-r, top, low, dutch), headline placement (re-lays out the post),
  logo corner and glass chip, partner badge, and **Shuffle look**.
- **Drop an image** on the canvas to add a person or product cut-out; a selected photo or Nexi gets replaced.
- Every drip has a **Post caption** and hashtags, with a Copy button. **4:5** portrait is in the bar.

## Elements

| Group | Elements |
|---|---|
| Odoo screens | form (quotation, bill…), list, kanban pipeline, dashboard, planning board, point of sale, kitchen display, app home screen, Discuss / Odoo AI, phone screen (any view) |
| Charts & numbers | bar, line, donut, funnel, progress bars, KPI tiles, big number (all marked "Demo data") |
| Workflow | steps across apps, timeline, arrow with label, how a record moves (50 apps), industry workflow / before-after / rollout phases / dashboard from the website |
| Cards | record card, checklist, notification, chat (WhatsApp, web, Odoo), paper invoice, delivery route, app orbit, app cloud |
| Website design | laptop + phone with TechNext-built sites, website mockup, code window, colour palette, wireframe, Google result, score gauge, cursor |
| Nexi | wave, point, present, celebrate, cheer, surprise, love, think, clap |
| Photos, callouts, effects | person, screenshot, image; pill, chip, note, bubble, text, arrow, icons; glow, sparkles, sphere, burst, confetti, halftone, scan, storm, speed lines, no-signal |

## Files

| Path | Role |
|---|---|
| `drips.js` | Starter library (seeds new hubs and the mirror; the hub's database is the live copy) |
| `content.js` | technext.asia content. Refresh: `python tools/export_content.py` |
| `drip.css`, `drip-render.js` | The drip design system, backgrounds, camera, logo and renderer |
| `odoo-ui.js` | Inside-Odoo screens, charts and workflow cards |
| `compose.js` | The layout engine: scene → drip, and the rule that every post in a set looks different |
| `starters.js` | Starter scenes for "New drip" (built from the website content) |
| `ai.js` | The scene prompt, the Claude call and token estimates |
| `store.js` | Saving: hub database / asset store / downloads, or this browser |
| `index.html`, `studio.css`, `studio.js` | The studio |
| `hub.html` | The Artifact page, built by `python tools/build_hub.py` |
| `render.html`, `tools/render.py`, `tools/serve.py` | Full-size render, batch PNG export, local server |
| `exports/samples/` | Eight sample designs of the kind Claude produces |

**Publishing changes:** GitHub: commit and push (Pages rebuilds in a minute). Hub: run `python tools/build_hub.py`,
then republish `hub.html` with the files in `hub-files.json` to the same Artifact URL.

## Content rules (from technext.asia)

- Say "Odoo Partner"; never "Certified". Only the approved figures: 10+ countries, 11+ enterprise clients, 4 AI disciplines.
- Marketing (websites, social) is its own TechNext service; never tie it to Odoo (those posts carry no Odoo badge).
- Odoo 20 claims come from the site's Odoo 20 article; AI features in Odoo 20 use paid credits.
- Screens use sample data ("Sample Trading Pte Ltd", first names), never a real client's; charts say "Demo data".
