/**
 * Token lint.
 *
 * Three rules, from CLAUDE.md and DESIGN.md:
 *
 *   1. No raw hex outside tokens.css. The palette lives in one file.
 *   2. No raw px outside tokens.css. Spacing, radii and sizes are tokens.
 *
 * The third rule — no shadow property anywhere — is gone. DESIGN.md banned
 * shadows outright and the current brief lifts that ban along with the ones on
 * glass, blur and gradients (Q-19). The lint no longer has an opinion about
 * them.
 *
 * It reads source, never the build output. Tailwind's preflight legitimately
 * resets box-shadow and its utility plumbing names it several times, so a grep
 * over dist/ always trips and tells you nothing about the code you wrote.
 *
 * Comments are stripped before linting, so prose explaining why something is
 * 15px does not fail the rule it is explaining.
 *
 * Two escape hatches, both deliberate and both narrow:
 *
 *   - A px value inside an `@media` condition is allowed if it is one of the
 *     three declared breakpoints. Media queries cannot take a var(), so this
 *     is a limitation of CSS rather than a lapse.
 *   - A line preceded by `lint-allow-px: <reason>` in a comment is allowed.
 *     The reason is required, so an exception has to be argued for in the
 *     file rather than added silently.
 */

/** The only breakpoints any media query may use. */
export const BREAKPOINTS = [640, 900, 1180] as const;

export interface Violation {
  file: string;
  line: number;
  rule: 'hex' | 'px';
  text: string;
  message: string;
}

/** Replace comment bodies with spaces, preserving line structure. */
function blankComments(source: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    if (source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? source.length : end + 2;
      for (let j = i; j < stop; j += 1) out += source[j] === '\n' ? '\n' : ' ';
      i = stop;
      continue;
    }
    if (source.startsWith('//', i)) {
      const end = source.indexOf('\n', i);
      const stop = end === -1 ? source.length : end;
      for (let j = i; j < stop; j += 1) out += ' ';
      i = stop;
      continue;
    }
    out += source[i];
    i += 1;
  }
  return out;
}

/**
 * Lines carrying an explicit, reasoned exemption.
 *
 * The directive exempts from the line after it to the end of the rule block it
 * sits in — an idiom like the visually-hidden clip rectangle needs three
 * declarations together, and requiring three identical directives would make
 * the escape hatch more annoying than the rule.
 *
 * The reason must start with a letter or digit. Requiring merely "not
 * whitespace" let an empty reason through, because the comment terminator
 * that immediately followed it satisfied the check.
 */
function allowedLines(source: string): Set<number> {
  const allowed = new Set<number>();
  const lines = source.split('\n');

  lines.forEach((line, index) => {
    if (!/lint-allow-px:\s*(?!\*\/)[A-Za-z0-9]/.test(line)) return;
    for (let next = index + 1; next < lines.length; next += 1) {
      allowed.add(next + 1);
      // Stop at the end of the block, so an exemption cannot leak down the file.
      if (/^\s*\}/.test(lines[next]!)) break;
    }
  });

  return allowed;
}

export interface LintTarget {
  /** Path, for the message. */
  file: string;
  source: string;
  /** tokens.css is where raw values are supposed to live. */
  isTokenFile?: boolean;
}

export function lintTokens(targets: readonly LintTarget[]): Violation[] {
  const violations: Violation[] = [];

  for (const { file, source, isTokenFile } of targets) {
    const allowed = allowedLines(source);
    const code = blankComments(source);

    code.split('\n').forEach((line, index) => {
      const number = index + 1;
      const text = line.trim();

      if (isTokenFile) return;

      if (/#[0-9a-fA-F]{3,8}\b/.test(line)) {
        violations.push({
          file,
          line: number,
          rule: 'hex',
          text,
          message:
            'Raw hex outside tokens.css. The palette is declared in one place; ' +
            'use the token.',
        });
      }

      for (const match of line.matchAll(/(-?\d*\.?\d+)px/g)) {
        const value = Number.parseFloat(match[1]!);

        // A breakpoint in a media query condition. CSS cannot use a var()
        // here, so the literal is unavoidable — but it has to be one of ours.
        if (/@media|@container/.test(line)) {
          if (!BREAKPOINTS.includes(value as (typeof BREAKPOINTS)[number])) {
            violations.push({
              file,
              line: number,
              rule: 'px',
              text,
              message:
                `${value}px is not one of the three declared breakpoints ` +
                `(${BREAKPOINTS.join(', ')}). Three, and no fourth.`,
            });
          }
          continue;
        }

        if (allowed.has(number)) continue;

        violations.push({
          file,
          line: number,
          rule: 'px',
          text,
          message:
            'Raw px outside tokens.css. Use a spacing, radius or size token. ' +
            'If this genuinely cannot be a token, put `lint-allow-px: <reason>` ' +
            'in a comment on the line above and say why.',
        });
      }
    });
  }

  return violations;
}

/** Render violations as something worth reading in a test failure. */
export function formatViolations(violations: readonly Violation[]): string {
  return violations
    .map((v) => `  ${v.file}:${v.line}  [${v.rule}]  ${v.text}\n      ${v.message}`)
    .join('\n\n');
}
