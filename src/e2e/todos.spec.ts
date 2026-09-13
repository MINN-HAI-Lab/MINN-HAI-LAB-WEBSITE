import { expect, test } from '@playwright/test';

/**
 * Every visible TODO marker, audited.
 *
 * CLAUDE.md: "Where content is missing, write a literal TODO: marker
 * describing what is needed and who can supply it. A visible gap is correct.
 * A plausible fabrication is a serious bug."
 *
 * A marker that says only "TODO: fix this" satisfies the letter of that and
 * none of the point. Each one has to name what is missing, name who supplies
 * it, and carry a tracker so it appears in the session state rather than
 * living only on a page nobody re-reads.
 *
 * The inventory is printed on every run, passing or failing, because
 * docs/handbook.md's pre-deploy checklist asks a person to decide they are all
 * resolved — and they cannot decide that without seeing the list.
 */

const PAGES = ['/', '/specimen/', '/404.html'] as const;

interface Marker {
  page: string;
  text: string;
}

test('every visible TODO names what is missing, who supplies it, and a tracker', async ({
  page,
}) => {
  const markers: Marker[] = [];

  for (const path of PAGES) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const found = await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .filter((el) => el.children.length === 0)
        .map((el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim())
        .filter((text) => text.includes('TODO:')),
    );

    for (const text of found) markers.push({ page: path, text });
  }

  // The inventory, for whoever is running the pre-deploy checklist.
  const inventory = markers.length
    ? markers.map((m) => `  ${m.page}\n    ${m.text}`).join('\n\n')
    : '  none';
  console.log(`\nVisible TODO markers (${markers.length}):\n${inventory}\n`);

  const malformed = markers.filter(
    (m) =>
      // Who supplies it.
      !/\bKaung\b/i.test(m.text) ||
      // A tracker, so it is not only recorded on the page.
      !/\bB-\d+\b/.test(m.text) ||
      // Something more than the word TODO.
      m.text.replace(/TODO:/g, '').trim().length < 40,
  );

  expect(
    malformed.map((m) => `${m.page}: ${m.text}`),
    'a TODO marker must name what is missing, who supplies it, and its tracker',
  ).toEqual([]);
});
