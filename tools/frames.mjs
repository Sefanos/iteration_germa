// Captures the viewport at a list of scroll positions (fractions of the page) for review.
import { launch, BASE } from "./browser.mjs";
import { mkdirSync } from "node:fs";
const out = process.env.OUT ?? "/home/zeta/.claude-profiles/lite/jobs/eca9ae5a/tmp/frames";
mkdirSync(out, { recursive: true });
const width = Number(process.env.W ?? 1440), height = Number(process.env.H ?? 900);
const browser = await launch();
const page = await browser.newPage({ viewport: { width, height } });
page.on("pageerror", (e) => console.log("pageerror:", String(e)));
page.on("console", (m) => { if (m.type() === "error") console.log("console:", m.text()); });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const stops = (process.env.STOPS ?? "0,0.04,0.08,0.1,0.13,0.16,0.19,0.22,0.25,0.3,0.36,0.42,0.5,0.6,0.7,0.8,0.9,1").split(",").map(Number);
let i = 0;
for (const f of stops) {
  const y = Math.round(total * f);
  // step toward the target so scrub-based animations settle naturally
  await page.evaluate(async (y) => { const cur = scrollY; const n = 12; for (let k = 1; k <= n; k++) { scrollTo(0, cur + (y - cur) * k / n); await new Promise(r => setTimeout(r, 40)); } }, y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${width}-${String(i).padStart(2, "0")}-${f}.png` });
  i++;
}
console.log(`total scroll ${total}px, ${stops.length} frames in ${out}`);
await browser.close();
