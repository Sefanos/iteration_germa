// Static mockups of the v2 hero: desktop at six scroll beats, phone static hero. → pitch/v2/
import { launch, BASE } from "./browser.mjs";
import { mkdirSync } from "node:fs";
mkdirSync("pitch/v4", { recursive: true });
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("pageerror:", String(e)));
page.on("console", (m) => { if (m.type() === "error") console.log("console:", m.text()); });
await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.classList.contains("arrived"), null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(3500);
const range = await page.evaluate(() => document.querySelector(".film").offsetHeight - innerHeight);
const beats = { "00-arrival": 0.0, "01-imaginer": 0.24, "02-concevoir": 0.42, "03-realiser": 0.6, "04-faire-vivre": 0.76, "05-settle": 0.95 };
for (const [name, p] of Object.entries(beats)) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(range * p));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `pitch/v4/hero-1440-${name}.png`, animations: "disabled", timeout: 90000 });
}
await page.close();
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const pp = await phone.newPage();
await pp.goto(BASE, { waitUntil: "networkidle" });
  await pp.waitForFunction(() => document.body.classList.contains("arrived"), null, { timeout: 15000 }).catch(() => {});
await pp.waitForTimeout(1500);
await pp.screenshot({ path: "pitch/v4/hero-390.png", animations: "disabled", timeout: 90000 });
await phone.close();
await browser.close();
console.log("mockups saved to pitch/v4/");
