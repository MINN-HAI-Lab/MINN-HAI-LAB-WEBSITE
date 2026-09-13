import { expect, test } from '@playwright/test';
import { PATHS } from './pages.ts';

/**
 * Every external origin the built site names, checked against a list.
 *
 * Two failures this is aimed at, and both have nearly happened here.
 *
 * A placeholder domain. `site` is supplied at build time and is unset in this
 * repository, so no canonical URL, og:url or sitemap should appear at all. If
 * one does, someone has written a domain down — and a plausible-looking domain
 * in production metadata is the fabrication that survives review, because it
 * looks right.
 *
 * A third-party request. The site is meant to talk to nothing at runtime: no
 * analytics, no fonts from a CDN, no embeds. The font provider was switched to
 * `local()` precisely so that nothing reaches fonts.gstatic.com, and a
 * regression there would be invisible from the inside.
 *
 * The allowed list is short on purpose. Each entry is a link a reader can
 * choose to follow, never something the page fetches.
 */

/** Origins a page may LINK to. None of these is ever requested on load. */
const ALLOWED = new Set([
  // The lab's own teaching resource, on GitHub Pages.
  'minn-hai-lab.github.io',
  // The photograph in artefact 3: its source page and its licence.
  'commons.wikimedia.org',
  'creativecommons.org',
]);

for (const path of PATHS) {
  test.describe(`outbound: ${path}`, () => {
    test('names no origin that is not on the list', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const hosts = await page.evaluate(() => {
        const found = new Set<string>();
        const attrs = ['href', 'src', 'content', 'action', 'srcset'];
        for (const el of document.querySelectorAll('*')) {
          for (const attr of attrs) {
            const value = el.getAttribute(attr);
            if (!value) continue;
            for (const match of value.matchAll(/https?:\/\/([^/\s"',]+)/g)) {
              found.add(match[1]!);
            }
          }
        }
        return [...found];
      });

      const unexpected = hosts.filter((host) => !ALLOWED.has(host));
      expect(
        unexpected,
        `an origin outside the allowed list appears in the markup: ${unexpected.join(', ')}`,
      ).toEqual([]);
    });

    test('requests nothing from anywhere but this origin', async ({ page, baseURL }) => {
      /* The origin comes from the config, not from page.url().

         The first request fires while the page is still about:blank, so
         comparing against page.url() compares every request to "null" and
         every single one looks off-site. */
      const origin = new URL(baseURL ?? 'http://localhost:4331').origin;
      const offsite: string[] = [];
      page.on('request', (request) => {
        if (new URL(request.url()).origin !== origin) offsite.push(request.url());
      });

      await page.goto(path);
      await page.waitForLoadState('networkidle');

      expect(
        offsite,
        `the page fetched something from another origin: ${offsite.join(', ')}`,
      ).toEqual([]);
    });
  });
}
