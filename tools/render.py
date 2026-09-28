"""Batch-export drips to PNG with headless Chrome (no server needed).

  python tools/render.py                 # every drip in drips.js  -> exports/<category>/<id>.png
  python tools/render.py o20-offline-mode fnb-supplier-to-books
  python tools/render.py --scale 2       # 2160 px wide files
  python tools/render.py --format 4:5    # force the 1080 x 1350 portrait format

Needs Google Chrome and `pip install websocket-client`.
"""
import argparse, base64, json, os, re, shutil, subprocess, sys, tempfile, time, urllib.request
import websocket

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def drip_index():
    """Read id + category of every drip straight from drips.js."""
    src = open(os.path.join(ROOT, "drips.js"), encoding="utf-8").read()
    src = src[src.index("window.DRIPS"):]
    try:
        return [(d["id"], d.get("cat", "misc")) for d in json.loads(src[src.index("["):src.rindex("]") + 1])]
    except ValueError:
        return re.findall(r"id:\s*'([^']+)',\s*cat:\s*'([^']+)'", src)


class Chrome:
    def __init__(self, port):
        self.profile = tempfile.mkdtemp(prefix="drip-cdp-")
        self.proc = subprocess.Popen([CHROME, "--headless=new", "--no-sandbox", "--hide-scrollbars", "--no-first-run",
                                      "--disable-extensions", "--allow-file-access-from-files", "--remote-allow-origins=*",
                                      f"--remote-debugging-port={port}", f"--user-data-dir={self.profile}",
                                      "--window-size=1200,1400", "about:blank"],
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        ws_url = None
        for _ in range(80):
            try:
                pages = [t for t in json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json")) if t.get("type") == "page"]
                if pages:
                    ws_url = pages[0]["webSocketDebuggerUrl"]; break
            except Exception:
                pass
            time.sleep(0.25)
        if not ws_url:
            raise RuntimeError("Chrome did not start")
        self.ws = websocket.create_connection(ws_url, timeout=60)
        self.seq = 0
        self.send("Page.enable")

    def send(self, method, params=None):
        self.seq += 1
        self.ws.send(json.dumps({"id": self.seq, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.seq:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def value(self, expr):
        return self.send("Runtime.evaluate", {"expression": expr, "returnByValue": True}).get("result", {}).get("value")

    def shoot(self, url, out, scale):
        self.send("Emulation.setDeviceMetricsOverride", {"width": 1080, "height": 1350, "deviceScaleFactor": scale, "mobile": False})
        # a fresh token per shot, so the ready flag of the previous page can never be mistaken for this one
        self.seq_shot = getattr(self, "seq_shot", 0) + 1
        url = url + ("&" if "?" in url else "?") + f"shot={self.seq_shot}"
        self.send("Page.navigate", {"url": url})
        want = f"shot={self.seq_shot}"
        for _ in range(300):
            time.sleep(0.1)
            if self.value(f"location.search.indexOf('{want}') > -1 && document.readyState === 'complete' && document.body.getAttribute('data-ready')") == "1":
                break
        else:
            raise RuntimeError("render page did not become ready: " + url)
        time.sleep(0.4)
        h = self.value("document.querySelector('.drip').offsetHeight") or 1080
        shot = self.send("Page.captureScreenshot", {"format": "png", "clip": {"x": 0, "y": 0, "width": 1080, "height": h, "scale": 1}})
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "wb").write(base64.b64decode(shot["data"]))

    def close(self):
        try: self.ws.close()
        except Exception: pass
        self.proc.kill()
        try: self.proc.wait(timeout=5)
        except Exception: pass
        shutil.rmtree(self.profile, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--scale", type=float, default=1)
    ap.add_argument("--format", default=None, help="1:1 or 4:5")
    ap.add_argument("--out", default=os.path.join(ROOT, "exports"))
    ap.add_argument("--port", type=int, default=9520 + int(time.time()) % 60)
    a = ap.parse_args()
    items = drip_index()
    if a.ids:
        items = [(i, c) for i, c in items if i in a.ids]
    base = "file:///" + os.path.join(ROOT, "render.html").replace("\\", "/")
    ch = Chrome(a.port)
    try:
        for i, cat in items:
            q = f"?id={i}" + (f"&format={a.format}" if a.format else "")
            suffix = ("@%dx" % a.scale if a.scale > 1 else "") + ("-4x5" if a.format == "4:5" else "")
            out = os.path.join(a.out, cat, f"{i}{suffix}.png")
            ch.shoot(base + q, out, a.scale)
            print("saved", os.path.relpath(out, ROOT))
    finally:
        ch.close()


if __name__ == "__main__":
    main()
