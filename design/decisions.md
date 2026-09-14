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
