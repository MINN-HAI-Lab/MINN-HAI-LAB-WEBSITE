import { describe as suite, expect, it } from 'vitest';
import {
  DEFAULT_PARAMETERS,
  type BktParameters,
  describe,
  predict,
  trace,
  validateParameters,
} from './mastery.ts';

/** Repeat a single outcome n times. */
const run = (outcome: boolean, n: number): boolean[] => Array.from({ length: n }, () => outcome);

/** [true, false, true, ...] of length n. */
const alternate = (n: number): boolean[] => Array.from({ length: n }, (_, i) => i % 2 === 0);

suite('empty sequence', () => {
  it('produces no steps', () => {
    expect(trace([]).steps).toEqual([]);
  });

  it('leaves the estimate at the prior, because nothing has been observed', () => {
    const result = trace([]);
    expect(result.final).toBe(DEFAULT_PARAMETERS.prior);
    expect(result.initial).toBe(DEFAULT_PARAMETERS.prior);
  });

  it('describes itself without claiming an attempt happened', () => {
    const sentence = describe(trace([]), 'fractions');
    expect(sentence).toContain('No attempts yet');
    expect(sentence).toContain('25 per cent');
  });
});

suite('single attempt', () => {
  it('raises the estimate above the prior when correct', () => {
    const result = trace([true]);
    expect(result.steps).toHaveLength(1);
    expect(result.final).toBeGreaterThan(DEFAULT_PARAMETERS.prior);
  });

  it('lowers the estimate below the prior when incorrect', () => {
    const result = trace([false]);
    expect(result.steps).toHaveLength(1);
    expect(result.final).toBeLessThan(DEFAULT_PARAMETERS.prior);
  });

  it('enters the first step believing exactly the prior', () => {
    expect(trace([true]).steps[0]!.before).toBe(DEFAULT_PARAMETERS.prior);
  });

  it('uses the singular in the sentence', () => {
    expect(describe(trace([true]), 'fractions')).toContain('1 attempt,');
  });
});

suite('all correct', () => {
  const result = trace(run(true, 8));

  it('increases monotonically', () => {
    for (let i = 1; i < result.steps.length; i += 1) {
      expect(result.steps[i]!.estimate).toBeGreaterThan(result.steps[i - 1]!.estimate);
    }
  });

  it('approaches but never exceeds certainty', () => {
    expect(result.final).toBeGreaterThan(0.99);
    expect(result.final).toBeLessThanOrEqual(1);
  });

  it('narrows the uncertainty band at every step', () => {
    const widths = result.steps.map((step) => step.upper - step.lower);
    for (let i = 1; i < widths.length; i += 1) {
      expect(widths[i]!).toBeLessThan(widths[i - 1]!);
    }
  });
});

suite('all incorrect', () => {
  const result = trace(run(false, 8));

  it('decreases from the prior', () => {
    expect(result.final).toBeLessThan(DEFAULT_PARAMETERS.prior);
  });

  it('settles at a floor rather than decaying to zero, because learning continues', () => {
    // p(T) pulls belief up between attempts, so repeated failure converges on
    // an equilibrium above zero instead of collapsing. Guarding this stops a
    // future "simplification" from dropping the transition step.
    expect(result.final).toBeGreaterThan(0);
    const last = result.steps.at(-1)!;
    const secondLast = result.steps.at(-2)!;
    expect(Math.abs(last.estimate - secondLast.estimate)).toBeLessThan(0.001);
  });

  it('never predicts a correct answer below the guess rate', () => {
    for (const step of result.steps) {
      expect(step.predicted).toBeGreaterThanOrEqual(DEFAULT_PARAMETERS.guess);
    }
  });
});

suite('alternating', () => {
  const result = trace(alternate(8));

  it('moves up after a correct attempt and down after an incorrect one', () => {
    for (const step of result.steps) {
      if (step.correct) expect(step.estimate).toBeGreaterThan(step.before);
      else expect(step.estimate).toBeLessThan(step.before);
    }
  });

  it('stays strictly inside the unit interval', () => {
    for (const step of result.steps) {
      expect(step.estimate).toBeGreaterThan(0);
      expect(step.estimate).toBeLessThan(1);
    }
  });
});

suite('invariants across every sequence', () => {
  const sequences: Array<[string, boolean[]]> = [
    ['empty', []],
    ['single correct', [true]],
    ['single incorrect', [false]],
    ['all correct', run(true, 8)],
    ['all incorrect', run(false, 8)],
    ['alternating', alternate(8)],
    ['mixed', [true, true, false, true, false, false, true, true]],
  ];

  for (const [name, attempts] of sequences) {
    it(`keeps every value in [0, 1] and the band around the estimate — ${name}`, () => {
      const result = trace(attempts);
      for (const step of result.steps) {
        for (const value of [step.before, step.estimate, step.lower, step.upper, step.predicted]) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        }
        expect(step.lower).toBeLessThanOrEqual(step.estimate);
        expect(step.upper).toBeGreaterThanOrEqual(step.estimate);
      }
    });

    it(`chains belief from one step to the next — ${name}`, () => {
      const result = trace(attempts);
      result.steps.forEach((step, i) => {
        const expected = i === 0 ? result.initial : result.steps[i - 1]!.estimate;
        expect(step.before).toBe(expected);
        expect(step.index).toBe(i);
      });
    });

    it(`reports the last estimate as final — ${name}`, () => {
      const result = trace(attempts);
      expect(result.final).toBe(result.steps.at(-1)?.estimate ?? result.initial);
    });

    it(`is deterministic — ${name}`, () => {
      expect(trace(attempts)).toEqual(trace(attempts));
    });
  }
});

suite('parameter validation', () => {
  const valid = DEFAULT_PARAMETERS;

  it('accepts the defaults', () => {
    expect(() => validateParameters(valid)).not.toThrow();
  });

  it.each([
    ['prior', -0.1],
    ['learn', 1.5],
    ['guess', Number.NaN],
    ['slip', Number.POSITIVE_INFINITY],
  ] as Array<[keyof BktParameters, number]>)('rejects %s = %s', (name, value) => {
    expect(() => validateParameters({ ...valid, [name]: value })).toThrow(RangeError);
  });

  it('rejects guess + slip >= 1, where the update inverts', () => {
    // Past this point a correct answer is evidence against knowing the skill.
    // Refusing beats silently producing a backwards trace.
    expect(() => validateParameters({ ...valid, guess: 0.6, slip: 0.4 })).toThrow(/identifiable/);
    expect(() => trace([true], { ...valid, guess: 0.6, slip: 0.4 })).toThrow(RangeError);
  });
});

suite('custom parameters', () => {
  it('starts from the prior it is given', () => {
    const parameters: BktParameters = { prior: 0.8, learn: 0.1, guess: 0.15, slip: 0.05 };
    expect(trace([], parameters).final).toBe(0.8);
    expect(trace([true], parameters).steps[0]!.before).toBe(0.8);
  });

  it('moves faster with a higher learn rate', () => {
    const slow = trace(run(true, 4), { ...DEFAULT_PARAMETERS, learn: 0.05 });
    const fast = trace(run(true, 4), { ...DEFAULT_PARAMETERS, learn: 0.4 });
    expect(fast.final).toBeGreaterThan(slow.final);
  });

  it('predicts between the guess rate and one minus the slip rate', () => {
    const { guess, slip } = DEFAULT_PARAMETERS;
    for (const estimate of [0, 0.25, 0.5, 0.75, 1]) {
      const p = predict(estimate, DEFAULT_PARAMETERS);
      expect(p).toBeGreaterThanOrEqual(guess);
      expect(p).toBeLessThanOrEqual(1 - slip);
    }
  });
});
