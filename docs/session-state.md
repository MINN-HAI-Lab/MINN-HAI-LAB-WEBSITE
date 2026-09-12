# Session state

**RUN HALTED — 2026-09-13.**

Halted cleanly, on three independent stop conditions:

1. **Everything left is BLOCKED.** All seven Phase 0 tasks need a fact or a
   judgement that only you can supply. None is blocked on effort.
2. **The phase exit gate needs a human judgement.** Phase 0 exits when every
   decision in `design/decisions.md` is `accepted` or `rejected`. All ten are
   `proposed` or `open`, and an autonomous session may only append new entries,
   never change an existing one. The gate is unreachable from here by design.
3. **No dependency manifest exists.** There is no `package.json` anywhere in
   the tree, so entering Phase 1 would require adding a dependency that is not
   already in one.

Nothing was left half-done. `IN PROGRESS` is empty and the tree is clean.

Answer the questions under BLOCKED and the queue reopens. Most of them are one
line each; the publication metadata is the long one.

---

Continuity file for autonomous sessions. A session starts by reading this,
then `CLAUDE.md`, `docs/phase.md`, `docs/plan.md`, `design/DESIGN.md` and
`design/decisions.md`.

Working branch: `auto/phase-0`. Never `main`.

Current phase: **0 — Decide** (per `docs/phase.md`, which this file may not
edit).

---

## IN PROGRESS

Nothing.

---

## QUEUE

Empty. Every Phase 0 task moved to BLOCKED. See below.

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

### B-6 — D-002 and D-003: typography and palette

Both are `proposed`. I verified the D-003 contrast figures and they hold:
`--ink` 13.28:1, `--ink-muted` 4.96:1, `--claim` 5.97:1, `--rule` 1.38:1,
all against `--paper`. Two measurements the file does not record:

- `--ink-muted` on `--paper-sunk` is **4.51:1** — clears the 4.5 floor by
  0.01. Metadata inside the trace panel has no margin at all.
- `--paper-sunk` against `--paper` is **1.10:1**. With no shadows and
  `--radius-0`, that is the only thing marking the trace panel as a bounded
  region.

> Accept, reject or amend D-002 and D-003. If accepting D-003, does the trace
> panel get a `--rule` hairline so it does not depend on a 1.10:1 step?

### B-7 — D-004: the trace widget as hero

> Accept or reject. `docs/phase.md` is explicit that if this is rejected the
> rest of the plan changes, so it cannot be deferred past Phase 0.

### B-8 — Four unresolved conflicts inside `design/DESIGN.md`

Noticed while auditing, not acted on. Each is a choice between two values that
already exist in the repo, so picking one would be inventing a decision.

1. **D-011 does not exist.** `design/DESIGN.md` line 279 blocks the 3D graph
   tokens on it. `design/decisions.md` stops at D-010.
2. **The 3D section contradicts D-005.** D-005 rejects Three.js outright —
   "the hero is 2D because the data is 2D, plain SVG and canvas, no library".
   `DESIGN.md` *Not yet specified* plans node, edge and highlight tokens for a
   3D Markov blanket visualisation. Either D-005 gets superseded by a new
   entry, or that section is stale and comes out.
3. **Easing mismatch.** D-010 says the estimate toggle is "180ms, **ease-out**".
   `DESIGN.md` says `--dur-base` with **`--ease-mid`**. `DESIGN.md` claims
   precedence only over `tokens.css`, not over `decisions.md`.
4. **Undeclared breakpoint.** `DESIGN.md` Layout declares "Breakpoints: 640,
   900, 1180", then activates the annotation column at **1100px**, twice.

> For each: which value is right? I can then append a single new `proposed`
> entry recording the resolution.

---

## DONE

- **Baseline commit.** The repo had no commits. Recorded `CLAUDE.md`, the
  three `docs/` files, `design/DESIGN.md`, `design/decisions.md`, `.gitignore`,
  and `.agents/skills` with `skills-lock.json`.
- **Added this file**, queue filled from Phase 0 in `docs/phase.md`.
- **Worked the Phase 0 queue to exhaustion.** All seven tasks assessed
  individually, all seven blocked on facts or judgements not available to an
  autonomous session. Audited `design/DESIGN.md` against `design/decisions.md`
  in the process, which produced B-8.

---

## NOTES

Failed approaches and values that had to be chosen. Two lines each.

- **Phase 0 is "No code" by design.** There is no `package.json`, no `src/`,
  no `public/`. That is the correct state for this phase, not a gap to fill.
- **Did not go looking for the missing facts.** Author lists, funder names and
  an affiliation are all findable on the open web, and a confident wrong answer
  from a search is indistinguishable from a fabrication once it is in the repo.
  These stay blocked until supplied directly.
- **Did not write D-011.** It would have cleared the dangling reference in
  `DESIGN.md`, but the only content it could hold contradicts D-005, so writing
  it means inventing a direction nobody chose.
- **`.agents/skills` is tracked, not ignored.** `skills-lock.json` records a
  source and hash per skill so it is restorable in principle, but a silently
  empty skills directory is a worse failure than 612K of repo weight.
  `.claude/skills/*` are symlinks into it; ignoring one without the other
  leaves 26 dangling links.
- **`main` does not exist as a branch.** It was unborn when this run started,
  so branching to `auto/phase-0` carried the unborn HEAD across and left no
  `main` behind. All three commits are on `auto/phase-0`.
- **A remote is configured and nothing was pushed to it.** `origin` points at
  `git@github.com:MINN-HAI-Lab/MINN-HAI-LAB-WEBSITE.git`. `auto/phase-0` has
  no upstream set and the run never contacted it.
- **Contrast was verified, not assumed.** The four ratios in D-003 are
  accurate as written. The two gaps recorded under B-6 are additions, not
  corrections.
