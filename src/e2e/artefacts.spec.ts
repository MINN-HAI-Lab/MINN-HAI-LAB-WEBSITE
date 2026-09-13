import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

/* Axe injected from source rather than through a wrapper package, which is how
   accessibility.spec.ts already does it. One way of running axe in this repo,
   not two. */
const require = createRequire(import.meta.url);
const AXE_SOURCE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

/**
 * The four artefacts, against what the brief asks of them.
 *
 *   "These are the site. Each is real, interactive, and animated."
 *   "Every artefact carries a visible label saying whether its data is real,
 *    synthetic or illustrative."
 *   "Keyboard operable throughout, visible focus. Works at 360px."
 *
 * Each of those was checked by hand while the artefact was built, which is
 * exactly the kind of checking that stops happening. The provenance label in
 * particular is the one thing on this site that must not quietly fall off: an
 * artefact without it is a convincing picture of data whose status nobody
 * states.
 */

interface Artefact {
  name: string;
  path: string;
  selector: string;
  /** The provenance line, exactly as it should read. */
  provenance: string;
  /** A word the note under it must contain, so the claim is spelled out. */
  noteWord: RegExp;
}

const ARTEFACTS: readonly Artefact[] = [
  {
    name: 'knowledge tracing',
    path: '/',
    selector: '[data-trace]',
    provenance: 'Synthetic data',
    noteWord: /synthetic/i,
  },
  {
    name: 'Bayesian explanation',
    path: '/research/',
    selector: '[data-network]',
    provenance: 'Illustrative structure',
    noteWord: /illustrative/i,
  },
  {
    name: 'computer vision',
    path: '/research/',
    selector: '[data-saliency]',
    provenance: 'Openly licensed photograph, computed saliency',
    noteWord: /real photograph/i,
  },
  {
    name: 'language',
    path: '/research/',
    selector: '[data-language]',
    provenance: 'Real tokenisation, illustrative attention',
    noteWord: /illustrative/i,
  },
];

for (const artefact of ARTEFACTS) {
  test.describe(`artefact: ${artefact.name}`, () => {
    test('says on its face whether its data is real, synthetic or illustrative', async ({
      page,
    }) => {
      await page.goto(artefact.path);
      const root = page.locator(artefact.selector);

      const provenance = root.locator('.artefact__provenance');
      await expect(provenance, 'the provenance label is missing').toHaveCount(1);
      await expect(provenance).toHaveText(artefact.provenance);
      // Visible, not merely present: a label in a visually-hidden span would
      // pass a presence check and tell a sighted reader nothing.
      await expect(provenance).toBeVisible();

      /* The note is found by its own hook, not by position. `.artefact__note`
         is also the class on the keyboard instructions, and taking the first
         one matched "Arrow keys move between them" on two of the four. */
      const note = root.locator('[data-provenance-note]');
      await expect(note, 'the provenance note is missing').toHaveCount(1);
      await expect(note).toBeVisible();
      await expect(note).toContainText(artefact.noteWord);
    });

    test('is operable by keyboard, with a ring that is not the browser default', async ({
      page,
      browserName,
    }) => {
      await page.goto(artefact.path);
      await page.waitForLoadState('networkidle');
      const root = page.locator(artefact.selector);
      await root.scrollIntoViewIfNeeded();

      const controls = root.locator(
        'button:not([hidden]), input, [tabindex="0"], [role="button"], [role="application"]',
      );
      const count = await controls.count();
      expect(count, `${artefact.name} exposes nothing to focus`).toBeGreaterThan(0);

      for (let i = 0; i < count; i += 1) {
        const control = controls.nth(i);
        if (!(await control.isVisible())) continue;
        await control.focus();

        const ring = await control.evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            focused: el === document.activeElement,
            width: style.outlineWidth,
            style: style.outlineStyle,
          };
        });

        expect(ring.focused, `control ${i + 1} of ${artefact.name} will not take focus`).toBe(
          true,
        );
        // WebKit paints its own ring on some elements without reporting an
        // outline; everywhere else a real outline has to be there.
        if (browserName !== 'webkit') {
          expect(
            Number.parseFloat(ring.width),
            `control ${i + 1} of ${artefact.name} has no visible focus ring`,
          ).toBeGreaterThan(0);
          expect(ring.style).not.toBe('none');
        }
      }
    });

    test('fits at 360px without pushing the page sideways', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 780 });
      await page.goto(artefact.path);
      await page.waitForLoadState('networkidle');
      await page.locator(artefact.selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(
        overflow.scroll,
        `${artefact.name} makes the page ${overflow.scroll - overflow.client}px wider than the viewport`,
      ).toBeLessThanOrEqual(overflow.client);
    });
  });
}

test.describe('artefact: the language tokeniser', () => {
  test('retokenises as the reader types, and the drawing follows', async ({ page }) => {
    await page.goto('/research/');
    await page.waitForLoadState('networkidle');
    const root = page.locator('[data-language]');
    await root.scrollIntoViewIfNeeded();

    const before = await root.locator('[data-token]').count();
    expect(before, 'the example sentence should already be tokenised').toBeGreaterThan(5);

    await page.fill('[data-input]', 'Attention connects the parts of a sentence.');
    await page.waitForTimeout(500);

    const tokens = await root.locator('[data-token]').allTextContents();
    // The tokeniser's own claim: it splits a long word from its suffix.
    expect(tokens).toContain('connect');
    expect(tokens).toContain('s');
    expect(await root.locator('.language__link').count(), 'no attention drawn').toBeGreaterThan(
      0,
    );
    await expect(root.locator('[data-count]')).toContainText(/\d+ tokens from \d+ words/);
  });
});

test.describe('artefact: the saliency map', () => {
  test('responds to where the pointer is, and finds structure rather than proximity', async ({
    page,
  }) => {
    await page.goto('/research/');
    await page.waitForLoadState('networkidle');
    const root = page.locator('[data-saliency]');
    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveClass(/is-live/);

    const stage = await root.locator('[data-stage]').boundingBox();
    if (!stage) throw new Error('the saliency stage has no box');

    /* The eye is in the lower middle of the frame and the thrown-out
       background is the top left corner. The whole argument of the artefact is
       that those two give different answers. */
    await page.mouse.move(stage.x + stage.width * 0.3, stage.y + stage.height * 0.55);
    await page.waitForTimeout(400);
    const onStructure = Number(await root.locator('[data-peak]').textContent());

    await page.mouse.move(stage.x + stage.width * 0.06, stage.y + stage.height * 0.1);
    await page.waitForTimeout(400);
    const onSmooth = Number(await root.locator('[data-peak]').textContent());

    expect(onStructure).toBeGreaterThan(onSmooth);
    expect(
      onStructure - onSmooth,
      'the difference between a sharp eye and a blurred background should not be marginal',
    ).toBeGreaterThan(0.15);
  });
});

test.describe('artefact: the 3D view', () => {
  test('opens, and has no accessibility violations while it is open', async ({ page }) => {
    await page.goto('/research/');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-load-3d]').click();
    await page.waitForTimeout(4000);

    const stage = page.locator('[data-stage-3d]');
    const opened = await stage.evaluate((el) => !(el as HTMLElement).hidden);

    /* WebGL is not guaranteed in every engine here. If the view could not
       open, the artefact must have said so and left the diagram in place —
       which is the behaviour worth checking, so it is not skipped. */
    if (!opened) {
      await expect(page.locator('[data-network] .artefact__panel')).toBeVisible();
      await expect(page.locator('[data-load-3d]')).toHaveText(/could not be opened/);
      return;
    }

    await page.evaluate(AXE_SOURCE);
    const violations = await page.evaluate(async () => {
      const results = await (
        window as unknown as {
          axe: {
            run: (
              ctx: unknown,
              opts: unknown,
            ) => Promise<{ violations: Array<{ id: string; nodes: unknown[] }> }>;
          };
        }
      ).axe.run(document.querySelector('[data-network]'), {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      });
      return results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`);
    });

    expect(violations, 'the 3D view introduced accessibility violations').toEqual([]);

    // Escape closes it and gives the diagram back.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    expect(await stage.evaluate((el) => (el as HTMLElement).hidden)).toBe(true);
    await expect(page.locator('[data-network] .artefact__panel')).toBeVisible();
  });
});
