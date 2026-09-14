import { expect, test } from '@playwright/test';

/**
 * The page is the design canvas, so what is checked is that the canvas's
 * pieces are there and work: the hero's 3D frame, the fields, the tabs, the
 * anchors, and nothing pushing the page sideways at a phone width.
 */
test('the canvas is on the page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('iframe[data-mh-scene]')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('The gap is the whole discipline.');
  expect(await page.locator('mh-bg').count()).toBeGreaterThanOrEqual(3);
  for (const id of ['research', 'learning', 'people', 'join']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('the learning tabs switch', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-mh-tab="1"]').click();
  await expect(page.locator('[data-mh-panel="1"]')).toBeVisible();
  await expect(page.locator('[data-mh-panel="0"]')).toBeHidden();
  await expect(page.locator('[data-mh-tab="1"]')).toHaveAttribute('aria-selected', 'true');
});

test('nothing overflows at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/');
  const o = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  expect(o.s).toBeLessThanOrEqual(o.c);
});
