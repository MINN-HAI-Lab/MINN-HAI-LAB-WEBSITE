/**
 * WCAG contrast ratios, and the machinery to check DESIGN.md against itself.
 *
 * DESIGN.md calls its contrast table "measured, not estimated. Re-verify after
 * any token change." This is what does the re-verifying, so the instruction is
 * enforced rather than merely written down.
 *
 * Two numbers have to agree for the table to be true: the hex a token resolves
 * to in src/styles/tokens.css, and the ratio quoted in the table. Both are
 * parsed from the files rather than restated here, so this cannot drift from
 * either one.
 */

/** sRGB channel to linear light. */
function linearise(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Parse `#rgb`, `#rrggbb` or `#rrggbbaa` into channels. Alpha is ignored. */
export function parseHex(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  if (!/^[0-9a-fA-F]{6,8}$/.test(full)) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

/** Relative luminance, per WCAG 2.x. */
export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

/** Contrast ratio between two colours. Order does not matter. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** One row of the DESIGN.md contrast table. */
export interface ContrastClaim {
  /** Token name of the foreground, without the leading dashes. */
  foreground: string;
  /** Token name of the background. */
  background: string;
  /** The ratio DESIGN.md states. */
  stated: number;
}

/**
 * Pull the contrast table out of DESIGN.md.
 *
 * Matches rows of the form:
 *   | `--ink-muted` on `--paper` | ~6.0:1 | ... |
 */
export function parseContrastTable(markdown: string): ContrastClaim[] {
  const rows = [
    ...markdown.matchAll(
      /^\|\s*`--([a-z-]+)`\s+on\s+`--([a-z-]+)`\s*\|\s*~?([\d.]+):1\s*\|/gim,
    ),
  ];
  return rows.map((row) => ({
    foreground: row[1]!,
    background: row[2]!,
    stated: Number.parseFloat(row[3]!),
  }));
}

/**
 * Resolve every custom property in tokens.css down to a hex value.
 *
 * Handles one level of indirection, which is all the file uses: the six
 * colours are declared as `--color-*` inside @theme, and `:root` aliases the
 * DESIGN.md spellings onto them with var(). Anything that does not bottom out
 * in a hex — color-mix, a duration, a length — is simply left out, since only
 * colours are of interest here.
 */
export function resolveColourTokens(css: string): Map<string, string> {
  const raw = new Map<string, string>();
  for (const match of css.matchAll(/--([a-z0-9-]+)\s*:\s*([^;{}]+);/gi)) {
    const name = match[1]!;
    const value = match[2]!.trim();
    // First declaration wins. The color-mix upgrade for --trace-band comes
    // later in the file inside @supports, and the base hex is what a
    // non-supporting browser gets, so the base is the honest value to check.
    if (!raw.has(name)) raw.set(name, value);
  }

  const resolved = new Map<string, string>();
  for (const [name, value] of raw) {
    let current = value;
    for (let depth = 0; depth < 4; depth += 1) {
      if (/^#[0-9a-f]{3,8}$/i.test(current)) {
        resolved.set(name, current);
        break;
      }
      const varMatch = current.match(/^var\(\s*--([a-z0-9-]+)\s*\)$/i);
      if (!varMatch) break;
      const next = raw.get(varMatch[1]!);
      if (next === undefined) break;
      current = next.trim();
    }
  }
  return resolved;
}
