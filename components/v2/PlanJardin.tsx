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
    const top = b ? b.offsetTop : h * 0.4;
    const bottom = b ? b.offsetTop + b.offsetHeight : h * 0.7;
    return contour(w, h, top, bottom);
  }, []);

  return (
    <section ref={section} id="plan-au-jardin" className="relative scroll-mt-16" aria-labelledby="plan-title">
      <InkLine build={build} start="top 80%" end="bottom 75%" />
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-[6.6vw] lg:py-[12vh]">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="mono text-graphite">Saint-Maurice (VS) · Entrée de maison</p>
            <h2 id="plan-title" className="font-display mt-4 text-[clamp(2.4rem,4.6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.03em] text-ink">
              Le même trait, trois états.
            </h2>
          </div>
          <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-graphite lg:col-span-5 lg:col-start-8 lg:mt-3">
            La projection est un photomontage d’étude&nbsp;; la réalisation est le jardin construit.
          </p>
        </div>

        <div ref={band} className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {STATES.map((s) => (
            <figure key={s.n} className="rv bg-panel">
              <div className="relative aspect-[840/458] w-full overflow-hidden">
                <Image src={s.src} alt={s.alt} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="flex items-baseline gap-4 px-4 py-4">
                <span className="font-display text-[1.6rem] leading-none font-bold text-ink">{s.n}</span>
                <span className="mono text-graphite">{s.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <a href="https://www.germa-paysages.ch/fr/projet-dachitecture-paysagere-realisation-dune-entree-de-maison-saint-maurice" className="link-ink mt-10 inline-block text-ink">
          Voir le projet
        </a>
      </div>
    </section>
  );
}
