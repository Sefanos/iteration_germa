"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { families } from "@/lib/content";
import InkLine from "./InkLine";
import PlanSymbol from "@/components/garden/PlanSymbols";
import { index as indexShape } from "./lineShapes";

const LINES = [
  "Plans à la main, sur informatique ou en 3D ; une partie de la conception est déduite si nous réalisons les travaux.",
  "Terrassement, gazon, massifs, arrosage, clôtures et végétaux plantés avec garantie de reprise.",
  "Bois naturel ou WPC, dallages, escaliers, pergolas bioclimatiques.",
  "Soutènement, enrochements, gabions, pierre naturelle au sol et en façade.",
  "Piscines Magiline, spas fournis et posés, biotopes et fontaines.",
  "Taille, élagage, soins au gazon, contrats annuels, machines à batterie sans bruit ni CO₂.",
];

export default function Index() {
  const section = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { rootMargin: "-20% 0px -20% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const io2 = coarse
      ? new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("near", e.isIntersecting)), { rootMargin: "-40% 0px -40% 0px" })
      : null;
    if (io2) rows.current.forEach((r) => r && io2.observe(r));
    return () => { io.disconnect(); io2?.disconnect(); };
  }, []);

  const build = useCallback((w: number, h: number) => indexShape(w, h, rows.current.filter(Boolean).map((r) => r!.offsetTop + 40)), []);

  return (
    <section ref={section} id="savoir-faire" className="on-dark relative scroll-mt-16" aria-labelledby="index-title">
      <InkLine build={build} start="top 80%" end="bottom 70%" className="on-dark-line" />
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-[6.6vw] lg:py-[12vh]">
        <div className="head">
          <span className="head-veil" aria-hidden="true" />
        <p className="mono dim-label">Index <span className="dim-line" aria-hidden="true" /> Savoir-faire</p>
        <h2 id="index-title" data-audit className="font-display mt-4 max-w-[12ch] text-[clamp(2.6rem,5.2vw,5rem)] leading-[0.96] font-bold tracking-[-0.03em]">
          Six métiers, une équipe.
        </h2>
        </div>

        <ol className="mt-14 border-t border-current/25 lg:mt-20">
          {families.map((f, i) => (
            <li key={f.id} ref={(el) => { rows.current[i] = el; }} className="idx-row relative border-b border-current/25">
              <a href={f.url} className="grid grid-cols-[4.5rem_1fr] items-start gap-x-4 py-7 lg:grid-cols-[9rem_5rem_minmax(0,20rem)_1fr_14rem] lg:gap-x-8 lg:py-8">
                <span className="idx-num font-display text-[2.6rem] leading-none font-bold tracking-[-0.04em] lg:text-[5rem]" aria-hidden="true">{f.number}</span>
                <span className="sr-only">{f.number}</span>
                <span className="hidden lg:block"><PlanSymbol id={f.id} /></span>
                <span className="font-display text-[1.4rem] leading-tight font-bold tracking-[-0.02em] lg:text-[1.65rem]">{f.title}</span>
                <span className="col-start-2 mt-2 max-w-[46ch] text-[0.9375rem] leading-relaxed opacity-85 lg:col-start-4 lg:mt-1">{LINES[i]}</span>
                <span className="link-draw col-start-2 mt-3 justify-self-start lg:col-start-5 lg:mt-1 lg:justify-self-end">{f.linkLabel}</span>
              </a>
              <div className="idx-preview pointer-events-none absolute top-1/2 right-[15rem] hidden aspect-[3/2] w-[280px] -translate-y-1/2 overflow-hidden lg:block" aria-hidden="true">
                <Image src={f.photo.src} alt="" fill sizes="280px" className="object-cover" />
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* the breath of expanse: outlined type crossing slowly behind the planting */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track font-display">
          <span>Faire vivre.&nbsp;&nbsp;Imaginer.&nbsp;&nbsp;Concevoir.&nbsp;&nbsp;Réaliser.&nbsp;&nbsp;</span>
          <span>Faire vivre.&nbsp;&nbsp;Imaginer.&nbsp;&nbsp;Concevoir.&nbsp;&nbsp;Réaliser.&nbsp;&nbsp;</span>
        </div>
      </div>
    </section>
  );
}
