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
    // Deterministic rendering: no OS animation timing in the captures.
    launchOptions: { args: ['--force-prefers-reduced-motion'] },
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  /* No webServer block on purpose.
   *
   * Astro 7's `astro preview` always daemonises: it prints its pid, tells you
   * how to stop it, and returns. Playwright's webServer expects a process that
   * stays in the foreground and treats that exit as a crash — "Process from
   * config.webServer exited early". So the server lifecycle lives in the
   * `shots` npm script instead, which builds, starts the daemon, runs the
   * suite and stops it again. */
});
