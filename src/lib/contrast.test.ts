import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe as suite, expect, it } from 'vitest';
import {
  contrastRatio,
  parseContrastTable,
  parseHex,
  resolveColourTokens,
} from './contrast.ts';

const read = (relative: string): string =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8');

const DESIGN = read('../../design/DESIGN.md');
const TOKENS = read('../styles/tokens.css');

/**
 * How far a stated ratio may sit from the measured one.
 *
 * DESIGN.md quotes to one decimal place, so 0.05 is exactly the rounding
 * error of that notation and nothing more. Anything larger is a real
 * disagreement between the file and the tokens it claims to describe.
 */
const TOLERANCE = 0.05;

suite('contrast maths', () => {
  it('matches the WCAG reference values at the extremes', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 6);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 6);
  });

  it('does not care which colour is named first', () => {
    expect(contrastRatio('#1c2830', '#eff1f2')).toBeCloseTo(
      contrastRatio('#eff1f2', '#1c2830'),
      10,
    );
  });

  it('reads shorthand and alpha hex', () => {
    expect(parseHex('#fff')).toEqual([255, 255, 255]);
    expect(parseHex('#b4133f1f')).toEqual([180, 19, 63]);
  });

  it('rejects anything that is not a colour', () => {
    expect(() => parseHex('rebeccapurple')).toThrow();
  });
});

suite('tokens.css resolves to the colours DESIGN.md specifies', () => {
  const tokens = resolveColourTokens(TOKENS);

  // The six, straight out of the DESIGN.md colour table.
  const declared = [
    ...DESIGN.matchAll(/^\|\s*`--([a-z-]+)`\s*\|\s*`(#[0-9A-Fa-f]{6})`\s*\|/gim),
  ].map((row) => ({ name: row[1]!, hex: row[2]!.toLowerCase() }));

  it('finds all six colours in the DESIGN.md table', () => {
    expect(declared.map((entry) => entry.name)).toEqual([
      'paper',
      'paper-sunk',
      'ink',
      'ink-muted',
      'rule',
      'claim',
    ]);
  });

  for (const { name, hex } of declared) {
    it(`--${name} is ${hex}`, () => {
      expect(tokens.get(name)).toBe(hex);
    });
  }
});

suite('every ratio in the DESIGN.md contrast table', () => {
  const tokens = resolveColourTokens(TOKENS);
  const claims = parseContrastTable(DESIGN);

  it('parses the whole table, so no row escapes checking', () => {
    // Six rows today. If a row is added and this number is not updated the
    // test fails, which is the point: a new pair must be measured, not
    // assumed.
    expect(claims).toHaveLength(6);
  });

  for (const { foreground, background, stated } of claims) {
    it(`--${foreground} on --${background} measures ${stated}:1`, () => {
      const fg = tokens.get(foreground);
      const bg = tokens.get(background);
      expect(fg, `--${foreground} is not defined in tokens.css`).toBeDefined();
      expect(bg, `--${background} is not defined in tokens.css`).toBeDefined();

      const measured = contrastRatio(fg!, bg!);
      const drift = Math.abs(measured - stated);
      expect(
        drift,
        `DESIGN.md says ${stated}:1, tokens.css gives ${measured.toFixed(2)}:1 ` +
          `(off by ${drift.toFixed(3)}). Re-measure and correct DESIGN.md, or ` +
          `change the token — but do not leave them disagreeing.`,
      ).toBeLessThanOrEqual(TOLERANCE);
    });
  }
});

suite('the floors those ratios exist to protect', () => {
  const tokens = resolveColourTokens(TOKENS);
  const get = (name: string): string => {
    const value = tokens.get(name);
    if (!value) throw new Error(`--${name} missing from tokens.css`);
    return value;
  };

  it('body text clears 4.5:1 on both surfaces', () => {
    expect(contrastRatio(get('ink'), get('paper'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(get('ink'), get('paper-sunk'))).toBeGreaterThanOrEqual(4.5);
  });

  it('metadata clears 4.5:1 on both surfaces, including inside the trace panel', () => {
    // This is the one D-012 exists to fix: the old --ink-muted cleared the
    // floor on --paper-sunk by 0.01.
    expect(contrastRatio(get('ink-muted'), get('paper'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(get('ink-muted'), get('paper-sunk'))).toBeGreaterThanOrEqual(4.5);
  });

  it('the estimate clears 4.5:1 wherever it is drawn', () => {
    expect(contrastRatio(get('claim'), get('paper'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(get('claim'), get('paper-sunk'))).toBeGreaterThanOrEqual(4.5);
  });

  it('the panel boundary clears the 3:1 non-text floor', () => {
    // The panel is bounded by a --trace-edge rule, which is --ink-muted,
    // because the fill alone is 1.1:1 and cannot carry it (D-012).
    expect(contrastRatio(get('ink-muted'), get('paper'))).toBeGreaterThanOrEqual(3);
  });

  it('the band edges clear the 3:1 non-text floor against the panel', () => {
    // D-013: the 12% fill is 1.22:1 and decorative; the --claim edge strokes
    // are what carry the information.
    expect(contrastRatio(get('claim'), get('paper-sunk'))).toBeGreaterThanOrEqual(3);
  });

  it('--rule is too weak to bound a control, which is why it never does', () => {
    // Asserted rather than assumed, so nobody promotes --rule to a boundary
    // later. DESIGN.md: use --ink-muted for that.
    expect(contrastRatio(get('rule'), get('paper'))).toBeLessThan(3);
  });
});
