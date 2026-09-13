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
