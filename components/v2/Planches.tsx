"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { projects, legacy } from "@/lib/content";
import InkLine from "./InkLine";
import { planches } from "./lineShapes";

const NOTES = [
  "Chermignon (VS) · Conception, aménagement",
  "Chablais (VS) · Massif minéral",
  "Villars-sur-Ollon (VD) · Spa, pierre",
  "Terrasse et soutènement en mélèze",
  "Mur et terrasse en pierre naturelle",
  "Saint-Maurice (VS) · Conception",
];

export default function Planches() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const s = section.current!;
        const dist = () => Math.max(0, t.scrollWidth - window.innerWidth + 96);
        gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: s, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        ScrollTrigger.refresh();
      });
      // boards tilt a degree toward the cursor, like a sheet lifted from the board
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const boards = gsap.utils.toArray<HTMLElement>(".board");
        const handlers: [HTMLElement, (e: PointerEvent) => void, () => void][] = [];
        boards.forEach((b) => {
          const rx = gsap.quickTo(b, "rotationX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(b, "rotationY", { duration: 0.6, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = b.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
            rx(-py * 3); ry(px * 3);
          };
          const leave = () => { rx(0); ry(0); };
          b.addEventListener("pointermove", move); b.addEventListener("pointerleave", leave);
          handlers.push([b, move, leave]);
        });
        return () => handlers.forEach(([b, m, l]) => { b.removeEventListener("pointermove", m); b.removeEventListener("pointerleave", l); });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  const build = useCallback((w: number, h: number) => {
    const t = track.current;
    const top = (t?.offsetTop ?? h * 0.4) - 18;
    const bottom = t ? t.offsetTop + t.offsetHeight - 40 : h * 0.9;
    return planches(w, h, top, bottom);
  }, []);

  return (
    <section ref={section} id="realisations" className="planches on-dark relative scroll-mt-16 overflow-hidden" aria-labelledby="planches-title">
      <InkLine build={build} start="top 85%" end="top 0%" className="on-dark-line" />
      <div className="mx-auto max-w-[1440px] px-5 pt-20 pb-10 sm:px-8 lg:px-[6.6vw] lg:pt-[9vh] lg:pb-[5vh]">
        <div className="head">
          <span className="head-veil" aria-hidden="true" />
        <p className="mono dim-label" data-reveal>Planches 01–06 <span className="dim-line" aria-hidden="true" /> Plan masse</p>
        <h2 id="planches-title" data-audit data-reveal-lines className="font-display mt-4 text-[clamp(2.6rem,5.2vw,5rem)] leading-[0.96] font-bold tracking-[-0.03em]">
          Six planches, six jardins.
        </h2>
        </div>
        <p className="mono mt-5 max-w-[60ch] normal-case opacity-80">Les photos ci-dessous sont des réalisations Germa. Le jardin du film est une vision.</p>
      </div>

      <div ref={track} className="track flex flex-col gap-12 px-5 pb-20 sm:px-8 lg:w-max lg:flex-row lg:gap-10 lg:px-[6.6vw] lg:pb-[8vh]" style={{ perspective: "1600px" }}>
        {projects.map((p, i) => (
          <article key={p.slug} className="board w-full lg:w-[560px] lg:shrink-0" data-cursor>
            <a href={p.url} className="group block" aria-label={`${p.title}, ${NOTES[i]} (page sur germa-paysages.ch)`}>
              <div className="board-photo relative aspect-[3/2] w-full overflow-hidden">
                <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035]" />
                <span className="hatch" aria-hidden="true" />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-6">
                <div>
                  <p className="mono type-in">
                    <span className="type-in-text">Planche 0{i + 1}/06 · {NOTES[i]}</span>
                  </p>
                  <h3 className="font-display mt-2 text-[1.75rem] leading-tight font-bold tracking-[-0.02em]">{p.title}</h3>
                </div>
                <span className="link-draw project-cta shrink-0">Voir le projet</span>
              </div>
            </a>
          </article>
        ))}
        <div className="hidden lg:flex lg:w-[260px] lg:shrink-0 lg:items-end lg:pb-16">
          <a href={legacy.realisations} className="link-draw">Toutes nos réalisations</a>
        </div>
      </div>
      <div className="px-5 pb-16 sm:px-8 lg:hidden">
        <a href={legacy.realisations} className="link-draw">Toutes nos réalisations</a>
      </div>
    </section>
  );
}
