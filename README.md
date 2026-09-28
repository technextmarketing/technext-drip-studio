# TechNext Drip Studio

Build TechNext marketing drip images (Odoo apps, Odoo 20, AI, industries, websites) in the
technext.asia brand, have Claude write whole sets of posts from the website's own content, and
export 1080 px PNGs. The style follows the drips in Drive `SALES / 01_Drips`.

## Where it runs

| Copy | Link | Saving | Claude |
|---|---|---|---|
| **The hub** (use this) | https://claude.ai/artifact/F2LKF69gAzjvQx6nkWFeKM | Automatic, shared with everyone the hub is shared with (the Artifact's database). Photos go to its file store. | Yes, on the viewer's own Claude plan |
| GitHub mirror | https://technextmarketing.github.io/technext-drip-studio/ | Automatic, in this browser only | No |
| This folder | `Open Drip Studio.bat` → http://localhost:8807 | Automatic, in this browser; "Write drips.js" saves to the file | No |

The hub is private until you share it from its Share menu. People need Contributor access or above to edit.

## Editing on the canvas

- **Click** to select, **drag** to move. Layers snap to the centre line and the 64 px margins (pink guides); hold Alt to move freely.
- **Corner handle** resizes; **top dot** rotates (Shift snaps to 15°).
- **Double-click text** (pills, chips, notes, bubbles, record fields, website mockup text) to type straight on the canvas. Enter saves, Esc cancels.
- **Double-click the headline**, or anything with lists (checklists, record rows, code), to open a small editor next to it.
- The dark **toolbar** over the selection: Edit text, Replace image / Swap Nexi for a photo, Nexi pose, Forward, Backward, Duplicate, Delete.
- **Keyboard:** arrows nudge (Shift = 10 px), Delete removes, Ctrl+D duplicates, `]` / `[` forward / backward, Ctrl+Z / Ctrl+Shift+Z undo / redo, Esc deselects.
- **Drop an image** on the canvas to add a person or product cut-out. A selected photo, screenshot or Nexi gets replaced by it.
- **Add elements** from the left panel (or the "Add" picker under Layers on small screens).
- Headline markup: `*blue*`, `~yellow brush~`, `==marker==`, `[[white on blue]]`, `{odoo}purple{/odoo}`, `|` = line break. It shrinks itself to stay within 2 lines.
- **4:5 portrait:** layers below the copy move down 150 px automatically; drag in 4:5 to set a portrait-only position.
- Every drip has a **Post caption** and hashtags, with a Copy button.

## Generate with Claude

"Generate" asks Claude for 3, 6 or 9 posts for one category. Claude only gets technext.asia content
for that category (industry workflow, before/after table, Odoo 20 changes, rollout phases, dashboard,
service pages, app catalogue, portfolio sites) plus the brand rules, picks a different angle for each post,
and writes the headline, subline, caption, hashtags and the facts each layout shows. The studio then
draws each post with one of 13 fixed layouts, so the design never drifts. Posts arrive as **drafts**:
Keep, Edit or Discard them. Nothing is lost if you close the page; drafts are saved too.

**Token use per generation** (estimates: the page cannot read exact counts; about 4 characters per token):

| Category | 3 posts | 6 posts | 9 posts |
|---|---|---|---|
| Industry (F&B, Retail, Manufacturing…) | ~3,400 | ~4,350 | ~5,350 |
| Meet Odoo 20 | ~4,350 | ~5,350 | ~6,300 |
| Odoo apps | ~3,900 | ~4,900 | ~5,900 |
| AI in Odoo | ~2,900 | ~3,900 | ~4,900 |
| Websites & marketing | ~2,450 | ~3,450 | ~4,400 |

The prompt (input) is about 1,450–3,350 tokens depending on the category; each post adds about 330 output tokens.
The Balanced and Best models also think before answering, which is billed on the plan but not reported; Fast does not.
It runs on the viewer's own Claude plan (claude.ai usage limits), not on an API bill. Every run is logged under **Claude usage**.

## Layouts (recipes)

Industry workflow · Before / after · Odoo record + Nexi · Phone screen · Industry dashboard · Checklist ·
Rollout phases · How a record moves · App orbit · Nexi reaction · Website we built · Web design craft · Found on Google.
"New drip" builds any of them without Claude, filled from the website content.

## Elements

| Group | Elements |
|---|---|
| Nexi | wave, point, present, celebrate, cheer, surprise, love, think, clap |
| Photos | person cut-out, screenshot (bare, browser, laptop, tablet), image |
| Odoo | record card, phone screen, app icon, app cloud, app orbit, how a record moves (50 apps), checklist |
| From technext.asia | industry workflow, before / after, rollout phases, industry dashboard (all 8 industries) |
| Website design | laptop + phone with real TechNext-built sites (technext.asia, Move with Ease, TRE Singapore, Immaculate Connections), website mockup, code window, colour palette, wireframe, Google result, score gauge, cursor |
| Callouts | handwritten pill, step chip, handwritten note (red strike for the old way), speech bubble, free text, hand-drawn arrow, TechNext icon |
| Effects | burst, glow, sparkles, sphere, confetti, storm cloud, speed lines, halftone, AI scan beam, no-signal badge |

## Files

| Path | Role |
|---|---|
| `drips.js` | Starter library (the hub was seeded from it; the hub's database is the live copy) |
| `content.js` | technext.asia content. Refresh: `python tools/export_content.py` |
| `drip.css`, `drip-render.js` | The drip design system and renderer |
| `recipes.js` | The 13 layouts Claude's content is poured into |
| `ai.js` | Prompt builder, Claude call, token estimates |
| `store.js` | Saving: hub database / asset store / downloads, or this browser |
| `index.html`, `studio.css`, `studio.js` | The studio |
| `hub.html` | The Artifact page, built by `python tools/build_hub.py` |
| `render.html`, `tools/render.py`, `tools/serve.py` | Full-size render, batch PNG export, local server |
| `assets/` | Logos, Odoo marks, 52 official app icons, Nexi cut-outs, portfolio screenshots (`sites/`), fonts |

**Publishing changes:** GitHub: commit and push (Pages rebuilds in a minute). Hub: run `python tools/build_hub.py`,
then republish `hub.html` with the files in `hub-files.json` to the same Artifact URL.

## Content rules (from technext.asia)

- Say "Odoo Partner"; never "Certified". Only the approved figures: 10+ countries, 11+ enterprise clients, 4 AI disciplines.
- Marketing (websites, social) is its own TechNext service; never tie it to Odoo.
- Odoo 20 claims come from the site's Odoo 20 article; AI features in Odoo 20 use paid credits.
- Record cards, phones and dashboards use sample data (the dashboard is labelled "Sample data"), never a real client's.
