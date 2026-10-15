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

## Sections (one page)
1. **Hero.** « Des extérieurs qui prennent vie. » / « De la conception à la réalisation, imaginons ensemble des espaces extérieurs qui vous ressemblent. » CTAs « Parler de mon projet » and « Découvrir nos réalisations ». Framed asymmetric photo (`content/media/hero/02-9_1.jpg`, or the approved Higgsfield loop over it). Headline reveals line by line.
2. **Réalisations.** The 6 featured projects in an editorial asymmetric gallery with subtle parallax. Each links to its existing page on germa-paysages.ch.
3. **Savoir-faire.** The 6 service families from `services.json`, one photo and one sentence each.
4. **Showroom Etoy.** Hours and phone from `site.json`, « Visiter notre showroom » → https://www.germa-paysages.ch/fr/showroom.
5. **Contact + footer.** « Votre prochain projet commence ici. » « Demander un devis » → https://www.germa-paysages.ch/fr/devis, plus phone, email, the three locations and socials.

## Must
- Responsive at 1440 and 390 px, keyboard accessible, `prefers-reduced-motion` respected, native scrolling.
- `noindex` meta and robots.txt disallow-all (this is a private preview).
- Looks finished: no visible TODOs or placeholders.

## Done when
`npm run dev` works, `npm run build` passes, and you've saved screenshots at 1440 and 390 px to `pitch/mvp/`, looked at them, and fixed what was off. Then report: how to run it, what's on the page, and the screenshot paths.

Start now.
