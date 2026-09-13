import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe as suite, expect, it } from 'vitest';

/**
 * Dead CSS.
 *
 * `.annotated` was written in T-04, specified in DESIGN.md, and used by
 * nothing until T-42 rendered it — at which point it turned out to be missing
 * its paragraph rhythm and its measure cap. CSS nobody renders is CSS nobody
 * knows is broken.
 *
 * This checks every class selector in the stylesheets appears somewhere that
 * could put it on an element: a template, a script, or the allowlist below
 * with a reason.
 */

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/**
 * Classes that are defined and deliberately not used yet.
 *
 * Each needs a reason. "It might be useful later" is not one — that is how
 * .annotated sat unrendered and unnoticed for nine tasks.
 */
const ALLOWED = new Map<string, string>([
  // Tailwind's own utilities are generated on demand from class names in the
  // markup, so by construction they cannot be dead.
]);

/** Every file that could put a class on an element. */
function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'styles') continue;
      sourceFiles(path, out);
    } else if (/\.(astro|ts|md)$/.test(entry.name) && !entry.name.endsWith('.test.ts')) {
      out.push(path);
    }
  }
  return out;
}

/** Class selectors defined in our own stylesheets. */
function definedClasses(): Map<string, string> {
  const stylesDir = join(ROOT, 'styles');
  const found = new Map<string, string>();

  for (const name of readdirSync(stylesDir).filter((f) => f.endsWith('.css'))) {
    const css = readFileSync(join(stylesDir, name), 'utf8')
      // Comments explain classes constantly; they are not definitions.
      .replace(/\/\*[\s\S]*?\*\//g, '');

    for (const match of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
      const cls = match[1]!;
      if (!found.has(cls)) found.set(cls, name);
    }
  }
  return found;
}

suite('dead CSS', () => {
  const defined = definedClasses();
  const sources = sourceFiles(ROOT)
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');

  it('finds the classes this project defines', () => {
    // A sanity check on the parser itself: if this ever reads zero classes the
    // suite below would pass vacuously.
    expect(defined.size).toBeGreaterThan(20);
    expect(defined.has('trace__curve')).toBe(true);
    expect(defined.has('annotated')).toBe(true);
  });

  it('has no class that nothing can apply', () => {
    const dead: string[] = [];

    for (const [cls, file] of defined) {
      if (ALLOWED.has(cls)) continue;
      // Bare word-boundary match: a class can reach an element through a
      // class attribute, a class:list array, classList.add or a toggle.
      if (new RegExp(`\\b${cls.replace(/[-[\]{}()*+?.\\^$|]/g, '\\$&')}\\b`).test(sources)) {
        continue;
      }
      dead.push(`.${cls}  (${file})`);
    }

    expect(
      dead,
      'defined in CSS and applied by nothing. Render it, delete it, or add it ' +
        'to ALLOWED with a reason.',
    ).toEqual([]);
  });
});
