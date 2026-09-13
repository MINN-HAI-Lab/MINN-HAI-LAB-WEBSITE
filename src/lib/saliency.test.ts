import { describe as suite, expect, it } from 'vitest';
import { attentionAt, edgeEnergy, gazeAt, ramp } from './saliency.ts';

/** A width x height image, mid grey, with a hard vertical edge at `edgeX`. */
function striped(width: number, height: number, edgeX: number): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const level = x < edgeX ? 30 : 220;
      const p = (y * width + x) * 4;
      pixels[p] = level;
      pixels[p + 1] = level;
      pixels[p + 2] = level;
      pixels[p + 3] = 255;
    }
  }
  return pixels;
}

suite('edgeEnergy', () => {
  it('finds an edge where there is one and nothing where there is not', () => {
    const width = 20;
    const height = 12;
    const energy = edgeEnergy(striped(width, height, 10), width, height);
    const row = 6;

    // The Sobel window straddles the boundary, so the response lands on the
    // two columns either side of it.
    expect(energy[row * width + 9]!).toBeGreaterThan(0.9);
    expect(energy[row * width + 10]!).toBeGreaterThan(0.9);
    // Well inside either flat region there is no gradient at all.
    expect(energy[row * width + 4]!).toBe(0);
    expect(energy[row * width + 16]!).toBe(0);
  });

  it('normalises the strongest response to one', () => {
    const energy = edgeEnergy(striped(20, 12, 10), 20, 12);
    expect(Math.max(...energy)).toBeCloseTo(1, 6);
  });

  it('returns all zeros for a flat image rather than dividing by zero', () => {
    const flat = new Uint8ClampedArray(8 * 8 * 4).fill(128);
    const energy = edgeEnergy(flat, 8, 8);
    expect([...energy].every((v) => v === 0)).toBe(true);
  });
});

suite('gazeAt', () => {
  it('peaks at the fixation point and falls away from it', () => {
    const gaze = gazeAt(40, 40, 20, 20, 6);
    expect(gaze[20 * 40 + 20]!).toBeCloseTo(1, 6);
    expect(gaze[20 * 40 + 26]!).toBeLessThan(gaze[20 * 40 + 22]!);
    expect(gaze[0]!).toBeLessThan(0.001);
  });
});

suite('attentionAt', () => {
  it('leaves a smooth region dark however close the fixation point is', () => {
    // The point of the artefact: proximity alone earns nothing. A flat patch
    // right under the cursor stays at zero because it has no structure.
    const width = 20;
    const height = 12;
    const energy = edgeEnergy(striped(width, height, 10), width, height);
    const gaze = gazeAt(width, height, 4, 6, 5);
    const attention = attentionAt(energy, gaze);
    expect(attention[6 * width + 4]!).toBe(0);
  });

  it('is strongest where structure and gaze coincide', () => {
    const width = 20;
    const height = 12;
    const energy = edgeEnergy(striped(width, height, 10), width, height);
    const near = attentionAt(energy, gazeAt(width, height, 10, 6, 4));
    const far = attentionAt(energy, gazeAt(width, height, 19, 6, 4));
    expect(Math.max(...near)).toBeGreaterThan(Math.max(...far));
  });
});

suite('ramp', () => {
  it('runs from the dark end of viridis to the bright one', () => {
    expect(ramp(0)).toEqual([68, 1, 84]);
    expect(ramp(1)).toEqual([253, 231, 37]);
  });

  it('clamps rather than extrapolating past either end', () => {
    expect(ramp(-3)).toEqual(ramp(0));
    expect(ramp(9)).toEqual(ramp(1));
  });

  it('increases in luminance monotonically, which is what perceptual uniformity buys', () => {
    let previous = -1;
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const [r, g, b] = ramp(t);
      const luma = r * 0.299 + g * 0.587 + b * 0.114;
      expect(luma).toBeGreaterThan(previous);
      previous = luma;
    }
  });
});
