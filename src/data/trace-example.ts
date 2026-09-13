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
 * The shape was not chosen by eye. It was searched for.
 *
 * With the parameters in mastery.ts, all 210 ten-attempt sequences containing
 * four incorrect answers were enumerated and scored on two things: where the
 * final estimate lands, and how far the headline percentage moves when any
 * single attempt is flipped. This sequence has the lowest peak of any that
 * keeps the final estimate inside 0.40 to 0.80 while still moving the headline
 * on every possible click.
 *
 * It peaks at 97 per cent rather than 100, which is the point: a saturated
 * model is one where clicking does nothing, and an artefact that does not
 * respond is not an artefact. Every one of the ten attempts moves the headline
 * by at least 20 percentage points.
 *
 * The trajectory still swings wider than the 0.40 to 0.80 band the brief asks
 * for. That band is not reachable with these parameters — see Q-20.
 */

/** `true` means the attempt was answered correctly. */
export const EXAMPLE_ATTEMPTS: readonly boolean[] = [
  true,
  true,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
];

/**
 * The skill the sequence is about.
 *
 * "Fractions" is the placeholder docs/plan.md itself uses in the home page
 * sketch. It names nothing real and claims nothing about the lab's datasets.
 */
export const EXAMPLE_SKILL = 'fractions';
