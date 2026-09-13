/**
 * The site's four pages, from the information architecture in docs/plan.md.
 *
 * `built` is the honest bit. Three of these are Phase 3 work — publications
 * content, which needs facts nobody has supplied yet — and linking a header to
 * pages that 404 is worse than a header that admits what exists. The nav
 * renders what is built and the footer says what is coming, rather than
 * pretending either way.
 */
export interface NavItem {
  href: string;
  label: string;
  /** Whether the page exists yet. Unbuilt pages are never linked. */
  built: boolean;
}

export const NAVIGATION: readonly NavItem[] = [
  { href: '/', label: 'Home', built: true },
  { href: '/research', label: 'Research', built: false },
  { href: '/publications', label: 'Publications', built: false },
  { href: '/people', label: 'People', built: false },
];

/**
 * The lab name as it appears in the header.
 *
 * TODO: unconfirmed. "MINN HAI Lab", "MINN HAI (Human-centered AI) Lab" and
 * "HAI Lab" all appear in the brief, and whether it is "Human-centered" or
 * "Human-centred" is undecided. Kaung to confirm. Tracked as B-1.
 *
 * The shortest of the three is used so that the placeholder is not asserting
 * an expansion of the acronym that may be wrong.
 */
export const LAB_NAME = 'MINN HAI Lab';
