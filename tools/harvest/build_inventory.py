"""Usage: python3 -I build_inventory.py <harvest_cache_dir> <content_dir> <manual_flags.json>
Merges probed dimensions + heuristic flags + manual review flags into IMAGE_INVENTORY.csv
and enriches content/projects/*.json, services.json and realisations.json."""
import sys, os, re, json, csv, glob, unicodedata, urllib.parse

cache, content, manual_file = sys.argv[1:4]
BASE = "https://www.germa-paysages.ch"
refs = json.load(open(os.path.join(cache, "image_refs.json")))
probe = {}
for line in (l for f in sorted(glob.glob(os.path.join(cache, "image_probe*.tsv"))) for l in open(f)):
    p, st, w, h, b = (line.rstrip("\n").split("\t") + [""] * 5)[:5]
    probe[p] = {"status": st, "width": int(w) if w else None, "height": int(h) if h else None, "bytes": int(b) if b else None}
manual = json.load(open(manual_file)) if os.path.exists(manual_file) else {}

def norm(s):
    return unicodedata.normalize("NFKD", urllib.parse.unquote(s)).encode("ascii", "ignore").decode().lower()

R = lambda *ps: re.compile("|".join(ps))
SUPPLIER = [
    (R(r"soko", r"pieau", r"verandas"), "supplier", "SOKO marketing photo, credited « © SOKO – F. Pieau », shot in France"),
    (R(r"pergola_(open|neo|kub)", r"^open_(1\d|r)_", r"^open_r_", r"^pergola-bioclimatique(_\d)?\.jpg"), "supplier", "probable pergola manufacturer catalogue image (SOKO model names Open/Neo/Kub)"),
    (R(r"^piscine\d+(_\d)?\.jpg", r"^machine(-auto)?\.", r"piscine-connectee", r"fond-enterre", r"^couverture\.png", r"^revetement\.png", r"^escaliers\.png", r"^construction(%20%281%29| \(1\))?\.jpeg"), "supplier", "probable pool manufacturer (Magiline partner) marketing image"),
    (R(r"^revetement\d\.jpeg", r"^revetements_0\.jpeg"), "supplier", "probable resin-surface supplier image"),
    (R(r"carat-r", r"platine-r", r"husqvarna", r"automower"), "supplier", "product photo (rainwater tank / robotic mower)"),
    (R(r"architecte_paris"), "supplier", "third-party image (Paris architect), not a Germa project"),
]
EXCLUDE_OTHER = [
    (R(r"capture"), "screenshot"),
    (R(r"^canva"), "Canva graphic"),
    (R(r"inline-images/(prestations|chantiers_1|videos|realisations)\.jpeg"), "navigation tile on the about page"),
]
DESIGN = R(r"c4d", r"_4d", r"pers_", r"rendu", r"projection", r"variante", r"pergotstfd", r"image_ambiance", r"panorama_sans_titre")
DRAWING = R(r"croquis", r"_plan_", r"plan_a4", r"proposition_.*plan")
NAMES = ["dragan", "christine", "devillaz", "nicholas", "goncalves", "danielx", "legier", "debons", "dumu", "pierranne", "adriatha", "charlotte", "penant", "manu_"]
PLACES = {"chermignon": "Chermignon", "villars-sur-ollon": "Villars-sur-Ollon", "saint-sulpice": "Saint-Sulpice", "saint-maurice": "Saint-Maurice",
          "monthey": "Monthey", "bouveret": "Le Bouveret", "broc": "Broc", "mont-sur-rolle": "Mont-sur-Rolle", "randogne": "Randogne",
          "crans-montana": "Crans-Montana", "montreux": "Montreux", "riviera": "Riviera", "chablais": "Chablais", "geneve": "Genève",
          "lausanne": "Lausanne", "jouxtens": "Jouxtens-Mézery", "collombey": "Collombey-Muraz", "genolier": "Genolier", "founex": "Founex",
          "boussens": "Boussens", "blonay": "Blonay", "gilly": "Gilly", "morgins": "Morgins", "onex": "Onex", "gryon": "Gryon",
          "fribourg": "Fribourg", "vich": "Vich", "massongex": "Massongex", "fully": "Fully", "saviese": "Savièse", "morges": "Morges",
          "etoy": "Etoy", "sion": "Sion", "martigny": "Martigny", "vevey": "Vevey", "nyon": "Nyon", "aigle": "Aigle", "verbier": "Verbier",
          "champery": "Champéry", "troistorrents": "Troistorrents", "ollon": "Ollon", "bex": "Bex"}

def places_in(s):
    s = norm(s); found = []
    for k, v in PLACES.items():
        if re.search(r"(?<![a-z])" + re.escape(k) + r"(?![a-z])", s) and v not in found:
            if k == "ollon" and "villars-sur-ollon" in s: continue
            found.append(v)
    return found

def base_key(p):
    d, fn = p.rsplit("/", 1); stem, ext = fn.rsplit(".", 1)
    while re.search(r"_\d$", stem): stem = stem[:-2]
    return d + "/" + stem + "." + ext.lower()

info = {}
for p, pages in refs.items():
    fn = norm(p.rsplit("/", 1)[1]); full = norm(p)
    pr = probe.get(p, {}); w, h = pr.get("width"), pr.get("height")
    flags, notes = [], []
    if w and max(w, h) < 1200: flags.append("low-res")
    if re.match(r"\d{8,}_\d{10,}_\d+_[on]", fn): flags.append("facebook")
    for rx, flag, note in SUPPLIER:
        if rx.search(fn): flags += ["supplier", "exclude"]; notes.append(note); break
    for rx, note in EXCLUDE_OTHER:
        if rx.search(full): flags.append("exclude"); notes.append(note)
    if w and max(w, h) < 500: flags.append("exclude"); notes.append("too small to use (< 500 px)")
    if re.search(r"avant|etat_initial", fn): flags.append("before")
    if re.search(r"apres", fn): flags.append("after")
    if DESIGN.search(fn): flags.append("3d-projection")
    if DRAWING.search(fn): flags.append("design-drawing")
    if any(n in fn for n in NAMES): notes.append("personal or business name in filename: rename on export")
    m = manual.get(p) or manual.get(p.rsplit("/", 1)[1]) or {}
    flags += m.get("addFlags", []); notes += [m["note"]] if m.get("note") else []
    flags = [f for f in dict.fromkeys(flags) if f not in m.get("removeFlags", [])]
    if pr.get("status") not in ("200", "206"): notes.append(f"probe status {pr.get('status')}")
    info[p] = {"width": w, "height": h, "bytes": pr.get("bytes"), "flags": flags, "notes": notes,
               "pages": pages, "placeHints": places_in(fn)}

# duplicate groups (Drupal stores re-uploads as name_0, name_1 …)
groups = {}
for p in info: groups.setdefault(base_key(p), []).append(p)
for k, ps in groups.items():
    best = max(ps, key=lambda q: ((info[q]["width"] or 0) * (info[q]["height"] or 0), -len(q)))
    for q in ps:
        info[q]["duplicateGroup"] = k
        info[q]["bestInGroup"] = best

with open(os.path.join(content, "IMAGE_INVENTORY.csv"), "w", newline="") as f:
    wr = csv.writer(f)
    wr.writerow(["url", "page", "width", "height", "bytes", "flags", "notes"])
    for p in sorted(info):
        i = info[p]
        notes = list(i["notes"])
        if i["bestInGroup"] != p: notes.append("duplicate of " + i["bestInGroup"].rsplit("/", 1)[1])
        if i["placeHints"]: notes.append("place in filename: " + ", ".join(i["placeHints"]))
        wr.writerow([BASE + p, ";".join("/" + x for x in i["pages"]), i["width"] or "", i["height"] or "", i["bytes"] or "",
                     ";".join(i["flags"]), " | ".join(notes)])

def img_entry(p):
    i = info.get(p, {})
    return {"path": p, "url": BASE + p, "width": i.get("width"), "height": i.get("height"),
            "flags": i.get("flags", []), "notes": i.get("notes", []), **({"local": manual[p]["local"]} if p in manual and manual[p].get("local") else {})}

# projects
idx = []
for f in sorted(glob.glob(os.path.join(content, "projects", "*.json"))):
    if f.endswith("index.json"): continue
    pj = json.load(open(f))
    paths = [im["path"] for im in pj["images"]]
    pj["images"] = [img_entry(p) for p in paths]
    usable = [im for im in pj["images"] if "exclude" not in im["flags"]]
    pj["location"] = (places_in(pj["title"] + " " + pj["text"]) or [None])[0]
    pj["locationHintsFromFilenames"] = sorted({pl for p in paths for pl in info.get(p, {}).get("placeHints", [])})
    pj.pop("locationFromTitle", None)
    pj["stats"] = {"images": len(paths), "usable": len(usable),
                   "longEdgeMax": max([max(im["width"] or 0, im["height"] or 0) for im in pj["images"]] or [0]),
                   "usableAtLeast1200": sum(1 for im in usable if max(im["width"] or 0, im["height"] or 0) >= 1200)}
    mp = manual.get("projects", {}).get(pj["slug"], {})
    pj.update({k: v for k, v in mp.items()})
    json.dump(pj, open(f, "w"), ensure_ascii=False, indent=2)
    idx.append({"slug": pj["slug"], "title": pj["title"], "legacyUrl": pj["legacyUrl"], "location": pj["location"],
                "featured": pj.get("featured", False), "shortlist": pj.get("shortlist", False), "services": pj["services"],
                "wordCount": pj["wordCount"], **pj["stats"],
                **{k: pj[k] for k in ("rank", "family", "reason", "heroImage") if k in pj}})
idx.sort(key=lambda x: (x.get("rank", 99), -x["usableAtLeast1200"], -x["usable"]))
json.dump(idx, open(os.path.join(content, "projects", "index.json"), "w"), ensure_ascii=False, indent=2)

# services and realisations
sv = json.load(open(os.path.join(content, "services.json")))
for s in sv:
    s["images"] = [img_entry(p) for p in (x if isinstance(x, str) else x["path"] for x in s["images"])]
    if s.get("bannerImage"): s["bannerImage"] = img_entry(s["bannerImage"] if isinstance(s["bannerImage"], str) else s["bannerImage"]["path"])
json.dump(sv, open(os.path.join(content, "services.json"), "w"), ensure_ascii=False, indent=2)
rl = json.load(open(os.path.join(content, "realisations.json")))
for r in rl:
    for k in ("thumb", "image"):
        if r.get(k): r[k] = img_entry(r[k] if isinstance(r[k], str) else r[k]["path"])
json.dump(rl, open(os.path.join(content, "realisations.json"), "w"), ensure_ascii=False, indent=2)

# summary
allf = [i["flags"] for i in info.values()]
cnt = lambda fl: sum(1 for x in allf if fl in x)
uniq = len(groups)
sizes = [max(i["width"], i["height"]) for i in info.values() if i["width"]]
print(json.dumps({"images": len(info), "uniqueAfterDedup": uniq, "probed": len(sizes),
                  "excluded": cnt("exclude"), "supplier": cnt("supplier"), "facebook": cnt("facebook"), "lowRes": cnt("low-res"),
                  "before": cnt("before"), "after": cnt("after"), "design": cnt("3d-projection"), "drawings": cnt("design-drawing"),
                  "longEdge>=2560": sum(1 for s in sizes if s >= 2560), "longEdge>=1600": sum(1 for s in sizes if s >= 1600),
                  "longEdge>=1200": sum(1 for s in sizes if s >= 1200), "maxLongEdge": max(sizes or [0])}, indent=1))
