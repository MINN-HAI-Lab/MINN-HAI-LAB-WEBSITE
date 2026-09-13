# Review queue

Questions for Kaung raised by autonomous sessions. Nothing here stopped the
run; each item was routed around and the reasoning recorded.

Append only. Answered items can be struck through or deleted.

---

## Q-1 — `@tailwindcss/vite` is not literally on the pre-approved list

**Raised:** T-01, 2026-09-13. **Routed around:** used it.

Tailwind v4 integrates with Astro through `@tailwindcss/vite`, not through
`@astrojs/tailwind` (which is the v3 path and deprecated). `tailwindcss` is
pre-approved and `@astrojs/*` is pre-approved, but this package is neither
string exactly.

Treated as part of `tailwindcss` rather than a new dependency, since it is the
first-party adapter for an approved package and there is no other way to run
Tailwind v4 on Astro.

> Confirm that reading, or say which alternative you want.

---

## Q-2 — Installed majors are newer than expected

**Raised:** T-01, 2026-09-13. **Routed around:** pinned by `package-lock.json`.

`npm install` resolved astro 7.3.2, tailwindcss 4.3.3, typescript 7.0.2,
vitest 4.1.11. Astro 7 and TypeScript 7 are both majors past what the planning
docs assumed.

TypeScript was then pinned back to ^6.0.3, because `@astrojs/check@0.9.10`
peers `typescript@^5 || ^6` and refuses to resolve against 7. 6.0.3 is stable,
not a prerelease. With that pin, `astro check` reports 0 errors and the build
passes.

> Any objection to astro 7 and typescript 6? The TS pin is forced by the
> checker, so moving to 7 means giving up `astro check` until it catches up.

---

## Q-3 — No fallback face is specified for Literata

**Raised:** T-02, 2026-09-13. **Routed around:** generic `serif`.

DESIGN.md specifies "Literata, one family" and gives a full stack for
monospace, but names no fallback for Literata itself. A fallback matters: it is
what renders before the webfont arrives and if it fails.

`--font-serif: Literata, serif` was used. Naming a specific face — Georgia,
Charter, whatever — would be inventing a value, which DESIGN.md forbids.

> Do you want a named fallback stack? Georgia is the usual choice and is
> metrically closest to Literata of the faces likely to be installed.

**Update, T-03.** Partly answered by the tooling rather than by a decision.
Astro's `optimizedFallbacks` generated a metric-matched fallback of its own:
`local("Times New Roman")` with `size-adjust: 118.4%` and ascent/descent
overrides, so the reflow when Literata lands is small. The stack is now
`Literata, "Literata fallback: Times New Roman", serif`.

That is better than a bare `serif`, but Times New Roman is a face nobody chose
and it does not resemble Literata. Georgia would be closer. Say the word and
it becomes a one-line `fallbacks: ['Georgia', 'serif']`.

---

## Q-4 — Tailwind was scanning `.agents/skills` and emitting foreign colours

**Raised:** T-02, 2026-09-13. **Routed around:** pinned the source to `src/`.

Tailwind v4 auto-detects content from the project root. `.agents/skills` is
tracked rather than gitignored, so 612K of third-party skill markdown was
being scanned and every Tailwind class in their code examples became a real
utility — including `dark:bg-white/10`, which put `#ffffff1a` in the built CSS.
A white that is not one of the six, and a dark-mode rule that D-009 excludes
from v1.

Fixed with `@import "tailwindcss" source(none)` plus an explicit
`@source "../"` limiting scanning to `src/`.

> Worth knowing this is a standing hazard: anything added to the repo outside
> `src/` is invisible to Tailwind now, which is correct, but if a template ever
> lives elsewhere it has to be added to `@source` explicitly.

---

## Q-5 — The Literata files are checked in, not fetched at build time

**Raised:** T-03, 2026-09-13. **Routed around:** committed two woff2 files.

DESIGN.md picks Literata for its optical size axis and says ignoring that axis
"wastes the choice". Getting the axis turned out to need the font files in the
repo.

Astro's font pipeline would normally download and subset at build time, which
is tidier. But `fontProviders.google()` in Astro 7 is declared as `function
google()` with no parameters — it constructs the unifont provider and drops any
config passed to it. unifont *does* support extra axes, through
`experimental.variableAxis`, and there is no way to reach it through Astro.

With wght only, Google serves 32K + 38K. With `opsz,wght@7..72,400..500` it
serves 84K + 69K. Same family, different files, and the extra 83K is the axis.
Building through Astro's google provider silently produced the wght-only
files, which look fine and quietly discard the reason the face was chosen.

So `src/assets/fonts/literata-{latin,latin-ext}.woff2` are committed and loaded
through `fontProviders.local()`. Astro still fingerprints, preloads and
generates the metric-matched fallback.

> Two consequences. Updating Literata is now a manual re-download rather than a
> lockfile bump. And the repo carries 153K of binary. Both seem cheaper than
> losing the axis, but it is your call.

---

## Q-6 — Verification scripts live as tests, because the plan has no `scripts/`

**Raised:** T-18, 2026-09-13. **Routed around:** written as vitest suites.

The repository layout in `docs/plan.md` lists `docs/`, `design/`, `src/`,
`public/` and `prototypes/`, and `CLAUDE.md` says not to create files outside
it. A `scripts/` directory would be the conventional home for build-time
checks like the contrast verifier, and it is not in that list.

So the contrast check is `src/lib/contrast.test.ts`, running under the existing
vitest suite, with `npm run check:contrast` as a direct entry point. This turns
out to be better than a standalone script anyway: it runs on every `npm test`
rather than only when someone remembers, and the pure part is reusable.

The same reasoning will apply to the token lint in T-24.

> If you would rather have a real `scripts/` directory, say so and I will move
> them and add it to the layout in `docs/plan.md` — which I am not editing on
> my own.

---

## Q-7 — The page has two left edges

**Raised:** T-20, 2026-09-13. **Routed around:** left as built.

Page content (the h1, the TODO blocks) starts at the page gutter. The trace
panel is full-bleed per DESIGN.md, and its contents — the drawing, the key, the
instructions, the button — are centred inside it, so they start about 200px
further right at 1440. Two different left edges on one screen.

Both halves follow DESIGN.md, which is why this is a judgement call rather
than a fix. § Layout says "content is left-aligned and sits in a single
measured column"; § Trace widget says the panel "runs full-bleed
horizontally". Centring the drawing inside a full-bleed panel satisfies the
second and quietly breaks the first.

> Should the trace panel's contents align to the same left edge as the body
> column, with the panel's fill and rules still running full width? That would
> give one left edge and keep the full-bleed panel. I have not changed it
> because the alternative reading is defensible and it is your page.

---

## Q-8 — 192px of nothing above the trace

**Raised:** T-20, 2026-09-13. **Routed around:** left as built.

`--space-20` between major sections at 900px and up is exactly what DESIGN.md
specifies, and at 1440 it reads as a void because the section above it is
currently two TODO blocks. It will likely look right once the hero carries the
real lab name and mission sentence, which is the whole point of the space.

Flagging it only so it is a decision rather than an oversight. Worth looking
at again once B-1 and B-3 are answered.

---

## Q-9 — DESIGN.md contradicts itself about the 15px floor

**Raised:** T-26, 2026-09-13. **Routed around:** followed the scale.

Two statements in `design/DESIGN.md` cannot both hold below 900px.

§ Colour, on contrast: "`--ink-muted` passes comfortably on both surfaces but
should still not go below 15px."

§ Type, the below-900px scale: Small is **14px**.

`--ink-muted` is specified for "metadata: venue, year, authors, captions",
which is exactly the Small role. So on a phone, every piece of metadata on the
site renders at 14px in `--ink-muted` — one pixel under the floor the same
file sets.

Measured on the built page: at 390px the trace key, the synthetic label, the
instructions, the axis labels and the caption are all 14px in `--ink-muted`.
At 1440px they are 15px and the floor holds.

I followed the type scale rather than the contrast note, because the scale is
a table of explicit values and the note reads as a caution. But that is a
guess about which of the two you meant.

> Three ways out, and this is your call. Raise the below-900px Small to 15px.
> Or keep 14px and drop the floor to 14, since `--ink-muted` at 6.02:1 on
> `--paper` is comfortably above the 4.5:1 requirement and the floor is a
> legibility preference rather than a WCAG one. Or keep both and say that
> `--ink-muted` is not used at Small below 900px, which would mean metadata
> goes to `--ink` on phones.

---

## Q-10 — The header name and the home page h1 are the same words

**Raised:** T-22, 2026-09-13. **Routed around:** left as built, resolves with B-3.

The header reads "MINN HAI Lab" and the home page h1 immediately below it reads
"MINN HAI Lab" again.

This is a symptom of the missing hero copy rather than a layout decision. The
home page sketch in `docs/plan.md` puts the lab name in the header and a
different line in the hero:

```
│  MINN HAI Lab                          research  ... │
│  Human-centered AI                                   │
│  One sentence, plain, no adjectives.                 │
```

So the h1 is meant to be a positioning line, not the name. Since that line is
unknown (B-3, and its spelling depends on B-1), the h1 currently falls back to
the only accurate thing available, which happens to be the name.

> No action needed from you beyond B-1 and B-3. Noting it so the duplication
> reads as a consequence of the gap rather than as something nobody noticed.

---

## Q-11 — axe-core is not on the pre-approved dependency list

**Raised:** T-25, 2026-09-13. **Routed around:** installed it.

The standing rule is that astro, `@astrojs/*`, tailwindcss, typescript,
vitest, `@playwright/test`, three and 3d-force-graph are pre-approved and
anything else gets logged and routed around. T-25 says "Run axe-core over
every built page."

I read the task naming the tool as approving the tool — the alternative,
hand-rolling the subset of WCAG rules axe already implements, would be worse
in every way and would not be "axe-core" in any case.

Only `axe-core` itself is installed, injected into the page by the existing
Playwright harness. `@axe-core/playwright` would have been the conventional
wrapper and is a second package for very little.

> If the allowlist was meant to be absolute, say so and I will take it out;
> the accessibility checks written by hand in the harness cover a fraction of
> it but they do cover the parts this site actually depends on.

---

## Q-12 — I wrote one sentence describing the lab's research

**Raised:** T-27, 2026-09-13. **Routed around:** used it, flagged here.

The home page needs a meta description. What is in it now:

> Research on knowledge tracing for personalised learning, and on interpreting
> tabular models with Bayesian networks and Markov blankets.

Every term is taken from `CLAUDE.md`'s own framing — "Two research programmes:
AI for personalised learning (knowledge tracing) and interpretable explanation
of tabular models via Bayesian networks and Markov blankets." Nothing is
invented and there is no adjective in it.

But `CLAUDE.md` also says not to reword the lab's research descriptions and to
propose edits rather than make them. A meta description is not marketing copy,
and it does have to say something, so I wrote one — while noting that I did.

> Approve it, or give me the sentence you want. It appears in search results
> and in link previews, so it is worth being your words rather than mine.

---

## Q-13 — No domain, so no absolute URLs anywhere

**Raised:** T-27, 2026-09-13. **Routed around:** relative metadata only.

Canonical URLs, Open Graph URLs and a sitemap all need an origin. The domain
is open question 10 in `design/decisions.md`, and D-008 ties the hosting
decision to it.

Baking a placeholder domain into production metadata is exactly the kind of
plausible-looking fabrication that is hardest to spot later, so there is none:
the pages carry title, description and robots, and nothing absolute. Relative
metadata is correct at whatever origin the site eventually gets.

> This blocks the sitemap (T-30) and the absolute half of the Open Graph tags
> (T-29) outright. The moment there is a domain, both are a one-line config
> change.
