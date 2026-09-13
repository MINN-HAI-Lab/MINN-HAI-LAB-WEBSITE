import { describe as suite, expect, it } from 'vitest';
import { trace } from './mastery.ts';
import { VIEW, blend, layout, xFor, yFor } from './trace-geometry.ts';

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

suite('blend', () => {
  const before = trace([true, true, true, true]);
  const after = trace([true, false, true, true]);

  it('returns the start at t=0 and the destination at t=1', () => {
    expect(blend(before, after, 0).final).toBeCloseTo(before.final, 10);
    expect(blend(before, after, 1).final).toBeCloseTo(after.final, 10);
  });

  it('moves the estimate part way at t=0.5', () => {
    const mid = blend(before, after, 0.5);
    const a = before.steps[1]!.estimate;
    const b = after.steps[1]!.estimate;
    expect(mid.steps[1]!.estimate).toBeCloseTo((a + b) / 2, 10);
    expect(mid.steps[1]!.estimate).toBeGreaterThan(Math.min(a, b));
    expect(mid.steps[1]!.estimate).toBeLessThan(Math.max(a, b));
  });

  it('takes the outcome from the destination, never a half-flipped attempt', () => {
    // A mid-animation frame is a drawing, not a model state. Interpolating
    // `correct` would put a number on screen that BKT never produced.
    const mid = blend(before, after, 0.5);
    expect(mid.steps.map((s) => s.correct)).toEqual(after.steps.map((s) => s.correct));
  });

  it('keeps the band bracketing the curve at every frame', () => {
    for (let i = 0; i <= 10; i += 1) {
      const frame = blend(before, after, i / 10);
      for (const step of frame.steps) {
        expect(step.lower).toBeLessThanOrEqual(step.estimate);
        expect(step.upper).toBeGreaterThanOrEqual(step.estimate);
      }
    }
  });

  it('produces a drawable geometry at every frame', () => {
    for (let i = 0; i <= 10; i += 1) {
      const geometry = layout(blend(before, after, i / 10));
      expect(geometry.curvePath).toMatch(/^M/);
      expect(geometry.bandPath.trim().endsWith('Z')).toBe(true);
      expect(geometry.curvePath).not.toMatch(/NaN/);
      expect(geometry.bandPath).not.toMatch(/NaN/);
    }
  });
});

suite('hit targets', () => {
  it('spans the full slot, so adjacent targets touch without overlapping', () => {
    const geometry = layout(trace(SEQUENCE));
    const usable = VIEW.width - VIEW.padX * 2;
    expect(geometry.slotWidth).toBeCloseTo(usable / SEQUENCE.length, 10);

    const gaps = geometry.marks
      .slice(1)
      .map((mark, i) => mark.x - geometry.marks[i]!.x);
    for (const gap of gaps) expect(gap).toBeCloseTo(geometry.slotWidth, 10);
  });

  it('stays at or above 24 CSS pixels down to a 360px viewport', () => {
    // 264px is what the drawing renders at on a 360px viewport once the page
    // gutter, panel padding and axis-label gutter are taken out. That figure
    // is CSS, not geometry, so this test can only check the arithmetic on one
    // side of it — the authoritative check is the target-size spec in
    // src/e2e, which measures the real boxes. Trimming the CSS is what put
    // this back to 24px after the label gutter dropped it to 22.
    const geometry = layout(trace(SEQUENCE));
    const scale = 264 / VIEW.width;
    expect(geometry.slotWidth * scale).toBeGreaterThanOrEqual(24);
    expect(VIEW.hitHeight * scale).toBeGreaterThanOrEqual(24);
  });

  it('keeps the hit target inside the viewBox and clear of the chart', () => {
    const top = VIEW.marksY - VIEW.hitHeight / 2;
    const bottom = VIEW.marksY + VIEW.hitHeight / 2;
    expect(top).toBeGreaterThanOrEqual(0);
    expect(bottom).toBeLessThan(VIEW.chartTop);
  });
});
