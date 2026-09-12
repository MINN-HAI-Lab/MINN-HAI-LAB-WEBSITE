# DESIGN.md

**Status: provisional.** Values here come from `decisions.md` D-002, D-003,
D-010, D-011 and D-012, all of which are still `proposed`. This file becomes
authoritative at the Phase 2 exit gate. Until then, treat it as the working
proposal, not a ratified spec.

Amended 2026-09-13 to resolve the four conflicts recorded as B-8 and the two
contrast findings from the same audit. See D-011 and D-012.

This is the only source for colour, type, spacing and motion values. Nothing in
the codebase may introduce a value that is not here. If you need one that is
missing, stop and ask rather than inventing it.

`src/styles/tokens.css` mirrors this file as CSS custom properties and is
exposed to Tailwind through `@theme`. If the two disagree, this file is right
and the CSS is the bug.

---

## Colour

| Token | Value | Use |
|---|---|---|
| `--paper` | `#EFF1F2` | page background |
| `--paper-sunk` | `#E3E7E9` | the trace panel tint, and nothing else |
| `--ink` | `#1C2830` | body text, headings, marks, focus rings |
| `--ink-muted` | `#4E5D65` | metadata: venue, year, authors, captions |
| `--rule` | `#C9D0D3` | hairlines and table rules |
| `--claim` | `#B4133F` | the model's own estimate or prediction |

Six values. There is no seventh. No tints, no opacity variants, no
lighten/darken helpers. Aliases that point at one of these six are fine
(`--trace-edge` below); new colours are not.

### The rule that matters

`--claim` marks where a model makes a claim about a person: the mastery
estimate, the attribution highlight, any predicted value. It appears nowhere
else. Not on links, not on buttons, not on hover, not on focus, not as an
accent for its own sake.

The point is that a reader picks up the grammar without being told. Red is the
machine's opinion. Ink is fact.

The easiest way to break this is a focus ring. Focus uses `--ink`, deliberately.

### Contrast

Measured, not estimated. Re-verify after any token change.

| Pair | Ratio | Note |
|---|---|---|
| `--ink` on `--paper` | ~13.3:1 | |
| `--ink-muted` on `--paper` | ~6.0:1 | |
| `--ink-muted` on `--paper-sunk` | ~5.5:1 | |
| `--claim` on `--paper` | ~6.0:1 | |
| `--rule` on `--paper` | ~1.4:1 | decorative separator only |
| `--paper-sunk` on `--paper` | ~1.1:1 | cannot carry a boundary on its own |

`--ink-muted` passes comfortably on both surfaces but should still not go below
15px.

Note that `--ink-muted` (6.02:1) now sits a hair above `--claim` (5.97:1) on
`--paper`. Metadata therefore has marginally more contrast than the model's own
estimate. Not an accessibility problem, and not a call this session can make —
see B-9 in `docs/session-state.md`.

The last two rows are the constraints that bite. `--rule` is not strong enough
to bound anything a person has to perceive as a control; use `--ink-muted` for
that. And `--paper-sunk` cannot define the trace panel by itself, which is why
the panel is bounded by rules rather than by fill. See the trace section.

Never let colour be the only signal. Correct and incorrect attempts are
distinguished by mark shape, so the trace still reads in greyscale and for
colour-blind users.

### Dark mode

Not in v1 (D-009). The `--claim` rule has to be re-derived against a dark base
and the trace needs its contrast checked twice. Keep the tokens structured so
it stays possible.

---

## Type

**Literata, one family.** Variable, with both weight and optical size axes.

Set `opsz` to the rendered pixel size rather than leaving it at default. That
axis is the reason for choosing Literata and ignoring it wastes the choice.

```css
font-variation-settings: "opsz" 18, "wght" 400;
```

### Scale

Desktop, 900px and up:

| Role | Size | Line height | Weight | Tracking |
|---|---|---|---|---|
| Display | 56px | 1.05 | 400 | -0.015em |
| Page title | 36px | 1.15 | 400 | -0.01em |
| Section | 24px | 1.25 | 500 | 0 |
| Body | 18px | 1.65 | 400 | 0 |
| Small | 15px | 1.5 | 400 | 0 |

Below 900px:

| Role | Size | Line height |
|---|---|---|
| Display | 34px | 1.1 |
| Page title | 27px | 1.2 |
| Section | 21px | 1.3 |
| Body | 17px | 1.6 |
| Small | 14px | 1.5 |

Serif body text carries the higher line height on purpose. Do not tighten it to
match a sans-serif rhythm.

### Figures

Tabular figures for anything in a column — years, estimates, counts:

```css
font-feature-settings: "tnum" 1;
```

Proportional figures everywhere else. This is what replaces reaching for a
monospace face for numbers, which is banned.

Monospace appears only inside real code samples. One system stack, no webfont:

```css
ui-monospace, "SF Mono", Menlo, monospace
```

### Rules

Sentence case everywhere, including navigation, buttons and table headers. No
all-caps, no small caps, no tracked-out labels.

Never accent a single word inside a headline with a different colour or weight.

No eyebrow labels above headings.

Measure caps at 66 characters.

---

## Spacing

Four-pixel base. Use only these:

```
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  24px
--space-6:  32px
--space-8:  48px
--space-10: 64px
--space-12: 96px
--space-16: 128px
--space-20: 192px
```

Vertical rhythm: `--space-20` between major page sections on desktop,
`--space-12` on mobile. `--space-6` between a heading and its body.
`--space-5` between paragraphs.

Spacing does the work that borders and cards would otherwise do. If a section
feels undifferentiated, add space before you consider adding a box.

---

## Layout

```
--measure:     66ch        body text column
--page-max:    1180px      outer bound
--margin-col:  220px       annotation column, 1180px and up
--gutter:      var(--space-6)
```

Breakpoints: 640, 900, 1180. Three, and no fourth. Any media query in the
codebase uses one of these numbers.

Content is left-aligned and sits in a single measured column. At 1180px and up
the annotation column runs to the left of that measure and holds marginal notes
on `/research` — the limitation notes, the "what this needs in data terms"
asides. Below 1180px those notes fall inline beneath the paragraph they
annotate.

The margin column is content-derived, not decorative: the lab's subject is
explanation sitting beside the thing it explains. If it ends up holding
decoration, remove it.

---

## Borders, radii, elevation

```
--rule-width:  1px
--radius-0:    0       panels, tables, the trace container
--radius-sm:   2px     buttons, inputs, toggles
```

Two radii, and they mean different things: zero for things that are document,
2px for things you can operate. Not one value applied to everything.

**No shadows.** None, anywhere. A soft grey shadow under every panel is on the
banned list in `CLAUDE.md` and there is no case for it here.

That ban has a consequence worth stating plainly, because it was missed once
already: with no shadow and no radius, a panel has only its fill and its edges
to distinguish it, and two greys this close cannot do it with fill. Panels are
defined by rules. If you find yourself reaching for a shadow, reach for a rule
and more space instead.

No gradients. No backdrop blur.

---

## Motion

```
--dur-fast:  120ms     colour changes, hover
--dur-base:  180ms     estimate updates, state changes
--dur-slow:  600ms     the curve draw, once, on first load

--ease-out:  cubic-bezier(0.22, 1, 0.36, 1)      entrances, and the estimate
--ease-mid:  cubic-bezier(0.4, 0, 0.2, 1)        other in-place state changes
```

Budget: one orchestrated moment on load, which is the mastery curve drawing in.
Nothing else animates on its own. No scroll-triggered reveals anywhere. No
section fade-and-slide. No hover lift.

Everything else responds to input. Toggling an attempt animates the estimate at
`--dur-base` with `--ease-out`, per D-010, because the movement is the
information and it should decelerate into its new value.

Exit animations run faster than entrances. Enter uses `--ease-out`; do not use
an ease-in on an entrance.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) { ... }
```

Replace the curve draw with the finished curve. Replace the estimate transition
with an instant update plus a brief static highlight, so the change is still
visible. Do not simply set duration to zero on a transform — that produces a
jump, which is worse than the animation.

---

## States

Links in body text: `--ink`, underlined with a 1px underline offset by 0.15em.
Hover thickens the underline. No colour change, no `→`.

Focus: `outline: 2px solid var(--ink); outline-offset: 2px`. Visible on every
interactive element, keyboard and mouse alike. Never `outline: none` without a
replacement in the same rule.

Disabled: `--ink-muted` at the same size, `cursor: not-allowed`, no opacity
fade.

Buttons: there is one button style. `--radius-sm`, 1px `--ink` border,
transparent fill, `--ink` text. Filled variant only if the trace widget turns
out to need it, and record that as a decision if so.

---

## Trace widget

```
--trace-bg:      var(--paper-sunk)   tint only, not a boundary
--trace-edge:    var(--ink-muted)    1px rule above and below the panel
--trace-mark:    var(--ink)          attempt marks
--trace-curve:   var(--claim)        mastery estimate
--trace-band:    var(--claim) at 12% uncertainty band
--mark-size:     20px
--curve-width:   2px
```

The panel runs full-bleed horizontally with a 1px `--trace-edge` rule above and
below. Those rules are what define it. The fill only tints, and at ~1.1:1
against the page it cannot do more than that (D-012).

Correct is a filled circle, incorrect is an open circle with a stroke. Shape
carries the distinction; colour does not.

The uncertainty band is the only place any token appears at reduced opacity,
because the band is literally about uncertainty.

Label the synthetic data visibly inside the widget.

---

## Not yet specified

**3D graph tokens.** D-011 proposes a 3D force-directed Bayesian network with a
Markov blanket highlight, anchoring the interpretability section on
`/research`. It needs node, edge, highlight and background values, plus a
decision on whether it sits on `--paper` or a dark field. Blocked until D-011
is accepted. Do not improvise these.

**The human-like element.** Raised, never specified. A figure, a face, a
learner avatar and an abstract human form are four different briefs and none
has been chosen, so there is nothing to tokenise. Listed in D-011 as open.

**Imagery.** No photographs are planned. If any appear, they need a treatment
spec before they go in.

**Wordmark.** None yet. The header is set type until there is one.