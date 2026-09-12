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

**Status:** proposed · 2026-09-13

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
