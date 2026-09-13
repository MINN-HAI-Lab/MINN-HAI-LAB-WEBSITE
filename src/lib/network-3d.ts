/**
 * Artefact 2, second layer — the network in three dimensions.
 *
 * THIS MODULE IS NEVER IN THE INITIAL PAYLOAD. It is reached by a dynamic
 * import from a click handler, which is what makes Vite give it its own chunk.
 * Three.js and the force-graph library together are around half a megabyte,
 * and they have no business in a first paint on a phone. Nothing in the rest
 * of the site may import this file statically.
 *
 * The 2D SVG is not a fallback for this. It is the artefact; this is a second
 * view of the same graph, opened on request, and every function below is
 * handed the same NODES and EDGES the static diagram was placed from — so the
 * two cannot disagree about what the network is.
 *
 * Labels are HTML positioned over the canvas rather than sprites in the scene.
 * That is the same decision the 2D view made and for the same reason: text
 * inside a projection scales with it, and it keeps the 3D layer from needing
 * three-spritetext or a texture atlas to say "Prior knowledge".
 */
import ForceGraph3D, { type ForceGraph3DInstance } from '3d-force-graph';
import { EDGES, NODES, markovBlanket } from './network.ts';

/** The colours the scene draws with, read from the page's own tokens. */
export interface Palette {
  text: string;
  muted: string;
  signal: string;
  field: string;
  grid: string;
}

export interface Mounted {
  /** Highlight a node's Markov blanket. */
  select(id: string): void;
  /** Tear the scene down and release the WebGL context. */
  destroy(): void;
}

interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  z?: number;
}

export interface MountOptions {
  /** The node selected when the view opens. */
  initial: string;
  /** Called when a node is clicked in the scene. */
  onSelect: (id: string) => void;
  /** No auto-rotation, no particles, no camera transitions. */
  reducedMotion: boolean;
  palette: Palette;
}

export function mount(
  canvasHost: HTMLElement,
  labelHost: HTMLElement,
  options: MountOptions,
): Mounted {
  const { palette, reducedMotion } = options;

  /* Cloned, because the library writes simulation state onto whatever objects
     it is handed and NODES is the shared source of truth for both views. */
  const nodes: GraphNode[] = NODES.map((node) => ({ id: node.id, label: node.label }));
  const links = EDGES.map((edge) => ({ source: edge.from, target: edge.to }));

  let selected = options.initial;
  let blanket = new Set(markovBlanket(selected).all);

  const nodeColour = (node: GraphNode): string =>
    node.id === selected ? palette.text : blanket.has(node.id) ? palette.signal : palette.muted;

  const linkInBlanket = (link: { source: unknown; target: unknown }): boolean => {
    const from = typeof link.source === 'object' ? (link.source as GraphNode).id : String(link.source);
    const to = typeof link.target === 'object' ? (link.target as GraphNode).id : String(link.target);
    const sets = markovBlanket(selected);
    return (
      from === selected ||
      to === selected ||
      (sets.coParents.includes(from) && sets.children.includes(to))
    );
  };

  const graph: ForceGraph3DInstance = new ForceGraph3D(canvasHost, { controlType: 'trackball' });

  graph
    .graphData({ nodes, links })
    // Transparent, so the scene sits on the glass panel rather than punching a
    // solid rectangle through it.
    .backgroundColor('rgba(0,0,0,0)')
    .showNavInfo(false)
    .nodeRelSize(6)
    .nodeOpacity(1)
    .nodeResolution(16)
    .nodeColor(nodeColour as (node: object) => string)
    // The tooltip is a second route to the same label the HTML layer shows,
    // and the only one that works while a node is behind another.
    .nodeLabel(((node: GraphNode) => node.label) as (node: object) => string)
    .linkColor(((link: { source: unknown; target: unknown }) =>
      linkInBlanket(link) ? palette.signal : palette.grid) as (link: object) => string)
    .linkOpacity(0.55)
    .linkWidth(((link: { source: unknown; target: unknown }) =>
      linkInBlanket(link) ? 1.2 : 0.4) as (link: object) => number)
    .linkDirectionalArrowLength(3.5)
    .linkDirectionalArrowRelPos(1)
    .linkDirectionalArrowColor(((link: { source: unknown; target: unknown }) =>
      linkInBlanket(link) ? palette.signal : palette.muted) as (link: object) => string)
    .onNodeClick(((node: GraphNode) => options.onSelect(node.id)) as (node: object) => void);

  /* Spread the layout out.

   The defaults pack ten nodes into about a hundred units, which projected to
   a clump roughly a hundred pixels across in the middle of a 1100px panel,
   with every label on top of every other. A longer link and a stronger
   repulsion give the graph a size worth looking at. */
  const linkForce = graph.d3Force('link') as { distance?: (d: number) => unknown } | undefined;
  linkForce?.distance?.(70);
  const chargeForce = graph.d3Force('charge') as { strength?: (s: number) => unknown } | undefined;
  chargeForce?.strength?.(-220);

  if (!reducedMotion) {
    /* Particles travel parent to child, so the direction of a dependency is
       readable while the graph turns — in three dimensions an arrowhead is
       often pointing away from you. Only on blanket links: ten edges of
       moving dots is a screensaver. */
    graph
      .linkDirectionalParticles(((link: { source: unknown; target: unknown }) =>
        linkInBlanket(link) ? 2 : 0) as (link: object) => number)
      .linkDirectionalParticleWidth(1.6)
      .linkDirectionalParticleSpeed(0.006)
      .linkDirectionalParticleColor((() => palette.signal) as (link: object) => string);
  }

  /* -- Rotation ------------------------------------------------------------
     Turned by hand rather than by the controls' own autoRotate.

     OrbitControls has autoRotate and trackball does not, so the first version
     used orbit — and orbit threw "Cannot read properties of undefined" out of
     its own pointer bookkeeping on every click on a node. Trackball is the
     library's default and does not, so the controls stay trackball and the
     rotation is eleven lines here.

     It also buys the better behaviour: the spin stops the moment someone
     touches the scene, rather than sliding a node out from under their cursor
     while they try to aim at it. */
  let spinning = false;
  let angle = 0;

  function stopSpinning(): void {
    spinning = false;
  }

  if (!reducedMotion) {
    canvasHost.addEventListener('pointerdown', stopSpinning);
    canvasHost.addEventListener('wheel', stopSpinning, { passive: true });
  }

  // -- Labels ---------------------------------------------------------------

  const labels = new Map<string, HTMLElement>();
  for (const node of nodes) {
    const span = document.createElement('span');
    span.className = 'network3d__label';
    span.textContent = node.label;
    span.dataset.label3d = node.id;
    labelHost.append(span);
    labels.set(node.id, span);
  }

  let frame = 0;
  let running = true;

  function positionLabels(): void {
    if (!running) return;

    if (spinning) {
      /* One slow turn about the vertical axis. Roughly five degrees a second:
         enough that the graph reads as a solid arrangement in depth within a
         couple of seconds, slow enough to follow an edge while it moves. */
      const camera = graph.camera();
      const radius = Math.hypot(camera.position.x, camera.position.z);
      angle += 0.0015;
      graph.cameraPosition({
        x: Math.sin(angle) * radius,
        z: Math.cos(angle) * radius,
      });
    }

    const box = canvasHost.getBoundingClientRect();

    for (const node of nodes) {
      const span = labels.get(node.id);
      if (!span) continue;
      if (node.x === undefined || node.y === undefined || node.z === undefined) continue;

      const screen = graph.graph2ScreenCoords(node.x, node.y, node.z);
      // Behind the camera, or off the panel: hidden rather than drawn at a
      // nonsense position on the edge of the frame.
      const visible =
        Number.isFinite(screen.x) &&
        Number.isFinite(screen.y) &&
        screen.x >= 0 &&
        screen.y >= 0 &&
        screen.x <= box.width &&
        screen.y <= box.height;

      span.hidden = !visible;
      if (!visible) continue;

      span.style.transform = `translate(${screen.x.toFixed(1)}px, ${screen.y.toFixed(1)}px)`;
      span.classList.toggle('is-selected', node.id === selected);
      span.classList.toggle('is-blanket', blanket.has(node.id));

      /* Ten labels over a projection of ten nodes will overlap whatever the
         layout does, so the ones that matter stay solid and the rest recede.
         That is the same statement the colours make — given the blanket, the
         rest is irrelevant — applied to the type. */
      const important = node.id === selected || blanket.has(node.id);
      span.style.opacity = important ? '1' : '0.5';
    }

    frame = requestAnimationFrame(positionLabels);
  }

  frame = requestAnimationFrame(positionLabels);

  // -- Sizing ---------------------------------------------------------------

  function resize(): void {
    const box = canvasHost.getBoundingClientRect();
    if (box.width > 0 && box.height > 0) graph.width(box.width).height(box.height);
  }

  resize();
  /* Measured again on the next frame. The first call runs in the same task as
     the unhide, and a browser that has not finished laying the panel out hands
     back a zero — at which point the library keeps its default, which is the
     width of the window rather than of the column. */
  requestAnimationFrame(resize);

  const observer =
    typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  observer?.observe(canvasHost);
  if (!observer) window.addEventListener('resize', resize);

  /* Frame it by measuring, not by guessing a camera distance.

     A fixed z put the camera 420 units from a graph about 150 units across,
     and the result was a small knot in the middle of a large empty panel.
     zoomToFit asks the scene how big it actually ended up and moves the camera
     to match, which also survives the layout coming out differently. */
  graph.cameraPosition({ z: 260 }, undefined, 0);
  graph.onEngineStop(() => graph.zoomToFit(reducedMotion ? 0 : 700, 28));

  /* The simulation can run long on a slow machine, and a reader should not be
     looking at a knot while it does. This fits once early and then lets
     onEngineStop fit again when it settles. */
  window.setTimeout(() => graph.zoomToFit(reducedMotion ? 0 : 500, 28), 1200);

  /* The spin waits for the framing to finish. Both move the camera, and two
     things moving one camera is a fight, not an animation. */
  if (!reducedMotion) {
    window.setTimeout(() => {
      const camera = graph.camera();
      angle = Math.atan2(camera.position.x, camera.position.z);
      spinning = true;
    }, 2200);
  }

  return {
    select(id: string): void {
      selected = id;
      blanket = new Set(markovBlanket(id).all);
      // Re-running the accessors is what repaints; the values themselves have
      // not changed, only what they close over.
      graph
        .nodeColor(nodeColour as (node: object) => string)
        .linkColor(((link: { source: unknown; target: unknown }) =>
          linkInBlanket(link) ? palette.signal : palette.grid) as (link: object) => string)
        .linkWidth(((link: { source: unknown; target: unknown }) =>
          linkInBlanket(link) ? 1.2 : 0.4) as (link: object) => number);
      if (!reducedMotion) {
        graph.linkDirectionalParticles(((link: { source: unknown; target: unknown }) =>
          linkInBlanket(link) ? 2 : 0) as (link: object) => number);
      }
    },

    destroy(): void {
      running = false;
      spinning = false;
      canvasHost.removeEventListener('pointerdown', stopSpinning);
      canvasHost.removeEventListener('wheel', stopSpinning);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      if (!observer) window.removeEventListener('resize', resize);
      for (const span of labels.values()) span.remove();
      labels.clear();
      /* _destructor releases the WebGL context. Without it, opening and
         closing this view a few times exhausts the browser's context limit and
         the oldest canvases go black — silently, with no error. */
      graph._destructor();
      canvasHost.replaceChildren();
    },
  };
}
