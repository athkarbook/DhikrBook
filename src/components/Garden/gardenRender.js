// gardenRender.js
// All Canvas 2D drawing for the garden. The engine says what exists; this paints it.
// Layered, illustrated side-view with a day/night sky, parallax hills + clouds,
// a grassy foreground, and species-specific trees that visibly grow with XP.

import { SPECIES, makeRng } from './gardenEngine';

// --- tiny colour helpers ------------------------------------------------------
const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return h.length >= 7
    ? { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
    : { r: ((n >> 8) & 15) * 17, g: ((n >> 4) & 15) * 17, b: (n & 15) * 17 };
};
const lerp = (a, b, t) => a + (b - a) * t;
function mix(c1, c2, t) {
  const a = hexToRgb(c1), b = hexToRgb(c2);
  return `rgb(${Math.round(lerp(a.r, b.r, t))},${Math.round(lerp(a.g, b.g, t))},${Math.round(lerp(a.b, b.b, t))})`;
}
const rgba = (hex, a) => {
  const c = hexToRgb(hex);
  return `rgba(${c.r},${c.g},${c.b},${a})`;
};
const hash1 = (n) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

// Apply night darkening + distance haze to any species colour.
function tint(base, env, haze) {
  let c = base;
  if (env.dark) c = mix(base, '#15244c', 0.36);
  if (haze) c = mix(c, env.haze, haze);
  return c;
}

export function makeEnv(dark) {
  return {
    dark,
    sky: dark ? ['#0a1334', '#1a2a5c', '#33406f'] : ['#a9e1f6', '#d2edfb', '#e9f7ea'],
    sun: dark ? '#f5f1cf' : '#fff2a8',
    sunGlow: dark ? 'rgba(245,241,207,0.20)' : 'rgba(255,238,150,0.55)',
    hills: dark ? ['#15224a', '#1b2b54', '#223769'] : ['#c3e8cc', '#95d6a2', '#63bb7b'],
    ground: dark ? ['#205c38', '#103d25'] : ['#53ad60', '#2f7d3f'],
    groundTop: dark ? '#2c6e43' : '#63bd6e',
    haze: dark ? '#1b2849' : '#d2efdf',
    fruitGlow: dark ? 0.0 : 0.0,
  };
}

// =============================================================================
//  Background (screen space, with manual parallax)
// =============================================================================
function drawSky(ctx, W, H, env) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, env.sky[0]);
  g.addColorStop(0.55, env.sky[1]);
  g.addColorStop(1, env.sky[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawCelestial(ctx, W, H, env) {
  const cx = W * 0.8, cy = H * 0.22, r = Math.min(W, H) * 0.07;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 4);
  glow.addColorStop(0, env.sunGlow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = env.sun;
  ctx.fill();
  if (env.dark) {
    // carve a crescent
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx + r * 0.45, cy - r * 0.25, r * 0.92, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

function drawStars(ctx, stars, W, H, t, env) {
  if (!env.dark) return;
  ctx.fillStyle = '#ffffff';
  for (const s of stars) {
    const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.5 * s.tw + s.ph));
    ctx.globalAlpha = tw * s.a;
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHills(ctx, camX, zoom, W, H, env) {
  const layers = [
    { p: 0.18, base: H * 0.60, amp: 26, freq: 0.0016, col: env.hills[0] },
    { p: 0.34, base: H * 0.66, amp: 34, freq: 0.0022, col: env.hills[1] },
    { p: 0.52, base: H * 0.72, amp: 30, freq: 0.0030, col: env.hills[2] },
  ];
  for (const L of layers) {
    const shift = camX * zoom * L.p;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 12) {
      const y = L.base + Math.sin((x + shift) * L.freq) * L.amp + Math.sin((x + shift) * L.freq * 2.3) * L.amp * 0.3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = L.col;
    ctx.fill();
  }
}

function drawClouds(ctx, clouds, camX, zoom, t, W, H, env) {
  const fill = env.dark ? 'rgba(180,190,220,0.16)' : 'rgba(255,255,255,0.85)';
  for (const c of clouds) {
    const span = W + 360;
    let sx = (((c.x + t * c.speed - camX * zoom * 0.25) % span) + span) % span - 180;
    const sy = c.y * H;
    ctx.fillStyle = fill;
    for (const p of c.puffs) {
      ctx.beginPath();
      ctx.arc(sx + p.dx * c.scale, sy + p.dy * c.scale, p.r * c.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// =============================================================================
//  Ground + foliage (world space — caller has applied the camera transform)
// =============================================================================
function drawGround(ctx, xL, xR, env) {
  const top = 0, depth = 1400;
  const g = ctx.createLinearGradient(0, top, 0, top + 220);
  g.addColorStop(0, env.ground[0]);
  g.addColorStop(1, env.ground[1]);
  ctx.fillStyle = g;
  ctx.fillRect(xL, top, xR - xL, depth);
  // a soft brighter lip along the grass line
  ctx.fillStyle = env.groundTop;
  ctx.fillRect(xL, top - 3, xR - xL, 6);
}

function drawShadow(ctx, x, w, env) {
  ctx.fillStyle = env.dark ? 'rgba(0,0,0,0.30)' : 'rgba(20,60,30,0.20)';
  ctx.beginPath();
  ctx.ellipse(x, 4, w, w * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawTuft(ctx, tf, env) {
  const c = mix(env.ground[0], env.dark ? '#0c2c1a' : '#ffffff', tf.shade * 0.25);
  ctx.fillStyle = c;
  ctx.strokeStyle = c;
  ctx.lineWidth = 1.6 * tf.scale;
  ctx.lineCap = 'round';
  const h = 9 * tf.scale;
  for (let b = -1; b <= 1; b++) {
    ctx.beginPath();
    ctx.moveTo(tf.x + b * 2.4 * tf.scale, tf.lift);
    ctx.quadraticCurveTo(tf.x + b * 4 * tf.scale, tf.lift - h * 0.6, tf.x + b * 5.5 * tf.scale, tf.lift - h);
    ctx.stroke();
  }
}

// --- canopy blob: gives volume with a shadow / base / highlight stack ---------
function blob(ctx, x, y, r, base, shadow, hi) {
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(x + r * 0.12, y + r * 0.12, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.94, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hi;
  ctx.beginPath();
  ctx.arc(x - r * 0.28, y - r * 0.30, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawTrunk(ctx, baseW, h, color, env) {
  const topW = baseW * 0.5;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-baseW, 0);
  ctx.quadraticCurveTo(-topW * 1.2, -h * 0.5, -topW, -h);
  ctx.lineTo(topW, -h);
  ctx.quadraticCurveTo(topW * 1.2, -h * 0.5, baseW, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = rgba('#000000', env.dark ? 0.22 : 0.14);
  ctx.fillRect(topW * 0.1, -h, topW * 0.9, h);
}

function drawFruit(ctx, tree, sp, cx, cy, r, env) {
  if (!sp.fruit || tree.fruit <= 0) return;
  const col = env.dark ? mix(sp.fruit, '#15244c', 0.25) : sp.fruit;
  for (let k = 0; k < tree.fruit && k < tree.fruitPos.length; k++) {
    const p = tree.fruitPos[k];
    const fx = cx + p.ux * r, fy = cy + p.uy * r;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(fx, fy, sp.fruitR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = rgba('#ffffff', 0.55);
    ctx.beginPath();
    ctx.arc(fx - sp.fruitR * 0.3, fy - sp.fruitR * 0.3, sp.fruitR * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRound(ctx, tree, sp, env, sway) {
  const g = tree.growth;
  const h = (24 + 58 * g) ;
  const r = (10 + 40 * g);
  const base = tint(sp.canopy[0], env, tree.haze);
  const shadow = tint(sp.canopy[1], env, tree.haze);
  const hi = tint(sp.canopy[2], env, tree.haze);
  drawTrunk(ctx, 4 + 4 * g, h, tint(sp.trunk, env, tree.haze * 0.6), env);
  const cy = -h - r * 0.5;
  const cx = sway * (0.4 + g);
  const n = Math.max(1, Math.round(tree.bark * (0.6 + g)));
  const rng = makeRng(tree.i * 17 + 3);
  // outer ring of blobs for an organic silhouette
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + rng();
    const rad = r * (0.45 + rng() * 0.35);
    blob(ctx, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.8, r * (0.5 + rng() * 0.3), base, shadow, hi);
  }
  blob(ctx, cx, cy, r * 0.95, base, shadow, hi); // dense centre
  drawFruit(ctx, tree, sp, cx, cy, r, env);
}

function drawPine(ctx, tree, sp, env, sway) {
  const g = tree.growth;
  const h = 28 + 70 * g;
  const w = 14 + 30 * g;
  drawTrunk(ctx, 3 + 3 * g, h * 0.34, tint(sp.trunk, env, tree.haze * 0.6), env);
  const base = tint(sp.canopy[0], env, tree.haze);
  const shadow = tint(sp.canopy[1], env, tree.haze);
  const hi = tint(sp.canopy[2], env, tree.haze);
  const tiers = 3;
  for (let i = 0; i < tiers; i++) {
    const f = 1 - i / tiers;
    const yTop = -h * (0.34 + (i / tiers) * 0.64);
    const yBot = yTop + h * 0.34;
    const tw = w * f;
    const sx = sway * (i + 1) * 0.5;
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(sx, yTop);
    ctx.lineTo(sx + tw, yBot);
    ctx.lineTo(sx - tw, yBot);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.moveTo(sx, yTop);
    ctx.lineTo(sx + tw * 0.86, yBot);
    ctx.lineTo(sx - tw * 0.55, yBot);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = hi;
    ctx.beginPath();
    ctx.moveTo(sx, yTop);
    ctx.lineTo(sx - tw * 0.55, yBot);
    ctx.lineTo(sx - tw * 0.18, yBot);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBirch(ctx, tree, sp, env, sway) {
  const g = tree.growth;
  const h = 30 + 78 * g;
  // slim white trunk with dark ticks
  ctx.fillStyle = tint(sp.trunk, env, tree.haze * 0.4);
  const tw = 2.4 + 2.4 * g;
  ctx.fillRect(-tw, -h, tw * 2, h);
  ctx.fillStyle = rgba('#3a3a3a', env.dark ? 0.4 : 0.55);
  for (let y = -h + 8; y < -8; y += 12) {
    ctx.fillRect(-tw, y, tw * 1.3, 2);
  }
  const r = 9 + 30 * g;
  const cy = -h - r * 0.3;
  const cx = sway * (0.6 + g);
  const base = tint(sp.canopy[0], env, tree.haze);
  const shadow = tint(sp.canopy[1], env, tree.haze);
  const hi = tint(sp.canopy[2], env, tree.haze);
  const rng = makeRng(tree.i * 13 + 7);
  const n = Math.max(2, Math.round(3 + g * 3));
  for (let k = 0; k < n; k++) {
    const a = rng() * Math.PI * 2;
    const rad = r * (0.3 + rng() * 0.5);
    blob(ctx, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.9, r * (0.4 + rng() * 0.3), base, shadow, hi);
  }
}

function drawPalm(ctx, tree, sp, env, sway) {
  const g = tree.growth;
  const h = 34 + 96 * g;
  const tw = 4 + 4 * g;
  // gently curved trunk
  ctx.strokeStyle = tint(sp.trunk, env, tree.haze * 0.6);
  ctx.lineWidth = tw * 2;
  ctx.lineCap = 'round';
  const lean = sway * 1.2 + 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(lean * 0.4, -h * 0.5, lean, -h);
  ctx.stroke();
  // segment rings
  ctx.strokeStyle = rgba('#000000', 0.12);
  ctx.lineWidth = 1.5;
  for (let s = 0.15; s < 1; s += 0.16) {
    const x = lean * s * s, y = -h * s;
    ctx.beginPath();
    ctx.moveTo(x - tw, y);
    ctx.lineTo(x + tw, y);
    ctx.stroke();
  }
  // fronds radiating from the crown
  const cx = lean, cy = -h;
  const base = tint(sp.canopy[0], env, tree.haze);
  const shadow = tint(sp.canopy[1], env, tree.haze);
  const fronds = 7;
  const len = 20 + 40 * g;
  ctx.lineCap = 'round';
  for (let k = 0; k < fronds; k++) {
    const a = Math.PI + (k / (fronds - 1)) * Math.PI;
    const ex = cx + Math.cos(a) * len;
    const ey = cy + Math.sin(a) * len * 0.7 - 6;
    const mx = cx + Math.cos(a) * len * 0.5;
    const my = cy + Math.sin(a) * len * 0.5 - 12;
    ctx.strokeStyle = k % 2 ? shadow : base;
    ctx.lineWidth = 5 * g + 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(mx, my, ex, ey);
    ctx.stroke();
  }
  // dates
  if (sp.fruit && tree.fruit > 0) {
    drawFruit(ctx, tree, sp, cx, cy + 4, 8 + g * 6, env);
  }
}

function drawTree(ctx, tree, t, env) {
  const sp = SPECIES[tree.key];
  ctx.save();
  ctx.translate(tree.x, tree.lift);
  ctx.globalAlpha = tree.alpha;
  ctx.scale(tree.scale * 1.32, tree.scale * 1.32); // trees are the hero — keep them prominent
  const sway = Math.sin(t * tree.swaySpeed + tree.swayPhase) * (2 + tree.growth * 3);
  drawShadow(ctx, 0, (14 + tree.growth * 26), env);
  if (tree.family === 'pine') drawPine(ctx, tree, sp, env, sway);
  else if (tree.family === 'palm') drawPalm(ctx, tree, sp, env, sway);
  else if (tree.family === 'birch') drawBirch(ctx, tree, sp, env, sway);
  else drawRound(ctx, tree, sp, env, sway);
  ctx.restore();
}

function drawFlower(ctx, fl, t, env) {
  ctx.save();
  ctx.translate(fl.x, fl.lift);
  ctx.scale(fl.scale, fl.scale);
  const sway = Math.sin(t * 0.9 + fl.swayPhase) * 1.6;
  const stem = tint('#2f8f3f', env, 0);
  if (fl.type === 'bush') {
    const c = tint(fl.color, env, 0);
    blob(ctx, 0, -5, 8, c, mix(c, '#000', 0.2), mix(c, '#fff', 0.3));
    ctx.restore();
    return;
  }
  ctx.strokeStyle = stem;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(sway, -7, sway, -13);
  ctx.stroke();
  const cx = sway, cy = -14;
  const col = tint(fl.color, env, 0);
  if (fl.type === 'lavender') {
    ctx.fillStyle = col;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy + i * 3 - 4, 2.4 - i * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (fl.type === 'daisy' || fl.type === 'rose' || fl.type === 'poppy' || fl.type === 'tulip') {
    const petals = fl.type === 'tulip' ? 5 : 6;
    ctx.fillStyle = col;
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * 3, cy + Math.sin(a) * 3, 2.4, 3.2, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = fl.type === 'daisy' ? '#f6c945' : mix(col, '#3a1020', 0.4);
    ctx.beginPath();
    ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawButterfly(ctx, x, y, t, col) {
  const flap = Math.abs(Math.sin(t * 9)) * 0.8 + 0.2;
  ctx.fillStyle = col;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + s * 3 * flap, y, 3 * flap, 4, s * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - 0.6, y - 2, 1.2, 4);
}

// Soft fan-shaped grass right at the camera — fills the foreground and adds depth.
function drawForeground(ctx, xL, xR, t, env) {
  const step = 22;
  const startI = Math.floor(xL / step) - 1;
  const endI = Math.ceil(xR / step) + 1;
  const lo = env.dark ? '#163f28' : '#2f9446';
  const hi = env.dark ? '#2a6840' : '#62c267';
  for (let i = startI; i <= endI; i++) {
    const x = i * step + (hash1(i) - 0.5) * 14;
    const y = 88 + hash1(i * 1.7) * 80; // depth inside the foreground band
    const s = 0.9 + hash1(i * 2.3) * 1.1;
    const blades = 4 + Math.floor(hash1(i * 3.1) * 3);
    const col = mix(lo, hi, hash1(i * 4.4));
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    const sway = Math.sin(t * 0.9 + i * 0.6) * 2.2;
    for (let b = 0; b < blades; b++) {
      const dir = blades > 1 ? b / (blades - 1) - 0.5 : 0; // fan spread
      const bx = x + dir * 7 * s;
      const bh = (12 + hash1(i * 7 + b) * 11) * s;
      ctx.lineWidth = (1.3 + hash1(i * 9 + b) * 1.0) * s;
      ctx.beginPath();
      ctx.moveTo(bx, y);
      ctx.quadraticCurveTo(bx + dir * 6 * s + sway, y - bh * 0.6, bx + dir * 12 * s + sway * 1.4, y - bh);
      ctx.stroke();
    }
  }
}

function drawCritters(ctx, critters, t, env) {
  for (const c of critters) {
    const x = c.x + Math.sin(t * c.sp + c.ph) * c.range;
    const y = c.y + Math.cos(t * c.sp * 1.3 + c.ph) * c.range * 0.5;
    if (env.dark) {
      // firefly
      const glow = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 3 + c.ph));
      ctx.fillStyle = rgba('#ffe98a', glow);
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawButterfly(ctx, x, y, t + c.ph, c.col);
    }
  }
}

// =============================================================================
//  Master render — orchestrates background (screen) + world (camera transform)
// =============================================================================
export function renderGarden(ctx, opts) {
  const { W, H, dpr, cam, world, env, backdrop, t } = opts;
  const { x: camX, y: camY, zoom } = cam;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  drawSky(ctx, W, H, env);
  drawCelestial(ctx, W, H, env);
  drawStars(ctx, backdrop.stars, W, H, t, env);
  drawHills(ctx, camX, zoom, W, H, env);
  drawClouds(ctx, backdrop.clouds, camX, zoom, t, W, H, env);

  // World layer: ground baseline sits low so trees rise into the sky; camera pans X (+ a little Y).
  const groundScreenY = H * 0.74;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.translate(W / 2 - camX * zoom, groundScreenY + camY);
  ctx.scale(zoom, zoom);

  const half = W / 2 / zoom;
  const xL = camX - half - 120;
  const xR = camX + half + 120;

  drawGround(ctx, xL, xR, env);
  for (const tf of world.tufts) if (tf.x > xL && tf.x < xR) drawTuft(ctx, tf, env);

  // Painter's order: far band → mid → near, so nearer trees overlap distant ones.
  for (let band = 0; band <= 2; band++) {
    for (const tree of world.trees) {
      if (tree.depth !== band) continue;
      if (tree.x < xL || tree.x > xR) continue;
      drawTree(ctx, tree, t, env);
    }
  }

  for (const fl of world.flowers) if (fl.x > xL && fl.x < xR) drawFlower(ctx, fl, t, env);
  drawCritters(ctx, backdrop.critters, t, env);
  drawForeground(ctx, xL, xR, t, env);
}

// Backdrop (clouds / stars / critters) — generated once per world, screen-anchored.
export function makeBackdrop(world) {
  const rng = makeRng(2024);
  const clouds = [];
  for (let i = 0; i < 7; i++) {
    const puffs = [];
    const np = 3 + Math.floor(rng() * 3);
    for (let p = 0; p < np; p++) {
      puffs.push({ dx: (p - np / 2) * 26, dy: (rng() - 0.5) * 14, r: 20 + rng() * 18 });
    }
    clouds.push({ x: rng() * 1400, y: 0.08 + rng() * 0.26, speed: 4 + rng() * 6, scale: 0.7 + rng() * 0.8, puffs });
  }
  const stars = [];
  for (let i = 0; i < 90; i++) {
    stars.push({ x: rng(), y: rng() * 0.55, r: 0.6 + rng() * 1.3, a: 0.4 + rng() * 0.6, tw: 0.5 + rng(), ph: rng() * 6.28 });
  }
  const colors = ['#ff7eb3', '#ffd166', '#7ec8ff', '#ffffff'];
  const critters = [];
  const nc = Math.min(8, 3 + Math.floor(world.numTrees / 8));
  for (let i = 0; i < nc; i++) {
    critters.push({
      x: 100 + rng() * Math.max(1, world.width - 200),
      y: -60 - rng() * 90,
      range: 30 + rng() * 60,
      sp: 0.3 + rng() * 0.5,
      ph: rng() * 6.28,
      col: colors[Math.floor(rng() * colors.length)],
    });
  }
  return { clouds, stars, critters };
}
