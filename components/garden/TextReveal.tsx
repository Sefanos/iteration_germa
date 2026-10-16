"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

/**
 * Mejuma-style text system: every [data-reveal-lines] splits into masked lines that rise as it enters,
 * [data-reveal-words] staggers words, [data-reveal] fades up. Opacity/transform only, reversible, keyboard-safe.
 */
export default function TextReveal() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const splits: SplitText[] = [];
      document.querySelectorAll<HTMLElement>("[data-reveal-lines]").forEach((el) => {
        const s = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "rl-line", autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.1, stagger: 0.08, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }) });
        splits.push(s);
      });
      document.querySelectorAll<HTMLElement>("[data-reveal-words]").forEach((el) => {
        const s = SplitText.create(el, { type: "words", wordsClass: "rl-word" });
        gsap.from(s.words, { y: 14, opacity: 0, duration: 0.8, stagger: 0.025, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        splits.push(s);
      });
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 24, opacity: 0, duration: 1, ease: "power3.out", delay: Number(el.dataset.reveal || 0), scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });
      document.addEventListener("focusin", (e) => { const t = (e.target as HTMLElement).closest("[data-reveal], [data-reveal-lines], [data-reveal-words]"); if (t) gsap.set(t.querySelectorAll(".rl-line, .rl-word"), { clearProps: "all" }); });
      return () => splits.forEach((s) => s.revert());
    });
    return () => mm.revert();
  }, []);
  return null;
}
