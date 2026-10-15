# GERMA PAYSAGES — HIGGSFIELD VISUALS

Paste-ready prompts for Higgsfield. Run these **before** `01-build-living-architecture.md`, so the build picks up the approved outputs.

## The one rule

The pitch argument is *« vos réalisations, présentées comme elles le méritent »*. Higgsfield **enhances Germa's real photos**. It never invents a Germa garden.

| Allowed | Not allowed |
|---|---|
| Upscaling Germa photos to hero size | Generating a garden, terrace or project and showing it as Germa's work |
| Subtle motion on a real Germa photo (light, breeze, slow camera) | Adding, removing or reshaping anything built: stone, walls, plants, furniture |
| Animating Germa's own projection → its own état initial | Faces, people, logos, text |
| Generic material close-ups (stone, larch, gravel), labelled as illustrations | Any image flagged `exclude` or `supplier`, `119_0.jpg`, `img_0229-modifier…` (origin unconfirmed) |
| 3D art-direction references that are **never shipped** | Client names or hotel branding in any output |

**Check every output at 100%** before approving it: stone joints, foliage, fence boards, lights, mountain ridgeline, horizon. If anything was invented, reshaped or warped, reject it and regenerate. "Almost right" is not good enough, because Germa will recognise its own gardens.

## Where outputs go

Save every approved file to `content/media/higgsfield/<job-id>/` and add one entry to `content/media/higgsfield/manifest.json`:

```json
{
  "id": "H1-hero-chermignon-path",
  "kind": "upscale | image-to-video | start-end-video | material | reference",
  "source": "content/media/hero/02-9_1.jpg",
  "output": "content/media/higgsfield/H1-hero-chermignon-path/loop.mp4",
  "tool": "Higgsfield — Kling 3.0 image-to-video",
  "prompt": "…exact prompt used…",
  "seed": 123456,
  "date": "2026-10-15",
  "checkedAt100": true,
  "status": "approved",
  "notes": "Slight shimmer on the bollard light at 3s, acceptable."
}
```

Only `"status": "approved"` entries get used by the build. Keep rejected takes out of the repo.

## Models

Higgsfield's model list changes often, so use whatever your plan offers in each category:

- **Upscale:** Higgsfield's upscale app, set to its most faithful option (lowest "creativity", no face enhancement, no extra sharpening).
- **Image-to-video:** Kling 3.0 first (steady camera, supports start and end frames). Veo 3.1 or Seedance 2.0 as alternates. Turn audio **off**.
- **Image:** Seedream 5.0, Nano Banana Pro or Soul. Use Flux Kontext if you need to edit a reference.

Generate 3–4 takes per job and keep the best one. Write the seed down.

---

## U — Upscales (do these first)

Upscaled files become the source for the video jobs. Settings: **2×** (4× for 840 px files), faithful mode, original aspect ratio, PNG out.

| ID | Source | Size → target | Use |
|---|---|---|---|
| U1 | `content/media/hero/02-9_1.jpg` — Chermignon stepping-stone path | 1920 → 3840 | Hero, H1 |
| U2 | `content/media/hero/03-7_1.jpg` — Chermignon stone stairs | 1920 → 3840 | Hero alternate, Réalisations |
| U3 | `content/media/hero/04-plantations-chablais-bonzai-jardin_japonais.jpg` — Chablais pine | 1600 → 3200 | H2 |
| U4 | `content/media/hero/05-12_1.jpg` — Chermignon sedum rockery | 1920 → 3840 | Savoir-faire « Murs & pierre » |
| U5 | `content/media/hero/06-spa_-_villars-sur-ollon_0.jpeg` — Villars spa, Alps | 1024 → 4096 | Savoir-faire « Piscines & spas » |
| U6 | `content/media/creation-dun-jardin-japonais-chablais/photos_chantiers_dom_091.jpg` — zen gravel | 840 → 3360 | Réalisations |
| U7 | `content/media/un-chantier-sans-acces/img_1047_1600x1200.jpg` — terraced larch deck | 840 → 3360 | Savoir-faire « Terrasses » |
| U8 | `content/media/paysagiste-villars-sur-ollon-amenagement-jardin-spa-enrochement/img_1543_1600x1200_1.jpg` — Villars deck | 840 → 3360 | Réalisations |
| U9 | `content/media/before-after/etat_initial_-2_2.jpg` + `projection_-2_2.jpg` — Saint-Maurice corner | 840 → 3360 | Needed for V3 |

If the upscale app accepts a prompt, use:

```
Faithful restoration of a real landscape photograph. Preserve every existing detail exactly: stone shapes and joints, plant species and positions, timber boards, lights, rooflines, mountains. Remove JPEG compression artefacts and noise only. Do not add, invent, sharpen or stylise anything. Natural colour, no HDR look.
```

---

## V — Image-to-video (real photos, subtle motion)

Settings for every V job: **5 s**, 24 fps, 1080p or higher, audio off, **same aspect ratio as the source** (4:3), camera as steady as the model allows.

**For a seamless loop:** if the model supports start and end frames, set the **same upscaled image as both**. Otherwise the build crossfades the ends.

Negative prompt for every V job (paste it wherever the model accepts one):

```
morphing, warping, melting stone, changing shapes, new objects, extra plants, people, animals, birds, cars, text, logos, watermark, camera shake, handheld, fast motion, zoom blur, lens flare, light leaks, colour shift, oversaturation, HDR, CGI look, cartoon, time-lapse, day-to-night change
```

### V1 — Hero loop, Chermignon path  ·  source: U1

```
A real architectural photograph of a finished alpine garden, brought gently to life. Very slow, perfectly steady push-in toward the stepping-stone path, about 4% over the whole clip. Warm late-afternoon light. The lawn and the larch trees stir in a faint mountain breeze. Everything built stays perfectly still and identical to the photo: flagstones, bollard lights, larch fence, chalet. Calm, quiet, premium, photorealistic, true to the original image.
```

### V2 — Hero alternate, Chablais Japanese garden  ·  source: U3

```
A real photograph of a Japanese garden in the Swiss Alps, brought gently to life. Locked-off camera with a barely perceptible slow drift to the right. The cloud-pruned pine stays still, with only its outer needles trembling slightly. Soft high clouds move very slowly across the mountains in the background. Moss, raked gravel and stones stay perfectly unchanged. Serene, contemplative, photorealistic, true to the original image.
```

### V3 — Chapter 05, « de l'idée à la réalisation »  ·  start: U9 état initial  ·  end: U9 projection

Use a model that supports **start and end frames** (Kling). This animates **Germa's own photomontage**, not footage of the build, so the site must caption it as « Projection » and never as a realisation.

```
Fixed camera, no camera movement at all. The bare lawn at the street corner calmly transforms into the planned mineral garden bed: the ground is shaped, natural boulders settle into place, gravel spreads, and ornamental grasses grow up and fill in. The house, street, fence, trees and sky stay exactly identical throughout. Smooth, continuous, architectural, like a design coming to life. Photorealistic.
```

### V4 (optional) — Savoir-faire tile, Villars spa  ·  source: U5

```
A real photograph of a hot tub on a timber deck facing the Alps, brought gently to life. Locked-off camera. Faint steam rises slowly from the water and the water surface ripples very gently. Clouds drift slowly over the peaks. The deck, chalet, rocks and planting stay perfectly unchanged. Late-afternoon mountain light, calm, photorealistic, true to the original image.
```

---

## M — Material plates (illustrations, never projects)

These are for the Showroom chapter (06) and as quiet textures in Savoir-faire (04). The manifest marks them `kind: "material"`, and the site labels them « Illustration matière » in placeholder mode. Settings: **3:2**, highest quality, 4 takes.

Shared style. Add it to the end of each prompt:

```
Editorial architectural material photography, medium-format look, soft raking late-afternoon light from the left, deep but soft shadows, muted natural palette of limestone beige, charcoal and forest green, no objects, no people, no text, no logos, photorealistic.
```

| ID | Prompt |
|---|---|
| M1 Pierre | `Top-down close-up of split natural stone flagstones from the Valais Alps, grey-green gneiss with irregular joints filled with fine gravel, subtle mineral sparkle.` |
| M2 Mélèze | `Close-up of weathered Swiss larch decking boards, silver-brown patina, fine grain and small knots, crisp shadow lines between the boards.` |
| M3 Gravier | `Top-down close-up of freshly raked pale gravel in parallel lines, with the edge of one dark rounded boulder entering the frame.` |
| M4 Mur sec | `Close-up of a dry-stone retaining wall in irregular natural stone, tight hand-fitted joints, a few tufts of sedum growing in the gaps.` |
| M5 Graminées | `Close-up of ornamental grasses (Miscanthus, Stipa) backlit by low sun, soft focus background in sage green and limestone tones.` |

---

## R — 3D art-direction references (never shipped)

These are visual targets for chapter 02 « la maquette d'architecte ». They go in `content/reference/maquette/`, stay out of `public/`, and the site never displays them. Use `content/media/architecture-paysagere-et-amenagement-du-jardin-dun-chalet-de-maitre-chermignon/coupes_travail_1_0.jpg` (Germa's own section drawing) as the image reference if the model accepts one. Settings: **16:9**, 4 takes each.

Shared base. Put it first in each prompt:

```
Photograph of a physical architect's study model of a contemporary garden on a gently sloping alpine plot in Valais, Switzerland. Contour-stepped terrain, a natural-stone retaining wall, a stone path, a terrace and a slim pergola frame. Abstract model trees made of spheres, cones and fine wire, like a professional landscape architecture maquette. The model sits on a warm limestone-coloured table (#F3F0E6) with a seamless matching background. Long lens, ¾ view from slightly above, crisp precise craftsmanship, shallow depth of field.
```

| ID | Phase | Add to the base |
|---|---|---|
| R1 | Imaginer | `Top-down view. Only the blank plaster terrain, with the garden plan drawn on it in fine dark ink lines: path, terrace outline, planting beds. Nothing extruded yet.` |
| R2 | Concevoir | `Entirely monochrome white plaster and basswood. Terrace, wall, steps and pergola extruded as clean volumes. Cool neutral light.` |
| R3 | Réaliser | `Materials appear: grey stone wall, warm timber terrace and pergola, pale gravel path. Model trees and grasses in place, still slightly abstract.` |
| R4 | Faire vivre | `Fully coloured and alive: sage and forest-green planting, ornamental grasses, warm golden late-afternoon sunlight with long soft shadows.` |

---

## Order of work

1. U1–U9 (upscales), checked at 100%.
2. V1 and V3. These two carry the pitch. Then V2 and V4 if time allows.
3. M1–M5.
4. R1–R4.
5. Fill in `manifest.json`, then commit `content/media/higgsfield/` and `content/reference/`.

Approximate budget: about 9 upscales, 4 videos × 4 takes and 9 images × 4 takes. Check your credit balance before the video jobs, because they cost the most.
