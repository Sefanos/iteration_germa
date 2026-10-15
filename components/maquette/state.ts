/**
 * One plain state object, written by a single GSAP timeline (scrubbed on native scroll)
 * and read by the frame scrubber. GSAP never touches React state.
 */
export const sceneState = {
  /** Fractional frame index into the maquette sequence (0 … count − 1). */
  frame: 0,
  /** Chapter within about one viewport of the screen. */
  visible: false,
};

/** Set by the sequence renderer once mounted, so the timeline can request a redraw. */
export const sceneBus: { invalidate: (() => void) | null } = { invalidate: null };

import frames from "./frames.json";

export const SEQUENCE = {
  /** Frames are 1-based files: /media/maquette/seq/{width}/f001.webp … (count written by tools/build-sequence.sh) */
  count: frames.count,
  widths: [1600, 800] as const,
  poster: "/media/maquette-poster.jpg",
};
