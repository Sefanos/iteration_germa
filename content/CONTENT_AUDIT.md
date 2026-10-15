# Germa Paysages: content audit

Harvested from https://www.germa-paysages.ch/fr on 2026-10-15, French pages only. Scripts are in `tools/harvest/` (see "Re-running" at the end).

## In short

- **Text is thin.** Projects have a median of 13 words, and 10 of the 83 project stories have none. The services and about pages are usable, verbatim.
- **Photos are plentiful but small.** 751 of the 825 usable images are exactly **840×458 px**: the CMS kept resized crops, not originals. Only 2 of 83 projects have any photo of 1200 px or more: Chermignon (1920 px) and the Monthey residential park (3024 px).
- **No finished-garden photo can carry a full-bleed hero.** The 5 usable files ≥ 2560 px are a section drawing, a tree, a fence and two Monthey park shots. Every hero below needs the **framed editorial layout**.
- **The design-process material is the hidden asset.** There are 3D renders (some Cinema 4D), photomontages, section drawings, plans and a hand sketch, plus verified état initial → projection → réalisation sequences. They fit the "Living Architecture" story well.

## Inventory

| Item | Count | File |
|---|---|---|
| Service pages | 44, grouped into 6 families | `services.json` |
| Project stories ("chantiers de A à Z") | 83 | `projects/*.json`, `projects/index.json` |
| Single-photo réalisations | 432 items (362 unique titles) | `realisations.json` |
| Image URLs | 1,449, or 925 after removing Drupal duplicates (`name_0`, `name_1` …) | `IMAGE_INVENTORY.csv` |
| Usable unique images | 825 | |

Usable unique images by long edge: 2 under 840 px, 753 at 840–1199, 34 at 1200–1599, 31 at 1600–2559, 5 at 2560 or more.

Flags in the inventory:
- Excluded: 470 URLs. 403 are thumbnails under 500 px (duplicates of larger files), 60 are supplier images, 2 show gardens in Greece, 3 are a screenshot, a Canva graphic or a nav tile, and 2 more were excluded after review (a probable stock photo, and the showroom logo).
- `facebook` re-uploads: 17. `before`: 9. `after`: 20. Renders and projections: 52. Plans and sketches: 9.
- 45 unique files contain a personal or business name in the filename. Rename them on export.

## Featured projects (`featured: true`) and shortlist

| # | Project | Type | Images | Why |
|---|---|---|---|---|
| 1 | Chalet de maître, Chermignon | Conception + jardin | 12 (photos up to 1920 px) | Best photos on the site: stone stairs, stepping stones, rockery, lighting, alpine setting. Sections and planting renders tell the idea → built story. |
| 2 | Jardin japonais, Chablais | Jardin / minéral | 10 (840 px) | The most distinctive garden in the archive: raked gravel, cloud-pruned pine, standing stones, mountains behind. |
| 3 | Villars-sur-Ollon, jardin, spa, enrochement | Spa + pierre | 9 (840 px) | Chalet, hot tub on a larch deck, rock walls, mountain light. |
| 4 | Un chantier sans accès | Terrasse / bois | 14 (840 px) | Terraced larch retaining walls and deck on a steep slope, with a strong "no access" story (41 words of text). |
| 5 | Mur en pierre de St-Léonard et terrasse | Murs & pierre | 12 (840 px) | A curved dry-stone wall documented from rubble to finish. Shows the retaining-wall craft. |
| 6 | Entrée de maison, Saint-Maurice | Conception | 5 (840 px) | État initial → photomontage → built result. Chosen for the story, not the photo count. |

Shortlist alternates:
- **7. Parc de lotissement, Monthey:** a render → built pair with the only large photos. It works better in chapter 05.
- **8. Terrasse en mélèze, chalet.**
- **9. Aménagement important sur la Riviera.**
- **10. Terrasses des suites d'un hôtel:** rooftop, lake view and a crane story, but the hotel name needs permission.

Full-size files for all ten are in `content/media/<slug>/`, and each project JSON records the `local` path.

## Hero candidates (`media/hero/`, details in `hero-candidates.json`)

All are framed-hero only; none reaches 2560 px.

| # | Image | Size | Notes |
|---|---|---|---|
| 1 | Beau-Rivage Palace at night | 1440×961 | Planters and lighting. The most cinematic image. Professional photo: rights and client name to confirm. |
| 2 | Chermignon stepping-stone path | 1920×1440 | |
| 3 | Chermignon natural-stone stairs | 1920×1440 | |
| 4 | Chablais Japanese garden | 1600×1200 | Pine on a moss mound. |
| 5 | Chermignon sedum rockery | 1920×1440 | |
| 6 | Villars hot tub facing the Alps | 1024×768 | Upscale candidate. |

Other images worth knowing about:
- **Full-bleed drawing:** the Chermignon working section, `coupes_travail_1_0.jpg` (4795×1600). Ideal for the « Imaginer » plan layer.
- **AI-upscale candidates** (good composition, too small):
  - Zen gravel and pine, Chablais (840)
  - Villars chalet and spa deck (840)
  - « Chantier sans accès » deck (840)
  - Hotel-roof lake view (840)
  - Pool with lake and Alps view, `119_0.jpg` (1280). Shown as the « Piscines » tile, so it could be Magiline marketing.
  - Sunset hot tub over Lake Geneva, `img_0229-modifier…` (1600). It is on the spa partner page, so confirm it is Germa's.

## Before/after (`before-after.json`, copies in `media/before-after/`)

| Pair | Match | Notes |
|---|---|---|
| Saint-Maurice street corner: état initial ↔ projection | Exact | Slider-ready. |
| Saint-Maurice entrance: état initial → projection → réalisation | Approximate | Use as the chapter 05 sequence. |
| Randogne: état initial ↔ projection | Exact | Projection only; no built photo. |
| Monthey park: render ↔ built | Approximate | Largest pair, 3024 px. |
| Gilly stairs | Approximate | |
| Gabion slope | Approximate | |

Three pairs that looked promising were rejected; the reasons are in the JSON.

## Gaps

- No original or high-resolution photography. Hero and full-bleed use need files from Germa, upscaling, or a shoot.
- No project dates, sizes or materials beyond a few words. No testimonials, no team photos, no showroom photos (only its logo).
- No vector master logo without the « 15 ans » badge. Both SVGs carry it.
- No legal pages: no mentions légales and no privacy policy.

## Discrepancies

Full list in `site.json` → `discrepancies`.

- **Showroom phone:** 021 807 19 23 on the showroom page vs 021 802 48 42 for Etoy on the contact page.
- **Etoy reception:** the contact page says « réception sur rendez-vous », but the showroom publishes opening hours. The showroom address is never stated.
- **Geneva office:** Rue de Chantepoulet 10 is listed on the contact page only.
- **"All photos are ours":** the about page says so, but SOKO pergola photos (credited, shot in France), probable Magiline pool marketing and product shots are on the site.
- **Named clients:** Beau-Rivage Palace, Montreux Palace, Hôtel d'Angleterre (Lausanne), Usine Cailler (Broc), Ville de Monthey, Bellossy parking (public tender).
- **English on French pages:** the homepage H1 and a « Request for quotation » button are in English. The header logo still says « 15 ans ».
- **Quote form:** it offers four project types, including « L'entretien de mon jardin ».

## New findings for the pitch

- **Germa already works in 3D.** There are Cinema 4D renders (`c4d_*`), photomontages, sections and plans. Ask for the source files to build the 3D chapter from a real Germa project.
- **The current header logo** (lime bars, white GERMA) is built for dark backgrounds and sits naturally on forest #18352A.
- **Partners:** SOKO (pergolas), Magiline (« distributeur officiel », pools), an unnamed Suisse romande spa leader, and local partners in Greece.
- **Differentiators worth surfacing:**
  - Design fee partly deducted if Germa builds the project.
  - Silent, CO₂-free battery-powered maintenance, which hotels value.
  - The showroom welcomes « particuliers ou architectes ».
- **Drone and video:** a drone aerial (`dji_0074`) and three YouTube videos exist (helicopter soil delivery, Montreux Palace crane).
- **Paid search:** Google Analytics 4 and Fraud Blocker on the site suggest paid search campaigns, so the quote CTA matters.

## Questions for Germa, in priority order

1. Can you send original, full-resolution photos (≥ 3000 px) of your best gardens, especially Chermignon, the Chablais Japanese garden and Villars?
2. Can you send a vector logo without « 15 ans »? Is the bars + GERMA mark the current identity?
3. Do you have the 3D / Cinema 4D / SketchUp source files of a real project (Chermignon or Saint-Maurice) for the animated 3D model?
4. Who owns the Beau-Rivage night photo and other professional shots? Can we use them?
5. May we name Beau-Rivage Palace, Montreux Palace, Hôtel d'Angleterre, Usine Cailler and Ville de Monthey?
6. What are the showroom address and the phone number to publish? Are the hours still current? Is the Geneva office active?
7. Are `119_0.jpg` (pool with lake view), the sunset spa deck and the resin-surface photos your own work, or partner marketing?
8. Can you give the commune, year, materials and one key challenge for each featured project?
9. Do you have drone footage and the original videos (helicopter delivery, Montreux Palace crane)?
10. Which email should receive quotes? Should the English version be kept? Do mentions légales and a privacy policy exist?

## Re-running

```
python3 -I tools/harvest/fetch_pages.py .harvest-cache/urls_round1.txt .harvest-cache/pages
python3 -I tools/harvest/parse_pages.py .harvest-cache/pages .harvest-cache/chantiers.txt tools/harvest/service_families.json content
python3 -I tools/harvest/probe_images.py .harvest-cache/image_paths_priority.txt .harvest-cache/image_probe.tsv
python3 -I tools/harvest/build_inventory.py .harvest-cache content tools/harvest/manual_review.json
python3 -I tools/harvest/stage_media.py .harvest-cache/preview content tools/harvest/manual_review.json
```

All network requests share a cross-process limiter of one request per second. Visual review decisions live in `tools/harvest/manual_review.json`. `.harvest-cache/` holds the raw HTML and preview downloads; treat it as untrusted and don't commit it.
