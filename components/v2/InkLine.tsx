"use client";

import { useEffect, useRef } from "react";

/**
 * One segment of the page's continuous ink line. The path is built from the section's measured size
 * by `build(w, h)`, drawn by stroke-dashoffset as the section scrolls through the viewport, and shown
 * fully drawn under reduced motion. `tip` renders the lime moving tip (dark sections only).
 */
export default function InkLine({
  build,
  tip = false,
  start = "top 85%",
  end = "bottom 60%",
  className = "",
}: {
  build: (w: number, h: number) => string;
  tip?: boolean;
  start?: string;
  end?: string;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const path = el.querySelector<SVGPathElement>("path")!;
    const dot = el.querySelector<SVGCircleElement>("circle");
    let len = 0, last = -1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      const r = host.getBoundingClientRect();
      el.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
      path.setAttribute("d", build(r.width, r.height));
      len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      last = -1;
      draw(reduce.matches ? 1 : progress());
    };
    const parse = (s: string) => {
      const [, pct] = s.split(" ");
      return parseFloat(pct) / 100;
    };
    const progress = () => {
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      const a = start.startsWith("top") ? r.top - vh * parse(start) : r.bottom - vh * parse(start);
      const b = end.startsWith("top") ? r.top - vh * parse(end) : r.bottom - vh * parse(end);
      // progress 0 when `start` is met, 1 when `end` is met
      const t = a === b ? 1 : a / (a - b);
      return Math.min(1, Math.max(0, t));
    };
    const draw = (p: number) => {
      if (Math.abs(p - last) < 0.002) return;
      last = p;
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      if (dot) {
        const pt = path.getPointAtLength(len * p);
        dot.setAttribute("cx", `${pt.x}`);
        dot.setAttribute("cy", `${pt.y}`);
        dot.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";
      }
    };
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        draw(reduce.matches ? 1 : progress());
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    reduce.addEventListener("change", onScroll);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      reduce.removeEventListener("change", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [build, start, end]);

  return (
    <svg ref={svg} className={`ink-line ${className}`} aria-hidden="true" focusable="false">
      <path />
      {tip && <circle r="4.5" fill="var(--color-accent)" style={{ opacity: 0 }} />}
    </svg>
  );
}
