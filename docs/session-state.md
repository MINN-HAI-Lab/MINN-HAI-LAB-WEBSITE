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

Nothing.

---

## QUEUE

Empty.

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

### B-9 — `--ink-muted` now outranks `--claim` in contrast

Found while verifying T-1. On `--paper`, the new `--ink-muted` measures
**6.02:1** and `--claim` measures **5.97:1**. Metadata now carries marginally
more contrast than the model's own estimate, which inverts the hierarchy
D-003 sets up: the accent is supposed to be the thing that stands out.

The difference is far too small to see, so this may well be fine. But it is a
design judgement, not a measurement, so this session will not touch it.

> Leave it, or nudge one of the two tokens? Nudging `--claim` darker is the
> smaller change and keeps `--ink-muted` where D-012 just put it.

### B-10 — D-011 contradicts CLAUDE.md, which this session cannot edit

This is the important one, and it is not a rounding question.

`CLAUDE.md:23` — "Client-side JavaScript is allowed in exactly one place: the
interactive trace widget on the home page. Everything else ships as HTML and
CSS."

`CLAUDE.md:106` — "Pages should work with JavaScript disabled, apart from the
trace widget, which degrades to a static rendering of one example."

D-011 puts a 3D force-directed graph on `/research`. That is a second place
with client-side JavaScript, and `/research` would not work with JavaScript
off. The exemption in `CLAUDE.md` names the trace widget and nothing else.

Two more, same entry:

- `CLAUDE.md:121` — "Do not add dependencies without asking." D-011 names
  `3d-force-graph`, which pulls Three.js and d3-force-3d.
- `CLAUDE.md:78` bans "floating nodes, animated neural-network backgrounds …
  any generic 'AI' motif". D-011 argues the graph is the lab's real research
  object rather than a motif, and that it "reads the way people expect a neural
  visual to read". That may well be the right call, but `CLAUDE.md` says to say
  so rather than quietly pick, so it is said here rather than assumed.

D-011 cannot be accepted as written without `CLAUDE.md` changing, and this
session may not touch `CLAUDE.md`.

> Amend the client-side JavaScript rule to admit a second island on
> `/research`, with whatever no-JS fallback you want for it? Or move the graph
> to a static rendering? Or drop D-011?

### B-11 — `--trace-band` is below the non-text contrast floor

`--claim` at 12% over `--paper-sunk` resolves to `#DDCED5`: **1.22:1** against
the panel, against a 3:1 floor for non-text content a reader has to perceive.
The mastery curve sitting on the band is fine at 4.46:1.

The band represents the model's uncertainty, which is information rather than
atmosphere, so the floor probably applies.

> Raise the 12%, or accept that the band is atmosphere and label it as such?
> Picking an opacity is picking a value, so this session did not.

### B-12 — Four smaller gaps from the same audit

1. **D-003 is not marked superseded.** D-012 replaces its `--ink-muted`
   (`#5A6A72` → `#4E5D65`), but D-003 still shows the old value and carries no
   marker. The preamble of `decisions.md` says to mark the old entry; D-005 was
   marked, D-003 was not. Anyone reading D-003 at face value takes a token that
   fails on the panel.
2. **No exit-duration token.** `DESIGN.md` says "Exit animations run faster
   than entrances", but the three durations are spoken for: `--dur-fast`
   (colour, hover), `--dur-base` (estimate, state), `--dur-slow` (curve draw).
   Which one is an exit?
3. **The vertical rhythm switch names no breakpoint.** `--space-20` "on
   desktop", `--space-12` "on mobile", while Layout declares exactly three
   breakpoints and says "any media query in the codebase uses one of these
   numbers". Which of 640, 900 or 1180 switches the rhythm?
4. **The opacity carve-out omits `--trace-band`.** The Colour section still
   reads "no tints, no opacity variants" and then carves out aliases only. The
   band is the exception and is permitted four sections later.

---

## DONE

- **Baseline commit.** The repo had no commits. Recorded `CLAUDE.md`, the
  three `docs/` files, `design/DESIGN.md`, `design/decisions.md`, `.gitignore`,
  and `.agents/skills` with `skills-lock.json`.
- **Added this file**, queue filled from Phase 0 in `docs/phase.md`.
- **Worked the Phase 0 queue to exhaustion.** All seven tasks assessed
  individually, all seven blocked on facts or judgements not available to an
  autonomous session.
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
