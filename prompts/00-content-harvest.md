# GERMA PAYSAGES — CONTENT HARVEST

Run this before the build prompt. **Do not write any website code in this step.**

## Goal

Build a local, structured content pack in `/content` from the existing website https://www.germa-paysages.ch/fr. The build step uses this pack as its only source of truth. When the pack is ready, a human reviews it before the build starts.

## What we already know (audit of 2026-10-15)

- The site runs on Drupal 9. The sitemap at https://www.germa-paysages.ch/sitemap.xml lists about 948 URLs: about 483 in French and 465 in English.
- The French site has 44 service pages under `/fr/prestations/…`. It has about 83 "chantiers de A à Z" listed on `/fr/chantier`, and about 430 project pages in total, most of them listed on `/fr/nos-realisations`.
- Project pages have many photos (usually 10–25) and little text (0–25 words). Titles often include the town (Chermignon, Villars-sur-Ollon, Saint-Sulpice, Monthey, Le Bouveret, Broc…).
- Images are small. Most are 840–1200 px wide, a few go up to about 1600 px, and the quality varies a lot. A handful look professional; most are documentation shots taken on site.
- Some images are Facebook re-uploads (numeric filenames like `19025083_…_o.jpg`).
- Some images are supplier marketing photos, for example the Soko pergola images (`…_c_soko_-_f._pieau…`) shot in Ploërmel, La Roche-sur-Yon and Aizenay in France. These must never be shown as Germa work.
- Some files are named `avant…` / `apres…`, and there are "Projection 3D" pages (`/fr/projection-3d-de-projets-dinstallation-de-pergolas-bioclimatique`, `/fr/projection-damenagements-paysagers-dune-entree-de-maison-randogne`). These are candidates for before/after pairs.
- The logo's brand green is `#95C11F`. The header uses a "15 ans" anniversary logo (`/core/themes/germa/germa_15ans.svg`), which is out of date.
- The existing quote form is at `/fr/devis`. Its fields are nom, prénom, adresse, NPA, ville, tel, e-mail, plus a choice between "la conception", "l'aménagement ou la rénovation de mes extérieurs" and "ou encore…".
- Three YouTube videos are embedded on `/fr/videos`.

## Crawling rules

- Crawl French pages only.
- Respect robots.txt. Send a clear User-Agent and make at most 1 request per second.
- Never submit a form. Never visit `/admin`, `/user` or `/search`.
- Copy text verbatim. Don't correct, rewrite or translate it. Record typos and quality problems in the audit instead.
- Don't download all ~1,400 images. Record every image's URL and dimensions in the inventory, and download full files only for the shortlist (step 5).
- Put the crawler script in `tools/harvest/` so it can be run again.

## Outputs

1. **`content/site.json`** with:
   - Legal name and founding year.
   - Each location: address, role, phone and fax.
   - Showroom: opening hours, phone, and address if one is published.
   - Email, social links, YouTube video IDs.
   - URLs of the quote, showroom and contact pages, and the sister site https://www.mapergolabioclimatique.ch.
   - Brand colour and logo files.
   - A `discrepancies` array (see below).
   - `"permissions": { "clientNamesConfirmed": false, "photoRightsConfirmed": false }`.
2. **`content/services.json`** with all 44 services: slug, title, legacy URL, verbatim text, image URLs, and a proposed `family`. The family is one of:
   `conception` · `amenagement-plantation` · `terrasses-pergolas` · `murs-enrochements-pierre` · `piscines-spas-bassins` · `entretien`
3. **`content/projects/index.json`**, plus **`content/projects/<slug>.json`** for every chantier listed on `/fr/chantier`, with:
   - Title and legacy URL.
   - Location, only if the title or text states it.
   - Verbatim text and linked services.
   - Images, each with URL, width, height and flags.
4. **`content/IMAGE_INVENTORY.csv`** with the columns `url, page, width, height, bytes, flags, notes`. The flags are:
   - `low-res` (< 1200 px)
   - `facebook`, `supplier`, `exclude`
   - `before`, `after`, `3d-projection`
   - `pro` (looks professionally photographed)
5. **Shortlist.** Open the photos and look at them yourself. Choose:
   - 8–10 candidate featured projects.
   - 6 candidate hero images.

   Score each on resolution, light, composition, whether the work looks finished (no construction mess) and how well it fits a premium "Living Architecture" direction. Set `featured: true` on the best 6 projects. Download the full files for the shortlist into `content/media/<project-slug>/`, and the hero candidates into `content/media/hero/`.
6. **`content/before-after.json`** with verified pairs only: same place, same or similar angle. Include any pair of a 3D projection and the finished garden.
7. **`content/brand/`** with the logo SVGs (the standard version if one exists, and the "15 ans" version) and the favicon.
8. **`content/CONTENT_AUDIT.md`**, no more than two pages, with:
   - Inventory counts.
   - The shortlist with reasons.
   - Content gaps.
   - Discrepancies.
   - Excluded material.
   - A prioritised list of questions for the client.

## Discrepancies to record (plus any others you find)

- The showroom page gives phone 021 807 19 23. The contact page gives 021 802 48 42 for Etoy.
- The contact page describes Etoy as a "site de production, réception sur rendez-vous", while the showroom page publishes opening hours. Is the showroom at Route du Stand 31?
- The contact page lists a Geneva office (Rue de Chantepoulet 10). The rest of the site only mentions Monthey and Etoy. Is that office still active?
- The about page says every photo shows Germa work, but supplier photos are on the site.
- Named clients appear on the site, such as Beau-Rivage Palace, Usine Cailler and Ville de Monthey. Can they be featured prominently?
- Who owns the rights to the professional-looking photos (for example the Beau-Rivage Palace night shot): Germa, or the client's photographer?

## Done when

Every output above exists and is valid JSON or CSV. Finish by printing a short summary: counts, the featured shortlist, the hero candidates, and the 10 most important open questions.
