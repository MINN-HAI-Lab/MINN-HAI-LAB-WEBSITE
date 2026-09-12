# DESIGN.md

**Status: provisional.** Values here come from `decisions.md` D-002, D-003 and
D-010, all of which are still `proposed`. This file becomes authoritative at
the Phase 2 exit gate. Until then, treat it as the working proposal, not a
ratified spec.

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
| `--paper-sunk` | `#E3E7E9` | the trace panel, and nothing else |
| `--ink` | `#1C2830` | body text, headings, marks, focus rings |
| `--ink-muted` | `#5A6A72` | metadata: venue, year, authors, captions |
| `--rule` | `#C9D0D3` | hairlines and table rules |
| `--claim` | `#B4133F` | the model's own estimate or prediction |

Six values. There is no seventh. No tints, no opacity variants, no
lighten/darken helpers.

### The rule that matters

`--claim` marks where a model makes a claim about a person: the mastery
estimate, the attribution highlight, any predicted value. It appears nowhere
else. Not on links, not on buttons, not on hover, not on focus, not as an
accent for its own sake.

The point is that a reader picks up the grammar without being told. Red is the
machine's opinion. Ink is fact.

The easiest way to break this is a focus ring. Focus uses `--ink`, deliberately.

### Contrast

Approximate ratios against `--paper`, worth re-verifying after any change:

- `--ink` — about 13:1
- `--ink-muted` — about 5:1, so it passes for body-size text but should not go
  below 15px
- `--claim` — about 6:1

`--rule` sits near 1.4:1. It is a decorative separator only. Anything that must
be perceivable as a control boundary uses `--ink-muted` or darker.

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
--margin-col:  220px       annotation column, 1100px and up
--gutter:      var(--space-6)
```

Breakpoints: 640, 900, 1180.

Content is left-aligned and sits in a single measured column. On `/research`
the annotation column runs to the left of that measure and holds marginal notes
— the limitation notes, the "what this needs in data terms" asides. Below
1100px those notes fall inline beneath the paragraph they annotate.

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

**No shadows.** None, anywhere. Depth comes from `--paper-sunk` against
`--paper`. A soft grey shadow under every panel is on the banned list in
`CLAUDE.md` and there is no case for it here.

No gradients. No backdrop blur.

---

## Motion

```
--dur-fast:  120ms     colour changes, hover
--dur-base:  180ms     estimate updates, state changes
--dur-slow:  600ms     the curve draw, once, on first load

--ease-out:  cubic-bezier(0.22, 1, 0.36, 1)      things entering
--ease-mid:  cubic-bezier(0.4, 0, 0.2, 1)        things changing in place
```

Budget: one orchestrated moment on load, which is the mastery curve drawing in.
Nothing else animates on its own. No scroll-triggered reveals anywhere. No
section fade-and-slide. No hover lift.

Everything else responds to input. Toggling an attempt animates the estimate at
`--dur-base` with `--ease-mid`, because the movement is the information.

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
--trace-bg:      var(--paper-sunk)
--trace-mark:    var(--ink)          attempt marks
--trace-curve:   var(--claim)        mastery estimate
--trace-band:    var(--claim) at 12% uncertainty band
--mark-size:     20px
--curve-width:   2px
```

Correct is a filled circle, incorrect is an open circle with a stroke. Shape
carries the distinction; colour does not.

The uncertainty band is the only place any token appears at reduced opacity,
because the band is literally about uncertainty.

Label the synthetic data visibly inside the widget.

---

## Not yet specified

**3D graph tokens.** The Markov blanket visualisation needs node, edge,
highlight and background values, plus a decision on whether it sits on a
`--paper` or a dark field. Blocked on D-011 and on the open question about what
the human-like element should be. Do not improvise these — add them here once
the decision lands.

**Imagery.** No photographs are planned. If any appear, they need a treatment
spec before they go in.

**Wordmark.** None yet. The header is set type until there is one.
