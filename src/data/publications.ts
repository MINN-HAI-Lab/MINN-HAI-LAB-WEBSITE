/**
 * The publication list.
 *
 * EVERY ENTRY HERE CAME FROM THE TABLES IN docs/plan.md. Nothing was added,
 * completed, corrected or inferred. Short name, venue, year and whether code
 * exists are the four things that list supplies, and they are the four fields
 * that carry values.
 *
 * `authors` and the two links are `null` on every entry, deliberately. The
 * supplied list has no authors and no URLs, and a plausible-looking author
 * list or DOI is the single worst thing this site could ship — it would not
 * look wrong to a reader, which is exactly the problem. The rendered list
 * shows a visible gap instead. Tracked as B-4.
 *
 * To fill them: edit this file and nothing else. The pages read from here.
 */

export type Programme = 'personalised-learning' | 'interpretability';

export interface Publication {
  /** The short name as it appears in the supplied list. */
  shortName: string;
  venue: string;
  year: number;
  programme: Programme;
  /** Whether the supplied list marks this entry as having public code. */
  hasCode: boolean;
  /**
   * Author list in citation order. Null until supplied — never guessed.
   */
  authors: string | null;
  /** Paper URL. Null until supplied — never guessed. */
  paperUrl: string | null;
  /** Code URL. Null until supplied, even where `hasCode` is true. */
  codeUrl: string | null;
  /** Anything the supplied list flags as needing confirmation. */
  note?: string;
}

export const PUBLICATIONS: readonly Publication[] = [
  // -- Personalised learning ------------------------------------------------
  { shortName: 'EIKT', venue: 'AIED', year: 2025, programme: 'personalised-learning', hasCode: false, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'IKT', venue: 'AAAI', year: 2022, programme: 'personalised-learning', hasCode: true, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'BKT-LSTM', venue: 'arXiv', year: 2021, programme: 'personalised-learning', hasCode: true, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'DSCMN', venue: 'PAKDD', year: 2019, programme: 'personalised-learning', hasCode: true, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'DKT-DSC', venue: 'ICDM', year: 2018, programme: 'personalised-learning', hasCode: true, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'KT', venue: 'ICDM', year: 2018, programme: 'personalised-learning', hasCode: false, authors: null, paperUrl: null, codeUrl: null },
  {
    shortName: 'Privacy-Preserving Synthetic Data Generation',
    venue: 'EC-TEL',
    year: 2018,
    programme: 'personalised-learning',
    hasCode: false,
    authors: null,
    paperUrl: null,
    codeUrl: null,
    note: 'Filed under personalised learning in the supplied list. It may sit better on its own or under interpretability; unconfirmed.',
  },
  {
    shortName: 'Q-matrix Refinement',
    venue: 'EC-TEL',
    year: 2016,
    programme: 'personalised-learning',
    hasCode: false,
    authors: null,
    paperUrl: null,
    codeUrl: null,
    note: 'The supplied list writes "Q-matrix Reinment", read here as Refinement. Unconfirmed.',
  },
  { shortName: 'University library recommender system', venue: 'e-Learning', year: 2013, programme: 'personalised-learning', hasCode: false, authors: null, paperUrl: null, codeUrl: null },

  // -- Interpretability -----------------------------------------------------
  { shortName: 'LAPLACE', venue: 'arXiv', year: 2023, programme: 'interpretability', hasCode: true, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'FSBN & SSBN', venue: 'ICDM CXAI', year: 2023, programme: 'interpretability', hasCode: false, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'GBNC', venue: 'DSAA', year: 2014, programme: 'interpretability', hasCode: false, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'GMBNC', venue: 'MLDM', year: 2014, programme: 'interpretability', hasCode: false, authors: null, paperUrl: null, codeUrl: null },
  { shortName: 'MBNC', venue: 'Computer Science and Application', year: 2014, programme: 'interpretability', hasCode: false, authors: null, paperUrl: null, codeUrl: null },
];

/**
 * Most recent first.
 *
 * Ties are broken by the order of the supplied list rather than by anything
 * invented, so two 2023 papers keep the order they were given in.
 */
export function mostRecent(count: number): Publication[] {
  return [...PUBLICATIONS]
    .map((publication, index) => ({ publication, index }))
    .sort((a, b) => b.publication.year - a.publication.year || a.index - b.index)
    .slice(0, count)
    .map((entry) => entry.publication);
}

/** How many entries are still missing their authors or links. */
export function incompleteCount(): number {
  return PUBLICATIONS.filter((p) => p.authors === null || p.paperUrl === null).length;
}
