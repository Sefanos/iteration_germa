"""Usage: python3 -I probe_images.py <image_paths.txt> <out.tsv>
Range-requests the first 48 KB (falls back to 256 KB) of each image to read pixel dimensions and total size.
Appends to out.tsv (path, status, width, height, bytes); skips paths already probed."""
import sys, os, struct, re, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import polite_get, BASE

def dims(d):
    if d[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", d[16:24])
    if d[:2] == b"\xff\xd8":
        i = 2
        while i < len(d) - 9:
            if d[i] != 0xFF: i += 1; continue
            m = d[i + 1]
            if m in (0xC0, 0xC1, 0xC2, 0xC3):
                h, w = struct.unpack(">HH", d[i + 5:i + 9]); return w, h
            if m in (0xD8, 0x01, 0xFF) or 0xD0 <= m <= 0xD7: i += 1 if m == 0xFF else 2; continue
            L = struct.unpack(">H", d[i + 2:i + 4])[0]; i += 2 + L
    if d[:4] == b"RIFF" and d[8:12] == b"WEBP":
        if d[12:16] == b"VP8X":
            w = int.from_bytes(d[24:27], "little") + 1; h = int.from_bytes(d[27:30], "little") + 1; return w, h
    return None, None

paths_file, out = sys.argv[1], sys.argv[2]
done = set()
if os.path.exists(out):
    done = {l.split("\t")[0] for l in open(out)}
with open(out, "a") as f:
    for p in (l.strip() for l in open(paths_file)):
        if not p or p in done: continue
        url = BASE + urllib.parse.quote(p, safe="/%._-~")
        status, headers, body = polite_get(url, {"Range": "bytes=0-49151"})
        w, h = dims(body) if body else (None, None)
        if w is None and status == 206:  # SOF marker beyond the first 48 KB (large EXIF block)
            status, headers, body = polite_get(url, {"Range": "bytes=0-262143"})
            w, h = dims(body) if body else (None, None)
        total = ""
        cr = headers.get("Content-Range") or headers.get("content-range") or ""
        m = re.search(r"/(\d+)$", cr)
        if m: total = m.group(1)
        elif status == 200: total = str(len(body))
        f.write(f"{p}\t{status}\t{w or ''}\t{h or ''}\t{total}\n"); f.flush()
        done.add(p)
