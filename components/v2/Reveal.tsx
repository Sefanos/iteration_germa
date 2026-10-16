"use client";

import { useEffect } from "react";

/** Quiet entrances: `.rv` elements get `.in` when they enter the viewport. Opacity and transform only; CSS handles reduced motion. */
export default function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rv, .board");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onFocus = (e: FocusEvent) => (e.target as HTMLElement).closest?.(".rv, .board")?.classList.add("in");
    document.addEventListener("focusin", onFocus);
    return () => { io.disconnect(); document.removeEventListener("focusin", onFocus); };
  }, []);
  return null;
}
