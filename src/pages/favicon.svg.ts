import type { APIRoute } from 'astro';
import { token } from '../lib/tokens.ts';
import tokens from '../styles/tokens.css?raw';

/**
 * The favicon.
 *
 * DESIGN.md: "Wordmark. None yet. The header is set type until there is one."
 * So this is not a mark, and inventing one would be a design decision nobody
 * asked for and nobody could review.
 *
 * What it is instead is the site's own display idea at its smallest: a rising
 * mastery estimate. One --signal stroke on --field, which is exactly what the
 * hero draws. --signal is the right colour and the only defensible one here,
 * because the line *is* the model's estimate, which is what that token means.
 *
 * It deliberately does not use a letter. Which letter would depend on the lab
 * name, and that is still unconfirmed (B-1): "MINN HAI Lab", "MINN HAI
 * (Human-centered AI) Lab" and "HAI Lab" do not all start with the same one.
 *
 * Generated from the tokens rather than checked in as a file, so a change to
 * --claim or --curve-width moves it with everything else.
 */
export const prerender = true;

export const GET: APIRoute = () => {
  const field = token(tokens, 'color-field');
  const signal = token(tokens, 'color-signal');
  // SVG geometry attributes take a number, not a CSS length.
  const curveWidth = Number.parseFloat(token(tokens, 'curve-width'));

  /* A 16-unit square, so --curve-width maps one to one at the 16px a browser
     asks for most often. At 32 units the same stroke rendered a hairline and
     the mark read as a smudge.

     The curve rises left to right and flattens as it approaches the top,
     which is the shape BKT actually produces: it approaches certainty without
     arriving. Straight segments, like the real trace — no smoothing that
     would imply readings between attempts. */
  const path = 'M2 12.5 L5.5 11 L9 6 L12.5 3.5 L14 3';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="${field}"/>
  <path d="${path}" fill="none" stroke="${signal}" stroke-width="${curveWidth}"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
