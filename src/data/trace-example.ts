/**
 * The synthetic sequence the trace widget opens with.
 *
 * SYNTHETIC. Invented for illustration, not drawn from any learner, dataset or
 * study. docs/plan.md is explicit: "It runs on synthetic data illustrating the
 * method. Label it as such, visibly. Do not present it as output from a
 * trained model on real student data."
 *
 * The widget carries that label on the page (T-15). This comment is the same
 * statement at the source, so nobody downstream mistakes the array for a
 * recording of something.
 *
 * The shape was chosen to be legible rather than realistic: two early failures
 * so the estimate starts low, a middle stretch where it wobbles, then a run of
 * successes so the curve visibly climbs and the uncertainty band visibly
 * narrows. Ten attempts, within the eight-to-twelve that docs/phase.md asks
 * for.
 */

/** `true` means the attempt was answered correctly. */
export const EXAMPLE_ATTEMPTS: readonly boolean[] = [
  false,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  true,
  true,
];

/**
 * The skill the sequence is about.
 *
 * "Fractions" is the placeholder docs/plan.md itself uses in the home page
 * sketch. It names nothing real and claims nothing about the lab's datasets.
 */
export const EXAMPLE_SKILL = 'fractions';
