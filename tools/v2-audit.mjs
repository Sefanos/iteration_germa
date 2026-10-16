// Hero audits: axe-core colour contrast, and the worst-frame legibility audit for each band
// (glyphs hidden, real composited pixels under the text box, darkest pixel vs ink for dark text).
import { launch, BASE } from "./browser.mjs";
import { readFileSync } from "node:fs";
const axe = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const INK = lum([21, 23, 26]);
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const range = await page.evaluate(() => document.querySelector(".film").offsetHeight - innerHeight);
const bands = await page.evaluate(() => [...document.querySelectorAll(".band")].map((b) => ({ a: +b.dataset.a, b: +b.dataset.b })));
let worstAll = 99;
for (let i = 0; i < bands.length; i++) {
  const { a, b } = bands[i];
  const samples = [a + 0.035, (a + b) / 2, b - 0.025].map((p) => Math.round(range * p));
  let worst = 99;
  for (const y of samples) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(900);
    // text boxes of this band's visible text nodes
    const boxes = await page.evaluate((i) => {
      const band = document.querySelectorAll(".band")[i];
      const els = [...band.querySelectorAll("p, h1, a, span.w, span.c")].filter((e) => e.children.length === 0 || e.classList.contains("btn-cta"));
      const out = [];
      for (const e of els) { const r = e.getBoundingClientRect(); if (r.width > 4 && r.height > 4) out.push({ x: r.left, y: r.top, w: r.width, h: r.height, btn: e.classList.contains("btn-cta") }); }
      // hide the glyphs (text shadow goes with them: conservative)
      band.style.color = "transparent"; band.style.textShadow = "none";
      band.querySelectorAll("*").forEach((n) => { n.style.color = "transparent"; n.style.textShadow = "none"; });
      return out;
    }, i);
    const shot = await page.screenshot({ type: "png" });
    await page.evaluate((i) => { const band = document.querySelectorAll(".band")[i]; band.style.color = ""; band.style.textShadow = ""; band.querySelectorAll("*").forEach((n) => { n.style.color = ""; n.style.textShadow = ""; }); }, i);
    // decode png via the browser canvas
    const worstHere = await page.evaluate(async ({ png, boxes }) => {
      const blob = new Blob([Uint8Array.from(atob(png), (c) => c.charCodeAt(0))], { type: "image/png" });
      const bmp = await createImageBitmap(blob);
      const c = new OffscreenCanvas(bmp.width, bmp.height).getContext("2d");
      c.drawImage(bmp, 0, 0);
      const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      let darkest = 1;
      for (const bx of boxes) {
        if (bx.btn) continue; // the CTA has its own solid fill
        const d = c.getImageData(Math.round(bx.x), Math.round(bx.y), Math.round(bx.w), Math.round(bx.h)).data;
        for (let k = 0; k < d.length; k += 4) darkest = Math.min(darkest, lum([d[k], d[k + 1], d[k + 2]]));
      }
      return darkest;
    }, { png: shot.toString("base64"), boxes });
    const ratio = (worstHere + 0.05) / (INK + 0.05);
    worst = Math.min(worst, ratio);
  }
  worstAll = Math.min(worstAll, worst);
  console.log(`band ${i + 1} [${a}–${b}] worst-pixel contrast ${worst.toFixed(2)}:1 ${worst >= 3.5 ? "OK" : "FAIL"}`);
}
console.log(`worst band: ${worstAll.toFixed(2)}:1`);

// axe colour-contrast at the settle (text visible) and on the static hero
await page.evaluate((y) => window.scrollTo(0, y), Math.round(range * 0.76));
await page.waitForTimeout(1200);
await page.addScriptTag({ content: axe });
const res = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: ["color-contrast"] }); return r.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html.slice(0, 120) + " :: " + n.failureSummary.slice(0, 200)) })); });
console.log("axe colour-contrast (desktop, settle):", res.length ? JSON.stringify(res, null, 1) : "0 violations");
await page.close();
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const pp = await phone.newPage();
await pp.goto(BASE, { waitUntil: "networkidle" });
await pp.addScriptTag({ content: axe });
const res2 = await pp.evaluate(async () => { const r = await axe.run(document, { runOnly: ["color-contrast"] }); return r.violations.map((v) => v.nodes.map((n) => n.html.slice(0, 120) + " :: " + n.failureSummary.slice(0, 200))); });
console.log("axe colour-contrast (phone, static):", res2.length ? JSON.stringify(res2, null, 1) : "0 violations");
await browser.close();
