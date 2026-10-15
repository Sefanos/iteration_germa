# GERMA — MVP LANDING PAGE

Build **one page**: a working homepage prototype for Germa Paysages Sàrl (Swiss landscaper, https://www.germa-paysages.ch/fr). The goal is to see the new direction quickly. Not the whole site.

## Stack
Next.js (App Router, TypeScript), Tailwind CSS v4, GSAP (ScrollTrigger, SplitText) via `@gsap/react`. No 3D, no CMS, no backend.

## Content
Everything comes from `/content`. Read `content/CONTENT_AUDIT.md` first, then `site.json`, `services.json`, `projects/` (the `featured: true` ones) and `media/`. Never invent facts, projects, numbers or reviews. Use Germa's real photos only. If `content/media/higgsfield/manifest.json` exists, you may use its `approved` entries (upscaled photos, hero video loop).

## Identity
- Concept « Living Architecture ». Tagline « La nature prend forme. »
- Editorial, asymmetric, generous whitespace, large photography. No cards grid, gradients, glassy UI or icon sets.
- Colours: Forest `#18352A`, Charcoal `#242823`, Limestone `#F3F0E6` (background), Sage `#A9B9A4` (surfaces only), Terracotta `#B47D5C` (accents), Germa lime `#95C11F` (logo and small details only).
- Type: Instrument Serif (display, weight 400 + italic) and Manrope (text), via `next/font`.
- Logo: `content/brand/germa-logo-header-15ans.svg` on forest. French typography (« », ’, narrow no-break space before `; : ! ?`).

## Step 1: Generate visuals with Higgsfield (MCP)

The Higgsfield MCP is connected. Use its tools **before** building. Pass source images by their public URL (the `sourceUrl` in `content/media/hero/hero-candidates.json` or `content/IMAGE_INVENTORY.csv`).

**Rule:** Higgsfield animates Germa's **real** photos. Never generate a garden, terrace or project and present it as Germa's work. No people, text or logos in any output.

| ID | Job | Source | Prompt |
|---|---|---|---|
| H1 | Hero loop: image-to-video, Kling 3.0 (Veo 3.1 if unavailable), 5 s, source aspect ratio, audio off. Use the same image as start and end frame if the model supports it. | `https://www.germa-paysages.ch/sites/default/files/2023-04/9_1.jpg` (Chermignon path) | *A real architectural photograph of a finished alpine garden, brought gently to life. Very slow, perfectly steady push-in toward the stepping-stone path, about 4% over the whole clip. Warm late-afternoon light. The lawn and larch trees stir in a faint mountain breeze. Everything built stays perfectly still and identical to the photo: flagstones, bollard lights, larch fence, chalet. Calm, premium, photorealistic.* |
| M1 | Material plate for the showroom section: text-to-image, 3:2 | none | *Top-down close-up of split natural Valais stone flagstones, grey-green gneiss with irregular gravel joints. Editorial material photography, soft raking late-afternoon light, muted limestone, charcoal and forest-green palette, no objects, no people, no text.* |
| M2 | Material plate: text-to-image, 3:2 | none | *Close-up of weathered Swiss larch decking boards, silver-brown patina, fine grain, crisp shadow lines. Same style as M1.* |

Negative prompt for H1: *morphing, warping, new objects, extra plants, people, animals, text, logos, camera shake, fast motion, lens flare, colour shift, HDR, CGI look, time-lapse.*

Process:
- Make up to 3 takes per job, poll for completion, and download the results to `content/media/higgsfield/<ID>/`.
- **Check H1 yourself:** extract frames at 0 s, 2.5 s and 5 s with ffmpeg and compare them to the source photo. Reject a take if stone, fence, lights, chalet or mountains change shape or anything appears. If no take passes, use the still photo; the page must work without the video.
- Record every kept file in `content/media/higgsfield/manifest.json` (id, source, model, prompt, seed if given, status `approved`).
- Spend at most about 15 generations in total. If credits run out, carry on with the stills.

## Step 2: Build

### Sections (one page)
1. **Hero.** « Des extérieurs qui prennent vie. » / « De la conception à la réalisation, imaginons ensemble des espaces extérieurs qui vous ressemblent. » CTAs « Parler de mon projet » and « Découvrir nos réalisations ». Framed asymmetric photo (`content/media/hero/02-9_1.jpg`). If H1 was approved, encode it to MP4 + WebM (muted, loop, `playsinline`, ≤ 3 MB) and fade it in **over** the still once it can play. The still stays the LCP image, and there's no video under reduced motion. Headline reveals line by line.
2. **Réalisations.** The 6 featured projects in an editorial asymmetric gallery with subtle parallax. Each links to its existing page on germa-paysages.ch.
3. **Savoir-faire.** The 6 service families from `services.json`, one photo and one sentence each.
4. **Showroom Etoy.** M1/M2 as material textures (they are illustrations, not projects). Hours and phone from `site.json`, « Visiter notre showroom » → https://www.germa-paysages.ch/fr/showroom.
5. **Contact + footer.** « Votre prochain projet commence ici. » « Demander un devis » → https://www.germa-paysages.ch/fr/devis, plus phone, email, the three locations and socials.

## Must
- Responsive at 1440 and 390 px, keyboard accessible, `prefers-reduced-motion` respected, native scrolling.
- `noindex` meta and robots.txt disallow-all (this is a private preview).
- Looks finished: no visible TODOs or placeholders.

## Done when
`npm run dev` works, `npm run build` passes, and you've saved screenshots at 1440 and 390 px to `pitch/mvp/`, looked at them, and fixed what was off. Then report: how to run it, what's on the page, which Higgsfield outputs were kept or rejected (and why), and the screenshot paths.

Start now.
