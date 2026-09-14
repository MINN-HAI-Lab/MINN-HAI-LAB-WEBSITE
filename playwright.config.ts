import { defineConfig } from '@playwright/test';

/** Drives the built site on the preview server: `npm run verify`. */
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4331' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
