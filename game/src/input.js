// input.js — mouse clicks on either panel and keyboard play.
// Clicking a difference on either panel counts; the keyboard moves a
// reticle and Enter/Space "clicks" where it points.
export class Input {
  constructor(leftCanvas, rightCanvas, handlers) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.handlers = handlers;
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  attach() {
    this.left.addEventListener('pointerdown', this.onPointerDown);
    this.right.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('keydown', this.onKeyDown);
  }

  detach() {
    this.left.removeEventListener('pointerdown', this.onPointerDown);
    this.right.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  toScene(canvas, clientX, clientY) {
    const box = canvas.getBoundingClientRect();
    return {
      x: ((clientX - box.left) / box.width) * canvas.width,
      y: ((clientY - box.top) / box.height) * canvas.height,
    };
  }

  onPointerDown(event) {
    const point = this.toScene(event.currentTarget, event.clientX, event.clientY);
    this.handlers.onPick(point);
  }

  onKeyDown(event) {
    const key = event.key.toLowerCase();
    const step = event.shiftKey ? 48 : 14;
    const moves = {
      arrowleft: [-step, 0], a: [-step, 0],
      arrowright: [step, 0], d: [step, 0],
      arrowup: [0, -step], w: [0, -step],
      arrowdown: [0, step], s: [0, step],
    };
    if (moves[key]) {
      event.preventDefault();
      this.handlers.onMoveReticle(moves[key][0], moves[key][1]);
      return;
    }
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      this.handlers.onConfirm();
      return;
    }
    if (key === 'h') { this.handlers.onHint(); return; }
    if (key === 'm') { this.handlers.onMute(); return; }
    if (key === 'p' || key === 'escape') { this.handlers.onPause(); return; }
    if (key === 'r') { this.handlers.onRestart(); return; }
    if (key === 'n') { this.handlers.onNext(); return; }
  }
}
