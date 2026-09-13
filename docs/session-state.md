# Session state

Branch: `auto/site`. Never pushed.

This run builds the site to the aesthetic override in the brief, which
supersedes `CLAUDE.md` and `design/DESIGN.md` on every visual point. The
conflict is logged as Q-19 rather than halted on.

---

## IN PROGRESS

Nothing.

---

## QUEUE

## DONE

- **S-01** — Dark instrument palette in tokens.css, contrast verified against the glass composite. Token lint drops the shadow rule; contrast suite rewritten for the new system.

---

## NOTES

- The previous run (T-01 to T-55, on `main`) built the light-palette version.
  Its infrastructure survives: the BKT model, the geometry module, the
  contrast maths, the token lint, the browser harness on port 4331 with its
  dev-server guard. The visual layer is being replaced.
- Contrast measured against the glass composite, not the field: --text 14.36-16.70:1, --text-muted 5.93-6.89:1, --signal 5.25-5.70:1. Tightest case is muted text on glass over --field-2 at 5.93:1 — first thing to fail if the surface alpha rises.

