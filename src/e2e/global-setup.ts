/**
 * Refuse to run against anything but a production build.
 *
 * The suite talks to whatever is listening on its port. A dev server was
 * running on 4321 once and the whole suite ran against it: 30 failures caused
 * by Vite's client and the Astro dev toolbar rather than by the site.
 *
 * The noise was the lesser problem. Several of those specs measure script
 * payload and count script requests — had they happened to pass, verify would
 * have reported green while testing a build nobody was going to ship. A check
 * that can silently point at the wrong thing is worse than no check.
 *
 * So: fail loudly, before a single spec runs, with what to do about it.
 */
import type { FullConfig } from '@playwright/test';

/** Markers only a dev server emits. */
const DEV_MARKERS = ['/@vite/client', 'astro-dev-toolbar', '/@id/astro/runtime'];

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL;
  if (!baseURL) throw new Error('No baseURL configured; cannot verify the server.');

  let html: string;
  try {
    const response = await fetch(baseURL);
    html = await response.text();
  } catch (error) {
    throw new Error(
      `Nothing is serving ${baseURL}.\n` +
        'Run `npm run verify`, which builds and starts the preview server, ' +
        'rather than `playwright test` on its own.\n' +
        `(${error instanceof Error ? error.message : String(error)})`,
    );
  }

  const found = DEV_MARKERS.filter((marker) => html.includes(marker));
  if (found.length > 0) {
    throw new Error(
      `${baseURL} is a dev server, not a production build.\n\n` +
        `Found: ${found.join(', ')}\n\n` +
        'This suite measures script payload and counts script requests, so a ' +
        'dev server makes it meaningless — and if the numbers happened to fit, ' +
        'it would report green while testing a build nobody ships.\n\n' +
        'Stop whatever is on that port (`astro preview stop`, or the dev ' +
        'server in your editor) and run `npm run verify` again.',
    );
  }
}
