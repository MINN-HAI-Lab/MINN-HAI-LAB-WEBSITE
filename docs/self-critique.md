# Self-critique

Five pages, three widths, read against CLAUDE.md's banned list and against the
brief's own floor. Written at the end of the build, before anyone else has seen
it.

The honest summary: the artefacts are the site, and they work. The pages around
them are thin, and they are thin because the content to fill them does not
exist yet — which is the correct state, but it means anyone judging this site
today is judging four working artefacts and a scaffold.

---

## Against the banned list

CLAUDE.md's banned visual defaults, item by item. The brief's aesthetic
override lifts several of them explicitly; those are marked and the conflict is
logged as Q-19.

| Banned | Status |
|---|---|
| Warm cream with terracotta accent | Not present. Dark field. |
| **Near-black with one bright vermilion accent** | **Present, and prescribed.** The override names `--field #070B10` and `--signal #FF3D5A` and restricts the signal to model outputs. This is the one banned item the brief asks for by hex value. |
| Tinted near-black standing in for a real dark value | Not present. `#070B10` is a measured value with a contrast table in `tokens.css`, not a vague `#111`. |
| Tracked-out all-caps eyebrow labels | Not present. Labels are sentence case at 12px with 0.02em tracking. |
| Meta strings joined with middle dots | Not present. |
| `WORD — fragment` labels | Not present. |
| Monospace for data labels | Not present. `--font-mono` is declared and `.type-code` uses it; nothing on any page does. |
| `→` appended to link text | Not present. |
| Identical rounded cards in a three-column grid | Not present. The portrait frames are square-cornered 4:5 rectangles at `--radius-0`; the publications are ruled rows. |
| **Gradients, glassmorphism, backdrop blur** | **Present, and prescribed.** Glass is the override's central instruction, with its own blur, edge and radius values. |
| Particle fields, floating nodes, animated neural-network backgrounds | Judgement call, argued below. |
| Numbered `01 / 02 / 03` markers | Removed during this pass. The portrait frames carried a visible 1–5; five members are a set, not a sequence. The number survives only in each frame's accessible name, where it is the only way to tell one empty frame from another. |
| Accenting one word in a headline | Not present. |
| **Fade-and-slide-up on every section** | **Present, and prescribed.** The override asks for "one entrance reveal per section on scroll, once, never repeating". |
| Hover lift on every card | Not present. |
| Inter, Geist or a UI default as the display face | Not present. Literata for prose; the sans is only for labels, readouts and navigation. |

### The one I want to argue rather than tick

**Particles.** The 3D view draws two travelling dots along each Markov-blanket
link. That is close to a banned "animated neural-network background", and I
considered removing it.

It stays because it is carrying information rather than atmosphere: in three
dimensions an arrowhead is frequently pointing away from the camera, and the
direction of a dependency is the whole content of a Bayesian network. The dots
move parent to child. They appear only on blanket links — the set the artefact
is currently asserting — never on the other edges, and never under reduced
motion. If they were on all thirteen edges they would be a screensaver, and I
would cut them.

---

## What is actually good

**The four artefacts.** Each one does a real thing:

- The trace runs Bayesian knowledge tracing, and the parameters were searched
  rather than picked so that every one of the ten clicks moves the headline by
  at least twenty points instead of saturating at 100 per cent.
- The Markov blanket is computed properly — parents, children, and the
  children's other parents — and the same function places the static SVG at
  build time, answers a click in 2D, and colours the 3D scene. The three cannot
  disagree about what the network is.
- The saliency map is a Sobel gradient over a real photograph's own pixels,
  computed in the browser. Put the cursor on the cat's eye and the peak reads
  0.74; put it on the thrown-out background and it reads 0.30. That difference
  is the artefact's entire argument and it is measured, not asserted. It also
  makes the argument by itself: the first time it comes into view the fixation
  sweeps once along the eye line, which is the only version of this artefact a
  phone reader would otherwise never see.
- The tokeniser genuinely tokenises, on every keystroke, and a test asserts it
  never drops or invents a character.

**Every artefact says what its data is**, on its face, in the label bar, and
again in a note underneath. `artefacts.spec.ts` fails if any of those four
labels goes missing.

**The gaps are visible and specific.** No invented publication, author, venue,
year, DOI, funder, affiliation, member name, role or photograph appears
anywhere. Every gap names what is missing, who supplies it and a tracker, and a
test enforces all three.

**It is fast and it is accessible.** Lighthouse mobile: 100 for performance,
accessibility, best practices and SEO on all five pages, with every glass layer
in place. 450 browser tests green across Chromium, Firefox and WebKit.

---

## What is weak

**1. The pages around the artefacts are mostly gaps.** `/people` has five empty
frames. `/about` has four TODO blocks and two real paragraphs. `/learning` has
one link. This is the correct output — the content does not exist and inventing
it would be the worst thing this site could do — but it should not be mistaken
for a finished site. It is a finished *frame* waiting on about eight facts.

**2. `/learning` is thinner than it should be.** The brief asked for it to be
"built to take more resources later", so it is a list of one. A list of one
looks like an oversight even when it is not. If StatLab had a screenshot or an
embedded preview the page would carry its own weight; there is no screenshot to
use and I would not fabricate one.

**3. The group photograph frame is a large empty band.** Four units wide to one
tall at desktop, with a marker in it. It is honest, it is the right shape for
what will replace it, and it is still the first thing on `/people` and it is
empty.

**4. The 3D chunk is 361KB gzipped.** Opt-in, absent from the first paint,
verified by a test that fails if it is ever requested on load. Fixed during
this pass: the button now carries "Loads about 360KB" beside it, before the
click rather than after, which matters most to exactly the people for whom it
matters most. What remains is that 361KB is a lot for a second view of a graph
that is already fully interactive in 2D. It earns its place by making depth
readable; it would not earn it twice.

**5. The illustrative network is illustrative.** Ten plausible
learning-analytics variables with plausible dependencies, and the artefact says
so three times. It would be much stronger with the lab's real structure. That
is a content gap rather than a build one, but it is the gap that most limits
artefact 2.

**6. The attention in artefact 4 is a distance kernel with a stem bonus.** It
has the shape of attention and the arithmetic of a real head, and it is labelled
illustrative in the bar and explained in the note. It is still not a model. If
the lab can export real weights, that artefact improves enormously and the
drawing does not have to change.

---

## What nearly shipped broken

Recorded because it is the useful part of a critique.

- **The site rendered in Georgia for the whole branch.** `--font-serif` named
  "Literata" literally; Astro's `<Font>` declares the face under a hashed family
  and exposes it as `--font-literata`. No `@font-face` matched, so the woff2
  that was subset, hashed and committed was never fetched once. Found by a test
  asking why zero font files were requested, not by looking — the fallback is a
  serif and it looked fine.
- **Tap targets at 22.5px against a 24px minimum**, because the phone gutter was
  eighteen per cent of the screen.
- **`margin-inline: auto` on a flex item in a column** makes it shrink to
  content rather than stretch. This has now caused two bugs in this repo: a plot
  drawing at 324px in a 1116px panel, and the 3D canvas sizing itself from
  `window.innerWidth` and pushing a scrollbar onto the page at 360px.
- **The same TODO printed thirty-seven times on `/research`**, once under every
  publication row. Every test passed. It took looking at a full-page screenshot
  to see that the annotation had buried the thing it was annotating.
- **A test that raced the animation it was watching.** The draw-in check polled
  for a dash array that the animation clears when it finishes, so a poll
  landing a moment late reported that the curve had never drawn. It failed in
  WebKit roughly one run in five — often enough to be noticed, rarely enough to
  be re-run rather than read.


---

## The redesign, 2026-09-14

Kaung supplied a design canvas and asked for the whole UI changed to it. Read
against the canvas and against the banned list, at 1440, 768 and 360.

### Against the canvas

- **The reach** is the hero, live, and it reaches. The composition is close to
  the canvas's frame; the camera sits a touch further back, so the hands read
  a little smaller against the ring. Everything in the frame is the canvas's
  own scene, ported line for line.
- **The type** is the canvas's: Literata at 300 for the lines that carry
  weight, Space Grotesk for everything read at text size. The first build set
  every label in the system sans because the grotesk's variable was declared
  and never rendered into the head; a spec that counts font files caught it.
- **The palette** is the canvas's, at one remove: its red is 3.9:1 on the
  field and the site's is the same hue lifted until a 12px readout clears 4.5.
- **The rows, the bands, the strip, the tabs, the closing band** are built as
  drawn. The canvas is desktop-only; below 900px the row is one column, the
  band's field sits behind a stronger veil, the header's button steps out.

### Against the banned list

Three items the earlier build could tick are now knowingly present because
the canvas asks for them by value, and are recorded in Q-25: a near-black
field with one red accent, glass panels, a fade-and-rise per section. One
item the canvas asked for is refused: the lattice of random nodes, which is
exactly the "ambient field of nodes that means nothing" the list names. Its
place is taken by the canvas's own Bayesian-network field, which draws the
lab's graph with every variable named.

### What is weak

1. **The hero is a still on a phone.** Deliberately — there is no cursor to
   bring to the centre and Three.js on a throttled phone cost eleven seconds
   of blocking time for a scene nobody could steer — but a phone reader gets
   a picture where a desktop reader gets the reach. The still is a true frame
   of the same scene, which is the most honest version of that trade.
2. **The canvas's copy about partners, a teaching assistant and hiring** is
   on the page as three gaps rather than as sentences. That is correct and it
   makes the learning and people pages read as unfinished, which they are.
3. **Two fonts cost 106KB** before a word of the site's own arrives. The
   canvas wants both faces and both are subset and self-hosted; that is the
   floor for this design.
4. **The mission paragraph came through the design file.** It reads as the
   lab's own and it is on the page, marked to be confirmed rather than
   assumed. If it is not the lab's wording, B-3 is where that gets fixed.
