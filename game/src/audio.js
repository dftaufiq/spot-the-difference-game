// audio.js — all sounds are synthesised live with WebAudio.
// No audio files, no network: every note is an original oscillator tone.
const NOTES = {
  found: [659.25, 880.0],
  win: [523.25, 659.25, 783.99, 1046.5],
  hint: [1174.66, 1567.98],
  wrong: [110.0],
  click: [440.0],
  tick: [1200.0],
};

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicTimer = null;
    this.musicStep = 0;
  }

  unlock() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted) this.stopMusic();
    else this.startMusic();
  }

  tone(freq, at, dur, type, gain) {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(gain, at + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  }

  play(name) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime + 0.02;
    const seq = NOTES[name];
    if (!seq) return;
    if (name === 'wrong') {
      this.tone(seq[0], now, 0.22, 'sawtooth', 0.12);
      return;
    }
    if (name === 'tick' || name === 'click') {
      this.tone(seq[0], now, 0.06, 'sine', 0.08);
      return;
    }
    seq.forEach((freq, i) => {
      this.tone(freq, now + i * 0.09, 0.28, name === 'hint' ? 'triangle' : 'sine', 0.14);
    });
  }

  // A quiet generative music-box loop on the pentatonic scale.
  startMusic() {
    if (!this.ctx || this.muted || this.musicTimer) return;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const pattern = [0, 2, 4, 3, 5, 4, 2, 1];
    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime + 0.02;
      const note = scale[pattern[this.musicStep % pattern.length]];
      this.tone(note, now, 0.9, 'sine', 0.035);
      if (this.musicStep % 4 === 2) this.tone(note / 2, now, 1.2, 'triangle', 0.02);
      this.musicStep += 1;
    }, 620);
  }

  stopMusic() {
    if (this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}
