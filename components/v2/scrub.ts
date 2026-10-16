/** Shared scrub maths: smoothstep ramps, seeded rng, text splitting. */

export const smoothstep = (p: number, e0: number, e1: number) => {
  const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export type Band = {
  el: HTMLElement;
  a: number;
  b: number;
  first: boolean;
  last: boolean;
  ramp: number | null;
  op: number;
  k: number;
};

/** Band opacity: smoothstep ramps, first band skips the ease-in, last band skips the ease-out. */
export function bandOpacity(p: number, band: Band) {
  const f = Math.min(0.02, (band.b - band.a) / 3);
  const inp = band.first ? 1 : smoothstep(p, band.a, band.a + f);
  const out = band.last ? 1 : 1 - smoothstep(p, band.b - f, band.b);
  return inp * out;
}

/** Assembly progress --k: settles roughly 20vh into the band. */
export function bandK(p: number, band: Band) {
  const ramp = band.ramp ?? Math.min(0.025, (band.b - band.a) * 0.35);
  return clamp((p - band.a) / ramp, 0, 1);
}

/**
 * Split an element's text into word and character spans with seeded thresholds.
 * Keeps a visually hidden copy of the sentence for assistive tech.
 * mode "write": ordered thresholds (reading order). "scatter": random thresholds.
 */
export function splitText(el: HTMLElement, mode: "write" | "words" | "sweep", seed = 7, spread = 0.7) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = "1";
  const text = el.textContent ?? "";
  const r = rng(seed);
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = text;
  const vis = document.createElement("span");
  vis.setAttribute("aria-hidden", "true");
  const words = text.split(/(\s+)/);
  const chars = text.replace(/\s+/g, "").length;
  let ci = 0;
  let wi = 0;
  const wordCount = words.filter((w) => w.trim()).length;
  for (const w of words) {
    if (!w.trim()) {
      vis.appendChild(document.createTextNode(" "));
      continue;
    }
    const ws = document.createElement("span");
    ws.className = "w";
    if (mode === "words") {
      ws.style.setProperty("--th", ((wi / Math.max(1, wordCount)) * spread + r() * 0.04).toFixed(3));
    }
    if (mode === "words") {
      ws.textContent = w;
    } else {
      for (const ch of w) {
        const cs = document.createElement("span");
        cs.className = "c";
        cs.textContent = ch;
        const th = (ci / Math.max(1, chars)) * spread + r() * 0.05;
        cs.style.setProperty("--th", th.toFixed(3));
        ws.appendChild(cs);
        ci++;
      }
    }
    vis.appendChild(ws);
    wi++;
  }
  el.textContent = "";
  el.appendChild(sr);
  el.appendChild(vis);
}
