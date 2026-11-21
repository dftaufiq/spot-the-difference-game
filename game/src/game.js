// game.js — the state machine: menu, playing, level end, win, pause.
// Owns the score, combo, timer, hints and best-score persistence.
import { GAME_TITLE, HINTS_PER_LEVEL, LEVELS, SCORING, starsForLevel } from './config.js';
import { SoundBank } from './audio.js';
import { Renderer } from './render.js';
import { Input } from './input.js';

const $ = (id) => document.getElementById(id);

function bestKey(sceneId) {
  return `lanternlight-best-${sceneId}`;
}

export class Game {
  constructor() {
    this.sounds = new SoundBank();
    this.renderer = new Renderer($('panel-left'), $('panel-right'));
    this.input = new Input($('panel-left'), $('panel-right'), {
      onPick: (p) => this.pick(p),
      onMoveReticle: (dx, dy) => this.moveReticle(dx, dy),
      onConfirm: () => this.confirmReticle(),
      onHint: () => this.useHint(),
      onMute: () => this.toggleMute(),
      onPause: () => this.togglePause(),
      onRestart: () => this.restartLevel(),
      onNext: () => this.nextFromEnd(),
    });
    this.screen = 'menu';
    this.levelIndex = 0;
    this.scene = LEVELS[0];
    this.found = new Set();
    this.score = 0;
    this.combo = 0;
    this.misses = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = 0;
    this.hinted = null;
    this.hintUntil = 0;
    this.wrong = null;
    this.wrongAt = 0;
    this.wrongUntil = 0;
    this.reticle = null;
    this.paused = false;
    this.levelScores = [];
    this.levelStars = [];
    this.lastFrame = 0;
    this.tickSecond = -1;
  }

  start() {
    this.input.attach();
    this.buildMenu();
    this.bindButtons();
    this.showScreen('menu');
    this.sounds.unlock();
    const loop = (now) => {
      this.frame(now);
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
    // Debug handle for automated play-testing (used by the screenshots).
    window.LanternGame = { game: this, levels: LEVELS, title: GAME_TITLE };
  }

  bindButtons() {
    $('btn-hint').addEventListener('click', () => this.useHint());
    $('btn-mute').addEventListener('click', () => this.toggleMute());
    $('btn-pause').addEventListener('click', () => this.togglePause());
    $('btn-resume').addEventListener('click', () => this.togglePause());
    $('btn-quit').addEventListener('click', () => this.quitToMenu());
    $('btn-next').addEventListener('click', () => this.nextFromEnd());
    $('btn-replay').addEventListener('click', () => this.restartLevel());
    $('btn-end-menu').addEventListener('click', () => this.quitToMenu());
    $('btn-again').addEventListener('click', () => this.startRun(0));
    $('btn-win-menu').addEventListener('click', () => this.quitToMenu());
    document.querySelectorAll('[data-level]').forEach((el) => {
      el.addEventListener('click', () => this.startRun(Number(el.dataset.level)));
    });
  }

  buildMenu() {
    const host = $('level-list');
    host.innerHTML = '';
    LEVELS.forEach((scene, i) => {
      const best = Number(window.localStorage.getItem(bestKey(scene.id)) || 0);
      const card = document.createElement('button');
      card.className = 'level-card';
      card.dataset.level = String(i);
      card.innerHTML =
        `<span class="level-num">Level ${i + 1}</span>` +
        `<span class="level-name">${scene.name}</span>` +
        `<span class="level-blurb">${scene.blurb}</span>` +
        `<span class="level-meta">${scene.diffs.length} differences · ${scene.timeLimit}s</span>` +
        `<span class="level-best">${best ? '★'.repeat(best) + '☆'.repeat(3 - best) : 'Not played yet'}</span>`;
      host.appendChild(card);
    });
  }

  showScreen(name) {
    this.screen = name;
    for (const id of ['overlay-menu', 'overlay-end', 'overlay-win', 'overlay-paused']) {
      $(id).classList.toggle('hidden', id !== `overlay-${name}`);
    }
    $('hud').classList.toggle('hidden', name === 'menu');
    $('panels').classList.toggle('dimmed', name === 'menu');
  }

  startRun(levelIndex) {
    this.levelIndex = levelIndex;
    this.levelScores = [];
    this.levelStars = [];
    this.score = 0;
    this.startLevel(levelIndex);
  }

  startLevel(levelIndex) {
    this.levelIndex = levelIndex;
    this.scene = LEVELS[levelIndex];
    this.found = new Set();
    this.combo = 0;
    this.misses = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = this.scene.timeLimit;
    this.hinted = null;
    this.wrong = null;
    this.reticle = null;
    this.paused = false;
    this.tickSecond = -1;
    this.sounds.unlock();
    this.sounds.startMusic();
    this.updateHud();
    this.showScreen('play');
  }

  frame(now) {
    if (this.screen === 'play' && !this.paused) {
      if (this.lastFrame) {
        const dt = Math.min(0.25, (now - this.lastFrame) / 1000);
        this.timeLeft -= dt;
        const sec = Math.ceil(this.timeLeft);
        if (sec <= 10 && sec !== this.tickSecond && sec > 0) {
          this.tickSecond = sec;
          this.sounds.play('tick');
        }
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          this.updateHud();
          this.levelFailed();
        }
      }
      this.updateHud();
    }
    this.lastFrame = now;
    if (this.screen !== 'menu') {
      this.renderer.draw(this.scene, this, now);
    }
  }

  pick(point) {
    if (this.screen !== 'play' || this.paused) return;
    this.sounds.unlock();
    const diff = this.scene.diffs.find(
      (d) => !this.found.has(d.id) && Math.hypot(point.x - d.x, point.y - d.y) <= d.r,
    );
    if (diff) {
      this.found.add(diff.id);
      this.combo = Math.min(SCORING.maxCombo, this.combo + 1);
      const gained = SCORING.findBase + (this.combo - 1) * SCORING.comboStep;
      this.score += gained;
      this.sounds.play('found');
      this.toast(`+${gained} — found!`);
      if (this.found.size === this.scene.diffs.length) this.levelCleared();
    } else {
      this.combo = 0;
      this.misses += 1;
      this.score = Math.max(0, this.score - SCORING.wrongPenalty);
      this.wrong = point;
      this.wrongAt = performance.now();
      this.wrongUntil = this.wrongAt + 450;
      this.sounds.play('wrong');
      this.toast(`No difference there −${SCORING.wrongPenalty}`);
    }
    this.updateHud();
  }

  moveReticle(dx, dy) {
    if (this.screen !== 'play' || this.paused) return;
    if (!this.reticle) this.reticle = { x: 320, y: 210 };
    this.reticle.x = Math.max(10, Math.min(630, this.reticle.x + dx));
    this.reticle.y = Math.max(10, Math.min(410, this.reticle.y + dy));
  }

  confirmReticle() {
    if (this.screen === 'play' && this.reticle) this.pick({ ...this.reticle });
    else if (this.screen === 'end') this.nextFromEnd();
  }

  useHint() {
    if (this.screen !== 'play' || this.paused) return;
    if (this.hintsLeft <= 0) {
      this.toast('No hints left');
      return;
    }
    const remaining = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - SCORING.hintCost);
    this.hinted = pick;
    this.hintUntil = performance.now() + 3000;
    this.sounds.play('hint');
    this.toast(`Hint −${SCORING.hintCost}: ${pick.hint}`);
    this.updateHud();
  }

  toggleMute() {
    this.sounds.unlock();
    this.sounds.setMuted(!this.sounds.muted);
    $('btn-mute').textContent = this.sounds.muted ? '🔇 Muted' : '🔊 Sound';
  }

  togglePause() {
    if (this.screen !== 'play' && this.screen !== 'paused') return;
    this.paused = !this.paused;
    this.showScreen(this.paused ? 'paused' : 'play');
  }

  restartLevel() {
    this.startLevel(this.levelIndex);
  }

  quitToMenu() {
    this.sounds.stopMusic();
    this.buildMenu();
    this.showScreen('menu');
  }

  levelCleared() {
    const timeBonus = Math.round(this.timeLeft) * SCORING.timeBonusPerSecond;
    this.score += timeBonus;
    const stars = starsForLevel(this.misses, this.timeLeft, this.scene.timeLimit);
    this.levelScores[this.levelIndex] = this.score;
    this.levelStars[this.levelIndex] = stars;
    const prev = Number(window.localStorage.getItem(bestKey(this.scene.id)) || 0);
    if (stars > prev) window.localStorage.setItem(bestKey(this.scene.id), String(stars));
    this.sounds.play('win');
    $('end-title').textContent = `${this.scene.name} — cleared!`;
    $('end-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    $('end-stats').textContent =
      `Score ${this.score} (time bonus +${timeBonus}) · ${this.misses} miss${this.misses === 1 ? '' : 'es'}`;
    $('btn-next').textContent = this.levelIndex + 1 < LEVELS.length ? 'Next level →' : 'See results →';
    this.showScreen('end');
  }

  levelFailed() {
    this.sounds.play('wrong');
    this.levelScores[this.levelIndex] = this.score;
    $('end-title').textContent = `Time's up in ${this.scene.name}`;
    $('end-stars').textContent = '☆☆☆';
    $('end-stats').textContent = `You found ${this.found.size} of ${this.scene.diffs.length} differences. Try again!`;
    $('btn-next').textContent = 'Next level →';
    this.showScreen('end');
  }

  nextFromEnd() {
    if (this.screen !== 'end') return;
    if (this.levelIndex + 1 < LEVELS.length) {
      this.startLevel(this.levelIndex + 1);
    } else {
      this.showWin();
    }
  }

  showWin() {
    const total = this.levelScores.reduce((a, b) => a + (b || 0), 0);
    const stars = this.levelStars.reduce((a, b) => a + (b || 0), 0);
    $('win-score').textContent = `${total} points · ${stars} / 9 stars`;
    this.showScreen('win');
  }

  updateHud() {
    $('hud-level').textContent = `Level ${this.levelIndex + 1} · ${this.scene.name}`;
    $('hud-found').textContent = `${this.found.size} / ${this.scene.diffs.length} found`;
    $('hud-left').textContent = `${this.scene.diffs.length - this.found.size} left`;
    const total = Math.max(0, Math.ceil(this.timeLeft));
    const mm = String(Math.floor(total / 60)).padStart(1, '0');
    const ss = String(total % 60).padStart(2, '0');
    $('hud-time').textContent = `${mm}:${ss}`;
    $('time-bar').style.width = `${(this.timeLeft / this.scene.timeLimit) * 100}%`;
    $('time-bar').classList.toggle('urgent', this.timeLeft <= 15);
    $('hud-score').textContent = `${this.score} pts`;
    $('hud-combo').textContent = this.combo >= 2 ? `🔥 Combo ×${this.combo}` : '';
    $('btn-hint').textContent = `💡 Hint (${this.hintsLeft})`;
    $('btn-hint').disabled = this.hintsLeft <= 0;
  }

  toast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.remove('hidden');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => el.classList.add('hidden'), 2200);
  }
}
