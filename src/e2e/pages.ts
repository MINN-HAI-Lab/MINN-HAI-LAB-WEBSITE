/**
 * The pages the browser suite runs against.
 *
 * One list, because the previous version had the same list copied into seven
 * specs and every one of them still named `/specimen/`, a page that was
 * deleted when the site was rebuilt. Seven specs failed for the same reason
 * and each had to be found separately.
 */
export interface Page {
  name: string;
  path: string;
  /** Whether this page carries a live artefact, and so ships script. */
  interactive: boolean;
}

export const PAGES: readonly Page[] = [
  { name: 'home', path: '/', interactive: true },
  { name: 'research', path: '/research/', interactive: true },
  { name: 'people', path: '/people/', interactive: false },
  { name: 'learning', path: '/learning/', interactive: false },
  { name: 'about', path: '/about/', interactive: false },
  { name: '404', path: '/404.html', interactive: false },
];

/** Just the paths, for specs that do not need the rest. */
export const PATHS = PAGES.map((page) => page.path);
