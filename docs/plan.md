# Plan

The site is one page: the design canvas in `MINN HAI LAB UI Design/`,
transcribed. `src/pages/index.astro` is the whole of it.

## Information architecture

Sections, in the canvas's order, each an anchor the header and footer link
to:

| Anchor | Section |
|---|---|
| `#top` | The reach — the hero (2a) |
| `#deep-field` | Deep Field (1a) — the network, the two-column strip |
| `#lattice` | Lattice (1b) — the two programme rows over the lattice field |
| `#signal-plane` | Signal Plane (1c) — "We model the learner, not the average." over the plane |
| `#research` | Research header band, then the two programme rows, each with its real publication list |
| `#learning` | The learning panel: StatLab, linked out; course materials, still a gap |
| `#people` | Five portrait frames and the hiring card, headed "Members" |
| `#funding` | The seven funders, by name |
| `#join` | "Bring us a problem that needs an explanation." — partner, open roles |

The previous site's routes — `/research`, `/learning`, `/people`, `/about` —
redirect to those anchors.

## Content inventory

Real, on the page: fourteen publications across both programmes (short name,
venue, year, a `code` tag where code exists — no URLs, none supplied); seven
funders by name; the contact address, as a live `mailto:` in three places; the
hero and programme copy, checked against the lab's supplied bio.

Still `TODO:` on the page: member names, roles and portraits; course
materials; paper and code URLs.

Still unconfirmed either way, deliberately left rather than guessed: whether
the lab is hiring. See `docs/phase.md`.

## How to change anything

Edit the canvas. Re-transcribe following the notes at the top of
`src/pages/index.astro`. Build, look at 1440 and 360, run `npm run verify`.
