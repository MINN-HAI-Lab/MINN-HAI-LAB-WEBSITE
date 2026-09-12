# Session state

**RUN HALTED — 2026-09-13, after amendments 2.**

B-9 through B-12 are resolved and moved to DONE. What remains is B-1 to B-7,
which is the same wall as before: facts and judgements only Kaung can supply.

Halt conditions, unchanged:

1. **Everything left is BLOCKED.** B-1 to B-7. None is blocked on effort.
2. **The phase exit gate needs a human judgement.** Thirteen decisions now
   exist; none is `accepted`.
3. **No dependency manifest.** Still no `package.json`. `three` and
   `3d-force-graph` are now pre-approved by `CLAUDE.md`, but conditional on
   D-011 being accepted, and there is nothing to install them into.

`IN PROGRESS` is empty and the tree is clean.

**B-4 is the one that matters.** Fourteen publications, no authors, no URLs.
Nothing else can be built on top of an empty publications file, and no
autonomous session can fill it.

---

Continuity file for autonomous sessions. A session starts by reading this,
then `CLAUDE.md`, `docs/phase.md`, `docs/plan.md`, `design/DESIGN.md` and
`design/decisions.md`.

Working branch: `auto/phase-0`. Never `main`.

Current phase: **0 — Decide** (per `docs/phase.md`, which this file may not
edit).

The previous run halted with everything blocked. The halt was lifted on
2026-09-13 when Kaung amended `design/DESIGN.md` and appended D-011 and D-012,
which resolved B-8 and created verifiable work.

---

## IN PROGRESS

Nothing.

---

## QUEUE

Empty. Refill from BLOCKED as answers arrive.

---

## BLOCKED

Each entry is the exact question. Nothing here was guessed at, and no
placeholder stands in for an answer.

### B-1 — Lab name in the header

Three spellings appear across the brief: "MINN HAI Lab", "MINN HAI
(Human-centered AI) Lab", "HAI Lab".

> Which exact string goes in the header? And is it "Human-centered" or
> "Human-centred"? The rest of the site uses British spellings, so if the lab
> writes the American form in its own name, that mismatch should be deliberate
> rather than accidental.

The git remote is `git@github.com:MINN-HAI-Lab/MINN-HAI-LAB-WEBSITE.git`, so
the GitHub org is spelled `MINN-HAI-Lab`. Recording that as an observation
only — an org slug is not how a lab writes its name in a header, and it does
not settle the "Human-centered" question either way. It is not an answer.

### B-2 — Institutional affiliation

Nothing in the repo names a host institution.

> Is the lab hosted at an institution? If so, the exact name as it should
> appear. If it is independent, say so explicitly and I will record that there
> is none to name.

### B-3 — Mission sentence

`docs/plan.md` lists the mission paragraph as "already supplied, needs
formatting only", but the text is not in the repo. I have no copy of it.

> Paste the mission paragraph. I will propose two or three one-line cuts for
> you to choose between. Per `CLAUDE.md` I will not pick one myself, and I will
> not reword the lab's own prose into something tighter without approval.

### B-4 — Authors and links for all fourteen publications

`docs/plan.md` has short names, venues and years only. No authors, no URLs.
This is the entry that most needs saying plainly: I will not fill it in. An
invented author list or a plausible-looking DOI is the worst output this repo
could carry, and it would not be visibly wrong to a reader.

> For each of the fourteen entries in the `docs/plan.md` tables: the author
> list in citation order, the paper URL, and the code URL where one exists.

Two sub-questions already flagged in `design/decisions.md`:

> "Q-matrix Reinment" in the source list — read here as "Refinement". Confirm.

> The EC-TEL 2018 privacy paper is filed under personalised learning. Does it
> stay there, move to interpretability, or sit on its own?

### B-5 — Funder names

The source list reads "Uni Kyoto-Inria associate team grant" and "Uni Library
Rec. Syst.", which look abbreviated or partially redacted.

> The full, unabbreviated funder names as they should appear, and whether
> grant numbers should be published alongside them.

### B-6 — Accept or reject the thirteen decisions

All of D-001 to D-013 are `proposed`, except D-008 which is `open` and D-005
which is now `superseded by D-011`. The Phase 0 exit gate needs every one of
them `accepted` or `rejected`, and an autonomous session may only append new
entries, never change an existing one.

> Accept or reject each. D-001 (Astro) gates everything buildable, since there
> is still no `package.json` and no framework chosen.

The contrast half of this is no longer blocked — D-012 answers it.

### B-7 — D-004: the trace widget as hero

> Accept or reject. `docs/phase.md` is explicit that if this is rejected the
> rest of the plan changes, so it cannot be deferred past Phase 0.

---

## DONE

- **Baseline commit.** The repo had no commits. Recorded `CLAUDE.md`, the
  three `docs/` files, `design/DESIGN.md`, `design/decisions.md`, `.gitignore`,
  and `.agents/skills` with `skills-lock.json`.
- **Added this file**, queue filled from Phase 0 in `docs/phase.md`.
- **Worked the Phase 0 queue to exhaustion.** All seven tasks assessed
  individually, all seven blocked on facts or judgements not available to an
  autonomous session.
- **Applied amendments 2** from `amendments-phase-0-2.md`, which Kaung wrote
  and which is now deleted. This resolved four blocked entries:
  - **B-10** — `CLAUDE.md` now allows two islands instead of one, requires
    every island to render a real static version server-side, and gates any
    island over ~100KB gzipped behind an explicit click. D-011 was revised to
    a two-layer design (build-time static SVG, click-to-load 3D) that meets
    those rules. `three` and `3d-force-graph` are pre-approved, conditional on
    D-011 being accepted.
  - **B-9** — recorded in D-003 as deliberate and not to be "fixed":
    prominence comes from hue, not from a 0.05 difference in ratio.
  - **B-11** — D-013 adds `--trace-band-edge`, 1px `--claim` strokes on the
    band's edges, rather than raising the 12% fill.
  - **B-12** — all four: D-003 marked as amended by D-012, exits assigned
    `--dur-fast`, the rhythm switch pinned to 900px, and the opacity exception
    named in the colour section.
- **T-2 — re-audited the amended `DESIGN.md` against the amended
  `decisions.md`.** The six B-8 fixes all hold: easing is `--ease-out` on both
  sides, the annotation column is on the declared 1180px breakpoint, D-011 and
  D-012 exist, D-005 is superseded. The audit turned up one blocking conflict
  with `CLAUDE.md` (B-10), one measured accessibility failure (B-11) and four
  smaller gaps (B-12). Added a measurement note to the trace section.
- **T-1 — verified the two D-012 contrast figures.** Both hold in direction
  but were stated imprecisely: `--ink-muted` on `--paper` measures 6.02:1
  (D-012 says ~5.9) and on `--paper-sunk` 5.48:1 (says ~5.4). Corrected the two
  rows in the `DESIGN.md` table to ~6.0 and ~5.5; tokens untouched. D-012's own
  prose still reads ~5.9 — an existing entry this session may not edit.
- **B-8 resolved by Kaung, not by this session.** The four `DESIGN.md`
  conflicts found in the audit — the dangling D-011 reference, the D-005
  contradiction, the easing mismatch and the undeclared 1100px breakpoint —
  are answered by D-011, D-012 and the `DESIGN.md` amendment, committed at
  `d11e934`.

---

## NOTES

Failed approaches and values that had to be chosen. Two lines each.

- **Two figures in the amendment measured differently from their claim.**
  D-012's ~5.9/~5.4 were corrected to 6.02/5.48 in the first pass. D-013 says
  the band edges are "about 6:1", which is `--claim` on `--paper`; the band
  sits inside the panel, so it is 5.43:1 there and 4.46:1 against the fill.
  Both still clear the 3:1 floor, so D-013's conclusion stands. `DESIGN.md`
  carries the measured values; D-013's own prose was left as written.
- **Corrected a measurement, not a value.** `DESIGN.md` calls its contrast
  table "measured, not estimated", so leaving a number in it that measures
  differently makes the design authority untrue. No token changed, and D-012
  was left alone because existing entries are not this session's to edit.
- **Phase 0 is "No code" by design.** There is no `package.json`, no `src/`,
  no `public/`. That is the correct state for this phase, not a gap to fill.
- **D-011 names a dependency that does not exist yet.** `3d-force-graph`
  (MIT, Three.js + d3-force-3d). Nothing can install it: there is no
  `package.json`, and adding one is an explicit stop condition for this run.
- **Did not go looking for the missing facts.** Author lists, funder names and
  an affiliation are all findable on the open web, and a confident wrong answer
  from a search is indistinguishable from a fabrication once it is in the repo.
- **Did not write D-011 myself when it was only a dangling reference.** The
  only content it could have held contradicted D-005, so writing it would have
  meant inventing a direction nobody chose. Kaung wrote it instead, and
  superseded D-005 to match.
- **`.agents/skills` is tracked, not ignored.** `skills-lock.json` records a
  source and hash per skill so it is restorable in principle, but a silently
  empty skills directory is a worse failure than 612K of repo weight.
  `.claude/skills/*` are symlinks into it; ignoring one without the other
  leaves 26 dangling links.
- **`main` does not exist as a branch.** It was unborn when this run started,
  so branching to `auto/phase-0` carried the unborn HEAD across. All commits
  are on `auto/phase-0`.
- **A remote is configured and nothing was pushed to it.** `origin` points at
  `git@github.com:MINN-HAI-Lab/MINN-HAI-LAB-WEBSITE.git`. No upstream is set.
