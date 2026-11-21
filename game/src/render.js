// render.js — draws the two panels, the markers, the hint ring,
// the keyboard reticle and the wrong-click flash, every animation frame.
export class Renderer {
  constructor(leftCanvas, rightCanvas) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.lctx = leftCanvas.getContext('2d');
    this.rctx = rightCanvas.getContext('2d');
  }

  draw(scene, state, now) {
    const all = new Set(scene.diffs.map((d) => d.id));
    scene.draw(this.lctx, new Set());
    scene.draw(this.rctx, all);
    for (const diff of scene.diffs) {
      if (state.found.has(diff.id)) {
        this.drawFound(this.lctx, diff, now);
        this.drawFound(this.rctx, diff, now);
      }
    }
    if (state.hinted && now < state.hintUntil) {
      this.drawHint(this.lctx, state.hinted, now);
      this.drawHint(this.rctx, state.hinted, now);
    }
    if (state.wrong && now < state.wrongUntil) {
      const alpha = 1 - (now - state.wrongAt) / 450;
      this.drawWrong(this.lctx, state.wrong, alpha);
      this.drawWrong(this.rctx, state.wrong, alpha);
    }
    if (state.reticle) {
      this.drawReticle(this.lctx, state.reticle);
      this.drawReticle(this.rctx, state.reticle);
    }
  }

  drawFound(ctx, diff, now) {
    const pulse = 1 + 0.08 * Math.sin(now / 180);
    const r = diff.r * pulse;
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r + 4, 0, Math.PI * 2);
    ctx.stroke();
    // Check mark.
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(diff.x - 8, diff.y);
    ctx.lineTo(diff.x - 2, diff.y + 6);
    ctx.lineTo(diff.x + 9, diff.y - 6);
    ctx.stroke();
  }

  drawHint(ctx, diff, now) {
    const pulse = 1 + 0.18 * Math.sin(now / 140);
    ctx.strokeStyle = '#ffb13a';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r * pulse + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawWrong(ctx, point, alpha) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = '#ff4d4d';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    const s = 10;
    ctx.beginPath();
    ctx.moveTo(point.x - s, point.y - s);
    ctx.lineTo(point.x + s, point.y + s);
    ctx.moveTo(point.x + s, point.y - s);
    ctx.lineTo(point.x - s, point.y + s);
    ctx.stroke();
    ctx.restore();
  }

  drawReticle(ctx, point) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(point.x - 18, point.y);
    ctx.lineTo(point.x - 6, point.y);
    ctx.moveTo(point.x + 6, point.y);
    ctx.lineTo(point.x + 18, point.y);
    ctx.moveTo(point.x, point.y - 18);
    ctx.lineTo(point.x, point.y - 6);
    ctx.moveTo(point.x, point.y + 6);
    ctx.lineTo(point.x, point.y + 18);
    ctx.stroke();
  }
}
