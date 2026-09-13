# Session state

**RUN HALTED — 2026-09-13.** T-01 to T-54 complete. Nothing left that does not
need Kaung.

## Where the site is

Phase 2 is complete and its exit gate is met: the specimen page contains no
value that is not in DESIGN.md, because every number on it is parsed from
tokens.css at build time, and the widget is reskinned onto tokens with a lint
that fails the build on a raw hex, a raw px or any shadow.

Phase 4 is complete apart from "remove every remaining TODO:", which is
blocked on B-1 to B-5 and B-9. Metadata, favicon, Open Graph, 404, the
responsive pass, the keyboard pass, the contrast audit and the heading audit
are all done and enforced.

Phase 3 was never queued: it is publications and people content and it needs
you present. Phase 5 needs a domain (B-8).

`npm run verify` is green: no type errors, 147 unit tests, 264 browser specs
across Chromium, Firefox and WebKit. A first visit is 94.4KB, of which 83.8KB
is Literata. Layout shift is zero. The build is byte-reproducible.

## What needs you, in order of how much it blocks

1. **B-4, publication authors and URLs.** Fourteen entries with titles and
   venues only. Nothing renders a citation until this lands, and it is the one
   thing on this site that must not be guessed.
2. **Q-18, pick a prototype.** Three treatments of the trace are in
   `prototypes/`. `CLAUDE.md` asks for this choice before the layout is built;
   this run built first and produced them afterwards, which is recorded as
   Q-17. The hero is the whole design argument and it is currently the first
   thing I thought of.
3. **B-1 and B-3, the lab name and the mission sentence.** Both render as
   visible TODO markers on the home page today.
4. **B-8, the domain.** One answer releases the sitemap, canonical URLs, and
   og:image with the share image that is already built and unreferenced.
5. **B-6, accept or reject D-001 to D-022.** The Phase 0 gate. Twenty-two
   entries, all still proposed.

`docs/review-queue.md` holds eighteen questions with the reasoning behind each.
Q-17 is the one I would read first: it is an honest account of where this run
departed from the process in `CLAUDE.md`, including the part that does not
reflect well.

## What I got wrong, and how it was caught

Recorded because the pattern matters more than the individual bugs.

- Tap targets rendered at 12px on a phone. The markup looked right; only
  measuring in a browser showed it.
- A stray `---` rendered on every page for eleven commits. axe, the keyboard
  suite, the palette check and the heading audit all passed it. Only opening a
  screenshot caught it.
- D-020 claimed Firefox cannot animate the SVG `d` property. It is WebKit. The
  claim was plausible, asserted rather than measured, and the suite was
  Chromium-only until T-51.
- The Playwright config forced reduced motion globally, so the load animation
  never ran in a single test and the captures were not the page most readers
  see.
- A test comment quoting `dark:bg-white/10` re-created that utility in the
  shipped CSS, because Tailwind was scanning TypeScript.

Four of those five were found by looking at the rendered page or measuring it,
not by reading code. The tests that now exist were mostly written after the bug
they would have caught.

---

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

- **T-55** `npm run verify` silently tests whatever is listening on port 4321.
  A dev server was running there and the whole browser suite ran against it —
  30 failures caused by Vite's client and the Astro dev toolbar, not by the
  site. Worse than the noise: if those tests had happened to pass, verify
  would have reported green while testing a build nobody shipped. Give the
  harness its own port and make it refuse to run against a dev server.

Once T-55 is done the queue is empty again, and not because the work is done —
because everything left needs Kaung. Refill from `docs/phase.md` as B-1 to B-9
land. Never queue Phase 3 without him.

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
- **B-6** Accept or reject every entry in `design/decisions.md`. Twenty-three
  now, D-001 to D-022 plus the superseded D-005. None is accepted. This is the
  Phase 0 exit gate and it has not moved since the first run.
- **B-7** Accept or reject D-004, the trace widget as hero.
- **B-9** The contact email address. `docs/plan.md` lists it as supplied but
  it is not in the repo, and the footer is the one place the site promises it.
  Visible as a TODO on every page until it lands.
- **B-8** The domain. Open question 10 in `design/decisions.md`, with D-008
  tying hosting to it. It now blocks three finished-but-inert things: the
  sitemap (configured and verified, emits nothing without `site`), canonical
  URLs, and `og:image` plus the PNG rasterisation of `/share.svg`. One answer
  releases all of them. See Q-13 and Q-14.

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
- **T-25** — axe-core over both built pages plus the attribution state and the script-free rendering: zero WCAG 2.2 A/AA violations. Detection verified by mutation.
- **T-27** — Per-page title and description, noindex on the specimen. No canonical or absolute URL anywhere, because the domain is undecided and a placeholder would be a fabrication.
- **T-28** — Favicon generated from the tokens as a rising --claim curve on --paper: the site's display idea at its smallest, no invented mark, no letter that would depend on the unconfirmed lab name.
- **T-29** — Open Graph and Twitter tags that work without an origin, plus /share.svg generated from the real trace geometry. og:image and og:url stay out until there is a domain.
- **T-30** — Sitemap integration configured and verified with a temporary domain: emits correctly and excludes the noindex specimen. Inert until `site` is set; the domain is now B-8.
- **T-31** — 404 page on the same layout, linking only pages that exist and naming the planned ones as unlinked rather than sending readers to another 404. Added to the axe sweep.
- **T-32** — Motion verified in a real browser in both modes: the curve draws and cleans up its dash state, toggling interpolates, and under reduced motion nothing draws, the update is instant with a static highlight, and zero transitions remain active.
- **T-33** — Keyboard pass over all three pages: skip link first and actually moving focus to main, a non-default focus ring at every stop, no focus trap, and the widget still costing one tab stop.
- **T-34** — Heading structure checked on all three pages: exactly one h1 each, h1 first, no skipped level, no empty heading. Failures print the outline rather than a count.
- **T-35** — Island rules enforced: only the home page ships script, the payload stays well under the 100KB click-to-load threshold, and the static trace is verified to be real geometry rather than a placeholder.
- **T-36** — Palette enforced in the CSS the browser downloads: only the six DESIGN.md colours, and no prefers-color-scheme rule. Caught a live regression where a test comment re-created the dark-mode utility.
- **T-37** — npm run verify runs the type check, unit tests, token lint, contrast check, a production build and the browser suite, and propagates a failure's exit code past the preview-server cleanup. Handbook checklist rewritten around it.
- **T-38** — TODO audit: every visible marker must name what is missing, who supplies it and a tracker. Prints the inventory on every run. Found the footer's contact TODO had no tracker; recorded as B-9.
- **T-39** — Reviewed the 768, attribution, focus and no-JS captures. Found and fixed a stray '---' rendering on every page since T-27, and added a document-integrity test that catches it.
- **T-40** — Internal URLs now go through withBase(), so a subpath deploy works. Verified by building with a base: all six pick up the prefix, including the three Astro would have left alone.
- **T-41** — Layout shift measured on all three pages: zero, verified against a probe that catches a forced 0.22 reflow. The font swap and the curve draw both move nothing.
- **T-42** — Annotation column rendered on the specimen and covered at both breakpoints. Rendering it exposed two defects: no paragraph rhythm inside it, and no measure cap below 1180 where the grid stops enforcing one.
- **T-43** — Dropped the font preload: it forced both subsets down for 152.8KB where the browser needs one at 83.8KB. Layout shift stays at zero. Covered by a test that fails if a second font is fetched.
- **T-44** — Appended D-014 to D-021 as proposed: the favicon, TODO markers as content, target sizing in rendered pixels, the attribution measure, text outside the drawing, navigation showing only what exists, JS interpolation over CSS transitions, and no font preload.
- **T-45** — First visit measured at 94.4KB, 83.8KB of it Literata and 10.6KB the site's own. Recorded in the handbook with a 120KB total and 25KB own-code budget enforced by verify.
- **T-46** — The upgrade now runs guarded, and a failure reverts to the static rendering: roles, tabindex, cursor, controls and dash state all restored. Tested with an injected mid-upgrade throw.
- **T-47** — Dead-CSS check over every class selector in the stylesheets. Nothing is currently dead; verified by planting one, which fails with the class and its file named.
- **T-48** — Specimen renamed to Design specimen, since it now covers layout primitives as well as type. Logged Q-16 about the trace being cramped at phone widths.
- **T-49** — Process audit logged as Q-17: step 2 (three prototypes, let me pick) was skipped entirely — every layout here was one-shot. Steps 3 and 4 were followed late.
- **T-50** — Clean rebuild from a wiped dist, .astro and screenshots: verify exits 0, three pages build, 147 unit tests and 80 browser specs pass, five TODO markers all well-formed, and the pages read correctly at 1440 and 390.
- **T-51** — Suite now runs in Chromium, Firefox and WebKit: 243 specs pass. Found D-020's premise was backwards and corrected it as D-022; fixed three keyboard tests that encoded Chromium-only assumptions.
- **T-52** — Font-failure path covered in all three engines: with every woff2 aborted, text still renders at the token sizes, nothing overflows, and the trace still draws and still toggles.
- **T-53** — Three prototypes of the trace built from the real model and tokens — separated rows as built, marks on the curve, and stepped belief — with an honest comparison in Q-18 for Kaung to pick from.
- **T-54** — Two clean builds produce byte-identical output. Recorded in the handbook with the command to re-check; not automated, since it means building twice every run.

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
- T-25: auditing a JS-off page needs the site's scripts stripped at the network layer, not javaScriptEnabled:false (axe needs scripting) and not setContent (relative stylesheet URLs do not resolve, so nothing is styled and axe reports phantom target-size failures against unstyled links).
- T-32 found the Playwright config was passing --force-prefers-reduced-motion globally for 'deterministic screenshots'. Every spec since T-19 ran in reduced motion, the load animation never executed once, and the captures were not the page most people see. Motion is now on by default and specs opt into reduce.
- T-33: a skip link needs tabindex=-1 on its target. Without it the browser scrolls and updates the sequential focus starting point but leaves activeElement on the body, so the next Tab returns to the header and the link skips nothing. Verified by reverting: activeElement id came back empty.
- T-36: Tailwind's @source glob must exclude .ts. Scanning all of src/ meant a test file that quoted dark:bg-white/10 in a comment about that very bug re-created it in the shipped CSS. Only files that emit markup should be scanned.
- T-39: a duplicated Astro frontmatter fence emits everything after the first one as content, landing between the doctype and <html>, which the browser hoists into the body. Shipped on every page for eleven commits. axe, keyboard, palette and heading tests all passed it because it is valid HTML that merely shows junk. Only a screenshot caught it.
- T-43: preloading a unicode-range-split font defeats the split. Astro inlines @font-face into the head, so there is no stylesheet round trip for preload to save, and it forced both subsets down. Removing it halved the font payload with no change to layout shift.
- Reading an exit code after a pipe reports the LAST command in the pipeline, not the first. 'npm run verify | tail' always looks like it exited 0. Redirect to a file and check the status, or use PIPESTATUS.
- T-51: D-020 claimed Firefox cannot transition the SVG d property. Measured, it is the opposite — Chromium and Firefox both can, WebKit cannot. The decision survives because Safari is the one that matters, but the premise was asserted, not tested, and a Chromium-only suite could never have caught it.
- T-53: prototypes/ is gitignored per docs/plan.md, so the three prototypes, their README and their generator live on disk only. If the working copy is lost they go with it; 'node --experimental-strip-types prototypes/generate.mjs' rebuilds them from the real model and tokens.

