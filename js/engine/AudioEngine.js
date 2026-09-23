/**
 * FC CHAMPIONS MOBILE - Procedural Web Audio Engine
 * High-fidelity stadium acoustics, referee whistles, kicks, crowd chants, and UI sounds.
 */

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.crowdGain = null;
    this.crowdNode = null;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      // Audio policy restricted until user click
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.crowdGain) {
      this.crowdGain.gain.value = this.isMuted ? 0 : 0.04;
    }
    return this.isMuted;
  }

  // --- Sound Effects ---

  playWhistle(isDouble = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const playBurst = (startTime, dur) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const mod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2800, startTime);
      osc.frequency.exponentialRampToValueAtTime(3200, startTime + dur * 0.5);

      // Tremolo/shiver effect for metal referee whistle
      mod.type = 'sine';
      mod.frequency.setValueAtTime(45, startTime);
      modGain.gain.setValueAtTime(400, startTime);
      mod.connect(osc.frequency);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      mod.start(startTime);
      osc.start(startTime);
      mod.stop(startTime + dur);
      osc.stop(startTime + dur);
    };

    playBurst(now, 0.35);
    if (isDouble) {
      playBurst(now + 0.22, 0.45);
    }
  }

  playKick(power = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Deep leather impact thump
    osc.type = 'sine';
    const startFreq = 160 + power * 60;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    const vol = Math.min(0.35, 0.12 + power * 0.18);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playNetHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // White noise swoosh for net ripple
    const now = this.ctx.currentTime;
    const bufSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  playGoalCheer() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Stadium horn fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });

    // Roaring crowd surge
    const bufSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
    }

    const crowd = this.ctx.createBufferSource();
    crowd.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.5);
    filter.frequency.exponentialRampToValueAtTime(400, now + 1.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    crowd.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    crowd.start(now);
  }

  playPackReveal(isIcon = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Chime sweep
    const count = isIcon ? 8 : 5;
    for (let i = 0; i < count; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 * Math.pow(1.2, i), now + i * 0.06);

      gain.gain.setValueAtTime(0, now + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.45);
    }
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playTackle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }
}
