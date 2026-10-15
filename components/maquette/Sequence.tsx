"use client";

import { useEffect, useRef } from "react";
import { sceneState, sceneBus, SEQUENCE } from "./state";

/**
 * Scroll-scrubbed image sequence drawn on a canvas (pre-rendered route from the brief).
 * Frames load progressively once the chapter is near; the poster stays underneath until frame 1 is drawn.
 */
export default function Sequence({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c || SEQUENCE.count === 0) return;
    const ctx = c.getContext("2d", { alpha: false });
    if (!ctx) return;

    const width = window.innerWidth < 900 ? SEQUENCE.widths[1] : SEQUENCE.widths[0];
    const frames: (HTMLImageElement | null)[] = new Array(SEQUENCE.count).fill(null);
    let lastDrawn = -1;
    let raf = 0;
    let first = false;
    let disposed = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        lastDrawn = -1;
      }
    };

    const draw = () => {
      raf = 0;
      if (disposed) return;
      size();
      const want = Math.round(Math.max(0, Math.min(SEQUENCE.count - 1, sceneState.frame)));
      // Nearest loaded frame at or below the wanted one, so scrubbing never shows a hole.
      let i = want;
      while (i >= 0 && !frames[i]) i--;
      if (i < 0) return;
      if (i === lastDrawn) return;
      const img = frames[i]!;
      const cw = c.width, ch = c.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawn = i;
      if (!first) {
        first = true;
        onFirstFrame?.();
      }
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    sceneBus.invalidate = request;

    // Progressive load: first frame, last frame, then every frame in order with a little concurrency.
    const order = [0, SEQUENCE.count - 1, ...Array.from({ length: SEQUENCE.count }, (_, i) => i)];
    let cursor = 0;
    const next = () => {
      if (disposed) return;
      while (cursor < order.length && frames[order[cursor]]) cursor++;
      if (cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        frames[i] = img;
        if (i <= Math.round(sceneState.frame) || i === 0) request();
        next();
      };
      img.onerror = next;
      img.src = `/media/maquette/seq/${width}/f${String(i + 1).padStart(3, "0")}.webp`;
    };
    for (let k = 0; k < 4; k++) next();

    const onResize = () => request();
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      if (sceneBus.invalidate === request) sceneBus.invalidate = null;
    };
  }, [onFirstFrame]);

  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
