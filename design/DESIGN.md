# DESIGN.md

The design is the canvas in `MINN HAI LAB UI Design/`. This file describes
what it specifies so it can be checked against; the canvas itself is the
authority, and where this file and the canvas differ, the canvas wins.

## The frame

Direction 2a is the hero: a human hand upper-left and a robot hand
lower-right, modelled and lit in Three.js (`hands-scene.html`). Bring the
cursor toward the centre and both reach in until the index fingertips almost
meet. Behind the gap, a cybernetic instrument field — rings, ticks, a
wireframe icosahedron, a glowing arc. After Michelangelo, *The Creation of
Adam*. Everything in the frame is live 3D. The frame is 920px tall on a
1340px canvas; on a wider screen the camera comes in — to no closer than 0.82 of its
distance — so the frame shows about the same width of the scene, and the
forearms are ten times the artboard's original length, so their ends are
never in view even at an ultrawide monitor.

Direction 1d is the rest of the page, in this order: a research header band
over a lattice field; two programme rows, each with its own publication list
(`200px | 1fr | 300px` for the row with a field preview, `200px | 1fr` for the
row without one); the Learning panel (StatLab, linked out; course materials,
still a gap); the members grid of five 4:5 frames; a funding list; the
closing band over the signal plane, with the contact address; the footer.

## Colour

- Field `#06080A`; raised ground `rgba(12,16,19,.62–.9)`; the design viewer's
  own ground `#15181b` is not part of the site.
- Ink `#E6EDF0`, used at 1, .85, .82, .72, .7, .68, .62, .6, .55, .5, .45
  and .42 for text, and at .1, .14, .18, .22, .28 and .4 for rules, edges and
  underlines. Display white `#F2F6F8`.
- The red `#D61A4A`: the status light, the mastery figure, the bars in the
  mini chart, the blanket's node in the lattice key, the emissive parts of the
  robot hand. "Red is the machine's opinion. Ink is fact. The accent appears
  nowhere else on the site."

## Type

- Literata, weight 300 for the hero line (54px in 2a, 80px in 1a), the
  section titles (52px), the closing line (44px); 400 for programme names
  (30–34px), resource names (19px), member names (16px), the lab name (18–20px)
  and the mastery figure (46px).
- Space Grotesk for everything else: paragraphs at 16–17.5px, labels at
  12–13.5px, the smallest at 11–11.5px. Weight 400, 500 on buttons and tabs.
- Letter-spacing tightens with size: −.025em to −.035em on display lines,
  −.015em on programme names.

## Layout

- 1340px wide, 44–48px of side padding. Sections are ruled with
  `1px solid rgba(230,237,240,.1)`.
- Buttons: ink fill with field text, or a `.28` ink outline; 2px radius;
  `12.5–13.5px`; padding `9–14px 16–24px`.
- Tabs: pills, `999px` radius.
- Panels: `1px solid rgba(230,237,240,.14)`, 3–4px radius, raised ground with
  `backdrop-filter: blur(10–14px)`.
- TODO markers: a 3px ink rule on the left, raised fill, 13–13.5px.

## Motion

- The status light breathes (`mh-blink`, 2.6s).
- The fields turn slowly and follow the cursor; the plane ripples away from
  it; the lattice's nodes light up under it.
- The reach follows the cursor's distance from the centre of the frame.
- All of it eases to a still under `prefers-reduced-motion`, in the scene's
  and the fields' own code.

## Every screen

The canvas is drawn at one width, 1340px. The page fills whatever screen it is
on and scales the artboard through Bootstrap's breakpoints — 576, 768, 992,
1200, 1400 — in one stylesheet at the top of `src/pages/index.astro`:

- The gutter steps 48 → 40 → 32 → 28 → 24 → 20px.
- The programme rows go `200 | 1fr | 300` → `160 | 1fr | 260` → one column
  below 992px. The learning split's aside goes 440 → 380 → full width. The
  people grid goes 5 → 3 → 2 across.
- The hero fills the viewport height; its display line steps 54 → 44 → 38px;
  the section titles 52 → 40 → 34px.
- There is one header — 2a's — fixed to the top of the page on 1d's
  translucent ground; the headers drawn inside 1a, 1b, 1c and 1d are not
  repeated. Below 768px its links become a Menu button that opens a stacked
  list.

Nothing else about the canvas changes with the screen.
