import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Unit tests only. Playwright specs live in src/e2e and end in .spec.ts;
    // without this include vitest would pick them up and try to run them
    // itself, which fails in a way that looks like a broken test rather than
    // a misrouted one.
    include: ['src/**/*.test.ts'],
  },
});
