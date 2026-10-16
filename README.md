# Germa Paysages, « Living Garden » pitch site

One-page homepage for Germa Paysages Sàrl (private preview, `noindex`). One continuous experience: a visitor
arrives at a villa garden above Lake Geneva, watches Germa build it as they scroll, and keeps exploring Germa's real
projects inside that same environment. Plan and decisions in `LIVING_GARDEN_PLAN.md`; copy and tokens in `DESIGN_PACKAGE.md`.

## Run

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run screenshots   # needs a running server; writes pitch/mvp/*.png (Playwright + chromium-headless-shell)
node tools/v2-record.mjs      # needs a running server; records the 1440 px scroll-through to pitch/v3/scroll-1440.mp4
node tools/v2-selftest.mjs    # axe colour contrast, overflow, reduced motion, frames-missing, tab order
node tools/v2-audit.mjs       # worst-frame legibility per hero band + axe
node tools/v2-flick.mjs       # the flick test on the hero beats
node tools/v3-perf.mjs        # initial JS, image bytes, LCP, CLS, scrub fps
bash tools/build-garden-film.sh   # joins the three Wan clips and exports the WebP frame sequence
```

First time only, for screenshots: `npx playwright install chromium-headless-shell`.

## Where things are

- `app/`, `components/`, `lib/content.ts` — the page (Next.js App Router, Tailwind v4, GSAP).
- `components/garden/` — the one page canvas (frame scrubber over the whole sequence), the fly-in (Arrival), the wordmark in the water, the hero, the chapter scroll drive, the nav capsule and menu, loader, text reveals, Lenis smooth scroll, contours, plan symbols, sun arc, cursor.
- `components/v2/` — the sections (planches, index, plan au jardin, showroom, contact), the ink line, scrub maths.
- `public/media/garden/` — keyframes, wide arrival frame, finished and dusk frames, and `seq/{1280,800}/` film frames.
- `content/media/higgsfield/K`, `C2`, `E` — the generated keyframes, construction clips and exploration clips; `A` holds the aerial reference clips; `content/media/higgsfield/C` holds the earlier maquette film, kept for a detail page.
- `public/media/` — the photos and the hero loop used on the page (copied from `content/`).
- `content/media/higgsfield/manifest.json` — every Higgsfield output, with approved / rejected status and why.
- `pitch/v4/` — current screenshots, hero beats, arrival captures and the scroll recording; `pitch/v3/` holds the keyframe flip-book, clip contact sheets (`clips/`, `explore/`, `aerial/`); `pitch/mvp/` and `pitch/v2/` are earlier rounds.
- `prompts/`, `tools/harvest/` — the content harvest and build prompts.
