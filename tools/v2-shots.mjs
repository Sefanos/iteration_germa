// Full-page screenshots (1440, 390) plus desktop viewport captures at given scroll fractions → pitch/v2/
import { launch, BASE } from "./browser.mjs";
import { mkdirSync } from "node:fs";
mkdirSync("pitch/v2", { recursive: true });
const browser = await launch();
for (const [name, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(`[${name}] pageerror:`, String(e)));
  page.on("console", (m) => { if (m.type() === "error") console.log(`[${name}] console:`, m.text()); });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `pitch/v2/home-${name}-fold.png` });
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y < total; y += Math.round(vp.height * 0.5)) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(90); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.evaluate(() => { document.querySelectorAll(".rv, .board").forEach((e) => e.classList.add("in")); });
  await page.screenshot({ path: `pitch/v2/home-${name}-full.png`, fullPage: true });
  const stops = (process.env.STOPS ?? "").split(",").filter(Boolean).map(Number);
  for (const f of stops) { await page.evaluate((v) => scrollTo(0, v), Math.round(total * f)); await page.waitForTimeout(1200); await page.screenshot({ path: `/home/zeta/.claude-profiles/lite/jobs/eca9ae5a/tmp/frames/v2-${name}-${f}.png` }); }
  console.log(`${name}: page height ${total + vp.height}px`);
  await ctx.close();
}
await browser.close();
