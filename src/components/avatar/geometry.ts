export type Pt = [number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom spline through the points, emitted as cubic Béziers. */
export function smoothPath(points: Pt[], closed = true, tension = 0.5): string {
  if (points.length < 2) return "";
  const pts = closed ? [points[points.length - 1], ...points, points[0], points[1]] : [points[0], ...points, points[points.length - 1]];
  let d = `M${r1(pts[1][0])},${r1(pts[1][1])}`;
  const end = closed ? pts.length - 2 : pts.length - 2;
  for (let i = 1; i < end; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2, p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2, p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2];
    d += ` C${r1(c1[0])},${r1(c1[1])} ${r1(c2[0])},${r1(c2[1])} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mirrors an x coordinate across the avatar's vertical centre line. */
export const mx = (x: number) => 320 - x;

export interface StrandOpts {
  top: number;
  bottom: number;
  outerTop: number;
  outerBottom: number;
  innerTop: number;
  innerBottom: number;
  wave: number;
  waves: number;
  steps?: number;
}

/** A lock of hair hanging down the left side of the face (mirror for the right). */
export function strandPoints(o: StrandOpts): Pt[] {
  const steps = o.steps ?? 12;
  const outer: Pt[] = [];
  const inner: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const sway = Math.sin(t * o.waves * Math.PI * 2) * o.wave * Math.min(1, t * 1.6);
    outer.push([lerp(o.outerTop, o.outerBottom, Math.pow(t, 0.8)) + sway, lerp(o.top, o.bottom, t)]);
    const swayIn = Math.sin(t * o.waves * Math.PI * 2 + 0.5) * o.wave * 0.8 * Math.min(1, t * 1.6);
    inner.push([lerp(o.innerTop, o.innerBottom, t) + swayIn, lerp(o.top + 34, o.bottom - 8, t)]);
  }
  const tip: Pt = [(outer[steps][0] + inner[steps][0]) / 2, o.bottom + 4];
  return [...outer, tip, ...inner.reverse()];
}

/** The mass of hair behind the head and shoulders. */
export function backHairPoints(bottom: number, spread: number, wave: number, waves: number): Pt[] {
  const left: Pt[] = [];
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const sway = Math.sin(t * waves * Math.PI * 2) * wave * t;
    left.push([lerp(84, 70 - spread, Math.pow(t, 0.7)) + sway, lerp(130, bottom, t)]);
  }
  const top: Pt[] = [
    [96, 92],
    [124, 68],
    [160, 60],
    [196, 68],
    [224, 92],
  ];
  // Clockwise: over the crown, down the right side, across the ends, up the left side.
  const right = left.map(([x, y]) => [mx(x), y] as Pt);
  const ends: Pt[] = [
    [lerp(mx(70 - spread), 160, 0.5), bottom + 10],
    [160, bottom + 14],
    [lerp(70 - spread, 160, 0.5), bottom + 10],
  ];
  return [...top, ...right, ...ends, ...[...left].reverse()];
}

/** Deterministic pseudo-random generator so freckles don't jump around on re-render. */
export function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bumpy circle outline, used for afros, buns and curls. */
export function bumpyCircle(cx: number, cy: number, r: number, bumps: number, depth: number, points = 64): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rr = r + Math.sin(a * bumps) * depth;
    out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return out;
}
