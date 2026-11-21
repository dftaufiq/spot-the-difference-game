// random.js — small seeded random number generator.
// Every scene is drawn from one fixed seed, so the left and right panels
// are pixel-identical until a difference is applied on the right.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A fresh generator for one scene, seeded from the scene id.
export function sceneRandom(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return mulberry32(h);
}

export function range(rng, min, max) {
  return min + rng() * (max - min);
}

export function pick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}

export function chance(rng, p) {
  return rng() < p;
}
