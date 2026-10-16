"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { families } from "@/lib/content";
import InkLine from "./InkLine";
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

  // On touch screens the preview shows for the row nearest the centre of the viewport.
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("in", e.isIntersecting)),
      { rootMargin: "-40% 0px -40% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const build = useCallback((w: number, h: number) => {
    const ys = rows.current.filter(Boolean).map((r) => r!.offsetTop + 28);
    return indexShape(w, h, ys);
  }, []);

  return (
    <section ref={section} id="savoir-faire" className="relative scroll-mt-16" aria-labelledby="index-title">
      <InkLine build={build} start="top 80%" end="bottom 70%" />
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-[6.6vw] lg:py-[12vh]">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="mono text-graphite">Index · Savoir-faire</p>
            <h2 id="index-title" className="font-display mt-4 text-[clamp(2.4rem,4.6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.03em] text-ink">
              Six métiers, une équipe.
            </h2>
          </div>
        </div>

        <ol className="mt-12 border-t border-panel-edge lg:mt-16">
          {families.map((f, i) => (
            <li key={f.id} ref={(el) => { rows.current[i] = el; }} className="idx-row relative border-b border-panel-edge">
              <a href={f.url} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 py-6 lg:grid-cols-[7rem_minmax(0,22rem)_1fr_14rem] lg:gap-x-8 lg:py-7">
                <span className="font-display text-[2rem] leading-none font-bold tracking-[-0.03em] text-ink lg:text-[3.5rem]">{f.number}</span>
                <span className="font-display text-[1.35rem] leading-tight font-bold tracking-[-0.02em] text-ink lg:text-[1.6rem]">{f.title}</span>
                <span className="col-start-2 mt-2 max-w-[48ch] text-[0.9375rem] leading-relaxed text-graphite lg:col-start-3 lg:mt-0">{LINES[i]}</span>
                <span className="link-ink col-start-2 mt-3 justify-self-start text-ink lg:col-start-4 lg:mt-0 lg:justify-self-end">{f.linkLabel}</span>
              </a>
              <div className="idx-preview pointer-events-none absolute top-1/2 right-[14rem] hidden aspect-[3/2] w-[260px] -translate-y-1/2 overflow-hidden bg-panel lg:block" aria-hidden="true">
                <Image src={f.photo.src} alt="" fill sizes="260px" className="object-cover" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
