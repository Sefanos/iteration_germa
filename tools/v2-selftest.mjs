// Self-test: full-page axe colour-contrast at 1440 and 390, console errors, overflow, reduced motion (static hero,
// no frame requests, lines drawn), frames-missing state, keyboard order.
import { launch, BASE } from "./browser.mjs";
import { readFileSync } from "node:fs";
const axe = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const browser = await launch();
async function scrollThrough(page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= total; y += 400) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.waitForTimeout(500);
}
for (const [name, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await scrollThrough(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await page.addScriptTag({ content: axe });
  const v = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: ["color-contrast"] }); return r.violations.flatMap((x) => x.nodes.map((n) => n.html.slice(0, 100) + " :: " + n.failureSummary.split("\n")[1])); });
  console.log(`== ${name}: axe colour-contrast ${v.length ? "VIOLATIONS\n" + v.join("\n") : "0 violations"}; horizontal overflow ${overflow}px; console ${errors.length ? errors.join(" | ") : "clean"}`);
  await ctx.close();
}
// reduced motion at desktop: static hero, no frames requested, lines fully drawn
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const frames = [];
  page.on("request", (r) => { if (r.url().includes("/media/garden/seq/")) frames.push(r.url()); });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({
    stage: getComputedStyle(document.querySelector(".film-stage")).display,
    stat: getComputedStyle(document.querySelector(".film-static")).display,
    lines: [...document.querySelectorAll("section > .ink-line path, footer > .ink-line path")].map((p) => p.style.strokeDashoffset),
    pins: document.querySelectorAll(".pin-spacer").length,
  }));
  console.log(`== reduced motion: stage ${r.stage}, static ${r.stat}, frame requests ${frames.length}, pins ${r.pins}, line offsets ${r.lines.join(",")}`);
  await ctx.close();
}
// frames missing: page still complete over the poster
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route("**/media/garden/seq/**", (route) => route.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => ({ poster: getComputedStyle(document.querySelector(".poster img")).opacity, h1: document.querySelector(".film-stage h1 .sr-only, .film-stage h1")?.textContent?.trim() }));
  console.log(`== frames blocked: poster opacity ${r.poster}, h1 "${r.h1}", page errors ${errors.length}`);
  await ctx.close();
}
// keyboard order (desktop)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const got = [];
  for (let i = 0; i < 24; i++) { await page.keyboard.press("Tab"); got.push(await page.evaluate(() => { const a = document.activeElement; return (a.getAttribute("aria-label") || a.textContent || a.tagName).trim().replace(/\s+/g, " ").slice(0, 22); })); }
  console.log("== tab order:", got.join(" | "));
  await ctx.close();
}
await browser.close();
