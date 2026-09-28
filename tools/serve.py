"""Serve the Drip Studio and render PNGs with headless Chrome.

  python tools/serve.py            # http://127.0.0.1:8807  (Open Drip Studio.bat runs this)

Besides the static files it answers:
  GET  /api/ping                    -> {"ok": true}            (the studio checks this on start)
  POST /api/render   {drip, scale}  -> PNG bytes, also saved to exports/<category>/<id>.png
  POST /api/library  {js}           -> writes drips.js (the old one is copied to backups/ first)
Only listens on 127.0.0.1.
"""
import json, os, shutil, sys, threading, time, uuid
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import render as R  # noqa: E402

PORT = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 else 8807))
DRIPS = {}
LOCK = threading.Lock()
CHROME = {"c": None}


def chrome():
    if CHROME["c"] is None:
        CHROME["c"] = R.Chrome(9700 + PORT % 200)
    return CHROME["c"]


def safe(name):
    return "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in str(name))[:80] or "drip"


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        if "/api/" in (args[0] if args else ""):
            sys.stderr.write("%s\n" % (fmt % args))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith("/api/ping"):
            return self._json(200, {"ok": True})
        if self.path.startswith("/api/drip/"):
            tok = self.path.rsplit("/", 1)[-1]
            d = DRIPS.get(tok)
            return self._json(200, d) if d else self._json(404, {"error": "unknown drip"})
        return super().do_GET()

    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        try:
            data = json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            return self._json(400, {"error": "bad JSON"})
        if self.path == "/api/render":
            d = data.get("drip") or {}
            scale = data.get("scale") if data.get("scale") in (1, 2, 3) else 1
            tok = uuid.uuid4().hex
            DRIPS[tok] = d
            cat, did = safe(d.get("cat") or "misc"), safe(d.get("id") or "drip")
            name = did + ("@%dx" % scale if scale > 1 else "") + ("-4x5" if d.get("format") == "4:5" else "") + ".png"
            out = os.path.join(ROOT, "exports", cat, name)
            try:
                with LOCK:
                    chrome().shoot(f"http://127.0.0.1:{PORT}/render.html?src=/api/drip/{tok}", out, scale)
            except Exception as e:  # restart Chrome once if it died
                CHROME["c"] = None
                try:
                    with LOCK:
                        chrome().shoot(f"http://127.0.0.1:{PORT}/render.html?src=/api/drip/{tok}", out, scale)
                except Exception as e2:
                    return self._json(500, {"error": str(e2)})
            finally:
                DRIPS.pop(tok, None)
            body = open(out, "rb").read()
            self.send_response(200)
            self.send_header("Content-Type", "image/png")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("X-Saved-To", os.path.relpath(out, ROOT).replace("\\", "/"))
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path == "/api/library":
            js = data.get("js") or ""
            if "window.DRIPS" not in js:
                return self._json(400, {"error": "not a drip library"})
            src = os.path.join(ROOT, "drips.js")
            os.makedirs(os.path.join(ROOT, "backups"), exist_ok=True)
            if os.path.exists(src):
                shutil.copy2(src, os.path.join(ROOT, "backups", time.strftime("drips-%Y%m%d-%H%M%S.js")))
            open(src, "w", encoding="utf-8").write(js)
            return self._json(200, {"ok": True, "saved": "drips.js"})
        return self._json(404, {"error": "unknown endpoint"})


def main():
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), partial(Handler, directory=ROOT))
    print(f"Drip Studio: http://127.0.0.1:{PORT}/   (Ctrl+C to stop)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        if CHROME["c"]:
            CHROME["c"].close()


if __name__ == "__main__":
    main()
