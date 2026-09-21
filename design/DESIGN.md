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

Direction 1c, the signal plane, follows the hero directly on Home — 1a
(Deep Field) and 1b (Lattice), the network graphic and the lattice field
that used to sit between them, are gone from the site (D-047), though they
remain in the canvas.

The rest of direction 1d, in this order: a research header band, its own
lattice field removed as redundant once Theme 01 carried a real network
graphic (D-048); the three themes zigzagging left and right, text and
visual trading sides each row, each theme with its own publication list
where it has one (D-047 — no canvas equivalent; the canvas draws two
stacked programme rows, one `200px | 1fr | 300px` with a field preview,
one `200px | 1fr` without). Theme 01's visual is Deep Field's network
graphic, relocated rather than deleted, shown unpanelled — no border, no
background (D-048); Theme 02 and 03's are marked placeholders, no asset
supplied yet. Then: the Learning panel (StatLab,
linked out; course materials, still a gap); the members list, one profile
row per person grouped Founder / Post Doctoral / Doctoral / Master
(D-049, D-050, D-055 — no canvas equivalent), six named with photos, one
with a bio, four still `TODO:`; a funding list; the closing band over the
signal plane, with the contact address; the footer.

### A member's profile row (D-055, D-056)

The canvas drew members as a grid of 4:5 portrait frames with a name and
role beneath. A bio and a set of links can't live in a fifth-width card,
so each member is a row instead — `240px | 1fr`, 40px apart, `28px 0`
vertical padding, a `.08` ink rule above each row, groups 44px apart under
a 19px Literata group heading:

- Left: the same 4:5 frame the grid used (`.14` ink border, 3px radius,
  `object-fit: cover`), or the striped placeholder when there's no photo.
- Right, the full remaining width: the name (16px Literata, as before)
  over the role (12px, `.5` ink); then the bio, one `<p>` per paragraph
  (14.5px, line-height 1.6, `.7` ink — the funding blurb's own size),
  justified, with `hyphens: auto` so justification doesn't open gaps;
  then the links; then, if anything is still missing, one TODO marker
  (the site's usual left-rule marker) naming exactly what — name and
  photo, bio, links — so a row never silently looks complete.
- Links are a wrapping row of 34px square icon buttons (`.18` ink
  border, 2px radius, `.72` ink), each a 17px monochrome glyph of the
  service's own mark drawn in `currentColor`, so it takes the ink of
  whichever theme is on; `aria-label` and `title` carry the service's
  name. Each opens in a new tab. Glyphs exist for Google Scholar,
  LinkedIn, Facebook and GitHub; a link to any other service renders as
  a text pill instead (`.18` ink border, 2px radius, `5px 10px`, 12px,
  `.72` ink — the publication list's `code` tag, one size up).
- Below 768px the row stacks, portrait first, held to 240px wide.

Everything on the page is one array in `src/pages/members.astro`; the
markup renders whatever a person's entry has and marks the rest. The
note at the top of that file is the how-to for adding a member.

## Colour

The canvas's own palette — dark, and since D-052 the site's secondary
theme:

- Field `#06080A`; raised ground `rgba(12,16,19,.62–.9)`; the design viewer's
  own ground `#15181b` is not part of the site.
- Ink `#E6EDF0`, used at 1, .85, .82, .72, .7, .68, .62, .6, .55, .5, .45
  and .42 for text, and at .1, .14, .18, .22, .28 and .4 for rules, edges and
  underlines. Display white `#F2F6F8`.
- The red `#D61A4A`: the status light, the mastery figure, the bars in the
  mini chart, the blanket's node in the lattice key, the emissive parts of the
  robot hand. "Red is the machine's opinion. Ink is fact. The accent appears
  nowhere else on the site." Unchanged between themes — see below.

## Theme (D-052, D-053, D-054)

Light is default; dark, above, is what a visitor opts into with the
header's toggle — an icon (a filled moon to switch to dark, a sun to
switch back), last in the header's right-hand cluster so it's always the
rightmost control — kept in `localStorage`. Every colour is a CSS custom
property (`src/layouts/Layout.astro`) — light values on `:root`, dark
values (the canvas's own, unchanged) under `[data-theme="dark"]`:

| Token | Light (default) | Dark (secondary) |
|---|---|---|
| `--field-rgb` | `239,241,242` | `6,8,10` (canvas) |
| `--ink-rgb` | `28,40,48` | `230,237,240` (canvas) |
| `--display-rgb` | `10,16,20` | `244,248,250` (canvas) |
| `--accent-rgb` | `214,26,74` | `214,26,74` — unchanged |

`--ink`, `--field`, `--display` and `--accent` are `rgb()` convenience
forms of the same tokens, for a solid fill where the canvas had no alpha.
Every rule, border and secondary-text alpha the canvas specified (.05
through .85, above) carries across unchanged — only the RGB channels
switch, as `rgba(var(--ink-rgb),.62)` in place of the canvas's literal
`rgba(230,237,240,.62)` — so the same hierarchy of emphasis holds in both
themes, light ink fading toward field exactly as dark ink does.

The light values are new — not the canvas's, which only ever specified
dark — chosen to sit in the same family as the site's own pre-canvas
palette (D-003's `--paper` `#EFF1F2` and `--ink` `#1C2830`, from before
the canvas became the design authority).

Nothing on the site stays the canvas's dark always any more — D-052 first
left three sections exempt (everything holding a live `mh-bg` field, plus
the hero's 3D scene), on the reasoning that a light theme over a
transparent canvas drawing light lines on nothing would leave those lines
near invisible. D-053 and D-054, the same day, themed those too, by two
different routes:

The hero's 3D scene (D-053) — background and materials both.
`hands-scene.html`'s canvas was already transparent (`alpha:true`, no
clear colour), so the frame's background was always whatever sat behind
it in `index.astro`; that div is tokenised like everything else now, so
the scene's backdrop follows the theme with no change inside the scene
itself. The one thing inside the scene that did need a change is the
wireframe icosahedron (`wire`/`wireDim`): coloured light-on-dark, it goes
near invisible on a light page unless swapped for something dark. Every
other material — skin, steel, graphite, the emissive rings — already
reads on either backdrop, steel especially: it's a mirror-finish
material reflecting a fixed, separately-lit environment rig, so it
renders dark regardless of the page around it, without needing to change
at all. Since the scene runs in an iframe — a separate document, its own
`window` — the parent's CSS custom properties can't reach into it;
`src/layouts/Layout.astro`'s script tells it the active theme over
`postMessage`, once the scene confirms it's loaded enough to listen and
again on every toggle.

The `mh-bg` fields (D-054) — Home's `#signal-plane`, Partner's `#join`,
and the panel holding Research's Theme 01 network graphic — each carry
lines, node fills and text coloured for the canvas's dark theme. Unlike
the 3D scene, `mh-bg` runs in the same document as the page, so it just
watches `data-theme` on `<html>` directly (a `MutationObserver`, in
`public/design/mh-bg.js`) rather than needing `postMessage`, and swaps
its own line and fill colours for a dark-on-light equivalent when the
theme is light. The accent (red) is unchanged in every mode, same as
everywhere else on the site.

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

The canvas is drawn at one width, 1340px. Each of the site's five pages fills
whatever screen it is on and scales the artboard through Bootstrap's
breakpoints — 576, 768, 992, 1200, 1400 — in one stylesheet shared by all of
them, at the top of `src/layouts/Layout.astro`:

- The gutter steps 48 → 40 → 32 → 28 → 24 → 20px.
- Each theme's two columns go one below 992px (D-047), text and visual in
  the order they're written. A member's profile row goes portrait-beside-
  text → stacked, portrait first, below 768px (D-055).
- The hero fills the viewport height; its display line steps 54 → 44 → 38px;
  the section titles 52 → 40 → 34px.
- There is one header — 2a's — fixed to the top of every page on 1d's
  translucent ground, and one footer at the foot of every page; the headers
  drawn inside 1a, 1b, 1c and 1d are not repeated. Below 768px the header's
  links become a Menu button that opens a stacked list.

Nothing else about the canvas changes with the screen.
