import type { APIRoute } from 'astro';
import { EXAMPLE_ATTEMPTS } from '../data/trace-example.ts';
import { trace } from '../lib/mastery.ts';
import { token } from '../lib/tokens.ts';
import { VIEW, layout } from '../lib/trace-geometry.ts';
import { LAB_NAME } from '../data/navigation.ts';
import tokens from '../styles/tokens.css?raw';

/**
 * The share image.
 *
 * Drawn from the same geometry module and the same synthetic sequence as the
 * page itself, so the picture someone sees in a link preview is the picture
 * they land on. Not a separate illustration that could drift.
 *
 * Two things about it are unfinished and both are recorded in Q-14.
 *
 * It is SVG. Most crawlers want PNG or JPEG for og:image, which means
 * rasterising at build time, which means a headless browser in the build. Not
 * worth wiring up while the image cannot be referenced at all.
 *
 * And nothing references it yet. og:image has to be an absolute URL and there
 * is no domain (Q-13).
 */
export const prerender = true;

/** 1200x630 is what the Open Graph crawlers expect. */
const WIDTH = 1200;
const HEIGHT = 630;

export const GET: APIRoute = () => {
  const paper = token(tokens, 'color-paper');
  const paperSunk = token(tokens, 'color-paper-sunk');
  const ink = token(tokens, 'color-ink');
  const inkMuted = token(tokens, 'color-ink-muted');
  const claim = token(tokens, 'color-claim');
  const curveWidth = Number.parseFloat(token(tokens, 'curve-width'));
  const markSize = Number.parseFloat(token(tokens, 'mark-size'));

  const result = trace(EXAMPLE_ATTEMPTS);
  const geometry = layout(result);

  /* The drawing keeps its own coordinate space and is placed into the card,
     rather than being redrawn at card scale. Same geometry, same proportions,
     no second implementation to keep in step. */
  const scale = 1.3;
  const drawnWidth = VIEW.width * scale;
  const drawnHeight = VIEW.height * scale;
  const offsetX = (WIDTH - drawnWidth) / 2;
  const offsetY = HEIGHT - drawnHeight - 70;

  const marks = geometry.marks
    .map(
      (mark) =>
        `<circle cx="${mark.x}" cy="${mark.y}" r="${markSize / 2}" ` +
        `fill="${mark.correct ? ink : paperSunk}" stroke="${ink}" ` +
        `stroke-width="${curveWidth}"/>`,
    )
    .join('\n      ');

  /* Literata is not embedded, so this falls back to whatever serif the
     renderer has. Embedding the subset would add ~110KB of base64 to an image
     that cannot be referenced yet; it is worth doing when the domain lands and
     the file is rasterised. */
  const serif = 'Literata, Georgia, serif';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${paper}"/>

  <text x="70" y="110" font-family="${serif}" font-size="52" fill="${ink}">${LAB_NAME}</text>
  <text x="70" y="162" font-family="${serif}" font-size="26" fill="${inkMuted}">A learner's attempts, and the model's estimate of what they know.</text>

  <g transform="translate(${offsetX} ${offsetY}) scale(${scale})">
    <rect x="0" y="0" width="${VIEW.width}" height="${VIEW.height}" fill="${paperSunk}"/>
    <path d="${geometry.bandPath}" fill="${claim}" fill-opacity="0.12"/>
    <path d="${geometry.bandUpperPath}" fill="none" stroke="${claim}" stroke-width="1"/>
    <path d="${geometry.bandLowerPath}" fill="none" stroke="${claim}" stroke-width="1"/>
    <path d="${geometry.curvePath}" fill="none" stroke="${claim}" stroke-width="${curveWidth}"
          stroke-linecap="round" stroke-linejoin="round"/>
      ${marks}
    <text x="${VIEW.width - VIEW.padX}" y="${VIEW.height - 8}" text-anchor="end"
          font-family="${serif}" font-size="15" fill="${inkMuted}">Synthetic data</text>
  </g>
</svg>
`;

  return new Response(svg, {
    headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=3600' },
  });
};
