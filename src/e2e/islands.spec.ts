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

/**
 * Every page now ships a little script: the 3D field behind each header band
 * is drawn by one, and the learning page's tabs by another. What the rule
 * still forbids is a page whose script, before the load event, is anything
 * like the click-to-load threshold — a stray Three.js import would be caught
 * here as a hundred-fold jump.
 */
const ISLAND_PAGES = new Set(['/', '/research/', '/people/', '/learning/', '/about/']);

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
      let loaded = false;
      page.on('load', () => {
        loaded = true;
      });
      page.on('response', async (response) => {
        if (loaded) return;
        if (response.request().resourceType() !== 'script') return;
        try {
          bodies.push(await response.body());
        } catch {
          // A response body can be gone by the time this runs; the size check
          // below still covers whatever was captured.
        }
      });

      /* Measured to the load event, not to network idle. The hero's scene is
         a deliberate after-load import (Q-25) and is checked on its own terms
         below; what this guards is the script a reader waits on. */
      await page.goto(path, { waitUntil: 'load' });
      await page.waitForTimeout(100);

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


test.describe('islands: the hero scene stays out of the first paint', () => {
  test('Three.js is never referenced by the served HTML and only arrives after load', async ({
    page,
    request,
  }) => {
    /* The HTML as served, not the DOM: Vite's dynamic-import helper adds its
       own modulepreload links to the document at the moment of the import,
       which is fine — the document a reader downloads must not carry them. */
    const html = await (await request.get('/')).text();
    expect(html, 'the served HTML references the hero scene or Three.js').not.toMatch(/hands\.|three\.module/);

    const requested: Array<{ path: string; beforeLoad: boolean }> = [];
    let loaded = false;
    page.on('request', (r) => requested.push({ path: new URL(r.url()).pathname, beforeLoad: !loaded }));
    page.on('load', () => {
      loaded = true;
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(3500);

    const scene = requested.filter((r) => /hands\.|three\.module/.test(r.path));
    expect(
      scene.filter((r) => r.beforeLoad).map((r) => r.path),
      'the hero scene was requested before the load event',
    ).toEqual([]);

    /* Whether it arrives at all depends on the machine: the hero declines a
       software renderer, and a headless browser usually has exactly that. The
       hero says what it decided, and the two honest outcomes are both
       accepted — loaded after load, or declined for a stated reason. */
    const state = await page.locator('[data-hero]').getAttribute('data-scene');
    expect(['live', 'software-gl', 'still', 'save-data']).toContain(state);
    if (state === 'live') {
      expect(scene.length, 'the hero reports live but never fetched the scene').toBeGreaterThan(0);
    } else {
      expect(scene, `the hero declined (${state}) but fetched the scene anyway`).toEqual([]);
    }
  });

  test('a phone gets the still and never the scene', async ({ page }) => {
    const requested: string[] = [];
    page.on('request', (r) => requested.push(new URL(r.url()).pathname));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    expect(requested.filter((p) => /hands\.|three\.module/.test(p))).toEqual([]);
    await expect(page.locator('[data-poster]')).toBeVisible();
    expect(await page.locator('[data-hero]').getAttribute('data-scene')).toBe('small');
  });
});
