/**
 * Artefact 4 — tokenisation and attention.
 *
 * Two halves again, and again it matters which is which.
 *
 * THE TOKENISATION IS REAL. It is a small rule-based subword tokeniser:
 * whitespace and punctuation splitting, then suffix stripping on long words.
 * It is not BPE and it is not anyone's published vocabulary, but what it does
 * it genuinely does, and the boundaries it produces are the boundaries it
 * says it produces.
 *
 * THE ATTENTION IS ILLUSTRATIVE. No trained model runs here. The weights come
 * from two surface signals — how far apart two tokens are, and whether they
 * share a stem — normalised with a softmax. That reproduces the *shape* real
 * attention tends to have (mostly local, with occasional long-range links
 * between related words) without pretending to be a model's actual weights.
 *
 * Saying "attention" about a distance kernel would be the kind of claim this
 * site exists not to make, so the artefact labels it illustrative on its face.
 */

export interface Token {
  /** The surface text. */
  text: string;
  /** Index in the sequence. */
  index: number;
  /** True when this piece continues the previous word rather than starting one. */
  continuation: boolean;
  kind: 'word' | 'suffix' | 'punctuation' | 'number';
}

/** Suffixes worth splitting off. Longest first, so "ation" wins over "ion". */
const SUFFIXES = ['ation', 'ingly', 'ments', 'ness', 'able', 'ible', 'ment', 'tion', 'ing', 'ers', 'est', 'ed', 'es', 'ly', 's'];

/** Words short enough that splitting them is noise rather than structure. */
const MIN_STEM = 4;

/**
 * Split a sentence into tokens.
 *
 * Deterministic, and the same function runs on every keystroke — so what is
 * drawn is always what this produced, never a cached approximation of it.
 */
export function tokenise(input: string): Token[] {
  const tokens: Token[] = [];
  // Words, numbers, and any single non-space character as punctuation.
  const pattern = /[A-Za-z]+(?:'[A-Za-z]+)?|\d+(?:\.\d+)?|[^\sA-Za-z\d]/g;

  for (const match of input.matchAll(pattern)) {
    const piece = match[0];

    if (/^\d/.test(piece)) {
      tokens.push({ text: piece, index: 0, continuation: false, kind: 'number' });
      continue;
    }

    if (!/^[A-Za-z]/.test(piece)) {
      tokens.push({ text: piece, index: 0, continuation: false, kind: 'punctuation' });
      continue;
    }

    const lower = piece.toLowerCase();
    const suffix = SUFFIXES.find(
      (candidate) => lower.endsWith(candidate) && lower.length - candidate.length >= MIN_STEM,
    );

    if (suffix) {
      const stem = piece.slice(0, piece.length - suffix.length);
      tokens.push({ text: stem, index: 0, continuation: false, kind: 'word' });
      tokens.push({
        text: piece.slice(piece.length - suffix.length),
        index: 0,
        continuation: true,
        kind: 'suffix',
      });
    } else {
      tokens.push({ text: piece, index: 0, continuation: false, kind: 'word' });
    }
  }

  return tokens.map((token, index) => ({ ...token, index }));
}

/** One attention link, from a token to another. */
export interface Link {
  from: number;
  to: number;
  /** Softmax weight in 0..1. */
  weight: number;
}

/** How much of a stem two tokens share, as a fraction of the shorter one. */
function stemOverlap(a: string, b: string): number {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  if (x.length < 3 || y.length < 3) return 0;
  let shared = 0;
  const limit = Math.min(x.length, y.length);
  while (shared < limit && x[shared] === y[shared]) shared += 1;
  return shared >= 3 ? shared / limit : 0;
}

/**
 * Illustrative attention weights.
 *
 * For each token, a distribution over the others built from:
 *
 *   - distance, decaying exponentially, because real attention is mostly local
 *   - stem overlap, because related words attract each other across a sentence
 *   - a small bonus for a suffix attending to the stem it came from, which is
 *     the one piece of genuine structure the tokeniser knows about
 *
 * Then a softmax per row, so each token's weights sum to one exactly as a real
 * attention head's would. The arithmetic is honest; the inputs are surface
 * features rather than learned ones, which is why the artefact says
 * illustrative rather than real.
 */
export function attention(tokens: readonly Token[], temperature = 0.6): Link[] {
  const links: Link[] = [];
  if (tokens.length < 2) return links;

  for (const from of tokens) {
    const scores: number[] = [];

    for (const to of tokens) {
      if (to.index === from.index) {
        scores.push(Number.NEGATIVE_INFINITY);
        continue;
      }
      const distance = Math.abs(from.index - to.index);
      let score = -distance * 0.55;
      score += stemOverlap(from.text, to.text) * 1.8;
      // A suffix belongs to the piece immediately before it. That is not a
      // guess — it is exactly what the tokeniser did a moment ago.
      if (from.continuation && to.index === from.index - 1) score += 2.4;
      if (to.continuation && from.index === to.index - 1) score += 2.4;
      scores.push(score);
    }

    const max = Math.max(...scores.filter(Number.isFinite));
    const exps = scores.map((s) => (Number.isFinite(s) ? Math.exp((s - max) / temperature) : 0));
    const total = exps.reduce((sum, value) => sum + value, 0) || 1;

    exps.forEach((value, index) => {
      const weight = value / total;
      // Below this a link is a hairline nobody can read and the drawing turns
      // into a grey wash. Dropping them is a rendering decision, so the
      // remaining weights are deliberately not renormalised — what is shown is
      // a true subset of the distribution rather than a rescaled one.
      if (weight > 0.06) links.push({ from: from.index, to: index, weight });
    });
  }

  return links;
}

/** The default sentence, chosen to show both local and long-range links. */
export const EXAMPLE_SENTENCE =
  'The model estimates what the learner knows from the answers they have given.';
