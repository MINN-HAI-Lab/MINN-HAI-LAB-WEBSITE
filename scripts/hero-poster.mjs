/**
 * Render the hero's poster image.
 *
 * The hero is a live Three.js scene that loads after the page has painted.
 * Before it arrives — and for a reader with JavaScript off, or reduced motion,
 * or no WebGL — the same scene is shown as a still, rendered by this script
 * from the scene itself at the reduced-motion pose (reach 0.6). So the still
 * is an honest picture of the thing that replaces it, not an illustration.
 *
 *   node scripts/hero-poster.mjs
 *
 * Writes src/assets/hero-poster.jpg at 1440x900 over the field colour. Needs
 * the Playwright Chromium already installed for the e2e suite, and the design
 * folder's hands-scene.html, which is the scene's reference implementation.
 */
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const scene = join(root, 'MINN HAI LAB UI Design', 'hands-scene.html');
const out = join(root, 'src', 'assets', 'hero-poster.jpg');

const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto('file://' + scene);
await page.addStyleTag({ content: 'html,body{background:#06080A!important}' });
await page.waitForTimeout(3000);
// The reduced-motion pose, which is also where the live scene rests.
await page.evaluate(() => window.__set(0.6));
await page.waitForTimeout(800);
await page.screenshot({ path: out, type: 'jpeg', quality: 82 });
await browser.close();
console.log('wrote', out);
