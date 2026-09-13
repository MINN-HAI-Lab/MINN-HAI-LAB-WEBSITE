import { expect, test } from '@playwright/test';

/**
 * Layout shift on load.
 *
 * Two things move on this site before it settles: the metric-matched fallback
 * face swapping to Literata, and the mastery curve drawing in. Neither had
 * been measured.
 *
 * The 0.1 threshold is Google's "good" Cumulative Layout Shift boundary, not a
 * number picked here. It is the one external standard in this suite and it is
 * cited rather than invented.
 *
 * The curve draw should contribute nothing at all: it animates
 * stroke-dashoffset inside a fixed-size SVG, which paints differently without
 * moving anything. If this ever rises, something has started reflowing.
 */

const PAGES = ['/', '/research/', '/people/', '/learning/', '/about/', '/404.html'] as const;

/** Google's "good" CLS boundary. */
const GOOD_CLS = 0.1;

interface Shift {
  value: number;
  sources: string[];
}

async function measureShift(
  page: import('@playwright/test').Page,
  path: string,
): Promise<{ total: number; shifts: Shift[] }> {
  // The observer has to exist before anything paints, so it goes in as an
  // init script rather than being evaluated after navigation.
  await page.addInitScript(() => {
    (window as unknown as { __shifts: Shift[] }).__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
          sources?: Array<{ node?: Node }>;
        };
        // Shifts within 500ms of a real interaction are expected and excluded
        // from CLS by definition.
        if (shift.hadRecentInput) continue;
        (window as unknown as { __shifts: Shift[] }).__shifts.push({
          value: shift.value,
          sources: (shift.sources ?? [])
            .map((s) => {
              const el = s.node as Element | undefined;
              if (!el || !('tagName' in el)) return 'unknown';
              const cls = String((el as HTMLElement).className ?? '').split(' ')[0];
              return cls ? `${el.tagName.toLowerCase()}.${cls}` : el.tagName.toLowerCase();
            })
            .slice(0, 3),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  // Past --dur-slow, so the curve draw is finished and counted.
  await page.waitForTimeout(1200);

  const shifts = await page.evaluate(
    () => (window as unknown as { __shifts: Shift[] }).__shifts,
  );
  return { total: shifts.reduce((sum, s) => sum + s.value, 0), shifts };
}

for (const path of PAGES) {
  test.describe(`stability: ${path}`, () => {
    test('settles without a visible jump', async ({ page }) => {
      const { total, shifts } = await measureShift(page, path);

      const detail = shifts
        .map((s) => `    ${s.value.toFixed(4)}  ${s.sources.join(', ')}`)
        .join('\n');
      console.log(
        `\n${path} cumulative layout shift: ${total.toFixed(4)}` +
          (shifts.length ? `\n${detail}` : '  (no shifts recorded)'),
      );

      expect(
        total,
        `layout shift ${total.toFixed(4)} exceeds the 0.1 "good" threshold:\n${detail}`,
      ).toBeLessThan(GOOD_CLS);
    });
  });
}

test.describe('stability: the curve draw', () => {
  test('the load animation moves nothing', async ({ page }) => {
    // The draw animates stroke-dashoffset inside a fixed-size SVG. That paints
    // differently without reflowing, so it should contribute no shift at all —
    // not merely a small one.
    const { shifts } = await measureShift(page, '/');

    const fromTrace = shifts.filter((s) =>
      s.sources.some((source) => source.includes('trace')),
    );

    expect(
      fromTrace.map((s) => `${s.value.toFixed(4)} from ${s.sources.join(', ')}`),
      'the trace widget should not shift the page while it draws',
    ).toEqual([]);
  });
});

test.describe('fonts', () => {
  test('fetches only the subset the page actually uses', async ({ page }) => {
    // unicode-range makes the second subset lazy. Preloading defeats that and
    // costs 69KB on a first visit for glyphs no page here contains, so the
    // Font component is deliberately used without `preload`.
    const fonts: Array<{ name: string; size: number }> = [];
    page.on('response', async (response) => {
      if (response.request().resourceType() !== 'font') return;
      let size = 0;
      try {
        size = (await response.body()).length;
      } catch {
        // The body can be gone by the time this runs; the count still holds.
      }
      fonts.push({ name: new URL(response.url()).pathname.split('/').pop() ?? '', size });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    const total = fonts.reduce((sum, f) => sum + f.size, 0);
    expect(
      fonts.length,
      `expected one font file, got ${fonts.length}: ${fonts.map((f) => f.name).join(', ')}`,
    ).toBe(1);
    expect(total / 1024, 'the latin subset alone').toBeLessThan(100);
  });
});
