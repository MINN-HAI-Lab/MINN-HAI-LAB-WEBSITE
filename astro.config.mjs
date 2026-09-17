// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Static output, five pages, no framework CSS. The site is the design canvas
 * in "MINN HAI LAB UI Design/" transcribed across them; see
 * src/layouts/Layout.astro for the shared chrome and page map.
 *
 * `site` is read from SITE_URL at build time so a sitemap and canonical URLs
 * can be added once the domain is decided, without writing a placeholder
 * domain into the repository.
 */
const site = process.env.SITE_URL;

/**
 * Where under the origin the site is served. "/" for an org site
 * (MINN-HAI-Lab.github.io) or a custom domain; "/<repo>" for a GitHub project
 * page. The deploy workflow sets it; locally it is the root.
 */
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  base,
  // /research, /learning stayed put across the single-page detour and back;
  // /people and /about did not, so they redirect to where their content is
  // now.
  redirects: {
    '/people': '/members',
    '/about': '/partner',
  },
});
