"use client";

import { useEffect, useRef } from "react";
import { bus } from "./state";

/** A small sun on an arc in the nav: afternoon at the top of the page, evening by the contact. */
export default function SunArc() {
  const dot = useRef<SVGCircleElement>(null);
  useEffect(() => {
    let last = -1;
    const prev = bus.sun;
    const update = () => {
      const t = bus.dusk;
      if (Math.abs(t - last) < 0.01 || !dot.current) return;
      last = t;
      const a = Math.PI * (0.25 + 0.6 * t);
      dot.current.setAttribute("cx", (40 + 30 * Math.cos(Math.PI - a)).toFixed(1));
      dot.current.setAttribute("cy", (30 - 24 * Math.sin(a)).toFixed(1));
      dot.current.style.opacity = `${0.95 - 0.35 * t}`;
    };
    bus.sun = update;
    update();
    return () => { bus.sun = prev; };
  }, []);
  return (
    <svg className="sun-arc" viewBox="0 0 80 34" aria-hidden="true" focusable="false">
      <path d="M8 30 A32 32 0 0 1 72 30" />
      <path d="M4 30 H76" className="horizon" />
      <circle ref={dot} r="3.2" cx="40" cy="6" />
    </svg>
  );
}
