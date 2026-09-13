import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

/**
 * What a first visit costs.
 *
 * Not a design value and not from DESIGN.md: these are the measurements taken
 * on 2026-09-13 plus headroom, so the numbers move when someone decides they
 * should rather than drifting. A failure here is a prompt to look, not
 * necessarily a bug.
 *
 * As measured, a cold visit to the home page is 94.4KB, of which 83.8KB is
 * Literata. Everything the site itself produces — HTML, CSS and the trace
 * island — is 10.6KB.
 *
 * That split is the useful part. One webfont costs eight times the entire
 * rest of the site, which is worth knowing before anyone optimises the 3.2KB
 * of JavaScript.
 */

/** Measured 94.4KB, with headroom. */
const TOTAL_BUDGET_KB = 120;

/** Measured 10.6KB. Deliberately tight: this is the part we control, and it
 *  is where a fourth stylesheet or a stray dependency would show up. */
const SITE_BUDGET_KB = 25;

const PAGES = ['/', '/specimen/', '/404.html'] as const;

interface Weights {
  total: number;
  site: number;
  byType: Record<string, number>;
}

async function weigh(
  page: import('@playwright/test').Page,
  path: string,
): Promise<Weights> {
  const byType: Record<string, number> = {};

  page.on('response', async (response) => {
    const type = response.request().resourceType();
    try {
      const body = await response.body();
      // Fonts and images are already compressed; gzipping them again would not
      // be what the wire carries. Text resources are served compressed.
      const bytes = type === 'font' || type === 'image' ? body.length : gzipSync(body).length;
      byType[type] = (byType[type] ?? 0) + bytes;
    } catch {
      // Body already released; the remaining types still add up.
    }
  });

  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);

  const total = Object.values(byType).reduce((a, b) => a + b, 0);
  return { total, site: total - (byType.font ?? 0), byType };
}

for (const path of PAGES) {
  test.describe(`weight: ${path}`, () => {
    test('a first visit stays within budget', async ({ page }) => {
      const { total, site, byType } = await weigh(page, path);

      const breakdown = Object.entries(byType)
        .sort((a, b) => b[1] - a[1])
        .map(([type, bytes]) => `${type} ${(bytes / 1024).toFixed(1)}K`)
        .join(', ');
      console.log(`\n${path} first visit: ${(total / 1024).toFixed(1)}KB  (${breakdown})`);

      expect(
        total / 1024,
        `${path} is ${(total / 1024).toFixed(1)}KB against a ${TOTAL_BUDGET_KB}KB budget: ${breakdown}`,
      ).toBeLessThan(TOTAL_BUDGET_KB);

      expect(
        site / 1024,
        `${path} ships ${(site / 1024).toFixed(1)}KB of its own HTML, CSS and script ` +
          `against a ${SITE_BUDGET_KB}KB budget: ${breakdown}`,
      ).toBeLessThan(SITE_BUDGET_KB);
    });
  });
}
