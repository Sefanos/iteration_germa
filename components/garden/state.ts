import frames from "./frames.json";

/** Plain state written by the scroll drives and read by the page canvas. GSAP never touches React state. */
export const filmState = {
  /** absolute fractional frame index into the whole sequence (film + exploration) */
  frame: 0,
  visible: true,
};

export const bus: { film: (() => void) | null; sun: (() => void) | null; ready: (() => void) | null; wordmark: ((t: number) => void) | null; dusk: number } = { film: null, sun: null, ready: null, wordmark: null, dusk: 0 };

export type Chapter = { id: string; start: number; end: number };

export const GARDEN = {
  frameDir: "/media/garden/seq",
  fps: frames.fps as number,
  /** total frames in the sequence (0 = none yet) */
  frameCount: frames.count as number,
  /** chapters in order, as [first, last] frame indices */
  chapters: (frames.chapters ?? []) as Chapter[],
  finished: "/media/garden/K6.jpg",
  arrivalPoster: "/media/garden/arrival-poster.jpg",
  dusk: "/media/garden/K7.jpg",
  /** hero: the construction film runs over progress 0..0.8, then holds its last frame */
  filmEnd: 0.8,
};

/** A chapter by id. A chapter that is not exported yet holds the last frame of the one before it (never re-scrubs the film). */
export const chapter = (id: string): Chapter => {
  const found = GARDEN.chapters.find((c) => c.id === id);
  if (found) return found;
  const last = Math.max(0, GARDEN.frameCount - 1);
  return { id, start: last, end: last };
};

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);

if (typeof window !== "undefined") (window as unknown as { __filmState: typeof filmState }).__filmState = filmState;
