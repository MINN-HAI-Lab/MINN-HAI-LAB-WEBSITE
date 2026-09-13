/**
 * Artefact 3 — where a model looks.
 *
 * Two halves, and it matters which is which.
 *
 * THE IMAGE IS REAL AND OPENLY LICENSED. It is a photograph released under
 * CC0 1.0, a public domain dedication — "Tabby cat with blue eyes" by
 * AdinaVoicu, from Pixabay via Wikimedia Commons. The licence was read from
 * the Commons API rather than assumed, and the source and terms are recorded
 * in docs/review-queue.md as Q-21 and printed under the artefact itself.
 *
 * THE SALIENCY IS REAL TOO. It is the gradient magnitude of that photograph's
 * own pixels — a 3x3 Sobel response — computed in the browser from what is on
 * screen. Nothing is precomputed, painted on, or approximated.
 *
 * The only invented part is the fixation point, which is wherever the reader's
 * cursor is. That is the honest way round: the model's response to the picture
 * is genuine, and the thing standing in for a model's gaze is under the
 * reader's own control.
 *
 * The photograph earns its place rather than decorating: sharp eyes and
 * whiskers against a thrown-out background is exactly the contrast the
 * artefact exists to show — structure attracts attention, smooth regions do
 * not, and no amount of proximity to the fixation point changes that.
 */

/**
 * Gradient magnitude, by a 3x3 Sobel operator on luminance.
 *
 * This is the actual computation, not an approximation of one. It is what
 * "where is there structure in this image" means at the lowest level.
 *
 * Returns one value per pixel, normalised to 0..1.
 */
export function edgeEnergy(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): Float32Array {
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
 * A Gaussian around the fixation point, one value per pixel, peaking at 1.
 *
 * Kept separate from the attention field because the drawing needs both: the
 * attention decides where the heat goes, and the gaze alone decides how far
 * the periphery is dimmed. `falloff` is a standard deviation, in pixels of the
 * working resolution.
 */
export function gazeAt(
  width: number,
  height: number,
  fx: number,
  fy: number,
  falloff: number,
): Float32Array {
  const out = new Float32Array(width * height);
  const twoSigmaSquared = 2 * falloff * falloff;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const d2 = (x - fx) ** 2 + (y - fy) ** 2;
      out[y * width + x] = Math.exp(-d2 / twoSigmaSquared);
    }
  }
  return out;
}

/**
 * Combine edge energy with a fixation point.
 *
 * The model attends to structure, but only near where it is currently looking
 * — which is the behaviour worth showing, because it is why a saliency map
 * moves rather than sitting still. Structure gates it, so a smooth region next
 * to the cursor stays dark: a pure distance falloff would just be a spotlight,
 * and a spotlight explains nothing.
 */
export function attentionAt(energy: Float32Array, gaze: Float32Array): Float32Array {
  const out = new Float32Array(energy.length);
  for (let i = 0; i < energy.length; i += 1) out[i] = energy[i]! * gaze[i]!;
  return out;
}
