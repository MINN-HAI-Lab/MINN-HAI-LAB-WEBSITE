/**
 * Cubic bezier easing, evaluated in JavaScript.
 *
 * The trace animates by interpolating path coordinates frame by frame rather
 * than by handing a CSS transition the `d` property. `d` is animatable in
 * Chromium and Safari but not reliably in Firefox, and DESIGN.md is explicit
 * that the movement of the estimate *is* the information — losing it in one
 * browser would lose the point of the widget there.
 *
 * Interpolating in JS also makes the reduced-motion path exact: it can be
 * skipped outright rather than given a zero duration, which DESIGN.md warns
 * produces a jump.
 *
 * The curves themselves are the ones in DESIGN.md § Motion. No easing is
 * invented here; this only evaluates what is already written down.
 */

/** The control points of a CSS cubic-bezier(x1, y1, x2, y2). */
export interface BezierPoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** --ease-out: entrances, and the estimate. */
export const EASE_OUT: BezierPoints = { x1: 0.22, y1: 1, x2: 0.36, y2: 1 };

/** --ease-mid: other in-place state changes. */
export const EASE_MID: BezierPoints = { x1: 0.4, y1: 0, x2: 0.2, y2: 1 };

/** Bezier basis for one axis, with P0 = 0 and P3 = 1. */
function bezier(t: number, a: number, b: number): number {
  const u = 1 - t;
  return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
}

/** Derivative of the above, for Newton-Raphson. */
function bezierSlope(t: number, a: number, b: number): number {
  const u = 1 - t;
  return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b);
}

/**
 * Build an easing function from control points.
 *
 * CSS bezier easing is a parametric curve, so progress along x has to be
 * solved for before y can be read off. Newton-Raphson converges in a handful
 * of iterations across the range these curves use; the bisection fallback
 * catches the flat regions where the derivative approaches zero.
 */
export function cubicBezier({ x1, y1, x2, y2 }: BezierPoints): (progress: number) => number {
  // A linear curve needs no solving, and its zero slope would defeat Newton.
  if (x1 === y1 && x2 === y2) return (progress) => progress;

  return (progress: number): number => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;

    let t = progress;
    for (let i = 0; i < 8; i += 1) {
      const x = bezier(t, x1, x2) - progress;
      if (Math.abs(x) < 1e-6) return bezier(t, y1, y2);
      const slope = bezierSlope(t, x1, x2);
      if (Math.abs(slope) < 1e-6) break;
      t -= x / slope;
    }

    let low = 0;
    let high = 1;
    t = progress;
    for (let i = 0; i < 20; i += 1) {
      const x = bezier(t, x1, x2);
      if (Math.abs(x - progress) < 1e-6) break;
      if (x > progress) high = t;
      else low = t;
      t = (low + high) / 2;
    }
    return bezier(t, y1, y2);
  };
}

/** Read a duration token such as "180ms" or "0.18s" as milliseconds. */
export function durationToMs(value: string): number {
  const text = value.trim();
  const number = Number.parseFloat(text);
  if (!Number.isFinite(number)) return 0;
  return text.endsWith('ms') ? number : number * 1000;
}
