import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, join } from 'node:path';
import { describe as suite, expect, it } from 'vitest';
import { type LintTarget, formatViolations, lintTokens } from './token-lint.ts';

const STYLES = fileURLToPath(new URL('../styles', import.meta.url));

/** Every stylesheet in the project, tokens.css marked as the one exception. */
function stylesheets(): LintTarget[] {
  return readdirSync(STYLES)
    .filter((name) => name.endsWith('.css'))
    .map((name) => ({
      file: `src/styles/${name}`,
      source: readFileSync(join(STYLES, name), 'utf8'),
      isTokenFile: basename(name) === 'tokens.css',
    }));
}

suite('the rules themselves', () => {
  const lint = (source: string, isTokenFile = false) =>
    lintTokens([{ file: 'test.css', source, isTokenFile }]);

  it('catches raw hex', () => {
    expect(lint('.a { color: #ff0000; }')[0]?.rule).toBe('hex');
  });

  it('catches raw px', () => {
    expect(lint('.a { padding: 13px; }')[0]?.rule).toBe('px');
  });

  it('allows raw values inside tokens.css', () => {
    expect(lint(':root { --field: #070b10; --space-4: 16px; }', true)).toEqual([]);
  });

  it('no longer has an opinion about shadows', () => {
    // DESIGN.md banned them; the current brief lifts the ban (Q-19). Written
    // with tokens so the px rule, which still applies, does not fire instead
    // and make this look like it passed for the wrong reason.
    expect(
      lint('.a { box-shadow: 0 0 0 var(--rule-width) var(--surface-edge); }'),
    ).toEqual([]);
  });

  it('does not fail prose in comments that mentions a value', () => {
    // The comments in this codebase quote measured ratios and hex values
    // constantly. Linting them would make the rule unusable.
    expect(lint('/* --text-muted is 5.93:1 here, and #070b10 is the field */\n.a { color: var(--text); }')).toEqual([]);
  });

  it('allows the three declared breakpoints in a media query', () => {
    expect(lint('@media (width >= 900px) { .a { color: var(--ink); } }')).toEqual([]);
    expect(lint('@media (width < 640px) { .a { color: var(--ink); } }')).toEqual([]);
    expect(lint('@media (width >= 1180px) { .a { color: var(--ink); } }')).toEqual([]);
  });

  it('rejects a fourth breakpoint', () => {
    const found = lint('@media (width >= 1024px) { .a { color: var(--ink); } }');
    expect(found[0]?.rule).toBe('px');
    expect(found[0]?.message).toContain('no fourth');
  });

  it('honours an explicit, reasoned exemption', () => {
    expect(lint('/* lint-allow-px: the clip idiom needs a real 1px box */\n.a { inline-size: 1px; }')).toEqual([]);
  });

  it('requires the exemption to carry a reason', () => {
    expect(lint('/* lint-allow-px: */\n.a { inline-size: 1px; }').length).toBe(1);
  });

  it('exempts to the end of the rule block, so an idiom needs one directive', () => {
    const found = lint(
      [
        '/* lint-allow-px: the clip idiom needs a real 1px box */',
        '.a {',
        '  inline-size: 1px;',
        '  block-size: 1px;',
        '  margin: -1px;',
        '}',
      ].join('\n'),
    );
    expect(found).toEqual([]);
  });

  it('does not let an exemption leak past its block', () => {
    const found = lint(
      [
        '/* lint-allow-px: only the clip box */',
        '.a {',
        '  inline-size: 1px;',
        '}',
        '.b {',
        '  padding: 7px;',
        '}',
      ].join('\n'),
    );
    expect(found).toHaveLength(1);
    expect(found[0]?.line).toBe(6);
  });
});

suite('the project stylesheets', () => {
  it('has stylesheets to lint, including tokens.css', () => {
    const sheets = stylesheets();
    expect(sheets.length).toBeGreaterThan(3);
    expect(sheets.some((s) => s.isTokenFile)).toBe(true);
  });

  it('passes the token lint', () => {
    const violations = lintTokens(stylesheets());
    expect(
      violations.length,
      violations.length === 0
        ? ''
        : `\n\n${formatViolations(violations)}\n\n${violations.length} violation(s).\n`,
    ).toBe(0);
  });
});
