import { expect, test } from '@playwright/test';

/**
 * Heading structure, on every page.
 *
 * CLAUDE.md's quality floor: "Headings in document order with no skipped
 * levels."
 *
 * axe covers part of this — it flags an h1 that is missing entirely, and
 * heading-order violations. It does not flag a page with two h1s, and it will
 * not tell you the outline reads sensibly. This checks the shape directly and
 * prints the outline when it fails, which is the thing you actually want to
 * look at.
 */

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'specimen', path: '/specimen/' },
  { name: '404', path: '/404.html' },
] as const;

interface Heading {
  level: number;
  text: string;
}

async function outline(page: import('@playwright/test').Page): Promise<Heading[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((el) => ({
      level: Number(el.tagName[1]),
      // Trimmed hard: a heading's text can wrap across several source lines.
      text: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60),
    })),
  );
}

/** Render the outline the way someone would want to read it in a failure. */
function show(headings: readonly Heading[]): string {
  return headings.map((h) => `${'  '.repeat(h.level - 1)}h${h.level}  ${h.text}`).join('\n');
}

for (const { name, path } of PAGES) {
  test.describe(`headings: ${name}`, () => {
    test('has exactly one h1, and it comes first', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const headings = await outline(page);
      const h1s = headings.filter((h) => h.level === 1);

      expect(h1s.length, `expected one h1:\n${show(headings)}`).toBe(1);
      expect(
        headings[0]?.level,
        `the first heading should be the h1:\n${show(headings)}`,
      ).toBe(1);
    });

    test('skips no level', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const headings = await outline(page);
      expect(headings.length, 'the page should have headings').toBeGreaterThan(0);

      for (let i = 1; i < headings.length; i += 1) {
        const previous = headings[i - 1]!;
        const current = headings[i]!;
        expect(
          current.level - previous.level,
          `h${previous.level} is followed by h${current.level}, which skips a level:\n` +
            `${show(headings)}`,
        ).toBeLessThanOrEqual(1);
      }
    });

    test('has no empty heading', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const headings = await outline(page);
      for (const heading of headings) {
        expect(heading.text, `an h${heading.level} has no text`).not.toBe('');
      }
    });
  });
}
