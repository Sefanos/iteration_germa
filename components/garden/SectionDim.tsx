"use client";

import { useEffect } from "react";

/** Toggles a quiet darkening of the garden once the visitor is below the hero (light type from there on). */
export default function SectionDim() {
  useEffect(() => {
    const film = document.querySelector(".film");
    if (!film) return;
    const io = new IntersectionObserver((e) => document.body.classList.toggle("below-hero", !e[0].isIntersecting), { rootMargin: "0px 0px -60% 0px", threshold: 0 });
    io.observe(film);
    return () => { io.disconnect(); document.body.classList.remove("below-hero"); };
  }, []);
  return <div className="section-dim" aria-hidden="true" />;
}
