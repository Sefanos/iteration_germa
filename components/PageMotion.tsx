"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

const FOREST = "#18352a";
const LIMESTONE = "#f3f0e6";

/** Scroll-driven motion below the hero: parallax, wipes, reveals, colour morph, tagline, cursor. */
export default function PageMotion() {
  const cursor = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Per-image parallax, each with its own speed.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const img = el.querySelector("img");
        if (!img) return;
        const strength = Number(el.dataset.parallax) || 7;
        gsap.fromTo(
          img,
          { yPercent: -strength },
          { yPercent: strength, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.4 } },
        );
      });

      // Images reveal with a clip-path wipe and settle from 1.15 to 1.
      gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((el, i) => {
        const media = el.querySelector<HTMLElement>(".wipe-media") ?? el;
        const dir = el.dataset.wipe === "x" ? "inset(0 100% 0 0)" : el.dataset.wipe === "-x" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
        tl.fromTo(el, { clipPath: dir }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" }, 0)
          .fromTo(media, { scale: 1.15 }, { scale: 1, duration: 2.0 }, 0.1);
        ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tl.play() });
        el.closest("a")?.addEventListener("focusin", () => tl.progress(1), { once: true });
        void i;
      });

      // Titles drift at a different speed from their images.
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        const amount = Number(el.dataset.drift) || 30;
        gsap.fromTo(
          el,
          { y: amount },
          { y: -amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });

      // Reveals animate opacity only (never visibility), so links inside stay keyboard-focusable.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const tween = gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: "power3.out", paused: true });
        const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => tween.play() });
        el.addEventListener("focusin", () => { tween.progress(1); st.kill(); }, { once: true });
      });

      // Background colour morphs: limestone → forest for the showroom → limestone for the contact.
      const showroom = document.getElementById("showroom");
      const contact = document.getElementById("contact");
      if (showroom && contact) {
        showroom.style.backgroundColor = "transparent";
        gsap.fromTo(document.body, { backgroundColor: LIMESTONE }, {
          backgroundColor: FOREST,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: showroom, start: "top 90%", end: "top 30%", scrub: true },
        });
        gsap.fromTo(document.body, { backgroundColor: FOREST }, {
          backgroundColor: LIMESTONE,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: showroom, start: "bottom 95%", end: "bottom 55%", scrub: true },
        });
        void contact;
      }

      // Tagline crossing the screen.
      const track = document.querySelector<HTMLElement>(".tagline-track");
      if (track) {
        gsap.fromTo(
          track,
          { xPercent: 12 },
          { xPercent: -52, ease: "none", scrollTrigger: { trigger: track.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
      }

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    });

    // Custom cursor label on desktop pointers only.
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const el = cursor.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
      const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
      const show = () => gsap.to(el, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "power3.out" });
      const hide = () => gsap.to(el, { scale: 0.6, autoAlpha: 0, duration: 0.3, ease: "power3.in" });
      window.addEventListener("pointermove", move, { passive: true });
      const links = gsap.utils.toArray<HTMLElement>("[data-cursor]");
      links.forEach((l) => { l.addEventListener("pointerenter", show); l.addEventListener("pointerleave", hide); });
      document.body.classList.add("has-cursor-label");
      return () => {
        window.removeEventListener("pointermove", move);
        links.forEach((l) => { l.removeEventListener("pointerenter", show); l.removeEventListener("pointerleave", hide); });
        document.body.classList.remove("has-cursor-label");
      };
    });

    return () => mm.revert();
  });

  return (
    <div ref={cursor} className="cursor-label" aria-hidden="true">
      Voir le projet
    </div>
  );
}
