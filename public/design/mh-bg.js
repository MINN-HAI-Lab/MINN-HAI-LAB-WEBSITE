/* mh-bg — dependency-free 3D background fields for MINN HAI LAB mockups.
   <mh-bg mode="metal|lattice|grid" speed="1"></mh-bg>
   Real 3D maths: a raymarched SDF (WebGL) and perspective-projected point
   geometry (canvas 2D). No library, no CDN.

   Theme (D-054): the "bayes", "lattice" and "grid" modes draw ink-coloured
   lines and text meant for the canvas's own dark theme. On light, those
   swap for a dark equivalent — see the connectedCallback theme watcher and
   the inline `this.dark ? … : …` in each draw method. The accent (red) and
   "metal" mode (the raymarched SDF; not used with a light backdrop
   anywhere on the site) are unaffected. */
(() => {
  if (customElements.get('mh-bg')) return;

  const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const FRAG = `precision highp float;
uniform vec2 u_res;uniform float u_t;uniform vec2 u_m;
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float map(vec3 p){
  p.xz*=mat2(cos(u_t*.12),-sin(u_t*.12),sin(u_t*.12),cos(u_t*.12));
  float d=length(p-vec3(sin(u_t*.5)*.45+u_m.x*.5,cos(u_t*.4)*.32+u_m.y*.4,0.))-.92;
  d=smin(d,length(p-vec3(cos(u_t*.33)*.95,sin(u_t*.47)*.72,sin(u_t*.3)*.55))-.52,.62);
  d=smin(d,length(p-vec3(sin(u_t*.61)*-.95,cos(u_t*.52)*-.62,cos(u_t*.44)*.6))-.44,.58);
  d=smin(d,length(p-vec3(cos(u_t*.27)*.2,sin(u_t*.23)*-1.05,cos(u_t*.35)*-.7))-.38,.5);
  return d;
}
vec3 nrm(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*u_res)/u_res.y;
  vec3 ro=vec3(0.,0.,3.4),rd=normalize(vec3(uv,-1.6));
  float t=0.;bool hit=false;
  for(int i=0;i<72;i++){vec3 p=ro+rd*t;float d=map(p);if(d<.0015){hit=true;break;}t+=d*.85;if(t>7.)break;}
  if(!hit){gl_FragColor=vec4(0.);return;}
  vec3 p=ro+rd*t,n=nrm(p);
  float fres=pow(1.-max(dot(n,-rd),0.),2.6);
  vec3 l1=normalize(vec3(.6,.8,.5)),l2=normalize(vec3(-.7,-.2,.4));
  float sp1=pow(max(dot(reflect(rd,n),l1),0.),44.);
  float sp2=pow(max(dot(reflect(rd,n),l2),0.),18.);
  vec3 col=vec3(.045,.058,.068);
  col+=vec3(.62,.70,.76)*max(dot(n,l1),0.)*.32;
  col+=vec3(.16,.22,.28)*max(dot(n,l2),0.)*.5;
  col+=vec3(.92,.96,1.)*sp1*.9+vec3(.35,.42,.5)*sp2*.4;
  col+=vec3(.70,.09,.25)*fres*.55;
  col=mix(col,vec3(.03,.04,.05),clamp((t-2.6)*.45,0.,.8));
  gl_FragColor=vec4(col,1.);
}`;

  class MHBG extends HTMLElement {
    connectedCallback() {
      if (this._on) return;
      this._on = true;
      this.style.display = 'block';
      this.style.position = this.style.position || 'absolute';
      this.style.inset = this.style.inset || '0';
      this.style.overflow = 'hidden';
      const c = (this.cv = document.createElement('canvas'));
      c.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(c);
      this.mode = this.getAttribute('mode') || 'lattice';
      this.speed = parseFloat(this.getAttribute('speed') || '1');
      this.m = { x: 0, y: 0, tx: 0, ty: 0 };
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._pt = (e) => {
        const r = this.getBoundingClientRect();
        this.m.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        this.m.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      };
      window.addEventListener('pointermove', this._pt, { passive: true });
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(this);
      this._io = new IntersectionObserver((es) => { this.vis = es[0].isIntersecting; }, { rootMargin: '160px' });
      this._io.observe(this);
      this.vis = true;
      /* Theme (D-054): this element lives in the same document as the page
         (unlike hands-scene.html, which needs postMessage), so it can just
         read data-theme off <html> directly and watch it for changes. The
         "bayes" and "grid" modes draw ink-coloured lines and text for the
         canvas's own dark theme; on light, those swap for a dark
         equivalent so they're still visible against a light page. */
      this.dark = document.documentElement.getAttribute('data-theme') === 'dark';
      this._themeObs = new MutationObserver(() => {
        this.dark = document.documentElement.getAttribute('data-theme') === 'dark';
      });
      this._themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      this.mode === 'metal' ? this.initGL() : this.initGeo();
      this.resize();
      this.t0 = performance.now();
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }
    disconnectedCallback() {
      this._on = false;
      window.removeEventListener('pointermove', this._pt);
      this._ro && this._ro.disconnect();
      this._io && this._io.disconnect();
      this._themeObs && this._themeObs.disconnect();
      cancelAnimationFrame(this._raf);
    }
    resize() {
      const r = this.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(devicePixelRatio || 1, this.mode === 'metal' ? 1.25 : 1.75);
      this.w = r.width; this.h = r.height;
      this.cv.width = Math.max(2, (r.width * dpr) | 0);
      this.cv.height = Math.max(2, (r.height * dpr) | 0);
      if (this.ctx) { this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
      if (this.gl) this.gl.viewport(0, 0, this.cv.width, this.cv.height);
      if (this.mode === 'lattice') this.build();
    }
    /* ---- WebGL raymarch ---- */
    initGL() {
      const gl = (this.gl = this.cv.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false }));
      if (!gl) { this.mode = 'lattice'; this.gl = null; this.initGeo(); return; }
      const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
      const pr = (this.pr = gl.createProgram());
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(pr); gl.useProgram(pr);
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this.uRes = gl.getUniformLocation(pr, 'u_res');
      this.uT = gl.getUniformLocation(pr, 'u_t');
      this.uM = gl.getUniformLocation(pr, 'u_m');
    }
    /* ---- canvas 2D geometry ---- */
    initGeo() { this.ctx = this.cv.getContext('2d'); }
    build() {
      const n = this.mode === 'lattice' ? Math.min(150, Math.max(60, ((this.w * this.h) / 9000) | 0)) : 0;
      if (this.mode === 'lattice') {
        this.pts = Array.from({ length: n }, () => {
          const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = Math.cbrt(Math.random());
          const s = Math.sqrt(1 - u * u);
          return { x: r * s * Math.cos(th) * 1.35, y: r * u * 0.92, z: r * s * Math.sin(th) * 1.35, ph: Math.random() * 6.28 };
        });
        this.edges = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          const a = this.pts[i], b = this.pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (d < 0.46) this.edges.push([i, j, d]);
        }
      }
    }
    loop() {
      this._raf = requestAnimationFrame(this.loop);
      if (!this.vis || !this.w) return;
      const t = ((performance.now() - this.t0) / 1000) * (this.reduced ? 0.15 : this.speed);
      this.m.x += (this.m.tx - this.m.x) * 0.06;
      this.m.y += (this.m.ty - this.m.y) * 0.06;
      this.mode === 'metal' ? this.drawGL(t) : this.mode === 'grid' ? this.drawGrid(t) : this.mode === 'bayes' ? this.drawBayes(t) : this.drawLattice(t);
    }
    /* Bayesian network: a knowledge-tracing DAG with the Markov blanket of `mastery` highlighted */
    buildBayes() {
      const N = (id, label, x, y, z, k) => ({ id, label, x, y, z, k: k || '' });
      this.bn = [
        N('prior', 'prior knowledge', -1.5, 0.55, 0.2), N('curr', 'curriculum', -1.5, -0.1, -0.5), N('time', 'time on task', -1.5, -0.7, 0.4),
        N('hint', 'hint used', -0.75, 0.75, -0.3), N('attempt', 'attempt n', -0.75, 0.05, 0.6, 'p'), N('lat', 'response latency', -0.75, -0.7, -0.4, 'p'),
        N('mast', 'mastery', 0, 0.1, 0, 't'),
        N('slip', 'slip rate', 0.7, 0.8, 0.4, 's'), N('guess', 'guess rate', 0.7, -0.75, -0.3, 's'),
        N('resp', 'response', 0.85, 0.05, -0.5, 'c'), N('conf', 'confidence', 1.5, 0.55, 0.3, 'c'),
        N('next', 'next item', 1.5, -0.25, -0.2), N('ret', 'retention', 1.55, -0.85, 0.5),
      ];
      const E = (a, b) => [this.bn.findIndex((n) => n.id === a), this.bn.findIndex((n) => n.id === b)];
      this.bnE = [E('prior', 'attempt'), E('prior', 'hint'), E('curr', 'attempt'), E('curr', 'lat'), E('time', 'lat'), E('hint', 'mast'), E('attempt', 'mast'), E('lat', 'mast'),
        E('mast', 'resp'), E('mast', 'conf'), E('slip', 'resp'), E('guess', 'resp'), E('resp', 'next'), E('conf', 'next'), E('mast', 'ret'), E('next', 'ret')];
      this.bnPulse = this.bnE.map((_, i) => ({ e: i, ph: Math.random() }));
    }
    drawBayes(t) {
      const g = this.ctx; if (!this.bn) this.buildBayes();
      g.clearRect(0, 0, this.w, this.h);
      const P = this.bn.map((n) => this.proj({ x: n.x * 0.78 + 0.02 * Math.sin(t * 0.7 + n.x * 3), y: n.y * 0.78 + 0.02 * Math.cos(t * 0.6 + n.y * 4), z: n.z * 0.78 }, t * 0.35));
      const dark = this.dark;
      const col = (k, a) => k === 't' ? `rgba(214,26,74,${a})` : k ? `rgba(${dark ? '226,235,239' : '28,40,48'},${a})` : `rgba(${dark ? '150,178,190' : '110,125,135'},${a * 0.75})`;
      g.lineWidth = 1;
      for (const [i, j] of this.bnE) {
        const a = P[i], b = P[j], na = this.bn[i], nb = this.bn[j];
        const inB = (na.k && nb.k) || na.k === 't' || nb.k === 't';
        const al = (inB ? 0.55 : 0.22) * (1 - (a.d + b.d) / 8);
        g.strokeStyle = `rgba(${dark ? (inB ? '200,214,220' : '140,168,180') : (inB ? '40,55,65' : '110,125,135')},${al.toFixed(3)})`;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        const ang = Math.atan2(b.y - a.y, b.x - a.x), r = 13 - nb.d * 2;
        const tx = b.x - Math.cos(ang) * r, ty = b.y - Math.sin(ang) * r;
        g.fillStyle = g.strokeStyle; g.beginPath();
        g.moveTo(tx, ty); g.lineTo(tx - Math.cos(ang - 0.42) * 7, ty - Math.sin(ang - 0.42) * 7); g.lineTo(tx - Math.cos(ang + 0.42) * 7, ty - Math.sin(ang + 0.42) * 7); g.closePath(); g.fill();
      }
      for (const p of this.bnPulse) {
        const [i, j] = this.bnE[p.e]; const a = P[i], b = P[j];
        const u = (t * 0.22 + p.ph) % 1;
        const x = a.x + (b.x - a.x) * u, y = a.y + (b.y - a.y) * u;
        g.fillStyle = `rgba(214,26,74,${(0.85 * Math.sin(u * Math.PI)).toFixed(3)})`;
        g.beginPath(); g.arc(x, y, 1.8, 0, 6.29); g.fill();
      }
      g.font = '500 11px "Space Grotesk", system-ui, sans-serif'; g.textBaseline = 'middle';
      this.bn.forEach((n, i) => {
        const p = P[i], r = (n.k === 't' ? 9 : n.k ? 6 : 4.5) * (1 - p.d * 0.12);
        if (n.k === 't') { g.fillStyle = 'rgba(214,26,74,.18)'; g.beginPath(); g.arc(p.x, p.y, r * 2.6 + Math.sin(t * 2) * 2, 0, 6.29); g.fill(); }
        g.fillStyle = n.k ? col(n.k, 0.95) : `rgba(${dark ? '7,9,12' : '239,241,242'},1)`;
        g.beginPath(); g.arc(p.x, p.y, r, 0, 6.29); g.fill();
        if (!n.k) { g.strokeStyle = `rgba(${dark ? '180,200,210' : '70,85,95'},.7)`; g.lineWidth = 1.2; g.stroke(); }
        g.fillStyle = n.k === 't' ? `rgba(${dark ? '240,244,246' : '8,12,15'},.95)` : `rgba(${dark ? '226,235,239' : '28,40,48'},${n.k ? 0.78 : 0.5})`;
        g.textAlign = p.x > this.w / 2 ? 'left' : 'right';
        g.fillText(n.label, p.x + (p.x > this.w / 2 ? r + 8 : -r - 8), p.y);
      });
    }
    drawGL(t) {
      const gl = this.gl;
      gl.uniform2f(this.uRes, this.cv.width, this.cv.height);
      gl.uniform1f(this.uT, t);
      gl.uniform2f(this.uM, this.m.x, -this.m.y);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    proj(p, t) {
      const ry = t * 0.1 + this.m.x * 0.5, rx = -this.m.y * 0.32;
      let x = p.x * Math.cos(ry) - p.z * Math.sin(ry);
      let z = p.x * Math.sin(ry) + p.z * Math.cos(ry);
      let y = p.y * Math.cos(rx) - z * Math.sin(rx);
      z = p.y * Math.sin(rx) + z * Math.cos(rx);
      const f = 2.6 / (3.1 + z), s = Math.min(this.w, this.h * 1.6) * 0.42;
      return { x: this.w / 2 + x * f * s, y: this.h / 2 + y * f * s, d: z };
    }
    drawLattice(t) {
      const g = this.ctx; if (!this.pts) return;
      g.clearRect(0, 0, this.w, this.h);
      const P = this.pts.map((p) => {
        const b = 0.03 * Math.sin(t * 0.8 + p.ph);
        return this.proj({ x: p.x + b, y: p.y + b * 0.6, z: p.z - b }, t);
      });
      g.lineWidth = 1;
      for (const [i, j, d] of this.edges) {
        const a = P[i], b = P[j];
        const a0 = (1 - d / 0.46) * 0.5 * (1 - (a.d + b.d) / 6);
        if (a0 <= 0.01) continue;
        g.strokeStyle = `rgba(${this.dark ? '150,178,190' : '110,125,135'},${a0.toFixed(3)})`;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      }
      const mx = this.w / 2 + this.m.tx * this.w / 2, my = this.h / 2 + this.m.ty * this.h / 2;
      for (const p of P) {
        const near = Math.hypot(p.x - mx, p.y - my) < 110;
        const r = (1.5 - p.d * 0.35) * (near ? 2.2 : 1);
        g.fillStyle = near ? 'rgba(214,26,74,.95)' : `rgba(${this.dark ? '226,235,239' : '28,40,48'},${(0.55 - p.d * 0.14).toFixed(3)})`;
        g.beginPath(); g.arc(p.x, p.y, Math.max(0.6, r), 0, 6.29); g.fill();
      }
    }
    drawGrid(t) {
      const g = this.ctx;
      g.clearRect(0, 0, this.w, this.h);
      const N = 46, M = 30, mx = this.m.tx, my = this.m.ty;
      const pt = (i, j) => {
        const x = (i / N) * 2 - 1, z = (j / M) * 2.4 - 0.35;
        const dx = x - mx * 1.1, dz = z - (my * 0.5 + 0.8);
        const dd = Math.sqrt(dx * dx + dz * dz);
        const y = Math.sin(dd * 7 - t * 2.2) * 0.085 / (1 + dd * 3.2) + Math.sin(x * 3 + t * 0.5) * 0.02;
        const f = 1.9 / (1.25 + z * 1.5);
        return { x: this.w / 2 + x * f * this.w * 0.55, y: this.h * 0.62 - (y + 0.1) * f * this.h * 0.9, f };
      };
      for (let j = 0; j <= M; j++) {
        g.beginPath();
        for (let i = 0; i <= N; i++) { const p = pt(i, j); i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y); }
        g.strokeStyle = `rgba(${this.dark ? '158,186,198' : '70,85,95'},${(0.32 * (1 - j / M) + 0.03).toFixed(3)})`;
        g.lineWidth = 1; g.stroke();
      }
      for (let i = 0; i <= N; i += 1) {
        g.beginPath();
        for (let j = 0; j <= M; j++) { const p = pt(i, j); j ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y); }
        g.strokeStyle = `rgba(${this.dark ? '120,148,162' : '110,125,135'},${(0.12 + 0.1 * Math.abs(Math.sin(i * 0.4 + t * 0.3))).toFixed(3)})`;
        g.stroke();
      }
      const c = pt(((mx + 1) / 2) * N, ((my * 0.5 + 0.8 + 0.35) / 2.4) * M);
      g.fillStyle = 'rgba(214,26,74,.9)';
      g.beginPath(); g.arc(c.x, c.y, 3.2, 0, 6.29); g.fill();
    }
  }
  customElements.define('mh-bg', MHBG);
})();
