// Hero audits: axe-core colour contrast, and the worst-frame legibility audit for each band
// (glyphs hidden, real composited pixels under the text box, darkest pixel vs ink for dark text).
import { launch, BASE } from "./browser.mjs";
import { readFileSync } from "node:fs";
const axe = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.classList.contains("arrived"), null, { timeout: 15000 }).catch(() => {});
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
    const textLum = await page.evaluate((i) => { const band = document.querySelectorAll(".band")[i]; const el = band.querySelector("h1, .phase-word, .settle-title, p"); const m = getComputedStyle(el).color.match(/\d+(\.\d+)?/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); }, i);
    // text boxes of this band's visible text nodes
    const boxes = await page.evaluate((i) => {
      const band = document.querySelectorAll(".band")[i];
      const els = [...band.querySelectorAll("p, h1, a, span.w, span.c")].filter((e) => e.children.length === 0 || e.classList.contains("btn-cta"));
      const out = [];
      for (const e of els) {
        if (e.classList.contains("btn-cta")) continue;
        if (e.closest(".sr-only") || e.classList.contains("sr-only")) continue;
        const range = document.createRange(); range.selectNodeContents(e);
        for (const r of range.getClientRects()) if (r.width > 4 && r.height > 4) out.push({ x: r.left, y: r.top, w: r.width, h: r.height, btn: false });
      }
      // hide the glyphs (text shadow goes with them: conservative)
      band.style.color = "transparent"; band.style.textShadow = "none";
      band.querySelectorAll("*").forEach((n) => { n.style.color = "transparent"; n.style.textShadow = "none"; });
      return out;
    }, i);
    const shot = await page.screenshot({ type: "png", animations: "disabled" });
    await page.evaluate((i) => { const band = document.querySelectorAll(".band")[i]; band.style.color = ""; band.style.textShadow = ""; band.querySelectorAll("*").forEach((n) => { n.style.color = ""; n.style.textShadow = ""; }); }, i);
    // decode png via the browser canvas
    const worstHere = await page.evaluate(async ({ png, boxes, textLum }) => {
      const blob = new Blob([Uint8Array.from(atob(png), (c) => c.charCodeAt(0))], { type: "image/png" });
      const bmp = await createImageBitmap(blob);
      const c = new OffscreenCanvas(bmp.width, bmp.height).getContext("2d");
      c.drawImage(bmp, 0, 0);
      const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const light = textLum > 0.3; // light text: the lightest pixel is the worst; dark text: the darkest
      let worstPx = light ? 0 : 1, at = null;
      for (const bx of boxes) {
        if (bx.btn) continue;
        const W = Math.round(bx.w), H = Math.round(bx.h);
        const d = c.getImageData(Math.round(bx.x), Math.round(bx.y), W, H).data;
        for (let k = 0; k < d.length; k += 4) { const l = lum([d[k], d[k + 1], d[k + 2]]); const better = light ? l > worstPx : l < worstPx; if (better) { worstPx = l; const i = k / 4; at = [Math.round(bx.x + (i % W)), Math.round(bx.y + Math.floor(i / W)), [d[k], d[k + 1], d[k + 2]].join(",")]; } }
      }
      const hi = Math.max(textLum, worstPx), lo = Math.min(textLum, worstPx);
      return { ratio: (hi + 0.05) / (lo + 0.05), light, at, textLum };
    }, { png: shot.toString("base64"), boxes, textLum });
    const ratio = worstHere.ratio;
    if (ratio < 3.5) console.log(`   band ${i + 1} @p=${(y / range).toFixed(3)} textLum ${worstHere.textLum.toFixed(2)} worst px at ${JSON.stringify(worstHere.at)}`);
    worst = Math.min(worst, ratio);
  }
  worstAll = Math.min(worstAll, worst);
  console.log(`band ${i + 1} [${a}–${b}] worst-pixel contrast ${worst.toFixed(2)}:1 ${worst >= 3.5 ? "OK" : "FAIL"}`);
}
console.log(`worst band: ${worstAll.toFixed(2)}:1`);

// section headlines on the garden: each [data-audit] element at its own scroll position
const heads = await page.evaluate(() => [...document.querySelectorAll("[data-audit]")].map((e) => e.id || e.textContent.trim().slice(0, 20)));
for (let i = 0; i < heads.length; i++) {
  await page.evaluate((i) => { const el = document.querySelectorAll("[data-audit]")[i]; const r = el.getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top - innerHeight * 0.4); }, i);
  await page.waitForTimeout(1200);
  const info = await page.evaluate((i) => {
    const el = document.querySelectorAll("[data-audit]")[i];
    const range = document.createRange(); range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter((r) => r.width > 4 && r.height > 4).map((r) => ({ x: r.left, y: r.top, w: r.width, h: r.height }));
    const m = getComputedStyle(el).color.match(/\d+(\.\d+)?/g).map(Number);
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    el.style.color = "transparent";
    return { rects, textLum: 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]) };
  }, i);
  const shot = await page.screenshot({ type: "png", animations: "disabled" });
  await page.evaluate((i) => { document.querySelectorAll("[data-audit]")[i].style.color = ""; }, i);
  const r = await page.evaluate(async ({ png, rects, textLum }) => {
    const blob = new Blob([Uint8Array.from(atob(png), (c) => c.charCodeAt(0))], { type: "image/png" });
    const bmp = await createImageBitmap(blob);
    const c = new OffscreenCanvas(bmp.width, bmp.height).getContext("2d");
    c.drawImage(bmp, 0, 0);
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const light = textLum > 0.3; let worstPx = light ? 0 : 1;
    for (const box of rects) {
      const x = Math.max(0, Math.round(box.x)), y = Math.max(0, Math.round(box.y));
      const w = Math.round(Math.min(box.w, 1440 - x)), h = Math.round(Math.min(box.h, 900 - y));
      if (w <= 0 || h <= 0) continue;
      const d = c.getImageData(x, y, w, h).data;
      for (let k = 0; k < d.length; k += 4) { const l = lum([d[k], d[k + 1], d[k + 2]]); worstPx = light ? Math.max(worstPx, l) : Math.min(worstPx, l); }
    }
    const hi = Math.max(textLum, worstPx), lo = Math.min(textLum, worstPx);
    return (hi + 0.05) / (lo + 0.05);
  }, { png: shot.toString("base64"), rects: info.rects, textLum: info.textLum });
  console.log(`section headline "${heads[i]}" worst-pixel contrast ${r.toFixed(2)}:1 ${r >= 3 ? "OK (large text ≥3:1)" : "FAIL"}`);
}

// axe colour-contrast at the settle (text visible) and on the static hero
await page.evaluate((y) => window.scrollTo(0, y), Math.round(range * 0.95));
await page.waitForTimeout(1200);
await page.addScriptTag({ content: axe });
const res = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: ["color-contrast"] }); return r.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html.slice(0, 120) + " :: " + n.failureSummary.slice(0, 200)) })); });
console.log("axe colour-contrast (desktop, settle):", res.length ? JSON.stringify(res, null, 1) : "0 violations");
await page.close();
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const pp = await phone.newPage();
await pp.goto(BASE, { waitUntil: "networkidle" });
  await pp.waitForFunction(() => document.body.classList.contains("arrived"), null, { timeout: 15000 }).catch(() => {});
await pp.addScriptTag({ content: axe });
const res2 = await pp.evaluate(async () => { const r = await axe.run(document, { runOnly: ["color-contrast"] }); return r.violations.map((v) => v.nodes.map((n) => n.html.slice(0, 120) + " :: " + n.failureSummary.slice(0, 200))); });
console.log("axe colour-contrast (phone, static):", res2.length ? JSON.stringify(res2, null, 1) : "0 violations");
await browser.close();
