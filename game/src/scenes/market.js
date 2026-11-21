// scenes/market.js — "Pasar Senja", a dusk night market.
// Original art, drawn fresh on canvas: stalls, lanterns, a cat, the moon.
import { circle, ellipse, lantern, line, poly, rect, roundRect, sparkle, vgrad } from '../brush.js';
import { sceneRandom } from '../random.js';

const W = 640;
const H = 420;
const GROUND = '#6b4a3a';
const SKY_TOP = '#2b1b4d';

function drawSky(ctx, rng) {
  vgrad(ctx, 0, 0, W, 300, [[0, '#241640'], [0.55, '#7a3a72'], [1, '#e07a4a']]);
  for (let i = 0; i < 26; i++) {
    const x = 20 + rng() * 600;
    const y = 12 + rng() * 150;
    sparkle(ctx, x, y, 1.5 + rng() * 2.2, 'rgba(255, 240, 200, 0.9)');
  }
  // Crescent moon: full disc, then a sky-coloured bite taken out.
  circle(ctx, 545, 62, 26, '#ffeec2');
  const bite = ctx.createLinearGradient(0, 33, 0, 79);
  bite.addColorStop(0, '#2e1c4b');
  bite.addColorStop(1, '#5e3268');
  ctx.fillStyle = bite;
  ctx.beginPath();
  ctx.arc(554, 56, 23, 0, Math.PI * 2);
  ctx.fill();
}

function drawRooftops(ctx) {
  ctx.fillStyle = '#241533';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(0, 252);
  ctx.lineTo(70, 252);
  ctx.lineTo(110, 226);
  ctx.lineTo(150, 252);
  ctx.lineTo(240, 252);
  ctx.lineTo(240, 236);
  ctx.lineTo(300, 236);
  ctx.lineTo(360, 262);
  ctx.lineTo(470, 262);
  ctx.lineTo(520, 238);
  ctx.lineTo(560, 262);
  ctx.lineTo(640, 262);
  ctx.lineTo(640, 300);
  ctx.closePath();
  ctx.fill();
}

function drawBunting(ctx) {
  // Sagging string with triangle flags.
  ctx.strokeStyle = '#2c1c12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, 34);
  ctx.quadraticCurveTo(320, 92, 630, 30);
  ctx.stroke();
  const flags = ['#ff5a4e', '#ffb13a', '#3ec6a7', '#ff8fb0', '#ffd23a', '#7ab8ff'];
  for (let i = 0; i < 12; i++) {
    const t = (i + 0.5) / 12;
    const x = 10 + t * 620;
    const y = 34 + Math.sin(t * Math.PI) * 44 + (t < 0.5 ? t * 14 : (1 - t) * 14);
    poly(ctx, [[x - 11, y], [x + 11, y], [x, y + 22]], flags[i % flags.length]);
  }
}

function awning(ctx, x, y, w, colors) {
  const stripes = 6;
  for (let i = 0; i < stripes; i++) {
    rect(ctx, x + (i * w) / stripes, y, w / stripes, 26, colors[i % 2]);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(x, y + 26, w, 5);
}

function drawStall(ctx, x, w, awningColors, goods) {
  // Counter and posts.
  rect(ctx, x, 296, w, 10, '#4a2f1d');
  rect(ctx, x + 6, 306, 10, 34, '#3a2413');
  rect(ctx, x + w - 16, 306, 10, 34, '#3a2413');
  rect(ctx, x - 4, 292, w + 8, 8, '#7a5230');
  awning(ctx, x - 6, 196, w + 12, awningColors);
  line(ctx, x + 4, 222, x + 4, 292, '#3a2413', 5);
  line(ctx, x + w - 4, 222, x + w - 4, 292, '#3a2413', 5);
  goods(x, w);
}

function drawGround(ctx, rng) {
  rect(ctx, 0, 300, W, 120, GROUND);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 4; row++) {
    const y = 318 + row * 26;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    for (let col = 0; col < 9; col++) {
      const x = ((col * 73 + row * 37) % 640) + 8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 24);
      ctx.stroke();
    }
  }
  void rng;
}

function drawCat(ctx) {
  // Sitting cat silhouette between the stalls.
  ctx.fillStyle = '#1d1420';
  ellipse(ctx, 300, 344, 15, 13, '#1d1420');
  circle(ctx, 300, 322, 10, '#1d1420');
  poly(ctx, [[292, 314], [296, 302], [300, 313]], '#1d1420');
  poly(ctx, [[300, 313], [304, 302], [308, 314]], '#1d1420');
  // Amber eyes so the cat reads against the dusk ground.
  circle(ctx, 296, 320, 1.8, '#ffd23a');
  circle(ctx, 304, 320, 1.8, '#ffd23a');
  ctx.strokeStyle = '#1d1420';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(314, 340, 9, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
}

function drawBase(ctx, rng) {
  drawSky(ctx, rng);
  drawRooftops(ctx);
  drawGround(ctx, rng);
  drawBunting(ctx);
  // Hanging lanterns under the bunting.
  lantern(ctx, 150, 128, 15, '#ff5a4e');
  lantern(ctx, 300, 138, 17, '#ffb13a');
  lantern(ctx, 430, 128, 15, '#ff5a4e');
  lantern(ctx, 560, 122, 14, '#3ec6a7');
  drawStall(ctx, 40, 160, ['#d9382b', '#fff3e0'], (sx) => {
    circle(ctx, sx + 30, 282, 9, '#ff7a2a');
    circle(ctx, sx + 52, 284, 9, '#ff7a2a');
    circle(ctx, sx + 74, 282, 9, '#e23a2e');
    circle(ctx, sx + 96, 284, 9, '#e23a2e');
    circle(ctx, sx + 118, 282, 9, '#7ac74f');
  });
  drawStall(ctx, 250, 160, ['#0f8a7a', '#fff3e0'], (sx) => {
    roundRect(ctx, sx + 26, 268, 22, 24, 4, '#c98a4b');
    roundRect(ctx, sx + 58, 262, 26, 30, 4, '#7a5ac6');
    roundRect(ctx, sx + 94, 270, 20, 22, 4, '#c65a7a');
    roundRect(ctx, sx + 124, 264, 22, 28, 4, '#3a9ac6');
  });
  drawStall(ctx, 450, 160, ['#e8a91c', '#fff3e0'], (sx) => {
    ellipse(ctx, sx + 34, 284, 20, 12, '#b98a4b');
    ellipse(ctx, sx + 78, 284, 22, 12, '#a5763a');
    ellipse(ctx, sx + 122, 284, 20, 12, '#c9a45c');
  });
  drawCat(ctx);
  // Warm glow pools under the lanterns.
  ctx.fillStyle = 'rgba(255, 190, 90, 0.10)';
  ellipse(ctx, 150, 330, 60, 14, 'rgba(255, 190, 90, 0.10)');
  ellipse(ctx, 430, 330, 60, 14, 'rgba(255, 190, 90, 0.10)');
}

const DIFFS = [
  {
    id: 'moon-full',
    x: 545, y: 62, r: 30,
    hint: 'Look at the moon.',
    apply(ctx) { circle(ctx, 545, 62, 26, '#ffeec2'); },
  },
  {
    id: 'cat-gone',
    x: 300, y: 336, r: 26,
    hint: 'Something furry is missing from the ground.',
    apply(ctx) {
      ellipse(ctx, 300, 338, 22, 16, GROUND);
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(282, 344); ctx.lineTo(318, 344); ctx.stroke();
    },
  },
  {
    id: 'lantern-green',
    x: 430, y: 128, r: 20,
    hint: 'One lantern changed colour.',
    apply(ctx) { lantern(ctx, 430, 128, 15, '#3ec6a7'); },
  },
  {
    id: 'flag-blue',
    x: 294, y: 95, r: 16,
    hint: 'A flag on the string is a different colour.',
    apply(ctx) { poly(ctx, [[283, 84], [305, 84], [294, 106]], '#3a6fd8'); },
  },
  {
    id: 'awning-stripe',
    x: 106, y: 209, r: 18,
    hint: 'A stripe on the left awning changed.',
    apply(ctx) { rect(ctx, 91, 196, 29, 26, '#0f8a7a'); },
  },
];

export const SCENE = {
  id: 'market',
  name: 'Pasar Senja',
  blurb: 'A dusk market full of lanterns, fruit and one very patient cat.',
  timeLimit: 150,
  diffs: DIFFS,
  draw(ctx, applied) {
    const rng = sceneRandom('market');
    drawBase(ctx, rng);
    for (const d of DIFFS) if (applied.has(d.id)) d.apply(ctx);
  },
};
