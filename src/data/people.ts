/**
 * The lab's members.
 *
 * THERE ARE NO NAMES HERE AND THERE MUST NOT BE UNTIL KAUNG SUPPLIES THEM.
 *
 * The brief is explicit: five members, no names yet, five placeholder slots
 * with visible TODO markers and a neutral placeholder image at the right
 * aspect ratio. `docs/plan.md` is blunter still — "There is currently no name
 * on the site at all" — and lists people as a launch blocker.
 *
 * A plausible-looking name and role is the worst thing this file could hold.
 * It would not look wrong to a reader, which is exactly the problem: a fake
 * postdoc on an academic lab's site is a reputational failure, not a cosmetic
 * one. Five visible gaps are the correct output.
 *
 * To fill a slot: replace the nulls in that entry and nothing else. The page
 * renders a portrait and a caption the moment `name` stops being null, and
 * drops the TODO with it.
 */

export interface Person {
  /** Full name as they want it written. Null until supplied — never guessed. */
  name: string | null;
  /** Role: PI, postdoc, PhD student, and so on. Null until supplied. */
  role: string | null;
  /**
   * Path to their portrait under src/assets, once there is one.
   *
   * Photographs are listed in the plan as "missing, does not block launch", so
   * a slot with a name and no photograph is a perfectly good state and renders
   * the same neutral field the empty slots do.
   */
  photo: string | null;
  /** A personal or institutional page. Null until supplied — never guessed. */
  href: string | null;
  /** What this particular slot is waiting on, shown on the page. */
  todo: string;
}

/**
 * Five slots, because the brief says five members.
 *
 * The roles are not filled in even speculatively. "PI" on the first slot would
 * be a reasonable guess and still a guess, and the plan asks for the PI "with
 * role and a link" as a thing to be supplied rather than inferred.
 */
export const PEOPLE: readonly Person[] = [
  {
    name: null,
    role: null,
    photo: null,
    href: null,
    todo: 'Member 1 — name, role and a link. The plan asks for the principal investigator at minimum. Kaung to supply. Tracked as B-5.',
  },
  {
    name: null,
    role: null,
    photo: null,
    href: null,
    todo: 'Member 2 — name, role and a link, if they consent to appearing. Kaung to supply. Tracked as B-5.',
  },
  {
    name: null,
    role: null,
    photo: null,
    href: null,
    todo: 'Member 3 — name, role and a link, if they consent to appearing. Kaung to supply. Tracked as B-5.',
  },
  {
    name: null,
    role: null,
    photo: null,
    href: null,
    todo: 'Member 4 — name, role and a link, if they consent to appearing. Kaung to supply. Tracked as B-5.',
  },
  {
    name: null,
    role: null,
    photo: null,
    href: null,
    todo: 'Member 5 — name, role and a link, if they consent to appearing. Kaung to supply. Tracked as B-5.',
  },
];

/** How many slots are still empty. Rendered on the page rather than hidden. */
export function unnamedCount(): number {
  return PEOPLE.filter((person) => person.name === null).length;
}
