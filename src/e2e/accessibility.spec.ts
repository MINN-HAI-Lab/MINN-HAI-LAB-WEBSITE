import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';

/**
 * axe-core over every built page.
 *
 * Run against the built site, in the states a reader can actually reach:
 * as loaded, and with the attribution view open, since that changes the
 * accessible name of all ten attempts.
 *
 * axe finds machine-checkable failures. It does not find a bad heading order
 * that is technically valid, a focus ring that is visible but meaningless, or
 * a live region that announces the wrong thing — those are covered by the
 * checks in screenshots.spec.ts and by T-17.
 */

const require = createRequire(import.meta.url);
const AXE_SOURCE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

/** Every page the site builds. Add a page here when one is added to src/pages. */
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'specimen', path: '/specimen/' },
  { name: '404', path: '/404.html' },
] as const;

interface AxeNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

interface AxeViolation {
  id: string;
  impact: string | null;
  help: string;
  helpUrl: string;
  nodes: AxeNode[];
}

async function analyse(page: import('@playwright/test').Page): Promise<AxeViolation[]> {
  await page.evaluate(AXE_SOURCE);
  return page.evaluate(async () => {
    // WCAG 2.2 A and AA, which is what CLAUDE.md's quality floor describes.
    const results = await (window as unknown as {
      axe: { run: (ctx: unknown, opts: unknown) => Promise<{ violations: AxeViolation[] }> };
    }).axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    });
    return results.violations;
  });
}

/** Turn axe output into something a person can act on. */
function report(violations: readonly AxeViolation[]): string {
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 3)
        .map((n) => `      ${n.target.join(' ')}\n        ${n.html.slice(0, 160)}`)
        .join('\n');
      return `  [${v.impact ?? 'unknown'}] ${v.id}: ${v.help}\n    ${v.helpUrl}\n${nodes}`;
    })
    .join('\n\n');
}

for (const { name, path } of PAGES) {
  test.describe(`axe: ${name}`, () => {
    test('as loaded', async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(800);

      const violations = await analyse(page);
      expect(violations.length, `\n\n${report(violations)}\n`).toBe(0);
    });
  });
}

test.describe('axe: home with the attribution view open', () => {
  test('the second state of the widget is checked too', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    // Opening this rewrites the accessible name of every attempt, so it is a
    // genuinely different tree rather than the same page with a class on it.
    await page.locator('[data-attribution]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.trace__mark-group.is-carrying')).not.toHaveCount(0);

    const violations = await analyse(page);
    expect(violations.length, `\n\n${report(violations)}\n`).toBe(0);
  });
});

test.describe('axe: home without the site script', () => {
  test('the static rendering is audited as a real page', async ({ page }) => {
    // axe itself needs scripting, so javaScriptEnabled:false is not an option.
    // Instead the site's own modules are stripped at the network layer: the
    // HTML arrives without them, the stylesheet and fonts still load from
    // their real URLs, and the page is genuinely the un-upgraded one.
    //
    // The first attempt used setContent with the no-JS markup, which looked
    // equivalent and was not — relative stylesheet URLs do not resolve in a
    // page with no base, so nothing was styled and axe reported target-size
    // failures against unstyled links.
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
    await page.evaluate(() => document.fonts.ready);

    // Confirm the upgrade really did not run, or this audits the wrong page.
    await expect(page.locator('[tabindex]')).toHaveCount(0);
    await expect(page.locator('[data-controls]')).toBeHidden();

    const violations = await analyse(page);
    expect(violations.length, `\n\n${report(violations)}\n`).toBe(0);
  });
});
