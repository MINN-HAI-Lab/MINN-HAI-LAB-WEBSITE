/**
 * Reading design tokens at build time.
 *
 * Some values are needed as numbers in markup, not as CSS: an SVG `r`
 * attribute, a viewBox, a width handed to CSS as a custom property. Typing
 * those numbers into a component would fork the design system — DESIGN.md
 * would say one thing and the markup another, and nothing would catch it.
 *
 * So they are parsed out of src/styles/tokens.css instead, which mirrors
 * DESIGN.md and is checked against it by src/lib/contrast.test.ts. Change a
 * token and the markup follows.
 *
 * Import the stylesheet with Vite's `?raw` and hand the text in. Reading it
 * with fs would look equivalent and is not: by prerender the module has been
 * bundled, so import.meta.url resolves into dist/.prerender.
 */

/** The `:root` block, before the 900px override. */
function baseBlock(css: string): string {
  const cut = css.indexOf('@media (min-width: 900px)');
  return cut === -1 ? css : css.slice(0, cut);
}

/**
 * Read a token as a raw string, from the base scale.
 *
 * Throws rather than returning a default. A missing token is a real problem
 * and a silent zero in an SVG radius would be very hard to spot.
 */
export function token(css: string, name: string): string {
  const match = baseBlock(css).match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!match) {
    throw new Error(
      `--${name} is not defined in tokens.css. Add it to DESIGN.md first; ` +
        'do not pick a value here.',
    );
  }
  return match[1]!.trim();
}

/** Read a token as a number, dropping a `px` suffix if present. */
export function tokenNumber(css: string, name: string): number {
  const raw = token(css, name);
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`--${name} is "${raw}", which is not a number.`);
  }
  return value;
}
