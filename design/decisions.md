# Design decisions

One entry per decision. Status is `proposed`, `accepted`, `rejected` or
`superseded`. Nothing here is settled until it says `accepted`.

Append, do not rewrite. If a decision changes, add a new entry and mark the old
one superseded. The reasoning that turned out to be wrong is worth keeping.

---

## D-001 — Astro, not Next.js

**Status:** proposed · 2026-09-13

The site is four pages of text and one interactive widget. Astro ships the text
as HTML and hydrates only the widget. Next.js would carry a React runtime
across pages that do not need it.

The counter-argument is familiarity. If the people maintaining this are more
comfortable in Next, that is a real cost and may outweigh the payload
difference on a site this small. Worth naming rather than pretending the
technical case is decisive.

**Rejected:** Next.js, Eleventy, plain HTML. Eleventy was close; Astro wins on
the widget island.

---

## D-002 — Literata, one family

**Status:** proposed · 2026-09-13

Literata throughout, with its optical-size axis doing the work across scales.
No second family.

Literata was drawn for long-form reading on screens, originally for Google Play
Books. For a lab whose subject is learning, a typeface designed for reading is
an argument rather than a preference, which is exactly what a typographic
choice should be.

One family also removes the commonest tell: a serif display bolted onto Inter
for everything else.

Risk: without a sans, navigation and small labels may feel heavy. If that
happens after the specimen page, the fix is weight and size, not a second
family. Only add a sans if that fails, and record it as a new decision.

Proposed scale, 1440px:

| Role | Size | Line height | Weight |
|---|---|---|---|
| Display | 56px | 1.05 | 400 |
| Page title | 36px | 1.15 | 400 |
| Section | 24px | 1.25 | 500 |
| Body | 18px | 1.65 | 400 |
| Small | 15px | 1.5 | 400 |

Serif body text takes the higher line height. Measure caps at 66 characters.

**Rejected:** Newsreader, Source Serif, Instrument Serif. Instrument Serif in
particular is now heavily associated with generated pages. Any pairing led by
Inter or Geist.

---

## D-003 — Cool neutral base, one accent, and the accent means something

**Status:** proposed · 2026-09-13 · amended by D-012 (`--ink-muted`)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#EFF1F2` | page background |
| `--paper-sunk` | `#E3E7E9` | the trace panel, and nothing else |
| `--ink` | `#1C2830` | body text, headings |
| `--ink-muted` | `#5A6A72` | metadata, venue and year |
| `--rule` | `#C9D0D3` | hairlines, table rules |
| `--claim` | `#B4133F` | the model's own estimate, and only that |

Two things drive this.

First, the avoidance. Warm cream with a serif and a terracotta accent is now
the single most recognisable generated-design signature, and near-black with an
acid accent is the second. Both were the obvious moves for an academic AI lab,
which is exactly why neither is available.

Second, the positive reason. `--claim` is a red-pen crimson, and it appears
only where a model makes a claim about a person: the mastery estimate, the
attribution highlight, predicted values. Learner attempts themselves stay in
ink. So the page has a rule a reader can pick up without being told — anything
red is the machine's opinion, everything black is fact. That is the lab's own
subject expressed as a colour rule, and it is worth more than a nicer palette.

Correct and incorrect attempts are distinguished by mark shape, not colour, so
the widget survives colour blindness and greyscale printing.

**Rejected:** cream and terracotta, near-black and acid green, any
blue-to-violet pairing, green-for-correct and red-for-incorrect.

**On B-9.** After D-012, `--ink-muted` measures 6.02:1 and `--claim` 5.97:1 on
`--paper`, so metadata now carries fractionally more luminance contrast than
the model's estimate. This is not a hierarchy problem and should not be
"fixed". Prominence here comes from hue: a saturated crimson among grey-blue
neutrals reads as the loudest thing on the page regardless of a 0.05
difference in ratio. Darkening `--claim` to win a number would make it heavier
and no more legible. Recorded so the next audit does not re-flag it.

---

## D-004 — The hero is a live knowledge trace

**Status:** proposed · 2026-09-13

A row of a learner's attempts with the model's mastery estimate underneath,
interactive: toggle an attempt and the estimate moves. A second view highlights
which past attempts are carrying the current estimate.

Reasoning. The default academic-lab hero is a mission statement over a
background, which tells a visitor nothing they could not guess. This tells them
what knowledge tracing is in about five seconds, using the field's own
notation, and the attribution view carries the interpretability programme in
the same object. Two research programmes, one artefact, no explanatory
paragraph.

It is also unavailable to anyone else. A competitor lab could copy a palette in
an afternoon; they cannot copy this without doing the same research.

Data is synthetic and labelled as such on the page.

Risk: if it reads as decoration or confuses non-specialists, it is worse than a
plain headline. That is why Phase 1 builds it first and tests it on people
outside the field before anything else is designed.

**Rejected:** mission statement over abstract background, animated network
graph, publication count as a big number, a photograph of the team.

---

## D-005 — No Three.js, no img2threejs

**Status:** proposed · 2026-09-13

img2threejs rebuilds a photographed physical object as procedural Three.js.
Genuinely good at that. There is no physical object on this site, and a 3D
element would be decoration on a page whose argument is that the lab's work is
legible.

The hero is 2D because the data is 2D. Plain SVG and canvas, no library beyond
what the widget needs.

Revisit only if the lab acquires something physical worth showing.

---

## D-006 — Publications are content, not a subsection

**Status:** proposed · 2026-09-13

Fourteen papers across twelve years, six of them with public code, in venues
including AAAI, ICDM, PAKDD, AIED and EC-TEL. For the primary audience that is
the most useful thing on the site.

So: five most recent on the home page with paper and code links inline, full
list on its own page, relevant entries repeated inside each research programme.
Never behind a "read more".

Dense rows, not cards. Forty entries in cards is unreadable and we will get to
forty.

---

## D-007 — Each research programme states its limits

**Status:** proposed · 2026-09-13

Every programme section ends with what the approach cannot currently do.

Unusual for a lab site and slightly uncomfortable, which is the point. For a
group whose stated subject is interpretability and trust, a page that only
lists strengths undercuts its own argument. It is also the section a
prospective student will actually find useful.

Needs Sein to write or approve. Not something to draft on his behalf.

---

## D-008 — Hosting

**Status:** open · 2026-09-13

Static output, so Netlify, Vercel, Cloudflare Pages and GitHub Pages all work.
GitHub Pages is free and the lab already publishes code there, which keeps
everything in one account. Decide with the domain.

---

## D-009 — No dark mode in v1

**Status:** proposed · 2026-09-13

The `--claim` colour rule from D-003 has to be re-derived for a dark base, and
the trace widget needs its contrast checked twice. Not worth it before launch.
Structure the tokens so it stays possible.

---

## D-010 — Motion budget

**Status:** proposed · 2026-09-13

One orchestrated moment on first load: the mastery curve draws in, once, over
roughly 600ms. Nothing else animates on its own.

Everything else is response to input. Toggling an attempt animates the
estimate, 180ms, ease-out, because the movement is the information. Hover
states change colour only.

No scroll-triggered reveals anywhere. Section-by-section fade-and-slide is the
clearest signal of a generated page and it adds nothing to reading.

`prefers-reduced-motion` replaces the curve draw with the finished curve, and
the estimate toggle with an instant update plus a brief static highlight, so
the change is still visible.

---

## Open questions

These block Phase 0.

1. Lab name in the header. "MINN HAI Lab", "MINN HAI (Human-centered AI) Lab",
   and "HAI Lab" all appear in the brief.
2. Institutional affiliation. Is the lab hosted somewhere, or independent?
3. People. Nobody is named on the site yet. Who appears, and what do they
   consent to publishing?
4. Authors for each publication. The list has titles and venues only.
5. Real paper and code URLs for all fourteen entries.
6. Funder names. "Uni Kyoto-Inria associate team grant" and "Uni Library Rec.
   Syst." look abbreviated or partially redacted. Also whether grant numbers
   should appear.
7. "Q-matrix Reinment" in the source list, read here as Refinement. Confirm.
8. Where the EC-TEL 2018 privacy paper belongs. It is currently filed under
   personalised learning and may fit better on its own.
9. Spelling of "Human-centered" in the lab name. The rest of the site uses
   British spellings; a proper noun should stay as the lab writes it, so this
   needs to be deliberate rather than accidental.
10. Domain name.

## D-005 — No Three.js, no img2threejs

**Status:** superseded by D-011 · 2026-09-13

The img2threejs half of this still holds and is restated in D-011. The blanket
"no 3D" half was too broad: it ruled out a 3D treatment of the Markov blanket,
which is a different proposition from a decorative brain and was not considered
when this was written.

---

## D-011 — 3D applies to the Bayesian network, not to anatomy

**Status:** proposed · 2026-09-13 · revised 2026-09-13 after B-10

A Bayesian network shown as a graph. Nodes are variables, edges are conditional
dependencies. Selecting a target node highlights its Markov blanket — parents,
children, and children's other parents — while the rest recedes.

It ships in two layers.

The baseline is a static SVG, rendered at build time, in the HTML. Real nodes,
real edges, one blanket already highlighted. No JavaScript, no dependency, no
payload. This is what most readers will see and it is sufficient on its own.

The 3D version loads on an explicit click. `3d-force-graph` (MIT, Three.js with
d3-force-3d underneath) takes `{nodes, links}` and gives a force-directed
layout you can rotate, with the blanket highlight driven by selection. Three.js
is roughly 150KB gzipped before the graph library, which is why it is never on
the initial load.

Reasoning. A force-directed graph settles into an organic cluster on its own,
so it reads the way people expect a neural visual to read without claiming to
be a brain. And it is the lab's actual research object rather than a motif
borrowed from a neighbouring field. The static layer is what makes it
compatible with the island rules in `CLAUDE.md`; without it this decision would
have to be rejected.

Still rejected, and D-005 got this part right: img2threejs. It rebuilds a
photographed object from primitives, gated on hard-surface detail — bevels,
rivets, engraved linework, wear. Organic anatomy is its worst case, unseen
sides are inferred, and sourcing a reference image raises a licensing question
on top.

Also still rejected: a literal anatomical brain of any provenance. A site about
knowledge tracing and Bayesian networks that opens with a brain claims
neuroscience the lab does not do.

Placement: the trace stays the home hero, the graph anchors the
interpretability section on `/research`.

**Open:** the "human-like" element is still unspecified. A figure, a face, a
learner avatar and an abstract human form are four different briefs.

---

## D-012 — Darker muted ink, and the trace panel is defined by rules

**Status:** proposed · 2026-09-13

Two fixes from the audit.

`--ink-muted` changes from `#5A6A72` to `#4E5D65`. The old value measured
4.51:1 on `--paper-sunk`, clearing the 4.5:1 floor by a hundredth. That is not
a pass, it is an accident waiting for the next tweak to either token. The new
value measures 6.02:1 on `--paper` and 5.48:1 on `--paper-sunk` — the ~5.9 and
~5.4 in the original draft of this entry were estimates that came in low and
were corrected against measurement.

The trace panel measured 1.10:1 against the page. With shadows banned (D-003)
and `--radius-0` on panels, it had nothing left to define it. Two greys this
close cannot carry a boundary, so the fill stops trying: the panel runs
full-bleed horizontally with a 1px `--ink-muted` rule above and below. The
rules define it, the fill only tints it.

This is consistent with the rest of the system, where spacing and rules do the
work that cards would otherwise do.

---

## D-013 — The uncertainty band is bounded by strokes, not by fill

**Status:** proposed · 2026-09-13

`--trace-band` at 12% over `--paper-sunk` resolves to about `#DDCED5`, which is
1.22:1 against the panel. The band conveys the model's uncertainty, so it is
information and the 3:1 non-text floor applies.

Raising the fill to 3:1 is the wrong fix. It would make the band heavy enough
to compete with the curve it surrounds, and the fill is a wash rather than the
thing being read.

Instead the band gets 1px `--claim` boundary strokes along its upper and lower
edges. Those measure about 6:1 and carry the information; the fill stays at 12%
and stays decorative. This is also better chart practice than a bare tint.

New token: `--trace-band-edge: var(--claim)`, 1px.

---

## D-014 — The favicon is the estimate, not a mark

**Status:** proposed · 2026-09-13

A rising `--claim` curve on `--paper`, generated from the tokens at build time.

DESIGN.md says there is no wordmark yet and the header is set type until there
is one. A favicon still has to be something, so it is the site's display idea
at its smallest rather than a logo invented to fill the slot.

`--claim` is not merely allowed here, it is required: the line is the model's
estimate, which is what that token means.

**Rejected:** a letter, because which letter depends on the lab name and that
is unconfirmed — "MINN HAI Lab", "HAI Lab" and "MINN HAI (Human-centered AI)
Lab" do not all start with the same one. Also rejected: a monogram, a mark, or
anything that would be a branding decision nobody asked for.

---

## D-015 — TODO markers are content, not comments

**Status:** proposed · 2026-09-13

Missing content renders as a visible block on the page: `--ink` on
`--paper-sunk` with a heavy rule, naming what is missing, who supplies it, and
its tracker.

CLAUDE.md asks for a visible gap rather than a plausible fabrication. Astro
strips `{/* */}` comments from output entirely, so a marker written that way is
invisible in the built page — the opposite of what was asked for.

Deliberately never `--claim`. That colour means a model asserted something
about a person, and an editorial note is not that.

The site currently carries five. A test fails the build if any of them does not
name what is missing, who supplies it, and a tracker.

**Rejected:** HTML comments, a build-time warning, a separate list. All of them
let an unfinished page look finished.

---

## D-016 — Interactive targets are sized in rendered pixels, not viewBox units

**Status:** proposed · 2026-09-13

Each attempt's hit area is a transparent rect spanning its whole slot, sized so
it clears 24 CSS pixels at a 360px viewport.

The trace scales down to fit. Anything sized in viewBox units scales with it,
so the original 32-unit hit circles rendered at 12 physical pixels on a phone —
half the WCAG 2.5.8 minimum, on exactly the devices where the pointer is a
finger. It looked correct in the markup and only appeared on measurement.

Adjacent targets touch rather than overlap, so there is no dead space between
them either.

The constraint is tight enough to bind on the layout: ten targets in 264px is
24px each with nothing to spare, which is why the panel's padding narrows below
640px. The floor is asserted in the browser at four widths, because the
arithmetic depends on CSS the unit tests cannot see.

---

## D-017 — Attribution is a single-flip counterfactual

**Status:** proposed · 2026-09-13

"Which attempts carry the estimate" is answered by flipping each attempt in
turn, re-running the sequence, and measuring how far the final estimate moves.
The top three above a threshold are marked.

This is not a Shapley value and does not account for interactions: flipping two
attempts together can move the estimate differently from the sum of flipping
each alone. For a ten-step trace whose job is to make attribution legible, the
single-flip version is the one a reader can verify by clicking the same
attempt, and being checkable matters more here than being exactly additive.

The threshold is half a percentage point, tied to the display rather than
chosen: the estimate is shown as a whole percentage, so anything below that
could be flipped without changing the number on screen.

A consequence worth stating: after a long correct run the model saturates and
nothing clears the threshold, so the view says no single attempt is carrying
the estimate rather than naming a top three regardless.

---

## D-018 — Text that must stay legible lives outside the drawing

**Status:** proposed · 2026-09-13

The axis labels and the synthetic-data stamp are HTML positioned over the SVG,
not `<text>` inside it.

SVG text scales with the viewBox. At 390px the trace renders at 0.42 of nominal
and 15px type became 6px — DESIGN.md sets a 15px floor for `--ink-muted`, and
six is not a near miss. HTML text keeps its size at every width; percentages
derived from the geometry constants re-attach it to the right rows.

The cost is that an exported SVG no longer carries its own labels. That is worth
it: a label nobody can read is not a label.

---

## D-019 — Navigation shows only what exists

**Status:** proposed · 2026-09-13

The header links built pages and nothing else. `src/data/navigation.ts` carries
a `built` flag per page; the footer names the unbuilt ones in prose so the gap
is stated rather than hidden.

Three of the four pages in the information architecture are Phase 3. A nav that
links them would 404, and sending a reader from one missing page to another is
worse than a site that admits its scope. The 404 page follows the same rule.

**Rejected:** greyed-out nav items, which look like a bug; and linking them
anyway, which is one.

---

## D-020 — Motion is interpolated in JavaScript, not transitioned in CSS

**Status:** proposed · 2026-09-13

The estimate animates by interpolating path coordinates frame by frame, with
the D-010 bezier curves evaluated in JavaScript, rather than by handing a CSS
transition the `d` property.

Two reasons. `d` is animatable in Chromium and Safari but not reliably in
Firefox, and DESIGN.md says the movement of the estimate *is* the information —
losing it in one browser would lose the point of the widget there.

And it makes the reduced-motion path exact. DESIGN.md warns against setting a
duration to zero on a transform because it produces a jump; interpolating in
JavaScript means the animation can be skipped outright instead.

Cost: roughly 40 lines of bezier solver, and motion that cannot be tuned from
the stylesheet. The durations and curves are still read from the tokens at
runtime, so DESIGN.md stays the source.

---

## D-021 — The font is not preloaded

**Status:** proposed · 2026-09-13

Literata ships as two `unicode-range` subsets and neither is preloaded.

Preload is not free. `unicode-range` exists so a browser fetches only the
subsets it needs, and a preload link overrides that by asking unconditionally.
Preloading both cost 152.8KB on a first visit; without it the browser fetches
83.8KB, because no glyph on the site falls in latin-ext today.

Preload earns its place when a font is discovered late, behind a stylesheet
round trip. Astro inlines these `@font-face` rules into the head, so there is
no round trip to save.

Measured layout shift is 0.0000 either way — the metric-matched local fallback
was doing that work, not the preload.

The latin-ext subset stays available and will be fetched the moment an author
name needs it, which is when it should be.

---

## D-022 — D-020 named the wrong browser

**Status:** proposed · 2026-09-13

D-020 says the estimate is interpolated in JavaScript because "`d` is
animatable in Chromium and Safari but not reliably in Firefox". That is
backwards, and it was asserted rather than measured.

Measured on 2026-09-13, transitioning `d` on an SVG path:

| Engine | Transitions `d` |
|---|---|
| Chromium | yes |
| Firefox | yes |
| WebKit | no |

Firefox does it. WebKit does not: the mid-flight computed value is still the
start value, so the path snaps at the end of the transition.

**The decision stands, the reasoning does not.** Safari is not a browser this
site can animate differently in, and DESIGN.md says the movement of the
estimate is the information — so a CSS transition on `d` would drop that
information for every Safari reader. The second reason in D-020 is unaffected:
interpolating in JavaScript is what lets the reduced-motion path skip the
animation outright rather than zero a duration.

D-020 is left as written, per the rule that existing entries are not edited.
This entry is the correction.

The lesson is the cheaper half. The claim was plausible, it was about a
browser I had not run, and nothing in the suite would have caught it — the
whole test suite was Chromium-only until T-51. It now runs in all three.

---

## D-023 — The dark instrument field supersedes the light six

**Status: adopted.** The brief's aesthetic override replaces everything in
`DESIGN.md` about colour, and lifts its bans on glass, backdrop blur,
gradients, shadows and scroll-triggered motion along with the one-island rule
in `CLAUDE.md`.

The field: `--field #070B10`, `--field-2 #0C121A`, `--surface` white at 4.5 per
cent, `--surface-edge` white at 10 per cent, `--text #E6EDF3`, `--text-muted
#8A9BA8`, `--signal #FF3D5A`, `--grid` white at 6 per cent. Glass is
`blur(16px) saturate(120%)`, a one-pixel edge and a four-pixel radius, and is
never nested.

The reference point named in the brief is scientific telemetry — precise,
thin-stroked, high-density — rather than frosted consumer panels, and that is
what decides the borderline cases. It is why the glass carries a hairline edge
rather than a soft one, why `--signal` appears only where a model has asserted
something, and why there are no soft shadows anywhere despite the ban on them
being lifted.

`--signal` on near-black is, in the abstract, the "near-black with one bright
vermilion accent" that `CLAUDE.md` bans by name. The brief asks for it by hex
value and restricts it to model outputs, which is the discipline that makes it
information rather than decoration. The conflict is recorded rather than
resolved: Q-19.

Contrast was measured against the glass composite rather than the field, and
the table is in the header of `tokens.css`. The tightest case in the system is
`--text-muted` on glass over `--field-2` at 5.93:1, which is the first thing
that fails if the surface alpha ever rises.

---

## D-024 — An artefact says what its data is, on its face

**Status: adopted.** Every one of the four artefacts carries a provenance line
in its label bar — "Synthetic data", "Illustrative structure", "Openly licensed
photograph, computed saliency", "Real tokenisation, illustrative attention" —
and a note underneath that spells out which half of it is which.

This is the load-bearing decision of the whole build. Three of the four
artefacts are partly invented, and each one is more convincing than the thing
it stands for: a knowledge-tracing curve looks like a recording of a learner, a
Bayesian network looks like a learned structure, attention arcs look like a
model's weights. A convincing picture of invented data is the single worst
thing an academic site can publish, and it is worst precisely because it does
not look wrong.

The split is drawn at the finest grain that is honest. Artefact 4 does not say
"illustrative" and leave it there: the tokenisation really is real and really
is tested, and only the attention is a surface-feature kernel. Saying less than
that would undersell the artefact; saying more would be the fabrication.

`src/e2e/artefacts.spec.ts` fails if any of the four labels goes missing, and
the provenance note has its own attribute hook so a selector cannot quietly
stop matching it.

---

## D-025 — The 3D view is a second view, not a second artefact

**Status: adopted.** The Bayesian network exists twice: a static SVG placed at
build time by a deterministic force simulation, interactive with a small
script; and a three-dimensional scene that loads on an explicit click.

Both are handed the same `NODES` and `EDGES` and both call the same
`markovBlanket()`, so they cannot disagree about what the network is. Selecting
a node in either updates both.

The 3D layer is reached by a dynamic `import()` inside the click handler, which
is what makes Vite emit it as its own chunk. It is 361KB gzipped — three and a
half times the hundred-kilobyte threshold in `CLAUDE.md` — and one edit away
from being a static import that every visitor pays for. `islands.spec.ts` fails
if it is requested on page load, and fails again if a modulepreload hint
appears for it. The button names the cost before it is pressed.

Trackball controls rather than orbit: OrbitControls threw out of its own
pointer bookkeeping on every click on a node. The slow rotation is eleven lines
in the label loop instead of `autoRotate`, and it stops on the first pointerdown
or wheel — which is better behaviour than the built-in anyway, since it stops
sliding a node out from under a cursor that is trying to aim at it.

---

## D-026 — Labels live outside the projection, in both dimensions and three

**Status: adopted.** Extends D-018 to the 3D scene.

Text inside a scaled `viewBox` scales with it, which is why the 2D network's
labels are HTML positioned by percentage over the drawing. The same argument
holds for a perspective projection, and more strongly: a sprite in the scene
gets smaller as it recedes, and the node that has receded is often the one you
are trying to read.

So the 3D labels are HTML too, positioned every frame from
`graph2ScreenCoords`, at a fixed CSS size. They fade to half opacity outside
the current Markov blanket, which is the same statement the colours make —
given the blanket, the rest is irrelevant — applied to the type.

The side benefit is that the 3D layer needs neither `three-spritetext` nor a
texture atlas to say "Prior knowledge".

---

## D-027 — The design canvas is the design

**Status: adopted, 2026-09-14.** Kaung supplied a Claude Design canvas —
`MINN HAI LAB UI Design/MINN HAI LAB.dc.html` — and asked for the whole UI
changed to it. It supersedes `DESIGN.md` and the brief's aesthetic override
(D-023) on every visual point. Where it and `CLAUDE.md` disagree, the canvas
wins and the disagreement is written down (Q-25).

What it specifies, read off the file and recorded in `tokens.css`:

- **Field** `#06080A`; raised ground `#0C1013`; ink `#E6EDF0` at 1, .72, .62,
  .55, .5 and .45; display `#F2F6F8`; one red. The canvas's red is `#D61A4A`,
  which is 3.9:1 on the field; the site's is `#E63360`, the same hue at the
  darkest lightness that clears 4.5:1, so a 12px readout in it is legible.
- **Type** Literata at weight 300 for display and names; Space Grotesk for
  every paragraph, label, control and navigation link. Body 17px, small
  13.5px, label 12.5px, micro 11.5px. The hero line is 54px in 2a and 80px in
  1a; page titles 52px; programme names 30px.
- **Layout** full-bleed sections ruled with a 10% ink hairline, 44px side
  padding on a wide screen, rows of `200px | 1fr | 300px`, content-page
  header bands of 280px with a 3D field behind a veil, a 300px closing band.
- **Radii** 2px on a button, 4px on a panel, a pill on a tab. Nothing else.
- **Motion** a 7px status light that breathes; fields that turn slowly and
  answer the cursor; the reach, which answers the cursor's distance from the
  centre. All of it still under `prefers-reduced-motion`.

What the canvas leaves to judgement, and what was decided:

- The canvas is desktop-only. Below 900px the row collapses to one column, the
  band's field fills the band behind a stronger veil, the header's button
  steps out, and the hero's copy sits on a dark rise so it reads over the
  hands.
- The canvas's lattice field is replaced by its bayes field everywhere, for
  the reason in Q-25.
- The canvas's "Join" page is a section on `/about`, alongside contact,
  because both are gaps waiting on the same person.

---

## D-028 — The canvas is copied, not interpreted

**Status: adopted, 2026-09-14. Supersedes D-023 to D-027 and every earlier
visual decision.**

Kaung's instruction: throw away the previous UI entirely, follow only the
design in `MINN HAI LAB UI Design/`, and copy its code into the site. So the
site is now the canvas transcribed — direction 2a as the hero, direction 1d as
the rest — with its own inline styles, values and copy, on one page.

What that removes: the four artefacts, the token system, the self-hosted
fonts, the ported Three.js module, the browser suite built around all of it,
and the documents that described them. `git log` has them.

What the transcription touches, and only this:

- the design viewer's `x-import` wrapper becomes the `<mh-bg>` element it
  wrapped; its `sc-if` and `{{ }}` template bits become the tab state they
  stood for, in twelve lines of script copied from the canvas's own;
- the canvas's internal links become the page's anchors;
- 1d's header is dropped because 2a's is the page's;
- three grids get a class so they stack on a phone.

The scene and the fields are the canvas's files, copied to `public/design/`
untouched. Three.js comes from unpkg with the canvas's integrity hashes.
Fonts come from Google Fonts, as the canvas loads them.

The canvas's copy is on the page as written, including its claims about
partners, a teaching assistant and hiring. Those are Kaung's to confirm; the
canvas's own `TODO:` markers for the paper detail and course materials stay.


---

## D-029 — Full width, every screen

**Status: adopted, 2026-09-14.** The transcribed canvas was centred at its
artboard width with the field showing either side. Kaung asked for the site
at full scale on every device, the way a Bootstrap grid behaves. The page now
fills the screen and scales the artboard's gutters, grids and display sizes
through Bootstrap's own breakpoints; the rules are in one block at the top of
`src/pages/index.astro` and described in `design/DESIGN.md`. The canvas's
values at 1400px and above are unchanged.

---

## D-030 — Real content replaces the canvas's placeholders

**Status: adopted, 2026-09-16.** Kaung supplied the lab's actual bio,
publication lists, funders and contact address. Every synthetic or invented
figure the canvas carried is removed and replaced with this, or with nothing:

- **Publications.** The canvas's "Paper detail template" — a single mockup
  reading `awaiting source`, pointing at a `src/data/publications.ts` that no
  longer exists in this build — is gone. Each programme row now lists its own
  real publications (nine for personalised learning, five for interpretable
  models) as dense ruled rows: short name, venue, year, a `code` tag where one
  exists. No paper or code URLs are supplied, so none are invented — the tag
  is inert, not a link. "Q-matrix Reinment" and "e-Learning" are reproduced
  exactly as given rather than silently corrected, per the standing rule
  against altering a supplied fact.
- **Funding.** A new section lists the seven funders by name, verbatim.
- **Contact.** `sein.minn.cs@gmail.com` is now a live `mailto:` — on the
  closing band's "Partner with the lab" button, as visible text beside it,
  and on the footer's "Contact" link.
- **The fabricated model.** Every occurrence of the invented `0.71 ± 0.09`
  mastery figure is gone: the "Live model output" panel in the Deep Field
  section, and the same figure repeated in the (now-removed) teaching
  assistant panel. Kaung's own words: "We don't have the model yet."
- **The teaching assistant.** Removed entirely — tab, panel, worked example,
  and the shared "Request access" / "Read the docs" / "Works with JavaScript
  disabled" row beneath it, none of which described anything that exists.
  The Learning panel is now two tabs: StatLab (linked to
  `minn-hai-lab.github.io/statLab`) and Course materials (still an honest
  gap).
- **Capability claims that don't hold.** "Deployed with partners — education,
  health and public-sector pilots" and "Established research group" are gone:
  Kaung's own words this round were "we are new" and that these programmes
  "are not operated in our lab now." The Deep Field kicker drops "active"
  alongside them; both programme rows drop their "Active" status line.
  "Live trace widget" and "3D blanket graph, click to load" — tags naming
  interactive features that do not exist in this build — are removed with
  the demo content they described.
- **"People" → "Members."**
- **The mastery bar chart and the network-preview caption.** The fake
  "Mastery estimate over 10 attempts" chart in Programme 01's row is gone;
  that row now runs two columns (`200px | 1fr`) instead of three, since there
  is nothing honest to put in the third. Programme 02 keeps its small field
  preview but loses the caption "Loaded on interaction, never on page load,"
  which was never true of this build (the field is a canvas animation, not a
  click-to-load 3D graph).
- **The cursor hint.** "Move the cursor to the centre." is removed from the
  hero.
- **Wording.** "Intelligence you can interrogate." → "observe." Deep Field's
  paragraph drops "Every estimate on this site can be opened, questioned and
  traced back to the model that made it" — there is no model to trace back
  to. The Signal Plane's `±0.09 / reported with every estimate` stat is
  removed; "open toolkit, StatLab" becomes "open learning resource, StatLab."
  The Research section's kicker no longer claims "a live artefact you can
  operate."

**New class:** `.mh-row--full` — a programme row with no third column, at the
same `200px | 160px | one column` steps as `.mh-row`, minus the aside.

**Left as found**, pending a direct answer rather than an inference: "We are
hiring research engineers" and "See open roles" / "Open roles." Nothing this
round confirmed or denied them, unlike the deployment and status claims above,
which Kaung's own message directly contradicted.

---

## D-031 — The forearms are ten times the artboard's length; the network field moves up

**Status: adopted, 2026-09-16.** Two follow-ups to D-029's full-width layout.

Five times the artboard's original arm length (2.8 units → 14) still left the
ends visible on a 16-inch and wider display. They are ten times now (28
units), with the camera's far plane pushed out to 220 to keep them in the
draw distance at any zoom. Verified clean at 3440×1440.

The Deep Field section's network graphic spanned nearly the whole vertical
frame (`top:70px` to `bottom:90px` of a `min-height:100vh` container),
reaching down far enough to visually merge with the three-column strip below
it and, on a short viewport, the section boundary after that. It now sits in
a fixed band nearer the top (`top:40px`, `bottom:260px`), clear of both.

---

## D-032 — The prism's white highlight is gold; the prism itself is still steel

**Status: adopted, 2026-09-16.**

The small reflective octahedron at the centre of the hero's instrument field
(`core` in `hands-scene.html`) is a `steel` material — dark, picking up the
scene's blue fill and pink rim like every other metal part. Kaung asked for
yellow added to its reflection.

The first attempt (`879a8cf`) replaced its material outright with a flat gold
`MeshPhysicalMaterial`, matching colour and emissive — gold from every angle,
independent of what it was reflecting. Kaung rejected this: the whole colour
scheme was fine as it was; only the white highlight — the near-white key
panel every metal surface in the scene reflects — should turn yellow, not the
prism itself.

**Fix:** the `core` mesh keeps its `steel` clone — same base colour, same
roughness, same metalness, still reflecting the scene's dark ambient, blue
fill and pink rim exactly as before. Only its `envMap` differs, pointing at a
second lighting rig (`envGold`) that is identical to the main one except the
near-white key panel is a warm gold instead. Two follow-on problems surfaced
and were fixed in the same pass:

- `THREE.PMREMGenerator.fromScene()` reuses internal render-target buffers
  across calls; calling it a second time on the same generator for the second
  rig produced a corrupt, effectively black texture regardless of the rig's
  actual brightness. Fixed with a second, independent `PMREMGenerator`
  instance dedicated to the gold rig.
- Once the generator was fixed, the highlight read as a muddy brown rather
  than gold — the roughness-blurred, tonemapped reflection was simply too dim
  to hold its hue. Fixed by raising the gold panel's intensity and lowering
  `core`'s roughness slightly (0.3 → 0.16) for a crisper, brighter catch,
  without touching its colour.

Verified across a full rotation: the highlight sweeps through as a clean warm
gold on whichever facet catches the panel, while the rest of the shape stays
its usual dark, blue or pink — matching what the white highlight did before,
recoloured, not replaced.

---

## D-033 — The orbiting prisms are gold, not pink

**Status: adopted, 2026-09-16.** Kaung asked for the small octahedra
orbiting the ring (`nodes` in `hands-scene.html`) to be yellowish instead of
pinkish.

A third of them (`i % 3 === 0`) used `glow`, the scene's red accent
material — the same one the robot hand's rings and the two arcs use. A new
material, `glowGold` (same shape, same emissive intensity, coloured
`0xf2bb3e`), replaces `glow` for these ten nodes only. The rings, the arcs and
the robot hand's emissive parts keep the red — this is scoped to the
orbiting nodes, not a change to the scene's accent colour generally.

---

## D-034 — The tick ring is gone; the pink arcs stay

**Status: adopted, 2026-09-16.** Supersedes an earlier same-day attempt at
the pink arcs, reverted (`263c4bc`) once Kaung asked for it back.

Kaung first flagged a dashed-looking line on the ring. The first fix removed
`arc` and `arc2`, the two partial red torus overlays, on the theory that one
of them z-fighting against the base ring was the cause. Kaung reverted that —
the pink arcs were wanted after all — and pointed at the actual dashed
element directly: a large, faint circle outside the ring that is genuinely
built from discrete pieces, not a rendering artefact.

That element is `ticks`: a `THREE.Group` of 96 small boxes (a taller one
every eighth) arranged around a circle of radius 2.15, standing in for
gauge marks on an instrument dial — part of the "rings, ticks, a wireframe
icosahedron, a glowing arc" instrument field the hero was designed around
(`design/DESIGN.md`). Removed, along with its per-frame rotation. `arc` and
`arc2` are back to how the canvas had them.

---

## D-035 — The two arcs are gold, like the rest of the reach scene's accent

**Status: adopted, 2026-09-16.** Kaung asked for `arc` and `arc2` — the two
partial rings on the ring, restored in D-034 — to be yellowish, matching the
prism and the orbiting nodes.

Unlike the prism (D-032), which is a reflective steel material recoloured
only in its environment highlight, `arc` and `arc2` use `glow`, the same flat
emissive material the orbiting nodes used before D-033. Same fix as that
decision: swap the material for `glowGold`. Nothing else about their shape,
size or motion changes.

---

## D-036 — The hiring claim is removed, not just left unconfirmed

**Status: adopted, 2026-09-16.** Resolves the open question D-030 and
`docs/phase.md` had been carrying: "We are hiring research engineers." (the
card at the foot of Members) and the two "Open roles" / "See open roles"
buttons (Members and the closing band) were canvas placeholders nothing
supplied so far had confirmed or denied, so D-030 left them as found rather
than guess. Kaung has now asked for the section removed outright, which
settles the question the other way from a guess: not "confirmed true" but
"not stated, so not shown." All three instances are gone —
`src/pages/index.astro`'s Members section ends at the portrait grid, and the
closing band's button row is just "Partner with the lab." `docs/phase.md` and
`docs/plan.md` no longer list this as outstanding.

---

## D-037 — Back to five pages, split where Kaung drew the lines

**Status: adopted, 2026-09-17.** Supersedes D-028's "the canvas is copied,
not interpreted, onto one page" and D-029's full-width single page, for
structure only — the transcription rule itself, and everything transcribed
under it since, stands.

Kaung asked for the single page cut into five: Home (the reach through
Signal Plane), Research (the research band through Programme 02), Learning,
Members, and Partner with us (Funding through the closing band) — his own
boundaries, given directly, not inferred from the canvas's own direction
breaks (which run 2a / 1a / 1b / 1c / 1d, not five even pieces).

**Structure.** `src/layouts/Layout.astro` now holds what used to be
`index.astro`'s shared chrome — the fixed header, the closing footer, the
stylesheet, the pointer-forwarding and tab-switching script — as a layout
every page wraps itself in. `index.astro` keeps the reach and the three
hero directions; `research.astro`, `learning.astro`, `members.astro` and
`partner.astro` are new, each the canvas's own markup for its span,
unchanged. The Members section's `id` moves from `people` to `members`, to
match the nav label D-033 already renamed; everything else's ids, classes
and inline styles are untouched.

**Two things a single scrolling page didn't require, that five pages do:**

- Every same-page anchor a nav link, a CTA or the footer used (`#research`,
  `#learning`, `#people`, `#join`) is now a page route instead
  (`${base}/research`, etc.), including the wordmark, which now points at
  `${base}/` rather than `#top`.
- The fixed header floats over whatever is at the top of a fresh page load,
  same as it always floated over whatever was scrolled to the top of the
  single page. Research's own header band is full-bleed and dark, so this
  was already accounted for; Learning, Members and Partner's first sections
  are plain gutter sections that would otherwise load with their heading
  sitting behind the translucent header. Their wrapper carries
  `padding-top:96px` — reusing the 96px already established site-wide for
  `[id]{scroll-margin-top}` — to clear it. This is a structural fix for a
  collision the split introduced, not a restyle of the canvas's own
  sections, which are otherwise byte-for-byte what they were.

**Routing.** `/people` and `/about` redirect to `/members` and `/partner`,
where their content now is. `/research` and `/learning` need no redirect —
those routes existed before the single-page detour and exist again now, at
the same place.

---

## D-038 — The footer's link row is gone

**Status: adopted, 2026-09-17.** Kaung asked for the footer's five links —
Research, Learning, Members, Join, Contact — removed on every page. Since
D-037 made the footer shared layout chrome in `src/layouts/Layout.astro`,
one edit there does that. What remains is the lab name and "Human-centered
AI"; the header nav and mobile menu, which carry the same routes, are
unchanged.

---

## D-039 — The footer sits at the true bottom of every page, never on grey

**Status: adopted, 2026-09-17.** D-037 split the single page into five;
Learning, Members and a short Funding list are all shorter than a typical
viewport now, where the single page never had been. Below their footer,
`body`'s own `#15181b` — "the design viewer's own ground," never meant to
be seen — showed through, and the footer sat wherever the short content
happened to end rather than at the foot of the screen. Kaung asked for
spacing there instead, the footer pinned to the page's actual end, and no
grey.

Standard sticky-footer CSS: `.mh-page` is a column at least the height of
the viewport; its one flexible child, a new `.mh-main` wrapping `<slot />`,
carries `flex:1 0 auto` and the same `#06080A` every section already uses,
so it grows to fill whatever room is left and the footer lands at the
bottom of the viewport on a short page, or right after the content on a
tall one, exactly as before. Home and Research, both already taller than
any viewport, are unaffected — confirmed at 900px and 1400px tall.

---

## D-040 — The five members are named, with photos

**Status: adopted, 2026-09-17.** The last placeholder content on the
Members page. Kaung supplied a photo for each of the five frames and, for
four of the five, an unambiguous role:

| Name | Role | Photo |
|---|---|---|
| Dr. Sein Minn | Founder | `Sein_Minn.jpg` |
| Aung Khant Maung | Research Assistant | `Aung_Khant_Maung.jpg` |
| Thet Htun Swe | Research Assistant | `Thet_Htun_Swe.jpg` |
| Kaung Hein Htet | Research Assistant | `Kaung_Hein_Htet.jpg` |
| Win Htut Naing | Research Assistant | `Win_Htut_Naing.jpg` |

For the first, Kaung wasn't sure of the formal title and asked directly
whether "Founder" was a reasonable label. It is: the frame was already
earmarked "Principal investigator" as a placeholder, the lab's own copy
calls itself a new research group, and "Founder" is a plain statement of
a fact Kaung is confident of, not a guess at a formal title he isn't — so
it stands, on his say-so, rather than being left as another `TODO:`.

**Photos.** Kaung dropped the five originals (3000×3000, 600KB–1.3MB each)
in a `pics/` folder at the repo root. Resized to 900×900 and recompressed
with `sips` (82–155KB each) into `public/members/`, which the page reads
with `object-fit:cover` filling the same 4:5 frame the placeholder used.
`pics/` itself is gitignored — the source files aren't needed once the
resized copies are committed, and 3MB of full-resolution portraits has no
reason to sit in the repository's history.

The "Principal investigator, researchers, students" line by the section
heading is removed, per Kaung's request — it described the placeholder
grid's range of roles in the abstract, which five named, real people with
real titles no longer need.

---

## D-041 — Two captions removed from Home

**Status: adopted, 2026-09-17.** Kaung asked to remove Lattice's caption
row — "Move the cursor — the lattice is the lab's Markov-blanket graph, not
decoration" and, beside it, "node in the blanket of the target variable" —
and Signal Plane's "The plane deforms around the cursor: a live surface,
drawn from the model's own response curve."

Lattice's row held only those two pieces, so the whole row is gone.
Signal Plane's row held the caption on the left and the "2 research
programmes / 1 open learning resource, StatLab" stats on the right in a
`space-between` flex row; removing the caption alone would have pulled the
stats to the left edge where the caption used to sit, so that row is now
`justify-content:flex-end` to keep the stats where they were, at the
right, with nothing to their left.

---

## D-042 — Research: three themes, side by side, not two stacked rows

**Status: adopted, 2026-09-17.** Kaung asked for four things on the
Research page together: drop the neural-network preview next to
"Interpretable explanation of tabular models"; rename "Programme" to
"Theme"; lay the themes out as columns instead of stacked full-width rows;
and add a third column, Computer Vision, its content to follow later.

**Layout.** The canvas's two rows — `200px | 1fr | 300px` for the row with
the field preview, `200px | 1fr` for the one without — become one row of
three equal columns, `.mh-themes` (new, no canvas equivalent), each a
self-contained card: a small "Theme NN" kicker, the title, the description,
then its publications where it has any. This is what made removing the
neural-network preview straightforward — there was no longer a dedicated
aside column for it to sit in, nor a need for one.

**Computer Vision.** A name and nothing else — Kaung was explicit the
description and publications are still to come. It gets the same `TODO:`
treatment as every other unsupplied fact on the site (`design/DESIGN.md`'s
left-rule marker), not placeholder copy invented to fill the column.

**Responsive.** Three columns at 992px and up, one column below it —
matching the threshold every other grid on the site already collapses at
(`.mh-row` before it, `.mh-three`, `.mh-people`). Column dividers
(`border-right`, inline, on the first two columns) become `border-bottom`
on the stacked columns, skipping the last so it doesn't double up against
the row's own closing rule.

**Copy.** The header band's "Two research programmes, and the publications
behind them." becomes "Three research themes..." — directly required by
adding a third theme, on the same page as the count. The "2 research
programmes" stat on Home's Signal Plane, and "two research programmes" in
its own copy, are untouched: Computer Vision has no content yet, and
changing a claim on a different page wasn't asked for.

---

## D-043 — Deep Field, Lattice and Signal Plane fill the viewport; a rule at the foot of each

**Status: adopted, 2026-09-17.** Kaung noticed Deep Field ("Intelligence
you can observe") wasn't filling the screen — its two-column strip
(Knowledge tracing / Interpretable tabular models) only reached the bottom
once he'd scrolled further. Lattice and Signal Plane had the same fault,
less visible since their content sits centred rather than pinned to an
edge.

**The bug.** Each section is `.mh-frame`: `height:auto` with
`min-height:100vh`, so the section's own box is always at least a full
screen tall. Its content sat in a child carrying `height:100%` — and a
percentage height only resolves against a parent's *specified* height, not
one produced by `min-height`. With the parent's height effectively `auto`
for this purpose, `height:100%` computed to nothing, and the child
shrank to its own content (624px of a 900px screen, measured directly).
The section's dark background, absolutely positioned and unaffected by
this, still covered the full box — so the fault read as empty space
under short content, not a missing background.

**The fix.** The same technique already in `src/layouts/Layout.astro` for
the page footer: the section becomes `display:flex;flex-direction:column`,
and its content child gets `flex:1 0 auto` instead of `height:100%`. A
flex child sized this way fills the section exactly when content is
shorter than a screen, and — unlike the alternative of an absolutely
positioned child stretched with `inset:0`, which would have capped the
section at exactly `min-height` — still grows past it if content ever
needs more, on a narrow phone with heavily wrapped copy, say.

**The rule.** Kaung asked for a line marking the end of each section,
"exactly at the bottom of the screen," the way the hero's own bottom bar
already reads as one (its `border-top`, pinned to the hero's own bottom
edge). Deep Field, Lattice and Signal Plane each get
`border-bottom:1px solid rgba(230,237,240,.1)` on the section itself — the
same rule weight `design/DESIGN.md` already specifies for every other
section boundary on the site, so this isn't a new visual element, just the
existing one finally present here too. Because the fix above makes each
section's rendered height exactly right (a full screen, or taller only if
content needs it), that border always lands exactly at the section's true
end, matching what was asked.

---

## D-044 — Signal Plane: no "new research group," "themes," breathing room at the foot

**Status: adopted, 2026-09-17.** Kaung's follow-up, on the section D-043
just fixed.

"New research group · " is gone from the small label above the headline;
it now reads "Human-centered AI" alone, centred as before. The stats
row's "research programmes" becomes "research themes," matching D-042's
rename on the Research page — the count itself (2) is untouched, since
Computer Vision still has no content behind it.

Kaung reported the stats row "covered and off grid" on a 13-inch and a
16-inch screen, and asked for it moved up. D-043 had just made this
section's content correctly reach the section's true bottom edge — right,
for the background, but the stats row itself sat only 26px off that exact
edge, which is closer than real browser and OS chrome reliably leaves
clear on a real laptop, as opposed to a Playwright viewport with none.
Its bottom padding is now 64px, moving it up without reopening the empty
gap D-043 removed — the section still reaches full height, just with
real clearance at its foot. Checked at 1280×800 and 1440×900 (13-inch) and
1536×960 and 1728×1117 (16-inch): the whole section, stats included, sits
comfortably inside all four with no overflow.

---

## D-045 — Theme 01 had no left gutter at 1400px and up

**Status: adopted, 2026-09-17.** Kaung reported Theme 01 sitting flush
against the left edge of the screen on the Research page, "so close to
the left. It starts at the screen." Confirmed: at any width 1400px or
wider, its column had `padding-left: 0px`, measured directly.

D-042's `.mh-themes` row (the three-column grid replacing the old
programme rows) never got its own left/right padding — `.mh-gutter`'s
breakpoint rules only *override* padding-left/right below 1400px; they
supply no base value above it, which every other `.mh-gutter` element on
the site gets from its own inline `padding`. `.mh-themes` had none. Below
1400px it was never visible, since the narrower breakpoints happened to
supply padding anyway — which is almost certainly why it went unnoticed
at the time.

Fixed with `padding:0 44px` on the row itself, matching what every other
`.mh-gutter` section on the site sets inline (the Research header band
right above it, among others). Confirmed at 1440, 1728 and 1920px: Theme
01 now lines up with the header's wordmark and the "Research" title
above it, and nothing else in the row moved, since only the outer row's
own missing padding was the fault — the individual columns' padding
(0 on Theme 01's left, 0 on Theme 03's right, so the row's own gutter is
the only inset at either end) was already correct.

---

## D-046 — Publications link to their papers and code

**Status: adopted, 2026-09-17.** Kaung supplied a paper URL for every one
of the fourteen publications across Theme 01 and Theme 02, and a code URL
for five of them (IKT, BKT-LSTM, DSCMN, DKT-DSC, LAPLACE — the five
already carrying a `code` tag). This was the last `TODO:` docs/phase.md had
been carrying for the publication lists.

Each short name is now an `<a>` to its paper, opening in a new tab
(`target="_blank" rel="noopener"`, matching the site's one other external
link, StatLab on the Learning page), with a `border-bottom` underline so
the title reads as a link at a glance — the site had no established
convention for an inline text link at this size, so it borrows the
`rgba(230,237,240,.4)` weight already used for "Enter the lab" elsewhere.
Each existing `code` tag becomes an `<a>` to its repository, keeping its
pill styling exactly as it was — no separate visual treatment needed,
since a `code` tag was already legible as a small interactive label.

No publication's short name, venue, year or code claim changed — this
is links added to facts already on the page, not new facts.

---

## D-047 — Deep Field and Lattice are gone from Home; Research zigzags instead of three columns

**Status: adopted, 2026-09-20.** Supersedes D-042's three-column Research
layout, for structure only — the publication data, links and TODO
treatment it established stand. Two changes, given together and related:
Deep Field's network graphic is the reason.

**Home.** Deep Field (1a, "Intelligence you can observe") and Lattice (1b,
"Between human understanding and machine inference") are removed entirely.
Home is now the hero straight into Signal Plane — two sections, not four.
`index.astro`'s frontmatter comment records this; `#deep-field` and
`#lattice`, and their `mh-bg mode="bayes"` and `mode="lattice"` fields, no
longer exist on the page.

**Research.** D-042's three equal columns are gone too — Kaung asked for
two columns per theme instead of three across, alternating which side
carries the text: Theme 01's text is left, Theme 02's is right, Theme 03's
is left again, its visual companion always on the other side. New class
`.mh-zigzag` (`Layout.astro`, replacing `.mh-themes`): two columns at
992px and up, one below, text and visual keeping whatever order they're
written in when stacked.

**The graphic moves, not deleted.** Deep Field's `mh-bg mode="bayes"` —
the Bayesian network visualisation — is Theme 01's visual, panelled the
same way the old programme-02 aside was (`1px solid rgba(230,237,240,.14)`,
4px radius, `#080A0D`), just taller (420px, up from 150px) to carry a full
column instead of a preview thumbnail. Theme 02 and Theme 03's visuals are
placeholders — Kaung named them "Image or 3D object" with nothing to show
yet, so they get the same striped-and-labelled treatment the Members grid
used for unfilled portraits, not an invented image.

Checked: the graphic renders correctly at both 1440px and, scrolled into
view, at 360px (a full-page mobile screenshot caught it mid-draw and
looked blank — a capture-timing artefact, not a bug, confirmed by
screenshotting the element directly after it had settled). `tests/site.spec.ts`
updated: Home's mh-bg count drops from 3 to 1, `#deep-field`/`#lattice`
checks removed, and Research gets an explicit check for the relocated
`mh-bg[mode="bayes"]`.
