# MINN HAI Lab — site

## What this is

The public site for the MINN HAI (Human-centered AI) Lab. Two research
programmes: AI for personalised learning (knowledge tracing) and interpretable
explanation of tabular models via Bayesian networks and Markov blankets.

Audience, in order: researchers who might cite or collaborate, prospective PhD
and master's students, and funding or programme committees. Not consumers. Not
investors. Nobody arriving here needs to be sold anything; they need to find
out quickly whether the work is relevant to them and where to read it.

Read `docs/plan.md` for scope and information architecture, `design/decisions.md`
for design decisions and their rationale, `docs/phase.md` for what phase we are
in and what its exit gate is.

## Stack

Astro, TypeScript, Tailwind v4. Static output. No component library, no CMS.
Publications live in a typed data file, not in JSX.

Client-side JavaScript is allowed in exactly one place: the interactive trace
widget on the home page. Everything else ships as HTML and CSS.

## Design authority

`design/DESIGN.md` is the only source for colour, type, spacing and motion
values. Never invent a token. If a value you need is missing, stop and ask.

## Content rules — these are the important ones

This is an academic site, so fabricated content is not a cosmetic problem, it
is a reputational one.

- Never invent a publication, author, venue, year, DOI, funder, affiliation,
  grant number, metric, benchmark result or quotation. Not even as a
  placeholder that "looks right".
- Where content is missing, write a literal `TODO:` marker describing what is
  needed and who can supply it. A visible gap is correct. A plausible
  fabrication is a serious bug.
- Every publication entry must trace back to `src/data/publications.ts`, and
  every entry in that file must have come from a source I supplied.
- Do not reword the lab's research descriptions into marketing copy. If the
  prose needs tightening, propose the edit and wait.
- No claim about impact, ranking, or "leading" anything.

## Voice

Plain, exact, unhurried. Write as though explaining the work to a capable
colleague from an adjacent field.

Say what a method does and what problem it addresses. Two sentences per idea is
usually enough. Do not use: empowering, unlock, cutting-edge, revolutionise,
seamless, robust, leverage, harness, transform, "the future of", "at the
intersection of" as an opener, "pushing the boundaries".

Sentence case everywhere, including buttons and headings. No exclamation marks.
No emoji.

## Banned visual defaults

Non-negotiable, because each one is now a recognised marker of generated design:

- Warm cream background (anywhere near `#F4F1EA`) with a high-contrast serif
  display and a terracotta or clay accent (anywhere near `#D97757`).
- Near-black background with one bright acid-green or vermilion accent.
- Tinted near-black (`#0B0B0B`, `#111`) standing in for a real dark value.
- Tracked-out all-caps eyebrow labels above headings.
- Meta strings joined with middle dots (`A · B · C`).
- Labels of the form `WORD — fragment` with a spaced em dash.
- A monospace face used for small data labels, metadata, or numbers.
  Monospace appears only inside actual code samples.
- `→` appended to link or button text.
- Identical rounded cards in a three-column grid, one radius on everything,
  the same soft grey shadow under each.
- Gradients used as decoration. Glassmorphism. Backdrop blur.
- Particle fields, floating nodes, animated neural-network backgrounds,
  orbiting dots, any generic "AI" motif.
- Numbered `01 / 02 / 03` markers unless the content is genuinely a sequence.
- Accenting one word inside a headline in a different colour or weight.
- Fade-and-slide-up entrance on every section; hover lift on every card.
- Inter, Geist, or any UI default as the display face.

## Required

- One display idea carries the page. Everything around it stays quiet.
- Colour is information. The accent marks a model's own estimate or claim and
  appears nowhere else. If colour is the only thing distinguishing two states,
  add a second cue.
- Motion answers a user action and shows what changed. One orchestrated moment
  on load at most. `prefers-reduced-motion` is honoured properly, not by
  setting duration to zero on a transform that then jumps.
- Measure under 70 characters for body text.
- Every section must carry something only this lab has: a real result, a real
  figure, a real trace, a link to real code. No abstract stand-ins.

## Quality floor

Responsive to 360px. Visible keyboard focus on every interactive element, and
a focus style that is not the browser default. Colour contrast at least 4.5:1
for body text. Headings in document order with no skipped levels. The trace
widget is operable by keyboard and announces its state. Every image has real
alt text describing the content, not the file.

Pages should work with JavaScript disabled, apart from the trace widget, which
degrades to a static rendering of one example.

## Process

Before building any new page or section:

1. Read the relevant part of `docs/plan.md` and `design/decisions.md`.
2. Produce three visually distinct approaches in `prototypes/`, each a single
   self-contained HTML file, and let me pick. Never one-shot a layout.
3. After building, screenshot it at 1440px and 390px and critique your own
   output against the banned list above before telling me it is done.
4. Append any new design decision to `design/decisions.md` with its rationale
   and status.

Do not run `git commit` unless I ask. Do not add dependencies without asking.
Do not create files outside the structure in `docs/plan.md`.

## Skills

Use the design skills for craft: spacing rhythm, type scale, interaction
states, easing choices, component states. Do not let them override anything in
this file. Where a skill's default conflicts with the banned list above, this
file wins, and say so rather than quietly picking one.
