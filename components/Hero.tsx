"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { hero, NNBSP } from "@/lib/content";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setMotionOk(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const title = root.current?.querySelector<HTMLElement>(".hero-title");
      if (!title) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          linesClass: "hero-line",
          autoSplit: true,
          onSplit: (self) => {
            title.dataset.state = "ready";
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.14,
              ease: "power3.out",
              delay: 0.15,
            });
          },
        });
        gsap.from(".hero-fade", {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.7,
        });
        gsap.from(".hero-frame", {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.5,
          ease: "power4.inOut",
          delay: 0.2,
        });
        gsap.from(".hero-caption", { autoAlpha: 0, duration: 1, delay: 1.5 });
        return () => split.revert();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        title.dataset.state = "ready";
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contenu" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-x-10 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:pt-24 lg:pb-28">
        <div className="lg:col-span-6 lg:pt-10">
          <p className="eyebrow hero-fade text-forest">Living Architecture</p>
          <h1
            className="hero-title mt-7 max-w-[11ch] font-display text-[clamp(2.9rem,8.6vw,6rem)] leading-[1.02] tracking-[-0.015em] text-forest"
            data-state="pending"
          >
            Des extérieurs qui prennent vie.
          </h1>
          <p className="hero-fade mt-8 max-w-[30rem] text-[1.0625rem] leading-relaxed text-charcoal/80 sm:text-lg">
            De la conception à la réalisation, imaginons ensemble des espaces extérieurs qui vous ressemblent.
          </p>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#contact" className="btn-primary">
              Parler de mon projet
            </a>
            <a href="#realisations" className="link-line text-forest">
              Découvrir nos réalisations
            </a>
          </div>
        </div>

        <div className="mt-14 lg:col-span-6 lg:mt-0">
          <figure className="lg:ml-6">
            <div className="hero-frame frame aspect-[4/3] w-full lg:w-[calc(100%+3rem)] xl:w-[calc(100%+6rem)]">
              <Image
                src={hero.still.src}
                alt={hero.still.alt}
                width={hero.still.width}
                height={hero.still.height}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
              {hero.video && motionOk && (
                <video
                  className={`transition-opacity duration-[1600ms] ease-out ${videoReady ? "opacity-100" : "opacity-0"}`}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                  onPlaying={() => setVideoReady(true)}
                >
                  <source src={hero.video.webm} type="video/webm" />
                  <source src={hero.video.mp4} type="video/mp4" />
                </video>
              )}
            </div>
            <figcaption className="hero-caption mt-4 flex items-baseline justify-between gap-6 text-[0.75rem] tracking-[0.04em] text-charcoal/60">
              <span>Jardin d’un chalet de maître, Chermignon</span>
              <span className="font-display text-base italic tracking-normal text-forest">
                «{NNBSP}La nature prend forme.{NNBSP}»
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
