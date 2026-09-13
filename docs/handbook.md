# Handbook

How to work on this repo with Claude Code without ending up with a site that
looks like every other AI lab site. Written for me, and for anyone who takes
this over later.

## The idea the whole repo is built on

An agent regresses to the mean unless you fence the mean off. Left to itself it
will produce a centred hero, three feature cards, a gradient, and copy about
pushing boundaries, because that is the average of everything it has seen. All
the constraint files in this repo exist for that one reason.

So the split is: `CLAUDE.md` says what must never happen, `design/DESIGN.md`
says what the values are, `design/decisions.md` says why, and `docs/plan.md`
says what we are actually building. The skills contribute craft on top. None of
them contribute direction. Direction comes from the lab's own material.

## What makes this site specific

Knowledge tracing has a picture. A row of a learner's attempts, right and
wrong, with the model's estimate of their mastery running underneath. Anyone in
AIED reads it instantly. Almost nobody outside the field has seen it.

That picture is the hero, and it does double duty: toggle an attempt and the
estimate moves, then the widget can show which earlier attempts are carrying
the current estimate. The first behaviour is the knowledge tracing work. The
second is the interpretability work. One artefact, both programmes, no
explanatory paragraph needed.

Everything else on the site is deliberately quiet so this can be loud. If you
find yourself adding a second attention-grabbing element, delete one.

## Session shape

Short sessions with one goal each work far better than long ones. A session
that has drifted across three concerns produces code nobody wants to read.

A normal session:

1. Say which phase we are in and what the exit gate is (`docs/phase.md`).
2. Give one goal. "Build the publications list" is a goal. "Work on the site"
   is not.
3. Ask for three prototypes before any real implementation, unless the
   component is trivial or already decided.
4. Look at screenshots. Not the code, the screenshots. Code review comes after
   the thing looks right.
5. Have it append any decision it made to `design/decisions.md`.

End the session there. Start a new one for the next goal so context stays
clean.

## Which skill for what

- Type scale, spacing rhythm, visual hierarchy, general "does this look
  designed" judgement: the taste skill.
- Easing curves, transition durations, enter and exit animation, anything that
  moves: Emil Kowalski's motion skill. Its defaults on timing and easing
  direction are better than anything I would guess.
- Component states, focus rings, keyboard behaviour, dialogs and popovers:
  impeccable.
- Anything structural about the design system itself: Anthropic's
  frontend-design skill.

Two or three of these at a time, not all of them. They overlap and the overlap
makes sessions slower and the output muddier.

img2threejs is not used on this site. It rebuilds a photographed physical
object as procedural Three.js, which is genuinely impressive and has nothing to
do with anything here. If the lab ever wants a 3D artefact, revisit it then.

## Prompt patterns that work here

Give it the content first, then the constraint, then ask for options.

> Here are the eight publications from the knowledge tracing programme with
> venue, year, and which have code. Design three ways to present this list.
> It has to stay scannable at 40 entries. No cards.

Ask for the reasoning before the code when the decision matters.

> Before writing anything, tell me what the hero should be and why, given that
> the audience is researchers deciding whether to read a paper.

Make it critique its own output against the list.

> Go back through what you just built and check it against the banned list in
> CLAUDE.md. Name anything that violates it, including anything borderline.

Make it delete.

> Remove the single least necessary element on this page. Tell me which one and
> why it was the weakest.

## Prompt patterns that fail

"Make it more creative" produces more decoration, not more thought. Replace it
with a specific constraint: remove all colour except the accent, or set the
headline at 96px, or make the whole page one column.

"Make it look like Stripe" produces a diluted Stripe with none of the reasons
Stripe made those choices.

Asking for a whole page in one go. You get the average page.

## Reviewing content

Read every factual claim on the page and ask where it came from. If the answer
is not "a file I gave it" then it is invented and it goes.

The failure mode to watch for: it produces a publication list with the right
shape and the right feel, and three of the entries are plausible papers that do
not exist. This is the single worst thing that can happen to this site. Check
the rendered publication list against `src/data/publications.ts`, and check
that file against the source list by eye, before any deploy.

Same applies to funder names, grant descriptions, and affiliations. Several of
those in the source material look partially abbreviated and need confirming
with Sein before they go public.

## Adding a publication

Edit `src/data/publications.ts` only. Never edit the rendered list. Fields:
title, authors, venue, year, programme, and optional links for paper and code.
An entry with no paper link is fine. An entry with a guessed link is not.

## Before deploy

Run `npm run verify`. It is the type check, the unit tests, the token lint,
the contrast check, a production build and the whole browser suite, and it
exits non-zero if any of them fails.

That covers most of the list below mechanically:

- ~~Keyboard through the whole page including the trace widget.~~
  `src/e2e/keyboard.spec.ts`, on every page.
- ~~390px width, no horizontal scroll, trace widget still usable.~~
  `src/e2e/screenshots.spec.ts`, at 360, 390, 768 and 1440, including a 24px
  tap-target floor.
- ~~Reduced motion on, nothing jumps.~~ `src/e2e/motion.spec.ts`, which checks
  both modes so that "reduced motion removes the animation" means something.
- ~~Lighthouse accessibility above 95.~~ Replaced by axe-core over every page
  in `src/e2e/accessibility.spec.ts`, run against WCAG 2.2 A and AA. Reading
  the failures rather than chasing a number is easier when there is no number.

Still needs a person:

- Publications rendered match the data file exactly. Nothing can check this
  but you; it is the failure mode the rest of this handbook is about.
- No `TODO:` markers left visible in built output. `npm run verify` prints
  the full inventory and fails if any marker does not name what is missing,
  who supplies it, and its tracker — but deciding they are all resolved is a
  judgement, not a check.
- Look at the screenshots. `npm run shots` writes them to `screenshots/`.

## What a page weighs

Measured 2026-09-13, cold first visit, compressed as served:

| Page | Total | Of which font | The site's own |
|---|---|---|---|
| `/` | 94.4KB | 83.8KB | 10.6KB |
| `/specimen/` | 91.3KB | 83.8KB | 7.5KB |
| `/404.html` | 89.7KB | 83.8KB | 5.9KB |

The split is the useful part. One webfont costs eight times the entire rest of
the site, so there is no point optimising the 3.2KB of JavaScript. If the
weight ever needs to come down, the only lever that matters is Literata:
subsetting it further to the glyphs actually used would take most of it.

`npm run verify` fails if a page exceeds 120KB, or if the site's own HTML, CSS
and script exceed 25KB. Those are the measurements above plus headroom, not
design values — move them deliberately rather than to make a build pass.
