import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

/**
 * The island rules from CLAUDE.md, as a test.
 *
 *   "Client-side JavaScript is allowed in interactive islands only. There are
 *    two: the trace widget on the home page, and the Markov blanket graph on
 *    /research. Everything else ships as HTML and CSS."
 *
 *   "It renders a real static version server-side. Not a placeholder, not a
 *    'this requires JavaScript' notice — an actual readable rendering of the
 *    same data."
 *
 *   "And any island whose payload exceeds roughly 100KB gzipped loads on
 *    explicit interaction, never on page load."
 *
 * All three were verified by hand while the widget was built. None of them was
 * enforced, and every one is the kind of thing that erodes a script at a time.
 */

/** Roughly 100KB gzipped, from CLAUDE.md. Past this an island must be
 *  click-to-load rather than loaded with the page. */
const CLICK_TO_LOAD_THRESHOLD = 100 * 1024;

/** Pages that are allowed to ship script, and why. */
const ISLAND_PAGES = new Set(['/']);

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'specimen', path: '/specimen/' },
  { name: '404', path: '/404.html' },
] as const;

for (const { name, path } of PAGES) {
  test.describe(`islands: ${name}`, () => {
    test('ships script only where an island is declared', async ({ page }) => {
      const scripts: string[] = [];
      page.on('request', (request) => {
        if (request.resourceType() === 'script') scripts.push(new URL(request.url()).pathname);
      });

      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const inline = await page.evaluate(
        () => [...document.querySelectorAll('script:not([src])')].filter(
          (s) => (s.textContent ?? '').trim() !== '',
        ).length,
      );

      if (ISLAND_PAGES.has(path)) {
        expect(scripts.length, 'the home page should load the trace island').toBeGreaterThan(0);
      } else {
        expect(
          scripts,
          `${name} has no island and should ship no script: ${scripts.join(', ')}`,
        ).toEqual([]);
        expect(inline, `${name} should have no inline script`).toBe(0);
      }
    });

    test('every byte of script stays under the click-to-load threshold', async ({ page }) => {
      const bodies: Buffer[] = [];
      page.on('response', async (response) => {
        if (response.request().resourceType() !== 'script') return;
        try {
          bodies.push(await response.body());
        } catch {
          // A response body can be gone by the time this runs; the size check
          // below still covers whatever was captured.
        }
      });

      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const total = bodies.reduce((sum, body) => sum + gzipSync(body).length, 0);
      expect(
        total,
        `${name} loads ${(total / 1024).toFixed(1)}KB of script on page load. ` +
          'Past ~100KB gzipped CLAUDE.md requires the island to load on explicit ' +
          'interaction instead.',
      ).toBeLessThan(CLICK_TO_LOAD_THRESHOLD);
    });
  });
}

test.describe('islands: the trace renders statically', () => {
  test('the static version is the same data, not a placeholder', async ({ page }) => {
    // Strip the island's script and check what is left is a real rendering.
    await page.route('**/*', async (route) => {
      const response = await route.fetch();
      const type = response.headers()['content-type'] ?? '';
      if (type.includes('text/html')) {
        const body = (await response.text()).replace(
          /<script\b[^>]*>[\s\S]*?<\/script>/gi,
          '',
        );
        await route.fulfill({ response, body });
        return;
      }
      await route.fulfill({ response });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Real geometry, not an empty frame.
    const curve = await page.locator('.trace__curve').getAttribute('d');
    expect(curve?.length ?? 0, 'the static curve should be a real path').toBeGreaterThan(50);
    expect(await page.locator('.trace__mark').count()).toBeGreaterThan(9);

    // The same conclusion the interactive version reaches, in words.
    await expect(page.locator('[data-sentence]')).toContainText(/model estimates \d+ per cent/);

    // And no placeholder anywhere.
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/requires javascript|enable javascript|loading/i);
  });
});
