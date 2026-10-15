# GERMA PAYSAGES — LIVING ARCHITECTURE

## 0. Mission and scope

You are building a **working, high-fidelity prototype** of a new website for Germa Paysages Sàrl, a Swiss landscaping company. Their current site is https://www.germa-paysages.ch/fr. Work with the judgement of a senior creative director, frontend engineer, motion designer and 3D technical artist.

**This is a pitch.** Germa is an existing client of our agency. This prototype has to convince their management to adopt a new direction for the site. They will first see it in a meeting on a laptop or a large screen, then on their own phones. Put your polish where the eye goes first: the hero, chapter 02 (3D) and chapter 03 (Réalisations). Then the rest.

The argument of the pitch is *« vos réalisations, présentées comme elles le méritent »*. Seeing their own work at this level is what convinces. Stock or generated imagery would weaken that argument, and it would set expectations the real site can't meet.

The site should feel like the website of a bespoke architecture studio: editorial, cinematic, tactile, natural and technically refined. It also has to do two business jobs: bring in qualified landscaping projects and get people to visit the Etoy showroom.

**This is an implementation task.** Build it, run it, look at it, test it and refine it. A plan, a mockup or scaffolding is not the deliverable.

**In scope**
- The homepage (chapters 01–07 below).
- One project detail template at `/realisations/[slug]`, statically generated for the featured projects.

**Out of scope for now:** production deployment, DNS, a CMS, the English version, legacy URL redirects and buying assets. The rest of the service catalogue, the other ~400 project pages and the legal pages stay on the existing site, and the prototype links to them.

The repository contains only `/content` (the harvested content pack) and `/prompts`. Create the app at the repository root.

## 1. Content: the single source of truth

All content comes from `/content`:

- `content/CONTENT_AUDIT.md`: what exists, gaps, discrepancies, exclusions. **Read it first.**
- `content/site.json`: company facts, locations, hours, contacts, socials, permissions.
- `content/services.json`: the 44 legacy services, each with its proposed family.
- `content/projects/` and `content/media/`: projects (featured ones marked), verbatim text, and images with their dimensions.
- `content/before-after.json` and `content/IMAGE_INVENTORY.csv`.

Rules:

- **Facts come only from `/content`.** Facts include names, places, dates, numbers, clients, hours, phone numbers and quality claims. Never invent projects, reviews, awards, prices, statistics, certifications or client names.
- **The pitch build must look finished.**
  - When sources disagree, use the value from the most specific page of the current site (for example, the showroom page for showroom details) and add the question to `OPEN_QUESTIONS.md`.
  - If a fact is missing, leave that element out rather than show a gap.
  - `[À CONFIRMER]` markers render only when `NEXT_PUBLIC_SHOW_PLACEHOLDERS=1`.
- **You may write editorial copy** in French: headlines, section intros, captions. A project description is at most two sentences, based only on the source text and what is visible in the photos. Store it with `draft: true` so the client can approve it.
- **Never use images flagged `exclude` or `supplier`.**
- **Never present a stock or generated image as a Germa project.** Record every non-Germa or modified image in `ASSET_MANIFEST.md`. When `NEXT_PUBLIC_SHOW_PLACEHOLDERS=1`, label those images visibly in the UI.
- **AI upscaling of Germa's own photos is allowed for the pitch**, if an upscaler is available, to reach hero resolution. Check every result at 100% for invented detail (foliage, stone joints, text, faces), record it in the manifest, and treat it as temporary. The real fix is new photography.

Key facts, verified on the live site on 2026-10-15. If they differ from `content/site.json`, the content pack wins.

- Germa Paysages Sàrl was founded in 2009 and has trained apprentices since 2009. Its team leaders have at least ten years of experience.
- It works mainly in Valais and Vaud, and in Geneva, Fribourg and Neuchâtel for medium-to-large projects.
- **Monthey:** Route Boeuferrant-Nord 19, 1870 Monthey. Administration centrale. +41 24 471 25 78.
- **Etoy:** Route du Stand 31, 1163 Etoy. Site de production, réception sur rendez-vous. +41 21 802 48 42.
- **Genève:** Rue de Chantepoulet 10, 1201 Genève. Bureau sur rendez-vous. +41 22 320 11 88. It's listed on the contact page; whether it's still active is an open question.
- **Showroom Etoy:** mercredi 13h30–17h30, jeudi et vendredi 09h30–17h30, samedi 10h00–16h30. Other times by appointment at 021 807 19 23. The showroom page gives no street address, so « Itinéraire » should open a Google Maps search for "Germa Paysages Showroom Etoy" rather than a guessed address.
- secretariat@germa-paysages.ch
- Quote page: https://www.germa-paysages.ch/fr/devis
- Showroom page: https://www.germa-paysages.ch/fr/showroom
- Pergolas: https://www.mapergolabioclimatique.ch
- Brand green (logo): `#95C11F`

## 2. Creative identity

- **Concept:** Living Architecture
- **Tagline:** La nature prend forme.
- **Hero headline:** Des extérieurs qui prennent vie.
- **Personality:** Swiss architectural minimalism meets organic luxury.

Principles:
- Editorial layouts with deliberate asymmetry.
- Large, characterful type and generous negative space.
- Architectural photography, used large.
- Natural materials: limestone, wood, stone, foliage.
- Cinematic movement with restraint and purpose.
- An art-directed identity, not a landscaping template.

**Palette and contrast rules.** These ratios are computed WCAG ratios.

| Token | Hex | Use |
|---|---|---|
| Forest | `#18352A` | Text on limestone (11.7:1), dark surfaces, primary buttons with limestone labels |
| Charcoal | `#242823` | Body text on limestone (13.1:1) |
| Limestone | `#F3F0E6` | Page background, text on forest (11.7:1) |
| Sage | `#A9B9A4` | Surfaces only. **Never text on limestone (1.8:1).** Charcoal text on sage is fine (7.2:1). |
| Terracotta | `#B47D5C` | Accents, and text ≥ 24 px only (3.1:1 on limestone). **No white-on-terracotta buttons with small labels (3.5:1).** |
| Germa lime | `#95C11F` | The brand's own green, kept as a small signature: logo, a fine rule, a detail on dark surfaces (6.3:1 on forest). **Never text on light backgrounds (1.9:1).** |

**Typography**
- Instrument Serif for display text. It has **only one weight (400) plus an italic**, so build the heading hierarchy from size, italics, tracking and line length, not weight.
- Manrope (variable, 200–800) for interface and body text.
- Self-host both through `next/font` with `display: swap` and metric-adjusted fallbacks, to avoid layout shift.
- Follow French typographic rules:
  - Narrow no-break space (U+202F) before `; : ! ?` and inside « ».
  - Typographic apostrophe ’.
  - `text-wrap: balance` on headings, and no single orphaned word on display lines.
- Use Swiss formats: `+41 21 802 48 42`, `13h30`.

**Logo:** use the existing Germa logo from `content/brand/` and don't redesign it. Don't use the "15 ans" badge: 2009 + 15 = 2024, so it's out of date.

**Avoid:** interchangeable cards, excessive rounded corners, gradients, glassy floating UI, random particles, generic icon sets, and decoration that has nothing to do with the story.

## 3. Experience design

### Chapter 01: Cinematic introduction

- Headline: « Des extérieurs qui prennent vie. »
- Subheadline: « De la conception à la réalisation, imaginons ensemble des espaces extérieurs qui vous ressemblent. »
- Primary CTA: « Parler de mon projet » (to the contact chapter).
- Secondary CTA: « Découvrir nos réalisations » (to chapter 03).

**Image resolution decides the layout.**
- A full-bleed hero needs a source image at least 2560 px wide. Most of the current library is 840–1600 px.
- If `content/media/hero/` has no image that large, design an **editorial framed hero** instead: the photo covers about 55–70% of the viewport width, set asymmetrically, with the headline crossing the frame edge. That works at 1600 px.
- Don't upscale silently. Any upscale goes in the manifest.

**Animation**
- Line-by-line headline reveal with GSAP SplitText. All GSAP plugins are free since 3.13. Use `autoSplit` so lines re-split after fonts load and on resize.
- The image settles in scale from about 1.06 to 1.
- The navigation enters calmly.
- A restrained scroll cue.
- No loading screen.

The hero image is the LCP element:
- Use `priority`, correct `sizes`, and AVIF/WebP.
- The image and headline must be visible without JavaScript and with reduced motion.
- The hero must not depend on any 3D code.

### Chapter 02: La nature prend forme (3D)

**Art direction: "la maquette d'architecte".** The garden starts as an architect's study model: monochrome plaster and limestone, contour-stepped terrain, crisp extruded volumes, and abstract model trees (spheres, cones, wire forms like the ones used in physical architecture models). Over the sequence it becomes a living garden. This makes the tagline literal.

Why this direction:
- Clean procedural geometry looks intentional, not like a weak attempt at photorealism.
- It needs no textures and stays light on mobile.
- It doesn't depend on photoreal tree assets we don't have.

**Scene:** a contemporary Swiss garden on a gently sloping plot, Valais-style. It has:
- A natural-stone retaining wall (walls and rock work are a core Germa skill).
- Stone paths, a terrace and a pergola.
- Planted beds, ornamental grasses and a few well-placed trees.

The camera is perspective with a long focal length, or orthographic, framed like an architecture model photo. The lighting is warm late afternoon with soft, convincing shadows. The background is matched to limestone. Every object is placed by composition, not at random.

**Storyboard.** The four words map to the four phases, the way a landscape architect actually works:

| Scroll | Word | What happens |
|---|---|---|
| 0–25% | **Imaginer.** | Top-down view of a blank limestone terrain. The plan draws itself on the surface like ink on a site plan: path lines, terrace outline, planting beds. |
| 25–50% | **Concevoir.** | The camera tilts to a ¾ architectural view. The drawn outlines extrude into model volumes: terrace, wall, steps, pergola frame. Still monochrome. |
| 50–75% | **Réaliser.** | Materials resolve (stone, timber, gravel). Model trees and grasses rise into place with controlled masks and transforms, never flying in. |
| 75–100% | **Faire vivre.** | Colour and late-afternoon light warm the scene, the grasses sway slightly, and a slow dolly or orbit plays. Then hand off to Réalisations. |

**Implementation**
- **Scroll mechanics**
  - A pinned section, scrubbed by ScrollTrigger on native scroll.
  - About 300vh on desktop and about 200vh on mobile, tuned by feel.
- **State model**
  - One master GSAP timeline animates a plain scene-state object: progress, phase, material mix, reveal masks, camera keyframes.
  - R3F reads that object inside `useFrame`.
  - GSAP never sets React state per frame.
- **Accessible text:** the four words are real DOM text (an ordered list or headings), not text drawn in the canvas.
- **Model slot**
  - The procedural garden must be replaceable by a GLB of a real Germa project (converted from the client's SketchUp, Lumion or Vectorworks file, if they supply one) without changing the timeline.
  - Document the expected node names, scale and orientation in `ASSET_MANIFEST.md`.
- **Loading**
  - Load the scene with `next/dynamic` and `ssr: false`, and mount it only when the section is within about one viewport.
  - Until then, show a **poster image**: a static render of the finished scene, generated from the scene itself and committed to the repo.
- **Fallback:** show the poster permanently, with the four words still animating as text, when any of these is true:
  - `prefers-reduced-motion`
  - No WebGL2
  - `navigator.connection.saveData`
  - Lost or failed WebGL context
- **Rendering budget**
  - Clamp dpr to [1, 1.5], and use 1 on mobile.
  - Use `frameloop="demand"` and invalidate only when progress changes or while the sway is running.
  - Pause rendering offscreen.
  - Dispose geometries, materials and render targets on unmount.
  - Keep scene assets under 1.5 MB gzip, not counting three.js itself.
- **Pre-rendered alternative**
  - Only consider this if Blender is installed and the real-time version clearly fails the quality bar. It would be an image sequence scrubbed on a canvas (see references).
  - Record the decision and its reasons in `IMPLEMENTATION_PLAN.md`.

**Avoid:** objects flying in, uncontrolled spinning, particles, and anything that reads as a game demo.

### Chapter 03: Réalisations

- Use the 4–6 projects marked `featured: true`. Lay them out as an editorial gallery: large images, an asymmetric grid, subtle parallax, precise hover states, and a title and service category on each.
- **Every project is a real link** to `/realisations/[slug]`.
  - The GSAP Flip expansion is progressive enhancement on top of that link: the image morphs into the detail page's hero position.
  - It must work with the keyboard and the Back button, and without JavaScript.
- **The detail page** shows:
  - The image gallery.
  - The location, if known.
  - The services involved, linking to the legacy service pages.
  - The draft description.
  - « Cette réalisation m'intéresse », which goes to the contact form with the project pre-filled.
- **Named commercial clients** (Beau-Rivage Palace, Usine Cailler, Ville de Monthey…): the pitch may use any client name that Germa already publishes on its current site, because the audience is Germa itself. Before go-live, a name appears only when `permissions.clientNamesConfirmed` is true; otherwise describe the project generically, for example « Terrasses d'un hôtel, Riviera ». Make this a single switch in the data layer and note it in `OPEN_QUESTIONS.md`.

### Chapter 04: Notre savoir-faire

Group the 44 legacy services, using the mapping in `content/services.json`, into six families:

1. Conception paysagère
2. Aménagement & plantation
3. Terrasses & pergolas (pergolas also link to mapergolabioclimatique.ch)
4. Murs, enrochements & pierre naturelle. Retaining walls, rock work and gabions run through much of Germa's project history. This is a core strength, not a footnote.
5. Piscines, spas & bassins
6. Entretien des espaces verts

Each family gets one strong photo and one sentence. It reveals its sub-services, and each sub-service links to its existing service page.

### Chapter 05: De l'idée à la réalisation

- Three steps: Conception → Réalisation → Entretien, with tasteful scroll reveals.
- **Before/after slider**
  - Show it only with a verified pair from `content/before-after.json`. A pair of a 3D projection and the finished garden is the strongest proof of "idea → result". If there is no verified pair, leave the slider out.
  - The slider must be keyboard-operable (a native `input type="range"` underneath) and labelled.

### Chapter 06: Showroom Etoy

- A distinctive section that makes people want to see the materials in person.
- Show the verified hours and phone number.
- CTA « Visiter notre showroom » links to the legacy showroom page.
- « Itinéraire » opens the map in a new tab. Don't embed a map iframe; it costs performance and data protection.
- Don't build a booking system.

### Chapter 07: Conversion and footer

- Headline: « Votre prochain projet commence ici. »
- Primary CTA: « Demander un devis ».
- Secondary CTA: « Visiter le showroom ».

**Form**
- Use the same fields as the existing quote form, so Germa's team gets what it already handles: nom, prénom, e-mail, téléphone, adresse, NPA, ville, nature du projet (conception / aménagement ou rénovation de mes extérieurs / autre), message.
- Validate accessibly: labels, inline errors and an error summary.
- **Delivery**
  - Submit through a server action with a delivery adapter chosen by environment variables, for example `LEAD_DELIVERY=resend`, `RESEND_API_KEY` and `LEAD_TO_EMAIL`.
  - **If no adapter is configured, the form can't be submitted.** Say so plainly and offer the existing quote page, the email address and the phone number.
  - Never show a success state for a submission that didn't happen.
  - The pitch build runs without an adapter. The form must still look fully designed, with validation working and the not-configured state styled as part of the design.
- **Spam and privacy**
  - Use a honeypot and a minimum time-to-submit. Cloudflare Turnstile is optional, behind an environment variable.
  - Swiss data protection (nLPD): add a short notice under the button that links to the privacy policy.
  - Don't track field contents.

**Footer:** the three locations, phones, email, socials (Facebook, Instagram, LinkedIn), and the legal pages (legacy URLs if they exist, otherwise `[À CONFIRMER]`).

## 4. Technologies

- **App:** Next.js (latest stable) with the App Router and TypeScript.
- **Styling:** Tailwind CSS v4, with design tokens as CSS custom properties.
- **Motion**
  - GSAP with ScrollTrigger, SplitText and Flip, through `@gsap/react` `useGSAP` for scoped cleanup.
  - `gsap.matchMedia()` for breakpoints and reduced motion.
- **3D:** Three.js, React Three Fiber and Drei. Compress any GLB with gltf-transform (Meshopt or Draco).
- **Tests:** Playwright for functional and visual tests.
- **Smooth scrolling:** don't use a smooth-scroll library (Lenis, ScrollSmoother) by default. Add one only if you can name the concrete problem it solves, and document it.
- **Components:** server components for content. Client components only for motion, 3D and the form. Each animation is self-contained and cleans up after itself.

## 5. Assets

Priority order:

1. Germa photography and models from `/content`.
2. Procedural geometry for the 3D chapter.
3. CC0 assets (Poly Haven, Kenney, Quaternius), and only where they fit the model-making aesthetic.
4. Clearly labelled, replaceable placeholders.

`ASSET_MANIFEST.md` lists every significant asset with its source, licence, purpose, optimisation and replacement status. Don't copy copyrighted images, code, sites or models.

## 6. Technical references

Study the technique, not the visual identity.

- **Cinematic 3D scroll** (Codrops, Nov 2025): https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/
  GSAP as the director of camera, light and shaders. *It uses ScrollSmoother. We don't.*
- **Blender camera path** (Codrops, Jul 2026): https://tympanus.net/codrops/2026/07/07/building-a-scroll-driven-3d-gallery-using-a-blender-camera-path-with-three-js-and-gsap/
  Export a Blender curve to JSON and rebuild it as a Three.js camera path. Useful for chapter 02's camera.
- **Infinite gallery with Flip** (Codrops, Jul 2026): https://tympanus.net/codrops/2026/07/30/building-an-infinite-gsap-scroll-gallery-with-parallax-and-flip-transitions/
  *Take only the per-item parallax and the Flip-to-detail morph.* Its infinite loop uses Observer and takes over scrolling, which is not allowed here.
- **Scroll-scrubbed frame sequence:** https://github.com/hamzafarooq/claude-code-starter, folder `demos/royal-pop-website` (vanilla canvas frame scrubbing). Relevant only if you choose the pre-rendered route in chapter 02.

## 7. Performance and accessibility

Requirements:
- Native scrolling, no scroll hijacking.
- Full keyboard support with visible focus.
- Semantic landmarks and headings.
- Accessible form controls.
- Reduced-motion variants for every animation.
- Correct image dimensions, so nothing shifts as it loads.
- The 3D fallback and pausing described in chapter 02.

**Lab budgets** (Lighthouse mobile, simulated throttling): LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.1. INP is a field metric and can't be measured before launch. Say so in the report; don't claim it.

Keep three.js and the scene out of the initial bundle, and report the size of the initial JavaScript.

## 8. SEO

- The prototype is French only: `<html lang="fr-CH">`.
- Add metadata and Open Graph images per page.
- Add `LocalBusiness` JSON-LD with one entry per location from `site.json`.
- Generate a sitemap for the new routes.
- The legacy site has about 950 indexed URLs (FR + EN). Don't build redirects. Write `MIGRATION_NOTES.md` instead: group the legacy URLs (projects, services, pages, EN) and recommend a 301 strategy for launch.
- **The pitch build must never be indexed.** Add a `noindex` meta tag, an `X-Robots-Tag: noindex` header and a robots.txt that disallows everything, all controlled by a single `PREVIEW_MODE` variable that defaults to on. A public, indexable copy of Germa's content would compete with their live site in Google.

## 9. Workflow

**Stage A: Foundation.** Write each document in one page or less:
- `DESIGN_DIRECTION.md`
- `MOTION_STORYBOARD.md`
- `ASSET_MANIFEST.md`
- `IMPLEMENTATION_PLAN.md`
- `OPEN_QUESTIONS.md`

They are working references, not a reason to stop.

**Stage B: Static homepage.** All chapters with real content, tokens, type and responsive layout, plus working links and form states. No motion yet. Chapter 02 shows its poster image or a static layout.

> **CHECKPOINT:** stop here. Show screenshots at 1440, 768 and 390 px with a short note on the design direction, for creative review. *(Delete this line for an unattended run.)*

**Stage C: Motion.** Hero reveal, section transitions, gallery parallax and Flip, chapter 05 reveals.

**Stage D: 3D.** The maquette scene, the timeline, the fallbacks and the poster render.

**Stage E: Verification.**
- **Screenshots** at 1920, 1440, 768 and 390 px. Check:
  - Overflow and typography.
  - Focus states and keyboard navigation.
  - Reduced-motion mode and JavaScript-disabled mode.
  - The WebGL fallback.

  Headless Chromium may need `--enable-unsafe-swiftshader` to render WebGL.
- **Commands:** lint, typecheck, build, Playwright and Lighthouse mobile.
- **Playwright covers:**
  - Navigation and CTA targets.
  - Form validation and the "not configured" state.
  - Project routes and the Back button after Flip.
  - Reduced motion.
- Fix what you find and repeat. Compiling is not the same as finished.

## 10. Working rules

- Make reasonable engineering decisions without asking for permission. Record the important ones in `IMPLEMENTATION_PLAN.md`.
- Keep dependencies minimal and components maintainable.
- Never deploy to production, change external systems, buy assets or submit forms on the live site.
- Get the build ready for a password-protected preview deployment (for example on Vercel): optional basic auth through `PREVIEW_PASSWORD`, plus the noindex setup from section 8. Don't deploy yourself unless you're given credentials.
- If something genuinely needs a credential, payment or permission, isolate it behind configuration and keep going with the rest.

## 11. Final report

Report:
- What was implemented.
- How to start it locally.
- What works: pages and interactions.
- Screenshot evidence for desktop and mobile.
- The tests actually run, with their real results.
- Lab performance numbers.
- Remaining asset gaps, `[À CONFIRMER]` items and production tasks.

**Pitch materials**, in `pitch/`:
- **Scroll-through recordings** at 1440 px and 390 px, 30–60 seconds each, made with Playwright video at a steady scroll speed. If software WebGL makes the recording choppy, say so and we'll record by hand.
- **Old-vs-new screenshots** of the current site's homepage at the same widths as the new one.
- **`WITH_YOUR_ASSETS.md`**, the talking points for the meeting: what gets better with the client's material (high-resolution photos, a real project's 3D file for chapter 02, before/after pairs, testimonials, the confirmed facts), each shown against what the prototype currently uses.

## Quality bar

The result must look like an intentionally designed premium Swiss landscape architecture website, not a generic AI landing page. Judge every element on visual coherence, readability, real business value and implementation quality.

**Start now:** read `content/CONTENT_AUDIT.md`, then begin Stage A.
