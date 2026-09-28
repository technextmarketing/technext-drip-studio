# TechNext Drip Studio

Build TechNext marketing drip images (Odoo apps, Odoo 20, AI, and per-industry posts) in the
technext.asia brand, then export them as 1080 px PNGs. It follows the style of the drips in
Drive `SALES / 01_Drips`: square canvas, TechNext logo top left, Odoo badge top right, a bold
two-tone headline, then a device, person, workflow or Nexi, with blue blobs at the bottom.

**Live:** https://technextmarketing.github.io/technext-drip-studio/ (repo `technextmarketing/technext-drip-studio`, GitHub Pages from `main`).
Online, everything works except writing to disk: edits stay in your browser, "Download PNG" renders in the
browser, and "Save library" downloads a `drips.js` you commit to the repo to share your drips with the team.

## Start

1. Double-click **`Open Drip Studio.bat`**. It runs `python tools/serve.py` and opens
   http://localhost:8807. Keep that window open while you work.
2. Pick a category on the left, click a drip to edit it, or press **New drip**.
3. **Download PNG** renders the drip with headless Chrome. The file downloads and is also
   saved to `exports/<category>/<id>.png`. **PNG 2x** makes a 2160 px file.
4. **Save library** writes your drips back into `drips.js`. The old copy goes to `backups/`.

Edits are also kept in this browser between visits. "Discard edits" drops them and reloads `drips.js`.

Opening `index.html` directly (without the .bat) still lets you edit, but PNG export and saving need the server
(or use the live URL).

To publish changes: save the library, then `git add -A && git commit -m "..." && git push` in this folder.
GitHub Pages redeploys in about a minute.

Batch export without the studio: `python tools/render.py` (all drips), `python tools/render.py <id> --scale 2`,
or `--format 4:5` for 1080 × 1350 portrait.

## Editing a drip

- **Drag** any layer on the canvas. Arrow keys nudge 1 px (Shift = 10 px). Ctrl+Z undoes.
- **Drop an image** on the canvas to add a person or product cut-out (transparent PNG works best).
  If a person, screenshot or image layer is selected, the drop replaces its image.
  Dropped images are embedded in the library. For big photos, save them in `assets/people/`
  and type the path (for example `assets/people/shocked-woman.png`) in the layer's image field.
- **Headline markup**: `*blue words*`, `~yellow brush underline~`, `==yellow marker==`,
  `[[white on blue]]`, `{odoo}Odoo purple{/odoo}`, and `|` for a line break.
  The headline shrinks itself to stay within 2 lines (change "Max headline lines" to allow 3).
- **4:5**: toggle it in the editor bar. Layers below the copy move down 150 px automatically;
  drag a layer in 4:5 to give it its own portrait position (`y45`).
- **Layer JSON** (bottom of the layer panel) shows every field, including the rows of a record card.

## Layer types

| Layer | What it is |
|---|---|
| `nexi` | Nexi, the TechNext robot. Poses: wave, point, present, celebrate, cheer, surprise, love, think, clap |
| `person` | Your cut-out photo (exaggerated people), with optional white sticker outline or bottom fade |
| `shot` | A screenshot, bare or in a browser, laptop or tablet frame |
| `phone` | Phone mockup. Built-in screen `offline-receipt`, or any screenshot as `src` |
| `record` | An Odoo record card: app icon, status, rows (`[label, value, "ai" or "ok"]`), AI note, button |
| `flow` | A workflow from the website: `from: "industry:fnb"` pulls that industry's six steps and Odoo apps |
| `apps` | Grid of official Odoo app icons: `"module:Label"` entries |
| `pill`, `chip`, `note`, `bubble`, `text` | Handwritten pills, step chips, Caveat notes (`red strike` for the old way), speech bubbles, free text |
| `icon`, `odoo` | A TechNext duotone icon, or one official Odoo app icon |
| `burst`, `glow`, `sphere`, `halftone`, `scan`, `sparkles`, `storm`, `speed`, `confetti`, `arrow`, `nosignal` | Effects |

## Templates (New drip)

- **Industry workflow**: the six-step flow for any of the 8 industries on the site, with a before/after line when a short one exists.
- **Before / after**: three old habits struck out, and what Odoo does instead (from the industry page table).
- **Odoo 20 feature**: pick any feature from the site's Odoo 20 summary; headline and subline are filled in.
- **Nexi explains**, **Person + callouts**, **Odoo app cloud**, **Blank**.

## Files

| Path | Role |
|---|---|
| `drips.js` | The library: categories and every drip (data only) |
| `content.js` | Website content: industry flows, before/after tables, app record flows, Odoo 20 features, icons. Refresh with `python tools/export_content.py` |
| `drip.css`, `drip-render.js` | The drip design system and renderer (shared by the studio and the exporter) |
| `index.html`, `studio.css`, `studio.js` | The studio |
| `render.html` | Renders one drip at full size for export |
| `assets/` | Logos, Odoo wordmark + badge, 52 official Odoo app icons, Nexi cut-outs, self-hosted fonts; put your photos in `assets/people/` |
| `tools/serve.py`, `tools/render.py` | Local server with PNG export and library saving; batch exporter |

## Content rules (from technext.asia)

- Say "Odoo Partner"; never "Certified". The badge image is the official Odoo Ready Partner mark.
- Only the approved figures: 10+ countries, 11+ enterprise clients, 4 AI disciplines.
- Marketing (websites, social) is its own TechNext service; don't tie it to Odoo.
- Odoo 20 claims come from the site's Odoo 20 article. AI features in Odoo 20 use paid IAP credits.
- Record cards and phone screens use sample data (for example "Sample Supplier Pte Ltd", "Harbourline Supplies" from the site's AI page), never a real client's data.

## Nexi renders

The Nexi cut-outs in `assets/nexi/` were rendered from the 3D Nexi chatbot
(`Pictures/technext-nexi-chatbot`) with a transparent background. To add a pose, render it the
same way and save it as `assets/nexi/nexi-<pose>.png`, then add the pose name to `POSES` in `studio.js`.
