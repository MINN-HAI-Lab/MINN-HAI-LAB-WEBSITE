/**
 * Internal URLs that survive being served from a subpath.
 *
 * D-008 names GitHub Pages as the likeliest host and ties the decision to the
 * domain. A GitHub *project* page is served from `/<repo>/`, not from the
 * root, and every literal `href="/..."` in a template breaks there — the
 * header link, the 404 links and the favicon all 404, on a site that builds
 * and tests perfectly at the root.
 *
 * Astro rewrites the URLs it generates itself (bundled CSS, the script, the
 * font files) when `base` is set. It does not touch a string you typed into an
 * href. This is that missing half.
 *
 * Nothing here decides anything: with no `base` configured, BASE_URL is "/"
 * and every path comes back unchanged. It only means the decision, when it
 * comes, is a one-line config change rather than a hunt through templates.
 */

/**
 * Join a base and a path.
 *
 * Separate from withBase so it can be tested against bases this build will
 * never have. import.meta.env.BASE_URL is fixed at build time, so a test of
 * withBase alone can only ever exercise the root case — which is the one case
 * that was never going to break.
 */
export function joinBase(base: string, path: string): string {
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalised = path.startsWith('/') ? path : `/${path}`;
  const joined = `${trimmed}${normalised}`;
  // "" + "/" and "/" trimmed to "" both need to come back as "/". Returning
  // "//" would be a protocol-relative URL pointing at another host entirely.
  return joined === '' ? '/' : joined;
}

/** Prefix an internal path with the configured base. */
export function withBase(path: string): string {
  return joinBase(import.meta.env.BASE_URL ?? '/', path);
}
