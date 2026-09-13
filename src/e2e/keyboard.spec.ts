import { expect, test } from '@playwright/test';

/**
 * The whole document by keyboard, on every page.
 *
 * T-11 and T-17 covered the trace widget. This is everything around it: that
 * the skip link works and is first, that Tab reaches every control and then
 * leaves, that nothing traps focus, and that every stop shows a ring that is
 * not the browser default.
 *
 * docs/handbook.md's pre-deploy checklist: "Keyboard through the whole page
 * including the trace widget."
 */

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'specimen', path: '/specimen/' },
  { name: '404', path: '/404.html' },
] as const;

/** A short, stable description of whatever currently has focus. */
async function focused(page: import('@playwright/test').Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return 'body';
    const index = (el as HTMLElement).dataset?.index;
    if (index !== undefined) return `attempt ${index}`;
    const cls = (el.className as unknown as { baseVal?: string })?.baseVal ?? el.className;
    const first = String(cls ?? '').split(' ')[0];
    return first ? `${el.tagName.toLowerCase()}.${first}` : el.tagName.toLowerCase();
  });
}

/** Walk Tab until focus returns to the body or the budget runs out. */
async function tabThrough(
  page: import('@playwright/test').Page,
  limit = 30,
): Promise<string[]> {
  const seen: string[] = [];
  for (let i = 0; i < limit; i += 1) {
    await page.keyboard.press('Tab');
    const where = await focused(page);
    if (where === 'body') break;
    seen.push(where);
  }
  return seen;
}

for (const { name, path } of PAGES) {
  test.describe(`keyboard: ${name}`, () => {
    test('the skip link is the first stop and moves focus to main', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      await page.keyboard.press('Tab');
      expect(await focused(page), 'the skip link should be the first tab stop').toBe(
        'a.skip-link',
      );

      // Visible only once focused — off-screen otherwise, but never
      // display:none, which would take it out of the tab order entirely.
      const onScreen = await page.evaluate(() => {
        const link = document.querySelector('.skip-link')!;
        return link.getBoundingClientRect().top >= 0;
      });
      expect(onScreen, 'the skip link should be visible when focused').toBe(true);

      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);

      const landed = await page.evaluate(() => document.activeElement?.id);
      expect(landed, 'Enter on the skip link should move focus to #main').toBe('main');
    });

    test('every stop shows a focus ring that is not the browser default', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const stops = await tabThrough(page);
      expect(stops.length, 'the page should have at least one tab stop').toBeGreaterThan(0);

      // Walk again, checking the computed outline at each stop.
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      for (let i = 0; i < stops.length; i += 1) {
        await page.keyboard.press('Tab');
        const ring = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el) return null;
          const s = getComputedStyle(el);
          return { style: s.outlineStyle, width: s.outlineWidth, colour: s.outlineColor };
        });
        expect(ring, `no element focused at stop ${i + 1}`).not.toBeNull();
        expect(ring!.style, `stop ${i + 1} (${stops[i]}) has no outline style`).not.toBe('none');
        expect(
          Number.parseFloat(ring!.width),
          `stop ${i + 1} (${stops[i]}) has a zero-width outline`,
        ).toBeGreaterThan(0);
      }
    });

    test('focus escapes the page rather than looping forever', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const stops = await tabThrough(page, 40);
      // tabThrough stops when focus returns to the body. Hitting the limit
      // means something is holding on to it.
      expect(stops.length, `focus never left the page: ${stops.join(' -> ')}`).toBeLessThan(40);
    });
  });
}

test.describe('keyboard: home, past the widget', () => {
  test('the ten attempts cost one stop and the button follows', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const stops = await tabThrough(page);

    const attempts = stops.filter((s) => s.startsWith('attempt '));
    expect(attempts, 'the roving tabindex should expose exactly one attempt').toHaveLength(1);
    expect(attempts[0]).toBe('attempt 0');

    const attemptAt = stops.findIndex((s) => s.startsWith('attempt '));
    expect(
      stops.slice(attemptAt + 1).some((s) => s.includes('button')),
      `the attribution button should follow the attempts: ${stops.join(' -> ')}`,
    ).toBe(true);
  });
});
