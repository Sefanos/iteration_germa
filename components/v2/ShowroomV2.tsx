"use client";

import Image from "next/image";
import { showroom, formatDays, formatHour, formatPhone, telHref } from "@/lib/content";
import InkLine from "./InkLine";
import { showroom as showroomShape } from "./lineShapes";

export default function ShowroomV2() {
  return (
    <section id="showroom" className="on-dark on-moss relative scroll-mt-16" aria-labelledby="showroom-title">
      <InkLine build={showroomShape} tip start="top 80%" end="bottom 70%" className="on-dark-line" />
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-[6.6vw] lg:py-[14vh]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="head">
              <span className="head-veil" aria-hidden="true" />
            <p className="mono dim-label" data-reveal>Etoy (VD) <span className="dim-line" aria-hidden="true" /> Showroom</p>
            <h2 id="showroom-title" data-audit data-reveal-lines className="font-display mt-4 text-[clamp(2.6rem,5.2vw,5rem)] leading-[0.96] font-bold tracking-[-0.03em]">
              Toucher la matière.
            </h2>
            </div>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed opacity-85">
              Un espace dédié à nos produits d’exposition, pour vous projeter concrètement et discuter de vos attentes avec notre équipe, que vous soyez un particulier ou un architecte.
            </p>
            <dl className="mono mt-9 grid max-w-[30rem] grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 border-t border-current/30 pt-6">
              {showroom.hours.map((h) => (
                <div key={h.days.join("-")} className="contents">
                  <dt className="opacity-75 normal-case">{formatDays(h.days)}</dt>
                  <dd className="tabular-nums">{formatHour(h.open)} – {formatHour(h.close)}</dd>
                </div>
              ))}
              <dt className="opacity-75 normal-case">Sur rendez-vous</dt>
              <dd><a href={telHref(showroom.byAppointmentPhone)} className="link-draw">{formatPhone(showroom.byAppointmentPhone)}</a></dd>
            </dl>
            <a href={showroom.url} className="btn-cta mt-10">Visiter notre showroom à Etoy</a>
          </div>

          {/* the material wall: two samples lifted from the board */}
          <div className="grid grid-cols-2 gap-5 lg:col-span-6 lg:col-start-7 lg:gap-6" style={{ perspective: "1400px" }}>
            <figure className="rv plate">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image src="/media/materials/pierre-valais.jpg" alt="Dalles de pierre naturelle grise-verte à joints de gravier, vue de dessus" fill sizes="(min-width:1024px) 24vw, 46vw" className="object-cover" />
              </div>
              <figcaption className="mono mt-3 opacity-80">M1 · Pierre naturelle</figcaption>
            </figure>
            <figure className="rv plate mt-12 lg:mt-20">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image src="/media/materials/meleze.jpg" alt="Lames de terrasse en mélèze patiné, gris-brun, en lumière rasante" fill sizes="(min-width:1024px) 24vw, 46vw" className="object-cover" />
              </div>
              <figcaption className="mono mt-3 opacity-80">M2 · Mélèze</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
