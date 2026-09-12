# Plan

## Who this is for

In priority order:

1. Researchers in AIED, educational data mining, and explainable AI who have
   hit one of the lab's papers and want to know what else is here, whether
   there is code, and who to email.
2. Prospective PhD and master's students deciding whether to apply or write.
3. Programme committees, reviewers, and funders checking the group is real and
   active.

Nobody in that list wants to be persuaded. They want to find something and
leave. A page that slows them down to show off has failed.

## What success looks like

Someone who has never heard of the lab should be able to say, within about
fifteen seconds, what the two research programmes are and what kind of problem
they attack. Someone who already knows the field should be able to reach any
paper or repository in two clicks from the home page.

If the trace widget makes one person understand knowledge tracing who did not
before, that is worth more than the rest of the site combined.

## Non-goals

No blog. No news feed that will be stale in four months. No newsletter. No
metrics, citation counts, or rankings. No "join us" page until there is
something concrete to join. No dark mode in v1.

## Information architecture

Four pages. Publications is the only one that grows.

```
/                  Home
/research          Both programmes, in full
/publications      Everything, reverse chronological, filterable
/people            PI, students, collaborators, alumni
```

Contact is a line in the footer, not a page. Funding sits at the foot of
`/research`, not on its own.

## Home page

```
┌──────────────────────────────────────────────────────┐
│  MINN HAI Lab                          research  ... │
│                                                      │
│  Human-centered AI                                   │
│  One sentence, plain, no adjectives.                 │
│                                                      │
│   ┌────────────────────────────────────────────┐     │
│   │  ✓ ✗ ✓ ✓ ✗ ✓ ✓ ✓   ← toggleable attempts   │     │
│   │  ╭─────────────────╮                       │     │
│   │  ╰─ mastery estimate curve ────────────    │     │
│   │  "the model now estimates 0.61 on          │     │
│   │   fractions. these three attempts moved    │     │
│   │   it most."                                │     │
│   └────────────────────────────────────────────┘     │
│                                                      │
│  Two programmes, two short blocks, each linking      │
│  into /research. Prose, not cards.                   │
│                                                      │
│  Recent work: five most recent publications, plain   │
│  rows, paper and code links inline.                  │
└──────────────────────────────────────────────────────┘
```

The widget is the whole design argument. Build it before anything else,
because if it does not work the site needs a different plan.

It runs on synthetic data illustrating the method. Label it as such, visibly.
Do not present it as output from a trained model on real student data unless it
actually is, and even then check what the data licence allows.

## Research page

Two sections, one per programme. Each follows the same shape, because the shape
is how a researcher reads:

- What breaks without this work. One paragraph, concrete.
- What the approach bets on. One paragraph.
- What it needs, in data terms.
- What it still cannot do. This one matters and most lab sites omit it.
- The relevant publications, inline.

Funding acknowledgement at the foot, plain text, no logo wall.

## Publications page

Reverse chronological, one row each: title, authors, venue, year, paper link,
code link where it exists. Filter by year and by programme. That is all.

Roughly fourteen entries today, so no pagination, no search. Both become worth
adding around forty.

## Content inventory

Already supplied, needs formatting only:

- Lab mission paragraph.
- Two project descriptions.
- Publication list, both programmes.
- Funder list.
- Contact email.

Missing, blocks launch:

- People. There is currently no name on the site at all. At minimum the PI,
  with role and a link. Students and collaborators if they consent.
- Institutional affiliation. Where is the lab based?
- Authors for each publication. The list has titles and venues only.
- Verified funder names. The source list reads "Uni Kyoto-Inria associate team
  grant", "Uni Library Rec. Syst." and similar, which look abbreviated or
  partially redacted. These need checking before publication.
- Real URLs for every paper and code link.
- Confirmation of the lab name as it should appear. "MINN HAI Lab", "MINN HAI
  (Human-centered AI) Lab", and "HAI Lab" all appear in the brief.

Missing, does not block launch:

- Photographs of anything.
- A logo or wordmark. Set type well and this is not urgent.
- Teaching or course material.
- An open positions section.

## Publication list as given

Personalised learning programme:

| Short name | Venue | Year | Code |
|---|---|---|---|
| EIKT | AIED | 2025 | — |
| Privacy-Preserving Synthetic Data Generation | EC-TEL | 2018 | — |
| IKT | AAAI | 2022 | yes |
| BKT-LSTM | arXiv | 2021 | yes |
| DSCMN | PAKDD | 2019 | yes |
| DKT-DSC | ICDM | 2018 | yes |
| KT | ICDM | 2018 | — |
| Q-matrix Refinement | EC-TEL | 2016 | — |
| University library recommender system | e-Learning | 2013 | — |

Interpretability programme:

| Short name | Venue | Year | Code |
|---|---|---|---|
| LAPLACE | arXiv | 2023 | yes |
| FSBN & SSBN | ICDM CXAI | 2023 | — |
| GBNC | DSAA | 2014 | — |
| GMBNC | MLDM | 2014 | — |
| MBNC | Computer Science and Application | 2014 | — |

Two things to check. The EC-TEL 2018 privacy paper is filed under personalised
learning but may sit better on its own or under interpretability. And the
source list writes "Q-matrix Reinment", which I have read as Refinement;
confirm before it goes live.

## Technical choices

Astro, because the site is nine-tenths static text and one interactive widget,
and that is precisely the case Astro handles better than a React framework. The
widget is an island. Everything else is HTML.

Tailwind v4 with the design tokens defined as CSS custom properties in one
file, so the tokens are readable outside Tailwind and the agent has a single
place to look.

Publications in `src/data/publications.ts` as a typed array. One file to edit,
one file to audit.

Deploy target still open. See `design/decisions.md`, D-008.

## Repository layout

```
minn-hai-lab/
├── CLAUDE.md
├── docs/
│   ├── handbook.md
│   ├── plan.md
│   └── phase.md
├── design/
│   ├── DESIGN.md
│   ├── decisions.md
│   └── references/
├── prototypes/            gitignored
├── src/
│   ├── data/publications.ts
│   ├── components/
│   ├── pages/
│   └── styles/tokens.css
└── public/
```
