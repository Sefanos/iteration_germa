import Image from "next/image";
import { showroom, formatDays, formatHour, formatPhone, telHref, NNBSP } from "@/lib/content";

export default function Showroom() {
  return (
    <section id="showroom" className="scroll-mt-10 bg-forest text-limestone">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <p className="eyebrow text-limestone/80">05 — Showroom</p>
            <h2 className="mt-7 font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.04]">
              Le showroom d’Etoy, pour toucher la matière.
            </h2>
            <p className="mt-7 max-w-[30rem] text-base leading-relaxed text-limestone/80">
              {showroom.locationDescription}, un espace dédié à nos produits d’exposition{NNBSP}: pergola bioclimatique,
              dalles, clôtures. Vous vous y projetez concrètement et discutez de vos attentes avec notre équipe, que
              vous soyez un particulier ou un architecte.
            </p>

            <dl className="mt-10 grid max-w-[30rem] grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-limestone/20 pt-8 text-[0.9375rem]">
              {showroom.hours.map((h) => (
                <div key={h.days.join("-")} className="contents">
                  <dt className="text-limestone/70">{formatDays(h.days)}</dt>
                  <dd className="tabular-nums">
                    {formatHour(h.open)} – {formatHour(h.close)}
                  </dd>
                </div>
              ))}
              <dt className="text-limestone/70">Sur rendez-vous</dt>
              <dd>
                <a href={telHref(showroom.byAppointmentPhone)} className="link-line text-limestone">
                  {formatPhone(showroom.byAppointmentPhone)}
                </a>
              </dd>
            </dl>

            <a href={showroom.url} className="btn-primary btn-primary--light mt-10">
              Visiter notre showroom
            </a>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7 lg:pb-28" data-reveal>
            <figure className="lg:ml-16">
              <div className="frame parallax-media aspect-[4/3] w-full" data-parallax={5} data-wipe="x">
                <Image
                  src="/media/materials/pierre-valais.jpg"
                  alt="Dalles de pierre naturelle grise-verte à joints de gravier, vue de dessus"
                  width={2048}
                  height={1360}
                  sizes="(min-width:1024px) 48vw, 100vw"
                />
              </div>
              <figcaption className="mt-3 text-right text-[0.75rem] tracking-[0.04em] text-limestone/60">
                Pierre naturelle, joints de gravier
              </figcaption>
            </figure>
            <figure className="mt-8 w-[70%] sm:w-[56%] lg:absolute lg:bottom-0 lg:left-0 lg:mt-0 lg:w-[52%]">
              <div className="frame parallax-media aspect-[3/2] w-full border-[6px] border-forest shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]" data-parallax={8} data-wipe="y">
                <Image
                  src="/media/materials/meleze.jpg"
                  alt="Lames de terrasse en mélèze patiné, gris-brun, en lumière rasante"
                  width={2048}
                  height={1360}
                  sizes="(min-width:1024px) 24vw, 70vw"
                />
              </div>
              <figcaption className="mt-3 text-[0.75rem] tracking-[0.04em] text-limestone/60">
                Mélèze patiné
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
