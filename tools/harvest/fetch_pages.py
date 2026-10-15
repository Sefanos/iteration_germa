"""Usage: python3 -I fetch_pages.py <url_list.txt> <cache_dir>
Fetches each French page once (skips cached), 1 req/s. Never submits forms."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import polite_get, cache_name, allowed

urls_file, cache = sys.argv[1], sys.argv[2]
os.makedirs(cache, exist_ok=True)
urls = [u.strip() for u in open(urls_file) if u.strip()]
for i, u in enumerate(urls):
    if "/fr" not in u or not allowed(u):
        print("skip", u); continue
    out = os.path.join(cache, cache_name(u))
    if os.path.exists(out) and os.path.getsize(out) > 0:
        continue
    status, _, body = polite_get(u)
    if status == 200:
        open(out, "wb").write(body)
    print(i, status, u, flush=True)
