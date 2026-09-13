import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe as suite, expect, it } from 'vitest';
import { contrastRatio, glassOver, parseHex, parseRgb, resolveColourTokens } from './contrast.ts';

/**
 * Contrast on the dark instrument field.
 *
 * The palette comes from the brief rather than from design/DESIGN.md, which
 * still describes the light six-colour system and is out of date (Q-19). So
 * this asserts the floor directly rather than checking a table against itself.
 *
 * The point worth keeping: text on a glass panel sits on the surface fill
 * composited over the field, not on the field. Measuring against the field
 * alone overstates every ratio, and that is the mistake this exists to catch.
 */

const TOKENS = readFileSync(
  fileURLToPath(new URL('../styles/tokens.css', import.meta.url)),
  'utf8',
);

/** WCAG AA for body text. */
const BODY_FLOOR = 4.5;
/** WCAG AA for non-text that has to be perceived. */
const NON_TEXT_FLOOR = 3;

const tokens = resolveColourTokens(TOKENS);
const raw = (name: string): string => {
  const match = TOKENS.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!match) throw new Error(`--${name} is not defined in tokens.css`);
  return match[1]!.trim();
};
const hex = (name: string): string => {
  const value = tokens.get(name);
  if (!value) throw new Error(`--${name} does not resolve to a hex in tokens.css`);
  return value;
};

suite('compositing', () => {
  it('reads the modern and legacy rgb() spellings', () => {
    expect(parseRgb('rgb(255 255 255 / 0.045)')).toEqual({ rgb: [255, 255, 255], alpha: 0.045 });
    expect(parseRgb('rgba(255, 255, 255, 0.1)')).toEqual({ rgb: [255, 255, 255], alpha: 0.1 });
    expect(parseRgb('rgb(255 255 255 / 10%)')?.alpha).toBeCloseTo(0.1, 6);
  });

  it('lightens a dark field rather than darkening it', () => {
    const composite = glassOver('rgb(255 255 255 / 0.045)', '#070b10');
    expect(parseHex(composite)[0]).toBeGreaterThan(parseHex('#070b10')[0]);
  });

  it('refuses a surface that is not an rgb() colour', () => {
    expect(() => glassOver('#ffffff', '#070b10')).toThrow();
  });
});

suite('body text clears 4.5:1 on every surface it can land on', () => {
  const field = hex('color-field');
  const field2 = hex('color-field-2');
  const surface = raw('surface');

  const surfaces: Array<[string, string]> = [
    ['--field', field],
    ['--field-2', field2],
    ['glass over --field', glassOver(surface, field)],
    ['glass over --field-2', glassOver(surface, field2)],
  ];

  for (const [name, background] of surfaces) {
    it(`--text on ${name}`, () => {
      const ratio = contrastRatio(hex('color-text'), background);
      expect(ratio, `${ratio.toFixed(2)}:1 on ${background}`).toBeGreaterThanOrEqual(BODY_FLOOR);
    });

    it(`--text-muted on ${name}`, () => {
      // The tightest case in the system. If the surface alpha ever rises this
      // is the first thing to fail.
      const ratio = contrastRatio(hex('color-text-muted'), background);
      expect(ratio, `${ratio.toFixed(2)}:1 on ${background}`).toBeGreaterThanOrEqual(BODY_FLOOR);
    });

    it(`--signal on ${name}`, () => {
      // --signal carries model output, which is content, so it is held to the
      // text floor rather than the non-text one.
      const ratio = contrastRatio(hex('color-signal'), background);
      expect(ratio, `${ratio.toFixed(2)}:1 on ${background}`).toBeGreaterThanOrEqual(BODY_FLOOR);
    });
  }
});

suite('the hairlines are decorative, and stay that way', () => {
  const field = hex('color-field');

  it('--surface-edge is below the non-text floor', () => {
    // Asserted rather than assumed. The glass edge is a visual refinement; if
    // a glass panel is itself a control, its edge cannot be the only thing
    // marking it.
    const edge = glassOver(raw('surface-edge'), field);
    expect(contrastRatio(edge, field)).toBeLessThan(NON_TEXT_FLOOR);
  });

  it('--grid is below the non-text floor', () => {
    const grid = glassOver(raw('grid'), field);
    expect(contrastRatio(grid, field)).toBeLessThan(NON_TEXT_FLOOR);
  });
});
