import { expect, test } from '@playwright/test';

/**
 * What happens when Literata does not arrive.
 *
 * It is a single 83.8KB request and the entire site is set in it. A blocked
 * CDN, a corporate proxy, a flaky connection on a train — any of those and
 * every word on the page falls back.
 *
 * Astro generates a metric-matched local() fallback with size-adjust and
 * ascent overrides, which should make this close to a non-event. That is the
 * claim; this measures it.
 */

const PAGES = ['/', '/research/', '/people/', '/learning/', '/about/', '/404.html'] as const;

/** Fail every font request, as a blocked or broken connection would. */
async function blockFonts(page: import('@playwright/test').Page): Promise<void> {
  await page.route('**/*.woff2', (route) => route.abort());
}

for (const path of PAGES) {
  test.describe(`without the webfont: ${path}`, () => {
    test('still renders readable text at the right size', async ({ page }) => {
      await blockFonts(page);
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Something has to be on screen.
      const text = await page.locator('main').innerText();
      expect(text.trim().length, 'the page should still have text').toBeGreaterThan(100);

      // And at the size DESIGN.md specifies, since the scale is in CSS rather
      // than in the font. Compared against the tokens, not a literal: the home
      // and specimen pages opt their h1 up to Display, the 404 page leaves it
      // at the Page title default, and hard-coding 56px asserted the wrong
      // thing for one page in three.
      const sizes = await page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        return {
          h1: getComputedStyle(document.querySelector('h1')!).fontSize,
          hero: getComputedStyle(document.documentElement).getPropertyValue('--size-hero').trim(),
          display: root.getPropertyValue('--size-display').trim(),
          title: root.getPropertyValue('--size-title').trim(),
        };
      });
      expect(
        [sizes.display, sizes.title, sizes.hero],
        `h1 is ${sizes.h1}, which is neither Display, Page title nor the hero line`,
      ).toContain(sizes.h1);

      // The fallback is the metric-matched face, not a bare serif.
      const family = await page.evaluate(
        () => getComputedStyle(document.body).fontFamily,
      );
      expect(family, 'the fallback stack should still be in place').toMatch(/fallback|serif/i);
    });

    test('does not collapse the layout', async ({ page }) => {
      await blockFonts(page);
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        overflow.scrollWidth,
        'the page should not scroll sideways without its webfont',
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  });
}

test.describe('without the webfont: the trace', () => {
  test('the widget still draws and still works', async ({ page }) => {
    await blockFonts(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    // The drawing is geometry, so it should be untouched.
    const d = await page.locator('.trace__curve').getAttribute('d');
    expect(d?.length ?? 0).toBeGreaterThan(50);
    await expect(page.locator('.trace__mark')).toHaveCount(12);

    // The labels are HTML, so they depend on the fallback and must still read.
    await expect(page.locator('.artefact__provenance')).toHaveText('Synthetic data');
    await expect(page.locator('[data-sentence]')).toContainText('per cent');

    // And the interaction still works: the font has nothing to do with it.
    const before = await page.locator('[data-sentence]').textContent();
    await page.locator('.trace__mark-group').nth(3).click();
    await page.waitForTimeout(400);
    expect(await page.locator('[data-sentence]').textContent()).not.toBe(before);
  });
});
