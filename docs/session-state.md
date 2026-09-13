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

- **T-15** Visible label stating the data is synthetic.

---

## QUEUE

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
- **T-07** — Trace.astro renders the full trace as build-time SVG with zero client JS: band, band edges, curve, ten marks, axis, alt text, caption and synthetic-data label.
- **T-08** — Marks verified: both states stroke --ink, correct fills, incorrect stays open. Added a key so the shapes are decodable, drawn from --mark-size by the same CSS.
- **T-09** — Curve and band verified against D-013: 12% fill, 1px --claim edge strokes, 2px --claim curve. 20 geometry tests added; fixed a color-mix fallback that would have painted the band solid.
- **T-10** — Click a mark to flip it; estimate, curve and band animate at --dur-base with --ease-out via rAF interpolation. 2.2KB gzipped, progressive enhancement over the static SVG.
- **T-11** — Roving tabindex across the ten marks, arrows plus Home and End to move, Enter and Space to toggle, visible --ink focus ring. Ten attempts cost one Tab stop.
- **T-12** — Polite role=status live region, empty at load, populated after each toggle with the attempt that changed plus the new estimate. Debounced by the animation duration.
- **T-13** — Attribution view: single-flip counterfactual influence per attempt, top three ringed in --claim with a dimming second cue, toggled by a real button with aria-pressed, announced in the live region.
- **T-14** — Load-time curve draw over --dur-slow, skipped entirely under reduced motion so the finished curve stands. Estimate updates become instant plus a static stroke-width highlight; all three CSS transitions get transition:none.

---

## NOTES

Failed approaches and values that had to be chosen. Two lines each.

- **Toolchain:** node v25.6.0, npm 11.8.0.
- **Pre-approved deps:** astro, @astrojs/*, tailwindcss, typescript, vitest,
  @playwright/test, three, 3d-force-graph. Anything else gets logged to the
  review queue and routed around.
- T-05 band at n=1 spans almost the full range ([0.003, 1.000]). That is what one observation is worth, not a bug, but the widget should not be tuned to hide it.
- T-07 found describe() rounding 0.9964 to '100 per cent'. BKT never reaches certainty, so that is an overclaim on the page. Added formatPercent(), clamped to 1..99 unless truly 0 or 1.
- T-08 nearly shipped 'Filled — answered correctly', which is the WORD — fragment spaced-em-dash label on the CLAUDE.md banned list. Key now uses full sentences. Worth watching for in any label-shaped copy.
- T-09: the auto-generated color-mix fallback was full-opacity --claim, i.e. a solid block over the curve. Base value is now #b4133f1f (12.2%, nearest 8-bit alpha to 12%) with color-mix restoring the --claim link under @supports.
- T-10 animates by interpolating path coordinates in rAF rather than transitioning the CSS d property: d is not reliably animatable in Firefox, and DESIGN.md says the movement IS the information. It also makes T-14's reduced-motion path exact rather than a zeroed duration.
- T-10 verified at the logic level only (89 unit tests). The click path itself needs a real browser; that check belongs to T-19.
- T-11 found that svg role='img' hides its own children from assistive tech, which would have buried ten controls inside one image node. The script now swaps the SVG to role='group' and moves the description to a visually-hidden paragraph.
- npm run check occasionally hangs past 120s. Re-running it alone completes in seconds. Not diagnosed; if it recurs, run it with a longer timeout rather than assuming a failure.
- T-24 must lint SOURCE css, not built output: Tailwind's base layer legitimately mentions box-shadow (reset plus utility plumbing), so a built-CSS grep for 'shadow' always trips.
- T-14: the load draw sets stroke-dashoffset from JS only, so JS-off gets the finished curve. There may be a brief flash of the complete curve before the module runs; T-19 should look for it.

