// gardenEngine.js
// Pure, deterministic generation of the 2D garden world from a single XP number.
// No DOM / no canvas here — this only describes WHAT exists in the garden so the
// renderer can stay focused on HOW to draw it. Same XP always yields the same garden.

// --- Seeded PRNG (mulberry32): fast and well distributed, unlike a bare Math.sin. ---
export function makeRng(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// --- Growth / economy tuning (XP is "time"). ----------------------------------
export const GARDEN = {
  xpPerTree: 28, // a new tree is planted roughly every this many XP
  maxTrees: 54, // after this the grove stops widening; existing trees keep maturing + fruiting
  matureXp: 230, // XP of growth from sprout to a full canopy
  fruitStartFrac: 0.5, // a tree starts bearing fruit once growth passes this
  fruitStepXp: 38, // every this much extra XP grows one more fruit
  maxFruit: 16,
  spacing: 128, // world px between successive trees
  marginX: 200,
  baseFlowers: 10,
  flowerPerXp: 10, // flowers fill in faster than trees
  maxFlowers: 180,
};

// --- Tree species: curated palettes so colours stay harmonious. ----------------
// canopy = [base, shadow, highlight]; fruit = colour or null. Olives, pomegranates,
// dates (palm) and figs are deliberate nods to the gardens described in the Qur'an.
export const SPECIES = {
  oak:         { family: 'round', canopy: ['#3f9d4f', '#2c7d3c', '#74c96d'], trunk: '#6b4423', fruit: '#e6402f', fruitR: 5 },
  olive:       { family: 'round', canopy: ['#6f9b6a', '#54804f', '#9cc08f'], trunk: '#7a5a3a', fruit: '#404d2c', fruitR: 4 },
  pomegranate: { family: 'round', canopy: ['#4a9e57', '#357d42', '#7cc96f'], trunk: '#6b4423', fruit: '#d6324a', fruitR: 5 },
  fig:         { family: 'round', canopy: ['#5aa653', '#3f8540', '#86cf73'], trunk: '#6f5234', fruit: '#7c4a86', fruitR: 5 },
  lemon:       { family: 'round', canopy: ['#57a64d', '#3f8a3a', '#8fcf6f'], trunk: '#6b4423', fruit: '#f4d03f', fruitR: 5 },
  cherry:      { family: 'round', canopy: ['#f7b7d2', '#e98fbb', '#ffd9ea'], trunk: '#6b4423', fruit: '#e8567f', fruitR: 4 },
  pine:        { family: 'pine',  canopy: ['#2f7d57', '#1f5d40', '#4fa377'], trunk: '#5b3a22', fruit: null,      fruitR: 0 },
  birch:       { family: 'birch', canopy: ['#8fc879', '#6fae5c', '#b6e29a'], trunk: '#e7e3d8', fruit: null,      fruitR: 0 },
  palm:        { family: 'palm',  canopy: ['#4fae5a', '#379244', '#79c96f'], trunk: '#b98a4e', fruit: '#8a5a2b', fruitR: 4 },
};

// Variety unlocks as the grove grows: the first trees are humble, exotic species
// appear deeper in the garden — so "different kinds with time" falls out naturally.
const UNLOCK = [
  ['oak', 'olive'],
  ['oak', 'olive', 'pine', 'fig'],
  ['oak', 'olive', 'pine', 'fig', 'birch', 'pomegranate'],
  ['oak', 'olive', 'pine', 'fig', 'birch', 'pomegranate', 'lemon', 'palm', 'cherry'],
];

function speciesKey(i, rng) {
  const tier = i < 4 ? 0 : i < 9 ? 1 : i < 17 ? 2 : 3;
  const set = UNLOCK[tier];
  return set[Math.floor(rng() * set.length)];
}

// Three depth bands fake perspective: far trees sit higher, smaller, hazier.
const BANDS = [
  { depth: 0, scale: 0.72, lift: -30, alpha: 0.85, haze: 0.30 }, // far
  { depth: 1, scale: 0.93, lift: 0,   alpha: 1,    haze: 0.10 }, // mid
  { depth: 2, scale: 1.14, lift: 24,  alpha: 1,    haze: 0 },    // near
];

function fruitPositions(n, rng) {
  const pos = [];
  for (let k = 0; k < n; k++) {
    const a = rng() * Math.PI * 2;
    const r = 0.32 + rng() * 0.56;
    pos.push({ ux: Math.cos(a) * r, uy: Math.sin(a) * r * 0.85 + 0.12 });
  }
  return pos;
}

function makeTree(i, xp) {
  const rng = makeRng(1000 + i * 73);
  const plantXp = i * GARDEN.xpPerTree;
  const age = Math.max(0, xp - plantXp);
  const growth = easeOut(clamp(age / GARDEN.matureXp, 0, 1));
  const key = speciesKey(i, rng);
  const sp = SPECIES[key];

  let fruit = 0;
  if (sp.fruit && growth > GARDEN.fruitStartFrac) {
    const fruitAge = age - GARDEN.matureXp * GARDEN.fruitStartFrac;
    fruit = clamp(Math.floor(fruitAge / GARDEN.fruitStepXp) + 1, 0, GARDEN.maxFruit);
  }

  const band = BANDS[Math.floor(rng() * BANDS.length)];
  const x = GARDEN.marginX + i * GARDEN.spacing + (rng() - 0.5) * 46;

  return {
    i, x, key, family: sp.family, growth, fruit,
    scale: band.scale, lift: band.lift, alpha: band.alpha, haze: band.haze, depth: band.depth,
    bark: 1.7 + rng() * 0.7, // canopy blob count multiplier
    swayPhase: rng() * Math.PI * 2,
    swaySpeed: 0.45 + rng() * 0.5,
    fruitPos: fruitPositions(GARDEN.maxFruit, makeRng(7000 + i * 31)),
    starter: false,
  };
}

const FLOWERS = ['tulip', 'daisy', 'poppy', 'lavender', 'rose', 'bush'];
const FLOWER_COLORS = {
  tulip: ['#ef5a8a', '#f59e0b', '#e0457a'],
  daisy: ['#fdfcf5', '#fff4cf'],
  poppy: ['#e23b3b', '#f0623b'],
  lavender: ['#a98fe0', '#8f76d6'],
  rose: ['#ef6f9a', '#e8467f', '#f5a3c0'],
  bush: ['#3f9d4f'],
};

function makeFlowers(width, count) {
  const rng = makeRng(55);
  const arr = [];
  for (let i = 0; i < count; i++) {
    const type = FLOWERS[Math.floor(rng() * FLOWERS.length)];
    const palette = FLOWER_COLORS[type];
    arr.push({
      x: 70 + rng() * Math.max(1, width - 140),
      lift: 6 + rng() * 30, // sit in the front grass band
      type,
      color: palette[Math.floor(rng() * palette.length)],
      scale: 0.7 + rng() * 0.6,
      swayPhase: rng() * Math.PI * 2,
    });
  }
  return arr;
}

function makeTufts(width) {
  const rng = makeRng(91);
  const arr = [];
  const n = Math.floor(width / 22);
  for (let i = 0; i < n; i++) {
    arr.push({
      x: i * 22 + rng() * 18,
      lift: -2 + rng() * 26,
      scale: 0.6 + rng() * 0.8,
      shade: rng(),
    });
  }
  return arr;
}

// Build the whole garden for a given XP total.
export function buildWorld(xp) {
  const x0 = Math.max(0, Math.floor(xp || 0));
  const numTrees = clamp(Math.floor(x0 / GARDEN.xpPerTree), 0, GARDEN.maxTrees);

  const trees = [];
  for (let i = 0; i < numTrees; i++) trees.push(makeTree(i, x0));

  // Always show a few tiny saplings so a brand-new garden still feels alive
  // (clearly just sprouting — this doesn't fake real progress).
  for (let i = numTrees; i < 3; i++) {
    const t = makeTree(i, GARDEN.xpPerTree * i + 8);
    t.growth = 0.06 + (i - numTrees) * 0.015;
    t.fruit = 0;
    t.starter = true;
    trees.push(t);
  }

  const lastX = trees.length ? trees[trees.length - 1].x : GARDEN.marginX;
  const width = lastX + GARDEN.marginX;

  const numFlowers = clamp(
    GARDEN.baseFlowers + Math.floor(x0 / GARDEN.flowerPerXp),
    GARDEN.baseFlowers,
    GARDEN.maxFlowers
  );

  return {
    trees,
    flowers: makeFlowers(width, numFlowers),
    tufts: makeTufts(width),
    width,
    numTrees,
    numFlowers,
  };
}
