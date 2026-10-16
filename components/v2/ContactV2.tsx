"use client";

import { useCallback, useRef } from "react";
import { contact, legacy, formatPhone, telHref } from "@/lib/content";
import InkLine from "./InkLine";
import { contact as contactShape } from "./lineShapes";

const socials = [
  { label: "Facebook", href: contact.social.facebook },
  { label: "Instagram", href: contact.social.instagram },
  { label: "LinkedIn", href: contact.social.linkedin },
];

export default function ContactV2() {
  const section = useRef<HTMLElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);
  const build = useCallback((w: number, h: number) => {
    const c = cta.current;
    const s = section.current;
    if (!c || !s) return contactShape(w, h, h * 0.4, w * 0.3);
    const r = c.getBoundingClientRect();
    const sr = s.getBoundingClientRect();
    return contactShape(w, h, r.bottom - sr.top, r.right - sr.left + 8);
  }, []);

  return (
    <footer ref={section} id="contact" className="relative scroll-mt-16" aria-labelledby="contact-title">
      <InkLine build={build} start="top 80%" end="top 25%" />
      <div className="mx-auto max-w-[1440px] px-5 pt-20 pb-10 sm:px-8 lg:px-[6.6vw] lg:pt-[14vh] lg:pb-12">
        <p className="mono text-graphite">Monthey · Etoy · Genève</p>
        <h2 id="contact-title" className="font-display mt-4 max-w-[12ch] text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.96] font-bold tracking-[-0.035em] text-ink">
          La nature prend forme.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a ref={cta} href={legacy.devis} className="btn-cta">
            Demander un devis
          </a>
          <a href={telHref(contact.locations[0].phone)} className="link-ink text-ink">
            {formatPhone(contact.locations[0].phone)}
          </a>
          <a href={`mailto:${contact.email}`} className="link-ink text-ink">
            {contact.email}
          </a>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-panel-edge pt-10 sm:grid-cols-2 lg:mt-[16vh] lg:grid-cols-4">
          {contact.locations.map((loc) => (
            <address key={loc.id} className="not-italic">
              <p className="font-display text-[1.35rem] leading-none font-bold text-ink">{loc.name}</p>
              <p className="mono mt-2 text-graphite">{loc.role}</p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-graphite">
                {loc.street}
                <br />
                {loc.postalCode} {loc.locality}
              </p>
              <a href={telHref(loc.phone)} className="link-ink mt-3 inline-block text-ink">
                {formatPhone(loc.phone)}
              </a>
            </address>
          ))}
          <div>
            <p className="font-display text-[1.35rem] leading-none font-bold text-ink">Suivre</p>
            <ul className="mt-4 space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-ink text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mono mt-16 border-t border-panel-edge pt-5 text-graphite normal-case">
          © 2026 {contact.legalName}. Paysagistes depuis {contact.founded}.
        </p>
      </div>
    </footer>
  );
}
