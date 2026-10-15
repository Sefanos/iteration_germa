// Records a 30–45 s scroll-through at 1440×900 and saves it to pitch/mvp/.
import { launch, BASE } from "./browser.mjs";
import { mkdirSync, renameSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
const tmp = "/home/zeta/.claude-profiles/lite/jobs/eca9ae5a/tmp/rec";
mkdirSync(tmp, { recursive: true });
mkdirSync("pitch/mvp", { recursive: true });
const browser = await launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: tmp, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.mouse.move(720, 450);
await page.waitForTimeout(3200); // hero opening
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const steps = Number(process.env.STEPS ?? 900);
// Scroll in fixed increments (not wall-clock), so the whole page is always covered.
// Slower through the first 30% (hero + maquette), then steady.
for (let i = 0; i <= steps; i++) {
  const p = i / steps;
  const eased = p < 0.45 ? (p / 0.45) * 0.3 : 0.3 + ((p - 0.45) / 0.55) * 0.7;
  const y = Math.round(total * eased);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  // hover a project while passing the gallery so the cursor label shows
  if (p > 0.5 && p < 0.56) await page.mouse.move(300 + (p - 0.5) * 6000, 520);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(1500);
await ctx.close();
await browser.close();
const file = readdirSync(tmp).find((f) => f.endsWith(".webm"));
renameSync(`${tmp}/${file}`, "pitch/mvp/scroll-1440.webm");
execSync("ffmpeg -v error -y -i pitch/mvp/scroll-1440.webm -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -movflags +faststart pitch/mvp/scroll-1440.mp4");
console.log("saved pitch/mvp/scroll-1440.webm and .mp4");
