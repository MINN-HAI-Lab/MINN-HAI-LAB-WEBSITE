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
 * As measured, a cold visit to the home page is 98.1KB, of which 83.8KB is
 * Literata. Everything the site itself produces — HTML, CSS and the trace
 * island — is 14.3KB.
 *
 * That split is the useful part. One webfont costs six times the entire rest
 * of the site, which is worth knowing before anyone optimises the 3.3KB of
 * JavaScript.
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
  // One island: the trace.
  { path: '/', total: 112, site: 17 },
  // Four artefacts, and the photograph once it is scrolled to. The 3D chunk is
  // not in this number and islands.spec.ts fails if it ever is.
  { path: '/research/', total: 135, site: 29 },
  // No island. These should be almost entirely font and stylesheet; if one of
  // them grows a script, that is the finding.
  { path: '/people/', total: 106, site: 11 },
  { path: '/learning/', total: 106, site: 11 },
  { path: '/about/', total: 106, site: 11 },
  { path: '/404.html', total: 106, site: 11 },
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
