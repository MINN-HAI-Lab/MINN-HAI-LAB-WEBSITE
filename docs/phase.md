# Phases

Each phase has an exit gate. Do not start the next phase until the gate is
met. The point of the gates is to stop the project drifting into polishing a
page whose basic premise has not been tested yet.

Current phase: **0**.

---

## Phase 0 — Decide

No code. Settle the things that are expensive to change later.

- Confirm the lab name as it should appear in the header.
- Confirm institutional affiliation, or confirm there is none to name.
- Confirm the mission sentence. The supplied paragraph is too long for a hero
  and needs cutting to one line without turning into marketing.
- Collect authors and real links for all fourteen publications.
- Verify the funder names.
- Accept, reject, or amend the typography and palette proposals in
  `design/decisions.md` (D-002, D-003).
- Accept or reject the trace widget as hero (D-004). If rejected, the rest of
  the plan changes, so decide now.

**Exit gate:** every decision in `design/decisions.md` is either `accepted` or
`rejected`. None left `proposed`.

---

## Phase 1 — Prove the hero

Build only the trace widget, as a standalone page. Nothing else.

Reason: it is the one part of the design that cannot be recovered from if it
fails. If it turns out to be confusing, ugly, or slow, the whole visual
argument needs rethinking, and it is far cheaper to learn that now.

- Synthetic learner sequence, eight to twelve attempts.
- Toggle any attempt between correct and incorrect; the mastery estimate
  updates.
- A plain sentence underneath stating the current estimate in words.
- Attribution view: highlight which past attempts are carrying the current
  estimate.
- Keyboard operable end to end. Screen reader announces the estimate change.
- Reduced-motion path that is genuinely usable, not just motionless.
- Static fallback when JavaScript is off.

Show it to two people who do not work in the field and one who does. Ask the
outsiders what they think it shows, without prompting them.

**Exit gate:** at least one non-specialist correctly describes what the widget
is showing, unprompted. If nobody does, either simplify it or drop it and
return to Phase 0.

---

## Phase 2 — Design system

Now write the tokens, having seen what the hero needs.

- `design/DESIGN.md` with colour, type scale, spacing, radii, motion.
- `src/styles/tokens.css` as the implementation.
- Header, footer, link, and focus styles.
- One typographic specimen page showing every text style in context.

**Exit gate:** the specimen page contains no value that is not in
`design/DESIGN.md`, and the widget from Phase 1 has been reskinned onto the
tokens without looking worse.

---

## Phase 3 — Content pages

- Home, assembling the hero and the two programme blocks.
- Research, both programmes in the shape set out in `docs/plan.md`.
- Publications, with `src/data/publications.ts` as the only source.
- People.

Three prototypes before each page. Screenshots reviewed before code review.

**Exit gate:** every fact on the site traces to a supplied source. Zero
invented entries. This gets checked line by line, not spot-checked.

---

## Phase 4 — Finish

- Responsive pass at 390, 768, 1440.
- Full keyboard pass.
- Contrast and heading structure audit.
- Metadata, favicon, OG image, sitemap.
- 404 page.
- Remove every remaining `TODO:`.

**Exit gate:** the pre-deploy checklist in `docs/handbook.md` passes in full.

---

## Phase 5 — Deploy

Hosting per D-008. Custom domain. Then leave it alone.

The only maintenance this site should need is adding publications, which is one
file.

---

## Known risks

The widget is doing a lot of work. If it underdelivers the site is ordinary. It
is tested first for that reason.

Missing authors and links are currently the biggest blocker, and they are not a
design problem. They need someone to sit down with the publication list. Worth
starting in parallel with Phase 1.

Scope creep toward a blog or news section. Resist it. An empty news section
that stops in month three looks worse than no news section.
