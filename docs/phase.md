# Phases

Current phase: **real content is live**.

The publication lists, funders and contact address Kaung supplied are on the
page (D-030). What was invented to fill those gaps — the mastery figure, the
teaching assistant, the deployment and "established" claims — is removed.

## What is left

- **Course materials** — still a named gap on the Learning panel, waiting on
  which courses go public and who owns them.
- **Paper and code URLs** — the publication lists carry short name, venue,
  year and a `code` tag where code exists, but no links, since none were
  supplied. Adding them is a direct edit to the `<li>` rows in
  `src/pages/research.astro`, wrapping the short name in an `<a>`.
- **Institutional affiliation** — not stated anywhere on the site.

**Exit gate:** every `TODO:` on the page is replaced with a supplied fact.
