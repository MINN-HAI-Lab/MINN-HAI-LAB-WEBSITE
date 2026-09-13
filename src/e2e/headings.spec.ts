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
  { name: 'research', path: '/research/' },
  { name: 'people', path: '/people/' },
  { name: 'learning', path: '/learning/' },
  { name: 'about', path: '/about/' },
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

/**
 * Stray template text.
 *
 * An Astro component with two frontmatter fences emits everything after the
 * first one as content, so it lands between the doctype and <html> and the
 * browser hoists it into the body. It renders as junk in the top-left corner
 * of every page.
 *
 * That shipped for eleven commits. axe passed it, the keyboard suite passed
 * it, the palette check passed it and the heading audit passed it, because it
 * is valid HTML that merely displays rubbish. Only looking at a screenshot
 * caught it, so this is the cheap version of looking.
 */
for (const { name, path } of PAGES) {
  test.describe(`document: ${name}`, () => {
    test('has nothing between the doctype and <html>', async ({ page }) => {
      const response = await page.request.get(path);
      const html = await response.text();

      const start = html.indexOf('<html');
      expect(start, 'no <html> element').toBeGreaterThan(-1);

      const prologue = html
        .slice(0, start)
        .replace(/<!DOCTYPE[^>]*>/i, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();

      expect(
        prologue,
        `stray text before <html>, which the browser will hoist into the body: ${JSON.stringify(prologue)}`,
      ).toBe('');
    });

    test('has no loose text node directly inside body', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const loose = await page.evaluate(() =>
        [...document.body.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => (n.textContent ?? '').trim())
          .filter((t) => t !== ''),
      );

      expect(loose, 'loose text directly inside <body>').toEqual([]);
    });
  });

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
