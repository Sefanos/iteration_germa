# Design package, Germa Paysages v2 · « Du trait au jardin »

Written before the build, consumed by it. Every viewer-facing line below ships verbatim. Band ranges are starting points, validated by the flick test. Scope of the checkpoint: sections 1 to 5 of this file and the hero (band map, static hero, line plan, engineering list) built; the outline in section 6 is written here and built only after approval.

## 1. The brand premise

Every Germa garden starts as a line on a plan. An architect draws the path, the terrace, the wall; the drawing becomes plaster volumes in a study model; the model becomes stone, larch and gravel laid by Germa's own teams; then the garden lives. The site teaches that one idea, « Du trait au jardin », with one continuous ink line that draws itself down the whole page, and sells one action: talk to Germa about a project. Every section is a state of the same line: plan, model, built garden, material, contact.

## 2. The palette as CSS tokens

Sampled from the maquette footage (first frame background `#d9d1c6`, final frame table `#dabc9f`) and from the materials of an architect's model: plaster, graphite pencil, ink, moss. The brand's own lime is kept as a rare signal.

```css
:root{
  --canvas:#D3CFC6;        /* plaster grey, the page and the model's table; never cream, never white */
  --panel:#E2DED6;         /* a lighter plaster sheet: boards, raised surfaces */
  --panel-edge:#B9B4AA;    /* board edges and interface borders, 3.1:1 on canvas */
  --ink:#15171A;           /* text and the drawn line, 11.6:1 on canvas */
  --graphite:#383C39;      /* secondary text, 7.2:1 on canvas */
  --moss:#1E2D24;          /* dark sections: showroom, header bar */
  --moss-text:#D3CFC6;     /* text on moss, 9.3:1 */
  --moss-secondary:#B9BDB4;/* secondary on moss, 7.3:1 */
  --accent:#95C11F;        /* Germa lime: the CTA fill (ink label, 8.3:1) and the line's moving tip on moss only */
  --accent-hover:#A6D02F;
  --accent-muted:rgba(149,193,31,.18);
  --text-primary:var(--ink);
  --text-secondary:var(--graphite);
}
```

Contrast is computed, not guessed: ink on canvas 11.6:1, graphite on canvas 7.2:1, canvas text on moss 9.3:1, moss-secondary on moss 7.3:1, ink on lime 8.3:1, panel-edge on canvas 3.1:1 (borders only). No terracotta, no sage, no serif.

Said out loud: the first build used the « cream canvas, serif, terracotta » look that the design direction bans as a default reach. This package drops it for the model's own world.

## 3. The type trio

- **Display:** Schibsted Grotesk, weights 500 and 700. A Scandinavian grotesk with a Swiss skeleton and real character in the a, g and t. Headlines, phase words, section titles.
- **Body:** Instrument Sans, weight 400 and 500. Quiet, open, built for text.
- **Mono:** IBM Plex Mono, weight 400 and 500. Architect-drawing annotations only: sheet numbers (« PL-01 »), communes, « Coupe A–A », hours. Never a fact that is not in `/content`.

All three self-hosted through `next/font` with `display: swap`.

## 4. The band map

The hero is the existing maquette sequence (147 WebP frames: plan → white volumes → materials → light → living loop), scrubbed by native scroll in a pinned 860vh hero on desktop (760vh of scroll range, so 0.15 of progress is about 114vh and each plateau holds about 85vh). Frames map to progress 0 to 0.80; from 0.80 the last frame holds while the page settles and wipes. Text lives in the left column (x 96 to 640 px at 1440), which is the footage's plain plaster background in every frame; the model sits centre-right.

| Band | Range (starting point) | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.15 | The ink plan on the bare plaster slab | mono « PL-01 · Plan » · « Imaginer. » · « Tout commence par un trait sur un plan. » | Pen-write: characters appear in reading order, as the plan draws itself |
| 2 | 0.17 to 0.32 | White volumes rise from the drawing | mono « Coupe A–A » · « Concevoir. » · « Le trait devient volume : mur, escalier, terrasse, pergola. » | Rise: words lift 18 px into place, echoing the volumes extruding |
| 3 | 0.34 to 0.49 | Stone, timber and gravel resolve | mono « Matériaux » · « Réaliser. » · « Pierre, mélèze, gravier : nos équipes posent chaque pièce. » | Resolve: blur-to-sharp crossfade, echoing materials coming into focus |
| 4 | 0.51 to 0.64 | Warm light sweeps across, grasses stir | mono « Saisons » · « Faire vivre. » · « Puis le jardin vit, et nous l’entretenons. » | Sweep: characters brighten left to right, echoing the raking light |
| 5 settle | 0.66 to 0.82 | The living model at rest | mono « Germa Paysages · Monthey · Etoy » · « Des extérieurs qui prennent vie. » · CTA « Parler de mon projet » | Word-by-word rise, then the CTA: a staged settle |
| 6 wipe | 0.84 to 1.00 | The line pulls a contour across the stage; the real Chermignon garden fills in behind it | mono « Chermignon (VS) · Jardin d’un chalet de maître » · « La maquette devient un vrai jardin Germa. » | Follow: the line slides in along the line’s direction, one beat behind the wipe |

Band 1 skips its ease-in and carries a one-time load ramp; band 6 skips its ease-out. Ramps: `f = min(0.02, (b − a) / 3)` with smoothstep. Plateaus at about 85vh each; the flick test (120, 240, 360 px) decides whether any two beats merge.

## 5. The static-hero copy block

Phones, portrait tablets, coarse-pointer portrait, landscape phones and reduced motion get the composed still: the last frame of the sequence as the poster, then the words on the canvas beneath it.

- mono « PL-01 · Du trait au jardin »
- Headline: « Des extérieurs qui prennent vie. »
- Subline: « Du trait au jardin : nous concevons, réalisons et entretenons vos extérieurs, en Valais et sur Vaud. »
- CTA: « Parler de mon projet »
- Secondary link: « Voir nos réalisations »

## 6. The below-fold outline (built after approval)

Every section funnels to one anchor, `#contact`, where the line ends under « Demander un devis ». No two neighbours share a skeleton. The tagline « La nature prend forme. » appears once, in section 6.

**2 · Réalisations, les planches.** A pinned horizontal track on desktop driven by vertical scroll (six boards slide past, the line runs along the top edge as a site-plan boundary), a vertical stack on mobile. Kicker mono « Planches 01–06 ». Title « Six planches, six jardins. » Each board: photo, mono annotation, title, commune where known, link « Voir le projet » to the legacy page.
- 01 · « Jardin d’un chalet de maître » · mono « Chermignon (VS) · Conception, aménagement »
- 02 · « Création d’un jardin japonais » · mono « Chablais (VS) · Massif minéral »
- 03 · « Jardin, spa et enrochement » · mono « Villars-sur-Ollon (VD) · Spa, pierre »
- 04 · « Un chantier sans accès » · mono « Terrasse et soutènement en mélèze »
- 05 · « Mur en pierre de St-Léonard » · mono « Mur et terrasse en pierre naturelle »
- 06 · « Entrée de maison » · mono « Saint-Maurice (VS) · Conception »
Photos never display above 1.25× native size unless they are approved Higgsfield upscales; the six featured photos (five at 840 px) are upscaled faithfully first, with costs preflighted and the total kept under 100 credits.

**3 · Savoir-faire, the index.** A typographic index 01 to 06: large numbers in the display face, one line each, an image preview that appears on hover and, on touch, as the row scrolls into view. No photo blocks.
- 01 Conception · « Plans à la main, sur informatique ou en 3D ; une partie de la conception est déduite si nous réalisons les travaux. »
- 02 Aménagement et plantation · « Terrassement, gazon, massifs, arrosage, clôtures et végétaux plantés avec garantie de reprise. »
- 03 Terrasses et pergolas · « Bois naturel ou WPC, dallages, escaliers, pergolas bioclimatiques. »
- 04 Murs, enrochements et pierre · « Soutènement, enrochements, gabions, pierre naturelle au sol et en façade. »
- 05 Piscines, spas et bassins · « Piscines Magiline, spas fournis et posés, biotopes et fontaines. »
- 06 Entretien · « Taille, élagage, soins au gazon, contrats annuels, machines à batterie sans bruit ni CO₂. »
Each row links to its legacy service page.

**4 · Du plan au jardin.** The real-world proof: the Saint-Maurice sequence from `content/before-after.json`, three states side by side, the line passing through all three. Kicker mono « Saint-Maurice (VS) · Entrée de maison ». Title « Le même trait, trois états. » Captions: « État initial », « Projection », « Réalisation ». Note: « La projection est un photomontage d’étude ; la réalisation est le jardin construit. » Link « Voir le projet ».

**5 · Showroom Etoy.** On moss. The material wall: M1 (pierre naturelle) and M2 (mélèze) as two plates, the line’s tip turns lime here. Kicker mono « Etoy (VD) · Showroom ». Title « Toucher la matière. » Body: « Un espace dédié à nos produits d’exposition, pour vous projeter concrètement et discuter de vos attentes avec notre équipe, que vous soyez un particulier ou un architecte. » Hours in mono: « Mercredi 13h30 – 17h30 », « Jeudi et vendredi 09h30 – 17h30 », « Samedi 10h – 16h30 », « Sur rendez-vous 021 807 19 23 ». CTA « Visiter notre showroom ».

**6 · Contact.** The line arrives and ends under the button. Kicker mono « Monthey · Etoy · Genève ». Title « La nature prend forme. » CTA « Demander un devis » (legacy quote page). Then « 024 471 25 78 », « secretariat@germa-paysages.ch », and the three locations from `site.json` in mono. Footer line: « © 2026 Germa Paysages Sàrl. Paysagistes depuis 2009. » plus Facebook, Instagram, LinkedIn.

Form: none on the pitch build; the CTA links to the existing quote page, said plainly. Interactive moment: deliberately none beyond the line and the horizontal track, because the brief asks for one idea and no added effects. Said out loud as a deviation from the template.

## 7. The vector layer plan (the line)

One hand-drawn SVG path, ink, 2 px, slight wobble, drawn by `stroke-dashoffset` from scroll progress. It is the only bold element.

- **Hero, bands 1 to 5:** the stem. Starts under the mono kicker as a pen touch, runs down the left margin of the text column, and curls under the CTA at the settle.
- **Hero, band 6:** the contour. From under the CTA a horizontal stroke extends right and pulls a wavy vertical contour across the stage; the real Chermignon photo is revealed to the left of the contour (clip-path polygon that follows the same curve). The model becomes a real Germa garden.
- **Section 2:** the line runs along the top edge of the horizontal track as the site-plan boundary and frames each board.
- **Section 3:** the line steps down the index, one tick per number.
- **Section 4:** the line passes through the three Saint-Maurice states as the terrain contour.
- **Section 5:** on moss, the line’s moving tip is lime.
- **Section 6:** the line ends in a small closed loop under « Demander un devis ».

Reduced motion: the line is shown fully drawn, the wipe complete, drives stopped. No particles, no grain, no second environment layer: the plaster canvas is the environment.

## 8. The engineering list

- Frame-sequence scrub instead of a video Blob (deviation, said out loud: the approved sequence already exists as 147 WebP frames, which scrub deterministically with no seek gating). Frames load progressively, first and last frame first; the poster (last frame) paints first and stays under the canvas; the page is complete without the frames.
- dt-normalised lerp in a rAF loop that rests when converged and when the hero is off-screen.
- Delta-gated DOM writes: band opacity and `--k` written only on change (0.008), line offset and wipe polygon only on change.
- Band pacing in scroll distance with the flick test at 120, 240 and 360 px.
- The four-layer legibility system in its light variant (plaster scrims for ink text): base radial scrim, per-band radial scrim riding `--k`, a light three-layer text shadow, chip scrims for mono labels. Worst-frame audit at 3.5:1 or better per band, measured in a real browser with the glyphs hidden.
- The five static-hero gates, identical in CSS and JS, decided live with change listeners.
- Native scrolling only, `overflow-x: clip`, semantic landmarks, skip link, `:focus-visible` in lime on moss and ink on canvas, 44 px touch targets.
- WCAG AA on every text element, verified with axe-core colour-contrast: zero violations.

## 9. The copy gate line

Every viewer-facing line above ships verbatim. Before anyone sees the page, grep the built HTML for em dashes and for the stock words (leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions) and sweep the body copy for AI tells; both searches return zero. The designed phase words « Imaginer. Concevoir. Réaliser. Faire vivre. » are a brand device and stay.
