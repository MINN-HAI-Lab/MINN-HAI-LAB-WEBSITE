# Plan

The site is five pages, transcribing the design canvas in
`MINN HAI LAB UI Design/`. `src/layouts/Layout.astro` is the shared header
(fixed, every page) and footer; each page is one span of the canvas's
direction 1d, in its order.

Light is the default theme, dark — the canvas's own colours, unchanged —
a secondary one reachable from the header's icon toggle (D-052, D-053).
The hero's 3D scene and the `mh-bg` fields are themed too (D-053, D-054);
nothing on the site stays the canvas's dark always any more. See
`design/DESIGN.md`'s "Theme" section for the token table and how each
piece hears about a theme change.

## Information architecture

| Page | Route | Content |
|---|---|---|
| Home | `/` | The reach — the hero (2a) — then Signal Plane (1c), "We model for Human, not the AI alone." Deep Field (1a) and Lattice (1b), which used to sit between them, are gone (D-047) |
| Research | `/research` | Research header band, then the three themes zigzagging left and right, each with its real publication list where it has one |
| Learning | `/learning` | The learning panel: StatLab, linked out; course materials, still a gap |
| Members | `/members` | Ten member slots as profile rows — portrait, name, role, bio, links — grouped Founder / Post Doctoral / Doctoral / Master, headed "Members" |
| Partner with us | `/partner` | The seven funders by name, then "Bring us a problem that needs an explanation." |

Kaung set these boundaries directly (D-037): Home ends where Research began
as a section; Research runs through the themes; Learning and Members are
each their own page; Partner with us is Funding through the close.

The previous site's routes — `/people`, `/about` — redirect to where their
content is now (`/members`, `/partner`). `/research` and `/learning` stayed
put across the single-page detour and back, so they need no redirect.

## Content inventory

Real, on the page: fourteen publications across two of the three research
themes, each linked to its paper, five of them to code as well; seven
funders by name; the contact address, as a live `mailto:` in three places;
the hero and theme copy, checked against the lab's supplied bio; six
members by name, role and photo, grouped Founder / Post Doctoral /
Doctoral / Master among ten member slots, one of them (Md Kamal Hosen)
with his bio and his Google Scholar link.

Still `TODO:` on the page: Visual generative modeling's publications; Theme
02 and Theme 03's visuals (both marked "image / 3D object — placeholder");
the two Post Doctoral and two Doctoral members' names and photos; a bio
for every member but Kamal; links (Google Scholar, LinkedIn, …) for every
member but Kamal, who has his Google Scholar; course materials. Adding any of the member items
is a data edit in `src/pages/members.astro` — the note at the top of that
file says how.

## How to change anything

Edit the canvas. Re-transcribe following the notes at the top of
`src/layouts/Layout.astro` and the page you're changing. Build, look at 1440
and 360, run `npm run verify`.
