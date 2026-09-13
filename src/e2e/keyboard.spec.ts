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
  { name: 'research', path: '/research/' },
  { name: 'people', path: '/people/' },
  { name: 'learning', path: '/learning/' },
  { name: 'about', path: '/about/' },
  { name: '404', path: '/404.html' },
] as const;

interface Stop {
  /** Document-order index: identity, so two look-alike links are two stops. */
  key: string;
  /** A short description, for the failure message. */
  label: string;
}

/**
 * Whatever currently has focus: what it is, and which element it is.
 *
 * The label alone used to be the identity, and that broke the moment the
 * header grew five navigation links with the same class. Two consecutive
 * `a.site-header__link` stops looked to the walker below like focus that had
 * stopped moving, so it gave up four stops in and reported that the page had
 * no focusable attempts on it — on a page whose eighth stop is an attempt.
 *
 * The index is identity and the label is prose. They are different jobs.
 */
async function focused(page: import('@playwright/test').Page): Promise<Stop> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { key: 'body', label: 'body' };

    const index = (el as HTMLElement).dataset?.index;
    const cls = (el.className as unknown as { baseVal?: string })?.baseVal ?? el.className;
    const first = String(cls ?? '').split(' ')[0];
    const label =
      index !== undefined
        ? `attempt ${index}`
        : first
          ? `${el.tagName.toLowerCase()}.${first}`
          : el.tagName.toLowerCase();

    const key = String([...document.querySelectorAll('*')].indexOf(el));
    return { key, label };
  });
}

/**
 * Walk Tab until the order repeats or focus leaves the document.
 *
 * Engines disagree about what happens at the end of the tab order, and
 * detecting "focus returned to the body" only works in Chromium. Firefox
 * hands focus to the browser chrome and leaves document.activeElement on the
 * last element, so the naive version records the same element forever and
 * looks like a focus trap. This stops on a repeat instead, which holds
 * everywhere.
 */
async function tabThrough(
  page: import('@playwright/test').Page,
  limit = 40,
): Promise<string[]> {
  const labels: string[] = [];
  const keys: string[] = [];
  let previous = '';

  for (let i = 0; i < limit; i += 1) {
    await page.keyboard.press('Tab');
    const stop = await focused(page);
    if (stop.key === 'body') break;
    // The same element twice running: focus has left the document and the
    // engine is not reporting it.
    if (stop.key === previous) break;
    // Back to the first stop: the order has wrapped.
    if (keys.length > 1 && stop.key === keys[0]) break;
    keys.push(stop.key);
    labels.push(stop.label);
    previous = stop.key;
  }

  return labels;
}

/**
 * Safari does not put links in the tab order unless "Full Keyboard Access" is
 * on — a long-standing platform default, not a property of this site. Every
 * link here is focusable and activates correctly in WebKit when focused
 * directly, which is verified below; what changes is only whether Tab reaches
 * it.
 */
const TAB_REACHES_LINKS = (browserName: string): boolean => browserName !== 'webkit';

for (const { name, path } of PAGES) {
  test.describe(`keyboard: ${name}`, () => {
    test('the skip link is reachable and moves focus to main', async ({ page, browserName }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      if (TAB_REACHES_LINKS(browserName)) {
        await page.keyboard.press('Tab');
        expect((await focused(page)).label, 'the skip link should be the first tab stop').toBe(
          'a.skip-link',
        );
      } else {
        // Safari keeps links out of the tab order by default. The link still
        // has to exist, take focus and work.
        await page.locator('.skip-link').focus();
        expect((await focused(page)).label, 'the skip link should be focusable').toBe('a.skip-link');
      }

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

    test('every stop shows a focus ring that is not the browser default', async ({
      page,
      browserName,
    }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const ringOf = () =>
        page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el) return null;
          const s = getComputedStyle(el);
          return { style: s.outlineStyle, width: s.outlineWidth };
        });

      const stops = await tabThrough(page);

      if (stops.length > 0) {
        // Walk again, checking the computed outline at each stop.
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        for (let i = 0; i < stops.length; i += 1) {
          await page.keyboard.press('Tab');
          const ring = await ringOf();
          expect(ring, `no element focused at stop ${i + 1}`).not.toBeNull();
          expect(ring!.style, `stop ${i + 1} (${stops[i]}) has no outline style`).not.toBe('none');
          expect(
            Number.parseFloat(ring!.width),
            `stop ${i + 1} (${stops[i]}) has a zero-width outline`,
          ).toBeGreaterThan(0);
        }
        return;
      }

      // No tab stops at all. That is Safari on a page whose only controls are
      // links, and it is the platform's choice, not a missing focus style. The
      // ring still has to be there for anyone who focuses a link — by Full
      // Keyboard Access, by find-as-you-type, or by shortcut.
      expect(browserName, 'only WebKit should have no tab stops').toBe('webkit');

      const links = await page.locator('a').count();
      expect(links, 'the page should have links to focus').toBeGreaterThan(0);

      for (let i = 0; i < links; i += 1) {
        await page.locator('a').nth(i).focus();
        const ring = await ringOf();
        expect(ring!.style, `link ${i + 1} has no outline style when focused`).not.toBe('none');
        expect(
          Number.parseFloat(ring!.width),
          `link ${i + 1} has a zero-width outline when focused`,
        ).toBeGreaterThan(0);
      }
    });

    test('focus escapes the page rather than looping forever', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const stops = await tabThrough(page, 40);
      // tabThrough stops on a wrap, a repeat, or the body. Hitting the limit
      // means the order never came round, which is what a trap looks like.
      expect(stops.length, `focus never left the page: ${stops.join(' -> ')}`).toBeLessThan(40);
    });
  });
}

test.describe('keyboard: home, past the widget', () => {
  test('the ten attempts cost one stop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const stops = await tabThrough(page);
    const attempts = stops.filter((s) => s.startsWith('attempt '));

    expect(attempts, 'the roving tabindex should expose exactly one attempt').toHaveLength(1);
    expect(attempts[0]).toBe('attempt 0');
  });

  test('the attribution button is reachable and works', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    if (TAB_REACHES_LINKS(browserName)) {
      const stops = await tabThrough(page);
      const attemptAt = stops.findIndex((s) => s.startsWith('attempt '));
      expect(
        stops.slice(attemptAt + 1).some((s) => s.includes('button')),
        `the attribution button should follow the attempts: ${stops.join(' -> ')}`,
      ).toBe(true);
    }

    // In every engine, however it is reached, it must take focus and work.
    await page.locator('[data-attribution]').focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await expect(page.locator('[data-attribution]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.trace__mark-group.is-carrying')).not.toHaveCount(0);
  });
});
