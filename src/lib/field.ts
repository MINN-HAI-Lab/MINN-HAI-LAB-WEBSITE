/**
 * The 3D fields behind the page, from the design canvas's mh-bg.js.
 *
 * Two modes, both canvas 2D, both dependency-free, both cheap:
 *
 *   bayes — the lab's own Bayesian network, perspective-projected and slowly
 *           turning, with the Markov blanket of Mastery lit and evidence
 *           pulsing along the arrows. Same NODES and EDGES as artefact 2, same
 *           markovBlanket(): the canvas's caption says "the lattice is the
 *           lab's Markov-blanket graph, not decoration", and this is what
 *           makes that true. CLAUDE.md bans an ambient field of nodes that
 *           means nothing; these nodes are named variables a reader can read.
 *
 *   grid  — a perspective plane that ripples away from the cursor, for the
 *           closing band.
 *
 * The canvas's third mode, a lattice of random points, is deliberately not
 * ported: it is exactly the banned thing, and the bayes field does its job
 * with real content.
 */
import { EDGES, NODES, layoutNetwork, markovBlanket, VIEW } from './network.ts';

export type FieldMode = 'bayes' | 'grid';

interface Point3 {
  x: number;
  y: number;
  z: number;
}

interface Projected {
  x: number;
  y: number;
  /** Depth after rotation, for size and fade. */
  d: number;
}

/** A small deterministic hash, for the z that the 2D layout does not have. */
function hashZ(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return ((h >>> 0) / 4294967296) * 1.4 - 0.7;
}

export interface Field {
  destroy(): void;
}

export function mountField(host: HTMLElement, mode: FieldMode): Field {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy: () => canvas.remove() };
  const g = ctx;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let w = 0;
  let h = 0;
  let visible = true;
  let raf = 0;
  const t0 = performance.now();
  /* Read once. Reading it inside the frame loop forced a style recalculation
     sixty times a second on every page with a field on it — Lighthouse put
     770ms of "Style & Layout" on the home page, and this was most of it. */
  const labelFont = `500 11px ${getComputedStyle(document.documentElement).getPropertyValue('--font-sans') || 'system-ui'}`;

  /* The network, once, in a unit-ish box. The 2D layout is the same one the
     static SVG uses; z comes from a hash of the id so it is stable too. */
  const placed = layoutNetwork(NODES, EDGES);
  const nodes = placed.map((n) => ({
    id: n.id,
    label: n.label,
    x: ((n.x - VIEW.width / 2) / VIEW.width) * 3.2,
    y: ((n.y - VIEW.height / 2) / VIEW.height) * 1.9,
    z: hashZ(n.id),
  }));
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const edges = EDGES.map((e) => [index.get(e.from)!, index.get(e.to)!] as const);
  const blanket = markovBlanket('mastery');
  const role = (id: string): 't' | 'b' | '' =>
    id === 'mastery' ? 't' : blanket.all.includes(id) ? 'b' : '';
  const pulses = edges.map((_, i) => ({ e: i, ph: (i * 0.618) % 1 }));

  function onPointer(e: PointerEvent): void {
    const r = host.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
  }
  window.addEventListener('pointermove', onPointer, { passive: true });

  function resize(): void {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    w = r.width;
    h = r.height;
    canvas.width = Math.max(2, Math.floor(r.width * dpr));
    canvas.height = Math.max(2, Math.floor(r.height * dpr));
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { rootMargin: '160px' },
  );
  io.observe(host);

  function project(p: Point3, t: number): Projected {
    const ry = t * 0.1 + pointer.x * 0.5;
    const rx = -pointer.y * 0.32;
    const x = p.x * Math.cos(ry) - p.z * Math.sin(ry);
    let z = p.x * Math.sin(ry) + p.z * Math.cos(ry);
    const y = p.y * Math.cos(rx) - z * Math.sin(rx);
    z = p.y * Math.sin(rx) + z * Math.cos(rx);
    const f = 2.6 / (3.1 + z);
    /* Scaled to the host in each axis separately. A uniform scale from the
       shorter side made the network a knot in the middle of a 1440x280 band;
       the canvas fills its bands edge to edge, and a background field can
       take a little flattening. */
    const sx = Math.min(w * 0.3, h * 1.1);
    const sy = h * 0.42;
    return { x: w / 2 + x * f * sx, y: h / 2 + y * f * sy, d: z };
  }

  function drawBayes(t: number): void {
    g.clearRect(0, 0, w, h);
    const P = nodes.map((n) =>
      project(
        {
          x: n.x * 0.78 + 0.02 * Math.sin(t * 0.7 + n.x * 3),
          y: n.y * 0.78 + 0.02 * Math.cos(t * 0.6 + n.y * 4),
          z: n.z * 0.78,
        },
        t * 0.35,
      ),
    );

    g.lineWidth = 1;
    edges.forEach(([i, j]) => {
      const a = P[i]!;
      const b = P[j]!;
      const ra = role(nodes[i]!.id);
      const rb = role(nodes[j]!.id);
      const inBlanket = ra === 't' || rb === 't' || (ra !== '' && rb !== '');
      const alpha = (inBlanket ? 0.55 : 0.22) * (1 - (a.d + b.d) / 8);
      g.strokeStyle = `rgba(${inBlanket ? '200,214,220' : '140,168,180'},${alpha.toFixed(3)})`;
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.stroke();
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const r = 13 - b.d * 2;
      const tx = b.x - Math.cos(ang) * r;
      const ty = b.y - Math.sin(ang) * r;
      g.fillStyle = g.strokeStyle;
      g.beginPath();
      g.moveTo(tx, ty);
      g.lineTo(tx - Math.cos(ang - 0.42) * 7, ty - Math.sin(ang - 0.42) * 7);
      g.lineTo(tx - Math.cos(ang + 0.42) * 7, ty - Math.sin(ang + 0.42) * 7);
      g.closePath();
      g.fill();
    });

    if (!reduced) {
      for (const p of pulses) {
        const [i, j] = edges[p.e]!;
        const a = P[i]!;
        const b = P[j]!;
        const u = (t * 0.22 + p.ph) % 1;
        g.fillStyle = `rgba(230,51,96,${(0.85 * Math.sin(u * Math.PI)).toFixed(3)})`;
        g.beginPath();
        g.arc(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, 1.8, 0, 6.29);
        g.fill();
      }
    }

    /* Labels need room. Under 220px of height they overlap each other and
       say nothing, so a small field shows the structure alone. */
    const labelled = h >= 220;
    g.font = labelFont;
    g.textBaseline = 'middle';
    nodes.forEach((n, i) => {
      const p = P[i]!;
      const k = role(n.id);
      const r = (k === 't' ? 9 : k ? 6 : 4.5) * (1 - p.d * 0.12);
      if (k === 't') {
        g.fillStyle = 'rgba(230,51,96,.18)';
        g.beginPath();
        g.arc(p.x, p.y, r * 2.6 + Math.sin(t * 2) * 2, 0, 6.29);
        g.fill();
      }
      g.fillStyle = k === 't' ? 'rgba(230,51,96,.95)' : k ? 'rgba(226,235,239,.95)' : 'rgba(7,9,12,1)';
      g.beginPath();
      g.arc(p.x, p.y, r, 0, 6.29);
      g.fill();
      if (!k) {
        g.strokeStyle = 'rgba(180,200,210,.7)';
        g.lineWidth = 1.2;
        g.stroke();
      }
      if (!labelled) return;
      g.fillStyle = k === 't' ? 'rgba(240,244,246,.95)' : `rgba(226,235,239,${k ? 0.78 : 0.5})`;
      g.textAlign = p.x > w / 2 ? 'left' : 'right';
      g.fillText(n.label, p.x + (p.x > w / 2 ? r + 8 : -r - 8), p.y);
    });
  }

  function drawGrid(t: number): void {
    g.clearRect(0, 0, w, h);
    const N = 46;
    const M = 30;
    const mx = pointer.tx;
    const my = pointer.ty;
    const pt = (i: number, j: number): { x: number; y: number } => {
      const x = (i / N) * 2 - 1;
      const z = (j / M) * 2.4 - 0.35;
      const dx = x - mx * 1.1;
      const dz = z - (my * 0.5 + 0.8);
      const dd = Math.sqrt(dx * dx + dz * dz);
      const y = (Math.sin(dd * 7 - t * 2.2) * 0.085) / (1 + dd * 3.2) + Math.sin(x * 3 + t * 0.5) * 0.02;
      const f = 1.9 / (1.25 + z * 1.5);
      return { x: w / 2 + x * f * w * 0.55, y: h * 0.62 - (y + 0.1) * f * h * 0.9 };
    };
    for (let j = 0; j <= M; j += 1) {
      g.beginPath();
      for (let i = 0; i <= N; i += 1) {
        const p = pt(i, j);
        if (i) g.lineTo(p.x, p.y);
        else g.moveTo(p.x, p.y);
      }
      g.strokeStyle = `rgba(158,186,198,${(0.32 * (1 - j / M) + 0.03).toFixed(3)})`;
      g.lineWidth = 1;
      g.stroke();
    }
    for (let i = 0; i <= N; i += 1) {
      g.beginPath();
      for (let j = 0; j <= M; j += 1) {
        const p = pt(i, j);
        if (j) g.lineTo(p.x, p.y);
        else g.moveTo(p.x, p.y);
      }
      g.strokeStyle = `rgba(120,148,162,${(0.12 + 0.1 * Math.abs(Math.sin(i * 0.4 + t * 0.3))).toFixed(3)})`;
      g.stroke();
    }
    const c = pt(((mx + 1) / 2) * N, ((my * 0.5 + 0.8 + 0.35) / 2.4) * M);
    g.fillStyle = 'rgba(230,51,96,.9)';
    g.beginPath();
    g.arc(c.x, c.y, 3.2, 0, 6.29);
    g.fill();
  }

  function loop(): void {
    raf = requestAnimationFrame(loop);
    if (!visible || !w) return;
    const t = ((performance.now() - t0) / 1000) * (reduced ? 0.15 : 1);
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    if (mode === 'grid') drawGrid(t);
    else drawBayes(t);
  }

  resize();
  raf = requestAnimationFrame(loop);

  return {
    destroy(): void {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      canvas.remove();
    },
  };
}
