"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
import { hero, NNBSP } from "@/lib/content";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setMotionOk(mq.matches && !conn?.saveData);
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
        // Opening: the frame opens from a narrow vertical slit while the headline reveals line by line.
        const intro = gsap.timeline({ defaults: { ease: "power4.inOut" } });
        intro
          .fromTo(".hero-frame", { clipPath: "inset(0 46% 0 46%)" }, { clipPath: "inset(0 0% 0 0%)", duration: 1.7 }, 0)
          .fromTo(".hero-media", { scale: 1.08 }, { scale: 1, duration: 2.4, ease: "power3.out" }, 0)
          .from(".hero-fade", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.9)
          .from(".hero-caption", { autoAlpha: 0, duration: 1, ease: "power2.out" }, 1.4)
          .from(".hero-cue", { autoAlpha: 0, duration: 1, ease: "power2.out" }, 1.8);

        const split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          linesClass: "hero-line",
          autoSplit: true,
          onSplit: (self) => {
            title.dataset.state = "ready";
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              stagger: 0.16,
              ease: "power3.out",
              delay: 0.45,
            });
          },
        });

        // Scroll: the hero pins briefly. The image grows and drifts, the headline follows more slowly.
        const pin = gsap.matchMedia();
        pin.add("(min-width: 1024px)", () => {
          const scroll = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=55%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              refreshPriority: 2,
            },
          });
          scroll
            .fromTo(".hero-zoom", { scale: 1, yPercent: 0 }, { scale: 1.14, yPercent: -7, ease: "none" }, 0)
            .fromTo(".hero-title", { y: 0 }, { y: -48, ease: "none" }, 0)
            .to(".hero-fade", { y: -14, autoAlpha: 0.35, ease: "none" }, 0)
            .to(".hero-caption, .hero-cue", { autoAlpha: 0, ease: "none" }, 0);
        });

        return () => {
          split.revert();
          pin.revert();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        title.dataset.state = "ready";
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root },
  );

  const togglePause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <section
      ref={root}
      id="contenu"
      className="hero relative flex min-h-[calc(100svh-4.5rem)] flex-col lg:block lg:h-[calc(100svh-4.5rem)] lg:min-h-[640px]"
    >
      {/* Framed photo: top on mobile, right-hand frame on desktop. The still is the LCP image. */}
      <figure className="hero-figure relative w-full lg:absolute lg:top-0 lg:right-0 lg:h-[74%] lg:w-[62vw]">
        <div className="hero-frame frame aspect-[4/3] max-h-[54svh] w-full lg:aspect-auto lg:h-full lg:max-h-none">
          <div className="hero-zoom absolute inset-0">
            <div className="hero-media absolute inset-0">
              <Image
                src={hero.still.src}
                alt={hero.still.alt}
                width={hero.still.width}
                height={hero.still.height}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 62vw, 100vw"
              />
              {hero.video && motionOk && (
                <video
                  ref={videoRef}
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
          </div>
          {videoReady && (
            <button
              type="button"
              onClick={togglePause}
              aria-pressed={paused}
              className="absolute right-4 bottom-4 z-10 rounded-full border border-limestone/60 bg-charcoal/35 px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-limestone uppercase backdrop-blur-[2px] transition-colors hover:bg-charcoal/60"
            >
              {paused ? "Lecture" : "Pause"}
            </button>
          )}
        </div>
        <figcaption className="hero-caption mt-4 hidden items-baseline justify-between gap-6 pr-[5vw] text-[0.75rem] tracking-[0.04em] text-charcoal/60 lg:flex">
          <span>Jardin d’un chalet de maître, Chermignon</span>
          <span className="font-display text-base italic tracking-normal text-forest">
            «{NNBSP}La nature prend forme.{NNBSP}»
          </span>
        </figcaption>
      </figure>

      {/* Text block: crosses the frame edge (bottom edge on mobile, left edge on desktop). */}
      <div className="hero-text relative z-10 px-5 pb-16 sm:px-8 lg:absolute lg:bottom-[5%] lg:left-[5vw] lg:w-[60vw] lg:px-0 lg:pb-0">
        <p className="eyebrow hero-fade mt-8 text-forest lg:mt-0">Living Architecture</p>
        <h1
          className="hero-title mt-4 -ml-[0.04em] font-display text-[clamp(3.4rem,13.5vw,5.2rem)] leading-[0.98] tracking-[-0.015em] text-forest lg:mt-5 lg:text-[7vw]"
          data-state="pending"
        >
          Des extérieurs
          <br />
          qui <em className="italic">prennent vie</em>.
        </h1>
        <div className="mt-7 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-end lg:gap-12">
          <p className="hero-fade max-w-[28rem] text-[1.0625rem] leading-relaxed text-charcoal/80 sm:text-lg">
            De la conception à la réalisation, imaginons ensemble des espaces extérieurs qui vous ressemblent.
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-x-8 gap-y-4 lg:pb-1">
            <a href="#contact" className="btn-primary">
              Parler de mon projet
            </a>
            <a href="#realisations" className="link-line text-forest">
              Découvrir nos réalisations
            </a>
          </div>
        </div>
      </div>

      <div className="hero-cue absolute right-[5vw] bottom-[5%] hidden items-center gap-3 text-[0.625rem] tracking-[0.22em] text-charcoal/55 uppercase lg:flex" aria-hidden="true">
        <span>Défiler</span>
        <span className="block h-px w-10 bg-charcoal/35" />
      </div>
    </section>
  );
}
