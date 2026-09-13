import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright drives the *built* site, not the dev server, so what is checked
 * is what would ship: minified CSS, fingerprinted fonts, the real script
 * bundle.
 *
 * Screenshots go to screenshots/, which is gitignored. Committing them would
 * turn every rendering difference between machines into a diff, and the point
 * of this harness is to look at the output, not to version it.
 */
export default defineConfig({
  testDir: './src/e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : [['list']],

  use: {
    baseURL: 'http://localhost:4321',
    /* Motion is ON by default, and that matters.
     *
     * This previously passed --force-prefers-reduced-motion to Chromium for
     * "deterministic screenshots", which silently forced every spec in the
     * suite into reduced motion. The load animation never ran in a single
     * test, and the captures were not of the page most people see. Specs that
     * want the reduced path now ask for it explicitly with
     * test.use({ reducedMotion: 'reduce' }). */
    reducedMotion: 'no-preference',
  },

  /* Three engines, because two of this site's decisions turn on engine
     behaviour: D-020 on whether `d` can be transitioned, and the trace's
     reliance on SVG elements being focusable. Chromium alone would have let
     both go unverified — and did, until T-51 found D-020 named the wrong
     browser. */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  /* No webServer block on purpose.
   *
   * Astro 7's `astro preview` always daemonises: it prints its pid, tells you
   * how to stop it, and returns. Playwright's webServer expects a process that
   * stays in the foreground and treats that exit as a crash — "Process from
   * config.webServer exited early". So the server lifecycle lives in the
   * `shots` npm script instead, which builds, starts the daemon, runs the
   * suite and stops it again. */
});
