import { load, save } from './utils';

let ctx = null;
let muted = load('chess-muted', false);

export const isMuted = () => muted;
export const setMuted = v => { muted = v; save('chess-muted', v); };

// the audio context is created on first use, after the user has clicked something
const ac = () => {
  if (muted) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch (e) { return null; }
};

// a short beep that slides from one pitch to another and fades out
const tone = (f0, f1, dur, type = 'sine', vol = 0.2, delay = 0) => {
  const a = ac(); if (!a) return;
  const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur);
};

// a short burst of filtered noise, which gives the "click" of a piece landing
const noise = (dur, vol, delay = 0) => {
  const a = ac(); if (!a) return;
  const t = a.currentTime + delay;
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = buf;
  f.type = 'bandpass'; f.frequency.value = 1800;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
};

const SOUNDS = {
  move:    () => { tone(200, 110, 0.09, 'triangle', 0.25); noise(0.04, 0.25); },
  capture: () => { tone(160, 70, 0.14, 'triangle', 0.35); noise(0.09, 0.45); },
  castle:  () => { SOUNDS.move(); setTimeout(SOUNDS.move, 130); },
  check:   () => { tone(660, 660, 0.1, 'square', 0.1); tone(880, 880, 0.14, 'square', 0.1, 0.11); },
  end:     () => { [523, 659, 784].forEach((f, i) => tone(f, f, 0.28, 'sine', 0.22, i * 0.16)); }
};

export const playSound = kind => { if (SOUNDS[kind]) SOUNDS[kind](); };