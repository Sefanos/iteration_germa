"use client";

import { useEffect, useRef } from "react";

/** A surveyor's crosshair follows a fine pointer; it grows a label over project boards. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      if (Math.abs(tx - x) > 0.2 || Math.abs(ty - y) > 0.2) raf = requestAnimationFrame(tick); else raf = 0;
    };
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; el.classList.add("on"); if (!raf) raf = requestAnimationFrame(tick); };
    const over = (e: PointerEvent) => { const t = (e.target as HTMLElement).closest("[data-cursor]"); el.classList.toggle("label", !!t); el.classList.toggle("link", !!(e.target as HTMLElement).closest("a, button")); };
    const leave = () => el.classList.remove("on");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.body.classList.add("has-cursor");
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over); document.documentElement.removeEventListener("mouseleave", leave); document.body.classList.remove("has-cursor"); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cross" />
      <span className="cursor-label">Voir le projet</span>
    </div>
  );
}
