// brush.js — shared canvas drawing helpers for the three scenes.
// Every helper draws flat, poster-style shapes so a "missing" difference
// can be painted over cleanly with the local background colour.
export function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

export function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Four-point sparkle star.
export function sparkle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// Five-point star.
export function star(ctx, x, y, r, fill, rot = -Math.PI / 2) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = rot + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// Vertical gradient fill for a whole rectangle.
export function vgrad(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

// A paper lantern: round body, caps, glow and hanging string.
export function lantern(ctx, x, y, r, body, glow = true) {
  line(ctx, x, y - r - 14, x, y - r + 2, '#3a2a1a', 2);
  if (glow) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.1);
    g.addColorStop(0, 'rgba(255, 190, 90, 0.30)');
    g.addColorStop(1, 'rgba(255, 190, 90, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ellipse(ctx, x, y, r, r * 0.86, body);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 2;
  for (const dy of [-r * 0.45, 0, r * 0.45]) {
    ctx.beginPath();
    ctx.ellipse(x, y + dy, r * 0.82, r * 0.1, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  rect(ctx, x - r * 0.28, y - r - 5, r * 0.56, 6, '#8a6d3b');
  rect(ctx, x - r * 0.28, y + r - 1, r * 0.56, 6, '#8a6d3b');
  line(ctx, x, y + r + 5, x, y + r + 13, '#d8a13a', 2);
}

// A pine tree: stacked triangles on a trunk.
export function pine(ctx, x, y, h, green, snow = true) {
  rect(ctx, x - 4, y - 12, 8, 14, '#5a3a22');
  const w = h * 0.52;
  for (let i = 0; i < 3; i++) {
    const ty = y - 10 - (i * h) / 3.4;
    const tw = w * (1 - i * 0.26);
    poly(ctx, [[x - tw / 2, ty], [x + tw / 2, ty], [x, ty - h / 2.6]], green);
    if (snow) {
      poly(
        ctx,
        [[x - tw * 0.22, ty - h * 0.13], [x + tw * 0.22, ty - h * 0.13], [x, ty - h * 0.26]],
        '#f4f8ff',
      );
    }
  }
}

// A simple fish, facing left or right.
export function fish(ctx, x, y, len, body, dir = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ellipse(ctx, 0, 0, len / 2, len * 0.26, body);
  poly(ctx, [[-len / 2 + 2, 0], [-len * 0.78, -len * 0.24], [-len * 0.78, len * 0.24]], body);
  circle(ctx, len * 0.22, -len * 0.06, len * 0.05, '#10222e');
  ctx.restore();
}
