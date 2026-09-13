/**
 * The site's pages.
 *
 * All five are built, so unlike the previous version there is no `built` flag
 * and nothing is withheld from the navigation.
 */
export interface NavItem {
  href: string;
  label: string;
}

export const NAVIGATION: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/research', label: 'Research' },
  { href: '/people', label: 'People' },
  { href: '/learning', label: 'Learning' },
  { href: '/about', label: 'About' },
];

/**
 * The lab name as it appears in the header.
 *
 * TODO: unconfirmed. "MINN HAI Lab", "MINN HAI (Human-centered AI) Lab" and
 * "HAI Lab" all appear in the brief, and whether it is "Human-centered" or
 * "Human-centred" is undecided. Kaung to confirm. Tracked as B-1.
 *
 * The shortest of the three is used so the placeholder does not assert an
 * expansion of the acronym that may turn out to be wrong.
 */
export const LAB_NAME = 'MINN HAI Lab';

/** The four research areas, in the order they appear on the home page. */
export interface ResearchArea {
  /** Anchor id on /research. */
  id: string;
  name: string;
  /** One line, plain, no adjectives. */
  line: string;
  /**
   * Whether the lab has published work in this area.
   *
   * Knowledge tracing and Bayesian explanation have publications in the
   * supplied list. Computer vision and NLP have none, so they are presented
   * as research directions rather than as programmes with output — saying
   * otherwise would imply papers that do not exist.
   */
  hasPublications: boolean;
}

export const RESEARCH_AREAS: readonly ResearchArea[] = [
  {
    id: 'knowledge-tracing',
    name: 'Knowledge tracing',
    line: 'Estimating what a learner knows from the answers they have given, and how that estimate should move with each new one.',
    hasPublications: true,
  },
  {
    id: 'bayesian-explanation',
    name: 'Bayesian explanation',
    line: 'Explaining a model over tabular data by the structure of its dependencies, using Bayesian networks and Markov blankets.',
    hasPublications: true,
  },
  {
    id: 'computer-vision',
    name: 'Computer vision',
    line: 'Where a model looks when it makes a decision about an image, and whether that is where a person would look.',
    hasPublications: false,
  },
  {
    id: 'language',
    name: 'Language',
    line: 'How attention connects the parts of a sentence, and what that structure does and does not explain.',
    hasPublications: false,
  },
];

/** The StatLab teaching resource. */
export const STATLAB = {
  href: 'https://minn-hai-lab.github.io/statLab/index.html',
  name: 'StatLab',
  description: 'An interactive introduction to probability and statistics.',
} as const;
