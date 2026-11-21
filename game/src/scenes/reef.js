// scenes/reef.js — "Coral Garden", a reef full of fish, coral and one treasure chest.
// Original art, drawn fresh on canvas.
import { circle, ellipse, fish, line, poly, rect, roundRect, sparkle, star, vgrad } from '../brush.js';
import { sceneRandom } from '../random.js';

const W = 640;
const H = 420;

function drawWater(ctx, rng) {
  vgrad(ctx, 0, 0, W, H, [[0, '#1890b8'], [0.55, '#0d6a8c'], [1, '#0a4a68']]);
  // Light rays from the surface.
  ctx.fillStyle = 'rgba(255, 255, 220, 0.07)';
  for (let i = 0; i < 5; i++) {
    const x = 60 + i * 120 + rng() * 30;
    poly(ctx, [[x, 0], [x + 46, 0], [x + 110, 420], [x + 30, 420]], 'rgba(255, 255, 220, 0.07)');
  }
  // Sandy floor.
  ctx.fillStyle = '#e8d5a0';
  ctx.beginPath();
  ctx.moveTo(0, 352);
  ctx.quadraticCurveTo(160, 336, 320, 350);
  ctx.quadraticCurveTo(480, 364, 640, 348);
  ctx.lineTo(640, 420);
  ctx.lineTo(0, 420);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(160, 120, 60, 0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const y = 372 + i * 8;
    ctx.beginPath();
    ctx.moveTo(30 + i * 12, y);
    ctx.quadraticCurveTo(220, y - 6, 420, y + 2);
    ctx.stroke();
  }
}

function coralBranch(ctx, x, y, len, ang, color, width) {
  const x2 = x + Math.cos(ang) * len;
  const y2 = y + Math.sin(ang) * len;
  line(ctx, x, y, x2, y2, color, width);
  return [x2, y2];
}

function drawCoral(ctx, x, y, color, scale) {
  // Branching coral: a trunk that splits three ways.
  const tips = [];
  let p = coralBranch(ctx, x, y, 46 * scale, -Math.PI / 2, color, 9);
  tips.push(coralBranch(ctx, p[0], p[1], 34 * scale, -Math.PI / 2 - 0.5, color, 6));
  tips.push(coralBranch(ctx, p[0], p[1], 36 * scale, -Math.PI / 2 + 0.4, color, 6));
  tips.push(coralBranch(ctx, p[0], p[1], 26 * scale, -Math.PI / 2, color, 6));
  for (const [tx, ty] of tips) circle(ctx, tx, ty, 6 * scale, color);
  circle(ctx, p[0], p[1], 5 * scale, color);
}

function drawSeaweed(ctx, x, y, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 12, y - h * 0.55, x + 6, y - h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 12, y);
  ctx.quadraticCurveTo(x + 22, y - h * 0.5, x + 10, y - h * 0.85);
  ctx.stroke();
}

function drawFishSchool(ctx, rng) {
  const school = [
    { x: 150, y: 120, len: 44, c: '#ffb13a', d: 1 },
    { x: 230, y: 90, len: 38, c: '#ff7a6b', d: 1 },
    { x: 320, y: 170, len: 52, c: '#3ec6a7', d: -1 },
    { x: 420, y: 100, len: 40, c: '#c98aff', d: -1 },
    { x: 90, y: 210, len: 36, c: '#ffd23a', d: 1 },
  ];
  for (const f of school) fish(ctx, f.x, f.y, f.len, f.c, f.d);
  void rng;
}

function drawBubbles(ctx) {
  const bubbles = [[300, 120, 6], [316, 96, 4], [290, 84, 5], [540, 200, 5], [180, 150, 4]];
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 1.5;
  for (const [x, y, r] of bubbles) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawChest(ctx, open) {
  // Treasure chest on the sand, right side.
  roundRect(ctx, 492, 348, 62, 30, 5, '#7a4a22');
  rect(ctx, 492, 348, 62, 8, '#9a6232');
  rect(ctx, 518, 348, 10, 30, '#d8a13a');
  if (open) {
    ctx.save();
    ctx.translate(492, 348);
    ctx.rotate(-0.9);
    roundRect(ctx, 0, -20, 62, 20, 8, '#8a5526');
    ctx.restore();
    circle(ctx, 512, 344, 5, '#ffd23a');
    circle(ctx, 524, 346, 4, '#ffd23a');
    circle(ctx, 536, 344, 5, '#ff9a3a');
    circle(ctx, 546, 347, 4, '#ffd23a');
  } else {
    ctx.fillStyle = '#8a5526';
    ctx.beginPath();
    ctx.arc(523, 348, 31, Math.PI, 0);
    ctx.fill();
    rect(ctx, 518, 340, 10, 8, '#d8a13a');
  }
}

function drawClam(ctx, withPearl) {
  ellipse(ctx, 200, 372, 26, 12, '#e8a0b8');
  ellipse(ctx, 200, 366, 20, 9, '#f7c9d8');
  if (withPearl) circle(ctx, 200, 360, 6, '#ffffff');
}

function drawBase(ctx, rng) {
  drawWater(ctx, rng);
  drawSeaweed(ctx, 80, 352, 70, '#2e9e6b');
  drawSeaweed(ctx, 340, 356, 56, '#2e9e6b');
  drawSeaweed(ctx, 610, 350, 64, '#37b878');
  drawCoral(ctx, 450, 352, '#ff7a9e', 1);
  drawCoral(ctx, 90, 356, '#ff9a3a', 0.85);
  drawCoral(ctx, 566, 352, '#b07aff', 0.9);
  drawFishSchool(ctx, rng);
  drawBubbles(ctx);
  star(ctx, 120, 388, 14, '#ff8a3a');
  drawChest(ctx, false);
  drawClam(ctx, true);
}

const DIFFS = [
  {
    id: 'fish-extra',
    x: 500, y: 150, r: 22,
    hint: 'A new fish swam in on the right.',
    apply(ctx) { fish(ctx, 500, 150, 40, '#ffe14d', -1); },
  },
  {
    id: 'starfish-purple',
    x: 120, y: 388, r: 18,
    hint: 'The starfish on the sand changed colour.',
    apply(ctx) { star(ctx, 120, 388, 14, '#b07aff'); },
  },
  {
    id: 'bubble-big',
    x: 300, y: 120, r: 14,
    hint: 'One bubble grew much bigger.',
    apply(ctx) {
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(300, 120, 12, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  {
    id: 'coral-orange',
    x: 468, y: 296, r: 22,
    hint: 'A coral branch changed colour.',
    apply(ctx) {
      line(ctx, 450, 306, 468, 272, '#ff9a3a', 6);
      circle(ctx, 468, 272, 6, '#ff9a3a');
    },
  },
  {
    id: 'gold-spill',
    x: 523, y: 386, r: 26,
    hint: 'Gold coins spilled out in front of the chest.',
    apply(ctx) {
      circle(ctx, 506, 384, 6, '#ffd23a');
      circle(ctx, 520, 390, 6, '#ff9a3a');
      circle(ctx, 534, 384, 6, '#ffd23a');
      circle(ctx, 546, 390, 5, '#ffd23a');
      sparkle(ctx, 520, 380, 5, '#fff6c9');
    },
  },
  {
    id: 'seaweed-purple',
    x: 86, y: 316, r: 20,
    hint: 'One seaweed blade turned purple.',
    apply(ctx) {
      ctx.strokeStyle = '#b07aff';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(80, 352);
      ctx.quadraticCurveTo(68, 313, 86, 282);
      ctx.stroke();
    },
  },
  {
    id: 'pearl-gone',
    x: 200, y: 360, r: 14,
    hint: 'The clam lost its pearl.',
    apply(ctx) { ellipse(ctx, 200, 364, 14, 7, '#f7c9d8'); },
  },
];

export const SCENE = {
  id: 'reef',
  name: 'Coral Garden',
  blurb: 'A reef of coral, fish and buried treasure — watch the bubbles.',
  timeLimit: 180,
  diffs: DIFFS,
  draw(ctx, applied) {
    const rng = sceneRandom('reef');
    drawBase(ctx, rng);
    for (const d of DIFFS) if (applied.has(d.id)) d.apply(ctx);
  },
};
