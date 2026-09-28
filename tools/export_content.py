"""Refresh content.js from the live technext.asia source, so drips use the website's own wording.

  python tools/export_content.py ["G:/Shared drives/Marketing/00. TechNext Folder/05. Technext Main Website"]

Pulls: the 8 industry workflows + before/after tables (_src/industries.py), the per-app record flows
(_src/app_flows.py), the Odoo 20 feature list (assets/js/demo-o20.js), the TechNext icon set and
company facts (_src/sitedata.py). Also re-copies the official Odoo app icons into assets/odoo/.
"""
import ast, html, json, os, re, shutil, sys

SITE = sys.argv[1] if len(sys.argv) > 1 else r"G:/Shared drives/Marketing/00. TechNext Folder/05. Technext Main Website"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(SITE, "_src"))
import industries as I  # noqa: E402
import app_flows as A  # noqa: E402
import sitedata as S  # noqa: E402


def clean(o):
    if isinstance(o, str): return html.unescape(o)
    if isinstance(o, dict): return {k: clean(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)): return [clean(v) for v in o]
    return o


keep = ("name", "noun", "intro", "flow_title", "flow_lead", "flow", "ba", "new20", "chart", "phases", "integrations")
ind = {k: clean({kk: vv for kk, vv in v.items() if kk in keep}) for k, v in I.IND.items()}
js = open(os.path.join(SITE, "assets/js/demo-o20.js"), encoding="utf-8").read()
m = re.search(r"var AREAS = (\[.*?\n  \]);", js, re.S)
areas = ast.literal_eval(m.group(1)) if m else []
def page_summary(path):
    src = open(path, encoding="utf-8").read()
    meta = re.search(r"<!--meta\s*(\{.*?\})\s*-->", src, re.S)
    m = json.loads(meta.group(1)) if meta else {}
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", src, flags=re.S)
    t = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)))
    t = re.sub(r"\{\{[^}]*\}\}", "", t)
    i = t.find("In one paragraph ")
    para = ""
    if i > -1:
        para = t[i + 17:i + 17 + 900]
        para = para[:para.rfind(". ") + 1] if ". " in para else para
    return {"title": m.get("title", ""), "desc": m.get("desc", ""), "para": para.strip()}


services = {}
for sub in ("solutions", "odoo"):
    folder = os.path.join(SITE, "_src/pages", sub)
    for fn in sorted(os.listdir(folder)):
        if fn.endswith(".html"):
            services[sub + "/" + fn[:-5]] = page_summary(os.path.join(folder, fn))

# TechNext-built sites shown by the website elements (screenshots live in assets/sites/)
sites = {
    "technext": {"name": "TechNext", "url": "technext.asia", "what": "TechNext's own site: Odoo, AI and marketing"},
    "movewithease": {"name": "Move with Ease", "url": "technextmarketing.github.io/movewithease-v2", "what": "Therapy practice in Kent, UK: bookings, events and gift vouchers"},
    "tre": {"name": "TRE Singapore", "url": "technextmarketing.github.io/tre-singapore", "what": "Wellbeing education: courses, certified providers and events"},
    "immaculate": {"name": "Immaculate Connections", "url": "technextmarketing.github.io/immaculateconnectionsph", "what": "Cebu tour operator: tour packages and quotation requests"},
}

apps = {}
for c in S.APP_CATEGORIES:
    for a in c["apps"]:
        apps[a["mod"]] = {"name": a["name"], "desc": a.get("desc", ""), "cat": c["title"], "focus": bool(a.get("focus"))}

data = {
    "apps": apps,
    "industries": ind,
    "services": services,
    "sites": sites,
    "appFlows": clean(A.FLOWS),
    "appLayout": A.LAYOUT,
    "odoo20": areas,
    "icons": dict(S.ICONS),
    "company": {k: v for k, v in S.COMPANY.items() if isinstance(v, (str, int))},
}
out = os.path.join(ROOT, "content.js")
with open(out, "w", encoding="utf-8") as f:
    f.write("/* Content library for the TechNext Drip Studio, exported from the live technext.asia source\n"
            "   (_src/industries.py, _src/app_flows.py, assets/js/demo-o20.js, _src/sitedata.py). Re-export with tools/export_content.py. */\n"
            "window.TN_CONTENT = " + json.dumps(data, ensure_ascii=False, indent=0) + ";\n")
icons = os.path.join(SITE, "assets/img/odoo")
for fn in os.listdir(icons):
    if fn.endswith(".svg"):
        shutil.copy2(os.path.join(icons, fn), os.path.join(ROOT, "assets/odoo", fn))
print(f"content.js: {len(ind)} industries, {len(data['appFlows'])} app flows, {len(areas)} Odoo 20 areas, {len(data['icons'])} icons")
