# MINN HAI Lab — site

## What this is

The public site for the MINN HAI (Human-centered AI) Lab. Two research
programmes: AI for personalised learning (knowledge tracing) and interpretable
explanation of tabular models via Bayesian networks and Markov blankets.

Audience, in order: researchers who might cite or collaborate, prospective PhD
and master's students, and funding or programme committees.

## Design authority

**`MINN HAI LAB UI Design/` is the design.** It is a Claude Design canvas —
`MINN HAI LAB.dc.html` with `hands-scene.html` and `mh-bg.js` — and the site
is that canvas transcribed: direction 2a as the hero, direction 1d as the rest
of the site, in order, with the canvas's own markup, values and copy.

Do not restyle it or improve it. When the design changes, the canvas changes
first and the page is re-transcribed from it. `design/DESIGN.md` describes
what the canvas specifies; `design/decisions.md` records why.

One exception, deliberate: colour is re-tokenised (D-052). Every colour the
canvas drew as a literal value is a CSS custom property, light by default,
with dark — the canvas's own values, unchanged — as a secondary theme a
visitor opts into. The palette, hierarchy and every value are still the
canvas's; only how a page reaches a given value changed. Layout, copy,
spacing and every other property stay literal, transcribed exactly as
before.

Nothing is exempt from theming any more (D-053, D-054) — not even the
sections whose background is a live `mh-bg` canvas field, nor the hero's
3D scene, both of which D-052 first left the canvas's dark always. Both
draw with plain colour values in their own source rather than CSS, so
"re-tokenised" doesn't quite describe how they're themed — each is told
the active theme and picks its own light or dark colours at draw time,
by two different routes depending on where the drawing happens: the 3D
scene over `postMessage`, since it runs in an iframe with its own
document CSS custom properties can't reach; `mh-bg` by watching
`data-theme` directly, since it shares this document. See the note at
the top of `src/layouts/Layout.astro`, and the one at the top of
`public/design/mh-bg.js`, for exactly how.

## Stack

Astro, static output, five pages sharing one layout: `src/layouts/Layout.astro`
holds the canvas's header (fixed, every page) and footer, `src/pages/index.astro`
is the reach through Signal Plane, and `research.astro`, `learning.astro`,
`members.astro` and `partner.astro` are the rest of direction 1d, split at the
boundaries in `docs/plan.md`. No component library, no CSS framework — the
canvas's inline styles are the styles, with colour alone carried as CSS
custom properties for the theme (see "Design authority" above). The 3D scene is
`public/design/hands-scene.html` (Three.js from unpkg, pinned with integrity
hashes, as the canvas has it) in an iframe; the background fields are
`public/design/mh-bg.js`, a dependency-free custom element. Fonts are Literata
and Space Grotesk from Google Fonts, as the canvas loads them.

Old routes redirect to where their content lives now (`astro.config.mjs`).

## Content rules

The canvas's copy is on the page as written. Facts the canvas does not carry
— publication authors, DOIs, member names, portraits, funder names, the
contact address — stay as the canvas's own `TODO:` markers until supplied.
Do not invent a publication, author, venue, year, DOI, funder, affiliation,
member name, role or photograph to fill one.

Sentence case. No exclamation marks. No emoji.

## Process

1. Change the canvas, not the page.
2. Re-transcribe: the mapping from canvas to pages is documented at the top
   of `src/layouts/Layout.astro`, and at the top of each page.
3. `npm run verify` builds, serves and runs `tests/site.spec.ts`.
4. Screenshot at 1440 and 360 and look before saying it is done.
5. Append any decision to `design/decisions.md`.

Do not run `git commit` unless asked. Do not add dependencies without asking.
