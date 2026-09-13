# Session state

Branch: `auto/site`. Never pushed.

This run builds the site to the aesthetic override in the brief, which
supersedes `CLAUDE.md` and `design/DESIGN.md` on every visual point. The
conflict is logged as Q-19 rather than halted on.

---

## IN PROGRESS

- **S-01** Token system: dark instrument field, glass surfaces, signal red.
  Replace the six-colour palette in tokens.css.
- **S-02** Type: Literata for prose, ui-sans-serif for labels and readouts.
- **S-03** Layout shell on the dark field: glass primitive, motion tokens,
  one-per-section scroll reveal, reduced-motion path.
- **S-04** Fix BKT saturation. init 0.25, transit 0.12, guess 0.20, slip 0.10,
  ten attempts with four incorrect, estimate held in 0.40-0.80, every click
  moving the headline by at least two points.
- **S-05** Artefact 1: restyle the trace onto the dark palette.
- **S-06** Artefact 2: Bayesian XAI static SVG baseline, Markov blanket
  highlighting, illustrative network over learning-analytics variables.
- **S-07** Artefact 2: `3d-force-graph` on click only, absent from the initial
  payload.
- **S-08** Artefact 3: computer vision saliency map following the cursor.
- **S-09** Artefact 4: NLP live tokeniser with attention lines between tokens.
- **S-10** Header, footer and navigation for the five pages.
- **S-11** `/` home: hero artefact on glass, four research areas, five recent
  publications, StatLab callout.
- **S-12** `/research`: four sections, one live artefact each.
- **S-13** `/people`: group photo, five 4:5 portraits, placeholder slots.
- **S-14** `/about`: mission, funding, contact.
- **S-15** `/learning`: StatLab.
- **S-16** Bring the existing test suite onto the new spec. The palette,
  contrast and token-lint suites all encode the old six-colour, no-shadow
  rules and will fail by design.
- **S-17** Accessibility floor: 4.5:1 against the glass composite, keyboard,
  visible focus, 360px.
- **S-18** Performance: Lighthouse mobile above 85 with the glass in place.
- **S-19** Final pass: screenshots at three widths, self-critique.

---

---

## QUEUE

## DONE

Nothing yet this run.

---

## NOTES

- The previous run (T-01 to T-55, on `main`) built the light-palette version.
  Its infrastructure survives: the BKT model, the geometry module, the
  contrast maths, the token lint, the browser harness on port 4331 with its
  dev-server guard. The visual layer is being replaced.
