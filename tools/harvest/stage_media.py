"""Usage: python3 -I stage_media.py <preview_dir> <content_dir> <manual_review.json>
Copies already-downloaded full-size files for the shortlist into content/media/<slug>/ and the hero
candidates into content/media/hero/, then records local paths in the project JSONs and writes
content/media/hero/hero-candidates.json. Run after build_inventory.py. No network access."""
import sys, os, re, json, shutil, glob, urllib.parse

preview, content, manual_file = sys.argv[1:4]
manual = json.load(open(manual_file))
safe = lambda p: re.sub(r"[^A-Za-z0-9._-]+", "_", urllib.parse.unquote(p.rsplit("/", 1)[-1]))
missing = []

for slug, meta in manual.get("projects", {}).items():
    if not meta.get("shortlist"): continue
    f = os.path.join(content, "projects", f"{slug}.json")
    pj = json.load(open(f))
    out = os.path.join(content, "media", slug)
    os.makedirs(out, exist_ok=True)
    for im in pj["images"]:
        if "exclude" in im["flags"]: continue
        src = os.path.join(preview, safe(im["path"]))
        if not os.path.exists(src): missing.append(im["path"]); continue
        shutil.copy2(src, os.path.join(out, safe(im["path"])))
        im["local"] = f"content/media/{slug}/{safe(im['path'])}"
    json.dump(pj, open(f, "w"), ensure_ascii=False, indent=2)

inv = {}
import csv
for row in csv.DictReader(open(os.path.join(content, "IMAGE_INVENTORY.csv"))):
    inv[row["url"].rsplit("/", 1)[1]] = row
hero_dir = os.path.join(content, "media", "hero"); os.makedirs(hero_dir, exist_ok=True)
heroes = []
for h in manual.get("hero", []):
    fn = h["file"]; row = inv.get(fn, {})
    src = os.path.join(preview, safe(fn))
    w, hgt = int(row.get("width") or 0), int(row.get("height") or 0)
    dest = f"{h['rank']:02d}-{safe(fn)}"
    if os.path.exists(src): shutil.copy2(src, os.path.join(hero_dir, dest))
    else: missing.append(fn)
    review = manual.get(fn, {})
    heroes.append({"rank": h["rank"], "file": f"content/media/hero/{dest}", "sourceUrl": row.get("url"),
                   "width": w, "height": hgt, "fullBleedCapable": max(w, hgt) >= 2560,
                   "recommendedUse": "full-bleed" if max(w, hgt) >= 2560 else "framed editorial hero (about 55–70% of viewport width)",
                   "upscaleCandidate": "upscale-candidate" in (row.get("flags") or ""),
                   "pages": row.get("page", "").split(";"), "note": review.get("note")})
json.dump(heroes, open(os.path.join(hero_dir, "hero-candidates.json"), "w"), ensure_ascii=False, indent=2)
print("missing:", missing)
for h in heroes: print(h["rank"], h["width"], h["height"], h["fullBleedCapable"], h["file"])
