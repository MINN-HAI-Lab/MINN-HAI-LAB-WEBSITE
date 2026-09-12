# Session state

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

**T-1 — Verify the two contrast figures in D-012.**

D-012 changes `--ink-muted` from `#5A6A72` to `#4E5D65` and states "roughly
5.9:1 on `--paper` and 5.4:1 on `--paper-sunk`", with the explicit instruction
"Verify both before accepting". `design/DESIGN.md` already carries those
numbers in its contrast table. Measure them and report; do not amend either
file's values, since a token change is not this session's to make.

---

## QUEUE

1. Re-audit the amended `design/DESIGN.md` against the amended
   `design/decisions.md`. The previous audit produced B-8; the amendment
   touched six places and may have introduced new conflicts.

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

### B-6 — Accept or reject the twelve decisions

All of D-001 to D-012 are `proposed`, except D-008 which is `open` and D-005
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
- **B-8 resolved by Kaung, not by this session.** The four `DESIGN.md`
  conflicts found in the audit — the dangling D-011 reference, the D-005
  contradiction, the easing mismatch and the undeclared 1100px breakpoint —
  are answered by D-011, D-012 and the `DESIGN.md` amendment, committed at
  `d11e934`.

---

## NOTES

Failed approaches and values that had to be chosen. Two lines each.

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
