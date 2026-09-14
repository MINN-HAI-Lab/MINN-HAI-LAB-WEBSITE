/**
 * The reach — a human hand and a robot hand, modelled and lit in Three.js.
 *
 * Direction 2a from the design canvas, ported from its hands-scene.html.
 * Bring the cursor toward the centre and both hands reach in, index fingers
 * extending until the tips almost meet. After Michelangelo, The Creation of
 * Adam. Everything in the frame is live 3D.
 *
 * THIS MODULE IS NEVER IN THE FIRST PAINT. It is reached by a dynamic import
 * after the page has loaded, so Three.js — several hundred kilobytes — arrives
 * behind the poster rather than in front of the text. See Hero.astro and Q-25.
 */
import * as THREE from 'three';

export interface Hands {
  destroy(): void;
}

export interface HandsOptions {
  /** No pointer to reach toward: breathe between apart and nearly touching. */
  autoReach: boolean;
}

export function mountHands(host: HTMLElement, canvasEl: HTMLCanvasElement, options: HandsOptions): Hands {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  // 1.25, not 1.5: the hero is the largest thing on the page and the scene
  // has physical materials on it; a quarter less pixel density is invisible
  // at arm's length and a third less fill work every frame.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  camera.position.set(0, 0, 7.6);

  /* Environment: a few emissive panels, prefiltered, so the metals have
     something to reflect. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x07090c);
  const panel = (w: number, h: number, color: number, k: number, pos: THREE.Vector3): void => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }),
    );
    m.position.copy(pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel(7, 3, 0xfff0dc, 7, new THREE.Vector3(2.5, 5, 3));
  panel(4, 7, 0xd6e2ff, 1.6, new THREE.Vector3(-6, 0.5, 1));
  panel(3, 3, 0xff5c80, 0.7, new THREE.Vector3(5, -3.5, -1));
  panel(10, 10, 0x171c22, 1, new THREE.Vector3(0, 0, -9));
  scene.environment = pmrem.fromScene(env, 0.05).texture;
  env.traverse((o: THREE.Object3D) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
  });

  const key = new THREE.DirectionalLight(0xffe3c6, 2.4);
  key.position.set(3, 4, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8fb0ff, 0.45);
  fill.position.set(-4, -1, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xff3b6b, 0.9);
  rim.position.set(0.5, -2, -4);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0x1a2028, 0.6));

  /* Materials. */
  const skin = new THREE.MeshPhysicalMaterial({
    color: 0xb98264,
    roughness: 0.55,
    metalness: 0,
    sheen: 0.4,
    sheenColor: new THREE.Color(0xffb890),
    sheenRoughness: 0.7,
  });
  const nail = new THREE.MeshPhysicalMaterial({ color: 0xe6bfae, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.2 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x262b32, roughness: 0.42, metalness: 0.75 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x8e979f, roughness: 0.3, metalness: 1 });
  const glow = new THREE.MeshStandardMaterial({ color: 0xe63360, emissive: 0xe63360, emissiveIntensity: 1.8, roughness: 0.4, metalness: 0 });
  const cable = new THREE.MeshStandardMaterial({ color: 0x12151a, roughness: 0.75, metalness: 0.2 });
  const wire = new THREE.LineBasicMaterial({ color: 0x9fb3bf, transparent: true, opacity: 0.32 });
  const wireDim = new THREE.LineBasicMaterial({ color: 0x9fb3bf, transparent: true, opacity: 0.14 });

  interface FingerData {
    joints: THREE.Group[];
    tip: THREE.Group;
    setCurl(c: number): void;
  }

  /* A finger: three hierarchical phalanges, curl set per frame. */
  function finger(len: number, r: number, human: boolean): THREE.Group {
    const root = new THREE.Group();
    const segs = [0.44, 0.32, 0.26].map((k) => k * len);
    const joints: THREE.Group[] = [];
    let parent: THREE.Group = root;
    segs.forEach((L, i) => {
      const j = new THREE.Group();
      parent.add(j);
      joints.push(j);
      const rr = r * [1, 0.9, 0.8][i]!;
      if (human) {
        const m = new THREE.Mesh(new THREE.CapsuleGeometry(rr, Math.max(0.01, L - rr * 0.6), 6, 20), skin);
        m.position.y = L / 2;
        j.add(m);
        const k = new THREE.Mesh(new THREE.SphereGeometry(rr * 1.03, 20, 14), skin);
        j.add(k);
        if (i === 2) {
          const n = new THREE.Mesh(new THREE.SphereGeometry(rr * 0.62, 16, 10), nail);
          n.scale.set(1, 1.55, 0.45);
          n.position.set(0, L - rr * 0.95, rr * 0.66);
          j.add(n);
        }
      } else {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(rr * 0.92, rr * 0.82, Math.max(0.01, L - rr * 0.9), 8), graphite);
        c.position.y = L / 2;
        j.add(c);
        const plate = new THREE.Mesh(new THREE.BoxGeometry(rr * 1.25, Math.max(0.01, L - rr * 1.2), rr * 0.32), steel);
        plate.position.set(0, L / 2, rr * 0.82);
        j.add(plate);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(rr * 0.9, rr * 0.12, 8, 20), glow);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = rr * 0.35;
        j.add(ring);
        const jb = new THREE.Mesh(new THREE.SphereGeometry(rr * 0.86, 14, 10), steel);
        j.add(jb);
        if (i === 2) {
          const tip = new THREE.Mesh(new THREE.SphereGeometry(rr * 0.78, 14, 10), steel);
          tip.position.y = L - rr * 0.35;
          j.add(tip);
        }
      }
      const next = new THREE.Group();
      next.position.y = L;
      j.add(next);
      parent = next;
    });
    const data: FingerData = {
      joints,
      tip: parent,
      setCurl: (c) => joints.forEach((j, i) => { j.rotation.x = -c * [0.9, 1.1, 0.7][i]!; }),
    };
    root.userData = data;
    return root;
  }

  interface HandData {
    fingers: THREE.Group[];
    thumb: THREE.Group;
  }

  /* A hand in local space: fingers +y, back of hand +z, thumb -x, forearm
     running down -y. */
  function hand(human: boolean): THREE.Group {
    const g = new THREE.Group();
    if (human) {
      const add = (sx: number, sy: number, sz: number, x: number, y: number, z: number): void => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), skin);
        m.scale.set(sx, sy, sz);
        m.position.set(x, y, z);
        g.add(m);
      };
      add(0.42, 0.52, 0.135, 0, 0.04, 0);
      add(0.3, 0.36, 0.145, 0, 0.14, 0.01);
      add(0.2, 0.26, 0.135, -0.25, -0.14, -0.02);
      add(0.17, 0.21, 0.12, 0.24, -0.2, -0.02);
      [-0.3, -0.1, 0.1, 0.29].forEach((x, i) => add(0.085, 0.085, 0.075, x, [0.45, 0.5, 0.48, 0.4][i]! - 0.02, 0.055));
      const wrist = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.36, 6, 24), skin);
      wrist.position.y = -0.56;
      wrist.scale.set(1.05, 1, 0.72);
      g.add(wrist);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.29, 2.8, 28), skin);
      arm.position.y = -2.0;
      arm.scale.set(1, 1, 0.8);
      g.add(arm);
    } else {
      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.86, 0.2), graphite);
      palm.position.y = 0.05;
      g.add(palm);
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.06), steel);
      plate.position.set(0, 0.1, 0.12);
      g.add(plate);
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.025, 0.02), glow);
      slot.position.set(0, -0.2, 0.16);
      g.add(slot);
      const wr = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 10, 32), steel);
      wr.rotation.x = Math.PI / 2;
      wr.position.y = -0.42;
      g.add(wr);
      const wg = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.012, 8, 40), glow);
      wg.rotation.x = Math.PI / 2;
      wg.position.y = -0.52;
      g.add(wg);
      const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.4, 16), graphite);
      wrist.position.y = -0.6;
      g.add(wrist);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.31, 2.8, 10), graphite);
      arm.position.y = -2.1;
      g.add(arm);
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.275, 0.33, 1.7, 10, 1, true, 0.2, Math.PI * 1.05), steel);
      shell.position.y = -2.15;
      g.add(shell);
      [-1.05, -1.7, -2.5].forEach((y, i) => {
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.29 + i * 0.02, 0.02, 8, 32), steel);
        r.rotation.x = Math.PI / 2;
        r.position.y = y;
        g.add(r);
      });
      for (let k = 0; k < 3; k += 1) {
        const pts: THREE.Vector3[] = [];
        for (let s = 0; s <= 8; s += 1) {
          const t = s / 8;
          pts.push(new THREE.Vector3(-0.2 + k * 0.2 + Math.sin(k * 2.1 + t * 3) * 0.05, -0.8 - t * 2.2, -0.24 - Math.abs(Math.sin(t * Math.PI)) * 0.09));
        }
        g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.022, 8), cable));
      }
    }
    const fdef = [
      { x: -0.3, y: 0.45, len: 1.0, r: 0.085, sp: -0.17 },
      { x: -0.1, y: 0.5, len: 1.1, r: 0.088, sp: -0.05 },
      { x: 0.1, y: 0.48, len: 1.02, r: 0.082, sp: 0.06 },
      { x: 0.29, y: 0.4, len: 0.82, r: 0.072, sp: 0.19 },
    ];
    const fingers = fdef.map((d) => {
      const f = finger(d.len, d.r, human);
      f.position.set(d.x, d.y, 0);
      f.rotation.z = -d.sp;
      g.add(f);
      return f;
    });
    const thumb = finger(0.75, 0.095, human);
    thumb.position.set(-0.36, -0.05, -0.04);
    thumb.rotation.set(-0.5, 0, 1.15);
    g.add(thumb);
    const data: HandData = { fingers, thumb };
    g.userData = data;
    return g;
  }

  interface Rig {
    outer: THREE.Group;
    inner: THREE.Group;
    h: THREE.Group;
  }

  /* Rig: outer aims the hand, inner tilts the back of the hand toward the
     viewer. */
  function rig(human: boolean, tiltY: number): Rig {
    const outer = new THREE.Group();
    const inner = new THREE.Group();
    const h = hand(human);
    h.scale.setScalar(0.8);
    inner.rotation.y = tiltY;
    inner.add(h);
    outer.add(inner);
    scene.add(outer);
    return { outer, inner, h };
  }
  const humanRig = rig(true, -0.78);
  const robotRig = rig(false, 0.78);

  interface Pose {
    x: number;
    y: number;
    rz: number;
    curl: number[];
    th: number;
  }
  const P: Record<'human' | 'robot', { rest: Pose; reach: Pose }> = {
    human: {
      rest: { x: -2.75, y: 1.05, rz: -1.97, curl: [0.38, 0.72, 0.98, 1.12], th: 0.35 },
      reach: { x: -1.46, y: 0.4, rz: -1.8, curl: [0.02, 0.55, 0.88, 1.02], th: 0.3 },
    },
    robot: {
      rest: { x: 2.75, y: -0.9, rz: 1.21, curl: [0.42, 0.82, 1.02, 1.12], th: 0.4 },
      reach: { x: 1.42, y: -0.32, rz: 1.06, curl: [0.0, 0.62, 0.92, 1.05], th: 0.35 },
    },
  };

  /* The cybernetic field behind the gap. */
  const cyber = new THREE.Group();
  cyber.position.set(0.05, 0.05, -1.3);
  scene.add(cyber);
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.011, 8, 160), steel);
  ring1.rotation.x = 1.15;
  cyber.add(ring1);
  const ticks = new THREE.Group();
  for (let i = 0; i < 96; i += 1) {
    const a = (i / 96) * Math.PI * 2;
    const big = i % 8 === 0;
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.012, big ? 0.16 : 0.07, 0.012), big ? steel : graphite);
    t.position.set(Math.cos(a) * 2.15, Math.sin(a) * 2.15, 0);
    t.rotation.z = a;
    ticks.add(t);
  }
  ticks.rotation.x = -0.95;
  cyber.add(ticks);
  const arc = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.018, 8, 64, Math.PI * 0.32), glow);
  arc.rotation.x = 1.15;
  cyber.add(arc);
  const arc2 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.012, 8, 48, Math.PI * 0.18), glow);
  arc2.rotation.x = -0.95;
  cyber.add(arc2);
  const ico = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.95, 1)), wire);
  cyber.add(ico);
  const ico2 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.45, 0)), wireDim);
  cyber.add(ico2);
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), steel);
  cyber.add(core);

  /* Seeded, so the field is the same on every visit. */
  let seed = 20260914;
  const random = (): number => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  interface NodeData {
    a: number;
    rr: number;
    z: number;
    ph: number;
    sp: number;
  }
  const nodes: THREE.Mesh[] = [];
  for (let i = 0; i < 10; i += 1) {
    const n = new THREE.Mesh(new THREE.OctahedronGeometry(0.045 + random() * 0.03, 0), i % 3 === 0 ? glow : steel);
    const data: NodeData = { a: random() * Math.PI * 2, rr: 1.4 + random() * 1.4, z: -0.6 + random() * 1.2, ph: random() * 6.28, sp: 0.05 + random() * 0.08 };
    n.userData = data;
    cyber.add(n);
    nodes.push(n);
  }

  /* Pointer. Measured against the hero, not the window, so the reach is
     toward the centre of the scene wherever the scene sits. */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, reach: 0, treach: 0 };
  const setPtr = (nx: number, ny: number): void => {
    ptr.tx = nx;
    ptr.ty = ny;
    const d = Math.hypot(nx, ny * 0.75);
    ptr.treach = 1 - THREE.MathUtils.smoothstep(d, 0.1, 0.62);
  };
  let touched = false;
  const onMove = (e: PointerEvent): void => {
    if (e.pointerType === 'touch') touched = true;
    const r = host.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (nx < -1.1 || nx > 1.1 || ny < -1.1 || ny > 1.1) ptr.treach = 0;
    else setPtr(nx, ny);
  };
  const onLeave = (): void => {
    ptr.treach = 0;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);

  function resize(): void {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp = THREE.MathUtils.lerp;
  const clock = new THREE.Clock();

  function applyPose(r: Rig, pose: { rest: Pose; reach: Pose }, t: number, side: number): void {
    const a = pose.rest;
    const b = pose.reach;
    r.outer.position.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t) + Math.sin(clock.elapsedTime * 0.6 + side) * 0.02, 0);
    r.outer.rotation.z = lerp(a.rz, b.rz, t);
    const data = r.h.userData as HandData;
    data.fingers.forEach((f, i) => (f.userData as FingerData).setCurl(lerp(a.curl[i]!, b.curl[i]!, t) + Math.sin(clock.elapsedTime * 0.9 + i + side) * 0.02));
    (data.thumb.userData as FingerData).setCurl(lerp(a.th, b.th, t));
  }

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
  });
  io.observe(host);
  const onVisibility = (): void => {
    visible = document.visibilityState === 'visible' && visible;
  };
  document.addEventListener('visibilitychange', onVisibility);

  let raf = 0;
  function tick(): void {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05) || 0.016;
    const el = clock.elapsedTime;
    const k = 1 - Math.pow(0.001, dt);
    ptr.x += (ptr.tx - ptr.x) * k * 0.7;
    ptr.y += (ptr.ty - ptr.y) * k * 0.7;
    ptr.reach += (ptr.treach - ptr.reach) * k * 0.55;
    /* On a phone there is no cursor to bring to the centre, so the reach
       breathes on its own: apart, nearly touching, apart, over about nine
       seconds. A touch anywhere on the scene still takes over. */
    if (options.autoReach && ptr.treach === 0 && !touched) {
      const breath = 0.32 + 0.4 * (0.5 + 0.5 * Math.sin(el * 0.7));
      ptr.reach += (breath - ptr.reach) * k * 0.55;
    }
    const t = reduced ? 0.6 : ptr.reach;
    applyPose(humanRig, P.human, t, 0);
    applyPose(robotRig, P.robot, t, 2);
    humanRig.inner.rotation.y = -0.78 - ptr.y * 0.08;
    robotRig.inner.rotation.y = 0.78 + ptr.y * 0.08;
    camera.position.x = ptr.x * 0.18;
    camera.position.y = -ptr.y * 0.12;
    camera.lookAt(0, 0, 0);
    const s = reduced ? 0 : 1;
    cyber.rotation.y = ptr.x * 0.14;
    cyber.rotation.x = ptr.y * 0.09;
    ring1.rotation.z = el * 0.05 * s;
    ticks.rotation.z = -el * 0.03 * s;
    arc.rotation.z = el * 0.22 * s;
    arc2.rotation.z = -el * 0.15 * s + 2;
    ico.rotation.y = el * 0.12 * s;
    ico.rotation.x = el * 0.07 * s;
    ico2.rotation.y = -el * 0.05 * s;
    core.rotation.y = el * 0.5 * s;
    core.rotation.z = el * 0.3 * s;
    core.scale.setScalar(1 + ptr.reach * 0.4);
    glow.emissiveIntensity = 1.4 + ptr.reach * 1.6 + Math.sin(el * 2.2) * 0.2;
    nodes.forEach((n) => {
      const u = n.userData as NodeData;
      const a = u.a + el * u.sp * s;
      n.position.set(Math.cos(a) * u.rr, Math.sin(a) * u.rr * 0.7 + Math.sin(el * 0.7 + u.ph) * 0.08, u.z);
      n.rotation.y = el * 0.6 + u.ph;
    });
    renderer.render(scene, camera);
  }
  tick();

  return {
    destroy(): void {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
