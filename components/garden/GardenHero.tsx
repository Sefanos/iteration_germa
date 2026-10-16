"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { filmState, bus, GARDEN, chapter } from "@/components/garden/state";
import { bandOpacity, bandK, clamp, splitText, type Band } from "@/components/v2/scrub";
import Contours from "./Contours";
import Wordmark from "./Wordmark";


import { GATES } from "./gates";

const STEM_END = 0.86; // the ink stem finishes drawing as the settle lands

export default function GardenHero() {
  const film = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { bus.ready = () => setDrawn(true); if (document.body.classList.contains("canvas-ready")) setDrawn(true); return () => { bus.ready = null; }; }, []);
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
    const settle = stageEl.querySelector<HTMLElement>(".band-settle")!;
    const cta = settle.querySelector<HTMLElement>(".btn-cta")!;
    let stemLen = 0;

    function measure() {
      const r = stageEl!.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
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
      lastStem = -1;
    }

    /* ---------- the drive ---------- */
    let target = 0, shown = 0, rafId: number | null = null, lastTick = 0;
    let lastStem = -1, lastCue = -1, lastLive = false, lastGolden = false;
    let loadK = 0, loadStart = 0;
    let onScreen = true;
    const cue = stageEl.querySelector<HTMLElement>(".scroll-cue");

    const progress = () => {
      const r = filmEl!.getBoundingClientRect();
      const range = filmEl!.offsetHeight - window.innerHeight;
      return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
    };

    function apply(p: number, now: number) {
      // film: construction frames over 0..filmEnd, then hold the last frame (the arrival owns the frame until it lands)
      if (document.body.classList.contains("arrived")) {
        const ch = chapter("film");
        const f = ch.start + clamp(p / GARDEN.filmEnd, 0, 1) * (ch.end - ch.start);
        if (Math.abs(f - filmState.frame) > 0.01) {
          filmState.frame = f;
          bus.film?.();
        }
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
      // the garden breathes once it is finished; the text goes light once the garden turns green
      const live = p > 0.8;
      if (live !== lastLive) {
        lastLive = live;
        stageEl!.classList.toggle("is-live", live);
      }
      const golden = p > 0.5;
      if (golden !== lastGolden) {
        lastGolden = golden;
        stageEl!.classList.toggle("is-golden", golden);
      }
      // the stem draws as the settle lands
      const st = clamp(p / STEM_END, 0, 1);
      if (Math.abs(st - lastStem) > 0.002) {
        lastStem = st;
        stem.style.strokeDashoffset = `${stemLen * (1 - st)}`;
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
      lastStem = -1; lastCue = -1;
      loadStart = performance.now();
      loadK = 0;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      target = progress();
      shown = target;
      kick();
    };
    const disable = () => {
      document.body.classList.add("arrived");
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
          filmState.visible = e.isIntersecting;
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

        <div className="layer poster" aria-hidden="true">
          <Image src={GARDEN.arrivalPoster} alt="" fill priority sizes="100vw" className={`object-cover transition-opacity duration-700 ${drawn ? "opacity-0" : "opacity-100"}`} />
        </div>
        <Wordmark />
        <div className="layer scrim-base" aria-hidden="true" />
        <div className="layer light-sweep" aria-hidden="true" />
        <div className="layer" aria-hidden="true"><Contours /></div>

        <svg className="ink-line" aria-hidden="true" focusable="false">
          <path className="stem" />
        </svg>

        {/* bands: real text in the calm left third of the frame */}
        <div className="band e-write" data-a="0" data-b="0.3">
          <p className="mono hero-kicker">Vaud · Au-dessus du Léman · PL-01</p>
          <h1 className="phase-word mt-5" data-split="write" data-seed="11" data-spread="0.55">Imaginer.</h1>
          <p className="phase-line mt-5" data-split="write" data-seed="12" data-spread="0.8">Une villa, une pente, un lac. Tout commence par un trait sur un plan.</p>
        </div>

        <div className="band e-rise" data-a="0.32" data-b="0.49">
          <p className="mono hero-kicker">Coupe A–A</p>
          <p className="phase-word mt-5" data-split="words" data-seed="31" data-spread="0.3">Concevoir.</p>
          <p className="phase-line mt-5" data-split="words" data-seed="32" data-spread="0.7">Le trait devient volume&nbsp;: mur, terrasse, escalier.</p>
        </div>

        <div className="band e-resolve" data-a="0.51" data-b="0.66" data-ramp="0.03">
          <p className="mono hero-kicker">Matériaux</p>
          <div className="relative mt-5">
            <div className="soft" aria-hidden="true">
              <p className="phase-word">Réaliser.</p>
              <p className="phase-line mt-5">Pierre, mélèze, eau&nbsp;: nos équipes posent chaque pièce.</p>
            </div>
            <div className="sharp">
              <p className="phase-word">Réaliser.</p>
              <p className="phase-line mt-5">Pierre, mélèze, eau&nbsp;: nos équipes posent chaque pièce.</p>
            </div>
          </div>
        </div>

        <div className="band e-sweep" data-a="0.68" data-b="0.81">
          <p className="mono hero-kicker">Saisons</p>
          <p className="phase-word mt-5" data-split="sweep" data-seed="41" data-spread="0.6">Faire vivre.</p>
          <p className="phase-line mt-5" data-split="sweep" data-seed="42" data-spread="0.8">Puis le jardin vit, et nous l’entretenons.</p>
        </div>

        <div className="band band-settle e-settle" data-a="0.83" data-b="1" data-ramp="0.04">
          <div className="hand"><p className="mono hero-kicker">Germa Paysages · Monthey · Etoy</p></div>
          <div className="hand"><p className="settle-title mt-5" data-split="words" data-seed="51" data-spread="0.5">Des extérieurs qui prennent vie.</p></div>
          <div className="hand">
            <div className="row mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href="#contact" className="btn-cta">Parler de mon projet</a>
              <a href="#realisations" className="link-draw">Voir nos réalisations</a>
            </div>
          </div>
          <div className="hand"><p className="mono hero-kicker mt-6">Jardin de vision · Les réalisations Germa suivent.</p></div>
        </div>

        <div className="scroll-cue mono flex items-center gap-3 text-ink" aria-hidden="true">
          <span>Défiler</span>
          <span className="block h-px w-10 bg-graphite" />
        </div>
      </div>

      {/* ---------- the static hero (phones, portrait, coarse pointer, reduced motion) ---------- */}
      <div className="film-static">
        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
          <Image src={GARDEN.finished} alt="Jardin de vision : villa contemporaine, piscine et pergola au-dessus du Léman (illustration)" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="static-copy relative mx-5 -mt-4 mb-12 px-5 pt-6 pb-10 sm:mx-8 sm:px-8">
          <p className="mono text-graphite">Du trait au jardin</p>
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
