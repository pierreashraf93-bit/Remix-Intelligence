/**
 * Tactical Web Audio Synthesizer Engine
 * Generates all covert operations audio effects purely in the browser.
 */

let audioCtx: AudioContext | null = null;
let sirenOscillator: OscillatorNode | null = null;
let sirenGain: GainNode | null = null;
let sirenInterval: ReturnType<typeof setInterval> | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundEngine = {
  // Terminal keypress tap
  playKeyClick(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400 + Math.random() * 300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // AudioContext blocked or not initialized yet
    }
  },

  // Tactical Radar Sonar / Ping
  playRadarPing(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, ctx.currentTime); // High A6
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // ignored
    }
  },

  // Target Locked Beep
  playTargetLock(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      [0, 0.09, 0.18].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(2200, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.06);
      });
    } catch {
      // ignored
    }
  },

  // Breach Decrypt Stream Chirp
  playBreachChirp(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const freq = 600 + Math.random() * 1200;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq + 200, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // ignored
    }
  },

  // Access Granted Chime
  playAccessGranted(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // ignored
    }
  },

  // Access Denied / Error Buzzer
  playAccessDenied(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // ignored
    }
  },

  // Camera Switch Static Burst
  playCameraStatic(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // ignored
    }
  },

  // Start / Stop Siren Loop for Lockdown
  startAlarmSiren(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx || sirenOscillator) return;

      sirenOscillator = ctx.createOscillator();
      sirenGain = ctx.createGain();

      sirenOscillator.type = 'sawtooth';
      sirenGain.gain.setValueAtTime(0.09, ctx.currentTime);

      sirenOscillator.connect(sirenGain);
      sirenGain.connect(ctx.destination);
      sirenOscillator.start();

      let high = false;
      sirenInterval = setInterval(() => {
        if (!sirenOscillator || !audioCtx) return;
        const now = audioCtx.currentTime;
        sirenOscillator.frequency.cancelScheduledValues(now);
        sirenOscillator.frequency.linearRampToValueAtTime(high ? 950 : 600, now + 0.28);
        high = !high;
      }, 300);
    } catch {
      // ignored
    }
  },

  stopAlarmSiren() {
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
    if (sirenOscillator) {
      try {
        sirenOscillator.stop();
        sirenOscillator.disconnect();
      } catch {
        // ignored
      }
      sirenOscillator = null;
    }
    if (sirenGain) {
      try {
        sirenGain.disconnect();
      } catch {
        // ignored
      }
      sirenGain = null;
    }
  }
};
