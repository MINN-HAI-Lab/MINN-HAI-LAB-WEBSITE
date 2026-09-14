# Plan

The site is one page: the design canvas in `MINN HAI LAB UI Design/`,
transcribed. `src/pages/index.astro` is the whole of it.

## Information architecture

Sections, in the canvas's order, each an anchor the header and footer link
to:

| Anchor | Section |
|---|---|
| `#top` | The reach — the hero (2a) |
| `#research` | Research header band, then the two programme rows |
| `#learning` | Paper detail template beside the learning panel (teaching assistant, StatLab, course materials) |
| `#people` | Five portrait frames and the hiring card |
| `#join` | "Bring us a problem that needs an explanation." — partner, open roles |

The previous site's routes — `/research`, `/learning`, `/people`, `/about` —
redirect to those anchors.

## Content inventory

On the page from the canvas: the hero copy, the programme descriptions, the
learning panel's copy, the people section's structure, the closing line.

Still `TODO:` on the page, as the canvas has them: publication title, authors,
venue, year, DOI and abstract; course materials.

To confirm or supply, in the canvas: see `docs/phase.md`.

## How to change anything

Edit the canvas. Re-transcribe following the notes at the top of
`src/pages/index.astro`. Build, look at 1440 and 360, run `npm run verify`.
