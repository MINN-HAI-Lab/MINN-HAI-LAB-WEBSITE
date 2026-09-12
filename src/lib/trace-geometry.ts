/**
 * Geometry for the trace widget.
 *
 * Pure, dependency-free, and deliberately separate from rendering: the build
 * uses it to emit the static SVG, and the browser uses the identical function
 * to redraw after a toggle. One implementation means the JS-off fallback and
 * the interactive version cannot drift apart.
 *
 * COORDINATE SPACE
 *
 * The SVG uses a fixed viewBox and scales down to fit its container, never up.
 * One user unit equals one CSS pixel at the nominal width, so --mark-size and
 * --curve-width from DESIGN.md are exact at full size and shrink
 * proportionally on narrow screens. Nothing here is a design token; these are
 * the dimensions of a drawing surface.
 */

import type { TraceResult } from './mastery.ts';

/** Nominal drawing surface. Scales down, never up. */
export const VIEW = {
  width: 700,
  height: 240,
  /** Horizontal inset so marks and end points do not clip. */
  padX: 30,
  /** Centre line of the row of attempt marks. */
  marksY: 26,
  /** Top of the plotted area, y for an estimate of 1. */
  chartTop: 76,
  /** Bottom of the plotted area, y for an estimate of 0. */
  chartBottom: 206,
} as const;

/** One attempt mark, positioned. */
export interface MarkPoint {
  /** Index into the attempts array. */
  index: number;
  correct: boolean;
  x: number;
  y: number;
}

/** One point on the mastery curve. */
export interface CurvePoint {
  /** -1 for the prior, then the attempt index. */
  index: number;
  x: number;
  y: number;
  estimate: number;
}

export interface TraceGeometry {
  marks: MarkPoint[];
  curve: CurvePoint[];
  /** `d` for the curve path. */
  curvePath: string;
  /** `d` for the closed uncertainty band. Empty when there are no attempts. */
  bandPath: string;
  /** `d` for the band's upper edge stroke. */
  bandUpperPath: string;
  /** `d` for the band's lower edge stroke. */
  bandLowerPath: string;
}

/** Map an estimate in [0, 1] onto the plotted area. */
export function yFor(estimate: number): number {
  const { chartTop, chartBottom } = VIEW;
  return chartBottom - estimate * (chartBottom - chartTop);
}

/**
 * x position for a point.
 *
 * Slot 0 is the prior, before any attempt; slot i + 1 is attempt i. Spacing is
 * even across the available width, so a mark always sits directly above its
 * point on the curve.
 */
export function xFor(slot: number, attemptCount: number): number {
  const { width, padX } = VIEW;
  const usable = width - padX * 2;
  if (attemptCount <= 0) return padX;
  return padX + (slot * usable) / attemptCount;
}

/** Round to two decimals so path strings stay short and diffs stay readable. */
const r = (n: number): number => Math.round(n * 100) / 100;

/** Build a polyline `d` from points. Straight segments: the model is discrete
 *  and a smoothed spline would imply readings between attempts that do not
 *  exist. */
function polyline(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${r(p.x)} ${r(p.y)}`)
    .join(' ');
}

/**
 * Lay a trace result out in the coordinate space.
 *
 * The curve begins at the prior, so a reader can see where the model started
 * before it was told anything. The band covers the attempts only: the prior
 * carries no observation and therefore no interval.
 */
export function layout(result: TraceResult): TraceGeometry {
  const count = result.steps.length;

  const curve: CurvePoint[] = [
    { index: -1, x: xFor(0, count), y: yFor(result.initial), estimate: result.initial },
    ...result.steps.map((step) => ({
      index: step.index,
      x: xFor(step.index + 1, count),
      y: yFor(step.estimate),
      estimate: step.estimate,
    })),
  ];

  const marks: MarkPoint[] = result.steps.map((step) => ({
    index: step.index,
    correct: step.correct,
    x: xFor(step.index + 1, count),
    y: VIEW.marksY,
  }));

  const upper = result.steps.map((step) => ({
    x: xFor(step.index + 1, count),
    y: yFor(step.upper),
  }));
  const lower = result.steps.map((step) => ({
    x: xFor(step.index + 1, count),
    y: yFor(step.lower),
  }));

  const bandPath =
    count === 0
      ? ''
      : `${polyline(upper)} ${polyline([...lower].reverse())
          .replace(/^M/, 'L')} Z`;

  return {
    marks,
    curve,
    curvePath: polyline(curve),
    bandPath,
    bandUpperPath: polyline(upper),
    bandLowerPath: polyline(lower),
  };
}
