"""Usage: python3 -I parse_pages.py <cache_pages_dir> <chantiers.txt> <families.json> <content_dir>
Parses cached French pages into services.json, projects/*.json, realisations.json and image_paths.txt."""
import sys, os, re, json, glob, html as _html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from htmlutil import main_html, text, h1, imgs, block

pages, chantiers_file, fam_file, out = sys.argv[1:5]
BASE = "https://www.germa-paysages.ch"
fam = {s: f for f, ss in json.load(open(fam_file)).items() for s in ss}
read = lambda p: open(p, encoding="utf-8", errors="ignore").read()

def link_titles(fragment):
    res = []
    for m in re.finditer(r'<a href="(?:https://www\.germa-paysages\.ch)?(/fr/[^"#?]+)"[^>]*>(.*?)</a>', fragment, re.S):
        t = text(m.group(2)).strip()
        if t: res.append((m.group(1), t))
    return res

# ---------- services ----------
services = []
svc_projects = {}
for f in sorted(glob.glob(os.path.join(pages, "fr__prestations__*.html"))):
    slug = os.path.basename(f)[len("fr__prestations__"):-5]
    d = read(f); m = main_html(d)
    node = block(m, 'id="node-', ('<div id="block-',))
    body = re.search(r'field--name-body[^"]*"[^>]*>(.*?)</div>', node, re.S)
    cat = re.search(r'field--name-field-categorie-p[^>]*>(.*?)</div>', node, re.S)
    sub = re.search(r'field--name-field-en-creation[^>]*>(.*?)</div>', node, re.S)
    banner = re.search(r'field--name-field-image-prestations.*?<img[^>]*src="([^"]+)"', node, re.S)
    related = []
    for bid in re.findall(r'id="(block-views-block-[a-z0-9-]*utilisant[^"]*)"', m):
        related += [{"title": t, "url": BASE + u} for u, t in link_titles(block(m, f'id="{bid}"', ('<div id="block-', '</main>')))]
    seen = set(); related = [r for r in related if not (r["url"] in seen or seen.add(r["url"]))]
    for r in related: svc_projects.setdefault(r["url"], []).append(slug)
    services.append({
        "slug": slug, "title": h1(m), "legacyUrl": f"{BASE}/fr/prestations/{slug}",
        "family": fam.get(slug), "legacyCategory": text(cat.group(1)) if cat else None,
        "legacySubcategory": text(sub.group(1)) if sub else None,
        "text": text(body.group(1)) if body else "",
        "bannerImage": banner.group(1).split("?")[0] if banner else None,
        "images": imgs(node), "relatedProjects": related,
    })
missing = [s["slug"] for s in services if not s["family"]]
json.dump(services, open(os.path.join(out, "services.json"), "w"), ensure_ascii=False, indent=2)

# ---------- chantiers (A to Z projects) ----------
LOC = re.compile(r"\b(?:à|au|aux|sur la|en)\s+((?:Saint|St|Mont|Villars|Crans|Le|La|Les)?[-\s]?[A-ZÉÈ][\w'’-]+(?:[-\s](?:sur|sous|de|du|la|le|les|en)?[-\s]?[A-ZÉÈ]?[\w'’-]+)*)")
os.makedirs(os.path.join(out, "projects"), exist_ok=True)
index = []
for u in (l.strip() for l in open(chantiers_file)):
    if not u: continue
    slug = u.rstrip("/").rsplit("/", 1)[1]
    f = os.path.join(pages, f"fr__{slug}.html")
    if not os.path.exists(f): print("missing page", slug); continue
    d = read(f); m = main_html(d)
    main_block = block(m, 'id="block-germa-content"', ('<div class="views-element-container', '<div id="block-views'))
    slider = block(main_block, 'slider-for', ('slider-nav', 'desc_marques'))
    images = imgs(slider) or imgs(main_block)
    desc = re.search(r'class="description">(.*?)</div>\s*</div>', main_block, re.S)
    body = text(desc.group(1)) if desc else ""
    title = h1(m) or slug
    loc = LOC.search(title)
    proj = {
        "slug": slug, "title": title, "legacyUrl": u, "type": "chantier-a-z",
        "locationFromTitle": loc.group(1).strip() if loc else None,
        "text": body, "wordCount": len(body.split()),
        "services": sorted(set(svc_projects.get(u, []))),
        "images": [{"path": p} for p in images],
        "featured": False, "draft": True,
    }
    json.dump(proj, open(os.path.join(out, "projects", f"{slug}.json"), "w"), ensure_ascii=False, indent=2)
    index.append({k: proj[k] for k in ("slug", "title", "legacyUrl", "locationFromTitle", "wordCount", "services")} | {"imageCount": len(images)})
json.dump(index, open(os.path.join(out, "projects", "index.json"), "w"), ensure_ascii=False, indent=2)

# ---------- realisations "en vrac" (432 single-photo items) ----------
d = main_html(read(os.path.join(pages, "fr__nos-realisations.html")))
real = []
for row in re.split(r'<div class="views-row">', d)[1:]:
    t = re.search(r'<span class="titre">(.*?)</span>', row, re.S)
    pop = block(row, 'class="blocPopup"', ('</span></div></div>',))
    svcs = [u.rsplit("/", 1)[1] for u, _ in link_titles(block(pop, 'class="item-list"', ('</ul>',)))]
    real.append({"title": text(t.group(1)) if t else None, "thumb": (imgs(row) or [None])[0],
                 "image": (imgs(pop) or imgs(row) or [None])[0], "services": svcs})
json.dump(real, open(os.path.join(out, "realisations.json"), "w"), ensure_ascii=False, indent=2)

# ---------- every image referenced on any cached page ----------
refs = {}
for f in sorted(glob.glob(os.path.join(pages, "*.html"))):
    page = os.path.basename(f)[:-5].replace("__", "/")
    for p in imgs(main_html(read(f))):
        if "/styles/" in p: continue
        refs.setdefault(p, set()).add(page)
with open(os.path.join(out, "..", ".harvest-cache", "image_refs.json") if False else os.path.join(pages, "..", "image_refs.json"), "w") as fh:
    json.dump({k: sorted(v) for k, v in refs.items()}, fh, ensure_ascii=False, indent=1)
open(os.path.join(pages, "..", "image_paths.txt"), "w").write("\n".join(sorted(refs)) + "\n")
print(f"services={len(services)} missingFamily={missing} chantiers={len(index)} realisations={len(real)} uniqueImages={len(refs)}")
