/**
 * Artefact 3 — where a model looks.
 *
 * Two halves, and it matters which is which.
 *
 * The image is synthetic. It is generated here, deterministically, from a seed
 * — not a photograph, not sourced, not licensed from anyone. That is a
 * deliberate choice over using an openly licensed photo: stating a licence I
 * could not verify would be inventing a fact, and a wrong licence attribution
 * on an academic site is a real problem rather than a cosmetic one. See Q-21.
 *
 * The saliency is real. It is the gradient magnitude of the image — a Sobel
 * edge response — which is genuinely what a low-level attention model keys on
 * and genuinely computed from the pixels, not painted on. Where the cursor is
 * modulates it, the way a fixation point would.
 *
 * So the artefact shows something true about images (structure attracts
 * attention) over something invented (this particular picture), and says so.
 */

export interface Scene {
  width: number;
  height: number;
  /** RGBA, four bytes per pixel. */
  pixels: Uint8ClampedArray;
}

/** Deterministic generator, so the scene is identical on every render. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build a synthetic scene with real structure.
 *
 * Not noise: noise has uniform gradient energy everywhere and the saliency map
 * over it is flat and says nothing. This has large smooth regions, a few hard
 * edges, and some fine texture, so the edge response actually varies and the
 * artefact has something to show.
 */
export function generateScene(width: number, height: number, seed = 20260913): Scene {
  const random = seeded(seed);
  const pixels = new Uint8ClampedArray(width * height * 4);

  /* A handful of soft blobs give broad tonal structure, and the hard-edged
     shapes below sit on top of them. */
  const blobs = Array.from({ length: 5 }, () => ({
    x: random() * width,
    y: random() * height,
    radius: (0.2 + random() * 0.35) * Math.min(width, height),
    level: 0.25 + random() * 0.5,
  }));

  const rects = Array.from({ length: 3 }, () => {
    const w = (0.12 + random() * 0.2) * width;
    const h = (0.12 + random() * 0.25) * height;
    return {
      x: random() * (width - w),
      y: random() * (height - h),
      w,
      h,
      level: random() > 0.5 ? 0.9 : 0.12,
    };
  });

  const discs = Array.from({ length: 4 }, () => ({
    x: random() * width,
    y: random() * height,
    radius: (0.04 + random() * 0.06) * Math.min(width, height),
    level: random() > 0.5 ? 0.95 : 0.08,
  }));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      // Smooth base.
      let value = 0.35;
      for (const blob of blobs) {
        const d = Math.hypot(x - blob.x, y - blob.y) / blob.radius;
        if (d < 1) value += (blob.level - 0.35) * (1 - d * d);
      }

      // Hard edges. These are what the gradient will find.
      for (const rect of rects) {
        if (x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h) {
          value = rect.level;
        }
      }
      for (const disc of discs) {
        if (Math.hypot(x - disc.x, y - disc.y) < disc.radius) value = disc.level;
      }

      // Fine texture in one band, so the map distinguishes "textured" from
      // "smooth" as well as "edge" from "flat".
      if (y > height * 0.62 && y < height * 0.78) {
        value += Math.sin(x * 0.6) * 0.06 + Math.sin(y * 0.9) * 0.04;
      }

      const level = Math.max(0, Math.min(1, value));
      // A cool blue-grey ramp, so the scene sits in the site's field rather
      // than fighting it. The heat overlay is the only warm thing here.
      const i = (y * width + x) * 4;
      pixels[i] = Math.round(level * 150 + 12);
      pixels[i + 1] = Math.round(level * 172 + 18);
      pixels[i + 2] = Math.round(level * 190 + 26);
      pixels[i + 3] = 255;
    }
  }

  return { width, height, pixels };
}

/**
 * Gradient magnitude, by a 3x3 Sobel operator on luminance.
 *
 * This is the actual computation, not an approximation of one. It is what
 * "where is there structure in this image" means at the lowest level, and it
 * is the honest half of the artefact.
 *
 * Returns one value per pixel, normalised to 0..1.
 */
export function edgeEnergy(scene: Scene): Float32Array {
  const { width, height, pixels } = scene;
  const luma = new Float32Array(width * height);

  for (let i = 0; i < width * height; i += 1) {
    const p = i * 4;
    // Rec. 601 luma. The exact weights matter less than using some, but
    // guessing them would be silly when they are standard.
    luma[i] = (pixels[p]! * 0.299 + pixels[p + 1]! * 0.587 + pixels[p + 2]! * 0.114) / 255;
  }

  const energy = new Float32Array(width * height);
  let peak = 0;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const at = (dx: number, dy: number): number => luma[(y + dy) * width + (x + dx)]!;

      const gx =
        -at(-1, -1) - 2 * at(-1, 0) - at(-1, 1) + at(1, -1) + 2 * at(1, 0) + at(1, 1);
      const gy =
        -at(-1, -1) - 2 * at(0, -1) - at(1, -1) + at(-1, 1) + 2 * at(0, 1) + at(1, 1);

      const magnitude = Math.hypot(gx, gy);
      energy[y * width + x] = magnitude;
      if (magnitude > peak) peak = magnitude;
    }
  }

  if (peak > 0) {
    for (let i = 0; i < energy.length; i += 1) energy[i] = energy[i]! / peak;
  }
  return energy;
}

/**
 * A viridis-like ramp, sampled at eight stops and interpolated.
 *
 * A colour ramp is allowed here because it carries information — attention
 * strength — rather than decorating anything. Viridis specifically because it
 * is perceptually uniform and survives greyscale, so the map still reads for a
 * colour-blind viewer and in print.
 */
const RAMP: ReadonlyArray<[number, number, number]> = [
  [68, 1, 84],
  [72, 40, 120],
  [62, 74, 137],
  [49, 104, 142],
  [38, 130, 142],
  [31, 158, 137],
  [53, 183, 121],
  [253, 231, 37],
];

export function ramp(t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * (RAMP.length - 1);
  const low = Math.floor(scaled);
  const high = Math.min(low + 1, RAMP.length - 1);
  const f = scaled - low;
  const a = RAMP[low]!;
  const b = RAMP[high]!;
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

/**
 * Combine edge energy with a fixation point.
 *
 * The model attends to structure, but only near where it is currently looking
 * — which is the behaviour worth showing, because it is why a saliency map
 * moves rather than sitting still. `falloff` is in pixels.
 */
export function attentionAt(
  energy: Float32Array,
  scene: Scene,
  fx: number,
  fy: number,
  falloff: number,
): Float32Array {
  const { width, height } = scene;
  const out = new Float32Array(energy.length);
  const twoSigmaSquared = 2 * falloff * falloff;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      const d2 = (x - fx) ** 2 + (y - fy) ** 2;
      const gaze = Math.exp(-d2 / twoSigmaSquared);
      // Structure gates it: a smooth region near the cursor stays dark, which
      // is the point. A pure distance falloff would just be a spotlight.
      out[i] = energy[i]! * gaze;
    }
  }
  return out;
}
