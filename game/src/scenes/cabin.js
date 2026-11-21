// scenes/cabin.js — "Starlight Cabin", a snowy cabin under the aurora.
// Original art, drawn fresh on canvas.
import { circle, ellipse, line, pine, poly, rect, roundRect, sparkle, star, vgrad } from '../brush.js';
import { sceneRandom } from '../random.js';

const W = 640;
const H = 420;
const SNOW = '#eef4ff';
const SKY = '#12234a';

function drawSky(ctx, rng) {
  vgrad(ctx, 0, 0, W, 340, [[0, '#0d1b3d'], [0.6, '#274b7a'], [1, '#3a6a9e']]);
  // Aurora bands.
  ctx.fillStyle = 'rgba(90, 220, 160, 0.16)';
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.quadraticCurveTo(160, 20, 320, 58);
  ctx.quadraticCurveTo(480, 96, 640, 50);
  ctx.lineTo(640, 96);
  ctx.quadraticCurveTo(480, 140, 320, 100);
  ctx.quadraticCurveTo(160, 62, 0, 106);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(140, 160, 255, 0.12)';
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.quadraticCurveTo(200, 80, 420, 116);
  ctx.quadraticCurveTo(560, 138, 640, 112);
  ctx.lineTo(640, 150);
  ctx.quadraticCurveTo(420, 170, 200, 140);
  ctx.quadraticCurveTo(80, 128, 0, 148);
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i < 34; i++) {
    const x = 16 + rng() * 608;
    const y = 10 + rng() * 170;
    sparkle(ctx, x, y, 1.4 + rng() * 2, 'rgba(255, 255, 240, 0.95)');
  }
  // Moon.
  circle(ctx, 560, 60, 22, '#fdf6d8');
}

function drawGround(ctx) {
  ctx.fillStyle = SNOW;
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(200, 312, 400, 328);
  ctx.quadraticCurveTo(540, 340, 640, 322);
  ctx.lineTo(640, 420);
  ctx.lineTo(0, 420);
  ctx.closePath();
  ctx.fill();
  // Footprints from the door toward the viewer.
  ctx.fillStyle = '#c9d6ee';
  const prints = [[392, 348], [404, 360], [416, 372], [428, 384], [440, 396]];
  for (const [x, y] of prints) ellipse(ctx, x, y, 7, 4, '#c9d6ee');
}

function drawFence(ctx) {
  ctx.fillStyle = '#7a5230';
  for (const x of [60, 140, 220, 300, 560]) rect(ctx, x - 4, 348, 8, 34, '#7a5230');
  rect(ctx, 40, 352, 540, 6, '#8a6238');
  rect(ctx, 40, 368, 540, 6, '#8a6238');
}

function drawCabin(ctx) {
  // Walls, snowy roof, chimney.
  rect(ctx, 240, 220, 160, 100, '#8a5a34');
  rect(ctx, 240, 220, 160, 10, '#6e4525');
  poly(ctx, [[228, 222], [412, 222], [320, 158]], '#5a3a22');
  poly(ctx, [[228, 222], [412, 222], [320, 158]], '#5a3a22');
  // Snow cap on the roof.
  ctx.fillStyle = SNOW;
  ctx.beginPath();
  ctx.moveTo(228, 222);
  ctx.lineTo(412, 222);
  ctx.lineTo(320, 158);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a3a22';
  ctx.beginPath();
  ctx.moveTo(246, 210);
  ctx.lineTo(394, 210);
  ctx.lineTo(320, 162);
  ctx.closePath();
  ctx.fill();
  // Chimney with smoke.
  rect(ctx, 366, 150, 20, 44, '#7a4a30');
  rect(ctx, 362, 146, 28, 8, '#5a3520');
  ctx.fillStyle = 'rgba(240, 240, 245, 0.85)';
  circle(ctx, 380, 132, 9, 'rgba(240, 240, 245, 0.85)');
  circle(ctx, 388, 116, 11, 'rgba(240, 240, 245, 0.8)');
  circle(ctx, 380, 98, 13, 'rgba(240, 240, 245, 0.7)');
  // Door with a wreath.
  rect(ctx, 300, 262, 40, 58, '#5a3520');
  circle(ctx, 320, 288, 13, '#2e7d4f');
  circle(ctx, 320, 288, 6, '#5a3520');
  circle(ctx, 320, 277, 3, '#e23a2e');
  circle(ctx, 331, 292, 3, '#e23a2e');
  circle(ctx, 309, 292, 3, '#ffd23a');
  circle(ctx, 334, 268, 3, '#ffd23a');
  // Windows, warmly lit.
  for (const wx of [256, 352]) {
    rect(ctx, wx, 236, 34, 30, '#ffd97a');
    line(ctx, wx + 17, 236, wx + 17, 266, '#5a3520', 3);
    line(ctx, wx, 251, wx + 34, 251, '#5a3520', 3);
    rect(ctx, wx - 3, 233, 40, 36, 'rgba(0,0,0,0)');
    ctx.strokeStyle = '#5a3520';
    ctx.lineWidth = 3;
    ctx.strokeRect(wx - 1, 235, 36, 32);
  }
}

function drawSnowman(ctx) {
  circle(ctx, 480, 356, 26, '#ffffff');
  circle(ctx, 480, 318, 19, '#ffffff');
  circle(ctx, 474, 312, 2.5, '#1d1420');
  circle(ctx, 486, 312, 2.5, '#1d1420');
  poly(ctx, [[480, 318], [506, 322], [480, 324]], '#ff7a2a');
  line(ctx, 456, 344, 434, 330, '#5a3a22', 3);
  line(ctx, 504, 344, 526, 330, '#5a3a22', 3);
  circle(ctx, 480, 344, 3, '#1d1420');
  circle(ctx, 480, 356, 3, '#1d1420');
}

function drawBase(ctx, rng) {
  drawSky(ctx, rng);
  drawGround(ctx);
  pine(ctx, 120, 330, 130, '#1e5c3a');
  pine(ctx, 560, 326, 100, '#256b44');
  pine(ctx, 60, 336, 84, '#1e5c3a');
  // Ornaments on the big pine.
  circle(ctx, 108, 268, 4, '#ffd23a');
  circle(ctx, 132, 288, 4, '#e23a2e');
  circle(ctx, 120, 306, 4, '#ffd23a');
  drawFence(ctx);
  drawCabin(ctx);
  drawSnowman(ctx);
}

const DIFFS = [
  {
    id: 'window-dark',
    x: 273, y: 251, r: 17,
    hint: 'One cabin window went dark.',
    apply(ctx) { rect(ctx, 256, 236, 34, 30, '#22345c'); },
  },
  {
    id: 'smoke-puff',
    x: 396, y: 88, r: 22,
    hint: 'An extra puff of smoke above the chimney.',
    apply(ctx) { circle(ctx, 396, 88, 10, 'rgba(240, 240, 245, 0.75)'); },
  },
  {
    id: 'carrot-gone',
    x: 493, y: 321, r: 12,
    hint: 'The snowman lost its carrot nose.',
    apply(ctx) { poly(ctx, [[480, 318], [506, 322], [480, 324]], '#ffffff'); },
  },
  {
    id: 'star-extra',
    x: 150, y: 70, r: 12,
    hint: 'A new star appeared in the sky.',
    apply(ctx) { sparkle(ctx, 150, 70, 5, '#fffbe0'); },
  },
  {
    id: 'ornament-red',
    x: 108, y: 268, r: 14,
    hint: 'An ornament on the pine changed colour.',
    apply(ctx) { circle(ctx, 108, 268, 4, '#e23a2e'); },
  },
  {
    id: 'fence-post',
    x: 220, y: 365, r: 14,
    hint: 'A fence post is missing.',
    apply(ctx) {
      rect(ctx, 216, 348, 8, 34, SNOW);
      // The rails still run across where the post was.
      rect(ctx, 216, 352, 8, 6, '#8a6238');
      rect(ctx, 216, 368, 8, 6, '#8a6238');
    },
  },
  {
    id: 'moon-crater',
    x: 560, y: 60, r: 11,
    hint: 'A crater appeared on the moon.',
    apply(ctx) { circle(ctx, 554, 54, 5, '#d8cba0'); },
  },
  {
    id: 'wreath-gone',
    x: 320, y: 288, r: 16,
    hint: 'The wreath on the door is gone.',
    apply(ctx) {
      circle(ctx, 320, 288, 13, '#5a3520');
      // The gold dot above the wreath is on the door, not the wreath.
      circle(ctx, 334, 268, 3, '#ffd23a');
    },
  },
  {
    id: 'footprint-extra',
    x: 452, y: 402, r: 14,
    hint: 'An extra footprint in the snow.',
    apply(ctx) { ellipse(ctx, 452, 402, 7, 4, '#c9d6ee'); },
  },
];

export const SCENE = {
  id: 'cabin',
  name: 'Starlight Cabin',
  blurb: 'A snowy cabin, aurora skies and a snowman guarding the door.',
  timeLimit: 210,
  diffs: DIFFS,
  draw(ctx, applied) {
    const rng = sceneRandom('cabin');
    drawBase(ctx, rng);
    for (const d of DIFFS) if (applied.has(d.id)) d.apply(ctx);
  },
};
