import { describe as suite, expect, it } from 'vitest';
import { joinBase, withBase } from './paths.ts';

suite('joinBase', () => {
  it('changes nothing when the site is served from the root', () => {
    expect(joinBase('/', '/')).toBe('/');
    expect(joinBase('/', '/favicon.svg')).toBe('/favicon.svg');
    expect(joinBase('/', '/research')).toBe('/research');
  });

  it('prefixes a subpath, which is what a GitHub project page needs', () => {
    expect(joinBase('/minn-hai-lab', '/')).toBe('/minn-hai-lab/');
    expect(joinBase('/minn-hai-lab', '/favicon.svg')).toBe('/minn-hai-lab/favicon.svg');
  });

  it('accepts a base with or without a trailing slash', () => {
    expect(joinBase('/lab/', '/favicon.svg')).toBe('/lab/favicon.svg');
    expect(joinBase('/lab', '/favicon.svg')).toBe('/lab/favicon.svg');
  });

  it('never produces a protocol-relative URL', () => {
    // "//" points at another host. Getting this wrong would send every link
    // on the site somewhere else entirely.
    for (const base of ['/', '', '/lab', '/lab/']) {
      for (const path of ['/', '/favicon.svg', 'favicon.svg']) {
        expect(joinBase(base, path).startsWith('//')).toBe(false);
      }
    }
  });

  it('tolerates a path without a leading slash', () => {
    expect(joinBase('/lab', 'favicon.svg')).toBe('/lab/favicon.svg');
  });
});

suite('withBase', () => {
  it('passes paths through unchanged at the root, which is this build', () => {
    expect(withBase('/favicon.svg')).toBe('/favicon.svg');
    expect(withBase('/')).toBe('/');
  });
});
