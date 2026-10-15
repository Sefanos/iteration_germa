# Germa Paysages — « Living Architecture » MVP

One-page homepage prototype for Germa Paysages Sàrl (private preview, `noindex`).
Built from `prompts/03-mvp-landing.md`; all content comes from `content/` and Germa's own photos.

## Run

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run screenshots   # needs a running server; writes pitch/mvp/*.png (Playwright + chromium-headless-shell)
node tools/record.mjs # needs a running server; records the 1440 px scroll-through to pitch/mvp/scroll-1440.mp4
bash tools/build-sequence.sh  # rebuilds the maquette frame sequence from content/media/higgsfield/C/*.mp4
```

First time only, for screenshots: `npx playwright install chromium-headless-shell`.

## Where things are

- `app/`, `components/`, `lib/content.ts` — the page (Next.js App Router, Tailwind v4, GSAP).
- `components/maquette/` — chapter 02 « La nature prend forme »: a scroll-scrubbed frame sequence (see `IMPLEMENTATION_PLAN.md`).
- `public/media/maquette/seq/` — the WebP frames (1600 and 800 px), loaded only when the chapter is near.
- `public/media/` — the photos and the hero loop used on the page (copied from `content/`).
- `content/media/higgsfield/manifest.json` — every Higgsfield output, with approved / rejected status and why.
- `pitch/mvp/` — screenshots at 1440 and 390 px.
- `prompts/`, `tools/harvest/` — the content harvest and build prompts.
