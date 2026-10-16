"use client";

import { useEffect, useMemo, useRef } from "react";

/** Topographic contour hairlines over the whole page: the site plan under everything. Drifts slowly, parallaxes with scroll. */
export default function Contours() {
  const ref = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => {
    let s = 17 >>> 0;
    const r = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    const out: string[] = [];
    for (let k = 0; k < 11; k++) {
      const cx = 1100 + k * 26, cy = 760 + k * 18, rx = 420 + k * 95, ry = 170 + k * 62;
      const pts: string[] = [];
      const n = 48;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        const w = 1 + 0.07 * Math.sin(a * 3 + k) + 0.05 * Math.sin(a * 7 + k * 2.3) + 0.02 * (r() - 0.5);
        pts.push(`${(cx + Math.cos(a) * rx * w).toFixed(1)} ${(cy + Math.sin(a) * ry * w).toFixed(1)}`);
      }
      out.push(`M ${pts.join(" L ")} Z`);
    }
    return out;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null || reduce.matches) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        el.style.setProperty("--cy", `${(-window.scrollY * 0.06).toFixed(1)}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf !== null) cancelAnimationFrame(raf); };
  }, []);

  return (
    <svg ref={ref} className="contours" viewBox="0 0 2400 1600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g className="contours-drift">
        {paths.map((d, i) => (
          <path key={i} d={d} className={i % 5 === 0 ? "major" : ""} />
        ))}
      </g>
    </svg>
  );
}
