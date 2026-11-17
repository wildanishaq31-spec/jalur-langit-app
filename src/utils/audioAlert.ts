// Web Audio API & Vibration Sound Alert for Jalur Langit alarms

export function playGentleChime() {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    
    // Play a gentle two-tone chime (E5 -> B5 -> E6)
    const tones = [
      { freq: 659.25, time: 0, duration: 0.6 },    // E5
      { freq: 987.77, time: 0.2, duration: 0.8 },  // B5
      { freq: 1318.51, time: 0.45, duration: 1.2 }, // E6
    ];

    tones.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      // Smooth attack and decay envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + duration);
    });

    // Also trigger mobile vibration pattern if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  } catch (e) {
    console.warn('Audio alert unavailable:', e);
  }
}

