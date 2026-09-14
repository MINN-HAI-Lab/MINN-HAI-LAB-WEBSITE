# Handbook

## Run it

```
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/
npm run verify     # build, serve on 4331, run tests/site.spec.ts
```

## Where things are

- `src/pages/index.astro` — the page. The canvas's markup, in order, with
  the transcription notes at the top.
- `public/design/hands-scene.html` — the hero's 3D scene, in an iframe.
- `public/design/mh-bg.js` — the background fields (`<mh-bg mode="lattice|grid|bayes|metal">`).
- `MINN HAI LAB UI Design/` — the canvas itself. The design authority.
- `design/DESIGN.md` — what the canvas specifies, in words.
- `design/decisions.md` — why. D-028 is the current state.
- `docs/review-queue.md` — questions for Kaung, numbered Q-n.

## Before deploying

- Every `TODO:` on the page resolved, and the copy listed in `docs/phase.md`
  confirmed.
- `SITE_URL` set at build time for canonical URLs.
- The hero and the fields checked in a browser with a GPU: the scene is
  Three.js from unpkg and the fields draw to canvas.
- Looked at, at 1920, 1440, 1024, 768 and 360.

## Hosting on GitHub Pages

`.github/workflows/deploy.yml` builds the site and publishes `dist/` on every
push to `main` (or by hand from the Actions tab). One-time setup:

1. Push the repository to GitHub.
2. Settings → Pages → Source: **GitHub Actions**.
3. Merge into `main`, or change the branch in the workflow.

The site's address depends on the repository's name:

- `MINN-HAI-Lab.github.io` → `https://minn-hai-lab.github.io/` (an org site,
  at the root, beside StatLab at `/statLab/`).
- Any other name → `https://minn-hai-lab.github.io/<repo>/` (a project site).

The workflow works out which and sets the base path and site URL; nothing in
the code changes between the two.
