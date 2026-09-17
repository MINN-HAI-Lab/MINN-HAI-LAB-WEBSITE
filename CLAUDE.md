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

Do not restyle it, re-tokenise it, or improve it. When the design changes, the
canvas changes first and the page is re-transcribed from it. `design/DESIGN.md`
describes what the canvas specifies; `design/decisions.md` records why.

## Stack

Astro, static output, five pages sharing one layout: `src/layouts/Layout.astro`
holds the canvas's header (fixed, every page) and footer, `src/pages/index.astro`
is the reach through Signal Plane, and `research.astro`, `learning.astro`,
`members.astro` and `partner.astro` are the rest of direction 1d, split at the
boundaries in `docs/plan.md`. No component library, no CSS framework, no
design tokens — the canvas's inline styles are the styles. The 3D scene is
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
