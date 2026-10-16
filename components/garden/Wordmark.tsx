"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { bus } from "./state";

/**
 * The Germa name over the lake during the arrival, Mejuma-style: the real logo, huge and white,
 * with a live rippled reflection in the water below it. Fades and lifts as the camera lands.
 */
export default function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;
    const prev = bus.wordmark;
    bus.wordmark = (t: number) => {
      // t = 0 fully on, 1 gone
      if (Math.abs(t - last) < 0.005) return;
      last = t;
      el.style.opacity = `${1 - t}`;
      el.style.transform = `translateY(${(-60 * t).toFixed(1)}px)`;
      el.style.visibility = t >= 0.995 ? "hidden" : "visible";
    };
    return () => { bus.wordmark = prev; };
  }, []);
  return (
    <div ref={ref} className="wordmark" aria-hidden="true">
      <div className="wordmark-mark">
        <Image src="/media/germa-wordmark.svg" alt="" width={376} height={181} unoptimized priority />
      </div>
      <div className="wordmark-reflection">
        <Image src="/media/germa-wordmark.svg" alt="" width={376} height={181} unoptimized />
      </div>
      <svg className="wordmark-filter" aria-hidden="true" focusable="false">
        <filter id="ripple" x="-10%" y="-10%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.08" numOctaves="2" seed="3" result="noise">
            <animate attributeName="baseFrequency" dur="14s" values="0.012 0.08;0.016 0.1;0.012 0.08" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}
