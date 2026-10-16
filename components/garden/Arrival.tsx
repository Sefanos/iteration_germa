"use client";

import { useEffect } from "react";
import { filmState, bus, chapter } from "./state";

/**
 * The fly-in. On load the "arrival" chapter plays once by time (not scroll), the Germa wordmark standing over the lake
 * and lifting as the camera lands on the bare plot; then scroll owns the film. A scroll during the arrival skips to its end.
 * Reduced motion and the static gates never mount this.
 */
export default function Arrival() {
  useEffect(() => {
    const arr = chapter("arrival");
    if (arr.end <= arr.start) { bus.wordmark?.(1); document.body.classList.add("arrived"); return; }
    filmState.frame = arr.start;
    bus.film?.();
    // Own clock with a capped step, so a stalled main thread (frames decoding) never fast-forwards the fly-in.
    const DURATION = 9, DELAY = 0.4;
    let t = 0, raf = 0, running = false, done = false;
    const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    const render = () => {
      const e = ease(Math.min(1, Math.max(0, (t - DELAY) / DURATION)));
      filmState.frame = arr.start + (arr.end - arr.start) * e;
      bus.film?.();
      bus.wordmark?.(Math.min(1, Math.max(0, (e - 0.62) / 0.26)));
    };
    const finish = () => {
      if (done) return; done = true; running = false;
      t = DELAY + DURATION; render();
      document.body.classList.add("arrived");
      document.dispatchEvent(new Event("garden:arrived"));
      window.removeEventListener("wheel", skip); window.removeEventListener("touchstart", skip); window.removeEventListener("keydown", skip);
    };
    let startAt = 0;
    const tick = (now: number) => {
      if (!startAt) startAt = now;
      t = (now - startAt) / 1000; // wall clock: the fly-in always lasts its 9 s, whatever the frame rate
      render();
      if (t >= DELAY + DURATION) finish(); else if (running) raf = requestAnimationFrame(tick);
    };
    const start = () => { if (running || done || (window as unknown as { __arrivalStarted?: boolean }).__arrivalStarted) return; (window as unknown as { __arrivalStarted?: boolean }).__arrivalStarted = true; running = true; raf = requestAnimationFrame(tick); };
    const skip = (e: Event) => { if (!done) { console.info("arrival skipped by", e.type); finish(); } };
    document.addEventListener("garden:ready", start, { once: true });
    const fallback = setTimeout(start, 12000); // safety only: the first drawn frame is what normally starts it
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("keydown", skip);
    render();
    return () => { clearTimeout(fallback); running = false; if (raf) cancelAnimationFrame(raf); window.removeEventListener("wheel", skip); window.removeEventListener("touchstart", skip); window.removeEventListener("keydown", skip); };
  }, []);
  return null;
}
