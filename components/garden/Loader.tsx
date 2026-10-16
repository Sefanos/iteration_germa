"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Page loader: a moss curtain with the wordmark line, lifting once the first frame is ready (or after 2.5 s). */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let done = false;
    const lift = () => {
      if (done) return; done = true;
      if (reduce) { el.remove(); document.body.classList.remove("loading"); return; }
      gsap.timeline({ onComplete: () => { el.remove(); } })
        .to(".loader-line", { yPercent: -110, duration: 0.6, ease: "power3.in" }, 0)
        .to(el, { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, 0.2)
        .add(() => document.body.classList.remove("loading"), 0.5);
    };
    document.body.classList.add("loading");
    gsap.fromTo(".loader-line", { yPercent: 110 }, { yPercent: 0, duration: reduce ? 0 : 0.8, ease: "power3.out", delay: 0.1 });
    const onReady = () => lift();
    document.addEventListener("garden:ready", onReady, { once: true });
    const t = setTimeout(lift, 2500);
    return () => { clearTimeout(t); document.removeEventListener("garden:ready", onReady); };
  }, []);
  return (
    <div ref={ref} className="loader" aria-hidden="true">
      <div className="loader-mask"><p className="loader-line">Germa Paysages</p></div>
    </div>
  );
}
