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
