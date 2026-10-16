// The flick test: wheel steps of 120, 240 and 360 px from the top; every band must hold full opacity
// for 5+ consecutive 120px flicks and no band may be skippable at 360px.
import { launch, BASE } from "./browser.mjs";
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const range = await page.evaluate(() => document.querySelector(".film").offsetHeight - innerHeight);
for (const step of [120, 240, 360]) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const count = Math.ceil(range / step) + 2;
  const runs = []; // per band: max consecutive full-opacity steps, and whether it ever reached full
  const n = await page.evaluate(() => document.querySelectorAll(".band").length);
  const consec = Array(n).fill(0), best = Array(n).fill(0), reached = Array(n).fill(false);
  for (let i = 0; i < count; i++) {
    await page.evaluate((s) => window.scrollBy(0, s), step);
    await page.waitForTimeout(400);
    const ops = await page.evaluate(() => [...document.querySelectorAll(".band")].map((b) => +getComputedStyle(b).opacity));
    ops.forEach((o, k) => { if (o > 0.97) { consec[k]++; best[k] = Math.max(best[k], consec[k]); reached[k] = true; } else consec[k] = 0; });
  }
  console.log(`step ${step}px: full-opacity streaks per band = ${best.join(", ")}  reached = ${reached.map((r) => (r ? "y" : "N")).join("")}`);
}
await browser.close();
