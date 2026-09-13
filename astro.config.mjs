// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * The lab's domain, supplied at build time rather than written down here.
 *
 * TODO: nothing in this repository knows the domain. It is open question 10 in
 * design/decisions.md, D-008 ties hosting to it, and it is tracked as B-8.
 * Kaung to supply. Set it as an environment variable when building:
 *
 *   SITE_URL=https://the-real-domain.example npm run build
 *
 * It is not written here as a plausible placeholder, because a wrong domain in
 * a sitemap is worse than no sitemap: it is the kind of thing that looks
 * finished, ships, and is only noticed when the search results are wrong.
 *
 * With it set, three things switch on together: the sitemap, the canonical
 * URLs, and an absolute og:image (Q-13, Q-14). Without it, none of them
 * appear and the build says nothing about it — the sitemap integration used to
 * warn on every single build, which is how a project learns to stop reading
 * its own build output.
 */
const site = process.env.SITE_URL;

// Static output. No adapter, no SSR. See docs/plan.md.
export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),

  integrations: site ? [sitemap()] : [],

  // Literata, self-hosted. The two woff2 files in src/assets/fonts are the
  // latin and latin-ext subsets of the *two-axis* build, carrying both wght
  // and opsz.
  //
  // They are checked in rather than fetched at build time because Astro's
  // google() provider wrapper takes no arguments — it drops any config passed
  // to it — so there is no way to ask it for the opsz axis. Its wght-only
  // files are 32K/38K; these are 84K/69K, which is the axis showing up in the
  // byte count. DESIGN.md picks Literata *for* opsz, so the larger file is the
  // point, not an accident. See Q-5 in docs/review-queue.md.
  //
  // Nothing here talks to fonts.googleapis.com or fonts.gstatic.com at runtime.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Literata',
      cssVariable: '--font-literata',
      fallbacks: ['serif'],
      options: {
        variants: [
        {
          weight: '400 500',
          style: 'normal',
          src: ['./src/assets/fonts/literata-latin.woff2'],
          unicodeRange: [
          'U+0000-00FF',
          'U+0131',
          'U+0152-0153',
          'U+02BB-02BC',
          'U+02C6',
          'U+02DA',
          'U+02DC',
          'U+0304',
          'U+0308',
          'U+0329',
          'U+2000-206F',
          'U+20AC',
          'U+2122',
          'U+2191',
          'U+2193',
          'U+2212',
          'U+2215',
          'U+FEFF',
          'U+FFFD',
          ],
        },
        {
          weight: '400 500',
          style: 'normal',
          src: ['./src/assets/fonts/literata-latin-ext.woff2'],
          unicodeRange: [
          'U+0100-02BA',
          'U+02BD-02C5',
          'U+02C7-02CC',
          'U+02CE-02D7',
          'U+02DD-02FF',
          'U+0304',
          'U+0308',
          'U+0329',
          'U+1D00-1DBF',
          'U+1E00-1E9F',
          'U+1EF2-1EFF',
          'U+2020',
          'U+20A0-20AB',
          'U+20AD-20C0',
          'U+2113',
          'U+2C60-2C7F',
          'U+A720-A7FF',
          ],
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
