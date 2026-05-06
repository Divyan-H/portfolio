'use strict';

// ── DOM ──────────────────────────────────────
const loader = document.getElementById('loader');
const ldBar = document.getElementById('ldBar');
const ldText = document.getElementById('ldText');
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas.getContext('2d');
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
const seqFill = document.getElementById('seq-fill');
const hudTime = document.getElementById('hudTime');
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');

// ── CURSOR ───────────────────────────────────
(function initCursor() {
  const cur = Object.assign(document.createElement('div'), { id: 'cur' });
  const ring = Object.assign(document.createElement('div'), { id: 'cur-ring' });
  document.body.append(cur, ring);
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    setTimeout(() => { ring.style.left = mx + 'px'; ring.style.top = my + 'px'; }, 65);
  });
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => cur.style.transform = 'translate(-50%,-50%) scale(2.2)');
    el.addEventListener('mouseleave', () => cur.style.transform = 'translate(-50%,-50%) scale(1)');
  });
})();

// ── CANVAS RESIZE ────────────────────────────
// ── CONFIG ──────────────────────────────────
const CFG = {
  frameCount: 176,
  framePath: n => `frames/ezgif-frame-${String(n).padStart(3,'0')}.jpg`,
  scrollMult: 5,
  ease: 0.09,
  batchSize: 12,
};

// ── STATE ────────────────────────────────────
const S = {
  frames: [], ready: false,
  rawProg: 0, smoothProg: 0, curFrame: 0,
};

function resizeCanvases() {
  const W = window.innerWidth, H = window.innerHeight;
  heroCanvas.width = W; heroCanvas.height = H;
  heroCanvas.style.width = W + 'px'; heroCanvas.style.height = H + 'px';
  if (bgCanvas) {
    bgCanvas.width = W; bgCanvas.height = H;
  }
  pCanvas.width = W; pCanvas.height = H;
  initBgNodes();
  if(S.ready) drawFrame(S.curFrame);
}
window.addEventListener('resize', () => { resizeCanvases(); setScrollHeight(); readScroll(); });

// ══════════════════════════════════════════════
//  GLOBAL 3D BACKGROUND
// ══════════════════════════════════════════════
const bgNodes = [];
const bgPulses = [];

function initBgNodes() {
  if (!bgCanvas) return;
  bgNodes.length = 0;
  const W = window.innerWidth, H = window.innerHeight;
  const count = Math.min(60, Math.floor((W * H) / 12000));
  for (let i = 0; i < count; i++) {
    bgNodes.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.2 + 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.001 + Math.random() * 0.001,
      col: Math.random() > 0.5 ? 0 : 1
    });
  }
}

function drawBg(timestamp) {
  if (!bgCtx) return;
  const W = window.innerWidth, H = window.innerHeight;
  bgCtx.clearRect(0, 0, W, H);
  const t = timestamp;

  bgNodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < -60) n.x = W + 60;
    if (n.x > W + 60) n.x = -60;
    if (n.y < -60) n.y = H + 60;
    if (n.y > H + 60) n.y = -60;
  });

  const maxDist = Math.min(W, H) * 0.2;
  bgCtx.lineWidth = 0.5;
  for (let i = 0; i < bgNodes.length; i++) {
    const a = bgNodes[i];
    for (let j = i + 1; j < bgNodes.length; j++) {
      const b = bgNodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        const frac = 1 - d / maxDist;
        const alpha = frac * 0.08;
        bgCtx.strokeStyle = (a.col || b.col) ? `rgba(180,79,255,${alpha})` : `rgba(0,212,255,${alpha})`;
        bgCtx.beginPath(); bgCtx.moveTo(a.x, a.y); bgCtx.lineTo(b.x, b.y); bgCtx.stroke();
        if (frac > 0.5 && Math.random() < 0.0003) {
          bgPulses.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, t: 0, spd: 0.005 + Math.random() * 0.005 });
        }
      }
    }
  }

  for (let i = bgPulses.length - 1; i >= 0; i--) {
    const p = bgPulses[i];
    p.t += p.spd;
    if (p.t >= 1) { bgPulses.splice(i, 1); continue; }
    const px = p.ax + (p.bx - p.ax) * p.t;
    const py = p.ay + (p.by - p.ay) * p.t;
    const alpha = Math.sin(p.t * Math.PI) * 0.6;
    const grd = bgCtx.createRadialGradient(px, py, 0, px, py, 4);
    grd.addColorStop(0, `rgba(0,212,255,${alpha})`);
    grd.addColorStop(1, 'rgba(0,212,255,0)');
    bgCtx.beginPath(); bgCtx.arc(px, py, 4, 0, Math.PI * 2); bgCtx.fillStyle = grd; bgCtx.fill();
  }

  bgNodes.forEach(n => {
    const pulse = Math.sin(t * n.speed * 1000 + n.phase) * 0.5 + 0.5;
    const glowR = n.r + pulse * 2;
    const alpha = 0.2 + pulse * 0.4;
    const [cr, cg, cb] = n.col ? [180, 79, 255] : [0, 212, 255];
    const grd = bgCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR * 2.5);
    grd.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
    grd.addColorStop(0.5, `rgba(${cr},${cg},${cb},${alpha * 0.2})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    bgCtx.beginPath(); bgCtx.arc(n.x, n.y, glowR * 2.5, 0, Math.PI * 2); bgCtx.fillStyle = grd; bgCtx.fill();
  });
}

function bgLoop(t) {
  drawBg(t);
  requestAnimationFrame(bgLoop);
}

// ── DRAW FRAME (cover-fit) ───────────────────
function drawFrame(idx){
  const img=S.frames[idx];
  if(!img||!img.complete||!img.naturalWidth) return;
  const W=window.innerWidth, H=window.innerHeight;
  const sc=Math.max(W/img.naturalWidth,H/img.naturalHeight);
  const dW=img.naturalWidth*sc, dH=img.naturalHeight*sc;
  heroCtx.clearRect(0,0,W,H);
  heroCtx.drawImage(img,(W-dW)/2,(H-dH)/2,dW,dH);
}

// ── PRELOAD FRAMES ───────────────────────────
function preloadFrames(){
  return new Promise(resolve=>{
    S.frames=new Array(CFG.frameCount);
    let done=0;
    function onLoad(i,img){
      S.frames[i]=img; done++;
      if(i===0) drawFrame(0);
      const pct=Math.round(done/CFG.frameCount*100);
      if (ldBar) ldBar.style.width=pct+'%';
      if (ldText) ldText.textContent=`LOADING FRAMES... ${pct}%`;
      if(done===CFG.frameCount) resolve();
    }
    function batch(start){
      const end=Math.min(start+CFG.batchSize,CFG.frameCount);
      for(let i=start;i<end;i++){
        const img=new Image(), idx=i;
        img.onload =()=>onLoad(idx,img);
        img.onerror=()=>{const b=new Image();onLoad(idx,b);};
        img.src=CFG.framePath(i+1);
      }
      if(end<CFG.frameCount) requestAnimationFrame(()=>batch(end));
    }
    batch(0);
  });
}

// ── SCROLL HEIGHT ────────────────────────────
function setScrollHeight(){
  const drv=document.getElementById('scroll-driver');
  if(drv) drv.style.height=(window.innerHeight*CFG.scrollMult)+'px';
}

// ── SCROLL READ ──────────────────────────────
function readScroll(){
  const maxScroll = window.innerHeight * CFG.scrollMult;
  S.rawProg = Math.min(1, Math.max(0, window.scrollY / maxScroll));
}
window.addEventListener('scroll',readScroll,{passive:true});

// ── RENDER LOOP ──────────────────────────────
const heroStage = document.getElementById('hero-stage');

function renderLoop(){
  S.smoothProg+=(S.rawProg-S.smoothProg)*CFG.ease;
  const idx=Math.min(CFG.frameCount-1,Math.floor(S.smoothProg*(CFG.frameCount-1)));
  if(idx!==S.curFrame){S.curFrame=idx;drawFrame(idx);}
  if (seqFill) seqFill.style.width=Math.min(100,S.smoothProg*100)+'%';
  const frameCtr = document.getElementById('frameCounter');
  if (frameCtr) frameCtr.textContent=`${String(idx+1).padStart(3,'0')} / 176`;

  // ── HERO VIDEO DEPTH FLOW ──────────────────────────────────────────────
  // Makes the video feel like a living layer moving WITH the page:
  //   • 0 → 82%  : subtle zoom-in (scale 1.0 → 1.04)  — video breathes as you scroll
  //   • 82% → 100%: scale recession + fade-out          — video retreats as page flows over it
  if (heroStage) {
    const p = S.smoothProg;
    if (p <= 0.82) {
      const scale = 1 + p * 0.048;              // 1.000 → 1.040 gentle zoom
      heroStage.style.opacity = '1';
      heroStage.style.transform = `scale(${scale.toFixed(4)})`;
    } else {
      const t = (p - 0.82) / 0.18;              // 0 → 1 over the last 18%
      const easedT = t * t * (3 - 2 * t);       // smoothstep easing
      const scale = 1.04 - easedT * 0.16;       // 1.04 → 0.88 — recede into depth
      const opacity = 1 - easedT;               // 1.0 → 0.0 — fade away cleanly
      heroStage.style.opacity = Math.max(0, opacity).toFixed(4);
      heroStage.style.transform = `scale(${scale.toFixed(4)})`;
    }
  }

  // Drive scroll-phase overlays every frame
  updateScrollProgress();

  requestAnimationFrame(renderLoop);
}

// ── PARTICLES (pCanvas layer) ────────────────
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
const particles = [];
class P {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * pCanvas.width;
    this.y = Math.random() * pCanvas.height;
    this.size = Math.random() * 1.6 + 0.3;
    this.sx = (Math.random() - .5) * .4;
    this.sy = (Math.random() - .5) * .4;
    this.o = Math.random() * .45 + .08;
    this.c = Math.random() > .5 ? '0,212,255' : '180,79,255';
  }
  update() {
    this.x += this.sx + (mx - pCanvas.width / 2) * .00007;
    this.y += this.sy + (my - pCanvas.height / 2) * .00007;
    if (this.x < 0 || this.x > pCanvas.width || this.y < 0 || this.y > pCanvas.height) this.reset();
  }
  draw() {
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${this.c},${this.o})`;
    pCtx.fill();
  }
}
for (let i = 0; i < 90; i++) particles.push(new P());
function animParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        pCtx.strokeStyle = `rgba(0,212,255,${(1 - d / 90) * 0.08})`;
        pCtx.lineWidth = .4;
        pCtx.beginPath(); pCtx.moveTo(particles[a].x, particles[a].y);
        pCtx.lineTo(particles[b].x, particles[b].y); pCtx.stroke();
      }
    }
  }
  requestAnimationFrame(animParticles);
}

// ── NEURAL CANVAS ────────────────────────────
function initNeural() {
  const c = document.getElementById('neural-canvas'); if (!c) return;
  const x = c.getContext('2d');
  function resize() { c.width = c.parentElement.clientWidth; c.height = c.parentElement.clientHeight; }
  resize(); window.addEventListener('resize', resize);
  const layers = [3, 5, 5, 3], nodes = [];
  layers.forEach((cnt, li) => {
    for (let i = 0; i < cnt; i++) nodes.push({ x: (li + 1) / (layers.length + 1), y: (i + 1) / (cnt + 1), phase: Math.random() * Math.PI * 2, layer: li });
  });
  function draw(t) {
    x.clearRect(0, 0, c.width, c.height);
    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
      if (nodes[b].layer === nodes[a].layer + 1) {
        x.strokeStyle = `rgba(0,212,255,${.07 + .04 * Math.sin(t * .001 + a * .5)})`;
        x.lineWidth = .6; x.beginPath();
        x.moveTo(nodes[a].x * c.width, nodes[a].y * c.height);
        x.lineTo(nodes[b].x * c.width, nodes[b].y * c.height); x.stroke();
      }
    }
    nodes.forEach((n, i) => {
      const nx = n.x * c.width, ny = n.y * c.height;
      const p = Math.sin(t * .002 + n.phase) * .5 + .5;
      const r = 4 + p * 3;
      const g = x.createRadialGradient(nx, ny, 0, nx, ny, r * 2);
      g.addColorStop(0, `rgba(0,212,255,${.5 + p * .4})`); g.addColorStop(1, 'rgba(0,212,255,0)');
      x.beginPath(); x.arc(nx, ny, r * 2, 0, Math.PI * 2); x.fillStyle = g; x.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// ── SKILLS SPHERE ────────────────────────────
function initSphere() {
  const scene = document.getElementById('sphereScene'); if (!scene) return;
  const wrap = document.getElementById('sphereWrap');
  const r1 = document.createElement('div'); r1.className = 'sphere-ring sphere-ring-1';
  const r2 = document.createElement('div'); r2.className = 'sphere-ring sphere-ring-2';
  wrap.append(r1, r2);
  const skills = [
    'Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'NumPy', 'Pandas',
    'Flask', 'Streamlit', 'Git', 'MySQL', 'MongoDB', 'Java',
    'C++', 'SQL', 'Tableau', 'YOLO', 'Keras', 'scikit-learn',
    'Deep Learning', 'Computer Vision', 'NLP', 'GIS',
  ];
  const R = 140, N = skills.length;
  skills.forEach((skill, i) => {
    const phi = Math.acos(1 - 2 * (i + .5) / N);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const sx = R * Math.sin(phi) * Math.cos(theta);
    const sy = R * Math.sin(phi) * Math.sin(theta);
    const sz = R * Math.cos(phi);
    const tag = document.createElement('div'); tag.className = 'sphere-tag';
    tag.style.transform = `translate3d(${sx}px,${sy}px,${sz}px)`;
    const inner = document.createElement('div'); inner.className = 'sphere-tag-inner';
    inner.textContent = skill;
    const hue = i % 3 === 0 ? 'var(--blue)' : i % 3 === 1 ? 'var(--purple)' : 'rgba(0,212,255,.7)';
    inner.style.color = hue;
    inner.style.borderColor = i % 3 === 0 ? 'rgba(0,212,255,.3)' : 'rgba(180,79,255,.3)';
    tag.appendChild(inner); scene.appendChild(tag);
  });
  scene.querySelectorAll('.sphere-tag').forEach(t => {
    t.addEventListener('mouseenter', () => scene.style.animationPlayState = 'paused');
    t.addEventListener('mouseleave', () => scene.style.animationPlayState = 'running');
  });
}

// ── SKILL BARS ───────────────────────────────
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.hr-fill').forEach(f => f.classList.add('anim'));
        e.target.querySelectorAll('.hr-pct').forEach(el => {
          if(el.dataset.animated) return;
          el.dataset.animated = '1';
          const target = parseInt(el.dataset.val, 10);
          let curr = 0;
          const duration = 1500;
          const start = performance.now();
          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + '%';
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: .3 });
  document.querySelectorAll('.hud-rings-panel').forEach(el => obs.observe(el));
}

// ── TIMELINE REVEAL ──────────────────────────
function initTimeline() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: .2 });
  document.querySelectorAll('.tl-item').forEach(el => obs.observe(el));
}

// ── METRICS COUNTER ──────────────────────────
function initMetrics() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const isDecimal = el.classList.contains('metric-decimal');
      let current = 0;
      const duration = 1800;
      const start = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(target * eased);
        if (isDecimal) {
          // Convert 831 → 8.31
          el.textContent = (current / 100).toFixed(2);
        } else {
          el.textContent = current + '+';
        }
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = isDecimal ? (target / 100).toFixed(2) : target + '+';
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('.metric-num').forEach(el => obs.observe(el));
}

// ── CERTIFICATIONS REVEAL ────────────────────
function initCerts() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  document.querySelectorAll('.cert-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    obs.observe(el);
  });
}

// ── NAVBAR ───────────────────────────────────
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) cur = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.section === cur));
});
navToggle && navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { navLinks.classList.remove('open'); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── HUD TIME ─────────────────────────────────
setInterval(() => { if (hudTime) hudTime.textContent = new Date().toTimeString().split(' ')[0]; }, 1000);

// ── HERO PARALLAX (active phase only) ─────────
document.addEventListener('mousemove', e => {
  const hc = document.querySelector('.scroll-phase.active');
  if (!hc) return;
  const dx = (e.clientX - innerWidth / 2) * .006;
  const dy = (e.clientY - innerHeight / 2) * .006;
  hc.style.transform = `translate(${dx}px,${dy}px)`;
});

// ── SCROLL PHASE MANAGER ─────────────────────
let PHASES = [];
let currentPhase = -1;
let metricsAnimated = false;

function animatePhaseMetrics() {
  if (metricsAnimated) return;
  metricsAnimated = true;
  document.querySelectorAll('.phase-metric-num').forEach(el => {
    const raw = el.dataset.val;
    const isDecimal = 'decimal' in el.dataset;
    const target = parseFloat(raw);
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (isDecimal) {
        el.textContent = (target * eased).toFixed(2);
      } else {
        el.textContent = Math.round(target * eased) + '+';
      }
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isDecimal ? target.toFixed(2) : target + '+';
    }
    requestAnimationFrame(step);
  });
}

function updateScrollProgress() {
  if (!PHASES.length) return; // not initialised yet
  // Which third of the hero scroll are we in?
  const phaseIndex = S.rawProg < 0.33 ? 0 : S.rawProg < 0.66 ? 1 : 2;
  if (phaseIndex === currentPhase) return;

  PHASES.forEach((el, i) => {
    if (!el) return;
    el.classList.remove('active', 'exit');
    if (i === phaseIndex) {
      el.classList.add('active');
      // Also clear any lingering parallax transform so CSS transition looks clean
      el.style.transform = '';
    } else if (i < phaseIndex) {
      el.classList.add('exit');
    }
  });

  currentPhase = phaseIndex;
  if (phaseIndex === 2) animatePhaseMetrics();
}

// ── TERMINAL ─────────────────────────────────
function initTerminal() {
  const cmd = document.getElementById('typedCmd');
  const out = document.getElementById('termOutput');
  if (!cmd || !out) return;
  const lines = [
    { t: '> Establishing secure connection...', c: '' },
    { t: '> Auth: SUCCESS ✓', c: 'ok' },
    { t: '> name: H. Divyan', c: 'hl' },
    { t: '> role: AI/ML Engineer', c: 'hl' },
    { t: '> email: h.divyan7@gmail.com', c: 'hl' },
    { t: '> location: Chennai, India', c: 'hl' },
    { t: '> STATUS: Available for Opportunities ✓', c: 'ok' },
  ];
  function type(el, txt, speed, cb) {
    let i = 0; el.textContent = '';
    (function go() { if (i < txt.length) { el.textContent += txt[i++]; setTimeout(go, speed); } else if (cb) cb(); })();
  }
  function run() {
    cmd.textContent = ''; out.innerHTML = '';
    type(cmd, 'connect --divyan', 55, () => {
      let d = 300;
      lines.forEach(l => {
        setTimeout(() => {
          const row = document.createElement('div');
          row.className = 't-row ' + l.c; row.textContent = l.t;
          out.appendChild(row);
        }, d); d += 280;
      });
      setTimeout(run, d + 3200);
    });
  }
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { run(); obs.disconnect(); }
  }, { threshold: .4 });
  obs.observe(document.getElementById('terminal'));
}

// ── MODAL ────────────────────────────────────
const projects = [
  { icon: '🧬', title: 'MedicFood', desc: 'An AI-powered OCR pipeline that scans food packaging labels to detect ingredients harmful for users with specific medical conditions — diabetes, hypertension, allergies, and more. Built with TensorFlow and deployed via Flask API.', tech: ['OCR', 'TensorFlow', 'Python', 'Flask', 'NLP', 'OpenCV'] },
  { icon: '🚗', title: 'Vehicle Cut-in Detection', desc: 'Real-time ADAS system detecting aggressive vehicle lane cut-ins using computer vision and deep learning. Processes live camera feeds to predict dangerous maneuvers and reduce highway collision risk.', tech: ['OpenCV', 'PyTorch', 'YOLO', 'Python', 'CUDA', 'NumPy'] },
  { icon: '🛰️', title: 'Crop Health Monitoring', desc: 'Satellite imagery analysis pipeline using ML for large-scale agricultural monitoring — detecting crop disease, stress zones, and yield indicators from multispectral data with actionable dashboards for farmers.', tech: ['Satellite ML', 'NumPy', 'Streamlit', 'GIS', 'scikit-learn', 'Pandas'] },
];
const overlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
document.querySelectorAll('.proj-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = projects[+btn.dataset.project];
    modalBody.innerHTML = `<div style="font-size:2.2rem;margin-bottom:.8rem">${p.icon}</div>
      <h2>${p.title}</h2><p>${p.desc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem">${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
function closeModal() { overlay.classList.remove('open'); document.body.style.overflow = ''; }

// ── GSAP ─────────────────────────────────────
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero content scroll: phase system handles this, skip GSAP fade

  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, { opacity: 0, y: 40, duration: .8, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  gsap.utils.toArray('.proj-card').forEach((c, i) => {
    gsap.from(c, { opacity: 0, y: 60, duration: .7, delay: i * .12, scrollTrigger: { trigger: c, start: 'top 88%' } });
  });
  gsap.from('.about-card', { opacity: 0, x: -60, duration: 1, scrollTrigger: { trigger: '#about', start: 'top 70%' } });
  gsap.from('.neural-wrap', { opacity: 0, x: 60, duration: 1, scrollTrigger: { trigger: '#about', start: 'top 70%' } });
  gsap.from('.skills-layout', { opacity: 0, y: 50, duration: 1, scrollTrigger: { trigger: '#skills', start: 'top 75%' } });
  gsap.from('.contact-grid', { opacity: 0, y: 50, duration: .9, scrollTrigger: { trigger: '#contact', start: 'top 75%' } });
  gsap.utils.toArray('.metric-card').forEach((c, i) => {
    gsap.from(c, { opacity: 0, y: 30, duration: .6, delay: i * .1, scrollTrigger: { trigger: c, start: 'top 88%' } });
  });
}

// ── FAKE LOADER ───────────────────────────────
function runLoader() {
  return new Promise(resolve => {
    const steps = [
      [200, 20, 'BOOT SEQUENCE...'],
      [400, 45, 'LOADING MODULES...'],
      [600, 70, 'INITIALIZING AI...'],
      [800, 90, 'CALIBRATING...'],
      [1000, 100, 'SYSTEM READY'],
    ];
    steps.forEach(([delay, pct, msg]) => {
      setTimeout(() => {
        if (ldBar) ldBar.style.width = pct + '%';
        if (ldText) ldText.textContent = msg;
        if (pct === 100) setTimeout(resolve, 300);
      }, delay);
    });
  });
}

// ── INIT ─────────────────────────────────────
async function init() {
  resizeCanvases();
  setScrollHeight();
  readScroll();
  await preloadFrames();
  await runLoader();
  loader.classList.add('gone');
  S.ready=true;

  // Initialise phase elements now DOM is confirmed ready
  PHASES.push(
    document.getElementById('heroContent'),
    document.getElementById('phaseAbout'),
    document.getElementById('phaseMetrics'),
  );

  requestAnimationFrame(renderLoop);
  requestAnimationFrame(bgLoop);
  requestAnimationFrame(animParticles);

  initNeural();
  initSphere();
  initSkillBars();
  initTimeline();
  initMetrics();
  initCerts();
  initTerminal();
  initGSAP();
  // Kick off phase system and keep it in sync with render loop
  updateScrollProgress();
}

document.addEventListener('DOMContentLoaded', init);