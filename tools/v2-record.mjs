// 40 s scroll-through at 1440×900 → pitch/v4/scroll-1440.mp4 (recorded in Playwright, retimed with ffmpeg).
import { launch, BASE } from "./browser.mjs";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
const tmp = "/home/zeta/.claude-profiles/lite/jobs/eca9ae5a/tmp/rec2";
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: tmp, size: { width: 1440, height: 900 } } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.classList.contains("arrived"), null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2500);
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const steps = 1000;
for (let i = 0; i <= steps; i++) {
  const p = i / steps;
  // the hero film gets the first half of the scroll time; the sections share the rest
  const eased = p < 0.5 ? (p / 0.5) * 0.52 : 0.52 + ((p - 0.5) / 0.5) * 0.48;
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * eased));
  if (p > 0.56 && p < 0.6) await page.mouse.move(600, 300 + (p - 0.56) * 8000);
  if (p > 0.66 && p < 0.7) await page.mouse.move(700, 450);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(1200);
await ctx.close();
await browser.close();
const file = readdirSync(tmp).find((f) => f.endsWith(".webm"));
const dur = Number(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${tmp}/${file}`).toString());
const factor = dur / 40;
execSync(`ffmpeg -v error -y -i ${tmp}/${file} -vf "setpts=PTS/${factor.toFixed(4)}" -r 30 -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -movflags +faststart pitch/v4/scroll-1440.mp4`);
console.log(`saved pitch/v4/scroll-1440.mp4 (raw ${dur.toFixed(1)} s retimed to 40 s)`);
