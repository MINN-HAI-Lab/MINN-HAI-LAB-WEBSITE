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
    /* Recorded as it happens, not caught mid-flight.
     *
     * The first version polled for a dash array with waitForFunction, which is
     * a race against the animation it is trying to observe: the draw takes
     * --dur-slow, and if the first poll lands after it finishes, the dash
     * array has already been cleaned up and was never seen. It passed almost
     * always and failed in WebKit about one run in five — which is the worst
     * possible behaviour for a test, because it teaches whoever sees it to run
     * the suite again rather than to look.
     *
     * A MutationObserver installed before any page script runs sees every
     * value the style attribute ever held, so the assertion does not depend on
     * when it is made.
     */
    await page.addInitScript(() => {
      const seen: string[] = [];
      (window as unknown as { __dashOffsets: string[] }).__dashOffsets = seen;

      const watch = (curve: SVGPathElement): void => {
        new MutationObserver(() => {
          const value = curve.style.strokeDashoffset;
          if (seen[seen.length - 1] !== value) seen.push(value);
        }).observe(curve, { attributes: true, attributeFilter: ['style'] });
      };

      // The curve is server-rendered, but this script runs before the document
      // exists, so wait for it.
      document.addEventListener('DOMContentLoaded', () => {
        const curve = document.querySelector<SVGPathElement>('.trace__curve');
        if (curve) watch(curve);
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Comfortably past --dur-slow, so the draw has finished either way.
    await page.waitForTimeout(1500);

    const offsets = await page.evaluate(
      () => (window as unknown as { __dashOffsets: string[] }).__dashOffsets ?? [],
    );

    const numeric = offsets.map((v) => Number.parseFloat(v)).filter((n) => Number.isFinite(n));
    expect(
      numeric.length,
      `the curve never set a dash offset, so it did not draw in: ${offsets.join(', ')}`,
    ).toBeGreaterThan(2);
    // It runs down towards zero rather than jumping.
    expect(Math.max(...numeric), 'the draw should start at the full path length').toBeGreaterThan(0);
    expect(
      numeric[numeric.length - 1] ?? 1,
      'the draw should finish at zero rather than partway',
    ).toBeLessThan(Math.max(...numeric));

    // And it must clean up after itself, or a later toggle redraws against a
    // stale dash pattern.
    const after = await curveState(page);
    expect(after.dashArray, 'the dash array was left on the curve').toBe('');
    expect(after.dashOffset, 'the dash offset was left on the curve').toBe('');
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
