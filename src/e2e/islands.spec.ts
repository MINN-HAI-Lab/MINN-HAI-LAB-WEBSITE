import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

/**
 * Where script is allowed to go, as a test.
 *
 * CLAUDE.md's one-island rule is lifted by the brief's aesthetic override
 * (Q-19) — the site now has four live artefacts, on two pages. What survives
 * from it, because it was never about the count:
 *
 *   "It renders a real static version server-side. Not a placeholder, not a
 *    'this requires JavaScript' notice — an actual readable rendering of the
 *    same data."
 *
 *   "And any island whose payload exceeds roughly 100KB gzipped loads on
 *    explicit interaction, never on page load."
 *
 * The second rule is why this file matters now more than it did. The 3D graph
 * is 361KB gzipped — three and a half times the threshold — and the only thing
 * keeping it out of the first paint is a dynamic import inside a click
 * handler. That is one edit away from being a static import at the top of a
 * file, at which point every visitor to /research downloads Three.js and
 * nothing tells anyone.
 */

/** Roughly 100KB gzipped, from CLAUDE.md. Past this an island must be
 *  click-to-load rather than loaded with the page. */
const CLICK_TO_LOAD_THRESHOLD = 100 * 1024;

/** Pages carrying a live artefact, and so allowed to ship script. */
const ISLAND_PAGES = new Set(['/', '/research/']);

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'research', path: '/research/' },
  { name: 'people', path: '/people/' },
  { name: 'learning', path: '/learning/' },
  { name: 'about', path: '/about/' },
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
        expect(
          scripts.length,
          `${name} carries a live artefact and should load its script`,
        ).toBeGreaterThan(0);
      } else {
        expect(
          scripts,
          `${name} has no island and should ship no script: ${scripts.join(', ')}`,
        ).toEqual([]);
        /* One inline script is allowed everywhere: the section reveal in
           Base.astro, which is a few hundred bytes and applies the hidden
           state it later removes. Anything beyond it is an artefact that has
           wandered onto a page with no artefact on it. */
        expect(
          inline,
          `${name} should carry only the reveal script, and has ${inline} inline scripts`,
        ).toBeLessThanOrEqual(1);
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

test.describe('islands: the trace fails safe', () => {
  test('a throwing upgrade leaves the static rendering, not a half-built one', async ({
    page,
  }) => {
    // Break something the upgrade depends on before the module runs. Anything
    // that throws mid-upgrade would otherwise leave some marks interactive and
    // some not, with a pointer cursor promising behaviour that is gone.
    await page.addInitScript(() => {
      const realAdd = Element.prototype.addEventListener;
      let calls = 0;
      Element.prototype.addEventListener = function (
        this: Element,
        ...args: Parameters<typeof realAdd>
      ): void {
        calls += 1;
        // Let the first few through, then fail: a partial upgrade is the case
        // worth testing, not a total one.
        if (calls === 4) throw new Error('deliberate failure');
        realAdd.apply(this, args);
      };
    });

    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // It said so rather than failing silently.
    expect(
      errors.some((e) => e.includes('could not be made interactive')),
      'the failure should be reported to the console',
    ).toBe(true);

    // And what is left is the static rendering, intact.
    await expect(page.locator('.trace [tabindex]')).toHaveCount(0);
    await expect(page.locator('.trace [role="button"]')).toHaveCount(0);
    await expect(page.locator('[data-controls]')).toBeHidden();
    await expect(page.locator('[data-instructions]')).toBeHidden();
    await expect(page.locator('.trace__svg')).toHaveAttribute('role', 'img');
    await expect(page.locator('.trace__svg')).toHaveAttribute('aria-label', /Knowledge trace/);

    const cursor = await page.evaluate(
      () => getComputedStyle(document.querySelector('.trace__mark-group')!).cursor,
    );
    expect(cursor, 'marks must not promise a click that will not happen').not.toBe('pointer');

    // The drawing itself is still real.
    const d = await page.locator('.trace__curve').getAttribute('d');
    expect(d?.length ?? 0).toBeGreaterThan(50);
  });
});


test.describe('islands: the 3D graph stays out of the first paint', () => {
  test('the library is not requested until the button is pressed', async ({ page }) => {
    const requested: string[] = [];
    page.on('request', (request) => requested.push(new URL(request.url()).pathname));

    await page.goto('/research/');
    await page.waitForLoadState('networkidle');

    const before = requested.filter((path) => path.includes('network-3d'));
    expect(
      before,
      'the 3D chunk was requested on page load; the import must stay inside the click handler',
    ).toEqual([]);

    /* A modulepreload hint would defeat the whole arrangement just as
       thoroughly as a static import, and it would be added by the bundler
       rather than by anyone editing this code. */
    const preloads = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="modulepreload"], link[rel="preload"]')]
        .map((link) => link.href)
        .filter((href) => href.includes('network-3d')),
    );
    expect(preloads, 'a preload hint pulls the 3D chunk into the first paint').toEqual([]);

    await page.locator('[data-load-3d]').click();
    await page.waitForTimeout(2500);

    const after = requested.filter((path) => path.includes('network-3d'));
    expect(after.length, 'the click should fetch the 3D chunk').toBeGreaterThan(0);
  });
});
