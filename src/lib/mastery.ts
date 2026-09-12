/**
 * Bayesian Knowledge Tracing, for the trace widget.
 *
 * Pure TypeScript, no dependencies, no I/O. Attempts in, per-step estimates
 * and uncertainty intervals out. The same module runs at build time to emit
 * the static SVG fallback and in the browser to answer a toggle, so the two
 * can never disagree.
 *
 * WHAT THIS IS NOT
 *
 * The parameters below are not fitted to anything. They are chosen so the
 * widget is legible — so a run of correct answers visibly moves the estimate
 * and a slip visibly dents it. Nothing here is a measurement, a benchmark, or
 * a result, and no number it produces should ever be presented as one. The
 * widget labels its data synthetic for exactly this reason.
 *
 * THE MODEL
 *
 * BKT models one skill as a hidden binary state: the learner either knows it
 * or does not. Four parameters govern it.
 *
 *   prior  p(L0)  probability the skill is known before any attempt
 *   learn  p(T)   probability of moving not-known -> known between attempts
 *   guess  p(G)   probability of answering correctly while not knowing
 *   slip   p(S)   probability of answering incorrectly while knowing
 *
 * Each attempt does two things. First the observation updates belief by Bayes'
 * rule; then the learning transition is applied, because the learner may have
 * picked the skill up in the interim.
 *
 * TODO: if this module is ever described in prose on the site, the standard
 * BKT reference belongs with it. Deliberately not cited here — an unverified
 * citation is worse than none, and CLAUDE.md is explicit about that. Kaung to
 * supply the reference he wants used.
 */

/** The four BKT parameters. All are probabilities in [0, 1]. */
export interface BktParameters {
  /** p(L0) — probability the skill is known before any attempt. */
  prior: number;
  /** p(T) — probability of acquiring the skill between attempts. */
  learn: number;
  /** p(G) — probability of a correct answer without the skill. */
  guess: number;
  /** p(S) — probability of an incorrect answer despite the skill. */
  slip: number;
}

/** One attempt and everything the model concluded from it. */
export interface TraceStep {
  /** Zero-based position in the sequence. */
  index: number;
  /** Whether this attempt was answered correctly. */
  correct: boolean;
  /** p(knows) entering this attempt, before the observation. */
  before: number;
  /** p(knows) after the observation and the learning transition. */
  estimate: number;
  /** Lower bound of the uncertainty interval on `estimate`. */
  lower: number;
  /** Upper bound of the uncertainty interval on `estimate`. */
  upper: number;
  /** p(next attempt correct), given `estimate`. */
  predicted: number;
}

/** The full result of running a sequence through the model. */
export interface TraceResult {
  steps: TraceStep[];
  /** p(knows) before any attempt. Equal to `parameters.prior`. */
  initial: number;
  /** p(knows) after the last attempt, or `initial` for an empty sequence. */
  final: number;
  parameters: BktParameters;
}

/**
 * Illustrative parameters. Not fitted, not measured, not a citation.
 *
 * guess is set as though a five-way choice, slip low but not negligible, and
 * learn brisk enough that a short sequence shows movement. A real deployment
 * would fit these per skill from real response data.
 */
export const DEFAULT_PARAMETERS: BktParameters = {
  prior: 0.25,
  learn: 0.15,
  guess: 0.2,
  slip: 0.1,
};

/**
 * Standard normal quantile for a two-sided 95% interval. A constant of the
 * normal distribution, not a tuning knob.
 */
const Z_95 = 1.959963984540054;

/** Clamp to the unit interval. Guards against float drift at the extremes. */
function unit(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Reject parameters the model cannot be run with.
 *
 * The guess + slip < 1 condition is the identifiability constraint: past it,
 * a correct answer is evidence *against* knowing the skill and the model runs
 * backwards. Better to refuse than to silently produce an inverted trace.
 */
export function validateParameters(parameters: BktParameters): void {
  const entries = Object.entries(parameters) as Array<[keyof BktParameters, number]>;
  for (const [name, value] of entries) {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new RangeError(`BKT parameter "${name}" must be a probability in [0, 1], got ${value}`);
    }
  }
  if (parameters.guess + parameters.slip >= 1) {
    throw new RangeError(
      `BKT requires guess + slip < 1 for the update to be identifiable, got ${
        parameters.guess + parameters.slip
      }`,
    );
  }
}

/**
 * Posterior p(knows) after observing one attempt, before the learning
 * transition.
 *
 * Correct:   p(1 - slip) / [ p(1 - slip) + (1 - p) guess ]
 * Incorrect: p * slip    / [ p * slip    + (1 - p)(1 - guess) ]
 */
function observe(before: number, correct: boolean, parameters: BktParameters): number {
  const { guess, slip } = parameters;
  const knows = correct ? before * (1 - slip) : before * slip;
  const doesNot = correct ? (1 - before) * guess : (1 - before) * (1 - guess);
  const total = knows + doesNot;
  // Unreachable while guess + slip < 1 and before is in [0, 1], but a zero
  // denominator would poison every later step, so fall through rather than
  // return NaN.
  if (total === 0) return before;
  return knows / total;
}

/** Apply the learning transition: p + (1 - p) * learn. */
function transition(posterior: number, parameters: BktParameters): number {
  return posterior + (1 - posterior) * parameters.learn;
}

/** p(next attempt correct) given current belief. */
export function predict(estimate: number, parameters: BktParameters): number {
  return unit(estimate * (1 - parameters.slip) + (1 - estimate) * parameters.guess);
}

/**
 * Uncertainty interval on the estimate.
 *
 * The latent state is Bernoulli, so its spread at belief p is sqrt(p(1 - p)) —
 * widest at p = 0.5, where the model is least committed, and vanishing as
 * belief approaches either end. That spread is divided by sqrt(n + 1) so the
 * band narrows as attempts accumulate.
 *
 * This is a normal approximation for legibility, not a credible interval
 * derived from a posterior over the parameters. It is honest about shape —
 * wide when the model is unsure, tightening with evidence — and it is drawn
 * from synthetic data. It is not a confidence claim about a real learner.
 */
function interval(estimate: number, observations: number): { lower: number; upper: number } {
  const spread = Math.sqrt((estimate * (1 - estimate)) / (observations + 1));
  const margin = Z_95 * spread;
  return { lower: unit(estimate - margin), upper: unit(estimate + margin) };
}

/**
 * Run a sequence of attempts through the model.
 *
 * `attempts[i] === true` means attempt i was answered correctly. An empty
 * sequence is valid and yields no steps, with `final` equal to the prior —
 * the model has been told nothing, so it still believes what it started with.
 */
export function trace(
  attempts: readonly boolean[],
  parameters: BktParameters = DEFAULT_PARAMETERS,
): TraceResult {
  validateParameters(parameters);

  const steps: TraceStep[] = [];
  let belief = unit(parameters.prior);

  for (let index = 0; index < attempts.length; index += 1) {
    const correct = attempts[index] === true;
    const before = belief;
    const posterior = observe(before, correct, parameters);
    const estimate = unit(transition(posterior, parameters));
    const { lower, upper } = interval(estimate, index + 1);

    steps.push({
      index,
      correct,
      before,
      estimate,
      lower,
      upper,
      predicted: predict(estimate, parameters),
    });

    belief = estimate;
  }

  return {
    steps,
    initial: unit(parameters.prior),
    final: belief,
    parameters,
  };
}

/**
 * The current estimate as a plain sentence, for the live region and the
 * caption under the widget.
 *
 * Deliberately not a bare number: "0.61" announced on its own tells a screen
 * reader user nothing about what moved or what it refers to.
 */
export function describe(result: TraceResult, skill: string): string {
  const percent = Math.round(result.final * 100);
  const count = result.steps.length;
  if (count === 0) {
    return `No attempts yet. The model starts from an estimate of ${percent} per cent on ${skill}.`;
  }
  const correct = result.steps.filter((step) => step.correct).length;
  const attemptWord = count === 1 ? 'attempt' : 'attempts';
  return `After ${count} ${attemptWord}, ${correct} of them correct, the model estimates ${percent} per cent on ${skill}.`;
}
