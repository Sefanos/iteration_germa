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
  const head = useRef<HTMLDivElement>(null);

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
          scrollTrigger: {
            trigger: s,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        ScrollTrigger.refresh();
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
    <section ref={section} id="realisations" className="planches relative scroll-mt-16 overflow-hidden" aria-labelledby="planches-title">
      <InkLine build={build} start="top 85%" end="top 0%" />
      <div ref={head} className="mx-auto max-w-[1440px] px-5 pt-20 pb-10 sm:px-8 lg:px-[6.6vw] lg:pt-[9vh] lg:pb-[5vh]">
        <p className="mono text-graphite">Planches 01–06</p>
        <h2 id="planches-title" className="font-display mt-4 text-[clamp(2.4rem,4.6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.03em] text-ink">
          Six planches, six jardins.
        </h2>
      </div>

      <div ref={track} className="track flex flex-col gap-10 px-5 pb-20 sm:px-8 lg:w-max lg:flex-row lg:gap-8 lg:px-[6.6vw] lg:pb-[8vh]">
        {projects.map((p, i) => (
          <article key={p.slug} className="board w-full bg-panel lg:w-[520px] lg:shrink-0">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width:1024px) 520px, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-3 px-5 pt-5 pb-6">
              <p className="mono text-graphite">
                Planche 0{i + 1}/06 · {NOTES[i]}
              </p>
              <h3 className="font-display text-[1.6rem] leading-tight font-bold tracking-[-0.02em] text-ink">{p.title}</h3>
              <a href={p.url} className="link-ink mt-1 self-start text-ink">
                Voir le projet
              </a>
            </div>
          </article>
        ))}
        <div className="hidden lg:flex lg:w-[260px] lg:shrink-0 lg:items-end">
          <a href={legacy.realisations} className="link-ink text-ink">
            Toutes nos réalisations
          </a>
        </div>
      </div>
      <div className="px-5 pb-16 sm:px-8 lg:hidden">
        <a href={legacy.realisations} className="link-ink text-ink">
          Toutes nos réalisations
        </a>
      </div>
    </section>
  );
}
