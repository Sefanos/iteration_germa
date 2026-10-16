"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { GATES, gated } from "./gates";
import { bus } from "./state";
import Arrival from "./Arrival";

const PageCanvas = dynamic(() => import("./PageCanvas"), { ssr: false });

/** Mounts the page canvas at the page root whenever the scrub is allowed; the hero's poster fades once a frame is drawn. */
export default function CanvasMount() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mqls = GATES.map((q) => window.matchMedia(q));
    const apply = () => setOn(!gated());
    mqls.forEach((m) => m.addEventListener("change", apply));
    apply();
    return () => mqls.forEach((m) => m.removeEventListener("change", apply));
  }, []);
  const onReady = useCallback(() => { bus.ready?.(); document.body.classList.add("canvas-ready"); document.dispatchEvent(new Event("garden:ready")); }, []);
  return on ? (<><PageCanvas onReady={onReady} /><Arrival /></>) : null;
}
