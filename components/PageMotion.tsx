"use client";

import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

/** Scroll-driven motion for the sections below the hero: subtle parallax and reveals. */
export default function PageMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const img = el.querySelector("img");
        if (!img) return;
        const strength = Number(el.dataset.parallax) || 7;
        gsap.fromTo(
          img,
          { yPercent: -strength },
          {
            yPercent: strength,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.4 },
          },
        );
      });

      // Reveals animate opacity only (never visibility), so links inside stay keyboard-focusable.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const tween = gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          paused: true,
        });
        const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => tween.play() });
        // Focus arriving from the keyboard before the element scrolled in: reveal at once.
        el.addEventListener("focusin", () => { tween.progress(1); st.kill(); }, { once: true });
      });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    });

    return () => mm.revert();
  });

  return null;
}
