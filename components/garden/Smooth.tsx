"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker, so ScrollTrigger and the scrub share one clock.
 * Deliberate deviation from the brief's default: the reference site's feel depends on it. Off under reduced motion
 * and on coarse pointers, where native scrolling is better.
 */
export default function Smooth() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    const stop = () => lenis.stop(), start = () => lenis.start();
    document.addEventListener("menu:open", stop); document.addEventListener("menu:close", start);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); document.removeEventListener("menu:open", stop); document.removeEventListener("menu:close", start); };
  }, []);
  return null;
}
