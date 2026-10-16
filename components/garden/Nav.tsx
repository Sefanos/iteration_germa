"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import { legacy, contact, formatPhone, telHref } from "@/lib/content";
import SunArc from "./SunArc";

const LINKS = [
  { href: "#realisations", label: "Réalisations" },
  { href: "#savoir-faire", label: "Savoir-faire" },
  { href: "#plan-au-jardin", label: "Du plan au jardin" },
  { href: "#showroom", label: "Showroom" },
  { href: "#contact", label: "Contact" },
];

/**
 * Mejuma-style navigation: a full bar at the top of the page that detaches into a floating capsule on scroll,
 * a Menu pill with an animated dot, and a full-screen overlay whose lines reveal from masks.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const links = el.querySelectorAll<HTMLElement>(".menu-link");
    const splits = Array.from(links).map((l) => SplitText.create(l, { type: "lines", mask: "lines", linesClass: "menu-line" }));
    const t = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
    t.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduce ? 0 : 0.9, ease: "power4.inOut" }, 0)
      .fromTo(splits.flatMap((s) => s.lines), { yPercent: 110 }, { yPercent: 0, duration: reduce ? 0 : 0.9, stagger: 0.06 }, reduce ? 0 : 0.35)
      .fromTo(".menu-meta", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: reduce ? 0 : 0.7, stagger: 0.08 }, reduce ? 0 : 0.6);
    tl.current = t;
    return () => { t.kill(); splits.forEach((s) => s.revert()); };
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) { document.body.classList.add("menu-open"); t.timeScale(1).play(); }
    else { document.body.classList.remove("menu-open"); t.timeScale(1.6).reverse(); }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`site-nav ${floating ? "is-floating" : ""} ${open ? "is-open" : ""}`}>
        <a href={legacy.home} className="nav-logo" aria-label="Germa Paysages, accueil">
          <Image src="/media/germa-logo.svg" alt="Germa Paysages" width={416} height={181} priority unoptimized />
        </a>
        <div className="nav-capsule">
          <span className="nav-sun" aria-hidden="true"><SunArc /></span>
          <button type="button" className="pill pill-menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}>
            <span className="pill-label"><span className="pill-word">{open ? "Fermer" : "Menu"}</span></span>
            <span className="pill-dot" aria-hidden="true" />
          </button>
          <a href="#contact" className="pill pill-cta" onClick={() => setOpen(false)}>
            <span className="pill-label">Parler de mon projet</span>
            <span className="pill-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <div ref={overlay} id="site-menu" className="menu-overlay" aria-hidden={!open} style={{ clipPath: "inset(0 0 100% 0)" }}>
        <div className="menu-inner">
          <nav aria-label="Menu principal" className="menu-links">
            {LINKS.map((l, i) => (
              <a key={l.href} href={l.href} className="menu-link" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                <span className="menu-num mono">0{i + 1}</span>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="menu-side">
            <div className="menu-meta">
              <p className="mono">Contact</p>
              <a href={telHref(contact.locations[0].phone)} className="link-draw" tabIndex={open ? 0 : -1}>{formatPhone(contact.locations[0].phone)}</a>
              <a href={`mailto:${contact.email}`} className="link-draw" tabIndex={open ? 0 : -1}>{contact.email}</a>
            </div>
            <div className="menu-meta">
              <p className="mono">Suivre</p>
              <a href={contact.social.instagram} className="link-draw" tabIndex={open ? 0 : -1}>Instagram</a>
              <a href={contact.social.facebook} className="link-draw" tabIndex={open ? 0 : -1}>Facebook</a>
              <a href={contact.social.linkedin} className="link-draw" tabIndex={open ? 0 : -1}>LinkedIn</a>
            </div>
            <div className="menu-meta">
              <p className="mono">Bureaux</p>
              <p>Monthey · Etoy · Genève</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
