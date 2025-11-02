// @ts-check

const MUSIC_LOOPS = [
  { freq: 220, pattern: [0, 2, 4, 7] },
  { freq: 196, pattern: [0, 3, 5, 10] },
  { freq: 180, pattern: [0, 2, 5, 9] }
];

/**
 * @typedef {{master:number,music:number,sfx:number,enabled:boolean}} AudioSettings
 */

export class AudioManager {
  constructor() {
    /** @type {AudioContext | null} */
    this.context = null;
    /** @type {GainNode | null} */
    this.masterGain = null;
    /** @type {GainNode | null} */
    this.musicGain = null;
    /** @type {GainNode | null} */
    this.sfxGain = null;
    /** @type {number} */
    this.currentLoop = 0;
    /** @type {boolean} */
    this.musicPlaying = false;
    /** @type {AudioSettings} */
    this.settings = { master: 0.6, music: 0.4, sfx: 0.7, enabled: false };
    this.unlockCallbacks = [];
    this.musicSource = null;
  }

  tryInit() {
    if (this.context) return;
    try {
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.musicGain = this.context.createGain();
      this.sfxGain = this.context.createGain();
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);
      this.applySettings(this.settings);
      this.settings.enabled = true;
      this.unlockCallbacks.forEach((cb) => cb());
    } catch (err) {
      console.warn("Audio init failed", err);
    }
  }

  /**
   * @param {AudioSettings} settings
   */
  applySettings(settings) {
    this.settings = settings;
    if (!this.masterGain) return;
    this.masterGain.gain.value = settings.master;
    if (this.musicGain) this.musicGain.gain.value = settings.music;
    if (this.sfxGain) this.sfxGain.gain.value = settings.sfx;
  }

  pauseMusic(pause) {
    if (!this.context) return;
    if (pause) {
      this.musicGain && (this.musicGain.gain.value = 0);
    } else {
      this.musicGain && (this.musicGain.gain.value = this.settings.music);
    }
  }

  playMusic(loopIndex = 0) {
    if (!this.context || !this.musicGain) return;
    if (this.musicSource) {
      try {
        this.musicSource.stop();
      } catch (_) {}
    }
    this.currentLoop = loopIndex % MUSIC_LOOPS.length;
    const { freq, pattern } = MUSIC_LOOPS[this.currentLoop];
    const now = this.context.currentTime + 0.05;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "square";
    osc.connect(gain);
    gain.connect(this.musicGain);
    gain.gain.setValueAtTime(0.0001, now);
    const beat = 0.5;
    for (let i = 0; i < 16; i++) {
      const note = pattern[i % pattern.length];
      const time = now + i * beat;
      gain.gain.exponentialRampToValueAtTime(0.2, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + beat * 0.9);
      osc.frequency.setValueAtTime(freq * Math.pow(2, note / 12), time);
    }
    osc.start(now);
    osc.stop(now + 8);
    osc.onended = () => {
      if (this.musicPlaying) this.playMusic((loopIndex + 1) % MUSIC_LOOPS.length);
    };
    this.musicPlaying = true;
    this.musicSource = osc;
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicSource) {
      try {
        this.musicSource.stop();
      } catch (_) {}
      this.musicSource = null;
    }
  }

  /**
   * @param {number} frequency
   * @param {number} duration
   */
  playTone(frequency, duration) {
    if (!this.context || !this.sfxGain) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(this.sfxGain);
    const now = this.context.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  playNoise(duration = 0.2) {
    if (!this.context || !this.sfxGain) return;
    const buffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++) {
      channel[i] = Math.random() * 2 - 1;
    }
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(this.sfxGain);
    const now = this.context.currentTime;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    source.start(now);
  }

  onUnlock(callback) {
    if (this.settings.enabled) {
      callback();
    } else {
      this.unlockCallbacks.push(callback);
    }
  }
}
