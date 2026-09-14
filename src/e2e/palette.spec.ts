import { expect, test } from '@playwright/test';

/**
 * The palette, checked in the built CSS rather than in the source.
 *
 * The token lint (src/lib/token-lint.test.ts) stops anyone writing a raw hex
 * into a stylesheet. It cannot stop a colour arriving from somewhere else —
 * Tailwind's preflight, a utility generated from a class name, a dependency —
 * and one already did: before the @source was pinned down, Tailwind scanned
 * .agents/skills and emitted dark:bg-white/10 as #ffffff1a. A seventh colour,
 * in the shipped CSS, from a file nobody thought of as source.
 *
 * So this reads what the browser actually downloads.
 *
 * The palette is the design canvas's (D-027), which supersedes both DESIGN.md
 * and the brief's earlier override. Q-19 and Q-25 record the lineage.
 */

/**
 * The design canvas's palette, as tokens.css declares it. The field, the
 * raised ground, the ink at three solid steps, the display white, one red,
 * and the two stops of the glow behind the hero's hands.
 */
const PALETTE = new Set([
  '#06080a', // --field
  '#0c1013', // --field-2
  '#e6edf0', // --text
  '#f2f6f8', // --text-strong
  '#919699', // --text-muted
  '#767a7d', // --text-faint
  '#e63360', // --signal
  '#10151a', // --hero-glow
  '#090c0f', // --hero-glow-2
]);

/**
 * The viridis ramp, which is a scale rather than a colour.
 *
 * The override allows colour ramps "inside data visualisations only", and this
 * one is the key and the overlay in artefact 3. It is written as rgb() in
 * saliency.css, but the minifier rewrites those to hex, so it arrives here as
 * eight more hex values and has to be named. Every one of the eight is a stop
 * on the ramp in src/lib/saliency.ts; if a ninth colour appears, that is a
 * real finding rather than a stale list.
 */
const VIRIDIS = new Set([
  '#440154',
  '#482878',
  '#3e4a89',
  '#31688e',
  '#26828e',
  '#1f9e89',
  '#35b779',
  '#fde725',
]);

/** Fully transparent, in the spellings a minifier produces. Not a colour. */
const TRANSPARENT = new Set(['#0000', '#00000000']);

/**
 * The ink, the field and the raised ground at an alpha — but only at an alpha.
 *
 * The canvas draws every hairline, veil and panel as one of those three at
 * some opacity: ink at .1 to .72 for rules and edges, the field at .35 to .96
 * for the veils over a 3D field, the raised ground at .7 for a panel. The
 * minifier writes those as #e6edf01a and friends, so they arrive here with an
 * alpha channel, and the alpha is what is checked: an opaque colour still has
 * to be in the palette above.
 */
const TRANSLUCENT_BASES = new Set(['e6edf0', '06080a', '0c1013']);

function isTranslucentInk(raw: string): boolean {
  const value = raw.slice(1).toLowerCase();
  const hasAlpha = value.length === 4 || value.length === 8;
  if (!hasAlpha) return false;
  const expanded = value.length === 4
    ? value.split('').map((c) => c + c).join('')
    : value;
  return TRANSLUCENT_BASES.has(expanded.slice(0, 6)) && expanded.slice(6) !== 'ff';
}

/**
 * Remove Tailwind's internal plumbing before scanning.
 *
 * Tailwind declares defaults for its own --tw-* variables and registers them
 * with @property, and some of those defaults are colours — --tw-ring-offset-
 * color is #fff. Nothing on this site uses a ring utility, so that value can
 * never paint anything; it is the CSS equivalent of an unused import.
 *
 * Stripped narrowly rather than allowlisted, so a real #fff arriving anywhere
 * a colour could actually be painted still fails.
 */
function withoutTailwindPlumbing(css: string): string {
  return css
    .replace(/@property\s+--tw-[^{]*\{[^}]*\}/g, '')
    .replace(/--tw-[\w-]*\s*:[^;}]*/g, '');
}

/** Expand #rgb and #rgba, and drop the alpha channel. */
function normalise(hex: string): string {
  let value = hex.slice(1).toLowerCase();
  if (value.length === 3 || value.length === 4) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${value.slice(0, 6)}`;
}

async function stylesheets(page: import('@playwright/test').Page): Promise<string[]> {
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((l) => l.href),
  );
  const inline = await page.evaluate(() =>
    [...document.querySelectorAll('style')].map((s) => s.textContent ?? ''),
  );

  const fetched = await Promise.all(
    hrefs.map(async (href) => {
      const response = await page.request.get(href);
      return response.text();
    }),
  );

  return [...fetched, ...inline];
}

const PAGES = ['/', '/research/', '/people/', '/learning/', '/about/', '/404.html'] as const;

for (const path of PAGES) {
  test.describe(`palette: ${path}`, () => {
    test('ships only the palette, plus the one allowed ramp', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const found = new Map<string, string>();
      for (const sheet of await stylesheets(page)) {
        for (const match of withoutTailwindPlumbing(sheet).matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
          const raw = match[0];
          if (TRANSPARENT.has(raw.toLowerCase())) continue;
          const base = normalise(raw);
          if (isTranslucentInk(raw)) continue;
          if (!PALETTE.has(base) && !VIRIDIS.has(base)) found.set(base, raw);
        }
      }

      expect(
        [...found.entries()].map(([base, raw]) => `${raw} (${base})`),
        'a colour outside the palette and the viridis ramp reached the built CSS',
      ).toEqual([]);
    });

    /* The site is dark in every mode.

       D-009 kept dark mode out of the light version; the field is now the
       design, so a prefers-color-scheme rule would mean two palettes rather
       than one — and the contrast figures in tokens.css were measured against
       exactly one. */
    test('ships one palette rather than a light and a dark one', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const offending: string[] = [];
      for (const css of await stylesheets(page)) {
        for (const match of css.matchAll(/@media[^{]*prefers-color-scheme[^{]*/g)) {
          offending.push(match[0].trim());
        }
      }

      expect(
        offending,
        'a prefers-color-scheme rule is in the CSS; the field is the only palette',
      ).toEqual([]);
    });
  });
}
