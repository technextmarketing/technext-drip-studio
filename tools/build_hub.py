"""Build hub.html, the claude.ai Artifact version of the studio, from index.html.

The Artifact platform wraps the page in its own <!doctype>/<head>/<body>, so hub.html keeps only the
<title>, the stylesheets and the body content. Every other file is published next to it (see
HUB_FILES), with the same relative paths, so the studio code is identical in both places.

  python tools/build_hub.py      -> hub.html + hub-files.json (the file list to publish)
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
title = re.search(r"<title>.*?</title>", src, re.S).group(0)
links = "\n".join(l for l in re.findall(r"<link[^>]+>", src) if 'rel="stylesheet"' in l)
body = re.search(r"<body>(.*)</body>", src, re.S).group(1).strip()
out = f"{title}\n{links}\n<style>html,body{{height:100%}}</style>\n{body}\n"
open(os.path.join(ROOT, "hub.html"), "w", encoding="utf-8").write(out)

files = ["drip.css", "studio.css", "content.js", "drips.js", "drip-render.js", "odoo-ui.js", "compose.js", "starters.js", "ai.js", "store.js", "studio.js", "assets/fonts.css"]
for sub in ("assets/brand", "assets/fonts", "assets/nexi", "assets/odoo", "assets/sites"):
    for fn in sorted(os.listdir(os.path.join(ROOT, sub))):
        if not fn.startswith("."):
            files.append(sub + "/" + fn)
json.dump({f: f for f in files}, open(os.path.join(ROOT, "hub-files.json"), "w"), indent=0)
size = sum(os.path.getsize(os.path.join(ROOT, f)) for f in files)
print(f"hub.html written; {len(files)} supporting files, {size / 1e6:.1f} MB")
