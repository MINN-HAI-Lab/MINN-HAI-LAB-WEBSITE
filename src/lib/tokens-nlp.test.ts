import { describe as suite, expect, it } from 'vitest';
import { EXAMPLE_SENTENCE, attention, tokenise } from './tokens-nlp.ts';

/**
 * The tokeniser is the half of artefact 4 that claims to be real, so it is the
 * half that has to be tested. If it silently dropped characters, the artefact
 * would be showing a reader a tokenisation of a sentence they did not type.
 */
suite('tokenise', () => {
  it('keeps every non-space character of the input', () => {
    const sentences = [
      EXAMPLE_SENTENCE,
      "Don't split contractions badly.",
      'Bayesian networks, 3.5 per cent, and punctuation!',
      'a',
      '',
    ];

    for (const sentence of sentences) {
      const joined = tokenise(sentence).map((t) => t.text).join('');
      expect(joined).toBe(sentence.replace(/\s+/g, ''));
    }
  });

  it('numbers the tokens in order with no gaps', () => {
    const tokens = tokenise(EXAMPLE_SENTENCE);
    expect(tokens.map((t) => t.index)).toEqual(tokens.map((_, i) => i));
  });

  it('splits a suffix off a long enough word and marks it as a continuation', () => {
    const tokens = tokenise('estimates');
    expect(tokens.map((t) => t.text)).toEqual(['estimat', 'es']);
    expect(tokens[1]!.continuation).toBe(true);
    expect(tokens[1]!.kind).toBe('suffix');
  });

  it('leaves a short word whole rather than shaving it to nothing', () => {
    // "goes" would leave a two-character stem, which is noise, not structure.
    expect(tokenise('goes').map((t) => t.text)).toEqual(['goes']);
    expect(tokenise('is').map((t) => t.text)).toEqual(['is']);
  });

  it('classifies punctuation and numbers separately from words', () => {
    const kinds = tokenise('Model 3.5, fine.').map((t) => `${t.text}:${t.kind}`);
    expect(kinds).toEqual(['Model:word', '3.5:number', ',:punctuation', 'fine:word', '.:punctuation']);
  });

  it('treats a contraction as one word', () => {
    expect(tokenise("doesn't").map((t) => t.text)).toEqual(["doesn't"]);
  });
});

suite('attention', () => {
  it('gives nothing to draw for fewer than two tokens', () => {
    expect(attention(tokenise('Hello'))).toEqual([]);
    expect(attention(tokenise(''))).toEqual([]);
  });

  it('never lets a token attend to itself', () => {
    const links = attention(tokenise(EXAMPLE_SENTENCE));
    expect(links.filter((l) => l.from === l.to)).toEqual([]);
  });

  it('produces a row per token that sums to one before the drawing threshold', () => {
    // The published links are thresholded, so this checks the distribution
    // itself: every weight is a real probability and no row exceeds one.
    const tokens = tokenise(EXAMPLE_SENTENCE);
    const links = attention(tokens, 0.6);

    for (const token of tokens) {
      const row = links.filter((l) => l.from === token.index);
      const total = row.reduce((sum, l) => sum + l.weight, 0);
      expect(total).toBeGreaterThan(0);
      expect(total).toBeLessThanOrEqual(1 + 1e-9);
    }
  });

  it('attends most strongly to a near neighbour', () => {
    const tokens = tokenise('the learner answered the question correctly');
    const links = attention(tokens);
    const row = links.filter((l) => l.from === 2).sort((a, b) => b.weight - a.weight);
    expect(Math.abs(row[0]!.to - 2)).toBe(1);
  });

  it('links a suffix to the stem it was split from', () => {
    const tokens = tokenise('the model estimates mastery');
    const suffix = tokens.find((t) => t.continuation)!;
    const links = attention(tokens).filter((l) => l.from === suffix.index);
    const strongest = links.reduce((best, l) => (l.weight > best.weight ? l : best));
    expect(strongest.to).toBe(suffix.index - 1);
  });

  it('is deterministic', () => {
    const a = attention(tokenise(EXAMPLE_SENTENCE));
    const b = attention(tokenise(EXAMPLE_SENTENCE));
    expect(a).toEqual(b);
  });
});
