# Fonts

Both faces are self-hosted. Nothing on the site fetches a font from another
origin at runtime; `src/e2e/outbound.spec.ts` fails if one ever does.

| Face | Files | Weight axis | Source | Licence |
|---|---|---|---|---|
| Literata | `literata-latin.woff2`, `literata-latin-ext.woff2` | opsz 7–72, wght 300–500 as subset | Google Fonts, two-axis build (see Q-5) | SIL Open Font License 1.1 |
| Space Grotesk | `space-grotesk-latin.woff2`, `space-grotesk-latin-ext.woff2` | wght 300–700 | Google Fonts, v22, fetched 2026-09-14 from fonts.gstatic.com | SIL Open Font License 1.1 |

Space Grotesk: Florian Karsten, https://github.com/floriankarsten/space-grotesk.
Literata: TypeTogether for Google, https://github.com/googlefonts/literata.
