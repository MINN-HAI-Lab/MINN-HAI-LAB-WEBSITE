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
- **T-15** — Synthetic-data label now sits inside the SVG at --ink-muted, so a screenshot or export carries it, with the fuller statement kept in the caption.
- **T-16** — Verified at 360, 390, 768, 900, 1180 and 1440: no horizontal scroll anywhere. Fixed tap targets that scaled to 12px on a phone; they are now >=24px at every width.
- **T-17** — JS-off path verified in chromium with scripting disabled: 24 checks, all passing. Interactive path smoke-tested too.
- **T-18** — Contrast checker parses the DESIGN.md table and tokens.css, recomputes all six ratios and fails past 0.05 drift. Also asserts the 4.5 and 3.0 floors those ratios exist to protect. Verified by mutation.
- **T-19** — Playwright harness at 390, 768 and 1440 capturing full page, trace, attribution view and focus ring, plus a JS-off capture. 13 specs, output to gitignored screenshots/.
- **T-20** — Banned-list walk over the rendered 1440 and 390 captures. Two violations fixed: SVG text falling to ~6px against the 15px floor, and monospace used for a file path in prose. Three judgement calls logged, one defect queued as T-26.
- **T-21** — src/pages/specimen.astro plus type.css defining the five roles. Every number is parsed from tokens.css at build time; both scales render server-side, so the page is complete with JS off.
- **T-26** — Type scale applied at element level for h1-h6; home h1 opts up to Display. Verified computed sizes at both scales: 56/18/15 above 900px, 34/17/14 below, with component overrides intact.
- **T-22** — Header with set type and built-pages-only nav, footer carrying the contact TODO, plus link, button and focus states verified against DESIGN.md § States.
- **T-23** — Widget geometry now derives from tokens: mark, ring and swatch radii parsed from --mark-size, --curve-width and --space-1; plot width from the viewBox constant; the script's last duration literal removed. Verified by mutation.
- **T-24** — Token lint over source stylesheets: raw hex, raw px and any shadow property. Wired to prebuild so it fails the build; verified by mutation that all three rules trip and the exit code is 1.

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
- T-16 measured, did not assume: circular hit areas scaled to 12px at 360px because the SVG scales. Hit targets are now full-slot rects, 24px at 360 and 27px at 390. @playwright/test plus chromium installed here; T-19 owns the committed harness.
- T-17 JS-off verification, 24 checks in headless chromium with javaScriptEnabled:false. Rendered and visible: curve path, uncertainty band, all ten marks, the in-SVG 'Synthetic data' stamp, the caption's full synthetic paragraph, and the estimate sentence. No 'requires JavaScript' placeholder anywhere. Inert as intended: svg keeps role=img with alt text, zero tabindex attributes, zero role=button, attribution control and keyboard instructions both still hidden, cursor on a mark is auto rather than pointer. The same 24 checks re-run with JS on confirm the upgrade: svg becomes role=group, ten marks focusable, controls revealed, cursor pointer.
- T-17 also smoke-tested the interactive path that T-10/T-11/T-13 could only unit-test. Click flips a mark, curve d changes, live region announces. Keyboard: Tab reaches the marks in one stop (skip-link, mark 0, button), arrows move focus with the roving tabindex following (0-1-1... to -10-1...), Home and End jump, Enter and Space both toggle, focus ring computes to solid 2px rgb(28,40,48) = --ink. Space does not scroll, verified against a control where Space on the body scrolls 428px. Attribution ring lands on marks 7,8,9.
- Two false alarms while testing keyboard, both test-sequencing errors rather than bugs: pressing arrows after focus had already tabbed past the widget onto the button, and reading scrollY after focus() had itself scrolled the mark into view. Re-check the harness before believing a keyboard failure.
- T-19: astro preview in Astro 7 always daemonises, so Playwright's webServer block reports 'Process from config.webServer exited early'. Server lifecycle lives in the shots npm script instead. Also added vitest.config.ts restricting vitest to src/**/*.test.ts, or it would try to run the .spec.ts Playwright files itself.
- T-20 looked at the rendered screenshots rather than reasoning from markup, which is the only reason the 6px SVG text was caught. Text inside a scaled viewBox does not obey a px floor; anything that must stay legible belongs in HTML positioned over the drawing.
- T-21: reading a source file from Astro frontmatter needs Vite's ?raw import, not fs. By prerender the module is bundled, so import.meta.url resolves into dist/.prerender and a relative path throws ENOENT.
- T-26: only h1-h6 need element rules. Tailwind preflight resets headings to font-size:inherit but leaves p and li alone, so both already inherit --size-body from body. An li rule would outrank .trace__key's inherited Small and silently enlarge the widget key.
- T-22 caught a T-20 regression: the axis-label gutter narrowed the SVG and tap targets fell from 24px to 22px at 360, with nothing failing. Narrow-width padding trimmed, and the 24px floor is now asserted in the browser harness across four widths rather than only in unit arithmetic.
- T-24: a docblock explaining that '*/' slipped through the reason check contained '*/' and closed the comment, so half the module parsed as code. oxc reported it as a missing semicolon 78 lines later. If a TS parse error points somewhere that looks fine, check for a comment terminator upstream.

