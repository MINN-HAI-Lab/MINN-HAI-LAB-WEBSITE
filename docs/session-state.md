# Session state

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

Filled from Phase 0 in `docs/phase.md`.

1. Confirm the lab name as it should appear in the header.
2. Confirm institutional affiliation, or confirm there is none to name.
3. Confirm the mission sentence, cut to one line without turning into
   marketing.
4. Collect authors and real links for all fourteen publications.
5. Verify the funder names.
6. Accept, reject, or amend the typography and palette proposals (D-002,
   D-003).
7. Accept or reject the trace widget as hero (D-004).

---

## BLOCKED

Nothing yet.

---

## DONE

- Baseline commit. The repo had no commits; recorded the docs, design
  authority and skill set as handed over.

---

## NOTES

- Phase 0 is explicitly "No code". There is no `package.json`, no `src/`, no
  `public/` anywhere in the tree. That is the correct state, not a gap.
- `.agents/skills` is tracked rather than ignored. `skills-lock.json` records
  a source and hash per skill so it is restorable in principle, but a silently
  empty skills directory is a worse failure than 612K of repo weight.
  `.claude/skills/*` are symlinks into it, so ignoring one without the other
  would leave 26 dangling links.
