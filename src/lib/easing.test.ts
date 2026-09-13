import { describe as suite, expect, it } from 'vitest';
import { EASE_MID, EASE_OUT, cubicBezier, durationToMs } from './easing.ts';

suite('cubicBezier', () => {
  const ease = cubicBezier(EASE_OUT);

  it('pins both endpoints', () => {
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
  });

  it('clamps outside the unit interval', () => {
    expect(ease(-1)).toBe(0);
    expect(ease(2)).toBe(1);
  });

  it('increases monotonically', () => {
    let previous = -1;
    for (let i = 0; i <= 100; i += 1) {
      const value = ease(i / 100);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it('front-loads, which is what makes --ease-out decelerate', () => {
    // cubic-bezier(0.22, 1, 0.36, 1) covers most of the distance early and
    // settles into the final value. If this ever reads below 0.5 at the
    // halfway point the curve has been replaced by an ease-in.
    expect(ease(0.5)).toBeGreaterThan(0.8);
  });

  it('handles the linear curve without dividing by a zero slope', () => {
    const linear = cubicBezier({ x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5 });
    expect(linear(0.25)).toBeCloseTo(0.25, 6);
    expect(linear(0.75)).toBeCloseTo(0.75, 6);
  });

  it('solves --ease-mid as well', () => {
    const mid = cubicBezier(EASE_MID);
    expect(mid(0)).toBe(0);
    expect(mid(1)).toBe(1);
    expect(mid(0.5)).toBeGreaterThan(0);
    expect(mid(0.5)).toBeLessThan(1);
  });
});

suite('durationToMs', () => {
  it('reads the token spellings the build emits', () => {
    // tokens.css says 180ms; the minifier rewrites it to .18s. Both have to
    // come back as the same number of milliseconds.
    expect(durationToMs('180ms')).toBe(180);
    expect(durationToMs('.18s')).toBeCloseTo(180, 6);
    expect(durationToMs('0.6s')).toBeCloseTo(600, 6);
    expect(durationToMs(' 120ms ')).toBe(120);
  });

  it('returns zero for an empty or unreadable value, so motion is skipped rather than broken', () => {
    expect(durationToMs('')).toBe(0);
    expect(durationToMs('none')).toBe(0);
  });
});
