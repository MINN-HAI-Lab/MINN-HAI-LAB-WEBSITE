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
 * As measured on the redesign (2026-09-14), a cold visit to the home page is
 * about 163KB: 106KB of the two webfonts, a 35KB still for the hero, and
 * 22KB of everything the site itself produces. The live hero scene arrives
 * after that and is not in the number.
 *
 * That split is still the useful part. The fonts cost five times the entire
 * rest of the site.
 *
 * THE BUDGET IS PER PAGE, and it was not always.
 *
 * A single number was right when the site was one page with one island. It
 * stopped being right the moment /research started carrying four artefacts:
 * that page legitimately ships three times the script the home page does, so
 * one budget either failed on /research or was slack enough on /people to
 * catch nothing. It failed on /research, which is the better of the two
 * failures but still the wrong test.
 *
 * Each page now carries its own measurement plus about fifteen per cent. The
 * point is unchanged: catch a fourth stylesheet, a stray dependency, or an
 * island that has wandered onto a page with no artefact on it.
 */

interface Budget {
  path: string;
  /** Everything, including the webfont. */
  total: number;
  /** HTML, CSS and script only — the part this repository controls. */
  site: number;
}

/** Measured 2026-09-13 on the built site, gzipped, plus headroom. */
const BUDGETS: readonly Budget[] = [
  // The hero still (35KB webp), the trace, two fields, and the loader that
  // brings the scene in after load. The scene itself is not in this number.
  { path: '/', total: 190, site: 27 },
  // Four artefacts, and the photograph once it is scrolled to.
  { path: '/research/', total: 160, site: 35 },
  // A field behind the header band, and on /learning the tabs.
  { path: '/people/', total: 140, site: 18 },
  { path: '/learning/', total: 140, site: 18 },
  { path: '/about/', total: 140, site: 18 },
  { path: '/404.html', total: 135, site: 13 },
];

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
  let loaded = false;
  page.on('load', () => {
    loaded = true;
  });

  page.on('response', async (response) => {
    // After the load event, nothing counts: the hero's scene is an
    // after-load import by design and is budgeted in islands.spec.ts.
    if (loaded) return;
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

  /* To the load event, plus the fonts. The hero's scene is an after-load
     import by design (Q-25) and is budgeted in islands.spec.ts; this is the
     cost of what a reader waits on. */
  await page.goto(path, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const total = Object.values(byType).reduce((a, b) => a + b, 0);
  // "site" is what this repository writes: HTML, CSS and script. Fonts and
  // images are assets it carries.
  return { total, site: total - (byType.font ?? 0) - (byType.image ?? 0), byType };
}

for (const budget of BUDGETS) {
  const path = budget.path;
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
        `${path} is ${(total / 1024).toFixed(1)}KB against a ${budget.total}KB budget: ${breakdown}`,
      ).toBeLessThan(budget.total);

      expect(
        site / 1024,
        `${path} ships ${(site / 1024).toFixed(1)}KB of its own HTML, CSS and script ` +
          `against a ${budget.site}KB budget: ${breakdown}`,
      ).toBeLessThan(budget.site);
    });
  });
}
