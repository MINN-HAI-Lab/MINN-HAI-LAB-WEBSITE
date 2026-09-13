import { expect, test } from '@playwright/test';

/**
 * Screenshot harness.
 *
 * Captures the built site at the three widths CLAUDE.md and docs/phase.md care
 * about, so the output can be looked at rather than reasoned about. Every
 * capture also asserts the one thing a screenshot cannot show on its own —
 * that nothing overflows the viewport — because a horizontally scrolled page
 * still photographs fine.
 *
 * Output goes to screenshots/, which is gitignored.
 */

const WIDTHS = [
  { name: '390-phone', width: 390, height: 1400 },
  { name: '768-tablet', width: 768, height: 1200 },
  { name: '1440-desktop', width: 1440, height: 1100 },
] as const;

const OUT = 'screenshots';

/** The page has to be still before it is photographed. */
async function settle(page: import('@playwright/test').Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  // The curve draws once on load over --dur-slow.
  await page.waitForTimeout(800);
}

for (const { name, width, height } of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height } });

    test('full page', async ({ page }) => {
      await page.goto('/');
      await settle(page);

      // A screenshot of a horizontally scrolling page looks perfectly fine,
      // so the check has to be separate from the capture.
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        overflow.scrollWidth,
        `horizontal overflow at ${width}px`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);

      await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    });

    test('trace widget', async ({ page }) => {
      await page.goto('/');
      await settle(page);
      const trace = page.locator('.trace');
      await expect(trace).toBeVisible();
      await trace.screenshot({ path: `${OUT}/${name}-trace.png` });
    });

    test('attribution view', async ({ page }) => {
      await page.goto('/');
      await settle(page);
      await page.locator('[data-attribution]').click();
      await page.waitForTimeout(300);

      await expect(page.locator('[data-attribution]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      // The view is only worth photographing if it marked something.
      await expect(page.locator('.trace__mark-group.is-carrying')).not.toHaveCount(0);

      await page.locator('.trace').screenshot({ path: `${OUT}/${name}-attribution.png` });
    });

    test('focus ring on a mark', async ({ page }) => {
      await page.goto('/');
      await settle(page);

      // Tab rather than .focus(), so the capture shows what a keyboard user
      // actually gets, including :focus-visible.
      //
      // Seeks rather than counting presses. A fixed count encodes how many
      // focusable things happen to sit above the widget, which is a property
      // of the header, not of the trace — adding the header's name link broke
      // exactly that assumption once.
      let focused: string | null = null;
      let stops = 0;
      for (; stops < 10 && focused === null; stops += 1) {
        await page.keyboard.press('Tab');
        focused = await page.evaluate(
          () => document.activeElement?.getAttribute('data-index') ?? null,
        );
      }

      expect(focused, 'Tab never reached an attempt').toBe('0');

      // Ten attempts must still cost one stop between them, however many
      // stops precede the widget.
      const inTabOrder = await page.evaluate(
        () =>
          [...document.querySelectorAll('.trace__mark-group')].filter(
            (g) => g.getAttribute('tabindex') === '0',
          ).length,
      );
      expect(inTabOrder, 'roving tabindex should leave exactly one stop').toBe(1);

      await page.locator('.trace__panel').screenshot({ path: `${OUT}/${name}-focus.png` });
    });
  });
}

/**
 * Target size, measured in the browser rather than derived from the geometry.
 *
 * The unit tests can only check the viewBox arithmetic against an assumed
 * render width. Everything upstream of that — the page gutter, the panel
 * padding, the axis-label gutter — is CSS, and a change to any of it resizes
 * every target. That has already happened once: adding the label gutter took
 * the 360px targets from 24px to 22px, and nothing failed.
 */
for (const width of [360, 390, 768, 1440]) {
  test.describe(`target size at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('every attempt clears the 24px minimum', async ({ page }) => {
      await page.goto('/');
      await settle(page);

      const boxes = await page.evaluate(() =>
        [...document.querySelectorAll('.trace__mark-hit')].map((el) => {
          const r = el.getBoundingClientRect();
          return { w: r.width, h: r.height };
        }),
      );

      expect(boxes.length, 'no attempt targets found').toBeGreaterThan(0);
      for (const [i, box] of boxes.entries()) {
        expect(box.w, `attempt ${i + 1} is ${box.w.toFixed(1)}px wide`).toBeGreaterThanOrEqual(24);
        expect(box.h, `attempt ${i + 1} is ${box.h.toFixed(1)}px tall`).toBeGreaterThanOrEqual(24);
      }
    });
  });
}

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1440, height: 1100 } });

  test('renders the trace and offers no dead controls', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    // The static rendering has to be a real one, not a placeholder.
    await expect(page.locator('.trace__curve')).toBeVisible();
    await expect(page.locator('.trace__band')).toBeVisible();
    await expect(page.locator('.trace__stamp')).toHaveText('Synthetic data');
    await expect(page.locator('[data-sentence]')).toContainText('per cent');

    // And it must not pretend to be interactive.
    await expect(page.locator('[tabindex]')).toHaveCount(0);
    await expect(page.locator('[role="button"]')).toHaveCount(0);
    await expect(page.locator('[data-controls]')).toBeHidden();
    await expect(page.locator('[data-instructions]')).toBeHidden();

    await page.screenshot({ path: `${OUT}/1440-no-js.png`, fullPage: true });
  });
});
