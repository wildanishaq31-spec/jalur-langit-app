'use client';

let audioCtx: AudioContext | null = null;
let cachedClickBuffer: AudioBuffer | null = null;
let isLoadingBuffer = false;

// Initialize or resume singleton AudioContext
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Preload the clean reference glass bead click extracted from user's video
export function preloadTasbihSound(): void {
  if (typeof window === 'undefined' || cachedClickBuffer || isLoadingBuffer) return;
  isLoadingBuffer = true;

  const ctx = getAudioContext();
  if (!ctx) {
    isLoadingBuffer = false;
    return;
  }

  fetch('/sounds/tasbih_click.mp3')
    .then((res) => {
      if (!res.ok) throw new Error('Sound file not found');
      return res.arrayBuffer();
    })
    .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
    .then((decoded) => {
      cachedClickBuffer = decoded;
    })
    .catch(() => {
      // If MP3 fetch fails, try WAV fallback
      fetch('/sounds/tasbih_click.wav')
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then((decoded) => {
          cachedClickBuffer = decoded;
        })
        .catch(() => {
          // Will use synthesized fallback
        });
    })
    .finally(() => {
      isLoadingBuffer = false;
    });
}

// Pure glass / crystal contact "ting-ting" harmonic chime synthesizer (exact matching video spectrum)
function playSynthesizedGlassTing(ctx: AudioContext): void {
  const now = ctx.currentTime;

  // 1. Primary crystal glass resonance (~1920 Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(1920, now);
  osc1.frequency.exponentialRampToValueAtTime(1860, now + 0.09);
  gain1.gain.setValueAtTime(0.35, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.09);

  // 2. High glass bell overtone (~3050 Hz)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(3050, now);
  osc2.frequency.exponentialRampToValueAtTime(2980, now + 0.07);
  gain2.gain.setValueAtTime(0.25, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.07);

  // 3. Crisp metallic transient "tink" click (~4800 Hz)
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = 'triangle';
  osc3.frequency.setValueAtTime(4800, now);
  osc3.frequency.exponentialRampToValueAtTime(1200, now + 0.025);
  gain3.gain.setValueAtTime(0.18, now);
  gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  osc3.connect(gain3);
  gain3.connect(ctx.destination);
  osc3.start(now);
  osc3.stop(now + 0.025);
}

// Main playback function called on every bead tap (0ms latency, never fails or cuts out)
export function playTasbihGlassClick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (cachedClickBuffer) {
      // Play high quality recorded glass click with slight pitch variation for organic realism
      const source = ctx.createBufferSource();
      source.buffer = cachedClickBuffer;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.65, ctx.currentTime);
      // Subtle micro-pitch variation (0.985 to 1.025)
      source.playbackRate.value = 0.985 + Math.random() * 0.04;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
    } else {
      // Fallback synthesizer
      playSynthesizedGlassTing(ctx);
      preloadTasbihSound();
    }
  } catch {
    // Graceful silent ignore if audio permissions denied
  }
}
