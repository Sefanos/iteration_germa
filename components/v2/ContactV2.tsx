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
    const c = cta.current, s = section.current;
    if (!c || !s) return contactShape(w, h, h * 0.4, w * 0.3);
    const r = c.getBoundingClientRect(), sr = s.getBoundingClientRect();
    return contactShape(w, h, r.bottom - sr.top, r.right - sr.left + 8);
  }, []);

  return (
    <footer ref={section} id="contact" className="on-dark on-moss relative scroll-mt-16" aria-labelledby="contact-title">
      <InkLine build={build} tip start="top 80%" end="top 25%" className="on-dark-line" />
      <div className="mx-auto max-w-[1440px] px-5 pt-24 pb-10 sm:px-8 lg:px-[6.6vw] lg:pt-[16vh] lg:pb-12">
        <div className="head">
          <span className="head-veil" aria-hidden="true" />
        <p className="mono dim-label" data-reveal>Monthey · Etoy · Genève <span className="dim-line" aria-hidden="true" /> Contact</p>
        <h2 id="contact-title" data-audit data-reveal-lines className="font-display mt-4 max-w-[12ch] text-[clamp(3rem,7vw,7rem)] leading-[0.94] font-bold tracking-[-0.035em]">
          La nature prend forme.
        </h2>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a ref={cta} href={legacy.devis} className="btn-cta btn-wipe">Demander un devis</a>
          <a href={telHref(contact.locations[0].phone)} className="link-draw">{formatPhone(contact.locations[0].phone)}</a>
          <a href={`mailto:${contact.email}`} className="link-draw">{contact.email}</a>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-current/25 pt-10 sm:grid-cols-2 lg:mt-[16vh] lg:grid-cols-4">
          {contact.locations.map((loc) => (
            <address key={loc.id} className="rv not-italic">
              <p className="font-display text-[1.4rem] leading-none font-bold">{loc.name}</p>
              <p className="mono mt-2 opacity-75">{loc.role}</p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed opacity-85">{loc.street}<br />{loc.postalCode} {loc.locality}</p>
              <a href={telHref(loc.phone)} className="link-draw mt-3 inline-block">{formatPhone(loc.phone)}</a>
            </address>
          ))}
          <div className="rv">
            <p className="font-display text-[1.4rem] leading-none font-bold">Suivre</p>
            <ul className="mt-4 space-y-2.5">
              {socials.map((s) => (<li key={s.label}><a href={s.href} className="link-draw">{s.label}</a></li>))}
            </ul>
          </div>
        </div>
        <p className="mono mt-16 border-t border-current/25 pt-5 opacity-75 normal-case">© 2026 {contact.legalName}. Paysagistes depuis {contact.founded}.</p>
      </div>
    </footer>
  );
}
