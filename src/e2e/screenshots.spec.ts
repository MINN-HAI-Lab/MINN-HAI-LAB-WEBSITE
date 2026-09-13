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
      await page.keyboard.press('Tab'); // skip link
      await page.keyboard.press('Tab'); // first attempt

      const focused = await page.evaluate(
        () => document.activeElement?.getAttribute('data-index'),
      );
      expect(focused, 'Tab should reach the first attempt in two stops').toBe('0');

      await page.locator('.trace__panel').screenshot({ path: `${OUT}/${name}-focus.png` });
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
