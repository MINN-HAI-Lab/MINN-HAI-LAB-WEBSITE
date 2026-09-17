# Plan

The site is five pages, transcribing the design canvas in
`MINN HAI LAB UI Design/`. `src/layouts/Layout.astro` is the shared header
(fixed, every page) and footer; each page is one span of the canvas's
direction 1d, in its order.

## Information architecture

| Page | Route | Content |
|---|---|---|
| Home | `/` | The reach — the hero (2a) — through Deep Field (1a), Lattice (1b) and Signal Plane (1c), "We model the learner, not the average." |
| Research | `/research` | Research header band, then the two programme rows, each with its real publication list |
| Learning | `/learning` | The learning panel: StatLab, linked out; course materials, still a gap |
| Members | `/members` | Five portrait frames, headed "Members" |
| Partner with us | `/partner` | The seven funders by name, then "Bring us a problem that needs an explanation." |

Kaung set these boundaries directly (D-037): Home ends where Research began
as a section; Research runs through Programme 02; Learning and Members are
each their own page; Partner with us is Funding through the close.

The previous site's routes — `/people`, `/about` — redirect to where their
content is now (`/members`, `/partner`). `/research` and `/learning` stayed
put across the single-page detour and back, so they need no redirect.

## Content inventory

Real, on the page: fourteen publications across both programmes (short name,
venue, year, a `code` tag where code exists — no URLs, none supplied); seven
funders by name; the contact address, as a live `mailto:` in three places; the
hero and programme copy, checked against the lab's supplied bio.

Still `TODO:` on the page: member names, roles and portraits; course
materials; paper and code URLs.

## How to change anything

Edit the canvas. Re-transcribe following the notes at the top of
`src/layouts/Layout.astro` and the page you're changing. Build, look at 1440
and 360, run `npm run verify`.
