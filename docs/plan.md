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
| Learning | `/learning` | The learning panel: StatLab, linked out; course materials, holding the StatLab repo link, more still a gap (D-064) |
| Members | `/members` | Profile rows — portrait, name, role, bio, links — grouped Faculty / Post Doctoral / Doctoral / Master / Intern, headed "Members"; a group with no active people is hidden entirely (D-062) |
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
members by name, role and photo across Faculty, Doctoral and Master,
three of them (Dr. Sein Minn, Md Kamal Hosen, Kaung Hein Htet) with a
bio and links. Post Doctoral and Intern are empty for now (D-062) —
every slot in them is a placeholder, commented out in
`src/pages/members.astro`, so neither group shows on the page.

Still `TODO:` on the page: Visual generative modeling's publications; Theme
02 and Theme 03's visuals (both marked "image / 3D object — placeholder");
the two Post Doctoral, two Doctoral and one Intern member's names and
photos — all six commented out (D-062), waiting on people who haven't
arrived; a bio and links (Google Scholar, LinkedIn, …) for every member
but Dr. Sein Minn, Kamal and Kaung Hein Htet; course materials beyond
the StatLab repo link. Adding
any of the member items is a data edit in `src/pages/members.astro` —
the note at the top of that file says how, including uncommenting a
placeholder back in.

## How to change anything

Edit the canvas. Re-transcribe following the notes at the top of
`src/layouts/Layout.astro` and the page you're changing. Build, look at 1440
and 360, run `npm run verify`.
