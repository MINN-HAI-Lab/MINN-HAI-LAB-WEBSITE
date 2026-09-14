# Session state

Branch: `auto/site`. Never pushed.

This run builds the site to the aesthetic override in the brief, which
supersedes `CLAUDE.md` and `design/DESIGN.md` on every visual point. The
conflict is logged as Q-19 rather than halted on.

---

## IN PROGRESS

Nothing. The redesign is finished.

Final state: five pages, four live artefacts, 486 browser tests green across
Chromium, Firefox and WebKit, 160 unit tests, Lighthouse 100 for performance,
accessibility, best practices and SEO on every page with the glass in place.
Never pushed; `auto/site` exists only on this machine.

## QUEUE

Nothing. Everything in the design canvas is built, and the gaps it opened
(B-11 teaching assistant, B-12 hiring and how to apply) are on the pages.

What is left is content, not code: eight facts nobody on this side of the
repository has. Every one of them is a visible TODO on the page it belongs to,
with the B number, and `docs/review-queue.md` has the reasoning behind each
judgement call.

---

## DONE

- **R-1** — The UI rebuilt to the design canvas (D-027): the reach as the
  hero, live after load on wide pointer screens and a still everywhere else;
  the canvas's palette, both faces self-hosted, ruled rows and bands with the
  lab's own network drawn behind them, the tabs, the closing band.
- **R-2** — 492 browser tests green across Chromium, Firefox and WebKit.
  Lighthouse 99–100 on every page, both presets; CLS on the home page from
  0.25 to 0.
- **R-3** — Self-critique appended to docs/self-critique.md; Q-25 to Q-27
  record the conflicts with CLAUDE.md and the one new dev dependency.

- **S-19** — Final pass: five pages at three widths, read against the banned list and the brief's floor. `docs/self-critique.md`. Found four things no test did, including the same TODO printed thirty-seven times on /research.
- **S-13** — `/people`: full-bleed group frame, five 4:5 slots at one crop, two-up on a phone and five across on a desktop, no names in any of them and each saying what it is waiting for.
- **S-14** — `/about`: mission, affiliation, funding and contact, all four as visible gaps with the exact question and the B number attached.
- **S-15** — `/learning`: StatLab, built as a list of one so a second resource is an entry rather than a redesign.
- **S-17** — Accessibility floor: axe clean on all five pages and on the 3D view while it is open, Lighthouse accessibility 100 on all five, every artefact keyboard operable with a real focus ring, nothing overflowing at 360px. A new artefacts.spec.ts holds the brief's own requirements.
- **S-18** — Lighthouse mobile performance 100 on all five pages with the glass in place. FCP and LCP 1.5s, TBT 0ms, CLS 0. No glass layers had to be given up.
- **S-16** — Browser suite back on the new spec: 405 tests green across chromium, firefox and webkit. Found four real bugs doing it, including the webfont never loading.
- **S-07** — The 3D view: `3d-force-graph` behind a dynamic import from the click handler, 361KB gzipped in its own chunk, never requested until the button is pressed. Same NODES and EDGES as the diagram, blanket highlighting both ways, Escape closes, and the WebGL context is released on close.
- **S-10** — Header and footer across the five pages: current-page marking, footer navigation, and the contact gap in the one place the plan asks for it.
- **S-08** — Computer vision artefact, rebuilt on a real photograph: CC0, licence read from the Commons API, Sobel edge map computed in the browser from its pixels, veil plus viridis heat gated by a Gaussian at the cursor.
- **S-09** — Language artefact: a real rule-based subword tokeniser, live on every keystroke, with illustrative softmax attention drawn as cubic arcs measured from the rendered tokens.
- **S-12** — `/research`: four sections, one live artefact each, publications under the two areas that have them and a visible "none yet" under the two that do not.
- **S-01** — Dark instrument palette in tokens.css, contrast verified against the glass composite. Token lint drops the shadow rule; contrast suite rewritten for the new system.

---
- **S-02** — Type split: Literata for prose, sans for labels, readouts and navigation. Layout shell, glass primitive, scroll reveal, header and footer on the dark field.
- **S-04** — BKT learn rate 0.15 -> 0.12 and a searched demo sequence: peak 97% instead of 100%, final 79%, every click moving the headline at least 20 points.
- **S-05** — Trace restyled onto the dark field: --signal for the estimate and band, --text for attempts, glass panel, HTML axis ticks. Favicon and share card repainted.
- **S-06** — Bayesian network: deterministic force layout at build time, Markov blanket computed properly, static SVG interactive with a small script, HTML labels so they hold their size.
- **S-11** — Home page: full-bleed hero with the live trace on glass, four research areas as rows, five most recent publications with honest gaps, StatLab callout.

## NOTES

- The design canvas is the design authority now (D-027). Where it and
  CLAUDE.md disagree — Three.js in the hero on load, the lattice field —
  Q-25 records what was built and why. The canvas's copy that reads as the
  lab's own is on the page; the copy that reads as the design tool's (a
  teaching assistant, partners, hiring) is a visible TODO where the canvas
  put it.
- The hero scene loads after `load`, on idle, only on a wide pointer screen
  with a hardware GPU. Everyone else gets the still, which is rendered from
  the scene itself by `scripts/hero-poster.mjs`. The hero writes what it
  decided into `data-scene`, and islands.spec.ts reads it.
- Space Grotesk's variable was declared in astro.config and never rendered
  into the head: `<Font>` has to be called once per face. The first build of
  the redesign set every label in the system sans and the weight spec caught
  it by counting one font file where there should be two.

- The previous run (T-01 to T-55, on `main`) built the light-palette version.
  Its infrastructure survives: the BKT model, the geometry module, the
  contrast maths, the token lint, the browser harness on port 4331 with its
  dev-server guard. The visual layer is being replaced.
- The computer vision artefact's photograph is CC0: *Tabby cat with blue eyes*
  by AdinaVoicu, Pixabay via Wikimedia Commons,
  https://commons.wikimedia.org/wiki/File:Tabby_cat_with_blue_eyes-3336579.jpg,
  https://creativecommons.org/publicdomain/zero/1.0/. Licence read from the
  Commons API, not assumed. Attribution is not required by CC0; it is given
  anyway, under the artefact. Full record in Q-21.
- The weight budget is per page, not one number: /research legitimately ships
  three times the script the home page does, and a single budget either failed
  there or was slack enough on /people to catch nothing.
- The site rendered in Georgia for this entire branch. `--font-serif` named
  "Literata" literally, but Astro's <Font> declares the face under a hashed
  family and exposes it as `--font-literata`. No @font-face matched, so the
  committed, subset, hashed woff2 was never fetched once. Found by the font
  stability spec asking why zero font files were requested.
- The 3D view uses trackball controls, not orbit. OrbitControls threw
  "Cannot read properties of undefined (reading 'x')" out of its own pointer
  bookkeeping on every click on a node; trackball does not. The slow rotation
  is eleven lines in the label loop instead of `autoRotate`, and it stops on
  the first pointerdown or wheel, which is better behaviour anyway.
- `margin-inline: auto` on a flex item in a column makes it shrink to content
  rather than stretch. This has now caused two bugs: the trace plot drawing at
  324px in a 1116px panel, and the 3D canvas sizing itself from
  window.innerWidth and pushing a scrollbar onto the page at 360px. Both fixed
  by adding an explicit `width: 100%` next to the cap.
- Astro emits the saliency script inline rather than as its own chunk, so
  `grep` for a `<script src>` will not find it. It is there.
- Lighthouse, mobile preset, against the built site on the preview server:
  performance / accessibility / best practices / SEO all 100 on /, /research,
  /people, /learning and /about. Measured on localhost, so the network is
  free — what those numbers say is that nothing is render-blocking, nothing
  shifts, and no script blocks the main thread, not that a real connection is
  this fast.
- Contrast measured against the glass composite, not the field: --text 14.36-16.70:1, --text-muted 5.93-6.89:1, --signal 5.25-5.70:1. Tightest case is muted text on glass over --field-2 at 5.93:1 — first thing to fail if the surface alpha rises.

