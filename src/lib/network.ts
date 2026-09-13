/**
 * Artefact 2 — a Bayesian network and its Markov blankets.
 *
 * Pure, dependency-free, deterministic. The build uses it to place the static
 * SVG and the browser uses the same functions to answer a selection, so the
 * two cannot disagree. The 3D layer, when it loads, is handed the same
 * {nodes, links}.
 *
 * WHAT THIS IS NOT
 *
 * The structure is illustrative. The variable names are the kind of thing a
 * learning-analytics model is built over, and the edges are a plausible
 * dependency structure among them — but this network was not learned from
 * data, it is not the lab's model, and no claim it makes about which variable
 * depends on which is a finding. The artefact says so on its face.
 *
 * What is real is the mathematics. The Markov blanket is computed properly:
 * parents, children, and children's other parents. That definition is what
 * the artefact is actually teaching, and it is worth being exact about.
 */

export interface Node {
  id: string;
  /** Shown on the node. Kept short enough to read at the rendered size. */
  label: string;
  /** Longer description, for the readout when a node is selected. */
  detail: string;
}

export interface Edge {
  /** Parent. The arrow points from here... */
  from: string;
  /** ...to here. */
  to: string;
}

/**
 * Ten variables of the kind a learning-analytics model ranges over.
 *
 * Chosen to make the blanket structure legible: some nodes have parents only,
 * some children only, and at least one has a child with another parent, so
 * that the least obvious part of the definition has something to show.
 */
export const NODES: readonly Node[] = [
  { id: 'prior', label: 'Prior knowledge', detail: 'What the learner knew before this topic began.' },
  { id: 'motivation', label: 'Motivation', detail: 'How much the learner is invested in the task.' },
  { id: 'time', label: 'Time on task', detail: 'How long the learner spends before answering.' },
  { id: 'hints', label: 'Hint requests', detail: 'How often the learner asks for help.' },
  { id: 'attempts', label: 'Attempts', detail: 'How many tries a single item takes.' },
  { id: 'mastery', label: 'Mastery', detail: 'The latent skill state the model is estimating.' },
  { id: 'correct', label: 'Correctness', detail: 'Whether an answer was right.' },
  { id: 'engagement', label: 'Engagement', detail: 'Whether the learner is still working rather than idling.' },
  { id: 'revisits', label: 'Revisits', detail: 'How often the learner returns to earlier material.' },
  { id: 'outcome', label: 'Assessment', detail: 'Performance on a later assessment.' },
];

/** A directed acyclic graph over those variables. Illustrative. */
export const EDGES: readonly Edge[] = [
  { from: 'prior', to: 'mastery' },
  { from: 'prior', to: 'time' },
  { from: 'motivation', to: 'engagement' },
  { from: 'motivation', to: 'time' },
  { from: 'time', to: 'attempts' },
  { from: 'engagement', to: 'attempts' },
  { from: 'engagement', to: 'revisits' },
  { from: 'mastery', to: 'correct' },
  { from: 'mastery', to: 'hints' },
  { from: 'mastery', to: 'outcome' },
  { from: 'attempts', to: 'correct' },
  { from: 'hints', to: 'correct' },
  { from: 'revisits', to: 'mastery' },
];

/** Parents of a node: everything with an edge pointing into it. */
export function parentsOf(id: string, edges: readonly Edge[] = EDGES): string[] {
  return edges.filter((e) => e.to === id).map((e) => e.from);
}

/** Children of a node: everything it points at. */
export function childrenOf(id: string, edges: readonly Edge[] = EDGES): string[] {
  return edges.filter((e) => e.from === id).map((e) => e.to);
}

export interface Blanket {
  parents: string[];
  children: string[];
  /** Other parents of this node's children. The part people forget. */
  coParents: string[];
  /** All three, deduplicated, excluding the target itself. */
  all: string[];
}

/**
 * The Markov blanket of a node.
 *
 * Parents, children, and the children's *other* parents. Conditioned on those,
 * the node is independent of everything else in the network — which is the
 * whole reason the set is interesting, and why the co-parents belong in it
 * even though they look unrelated at a glance.
 */
export function markovBlanket(id: string, edges: readonly Edge[] = EDGES): Blanket {
  const parents = parentsOf(id, edges);
  const children = childrenOf(id, edges);

  const coParents = [
    ...new Set(
      children.flatMap((child) => parentsOf(child, edges)).filter((parent) => parent !== id),
    ),
  ];

  const all = [...new Set([...parents, ...children, ...coParents])].filter((n) => n !== id);
  return { parents, children, coParents, all };
}

/** A placed node. */
export interface Placed extends Node {
  x: number;
  y: number;
}

/** The coordinate space the static SVG is drawn in. */
export const VIEW = { width: 760, height: 420, padding: 64 } as const;

/**
 * A deterministic force-directed layout.
 *
 * Seeded and run for a fixed number of iterations, so the same graph always
 * lands in the same place. That matters more than it sounds: the static SVG is
 * generated at build time and must be byte-identical between builds, or every
 * deploy changes the markup for no reason.
 *
 * This is a plain spring-and-repulsion simulation rather than a dependency,
 * because it runs once at build time over ten nodes and importing d3-force for
 * that would be absurd. The 3D layer brings its own.
 */
export function layoutNetwork(
  nodes: readonly Node[] = NODES,
  edges: readonly Edge[] = EDGES,
): Placed[] {
  const { width, height, padding } = VIEW;

  /* A tiny deterministic generator. Seeded so the layout never moves between
     builds; the exact constants are the usual mulberry32 ones. */
  let seed = 0x9e3779b9;
  const random = (): number => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  /* Start on a circle rather than at random points: the simulation settles
     faster and, more usefully, settles somewhere sensible rather than into
     whatever knot the random start happened to create. */
  const placed: Placed[] = nodes.map((node, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;
    return {
      ...node,
      x: width / 2 + Math.cos(angle) * (width / 4) + (random() - 0.5) * 20,
      y: height / 2 + Math.sin(angle) * (height / 4) + (random() - 0.5) * 20,
    };
  });

  const index = new Map(placed.map((n) => [n.id, n]));
  const REPULSION = 9000;
  const SPRING = 0.012;
  const REST_LENGTH = 150;
  const DAMPING = 0.85;
  const ITERATIONS = 400;

  const velocity = new Map(placed.map((n) => [n.id, { x: 0, y: 0 }]));

  for (let step = 0; step < ITERATIONS; step += 1) {
    // Every node pushes every other away, so labels do not pile up.
    for (const a of placed) {
      for (const b of placed) {
        if (a.id === b.id) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const force = REPULSION / (distance * distance);
        const v = velocity.get(a.id)!;
        v.x += (dx / distance) * force;
        v.y += (dy / distance) * force;
      }
    }

    // Edges pull their endpoints toward a rest length.
    for (const edge of edges) {
      const from = index.get(edge.from);
      const to = index.get(edge.to);
      if (!from || !to) continue;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const force = (distance - REST_LENGTH) * SPRING;
      const fv = velocity.get(from.id)!;
      const tv = velocity.get(to.id)!;
      fv.x += (dx / distance) * force;
      fv.y += (dy / distance) * force;
      tv.x -= (dx / distance) * force;
      tv.y -= (dy / distance) * force;
    }

    for (const node of placed) {
      const v = velocity.get(node.id)!;
      v.x *= DAMPING;
      v.y *= DAMPING;
      node.x += v.x;
      node.y += v.y;
      // Keep everything on the canvas. Clamping rather than bouncing: a bounce
      // makes the layout depend on iteration count in a way that looks random.
      node.x = Math.min(Math.max(node.x, padding), width - padding);
      node.y = Math.min(Math.max(node.y, padding), height - padding);
    }
  }

  // Round, so the emitted path data is short and two builds produce identical
  // bytes rather than differing in the fifteenth decimal place.
  return placed.map((n) => ({ ...n, x: Math.round(n.x * 10) / 10, y: Math.round(n.y * 10) / 10 }));
}

/** The blanket as a plain sentence, for the readout and the live region. */
export function describeBlanket(id: string, edges: readonly Edge[] = EDGES): string {
  const node = NODES.find((n) => n.id === id);
  if (!node) return '';
  const blanket = markovBlanket(id, edges);
  const name = (other: string): string => NODES.find((n) => n.id === other)?.label ?? other;

  if (blanket.all.length === 0) {
    return `${node.label} has an empty Markov blanket: nothing in this network depends on it and it depends on nothing.`;
  }

  /* A node can be both a child and a co-parent — Hint requests is a child of
     Mastery and also a parent of Correctness, which is another of Mastery's
     children. Naming it twice is correct but reads as a stutter, so each
     variable is mentioned once, under the first role that applies. */
  const named = new Set<string>();
  const once = (ids: string[]): string[] => {
    const kept = ids.filter((id) => !named.has(id));
    for (const id of kept) named.add(id);
    return kept;
  };

  const parents = once(blanket.parents);
  const children = once(blanket.children);
  const coParents = once(blanket.coParents);

  const parts: string[] = [];
  if (parents.length) parts.push(`${parents.map(name).join(', ')} above it`);
  if (children.length) parts.push(`${children.map(name).join(', ')} below it`);
  if (coParents.length) {
    parts.push(`and ${coParents.map(name).join(', ')}, which share a child with it`);
  }

  return (
    `The Markov blanket of ${node.label} is ${blanket.all.length} ` +
    `${blanket.all.length === 1 ? 'variable' : 'variables'}: ${parts.join(', ')}. ` +
    `Given those, ${node.label} is independent of everything else here.`
  );
}
