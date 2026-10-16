// Full-page screenshots (1440, 390) plus desktop viewport captures at given scroll fractions → pitch/v4/
import { launch, BASE } from "./browser.mjs";
import { mkdirSync, rmSync } from "node:fs";
mkdirSync("pitch/v4", { recursive: true });
const browser = await launch();
for (const [name, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(`[${name}] pageerror:`, String(e)));
  page.on("console", (m) => { if (m.type() === "error") console.log(`[${name}] console:`, m.text()); });
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForFunction(() => document.body.classList.contains("arrived"), null, { timeout: 15000 }).catch(() => {});
  page.setDefaultTimeout(90000);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `pitch/v4/home-${name}-fold.png`, animations: "disabled", timeout: 90000 });
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y < total; y += Math.round(vp.height * 0.5)) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(90); }
  // Stitched capture: viewport shots at each viewport height, stacked. (fullPage resizes the viewport, which
  // blows up svh-sized pinned sections.)
  await page.evaluate(() => { document.querySelectorAll(".rv, .board").forEach((e) => e.classList.add("in")); });
  const tiles = [];
  const tmp = "/home/zeta/.claude-profiles/lite/jobs/eca9ae5a/tmp/tiles";
  mkdirSync(tmp, { recursive: true });
  const H = vp.height;
  // pinned sections repeat the same view: capture at the *document* positions where content changes
  for (let y = 0, i = 0; y <= total; y += H, i++) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(350);
    const path = `${tmp}/${name}-${String(i).padStart(3, "0")}.png`;
    await page.screenshot({ path, animations: "disabled", timeout: 90000 });
    tiles.push(path);
  }
  const { execSync } = await import("node:child_process");
  const inputs = tiles.map((t) => `-i "${t}"`).join(" ");
  const filter = tiles.map((_, i) => `[${i}:v]`).join("") + `vstack=inputs=${tiles.length}`;
  execSync(`ffmpeg -v error -y ${inputs} -filter_complex "${filter}" pitch/v4/home-${name}-full.png`);
  tiles.forEach((t) => rmSync(t, { force: true }));
  const stops = (process.env.STOPS ?? "").split(",").filter(Boolean).map(Number);
  for (const f of stops) { await page.evaluate((v) => scrollTo(0, v), Math.round(total * f)); await page.waitForTimeout(1200); await page.screenshot({ path: `/home/zeta/.claude-profiles/lite/jobs/eca9ae5a/tmp/frames/v2-${name}-${f}.png`, animations: "disabled", timeout: 90000 }); }
  console.log(`${name}: page height ${total + vp.height}px`);
  await ctx.close();
}
await browser.close();
