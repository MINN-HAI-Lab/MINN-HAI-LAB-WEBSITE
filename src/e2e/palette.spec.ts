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
 * DESIGN.md: "Six values. There is no seventh."
 * D-009: no dark mode in v1.
 */

/** The six, lowercase, from DESIGN.md § Colour. */
const PALETTE = new Set([
  '#eff1f2', // --paper
  '#e3e7e9', // --paper-sunk
  '#1c2830', // --ink
  '#4e5d65', // --ink-muted
  '#c9d0d3', // --rule
  '#b4133f', // --claim
]);

/** Fully transparent, in the spellings a minifier produces. Not a colour. */
const TRANSPARENT = new Set(['#0000', '#00000000']);

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

const PAGES = ['/', '/specimen/', '/404.html'] as const;

for (const path of PAGES) {
  test.describe(`palette: ${path}`, () => {
    test('ships only the six colours', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const found = new Map<string, string>();
      for (const sheet of await stylesheets(page)) {
        for (const match of withoutTailwindPlumbing(sheet).matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
          const raw = match[0];
          if (TRANSPARENT.has(raw.toLowerCase())) continue;
          const base = normalise(raw);
          if (!PALETTE.has(base)) found.set(base, raw);
        }
      }

      expect(
        [...found.entries()].map(([base, raw]) => `${raw} (${base})`),
        'a colour that is not one of the six reached the built CSS',
      ).toEqual([]);
    });

    test('ships no dark-mode rule', async ({ page }) => {
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
        'D-009 keeps dark mode out of v1, and a prefers-color-scheme rule is in the CSS',
      ).toEqual([]);
    });
  });
}
