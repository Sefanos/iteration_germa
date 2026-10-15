"""Shared helpers for the Germa content harvest. Polite: 1 request/second, descriptive UA."""
import time, urllib.request, urllib.parse, re, os, fcntl

BASE = "https://www.germa-paysages.ch"
UA = "GermaContentHarvest/1.0 (Pulse.digital redesign prototype; contact l.mahdi@pulse.digital)"
LOCK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".harvest-cache", "rate.lock")

def _throttle():
    """Cross-process limiter: at most one request start per second for all harvest processes."""
    with open(LOCK, "a+") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        f.seek(0)
        try:
            last = float(f.read().strip() or 0)
        except ValueError:
            last = 0.0
        wait = 1.0 - (time.time() - last)
        if wait > 0:
            time.sleep(wait)
        f.seek(0); f.truncate(); f.write(repr(time.time())); f.flush()
        fcntl.flock(f, fcntl.LOCK_UN)

def polite_get(url, headers=None, timeout=30):
    _throttle()
    h = {"User-Agent": UA}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
            return r.status, dict(r.headers), body
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers or {}), e.read() if hasattr(e, "read") else b""

def cache_name(url):
    p = urllib.parse.urlparse(url).path.strip("/") or "root"
    return re.sub(r"[^A-Za-z0-9_.-]", "_", p.replace("/", "__")) + ".html"

DISALLOWED = ("/admin", "/user", "/search", "/node/add", "/comment/reply", "/filter/tips", "/media/oembed")

def allowed(url):
    path = urllib.parse.urlparse(url).path
    path = re.sub(r"^/(fr|en)(?=/)", "", path)
    return not any(path.startswith(d) for d in DISALLOWED)
