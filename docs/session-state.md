# Session state

Continuity for autonomous sessions. Read this first, then `CLAUDE.md`,
`docs/plan.md`, `docs/phase.md`, `design/DESIGN.md`, `design/decisions.md`.

Branch: `auto/phase-1`. Never `main`.

Phase 0 is skipped by instruction: it is decisions only and none can be made
without Kaung. Every value in `design/DESIGN.md` is treated as authoritative
regardless of its `proposed` status. A proposed token is still a number to
build with.

Questions needing Kaung go to `docs/review-queue.md`, never here, and never
stop the run.

---

## IN PROGRESS

Nothing.

---

## QUEUE

- **T-07** Static SVG rendering of the trace, built at build time, zero
  client JS. The JS-off fallback, shipped in the HTML.
- **T-08** Attempt marks: filled circle correct, open stroked circle
  incorrect. Shape carries the distinction, colour does not.
- **T-09** Mastery curve path plus uncertainty band. Fill at 12%, 1px
  `--claim` strokes on upper and lower edges per D-013.
- **T-10** Toggle interaction: clicking an attempt flips it, estimate and
  curve update at `--dur-base` with `--ease-out`.
- **T-11** Keyboard operability: roving tabindex across attempts, Enter and
  Space toggle, visible `--ink` focus.
- **T-12** ARIA live region announcing the new estimate as a plain sentence
  after each toggle. Polite, not assertive.
- **T-13** Attribution view marking which past attempts carry the current
  estimate. Toggleable, keyboard reachable.
- **T-14** Reduced-motion path: finished curve instead of the draw, instant
  estimate update with a brief static highlight. Do not zero out a transform.
- **T-15** Visible label stating the data is synthetic.
- **T-16** Responsive pass at 390, 768, 1440. No horizontal scroll, widget
  usable at every width.
- **T-17** Verify the JS-off path by building and loading with scripting
  disabled. Record what was checked in NOTES.
- **T-18** Script recomputing every contrast pair in the DESIGN.md table,
  failing if a measured ratio differs from the stated one by more than 0.05.
- **T-19** Playwright screenshot harness, three widths, output to a
  gitignored directory.
- **T-20** Self-critique pass: walk the built page against the banned list in
  `CLAUDE.md`. Fix unambiguous violations, log judgement calls.
- **T-21** Typographic specimen page showing every text style in context at
  both scales.
- **T-22** Header, footer, body link, button and focus styles per DESIGN.md.
- **T-23** Reskin the widget onto tokens only. Grep component code for literal
  hex, px or duration values and remove them.
- **T-24** Token lint script failing the build on any raw hex, raw px outside
  tokens.css, or shadow property anywhere.
- **T-25** Run axe-core over every built page. Fix violations, log design
  judgements rather than guessing.

When this empties, refill from `docs/phase.md` — Phase 2 first, then Phase 4
polish. Never queue Phase 3; that is publications content and needs Kaung.

---

## BLOCKED

Carried forward from the Phase 0 runs. None of these blocks the queue above.
All are facts or judgements only Kaung can supply. Full text is in the git
history at `ec7ada9`.

- **B-1** Lab name in the header. Three spellings in the brief; also
  "Human-centered" vs "Human-centred".
- **B-2** Institutional affiliation, or confirmation there is none.
- **B-3** The mission paragraph. Not in the repo; cannot be cut to one line
  without it.
- **B-4** Authors and real paper/code URLs for all fourteen publications.
  The big one. Nothing renders a citation until this lands.
- **B-5** Full funder names, and whether grant numbers appear.
- **B-6** Accept or reject D-001 to D-013. The Phase 0 exit gate.
- **B-7** Accept or reject D-004, the trace widget as hero.

---

## DONE

- **T-01** — Astro 7 + TypeScript 6 + Tailwind v4 scaffold. Build and astro check both clean on an empty index.
- **T-02** — tokens.css carries every DESIGN.md colour, space, radius, duration and easing; Tailwind @theme exposes them and the built CSS contains only the six sanctioned colours.
- **T-03** — Literata self-hosted from two committed woff2 subsets carrying both wght and opsz; opsz is bound to each role's pixel size and flips with the scale at 900px. No runtime Google request.
- **T-04** — Base.astro shell plus layout.css: page max, measure, gutters, the 1180px annotation column, skip link, focus and link states, and a visible .todo primitive.
- **T-05** — src/lib/mastery.ts — BKT two-step update, pure TS, no deps. Per-step estimate, 95% normal-approximation band, next-attempt prediction, and a plain-sentence describe().
- **T-06** — 52 vitest cases over the five required sequences plus cross-sequence invariants, belief chaining, determinism and parameter validation. Verified non-vacuous by mutation.

---

## NOTES

Failed approaches and values that had to be chosen. Two lines each.

- **Toolchain:** node v25.6.0, npm 11.8.0.
- **Pre-approved deps:** astro, @astrojs/*, tailwindcss, typescript, vitest,
  @playwright/test, three, 3d-force-graph. Anything else gets logged to the
  review queue and routed around.
- T-05 band at n=1 spans almost the full range ([0.003, 1.000]). That is what one observation is worth, not a bug, but the widget should not be tuned to hide it.

