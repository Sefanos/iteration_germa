/** Hand-drawn line segments for each section, in the section's own pixel space. */

export const MARGIN = (w: number) => Math.max(20, Math.min(w * 0.066, 96)) - 18; // same x as the hero's stem

const wob = (y: number) => 1.8 * Math.sin(y / 61) + 1.1 * Math.sin(y / 23 + 1);

/** A plain vertical run with a hand wobble from y0 to y1 at x. */
export function run(x: number, y0: number, y1: number, steps = 8) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    pts.push(`${i === 0 ? "L" : "L"} ${(x + wob(y)).toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

/** Section 2: the boundary. Down the margin, along the top edge of the track, then resume below the track. */
export function planches(w: number, h: number, trackTop: number, trackBottom: number) {
  const x = MARGIN(w);
  return `M ${x} 0 ${run(x, 0, trackTop - 14)} C ${x} ${trackTop} ${x + 12} ${trackTop} ${x + 26} ${trackTop} L ${w + 40} ${trackTop + 0.5} M ${x} ${trackBottom} ${run(x, trackBottom, h)}`;
}

/** Section 3: steps down the index, one tick per row. */
export function index(w: number, h: number, rows: number[]) {
  const x = MARGIN(w);
  let d = `M ${x} 0 `;
  let y = 0;
  for (const ry of rows) {
    d += run(x, y, ry - 2) + ` L ${x + 22} ${ry} L ${x} ${ry + 2} `;
    y = ry + 2;
  }
  d += run(x, y, h);
  return d;
}

/** Section 4: the contour passes through the three states, then returns to the margin. */
export function contour(w: number, h: number, bandTop: number, bandBottom: number) {
  const x = MARGIN(w);
  const mid = (bandTop + bandBottom) / 2;
  let d = `M ${x} 0 ${run(x, 0, bandTop - 30)} C ${x} ${bandTop} ${x + 30} ${mid} ${x + 90} ${mid} `;
  const n = 10;
  for (let i = 1; i <= n; i++) {
    const px = x + 90 + ((w - x - 90) * i) / n;
    const py = mid + 22 * Math.sin(i * 1.1) + 9 * Math.sin(i * 2.7);
    d += `L ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  d += `M ${x} ${bandBottom + 20} ${run(x, bandBottom + 20, h)}`;
  return d;
}

/** Section 5 (moss): straight run down the margin; the lime tip travels it. */
export function showroom(w: number, h: number) {
  const x = MARGIN(w);
  return `M ${x} 0 ${run(x, 0, h, 12)}`;
}

/** Section 6: arrives, curls under the CTA and ends in a small closed loop. */
export function contact(w: number, h: number, ctaBottom: number, ctaRight: number) {
  const x = MARGIN(w);
  const y = ctaBottom + 22;
  return `M ${x} 0 ${run(x, 0, y - 26)} c 0 16 9 26 26 26 L ${ctaRight} ${y} c 14 0 18 -14 8 -18 c -10 -4 -16 10 -6 16`;
}
