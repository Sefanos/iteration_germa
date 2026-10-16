/** The five static-hero gates. Character for character the same list as the media query in globals.css. */
export const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];
export const gated = () => GATES.some((q) => window.matchMedia(q).matches);
