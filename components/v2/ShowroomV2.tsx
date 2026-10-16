"use client";

import Image from "next/image";
import { showroom, formatDays, formatHour, formatPhone, telHref } from "@/lib/content";
import InkLine from "./InkLine";
import { showroom as showroomShape } from "./lineShapes";

export default function ShowroomV2() {
  return (
    <section id="showroom" className="on-moss relative scroll-mt-16 bg-moss text-moss-text" aria-labelledby="showroom-title">
      <InkLine build={showroomShape} tip start="top 80%" end="bottom 70%" className="on-moss-line" />
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-[6.6vw] lg:py-[12vh]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* the material wall */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-6 lg:gap-5">
            <figure className="rv">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image src="/media/materials/pierre-valais.jpg" alt="Dalles de pierre naturelle grise-verte à joints de gravier, vue de dessus" fill sizes="(min-width:1024px) 24vw, 46vw" className="object-cover" />
              </div>
              <figcaption className="mono mt-3 text-moss-secondary">M1 · Pierre naturelle</figcaption>
            </figure>
            <figure className="rv mt-10 lg:mt-16">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image src="/media/materials/meleze.jpg" alt="Lames de terrasse en mélèze patiné, gris-brun, en lumière rasante" fill sizes="(min-width:1024px) 24vw, 46vw" className="object-cover" />
              </div>
              <figcaption className="mono mt-3 text-moss-secondary">M2 · Mélèze</figcaption>
            </figure>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="mono text-moss-secondary">Etoy (VD) · Showroom</p>
            <h2 id="showroom-title" className="font-display mt-4 text-[clamp(2.4rem,4.6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.03em] text-moss-text">
              Toucher la matière.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-moss-secondary">
              Un espace dédié à nos produits d’exposition, pour vous projeter concrètement et discuter de vos attentes avec notre équipe, que vous soyez un particulier ou un architecte.
            </p>
            <dl className="mono mt-8 grid max-w-[30rem] grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 border-t border-moss-secondary/40 pt-6 text-moss-text">
              {showroom.hours.map((h) => (
                <div key={h.days.join("-")} className="contents">
                  <dt className="text-moss-secondary normal-case">{formatDays(h.days)}</dt>
                  <dd className="tabular-nums">
                    {formatHour(h.open)} – {formatHour(h.close)}
                  </dd>
                </div>
              ))}
              <dt className="text-moss-secondary normal-case">Sur rendez-vous</dt>
              <dd>
                <a href={telHref(showroom.byAppointmentPhone)} className="underline decoration-moss-secondary underline-offset-4">
                  {formatPhone(showroom.byAppointmentPhone)}
                </a>
              </dd>
            </dl>
            <a href={showroom.url} className="btn-cta mt-9">
              Visiter notre showroom
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
