# Session state

Branch: `auto/site`. Never pushed.

This run builds the site to the aesthetic override in the brief, which
supersedes `CLAUDE.md` and `design/DESIGN.md` on every visual point. The
conflict is logged as Q-19 rather than halted on.

---

## IN PROGRESS

Nothing.

## QUEUE

- **S-07** Artefact 2: `3d-force-graph` on click only, absent from the initial
  payload.
- **S-10** Header, footer and navigation for the five pages.
- **S-13** `/people`: group photo, five 4:5 portraits, placeholder slots.
- **S-14** `/about`: mission, funding, contact.
- **S-15** `/learning`: StatLab.
- **S-16** Bring the remaining browser specs onto the new spec. palette.spec.ts
  still asserts the six light colours; screenshots and weight budgets assume
  the old payload.
- **S-17** Accessibility floor: keyboard, visible focus, 360px.
- **S-18** Performance: Lighthouse mobile above 85 with the glass in place.
- **S-19** Final pass: screenshots at three widths, self-critique.

---

## DONE

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
- Astro emits the saliency script inline rather than as its own chunk, so
  `grep` for a `<script src>` will not find it. It is there.
- Contrast measured against the glass composite, not the field: --text 14.36-16.70:1, --text-muted 5.93-6.89:1, --signal 5.25-5.70:1. Tightest case is muted text on glass over --field-2 at 5.93:1 — first thing to fail if the surface alpha rises.

