# Germa Living Garden · creative and technical plan

Status: built 2026-10-16. Pass 3 the same day (complete, 304 frames, chapters film 0–79, explore-pool 80–135, explore-terrace 136–191, explore-hold 192–247, explore-evening 248–303; hovering an index row eases the walk to the moment that shows that métier): one canvas behind the whole page (the hero film continues below the fold as chained exploration clips E1–E4 of the same garden: descent to the pool, along the terrace to the pergola, a hold at the pool edge, evening falling), no arrival zoom, no second environment canvas, so no seam at the hero handoff. Six aerial clips of another villa found in the Higgsfield account (A1–A6) were reviewed and kept as motion references only. Pass 2: no boxed text anywhere (edgeless veils under type, light type on the dark half), continuous micro-animations (contour layer, light drift, sun arc in the nav, plan symbols drawn per métier, outlined index numbers, board tilt and hatch, typed annotations, drawn underlines, CTA wipe, dusk lights with flicker, outlined marquee, surveyor cursor), and the hero handoff in layers. Deviations from the plan, decided with the user: clips kept at 720p (no 1080p pass), no AI living loop (atmosphere in CSS: a slow breath on the finished garden, a light sweep at the reveal, dusk crossfade), five beats instead of six (« Un terrain » merged into « Imaginer »), hero 420vh.

Original plan text follows.

Status (original): plan for approval, 2026-10-16. Nothing in this document has been generated or built yet beyond the two locked frames already in `pitch/v2/villa/` (start B, end B). Decisions carried in from the review: generated content is fine and is shown as a vision; the maquette film leaves the homepage; one continuous transformation built from controlled milestones; Wan 3.0 first; 300 to 400vh hero.

## 1. The visitor journey

One place, one scroll, no cut. The visitor is standing on a Vaud hillside above Lake Geneva, in front of a contemporary villa, and watches Germa make its garden. Then they walk through the finished garden while reading about Germa, and they leave by asking for a quote.

| Scroll (desktop, 360vh hero) | What the visitor sees | What they can do |
|---|---|---|
| 0 | Wide view of the villa and the bare plot, lake and Alps behind. Nav bar and « Parler de mon projet » already present and fixed. A pen-touch line under the kicker « PL-01 · Du trait au jardin ». | Click any nav anchor or the CTA at once. The film is never a gate. |
| 0 to 12% | **Arrival.** The view glides in: a slow push toward the terrace edge, the horizon settling. Done in code on a wider frame, no extra video. | |
| 12 to 20% | **Discovery.** The camera settles on the locked composition: graded earth, stakes, string, a gravel pile. First beat: « Imaginer. » | |
| 20 to 80% | **Transformation.** Scrubbed forward and backward with the scroll: terrain shaped, stone wall and terrace, pool dug and filled, pergola raised, planting grown in, light warming. Beats « Concevoir. », « Réaliser. », « Faire vivre. » | |
| 80 to 100% | **Reveal.** The finished garden at rest, water and leaves alive. « Des extérieurs qui prennent vie. » and « Parler de mon projet » land in the clear left third. The hero unpins. | CTA to contact |
| after | **Exploration.** The finished garden stays as the environment behind everything, and each section changes it: dims, moves, zooms, turns to evening. Sections: Réalisations, Savoir-faire, Du plan au jardin, Showroom, Contact. | Projects, services, showroom, quote |

Phones: the same place in a lighter form. The arrival is a short code-driven settle on the finished still, the four beats read as a vertical sequence of stills (K0, K2, K4, K6) revealed with soft wipes as you scroll, and the environment behind the sections is the finished frame, dimming to evening. Reduced motion: finished frame, words in place, nothing moves.

## 2. Visual storyboard

**Composition (locked).** End frame B. Camera elevated three-quarter view from the lower lawn looking up toward the villa; villa and pool centre-right; the left third is lawn and gravel foreground, calm, where every line of text lives. Lake and Alps across the top third. Late-afternoon light from the right. Start frame B keeps the identical camera, villa, trees, lake, sky and light.

**Milestones.** Each is a still, edited from the locked frames so geometry cannot drift. They are the keyframes of the film and the fallback if video fails.

| Key | Stage | What changes from the previous key | Beat on screen |
|---|---|---|---|
| K0 | Discovery | Bare meadow, graded earth, stakes and string, gravel pile (exists: start B) | « Imaginer. » · « Tout commence par un trait sur un plan. » |
| K1 | Terrain | Earth cut into two level terraces, the pool footprint excavated, string lines gone, formwork edge visible | |
| K2 | Stone and terrace | Dry-laid stone retaining wall complete, stone terrace paving laid, steps between levels | « Concevoir. » · « Le trait devient volume : mur, terrasse, escalier. » |
| K3 | Pool | Pool shell finished, coping laid, water filling (half) | |
| K4 | Pergola | Pool full and still, pergola frame standing, gravel path laid | « Réaliser. » · « Pierre, mélèze, eau : nos équipes posent chaque pièce. » |
| K5 | Planting | Lawn, grasses, shrubs, young trees in place, mulch beds | |
| K6 | Reveal | Fully grown planting, warm raking light, long shadows (exists: end B) | « Faire vivre. » then the headline and CTA |
| K7 | Evening | K6 at dusk: sky amber to blue, warm light under the pergola, pool lit from below | Used only behind Showroom and Contact |
| W0 | Arrival | K0 outpainted about 30 percent on all sides: more sky, more lawn, more of the villa's surroundings | The code zooms from W0 to the K0 crop |

**Lighting arc.** Neutral afternoon from K0 to K4, warming through K5 to the golden K6, then dusk in K7. The arc is written into the keyframe edits so the video only has to interpolate.

**Motion between keys (the film).** Three clips, each with its start and end frame locked: K0 to K2, K2 to K4, K4 to K6. Each about 4 seconds, joined with a single encode. Total about 12 seconds, mapped to scroll 20 to 80 percent. The construction reads as time-lapse: walls rise course by course, water rises, the pergola assembles, plants grow. Nothing flies in; the camera never moves.

**Living reveal.** One loop of K6 to K6: water moving, leaves stirring, light shimmering. Plays in place at the settle and under the first section.

## 3. Section integration (the garden reacts)

One fixed environment layer sits behind the whole page: a canvas showing the finished garden (K6, and K7 for the evening). A single GSAP timeline, scrubbed by scroll across the whole page, drives its transform, exposure, blur and the K6 to K7 crossfade. Every section changes the garden differently, and none of them stacks the same skeleton as its neighbour.

- **Réalisations.** The garden recedes: it darkens about 35 percent and softens (a prerendered blurred copy crossfades in), and drifts slowly back (scale 1.0 to 0.96). Real Germa photos come forward as six boards on a horizontal track driven by vertical scroll on desktop, a vertical stack on mobile. The ink line is the site-plan boundary along the track. A small mono note: « Les photos ci-dessous sont des réalisations Germa. Le jardin du film est une vision. »
- **Savoir-faire.** The garden comes back sharp, and the layer pans and zooms toward the element each row names: the stone wall for Murs et pierre, the pool for Piscines et spas, the pergola and terrace for Terrasses et pergolas, the planting for Aménagement, the whole view for Conception, the lawn for Entretien. Six rows of large type, no cards, no photo blocks. The zoom targets are stored as crop boxes in the K6 2k frame.
- **Du plan au jardin.** The garden pulls back to the full view and dims a little. The Saint-Maurice état initial, projection, réalisation sequence sits on it, the line passing through the three states as a contour. Caption: « La projection est un photomontage d’étude ; la réalisation est le jardin construit. »
- **Showroom.** The light goes to evening: K6 crossfades to K7 over the section's approach, the pergola lights come on. Material plates M1 and M2 sit in the foreground, hours and phone in mono, and the lime CTA « Visiter notre showroom à Etoy ». The line's tip turns lime here.
- **Contact.** Dusk holds. The garden is still, exposure down a touch for legibility, the words « La nature prend forme. » and « Demander un devis », phone, email, the three locations. The ink line ends in a closed loop under the button.

Legibility rule everywhere: text over the environment gets the four-layer system (base scrim, per-section scrim, text shadow, chips for mono) and the worst-frame audit at 3.5:1 or better; axe colour contrast at 0 violations on the whole page.

## 4. Asset generation plan

What is generated, what is code, and how consistency holds.

| Asset | Method | Takes | Est. credits |
|---|---|---|---|
| K0, K6 | Done (start B, end B) | | 0 |
| K1 to K5 | GPT Image 2.5 edits from K6 (for built elements) and K0 (for terrain), each prompt naming exactly what exists and what does not yet | 2 each | about 40 |
| K7 evening | GPT Image 2.5 edit of K6 | 2 | about 8 |
| W0 wide arrival | Higgsfield outpaint of K0 | 1 to 2 | about 4 |
| Clips K0→K2, K2→K4, K4→K6 | Wan 3.0, first and last frame, 4 s, 720p for the test, 1080p for the keep | 1 test, then 1 per clip, re-rolls as needed | 14 to 28 each; about 90 for a clean pass, 180 with re-rolls |
| Living loop K6→K6 | Wan 3.0 (or Kling 3.0 pro, which held still well before) | 1 to 2 | 28 to 56 |
| Everything else (arrival zoom, section pans, dims, blurs, evening crossfade, the ink line, wipes) | Code | | 0 |

Planned total about 170 credits for a clean pass, under 300 with re-rolls, from 790 available.

**How consistency is kept.**
- Every keyframe is an edit of a locked frame with the camera, villa, trees, lake and sky named as unchanged. Start B already proved this works: the villa did not move.
- Before any video, the keys are laid in a flip-book contact sheet and the villa and horizon region is diffed frame to frame (edge overlay and PSNR on the villa box). A key that moves the roofline, pool outline or pergola footprint is re-rolled before it costs video credits.
- Each clip is pinned at both ends, so the model can only invent the middle, and the middle is a construction time-lapse, which forgives texture changes.
- Seams land inside motion (water rising, plants growing), never on a rest state, and the three raws are joined in one encode.

**If video fails.** If two Wan rounds and one Seedance round cannot keep the geometry, the hero becomes the hybrid: the eight keys scrubbed as a sequence with masked wipes that follow the construction order (the wall wipes up course by course, the pool fills with a horizontal wipe, planting grows with a soft radial reveal), plus the living loop on K6. It uses the same scrubber and costs no further credits.

The maquette film (C1 to C4, 147 frames) leaves the homepage. It is kept in `content/media/higgsfield/` for a behind-the-scenes or project-detail page later.

## 5. Technical architecture

- **Scrub engine.** Canvas frame sequence, which this project already runs (`components/maquette/Sequence.tsx`): deterministic forward and reverse scrubbing, no seek gating, no keyframe-interval problems. The joined 12 s film is exported at 10 fps, about 120 frames, WebP at 1920 and 960 px. Budget about 9 MB desktop, 3 MB mobile, loaded progressively (first, last, then in order) only once the page is open, poster first. A scroll-controlled MP4 with all-intra keyframes stays as a documented alternative; it is not needed while the frame route holds.
- **Hero.** Pinned 360vh on desktop (prototype at 300 and 400 and pick by feel). Progress 0 to 0.2 drives the arrival zoom on W0 (transform only), 0.2 to 0.8 drives the frame index, 0.8 to 1 holds K6 while the words settle and the living loop fades in. Lerp with the dt-normalised rAF loop that rests; delta-gated DOM writes; band pacing in scroll distance with the flick test.
- **Environment layer.** One `position: fixed` canvas behind the page drawing K6 (2k) with a transform (pan and zoom), an exposure multiplier, and crossfades to a blurred K6 and to K7. Driven by one page-level GSAP ScrollTrigger timeline scrubbing a plain state object; the canvas redraws only when the state changes. This is cheaper and steadier than CSS filters on a fixed image.
- **Sections.** Native scroll. Réalisations is the only other pin (horizontal track on desktop). Reveals are opacity and transform only. The ink line is one SVG path per section, drawn by dash offset, measured from the live layout.
- **Mobile.** Static-hero gates as before (phones, portrait tablets, coarse portrait, landscape phones, reduced motion). On phones the hero is W0 to K6 as a short code-driven settle plus the four key stills, and the environment layer is K6 to K7 without pans. Verified on a real phone before sign-off.
- **Performance.** Frames out of the initial bundle, poster as the LCP image, pans and dims on the compositor, rendering paused off-screen, delta gating everywhere. Lighthouse mobile budget LCP 2.5 s, CLS 0.1.
- **Accessibility.** Real DOM text for every beat, landmarks, skip link, 44 px targets, focus visible, full reduced-motion variant, axe at 0.

## 6. Production sequence (validate before spending)

1. **Lock the frames.** You confirm start B and end B as K0 and K6 (or pick A). No cost.
2. **Keys K1 to K5, K7, W0.** About 50 credits. Flip-book contact sheet and villa-region diff. You approve the set.
3. **Hybrid prototype in code.** The eight keys scrubbed with construction wipes, the arrival zoom, the environment layer reacting to the sections. No credits. This proves the journey and the pacing before any video, and it is the fallback if video fails.
4. **One Wan test clip.** K0 to K2 at 720p, about 14 credits. Gate: villa, roofline, pool outline and pergola footprint unchanged at start, middle and end; construction reads as time-lapse; no camera drift. You watch it.
5. **Remaining clips and the living loop.** About 70 to 110 credits at 1080p, each gated the same way. Seedance only if Wan fails the gate twice.
6. **Join and export.** Single-encode concat, frame export, poster.
7. **Swap frames into the prototype**, tune the beat map with the flick test, run the worst-frame audit and axe.
8. **Self-test and record.** Screenshots at 1440 and 390, a 40 s scroll recording, the full checklist, real-phone check.

Each step ends with something you can look at, and no step spends credits on something the previous step has not validated.
