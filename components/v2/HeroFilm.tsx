"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { sceneState, sceneBus, SEQUENCE } from "@/components/maquette/state";
import { bandOpacity, bandK, clamp, splitText, type Band } from "./scrub";
import { hero, legacy } from "@/lib/content";

const Sequence = dynamic(() => import("@/components/maquette/Sequence"), { ssr: false });

/* The five static-hero gates. Character for character the same list as in globals.css. */
const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

const FRAME_END = 0.8; // sequence runs over progress 0..0.8, then holds its last frame
const WIPE_A = 0.84;

const NAV = [
  { href: "#realisations", label: "Réalisations" },
  { href: "#savoir-faire", label: "Savoir-faire" },
  { href: "#showroom", label: "Showroom" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  return (
    <header className="on-moss relative z-30 h-16 bg-moss text-moss-text">
      <nav aria-label="Navigation principale" className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-[6.6vw]">
        <a href={legacy.home} aria-label="Germa Paysages, accueil" className="flex items-center">
          <Image src="/media/germa-logo.svg" alt="Germa Paysages" width={416} height={181} priority unoptimized className="h-9 w-auto" />
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="font-display text-[0.9375rem] font-medium text-moss-text transition-colors hover:text-white">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn-cta hidden sm:inline-flex">
          Parler de mon projet
        </a>
      </nav>
    </header>
  );
}

export default function HeroFilm() {
  const film = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [scrub, setScrub] = useState(false);

  useEffect(() => {
    const filmEl = film.current;
    const stageEl = stage.current;
    if (!filmEl || !stageEl) return;

    /* ---------- bands ---------- */
    const bandEls = Array.from(stageEl.querySelectorAll<HTMLElement>(".band"));
    const bands: Band[] = bandEls.map((el, i) => ({
      el,
      a: Number(el.dataset.a),
      b: Number(el.dataset.b),
      first: i === 0,
      last: i === bandEls.length - 1,
      ramp: el.dataset.ramp ? Number(el.dataset.ramp) : null,
      op: -1,
      k: -1,
    }));
    stageEl.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      splitText(el, el.dataset.split as "write" | "words" | "sweep", Number(el.dataset.seed ?? 7), Number(el.dataset.spread ?? 0.7));
    });

    /* ---------- line geometry, measured in pixels ---------- */
    const svg = stageEl.querySelector<SVGSVGElement>(".ink-line")!;
    const stem = svg.querySelector<SVGPathElement>(".stem")!;
    const link = svg.querySelector<SVGLineElement>(".link")!;
    const contour = svg.querySelector<SVGPathElement>(".contour")!;
    const real = stageEl.querySelector<HTMLElement>(".real")!;
    const settle = stageEl.querySelector<HTMLElement>(".band-settle")!;
    const cta = settle.querySelector<HTMLElement>(".btn-cta")!;
    let W = 0, H = 0, stemLen = 0, sx = 0, sy = 0;
    const wob = (y: number, phase: number) => 34 * Math.sin(y / 150 + phase) + 14 * Math.sin(y / 47 + phase * 2.3);

    function measure() {
      const r = stageEl!.getBoundingClientRect();
      W = r.width;
      H = r.height;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const b = settle.getBoundingClientRect();
      const c = cta.getBoundingClientRect();
      const L = b.left - r.left; // text column left
      const top = b.top - r.top;
      const x = L - 18;
      const cb = c.bottom - r.top + 22;
      const cr = c.right - r.left + 6;
      // pen touch, down the margin with a hand wobble, then a curl under the CTA
      const d = [
        `M ${x + 8} ${top - 6}`,
        `c -7 3 -10 9 -7 15`,
        `C ${x - 2} ${top + (cb - top) * 0.3}, ${x + 3} ${top + (cb - top) * 0.6}, ${x - 1} ${cb - 26}`,
        `c 0 16 9 26 26 26`,
        `L ${cr} ${cb}`,
      ].join(" ");
      stem.setAttribute("d", d);
      stemLen = stem.getTotalLength();
      stem.style.strokeDasharray = `${stemLen}`;
      sx = cr;
      sy = cb;
      link.setAttribute("x1", `${sx}`);
      link.setAttribute("y1", `${sy}`);
      link.setAttribute("y2", `${sy}`);
      lastStem = -1;
      lastWipe = -1;
    }

    /* ---------- the drive ---------- */
    let target = 0, shown = 0, rafId: number | null = null, lastTick = 0;
    let lastStem = -1, lastWipe = -1, lastCue = -1;
    let loadK = 0, loadStart = 0;
    let onScreen = true;
    const frames = Math.max(1, SEQUENCE.count - 1);
    const cue = stageEl.querySelector<HTMLElement>(".scroll-cue");

    const progress = () => {
      const r = filmEl!.getBoundingClientRect();
      const range = filmEl!.offsetHeight - window.innerHeight;
      return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
    };

    function apply(p: number, now: number) {
      // frames
      const f = clamp(p / FRAME_END, 0, 1) * frames;
      if (Math.abs(f - sceneState.frame) > 0.01) {
        sceneState.frame = f;
        sceneBus.invalidate?.();
      }
      // bands (delta-gated)
      if (loadStart && loadK < 1) {
        const t = clamp((now - loadStart) / 1400, 0, 1);
        loadK = t * t * (3 - 2 * t);
      }
      bands.forEach((b, i) => {
        const op = bandOpacity(p, b);
        let k = bandK(p, b);
        if (i === 0) k = Math.max(k, loadK);
        if (Math.abs(op - b.op) > 0.008 || (op === 0) !== (b.op === 0)) {
          b.op = op;
          b.el.style.opacity = op.toFixed(3);
          b.el.classList.toggle("is-on", op > 0.5);
        }
        if (Math.abs(k - b.k) > 0.008) {
          b.k = k;
          b.el.style.setProperty("--k", k.toFixed(3));
        }
      });
      // stem draws over 0..FRAME_END+0.02
      const s = clamp(p / (FRAME_END + 0.02), 0, 1);
      if (Math.abs(s - lastStem) > 0.002) {
        lastStem = s;
        stem.style.strokeDashoffset = `${stemLen * (1 - s)}`;
      }
      // wipe: the contour sweeps across, the photo is revealed to its left
      const q0 = clamp((p - WIPE_A) / (1 - WIPE_A), 0, 1);
      const q = q0 * q0 * (3 - 2 * q0);
      if (Math.abs(q - lastWipe) > 0.002) {
        lastWipe = q;
        const cx = -90 + q * (W + 180);
        const pts: string[] = ["0px 0px"];
        const d: string[] = [];
        const n = 14;
        for (let i = 0; i <= n; i++) {
          const y = (H + 40) * (i / n) - 20;
          const x = cx + wob(y, 0.6);
          pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
          d.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        pts.push(`0px ${H}px`);
        real.style.clipPath = `polygon(${pts.join(",")})`;
        contour.setAttribute("d", d.join(" "));
        contour.style.opacity = q > 0.001 ? "1" : "0";
        const x2 = Math.max(sx, cx + wob(sy, 0.6));
        link.setAttribute("x2", `${x2}`);
        link.style.opacity = x2 - sx > 1 ? "1" : "0";
      }
      // scroll cue fades out early
      const cueOp = 1 - clamp(p / 0.05, 0, 1);
      if (cue && Math.abs(cueOp - lastCue) > 0.01) {
        lastCue = cueOp;
        cue.style.opacity = cueOp.toFixed(2);
      }
    }

    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const k = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
      const settled = Math.abs(target - shown) < 0.0005 && loadK >= 1;
      if (settled) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      apply(shown, now);
    }
    const kick = () => {
      if (rafId === null && onScreen) rafId = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = progress();
      kick();
    };
    const onResize = () => {
      measure();
      bands.forEach((b) => { b.op = -1; b.k = -1; });
      target = progress();
      shown = target;
      apply(shown, performance.now());
    };

    /* ---------- gates, decided live ---------- */
    let on = false;
    const enable = () => {
      if (on) return;
      on = true;
      setScrub(true);
      measure();
      bands.forEach((b) => { b.op = -1; b.k = -1; });
      lastStem = -1; lastWipe = -1; lastCue = -1;
      loadStart = performance.now();
      loadK = 0;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      target = progress();
      shown = target;
      kick();
    };
    const disable = () => {
      if (!on) return;
      on = false;
      setScrub(false);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    };
    const mqls = GATES.map((q) => window.matchMedia(q));
    const applyMode = () => (mqls.some((m) => m.matches) ? disable() : enable());
    mqls.forEach((m) => m.addEventListener("change", applyMode));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          onScreen = e.isIntersecting;
          sceneState.visible = e.isIntersecting;
          if (e.isIntersecting) { setNear(true); kick(); }
        }
      },
      { rootMargin: "60% 0px 60% 0px" },
    );
    io.observe(filmEl);

    // fonts change the measured geometry
    document.fonts?.ready.then(() => { if (on) onResize(); });
    applyMode();

    return () => {
      disable();
      mqls.forEach((m) => m.removeEventListener("change", applyMode));
      io.disconnect();
    };
  }, []);

  return (
    <section ref={film} className="film" aria-label="Du trait au jardin">
      {/* ---------- the scrubbed stage (desktop, motion allowed) ---------- */}
      <div ref={stage} className="film-stage">
        <Nav />

        <div className="layer poster top-16" aria-hidden="true">
          <Image src={SEQUENCE.poster} alt="" fill priority sizes="100vw" className={`object-cover transition-opacity duration-700 ${drawn ? "opacity-0" : "opacity-100"}`} />
        </div>
        <div className="layer top-16" aria-hidden="true">
          {scrub && near && <Sequence onFirstFrame={() => setDrawn(true)} />}
        </div>
        <div className="layer scrim-base top-16" aria-hidden="true" />

        {/* the real garden, revealed by the contour */}
        <div className="layer real top-16" aria-hidden="true">
          <Image src={hero.still.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>

        <svg className="ink-line" aria-hidden="true" focusable="false">
          <path className="stem" />
          <line className="link" style={{ opacity: 0 }} />
          <path className="contour" style={{ opacity: 0 }} />
        </svg>

        {/* bands: real text in the footage's plain left column */}
        <div className="band e-write" data-a="0" data-b="0.15" style={{ "--scrim": 0.62 } as React.CSSProperties}>
          <p className="mono chip text-graphite">PL-01 · Plan</p>
          <h1 className="phase-word mt-5" data-split="write" data-seed="11" data-spread="0.55">Imaginer.</h1>
          <p className="phase-line mt-5" data-split="write" data-seed="12" data-spread="0.8">Tout commence par un trait sur un plan.</p>
        </div>

        <div className="band e-rise" data-a="0.17" data-b="0.32" style={{ "--scrim": 0.66 } as React.CSSProperties}>
          <p className="mono chip text-graphite">Coupe A–A</p>
          <p className="phase-word mt-5" data-split="words" data-seed="21" data-spread="0.3">Concevoir.</p>
          <p className="phase-line mt-5" data-split="words" data-seed="22" data-spread="0.7">Le trait devient volume&nbsp;: mur, escalier, terrasse, pergola.</p>
        </div>

        <div className="band e-resolve" data-a="0.34" data-b="0.49" data-ramp="0.03" style={{ "--scrim": 0.92 } as React.CSSProperties}>
          <p className="mono chip text-graphite">Matériaux</p>
          <div className="relative mt-5">
            <div className="soft" aria-hidden="true">
              <p className="phase-word">Réaliser.</p>
              <p className="phase-line mt-5">Pierre, mélèze, gravier&nbsp;: nos équipes posent chaque pièce.</p>
            </div>
            <div className="sharp">
              <p className="phase-word">Réaliser.</p>
              <p className="phase-line mt-5">Pierre, mélèze, gravier&nbsp;: nos équipes posent chaque pièce.</p>
            </div>
          </div>
        </div>

        <div className="band e-sweep" data-a="0.51" data-b="0.64" style={{ "--scrim": 0.94 } as React.CSSProperties}>
          <p className="mono chip text-graphite">Saisons</p>
          <p className="phase-word mt-5" data-split="sweep" data-seed="41" data-spread="0.6">Faire vivre.</p>
          <p className="phase-line mt-5" data-split="sweep" data-seed="42" data-spread="0.8">Puis le jardin vit, et nous l’entretenons.</p>
        </div>

        <div className="band band-settle e-settle" data-a="0.66" data-b="0.84" data-ramp="0.04" style={{ "--scrim": 0.95 } as React.CSSProperties}>
          <p className="mono chip text-graphite">Germa Paysages · Monthey · Etoy</p>
          <p className="settle-title mt-5" data-split="words" data-seed="51" data-spread="0.5">Des extérieurs qui prennent vie.</p>
          <div className="row mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#contact" className="btn-cta">Parler de mon projet</a>
            <a href="#realisations" className="link-ink text-ink">Voir nos réalisations</a>
          </div>
        </div>

        <div className="band e-follow" data-a="0.84" data-b="1" data-ramp="0.03">
          <div className="inner inline-block bg-canvas/95 px-6 py-5 shadow-[0_1px_0_rgba(21,23,26,.25)]" style={{ textShadow: "none" }}>
            <p className="mono text-graphite">Chermignon (VS) · Jardin d’un chalet de maître</p>
            <p className="phase-line mt-3 font-display text-[clamp(1.5rem,2.3vw,2.25rem)] leading-tight font-medium text-ink" style={{ maxWidth: "22ch" }}>
              La maquette devient un vrai jardin Germa.
            </p>
          </div>
        </div>

        <div className="scroll-cue mono flex items-center gap-3" aria-hidden="true">
          <span>Défiler</span>
          <span className="block h-px w-10 bg-graphite" />
        </div>
      </div>

      {/* ---------- the static hero (phones, portrait, coarse pointer, reduced motion) ---------- */}
      <div className="film-static">
        <Nav />
        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
          <Image src={SEQUENCE.poster} alt="Maquette d’étude d’un jardin en pente, illustration" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="px-5 pt-8 pb-12 sm:px-8">
          <p className="mono text-graphite">PL-01 · Du trait au jardin</p>
          <h1 className="font-display mt-4 text-[clamp(2.6rem,11vw,4rem)] leading-[0.98] font-bold tracking-[-0.03em] text-ink">
            Des extérieurs qui prennent vie.
          </h1>
          <p className="mt-5 max-w-[34ch] text-[1.0625rem] leading-relaxed text-graphite">
            Du trait au jardin&nbsp;: nous concevons, réalisons et entretenons vos extérieurs, en Valais et sur Vaud.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#contact" className="btn-cta">Parler de mon projet</a>
            <a href="#realisations" className="link-ink text-ink">Voir nos réalisations</a>
          </div>
        </div>
      </div>
    </section>
  );
}
