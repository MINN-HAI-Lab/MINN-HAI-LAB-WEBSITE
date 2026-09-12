import { describe as suite, expect, it } from 'vitest';
import { trace } from './mastery.ts';
import { VIEW, layout, xFor, yFor } from './trace-geometry.ts';

const SEQUENCE = [false, false, true, false, true, true, false, true, true, true];

/** Pull the numeric pairs out of a path `d`. */
const points = (d: string): Array<[number, number]> =>
  [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);

suite('yFor', () => {
  it('maps 1 to the top of the plotted area and 0 to the bottom', () => {
    expect(yFor(1)).toBe(VIEW.chartTop);
    expect(yFor(0)).toBe(VIEW.chartBottom);
  });

  it('is monotonically decreasing in the estimate, because SVG y grows downward', () => {
    expect(yFor(0.75)).toBeLessThan(yFor(0.25));
  });

  it('puts a half estimate halfway up', () => {
    expect(yFor(0.5)).toBeCloseTo((VIEW.chartTop + VIEW.chartBottom) / 2, 10);
  });
});

suite('xFor', () => {
  const count = 10;

  it('starts the prior at the left inset and ends the last attempt at the right', () => {
    expect(xFor(0, count)).toBe(VIEW.padX);
    expect(xFor(count, count)).toBeCloseTo(VIEW.width - VIEW.padX, 10);
  });

  it('spaces slots evenly', () => {
    const gaps = Array.from({ length: count }, (_, i) => xFor(i + 1, count) - xFor(i, count));
    for (const gap of gaps) expect(gap).toBeCloseTo(gaps[0]!, 10);
  });

  it('does not divide by zero on an empty sequence', () => {
    expect(Number.isFinite(xFor(0, 0))).toBe(true);
  });
});

suite('layout of a ten-attempt sequence', () => {
  const result = trace(SEQUENCE);
  const geometry = layout(result);

  it('draws one mark per attempt', () => {
    expect(geometry.marks).toHaveLength(SEQUENCE.length);
    expect(geometry.marks.map((m) => m.correct)).toEqual(SEQUENCE);
  });

  it('starts the curve at the prior, one point ahead of the attempts', () => {
    expect(geometry.curve).toHaveLength(SEQUENCE.length + 1);
    expect(geometry.curve[0]!.index).toBe(-1);
    expect(geometry.curve[0]!.estimate).toBe(result.initial);
  });

  it('puts every mark directly above its point on the curve', () => {
    for (const mark of geometry.marks) {
      const point = geometry.curve.find((p) => p.index === mark.index)!;
      expect(mark.x).toBeCloseTo(point.x, 10);
    }
  });

  it('keeps every drawn point inside the plotted area', () => {
    for (const point of geometry.curve) {
      expect(point.y).toBeGreaterThanOrEqual(VIEW.chartTop);
      expect(point.y).toBeLessThanOrEqual(VIEW.chartBottom);
      expect(point.x).toBeGreaterThanOrEqual(VIEW.padX);
      expect(point.x).toBeLessThanOrEqual(VIEW.width - VIEW.padX);
    }
  });
});

suite('uncertainty band', () => {
  const result = trace(SEQUENCE);
  const geometry = layout(result);

  it('is a single closed polygon', () => {
    // Upper edge left to right, lower edge right to left, then Z. Two subpaths
    // or a missing Z would fill as two triangles rather than a band.
    expect(geometry.bandPath.match(/M/g)).toHaveLength(1);
    expect(geometry.bandPath.trim().endsWith('Z')).toBe(true);
  });

  it('traces out and back, so it has two points per attempt', () => {
    expect(points(geometry.bandPath)).toHaveLength(SEQUENCE.length * 2);
  });

  it('returns to the x it started from', () => {
    const p = points(geometry.bandPath);
    expect(p.at(-1)![0]).toBeCloseTo(p[0]![0], 10);
  });

  it('brackets the curve at every attempt', () => {
    // y is inverted, so the upper bound sits at the smaller y.
    for (const step of result.steps) {
      const point = geometry.curve.find((p) => p.index === step.index)!;
      expect(yFor(step.upper)).toBeLessThanOrEqual(point.y);
      expect(yFor(step.lower)).toBeGreaterThanOrEqual(point.y);
    }
  });

  it('gives each edge its own open stroke, one point per attempt', () => {
    expect(points(geometry.bandUpperPath)).toHaveLength(SEQUENCE.length);
    expect(points(geometry.bandLowerPath)).toHaveLength(SEQUENCE.length);
    expect(geometry.bandUpperPath.trim().endsWith('Z')).toBe(false);
    expect(geometry.bandLowerPath.trim().endsWith('Z')).toBe(false);
  });

  it('narrows from left to right as evidence accumulates', () => {
    const first = result.steps[0]!;
    const last = result.steps.at(-1)!;
    expect(yFor(last.lower) - yFor(last.upper)).toBeLessThan(
      yFor(first.lower) - yFor(first.upper),
    );
  });
});

suite('empty sequence', () => {
  const geometry = layout(trace([]));

  it('draws no marks and no band', () => {
    expect(geometry.marks).toEqual([]);
    expect(geometry.bandPath).toBe('');
  });

  it('still plots the prior, so the panel is not blank', () => {
    expect(geometry.curve).toHaveLength(1);
    expect(geometry.curvePath).toMatch(/^M/);
  });
});

suite('single attempt', () => {
  const geometry = layout(trace([true]));

  it('spans the full width with one mark at the right', () => {
    expect(geometry.marks).toHaveLength(1);
    expect(geometry.marks[0]!.x).toBeCloseTo(VIEW.width - VIEW.padX, 10);
    expect(geometry.curve[0]!.x).toBe(VIEW.padX);
  });

  it('produces a degenerate band rather than a broken path', () => {
    // Two points, out and back along the same x. It has no area, which is
    // correct: one attempt gives no width to sweep.
    expect(points(geometry.bandPath)).toHaveLength(2);
    expect(geometry.bandPath.trim().endsWith('Z')).toBe(true);
  });
});
