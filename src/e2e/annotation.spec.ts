import { expect, test } from '@playwright/test';

/**
 * The annotation column.
 *
 * DESIGN.md § Layout: marginal notes run to the left of the measure at 1180px
 * and up, and fall inline beneath the paragraph they annotate below that.
 *
 * It exists for the limitation notes on /research, which is Phase 3. That
 * means it was written, never rendered, and never checked — the kind of thing
 * discovered to be broken on the day someone finally needs it. The specimen
 * page renders it so this can measure it.
 */

/** Where an element's box starts, and how wide it is. */
async function box(page: import('@playwright/test').Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) };
  }, selector);
}

test.describe('at 1180px and up', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('the note sits to the left of the body column', async ({ page }) => {
    await page.goto('/specimen/');
    await page.waitForLoadState('networkidle');

    const note = await box(page, '.annotated > .annotation');
    const body = await box(page, '.annotated > p.type-body');
    expect(note, 'no annotation on the page').not.toBeNull();
    expect(body, 'no annotated body text on the page').not.toBeNull();

    expect(
      note!.right,
      `the note should end before the body column starts: note ends ${note!.right}, body starts ${body!.left}`,
    ).toBeLessThanOrEqual(body!.left);
  });

  test('the note is the width DESIGN.md gives it', async ({ page }) => {
    await page.goto('/specimen/');
    await page.waitForLoadState('networkidle');

    const declared = await page.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--margin-col')),
    );
    const note = await box(page, '.annotated > .annotation');
    expect(note!.width, `--margin-col is ${declared}px`).toBe(declared);
  });
});

test.describe('below 1180px', () => {
  test.use({ viewport: { width: 1000, height: 900 } });

  test('the note falls inline, sharing the body column', async ({ page }) => {
    await page.goto('/specimen/');
    await page.waitForLoadState('networkidle');

    const note = await box(page, '.annotated > .annotation');
    const body = await box(page, '.annotated > p.type-body');

    // Inline, not beside: same left edge as the text it annotates.
    expect(
      note!.left,
      `the note should share the body column's left edge below 1180px`,
    ).toBe(body!.left);
  });

  test('the body text still respects the measure', async ({ page }) => {
    await page.goto('/specimen/');
    await page.waitForLoadState('networkidle');

    // The grid caps column 2 at --measure above 1180px. Below it the grid is
    // off, and without an explicit cap the prose ran the full page width.
    const body = await box(page, '.annotated > p.type-body');
    const measure = await page.evaluate(() => {
      const probe = document.querySelector('.prose.measure');
      return probe ? Math.round(probe.getBoundingClientRect().width) : 0;
    });
    expect(body!.width, `annotated prose should not exceed the measure (${measure}px)`)
      .toBeLessThanOrEqual(measure + 1);
  });

  test('it keeps a rule so it still reads as an aside', async ({ page }) => {
    await page.goto('/specimen/');
    await page.waitForLoadState('networkidle');

    const border = await page.evaluate(() => {
      const el = document.querySelector('.annotated > .annotation')!;
      const s = getComputedStyle(el);
      return { width: s.borderInlineStartWidth, style: s.borderInlineStartStyle };
    });
    expect(border.style).toBe('solid');
    expect(Number.parseFloat(border.width)).toBeGreaterThan(0);
  });
});
