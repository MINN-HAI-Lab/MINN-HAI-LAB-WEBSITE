import { expect, test } from '@playwright/test';

/**
 * Motion, in both modes, measured rather than read off the stylesheet.
 *
 * docs/handbook.md's pre-deploy checklist asks for "reduced motion on, nothing
 * jumps". DESIGN.md is more specific about what that means: replace the curve
 * draw with the finished curve, replace the estimate transition with an
 * instant update plus a brief static highlight, and do not simply set duration
 * to zero on a transform, "which produces a jump, which is worse than the
 * animation".
 *
 * Both halves are checked here. The normal path has to actually animate, or
 * "reduced motion removes the animation" is not a claim about anything.
 */

/** Read the curve's `d` and its inline dash state. */
async function curveState(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const curve = document.querySelector<SVGPathElement>('.trace__curve');
    return {
      d: curve?.getAttribute('d') ?? '',
      dashArray: curve?.style.strokeDasharray ?? '',
      dashOffset: curve?.style.strokeDashoffset ?? '',
      changed: curve?.classList.contains('is-changed') ?? false,
    };
  });
}

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the curve draws in on load, once', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Catch it mid-draw. --dur-slow is 600ms, so shortly after load the dash
    // offset should be partway through, not zero and not absent.
    await page.waitForFunction(
      () => {
        const curve = document.querySelector<SVGPathElement>('.trace__curve');
        return !!curve?.style.strokeDasharray;
      },
      undefined,
      { timeout: 3000 },
    );

    const during = await curveState(page);
    expect(during.dashArray, 'the draw should set a dash array').not.toBe('');
    expect(Number.parseFloat(during.dashOffset)).toBeGreaterThan(0);

    // And it must clean up after itself, or a later toggle redraws against a
    // stale dash pattern.
    await page.waitForFunction(
      () => document.querySelector<SVGPathElement>('.trace__curve')?.style.strokeDasharray === '',
      undefined,
      { timeout: 3000 },
    );
    const after = await curveState(page);
    expect(after.dashArray).toBe('');
    expect(after.dashOffset).toBe('');
  });

  test('toggling animates the estimate rather than jumping to it', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const before = await curveState(page);
    await page.locator('.trace__mark-group').nth(3).click();

    // Sampled during --dur-base. The curve should be somewhere between the two
    // states, which is only true if it is being interpolated.
    await page.waitForTimeout(60);
    const midway = await curveState(page);

    await page.waitForTimeout(600);
    const settled = await curveState(page);

    expect(midway.d, 'the curve should have started moving').not.toBe(before.d);
    expect(midway.d, 'the curve should not have arrived yet').not.toBe(settled.d);
    expect(settled.d).not.toBe(before.d);
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the curve is finished on load, never drawn', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(900);

    // Nothing is hidden that could fail to be revealed: the dash properties
    // are never touched, so the curve in the HTML is what stays on screen.
    const state = await curveState(page);
    expect(state.dashArray, 'the draw must not run under reduced motion').toBe('');
    expect(state.dashOffset).toBe('');
    expect(state.d.length).toBeGreaterThan(50);
  });

  test('the estimate updates instantly and is highlighted, not transitioned', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const before = await curveState(page);
    await page.locator('.trace__mark-group').nth(3).click();

    // One frame later the curve is already at its final value. Under motion
    // this same sample lands midway.
    await page.waitForTimeout(40);
    const immediate = await curveState(page);
    expect(immediate.d).not.toBe(before.d);

    await page.waitForTimeout(500);
    const settled = await curveState(page);
    expect(immediate.d, 'reduced motion should not interpolate').toBe(settled.d);

    // The static highlight is what makes the change visible without movement.
    expect(immediate.changed, 'the highlight should be showing').toBe(true);
  });

  test('no transition is left running on anything', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const running = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('body *')]
        .map((el) => ({
          selector: el.className?.toString().split(' ')[0] ?? el.tagName,
          duration: getComputedStyle(el).transitionDuration,
        }))
        .filter(
          (e) =>
            e.duration !== '' &&
            e.duration.split(',').some((d) => Number.parseFloat(d) > 0),
        ),
    );

    expect(
      running,
      `transitions still active under reduced motion: ${JSON.stringify(running)}`,
    ).toEqual([]);
  });
});
