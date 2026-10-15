"""Usage: python3 -I download.py <paths.txt> <out_dir> [--flat]
Downloads full image files (1 req/s). Paths are site-relative (/sites/default/files/...).
Saves as <out_dir>/<filename> (URL-decoded, spaces replaced)."""
import sys, os, urllib.parse, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import polite_get, BASE

paths_file, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for line in open(paths_file):
    p = line.strip()
    if not p or p.startswith("#"): continue
    src, _, dest = p.partition(" ")
    name = dest or re.sub(r"[^A-Za-z0-9._-]+", "_", urllib.parse.unquote(src.rsplit("/", 1)[1]))
    target = os.path.join(out, name)
    if os.path.exists(target) and os.path.getsize(target) > 0: continue
    url = src if src.startswith("http") else BASE + urllib.parse.quote(src, safe="/%._-~")
    status, _, body = polite_get(url)
    if status == 200 and body:
        open(target, "wb").write(body)
    print(status, src, "->", name, flush=True)
