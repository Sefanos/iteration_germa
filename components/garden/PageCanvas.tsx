"use client";

import { useEffect, useRef } from "react";
import { filmState, bus, GARDEN, clamp } from "./state";

/**
 * The one canvas behind the whole page. It draws the nearest loaded frame of the full sequence
 * (construction film, then the exploration clips) at the index the scroll drives write.
 * Frames load progressively, the current chapter first, four at a time. Nothing is drawn twice.
 */
export default function PageCanvas({ onReady }: { onReady?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c || GARDEN.frameCount === 0) return;
    const ctx = c.getContext("2d", { alpha: false });
    if (!ctx) return;
    const width = window.innerWidth < 900 ? 800 : 1280;
    const n = GARDEN.frameCount;
    const srcs = Array.from({ length: n }, (_, i) => `${GARDEN.frameDir}/${width}/f${String(i + 1).padStart(3, "0")}.webp`);
    const imgs: (HTMLImageElement | null)[] = new Array(n).fill(null);
    const loaded = (i: number) => { const im = imgs[i]; return !!(im && im.complete && im.naturalWidth > 0); };
    let raf = 0, disposed = false, last = -1, ready = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(c.clientWidth * dpr), h = Math.round(c.clientHeight * dpr);
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; last = -1; }
    };
    const draw = () => {
      raf = 0;
      if (disposed) return;
      size();
      const want = Math.round(clamp(filmState.frame, 0, n - 1));
      // nearest loaded frame at or below the wanted one, else the nearest above
      let i = want; while (i >= 0 && !loaded(i)) i--;
      if (i < 0) { i = want; while (i < n && !loaded(i)) i++; if (i >= n) return; }
      if (i === last) return;
      const img = imgs[i]!;
      const cw = c.width, ch = c.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      last = i;
      if (!ready) { ready = true; onReady?.(); }
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(draw); };
    bus.film = request;

    // progressive loading: every 8th frame first (so scrubbing never shows a hole), then nearest-to-current outward
    let inflight = 0;
    const pending = new Set<number>();
    const load = (i: number) => {
      if (imgs[i] || pending.has(i)) return;
      pending.add(i); inflight++;
      const im = new Image(); im.decoding = "async";
      im.onload = () => { imgs[i] = im; pending.delete(i); inflight--; if (Math.abs(i - filmState.frame) < 12 || i === 0) request(); pump(); };
      im.onerror = () => { pending.delete(i); inflight--; pump(); };
      im.src = srcs[i];
    };
    const pump = () => {
      if (disposed) return;
      while (inflight < 4) {
        const cur = Math.round(clamp(filmState.frame, 0, n - 1));
        let next = -1;
        for (let k = 0; k < n && next < 0; k += 8) if (!imgs[k] && !pending.has(k)) next = k;
        for (let d = 0; d < n && next < 0; d++) { const a = cur + d, b = cur - d; if (a < n && !imgs[a] && !pending.has(a)) next = a; else if (b >= 0 && !imgs[b] && !pending.has(b)) next = b; }
        if (next < 0) return;
        load(next);
      }
    };
    pump();
    const onResize = () => request();
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      if (bus.film === request) bus.film = null;
    };
  }, [onReady]);

  return <canvas ref={ref} className="page-canvas" aria-hidden="true" />;
}
