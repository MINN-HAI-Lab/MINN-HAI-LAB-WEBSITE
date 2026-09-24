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

---

## D-048 — Theme 01's visual unpanelled, the header's own field dropped, Computer Vision renamed and described, Signal Plane's stats gone

**Status: adopted, 2026-09-20.** Four changes from Kaung in one message,
each independent.

**Theme 01's visual.** The `1px solid rgba(230,237,240,.14)` border and
`#080A0D` background around the relocated network graphic (D-047) are
gone — Kaung wanted the graphic itself, not a panel holding it. It now
sits directly on the page, same `#06080A` behind it as everywhere else in
the row.

**The header band's own field.** `#research`'s `mh-bg mode="lattice"` is
removed. It was decorative texture behind the "Research" title, and with
a real, informative network visualisation now sitting prominently in
Theme 01 just below it, Kaung judged it redundant rather than
complementary.

**Theme 03.** Renamed "Computer Vision" to "Visual generative modeling,"
and given a real description — the last theme still carrying only a
`TODO:` placeholder. Drafted with the `/personal-humanizer` skill, at
Kaung's request, to match Theme 01 and Theme 02's voice rather than read
as generated filler: a definition, then the reason it matters, no more.
Its publications stay `TODO:`, under their own "Publications" label now
(matching the other two themes' structure) rather than folded into one
combined description+publications placeholder — nothing supplied, nothing
invented.

**Signal Plane's stats.** "2 research themes" / "1 open learning
resource, StatLab" is removed from Home's second (now only remaining)
section. Its headline block, already the section's tallest content and
already centred, is now the section's sole content — still centred, still
filling the screen (D-043's flex fix is unaffected, since it was never
specific to having two flex children).

---

## D-049 — Members grouped by rank: Founder, Post Doctoral, Master

**Status: adopted, 2026-09-20.** Supersedes D-040's flat five-person grid,
for structure only — the individual facts it established (names, the
reasoning for "Founder") still stand.

Kaung asked for the grid split into three ranked groups and supplied who
goes where: Founder (Dr. Sein Minn, one person); Post Doctoral (two
people, neither named yet — "two place holders for 2 PHD students in the
Post Doctoral section"); Master (the four already on the page: Aung Khant
Maung, Thet Htun Swe, Kaung Hein Htet, Win Htut Naing).

The two Post Doctoral placeholders read "PhD student," Kaung's own word
for them, even though the group heading above them says "Post Doctoral" —
that mismatch is Kaung's, not smoothed over by guessing which term he
meant. The Master group's four now read "Master's student" rather than
D-040's "Research Assistant," since being placed under "Master" directly
states their standing in a way the earlier generic label didn't.

**Layout.** Each group is its own heading (matching the `19px` Literata
weight Learning's "StatLab" sub-heading uses) over its own `.mh-people`
grid — the same class and card markup as before, just re-run per group.
No layout change was needed for the uneven counts (1, 2, 4): CSS Grid's
explicit `repeat(5,minmax(0,1fr))` tracks keep their size regardless of
how many items occupy them, so Founder's single card sits at its usual
width with the rest of that row simply empty, not stretched.

**Photos.** Kaung re-uploaded all five — a second, better-lit set on a
consistent blue backdrop, replacing the first. Same processing as D-040:
resized from 3000×3000 to 900×900 and recompressed with `sips` into
`public/members/`, same filenames except Aung Khant Maung's (uploaded as
`Aung.jpg`, saved under his full name for consistency with the other
four). The Post Doctoral placeholders use the same striped, labelled
portrait placeholder the whole grid used before D-040's photos existed.

---

## D-050 — A Doctoral group, three placeholders, after Post Doctoral

**Status: adopted, 2026-09-20.** Kaung asked for a "Doctoral" group with
three people, placed after Post Doctoral — no names supplied, so all
three are the same striped, labelled placeholder D-049's Post Doctoral
slots use.

This also resolves a mismatch flagged when D-049 shipped: Post Doctoral's
two placeholders were labelled "PhD student" because that was Kaung's own
word for them at the time, even though it sat oddly under a "Post
Doctoral" heading. With a Doctoral group now genuinely holding PhD-level
placeholders, "PhD student" moves there and Post Doctoral's own
placeholders become "Postdoctoral researcher" instead — a judgement call
inferred from the new group existing, not something Kaung stated
outright, and said so in the response given alongside this change.

Order: Founder, Post Doctoral, Doctoral, Master — matching where Kaung
asked for Doctoral to go. No structural change beyond adding the group
and its three entries; the same per-group heading and `.mh-people` grid
pattern from D-049 handles it without modification.

---

## D-051 — The header nav's three links match the wordmark's brightness

**Status: adopted, 2026-09-20.** Kaung noticed Research / Learning /
Members read greyer than the rest of the header. They were
`rgba(230,237,240,.62)`; the wordmark and "Partner with us" are full
`#E6EDF0`, and so, already, was the mobile menu's copy of these same
three links — the desktop row was the one inconsistent with everything
else in the header, not the other way round. Changed to `#E6EDF0` to
match.

---

## D-052 — Light is the default theme; dark is secondary, kept, toggled

**Status: adopted, 2026-09-20.** The largest change to how the site is
built since D-037's split into five pages — recorded here in full because
it touches `CLAUDE.md`'s own design-authority rule, not just a page.

Kaung asked for a light theme, made default, with dark kept as a
secondary theme rather than replaced. Two decisions were needed before
touching any code, so I asked rather than guessed, since either answer
would have meant materially different, and largely wasted, work if wrong:

1. **How to switch.** "Dark theme is secondary" implied dark had to stay
   reachable, not just removed — a visible toggle, remembered per visitor,
   versus following system preference with no control, versus light only
   for now. Kaung chose the toggle, so that's what's built: a button in
   the header, next to "Partner with us", labelled with the theme a click
   will switch *to* ("Dark" showing in light mode, "Light" in dark). The
   choice is kept in `localStorage` and re-applied by an inline script at
   the very top of `<head>`, ahead of the stylesheet, so there is no flash
   of the wrong theme on load. No attribute on `<html>` means light; the
   script and the toggle both only ever add or remove `data-theme="dark"`
   — so a JS failure still degrades to the correct default rather than an
   unstyled or wrong-themed page.

2. **The 3D hero and the canvas fields.** `mh-bg.js` draws its lines with
   `clearRect` — a transparent canvas, no fill of its own — relying
   entirely on whatever sits behind it for contrast. Relighting the 3D
   scene and redrawing the fields' colours for a light backdrop was one
   option; Kaung chose the other: leave them the canvas's dark always,
   theme everything else. This bounded the whole task precisely, once the
   `mh-bg` usages were inventoried: `index.astro`'s `#top` (the 3D scene)
   and `#signal-plane`, and Partner's `#join` — both full sections whose
   *entire* background is a field, kept dark end to end — and Research's
   Theme 01 panel, which holds a field but sits inside an otherwise
   themed page, so only that one panel stays dark. (The research header
   band's own field was removed already, in D-048 — nothing to exempt
   there.)

**Architecture.** Every colour the canvas specified as a literal value —
hex or `rgba()` — is now a CSS custom property in `src/layouts/Layout.astro`:
`--field-rgb`, `--ink-rgb`, `--display-rgb`, `--accent-rgb`, each an
`R,G,B` triplet, plus `--field`/`--ink`/`--display`/`--accent` as `rgb()`
convenience forms for a solid fill. Light values sit on `:root`; dark —
the canvas's own values, unchanged — override under `[data-theme="dark"]`.
Using a triplet rather than one token per exact colour+alpha combination
means the canvas's own alpha values carry across untouched:
`rgba(230,237,240,.62)` becomes `rgba(var(--ink-rgb),.62)`, not a new
`--ink-62` token, so the same twenty-odd steps of the canvas's own
hierarchy — from full ink down to the faintest rule — hold in both
themes without re-deriving each one by hand. `research.astro`,
`learning.astro`, `members.astro` and `partner.astro` were converted this
way, mechanically, checked file by file afterward for anything the literal
patterns missed (two `rgba(6,8,10,…)` gradients read as numbers, not hex,
so a plain `#06080A`→token pass didn't catch them).

`index.astro` needed no conversion at all — both its sections (`#top`,
`#signal-plane`) are exempt, so the file is untouched, still the canvas's
literal dark. The four exempt containers themselves keep or gained a
literal `background:#06080A` of their own (Theme 01's panel and Partner's
`#join` had none before — nothing was covering the transparent canvas
except the *page's* background, which D-048 assumed would stay dark
forever, hence "no border, no background" there. It doesn't anymore, so
each got one back) — and anything drawn *inside* an exempt container
keeps the canvas's literal ink too (`#join`'s headline and button, which
D-052's own file-wide token pass initially swept up before this was
caught and reverted specifically there).

**Light palette.** New, since the canvas only ever specified dark:
`--field-rgb: 239,241,242`, `--ink-rgb: 28,40,48`,
`--display-rgb: 10,16,20`, `--accent-rgb` unchanged (`214,26,74`). Not
arbitrary — the field and ink values are D-003's `--paper` and `--ink`
almost exactly, the palette proposed for this site before the canvas
became its design authority (D-027) and set aside, not because it was
wrong, but because the canvas superseded it. A light theme gave it
somewhere to go.

**`CLAUDE.md`** is amended to carry this as a named exception to "do not
restyle, re-tokenise" — colour only, and only as light-default with the
canvas's dark preserved exactly as a secondary theme; every other
property is still transcribed literally. `design/DESIGN.md` gets a
"Theme" section with the full token table.

**Verified:** every page in both themes at 1440 and 360px; the toggle
sets `data-theme`, updates its own label, and persists across a full page
navigation and a reload (confirmed via `localStorage`, not just the DOM
attribute); dark mode screenshots pixel-match what shipped before this
decision; no horizontal overflow at 360px on any page in either theme.
`tests/site.spec.ts` gained a dedicated theme test alongside the existing
five.

---

## D-053 — Icon toggle, moved to the end; the 3D hero themed after all

**Status: adopted, 2026-09-20.** Two follow-ups on D-052, the same day.

**The toggle.** Kaung called the "Dark"/"Light" text button "ridiculous"
and asked for day/night icons instead, and asked whether its position —
first in the header's right-hand cluster, before Menu and the nav — was
the best one, open to moving it. Replaced with two inline SVGs (a filled
moon and a sun, matching the site's thin-stroke line weight, `1.3px`, no
emoji per the site's own content rule), one shown at a time, the visible
one still showing what a click switches *to* — moon in light mode, sun in
dark — same semantics as the text version, an icon instead of a word.
Moved to the end of the cluster, after the nav (after Menu on a narrow
screen), the position most theme toggles on real sites use: the least
central control in the header sits last, not first.

**The 3D hero.** D-052 kept the hero's 3D scene dark always, on the
reasoning that relighting it for a light backdrop was a bigger, separate
piece of work — Kaung's own recommended choice at the time, from a
question I asked before starting. He came back and asked for it anyway:
white background, dark foreground "or accordingly." Investigating what
that actually required turned out better than the original estimate
suggested:

- The scene's `<canvas>` was already transparent (`alpha:true`, no clear
  colour ever set) — its "background" was always whatever sat behind it
  on the page, meaning `index.astro`'s `#top` div (now tokenised like the
  rest of the site) is the entire fix for the backdrop. Nothing inside
  `hands-scene.html` needed to change for that part at all.
- Of the materials, only the wireframe icosahedron (`wire`/`wireDim`,
  `0x9fb3bf` at low opacity) is coloured for a dark backdrop specifically
  — light-on-dark, and close to invisible light-on-light. Everything
  else — skin, steel, graphite, the glowing rings — already reads on
  white. Steel in particular needed no change at all: it's a
  metalness-1 material reflecting a separately-lit, fixed environment
  rig (D-032's gold-highlight work), so what it renders is governed by
  that rig, not by the page around it — confirmed by screenshotting the
  central prism through a full rotation on a white page, where it read
  as a clean, consistently dark shape at every angle, exactly as it does
  on dark.
- What the earlier estimate had right: the scene runs in an iframe, a
  separate document with its own `window`, so the parent page's CSS
  custom properties can't reach into it, regardless of how small the
  actual colour change turned out to be. `Layout.astro`'s script now
  tells the scene which theme is active over `postMessage` — once,
  answering a `{type:'mh-ready'}` the scene sends once its own message
  listener is registered (three.js loads from a CDN first, so guessing a
  fixed delay instead would have been a race), and again on every toggle.
  `wire`/`wireDim` default to light's colour at construction (the site's
  own default), corrected immediately if dark turns out to be active.

**Scope, held to what was asked.** "3D objects" was Kaung's own phrase,
and the three sections whose background is a live `mh-bg` *canvas* field
— not 3D, a 2D transparent-clear canvas drawing — are unaffected:
`#signal-plane`, Partner's `#join`, and Research's Theme 01 panel stay
the canvas's dark always, exactly as D-052 left them.

**Verified:** the toggle's new icon and position, at 1440 and 360px;
`hands-scene.html` on white — background, hands, wireframe, ring, prism,
orbiting nodes — across several rotation states; dark mode unchanged.
`tests/site.spec.ts` gained a second theme test that exercises the
`postMessage` handshake itself (a new `window.__wireHex()` debug hook,
alongside the existing `__gap`/`__set`), not just the parent page's own
CSS — the fragile new part of this change, and the one most worth a
regression test.

---

## D-054 — mh-bg fields themed too; nothing on the site stays dark always any more

**Status: adopted, 2026-09-20.** Kaung sent two screenshots — Home's
Signal Plane, Research's Theme 01 network panel — both still the canvas's
dark, and asked for them themed too. Extended to Partner's `#join` as
well, not shown but the same case exactly: an `mh-bg mode="grid"` section
with no fill of its own, identical in every relevant way to Signal Plane;
leaving it dark while its structural twin went light would have been an
inconsistency nobody asked for, not a deliberate choice preserved.

**Why this one is a different shape of fix than D-053.** The 3D scene
needed `postMessage` because it's a separate document. `mh-bg.js` is a
custom element that lives in the *same* document as the page — so it
just reads `data-theme` off `<html>` directly. `connectedCallback` now
sets `this.dark` from the current attribute and a `MutationObserver`
keeps it current; every draw method (`drawBayes`, `drawLattice` — unused
live, kept consistent anyway — `drawGrid`) picks a dark-on-light colour
over the canvas's light-on-dark one at the point it paints, via inline
`this.dark ? 'canvasRGB' : 'lightRGB'`. No new custom properties, no new
architecture — the simplest thing that could work, given the constraint
D-053 didn't have.

**The colours themselves** are new, chosen per line the same way D-052's
site-wide ink values were: not a formula, a judgement call per role
(primary line/text, muted edge, node fill, node stroke) aimed at holding
the *same relative* prominence the canvas's own dark-theme values have to
each other, just inverted for a light backdrop. The accent red is
unchanged, as everywhere else on the site — `col()`'s `'t'` branch (the
`mastery` node, in `drawBayes`) and the grid's centre dot never swap.

**Scope.** With this, D-052's original three-item exemption list is
empty — every colour on the site, including inside the 3D scene and the
canvas fields, now follows the theme. `research.astro`'s own comment
about Theme 01's panel, stale since D-052 first gave it a background back
(it still said "no border, no background," true only of the border by
then), is corrected in the same pass.

**Verified:** Signal Plane, Research (all three theme rows, the "mastery"
network specifically checked against Kaung's own reference screenshot —
a close match, same dark-ink-on-white reading his image showed) and
Partner in both themes, at 1440px; dark mode unchanged on all three.
`tests/site.spec.ts` gained a third theme test, checking `mh-bg`'s own
`.dark` flag flips on toggle — the same white-box approach as D-053's
`__wireHex()` check, appropriate here for the same reason: what's being
verified is internal state a screenshot alone wouldn't catch reliably in
CI.

---

## D-055 — Members are profile rows: portrait, bio, links; Md Kamal Hosen added

**Status: adopted, 2026-09-21.** Kaung added Md Kamal Hosen (a PhD
student, photo supplied, a two-paragraph bio supplied verbatim) and
relayed his professor's ask: every member should carry a bio and their
links — Google Scholar, LinkedIn, Facebook and the like. He also said he
couldn't picture the layout, and that he'd have a cheaper model fill in
the other members later, so the structure had to be one that model can
follow from the file alone.

**Why rows, not cards.** The canvas's members grid is five 4:5 frames
across. A 250-word bio doesn't fit a fifth of the page, and the two
honest alternatives both cost more than they return: an expand-on-click
card hides the content the professor asked to show, and a page per
member adds routes to a five-page site for what is, today, one bio.
A profile row — portrait left, text right, one row per person, groups as
before — is what lab sites conventionally do, needs no JavaScript and no
new routes, reuses the Research page's text-beside-visual rhythm, and
keeps the whole Members page as one array. The spec is in
`design/DESIGN.md` ("A member's profile row"); the how-to is the note at
the top of `src/pages/members.astro`.

**The data shape** — `{ name, role, photo, bio, links }`, with `bio` an
array of paragraphs and `links` an array of `{ label, href }` — is the
entire interface. The template renders what's present and appends one
TODO marker naming what isn't (name and photo / bio / links), so a row
never silently looks finished. Adding a bio or a link is a data edit, not
a layout edit — which is the point, given who'll be making those edits.

**Kamal fills a placeholder, not a new slot.** D-050's three Doctoral
slots were "3 people," unnamed. Kamal is the first of them named, so
Doctoral is now Kamal plus two placeholders, not four rows. Flagged in the
reply so Kaung can say otherwise.

**No links yet, for anyone.** Kaung asked for links but supplied none —
not even Kamal's. None were invented. Every row's marker lists "links
(Google Scholar, LinkedIn, …)" until real URLs arrive; the file's note
says, explicitly, not to guess a URL or write a bio for a real person from
nothing. That note is aimed at the cheaper model as much as at anyone.

**Photo.** `pics/Md_Kamal _Hosen.jpg` (a stray space in the name as
uploaded — kept on disk, since `pics/` is gitignored, but the resized copy
is `public/members/Md_Kamal_Hosen.jpg` without it), 1072×1280, resized to
753×900 the same way as every other portrait. Already ~4:5, so the frame
crops it barely at all.

**Verified:** both themes at 1440px; 360px stacks portrait-first with no
overflow. `.mh-people`'s three breakpoint rules, now unused, are removed;
`.mh-profile` gets one rule at 768px. All eight tests pass unchanged —
nothing tested the old grid's shape, only that `#members` exists.

---

## D-056 — Profile rows: justified full-width bio, larger portrait, icon links; Kamal's Scholar link

**Status: adopted, 2026-09-21.** Kaung, looking at D-055 on the page,
asked for the bio to be justified and run the full width, the portrait
to be a bit bigger, the link pills to be icons rather than words, and
supplied Md Kamal Hosen's Google Scholar URL — the first real link on
the page.

**Portrait 180 → 240px, gap 32 → 40px.** "A bit bigger", so one step,
not a redesign; the 4:5 frame, border and radius are unchanged. The
right column loses its `70ch` cap so the bio runs to the gutter; with
justification a long measure reads fine at 14.5px/1.6, and it's what
Kaung asked for. `hyphens: auto` goes with `text-align: justify`
because justified text without hyphenation opens rivers, which the
360px screenshot showed even with it on. Justification applies at every
width — Kaung asked for it without qualification; if the phone reading
bothers him, left-aligning below 768px is a one-line change in
`Layout.astro`, noted in the reply.

**Icons, not words.** A link row of "Google Scholar · LinkedIn ·
Facebook" is text competing with the bio; the services' own marks are
what people scan for. No icon font or library — that would be a
dependency, and the site has none. Each glyph is one inline SVG path
(24×24, from Simple Icons, CC0), kept in an `icons` map in
`members.astro` keyed by the link's label, drawn in `currentColor` at
`.72` ink inside the same `.18` ink border the pills had, so both themes
get the right colour for free — the same reason every other colour on
the site is a token. A label with no glyph falls back to the D-055 text
pill, so an unfamiliar service (ORCID, a personal site) still renders
instead of breaking or getting an invented mark. The note at the top of
the file says so, for whoever fills in the other members.

**Kamal's link.** Exactly the URL Kaung pasted. His marker now reads
"TODO: —" for nothing; it's gone, since name, photo, bio and at least one
link are present. Everyone else's marker still lists links.

**Verified:** Kamal's row at 1440px in both themes — the glyph reads as
the Scholar cap, ink-coloured on light and on dark; 360px stacks with the
portrait at 240px, no overflow. Eight tests pass unchanged.


---

## D-057 — Kamal's bio shortened to two sentences

**Status: adopted, 2026-09-21.** Kaung asked for Kamal's bio to be
shortened to two sentences, picking the important things that define
him, rather than the full two-paragraph version from D-055.

**What's kept.** Both sentences use only facts already in the
supplied text — nothing new is introduced. First: PhD researcher in
Data Science and AI at the Asian Institute of Technology, working on
physics-informed neural operators for urban heat modeling — his
doctoral identity and topic. Second: Geospatial Web Developer at the
Asian Disaster Preparedness Center in Bangkok, building GeoAI systems
for flood, disaster and environmental monitoring across eight
countries in Asia — his professional role and its scope. Dropped: the
canopy-layer mechanism detail, the "physical constraints... fast,
accurate, physically consistent" framing, the itemised list of
monitoring sectors, the bulletin-systems detail, the background
clause, and the eight countries named individually (kept as a count).

**Not verbatim any more.** D-055 said a member's bio "must be supplied
by the member... verbatim." This is Kaung's edit, not Kamal's, so it's
a condensation of Kamal's own supplied words to the facts he himself
gave, not new material about him. It's on the page at Kaung's explicit
direction; worth Kamal's own sign-off if he wants his profile to read
differently than what he wrote, but that's a call for the lab, not
this tool.

**Verified:** renders as two sentences, no overflow, at 1440px in both
themes.

---

## D-058 — Dr. Sein Minn's bio and links; a globe glyph for "Website"

**Status: adopted, 2026-09-21.** Kaung supplied Dr. Sein Minn's bio
(three paragraphs, first person) and four links: Google Scholar, a
portfolio site, LinkedIn, Facebook. All go in exactly as given. This
is on top of Kaung's own commit renaming the first group and role from
"Founder" to "Faculty" (37bce2a); the docs that still said "Founder"
now say "Faculty" to match.

**Verbatim, not shortened, not re-personed.** D-057 shortened Kamal's
bio to two sentences at Kaung's explicit ask; nothing was asked here, so
the content rule holds and the text is his own words. Two consequences
Kaung should see: this bio is first person where Kamal's is third, and
three paragraphs where Kamal's is two sentences. Both are flagged in the
reply, not fixed — changing either is an edit to what a real person
wrote about himself, and that's the lab's call.

**A globe for "Website".** The portfolio link has no service behind it,
so no mark exists to borrow, and one text pill among three icons would
read as a mistake. A generic globe — the conventional sign for a
personal site — is not an invented brand mark, so it doesn't breach the
D-056 rule; it is stroked (1.8, round caps) rather than filled, since a
filled globe at 17px is a blob, and the `icons` map's values become
`{ d, stroke? }` so the template knows which way to draw each one. The
label is "Website", the general word the file's note already listed,
rather than "Portfolio"; the tooltip and screen-reader label say so.

**Verified:** Dr. Sein Minn's row at 1440px in both themes — four
glyphs at one visual weight, ink-coloured on light and on dark; 360px
stacks with the four glyphs in one row beneath the bio. Eight tests
pass unchanged.

---

## D-059 — Every bio is two sentences, third person

**Status: adopted, 2026-09-21.** Kaung, seeing Dr. Sein Minn's three
paragraphs beside Kamal's two sentences, made the rule general: every
member's bio is two sentences, picking only the important things.
Dr. Sein Minn's is condensed accordingly; Kamal's (D-057) already was.

**The two sentences.** First, who he is and what he works on: assistant
professor at AIT, researching adaptive, interpretable systems across
machine learning, user modeling and cognitive modeling, committed to
human-centered and explainable AI. Second, where he came from: Ph.D. in
Computer Engineering from Université de Montréal, then UQAM in Canada and
École Polytechnique, CNRS and Inria in France. Dropped: the education
focus of recent work, the "accurate, transparent models… trust" framing,
the long-form institute names, and the visiting stints in Singapore,
Japan and China. Every fact kept is one he supplied.

**Third person.** He wrote in first person; Kamal's row is third. With
one bio per row under a name, a page that switches voice row to row
reads as unedited, so the condensed version is third person, matching
Kamal and the rest of the site's copy. That is the one change beyond
shortening, and it's flagged in the reply: it's his profile, and if he
prefers "I", it's a data edit.

**Made a rule, not a one-off.** The how-to at the top of
`src/pages/members.astro` now says two sentences, third person, one
paragraph, condensed from what the member gives, nothing added — so the
cheaper model filling in the other members produces the same shape
without being told each time. `design/DESIGN.md`'s profile-row spec and
`docs/phase.md` say the same.

**Verified:** 1440px, both themes; 360px. Eight tests pass unchanged.

---

## D-060 — Dr. Sein Minn: Facebook link replaced with email

**Status: adopted, 2026-09-21.** Kaung asked to drop the Facebook link
and add an email instead, with an icon for it — `sein.minn.cs@gmail.com`.

**Envelope glyph, mailto: link.** "Email" joins the `icons` map as a
generic envelope, stroked like the D-058 globe, since email has no
single brand mark either. The href is a plain `mailto:` link, which
opens the visitor's mail client rather than a new browser tab —
`target="_blank"` is harmless on a `mailto:` link but does nothing
useful, so the row's behaviour differs slightly by link type; not worth
branching the markup over. Facebook's glyph stays in the map — it's a
generic service entry, not tied to Dr. Sein Minn, and Kamal or a future
member may still use it.

**Verified:** 1440px, both themes — the envelope reads at 17px next to
the other three. Eight tests pass unchanged.

---

## D-061 — Kaung Hein Htet's bio and links

**Status: adopted, 2026-09-21; bio revised same day.** Kaung supplied
his own bio (one paragraph, first person) and asked for it condensed to
two sentences, plus a portfolio site, LinkedIn and email.

**First pass**, following the D-059 shape: who he is and what he works
on — a Master's candidate in Data Science and AI at AIT, working as a
data scientist and AI engineer on time-series models, data pipelines
and reliable backends — then a professional highlight, leading the AI
team at Gold Silver Central on ARIMA-based forecasting and Azure
pipelines for gold markets, and teaching data science outside his paid
work.

**Revised.** Kaung asked to drop the work history entirely — the
time-series/data-pipeline framing and the Gold Silver Central line —
and replace it with his research direction: personalized knowledge
tracing and knowledge graphs, the same territory as the lab's own
knowledge-tracing programme. The bio is now: who he is (Master's
candidate in Data Science and AI at AIT), then what he researches
(personalized knowledge tracing and knowledge graphs). Still two
sentences, third person; every other paragraph in the initial draft
(the Myanmar-to-Thailand background, the four institutions, the
manual-work figure) was already dropped in the first pass and stays out.

**Links.** Portfolio labelled "Website" (the existing generic-site
glyph, D-058, no new icon needed), LinkedIn (existing glyph), and email
as a `mailto:` link (the D-060 envelope). All three supplied URLs used
as given; unaffected by the bio revision.

**Verified:** his row at 1440px in both themes — two sentences, three
icons, no overflow. Eight tests pass unchanged.

---

## D-062 — Post Doctoral and Doctoral placeholders commented out; Intern group added, also commented out

**Status: adopted, 2026-09-22.** Kaung asked to comment out the
placeholder rows in Post Doctoral and Doctoral until those people
arrive, and to add an Intern group under Master with a placeholder,
commented out from the start.

**Commented out, not deleted.** Each placeholder — two in Post
Doctoral, two in Doctoral, one new one in Intern — is now a `//`-commented
object literal in the `groups` array in `src/pages/members.astro`,
exactly the shape the how-to at the top of the file already documents.
Bringing someone in is still a data edit: uncomment the line and fill
it in, or replace it outright. Nothing about the markup changed.

**A group with nothing to show shows nothing.** Post Doctoral and
Intern each end up with an empty `people` array once their only
entries are commented out. Rendering the group's 19px heading over an
empty column would read as broken, not as "not yet" — so the template
now filters to `g.people.length > 0` before mapping groups, and a
group with no active people is skipped outright: no heading, no gap.
Doctoral still renders, since Md Kamal Hosen's entry is real and stays
active; only the two placeholder lines under his are commented out.

**Intern is new**, added after Master per Kaung's request — one
placeholder (`role: 'Intern'`), commented out identically to the
others, so the group exists in source and in the how-to's group list
but nothing shows until a real intern replaces it.

**Verified:** built and rendered full-page at 1440px in both themes —
Members now shows Faculty, Doctoral and Master only, in that order,
with no gap where Post Doctoral or Intern would have sat; the footer
follows Master's last row directly. Eight tests pass unchanged.

---

## D-063 — Learning: the StatLab repo link lives in Course materials

**Status: adopted, 2026-09-22; revised same day.** Kaung supplied the
StatLab code repo — `https://github.com/MINN-HAI-Lab/statLab_Codes` —
and first asked for a third tab between StatLab and Course materials
that just linked out to it.

**Revised.** Kaung caught that Course materials already existed as a
tab (holding only a TODO) and asked to fold the repo link into it
instead of adding a third tab — he'd forgotten it was there. The panel
is back to two tabs, StatLab and Course materials. Course materials now
opens with the same description-then-button block the standalone tab
had — "The source code and visualizations used in StatLab," a "View
source" button styled like "Open StatLab" — followed by the existing
TODO marker, reworded ("which *other* courses and materials go public…
nothing *else* listed") since the panel is no longer entirely empty.
No script change either way — the tab script is already index-generic.

**Verified:** both tabs switch correctly at 1440px in both themes;
Course materials shows the button above the TODO in each. Eight tests
pass unchanged.

---

## D-064 — Course materials: TODO marker removed

**Status: adopted, 2026-09-22.** Kaung asked to remove the TODO marker
from the Course materials tab now that it holds the StatLab repo link
(D-063).

**Page versus tracking.** The gap the marker named — which other
courses and materials go public, and who owns them — hasn't been
filled; only the visible flag on the page is gone. That gap is still
listed in `docs/phase.md`'s open items, so it isn't lost, just no
longer shown to a site visitor. The tab now reads as complete rather
than in-progress, which is accurate for what it currently offers (the
one real resource, the repo link) even though more may be added later.

**Verified:** the tab at 1440px in both themes — description, button,
nothing else, no leftover TODO styling. Eight tests pass unchanged.

---

## D-065 — Theme 02 and Theme 03 get their own fields: a Markov blanket, and a sample emerging from noise

**Status: adopted, 2026-09-23.** Kaung asked for "3D rendering objects"
for Theme 02 and Theme 03 on the Research page to match Theme 01's,
which had been the only theme with a visual; the other two had carried
"image / 3D object — placeholder" since D-047.

**What Theme 01's visual actually is.** Not the Three.js scene — that's
the hero's alone — but `mh-bg mode="bayes"`, a dependency-free canvas
field drawing a knowledge-tracing network in 3D projection: ink lines,
hollow and filled nodes, role-coloured, a red accent for the model's
opinion (the `mastery` node and the pulses along its edges). So "match
Theme 01" means two more modes in the same element, in the same idiom,
themed the same way (D-054) — not a second WebGL scene, and not a raster
image, which the site has none of.

**Theme 02 — `mode="blanket"`.** A Bayesian network over sixteen
variables, drawn as a graph the way the theme's description says an
explanation should be: "names variables rather than gesturing at
importance scores." The target's parents, children and co-parents — the
Markov blanket — are named by exactly those roles and ringed by a dashed
ellipse (the smallest enclosing one, recomputed each frame as the graph
turns), captioned "Markov blanket"; everything outside is an anonymous
hollow node — siblings, grandparents and grandchildren included, since
none of those are in a blanket, a detail a reader who knows the concept
will notice. The accent: red pulses of evidence travel the edges. From
inside the ring they reach the target; from outside they fade out on
reaching the ring — conditional independence, drawn. Labels are roles,
not invented column names, so the diagram claims nothing about any
particular dataset.

**Theme 03 — `mode="generate"`.** A 45×31 field of samples on a plane
tilted toward the viewer as a height field. Each 13-second cycle a new
image — three drifting gaussians, one negative, so it has a shape — rises
out of per-point noise over 7.5s, holds 3s, dissolves back over 2s, then
half a second of pure noise before the next. That's a diffusion model's
two processes in order: reverse (denoising, step 1000 → 0), then forward
(noising, 0 → 1000). A readout names the phase and the step; a "noise →
image" axis along the bottom carries a red marker for where the process
is — the accent as the model's state. Nothing recognisable is generated,
deliberately: an abstract sample makes the process the subject, and the
theme's description is about learning plausibility, not any one picture.

**Neither field turns all the way round.** Theme 01's turns
continuously (one revolution every three minutes, going near-edge-on on
the way); these two swing ±34° instead, so a graph never collapses to a
line and a plane never becomes a sliver. A deliberate departure from
Theme 01's rhythm, in a different row, for legibility.

**Both files.** Per CLAUDE.md's "change the canvas, not the page," the
two modes are in `MINN HAI LAB UI Design/mh-bg.js` as well as
`public/design/mh-bg.js`, method for method — the canvas's copy gets a
`this.dark = true` so the shared draw code picks the canvas's own dark
colours there (it never gained D-054's theme watcher, being dark-only).
The canvas's `.dc.html` still doesn't place them: its Research section
predates the zigzag (D-047 already noted "no canvas equivalent"), so the
asset is in the canvas, the placement isn't.

**Verified:** both fields at 1440px in light and dark — the ring, the
role labels and the pulses read; the sample field's phases, readout and
axis marker checked mid-denoise, at hold and mid-noise; both at 360px,
where the ring and labels still fit and the plane fills the width.
`tests/site.spec.ts`'s research check now asserts all three modes are
on the page. Eight tests pass.

---

## D-066 — Theme 03's field generates a cat, not an abstract shape

**Status: adopted, 2026-09-23.** Kaung looked at D-065's Theme 03 field
— three drifting gaussians rising out of noise as a height field — and
said it looked like something inappropriate, and asked for the same
thing from noise to a picture of a cat, in dots.

**He's right, and D-065's reasoning was wrong.** That entry argued an
abstract sample "makes the process the subject." But two rounded mounds
with a dip between them, viewed from a low angle, are an abstract shape
the eye will complete into a body, and once it does, the process is
not the subject any more. A recognisable object removes the ambiguity;
a cat is the canonical one for "generate an image," since the
literature's first image-generation examples were cats and it's what
most people picture when they picture a generated picture.

**A bitmap, not a formula.** The cat is a hand-drawn 40×30 dot matrix
in the draw method — sitting, facing the viewer, ears up, eyes as two
gaps, tail curled at its right — each cell a dot whose size and ink
track its value the same way D-065's samples did. The plane is upright
now rather than tilted, since a picture is looked at face-on; it still
swings ±26° with time and the cursor, and cat cells still stand
slightly proud of the plane in depth. The noise → image cycle, the
phase and step readout, the axis and the red marker are unchanged.
"Each cycle a new sample" is kept in a smaller way: the cat faces the
other way on alternate cycles.

**Verified:** at 1440px, light at the hold ("sample · step 0"), dark
mid-denoise ("reverse process"), the silhouette clear in both; the
bottom row lifted clear of the axis. Eight tests pass unchanged — the
mode's name didn't change. In both `mh-bg.js` files, as D-065 was.

---

## D-067 — Theme 03's publications TODO commented out

**Status: adopted, 2026-09-23.** Kaung asked for the Theme 03 TODO on
the Research page — "publications for this theme, to be supplied" — to
be commented out.

**The label goes with it.** Commenting out only the marker would leave
a "Publications" heading over nothing, which reads as broken rather
than as not-yet; so the whole block, label and marker, is inside an
Astro `{/* */}` comment, which ships nothing — same reasoning as D-062
hiding an empty member group's heading. Theme 03 now ends at its
description. The comment says what to do when publications arrive:
uncomment, and replace the marker with a list shaped like Theme 01's
and 02's.

**Still open, tracked off the page.** Like D-064's Course materials
marker, the gap hasn't closed — only its visible flag has. It stays
listed in `docs/phase.md` and `docs/plan.md` as an open item.

**Verified:** Theme 03's row at 1440px in both themes — description,
then the field, no heading, no marker. Eight tests pass unchanged.

---

## D-068 — StatLab gets a "Source code" button; Course materials is gone, and the tab row with it

**Status: adopted, 2026-09-24.** Kaung asked for a "Source Code" button
under StatLab, linking to the repo the Course materials tab's "View
source" button pointed at, and for the Course materials section to be
removed.

**The button.** "Source code", sentence case per the site's copy rule,
beside "Open StatLab" in a wrapping row. It's the canvas's secondary
button — a `.28` ink outline, `var(--ink)` text, padding one pixel less
each side so it stands the same height as the filled one — since the
tool is the primary action and its code the secondary. Same URL as
before, unchanged.

**No tab row.** With Course materials gone, StatLab would have been
the only tab, and a single pill that can't switch to anything is dead
UI, not a label. So the `role="tablist"` row and the `data-mh-panel`
wrapper are gone too; the panel's content sits directly under the
"Learning" heading. The tab script in `Layout.astro` and `.mh-tab`
styles stay — they're the canvas's, and cost nothing — for if a second
resource ever brings the row back. A judgement call beyond the literal
ask, made rather than asked, since the alternative is visibly wrong.

**Course materials was an open item; it isn't now.** D-063/D-064's
tracking of "which other courses go public" comes off `docs/phase.md`:
Kaung removed the section, so there's nothing on the page for the item
to fill.

**Verified:** at 1440px and 360px in both themes — heading, StatLab,
two buttons side by side, wrapping at 360. The test that clicked the
second tab is replaced by one that checks both links' hrefs and that
no tab is on the page. Eight tests pass.
