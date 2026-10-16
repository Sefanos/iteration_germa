"use client";

import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { filmState, bus, chapter, GARDEN } from "./state";

/**
 * Below the hero, each section scrubs its own chapter of the sequence as it scrolls through,
 * so the camera keeps walking the garden. Also: the hero handoff and the active nav link.
 */
export default function ScrollDrive() {
  useGSAP(() => {
    const inv = () => bus.film?.();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const seg = (trigger: string, id: string, start: string, end: string) => {
        const ch = chapter(id);
        if (ch.end <= ch.start) return;
        gsap.fromTo(filmState, { frame: ch.start }, { frame: ch.end, ease: "none", immediateRender: false, onUpdate: inv, scrollTrigger: { trigger, start, end, scrub: 0.7 } });
      };
      // the hero holds the film's last frame; the descent to the pool begins as Réalisations arrives
      seg("#realisations", "explore-pool", "top 100%", "bottom 40%");
      seg("#savoir-faire", "explore-terrace", "top 90%", "bottom 30%");
      seg("#plan-au-jardin", "explore-hold", "top 90%", "bottom 20%");
      seg("#showroom", "explore-evening", "top 100%", "bottom 10%");
      // Savoir-faire rows: hovering a métier eases the walk to the moment that shows it, and back on leave.
      const terrace = chapter("explore-terrace"), pool = chapter("explore-pool");
      const span = (c: { start: number; end: number }, t: number) => c.start + (c.end - c.start) * t;
      const spots = [span(pool, 0.0), span(pool, 0.55), span(terrace, 0.95), span(pool, 0.75), span(pool, 1.0), span(pool, 0.3)];
      let hoverTween: gsap.core.Tween | null = null;
      let resting = 0;
      const rows = gsap.utils.toArray<HTMLElement>("#savoir-faire .idx-row");
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine && terrace.end > terrace.start) rows.forEach((row, i) => {
        row.addEventListener("pointerenter", () => { resting = filmState.frame; hoverTween?.kill(); hoverTween = gsap.to(filmState, { frame: spots[i], duration: 1.4, ease: "power2.inOut", onUpdate: inv }); });
        row.addEventListener("pointerleave", () => { hoverTween?.kill(); hoverTween = gsap.to(filmState, { frame: resting, duration: 1.0, ease: "power2.inOut", onUpdate: inv }); });
      });

      // the sun in the nav follows the evening chapter
      const ev = chapter("explore-evening");
      if (ev.end > ev.start) {
        gsap.fromTo(bus, { dusk: 0 }, { dusk: 1, ease: "none", immediateRender: false, onUpdate: () => bus.sun?.(), scrollTrigger: { trigger: "#showroom", start: "top 100%", end: "bottom 10%", scrub: 0.7 } });
      }
      // Hero handoff: the settle block drifts up in layers at different speeds as the film unpins.
      gsap.utils.toArray<HTMLElement>(".band-settle .hand").forEach((el, i) => {
        gsap.fromTo(el, { y: 0, opacity: 1 }, { y: -36 - i * 22, opacity: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".film", start: "bottom 100%", end: "bottom 60%", scrub: 0.5 } });
      });
      ScrollTrigger.refresh();
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      filmState.frame = chapter("film").end;
      inv();
    });
    // Nav: the active section underlines itself (both modes).
    const links = gsap.utils.toArray<HTMLAnchorElement>("nav a[href^='#']");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    ["realisations", "savoir-faire", "showroom", "contact"].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    void GARDEN;
    return () => { mm.revert(); io.disconnect(); };
  });
  return null;
}
