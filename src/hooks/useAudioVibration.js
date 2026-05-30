export function useAudioVibration(soundEnabled, vibrationEnabled) {
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!window.audioCtx) window.audioCtx = new AudioContext();
      if (window.audioCtx.state === 'suspended') window.audioCtx.resume();

      const now = window.audioCtx.currentTime;

      if (type === 'click') {
        const osc = window.audioCtx.createOscillator();
        const gain = window.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(window.audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);

      } else if (type === 'success') {
        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((freq, index) => {
          const osc = window.audioCtx.createOscillator();
          const gain = window.audioCtx.createGain();

          osc.connect(gain);
          gain.connect(window.audioCtx.destination);

          osc.type = 'sine';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0, now);
          const attackTime = now + (index * 0.05) + 0.02;
          gain.gain.linearRampToValueAtTime(0.05, attackTime);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

          osc.start(now);
          osc.stop(now + 1.5);
        });
      } else if (type === 'celebration') {
        const popTimes = [0, 0.08, 0.15, 0.2, 0.28, 0.35, 0.4];
        popTimes.forEach(delay => {
          const osc = window.audioCtx.createOscillator();
          const gain = window.audioCtx.createGain();
          osc.connect(gain);
          gain.connect(window.audioCtx.destination);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now + delay);
          osc.frequency.exponentialRampToValueAtTime(100, now + delay + 0.05);

          gain.gain.setValueAtTime(0, now + delay);
          gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

          osc.start(now + delay);
          osc.stop(now + delay + 0.05);
        });
      }
    } catch (e) {
      // تجاهل إذا كان المتصفح لا يدعم
    }
  };

  const triggerVibration = (pattern) => {
    if (!vibrationEnabled) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // تجاهل الخطأ لو كان المتصفح لا يدعم الاهتزاز
    }
  };

  return { playSound, triggerVibration };
}
