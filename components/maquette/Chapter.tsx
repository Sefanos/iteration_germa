"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { sceneState, sceneBus, SEQUENCE } from "./state";
import { NNBSP } from "@/lib/content";

// The sequence renderer and its frames stay out of the initial bundle.
const Sequence = dynamic(() => import("./Sequence"), { ssr: false });

const PHASES = [
  { word: "Imaginer", text: "Le plan se dessine sur le terrain : allée, terrasse, massifs." },
  { word: "Concevoir", text: "Les volumes se lèvent : mur de soutènement, escaliers, terrasse, pergola." },
  { word: "Réaliser", text: "La pierre, le bois et le gravier prennent leur place, puis les arbres et les graminées." },
  { word: "Faire vivre", text: "La lumière de fin d’après-midi, les graminées qui ondulent : le jardin vit." },
];

export default function Chapter() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"pending" | "sequence" | "poster">("pending");
  const [near, setNear] = useState(false);
  const [drawn, setDrawn] = useState(false);

  // Fallback decision: reduced motion, saveData or no frames → poster.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setMode(reduce || conn?.saveData || SEQUENCE.count === 0 ? "poster" : "sequence");
  }, []);

  // Load the frames only when the chapter is within about one viewport.
  useEffect(() => {
    if (!root.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          sceneState.visible = e.isIntersecting;
          if (e.isIntersecting) setNear(true);
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  const onFirstFrame = useCallback(() => setDrawn(true), []);

  useGSAP(
    () => {
      if (mode === "pending") return;
      const stage = root.current!;
      const words = gsap.utils.toArray<HTMLElement>(".phase");

      // One master timeline writes the frame index and the DOM words. 10 units = the whole chapter.
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      tl.to(sceneState, { frame: Math.max(0, SEQUENCE.count - 1), duration: 10, onUpdate: () => sceneBus.invalidate?.() }, 0);

      // Four phases over four equal clips.
      const windows: [number, number][] = [[0, 2.5], [2.5, 5.0], [5.0, 7.5], [7.5, 10]];
      words.forEach((w, i) => {
        const [a, b] = windows[i];
        const rule = w.querySelector(".phase-rule");
        tl.to(w, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }, Math.max(0, a - 0.2));
        if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: b - a, ease: "none" }, a);
        if (i < words.length - 1) tl.to(w, { opacity: 0.28, duration: 0.5, ease: "power2.out" }, b - 0.1);
      });
      tl.to({}, { duration: 0.01 }, 10);

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions!;
          if (reduce) {
            // No pin, no scrub: the poster stays and the four words read as a plain list.
            words.forEach((w) => gsap.set(w, { opacity: 1, x: 0 }));
            gsap.set(".phase-rule", { scaleX: 1 });
            return;
          }
          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: desktop ? "+=220%" : "+=140%",
            pin: true,
            scrub: 0.9,
            animation: tl,
            anticipatePin: 1,
            refreshPriority: 1,
          });
          // This pin is created after the page-level triggers: recompute their positions.
          ScrollTrigger.refresh();
        },
      );

      return () => {
        mm.revert();
        tl.kill();
      };
    },
    { scope: root, dependencies: [mode] },
  );

  return (
    <section
      ref={root}
      id="maquette"
      className="maquette relative h-[100svh] min-h-[600px] overflow-hidden"
      aria-labelledby="maquette-title"
    >
      <div className="absolute inset-0">
        <Image
          src={SEQUENCE.poster}
          alt="Maquette d’étude d’un jardin en pente, illustration"
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${drawn ? "opacity-0" : "opacity-100"}`}
        />
        {mode === "sequence" && near && <Sequence onFirstFrame={onFirstFrame} />}
      </div>

      {/* Real DOM text over the sequence */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="pointer-events-auto max-w-[34rem]">
          <p className="eyebrow text-forest">02 — Notre approche</p>
          <h2 id="maquette-title" className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] leading-[1.02] text-forest">
            La nature prend forme.
          </h2>
          <p className="mt-4 max-w-[26rem] text-[0.9375rem] leading-relaxed text-charcoal/75">
            Un jardin naît comme une maquette d’architecte{NNBSP}: un plan, des volumes, des matériaux, puis la vie.
          </p>
        </div>

        <div>
          <ol className="pointer-events-auto grid max-w-[1100px] grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4 lg:gap-x-10" aria-label="Les quatre phases">
            {PHASES.map((p, i) => (
              <li key={p.word} className="phase lg:translate-x-[-6px]" style={{ opacity: 0.28 }}>
                <span className="phase-rule block h-px w-full origin-left bg-terracotta" style={{ transform: "scaleX(0)" }} />
                <p className="mt-3 font-display text-[1.5rem] leading-none text-terracotta">0{i + 1}</p>
                <h3 className="mt-1 font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-none text-forest">{p.word}.</h3>
                <p className="mt-2 hidden max-w-[16rem] text-[0.8125rem] leading-relaxed text-charcoal/75 sm:block">{p.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[0.6875rem] tracking-[0.06em] text-charcoal/50">Maquette d’étude, illustration.</p>
        </div>
      </div>
    </section>
  );
}
