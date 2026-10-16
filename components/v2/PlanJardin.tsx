"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import InkLine from "./InkLine";
import { contour } from "./lineShapes";

const STATES = [
  { n: "01", label: "État initial", src: "/media/v2/saint-maurice-1-etat-initial.jpg", alt: "Chantier devant une façade rouge : bloc de pierre et palettes sur gravier" },
  { n: "02", label: "Projection", src: "/media/v2/saint-maurice-2-projection.jpg", alt: "Photomontage de l’entrée : graminées et poteaux noirs autour du bloc" },
  { n: "03", label: "Réalisation", src: "/media/v2/saint-maurice-3-realisation.jpg", alt: "Entrée réalisée : bloc de pierre, stèles d’ardoise, graminées et gravier sombre" },
];

export default function PlanJardin() {
  const section = useRef<HTMLElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const build = useCallback((w: number, h: number) => {
    const b = band.current;
    return contour(w, h, b ? b.offsetTop : h * 0.4, b ? b.offsetTop + b.offsetHeight : h * 0.7);
  }, []);

  return (
    <section ref={section} id="plan-au-jardin" className="on-dark relative scroll-mt-16" aria-labelledby="plan-title">
      <InkLine build={build} start="top 80%" end="bottom 75%" className="on-dark-line" />
      <div className="plan-grid" aria-hidden="true" />
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-[6.6vw] lg:py-[12vh]">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <div className="head">
              <span className="head-veil" aria-hidden="true" />
            <p className="mono dim-label">Saint-Maurice (VS) <span className="dim-line" aria-hidden="true" /> Entrée de maison</p>
            <h2 id="plan-title" data-audit className="font-display mt-4 text-[clamp(2.6rem,5.2vw,5rem)] leading-[0.96] font-bold tracking-[-0.03em]">
              Le même trait, trois états.
            </h2>
            </div>
          </div>
          <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed opacity-85 lg:col-span-5 lg:col-start-8 lg:mt-3">
            La projection est un photomontage d’étude&nbsp;; la réalisation est le jardin construit.
          </p>
        </div>

        <div ref={band} className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {STATES.map((s, i) => (
            <figure key={s.n} className="rv state" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="relative aspect-[840/458] w-full overflow-hidden">
                <Image src={s.src} alt={s.alt} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-4 flex items-baseline gap-4">
                <span className="font-display text-[1.6rem] leading-none font-bold">{s.n}</span>
                <span className="mono type-in"><span className="type-in-text">{s.label}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
        <a href="https://www.germa-paysages.ch/fr/projet-dachitecture-paysagere-realisation-dune-entree-de-maison-saint-maurice" className="link-draw mt-12 inline-block">
          Voir le projet
        </a>
      </div>
    </section>
  );
}
