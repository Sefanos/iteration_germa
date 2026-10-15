// Full-page and above-the-fold screenshots at 1440 and 390 px → pitch/mvp/
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = "pitch/mvp";
mkdirSync(out, { recursive: true });

const targets = [
  { name: "1440", viewport: { width: 1440, height: 900 }, mobile: false },
  { name: "390", viewport: { width: 390, height: 844 }, mobile: true },
];

const browser = await chromium.launch();
for (const t of targets) {
  const ctx = await browser.newContext({
    viewport: t.viewport,
    deviceScaleFactor: 1,
    isMobile: t.mobile,
    hasTouch: t.mobile,
    locale: "fr-CH",
    reducedMotion: process.env.REDUCED_MOTION ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/home-${t.name}-fold.png` });

  // Scroll through so scroll-triggered reveals have fired, then back to top.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += Math.round(t.viewport.height * 0.6)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/home-${t.name}-full.png`, fullPage: true });
  console.log(`saved ${out}/home-${t.name}-fold.png and ${out}/home-${t.name}-full.png (page height ${height}px)`);
  await ctx.close();
}
await browser.close();
