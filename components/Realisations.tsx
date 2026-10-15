import Image from "next/image";
import { projects, legacy, NNBSP } from "@/lib/content";

/* Editorial, asymmetric placement on the 12-column grid (lg and up). */
const layout = [
  { cls: "lg:col-start-1 lg:col-span-7", aspect: "aspect-[4/3]", sizes: "(min-width:1024px) 55vw, 100vw", parallax: 6 },
  { cls: "lg:col-start-9 lg:col-span-4 lg:mt-40", aspect: "aspect-[4/3]", sizes: "(min-width:1024px) 30vw, 100vw", parallax: 9 },
  { cls: "lg:col-start-2 lg:col-span-5 lg:mt-16", aspect: "aspect-[3/2]", sizes: "(min-width:1024px) 40vw, 100vw", parallax: 8 },
  { cls: "lg:col-start-8 lg:col-span-5 lg:mt-32", aspect: "aspect-[4/3]", sizes: "(min-width:1024px) 40vw, 100vw", parallax: 7 },
  { cls: "lg:col-start-1 lg:col-span-4 lg:mt-6", aspect: "aspect-[4/3]", sizes: "(min-width:1024px) 30vw, 100vw", parallax: 9 },
  { cls: "lg:col-start-6 lg:col-span-6 lg:mt-24", aspect: "aspect-[16/10]", sizes: "(min-width:1024px) 48vw, 100vw", parallax: 6 },
];

export default function Realisations() {
  return (
    <section id="realisations" className="scroll-mt-10">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-3">
            <p className="eyebrow text-forest">03 — Réalisations</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.04] text-forest">
              Six jardins, du Valais à la Côte.
            </h2>
            <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-charcoal/75">
              Chalets d’altitude, jardin zen, murs de pierre et terrasses en mélèze{NNBSP}: chaque projet est conçu,
              puis réalisé par nos propres équipes.
            </p>
          </div>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-y-14 sm:gap-y-20 lg:mt-24 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
          {projects.map((p, i) => {
            const l = layout[i];
            return (
              <li key={p.slug} className={`${l.cls}`} data-reveal>
                <a
                  href={p.url}
                  className="group block"
                  aria-label={`${p.title}, ${p.place} (page sur germa-paysages.ch)`}
                  data-cursor
                >
                  <div className={`frame ${l.aspect} w-full`} data-wipe={i % 3 === 0 ? "y" : i % 3 === 1 ? "x" : "-x"}>
                    <div
                      className="wipe-media parallax-media absolute inset-0 transition-[scale] duration-[1400ms] ease-out group-hover:scale-[1.04]"
                      data-parallax={l.parallax}
                    >
                      <Image
                        src={p.photo.src}
                        alt={p.photo.alt}
                        width={p.photo.width}
                        height={p.photo.height}
                        sizes={l.sizes}
                      />
                    </div>
                  </div>
                  <div className="mt-7 flex items-baseline justify-between gap-6" data-drift={8 + (i % 3) * 5}>
                    <div>
                      <h3 className="font-display text-[2rem] leading-[1.05] text-forest sm:text-[2.6rem]">{p.title}</h3>
                      <p className="mt-1.5 text-[0.8125rem] tracking-[0.04em] text-charcoal/65">
                        {p.place} <span className="mx-2 text-terracotta">·</span> {p.family}
                      </p>
                    </div>
                    <span className="link-line project-cta shrink-0 text-forest">Voir le projet</span>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>

        <div className="mt-20 flex justify-end" data-reveal>
          <a href={legacy.realisations} className="link-line text-forest">
            Toutes nos réalisations
          </a>
        </div>
      </div>
    </section>
  );
}
