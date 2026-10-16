// Performance check: initial JS, image bytes before scroll, LCP, CLS, long tasks, frame rate while scrubbing.
import { launch, BASE } from "./browser.mjs";
const browser = await launch();
for (const [name, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  let js = 0, img = 0, jsFiles = 0;
  page.on("response", async (r) => { const u = r.url(); let len = Number(r.headers()["content-length"] || 0); if (!len) { try { len = (await r.body()).length; } catch { len = 0; } } if (u.includes("/_next/static/") && u.endsWith(".js")) { js += len; jsFiles++; } if (/\.(webp|jpg|png|avif)(\?|$)/.test(u) || u.includes("/_next/image")) img += len; });
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const m = await page.evaluate(() => new Promise((res) => {
    let lcp = 0, cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    setTimeout(() => res({ lcp: Math.round(lcp), cls: +cls.toFixed(4) }), 500);
  }));
  const imgBeforeScroll = img;
  // scrub the hero quickly and measure frame rate
  const fps = await page.evaluate(async () => {
    const total = document.querySelector(".film").offsetHeight - innerHeight;
    let frames = 0; const t0 = performance.now(); let running = true;
    const f = () => { frames++; if (running) requestAnimationFrame(f); }; requestAnimationFrame(f);
    for (let i = 0; i <= 60; i++) { scrollTo(0, (total * i) / 60); await new Promise((r) => setTimeout(r, 33)); }
    for (let i = 60; i >= 0; i -= 2) { scrollTo(0, (total * i) / 60); await new Promise((r) => setTimeout(r, 33)); }
    running = false;
    return Math.round((frames / (performance.now() - t0)) * 1000);
  });
  await page.waitForTimeout(1500);
  console.log(`== ${name}: initial JS ${(js / 1024).toFixed(0)} KB in ${jsFiles} files · images before scroll ${(imgBeforeScroll / 1024 / 1024).toFixed(1)} MB · after hero scrub ${(img / 1024 / 1024).toFixed(1)} MB · LCP ${m.lcp} ms · CLS ${m.cls} · scrub ${fps} fps (software GL)`);
  await ctx.close();
}
await browser.close();
