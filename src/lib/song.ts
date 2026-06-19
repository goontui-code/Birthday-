export const playBirthdaySong = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();

  const playTone = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration - 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  };

  const notes = [
    { n: 'G4', f: 392.00, d: 0.3 },
    { n: 'G4', f: 392.00, d: 0.3 },
    { n: 'A4', f: 440.00, d: 0.6 },
    { n: 'G4', f: 392.00, d: 0.6 },
    { n: 'C5', f: 523.25, d: 0.6 },
    { n: 'B4', f: 493.88, d: 1.2 },

    { n: 'G4', f: 392.00, d: 0.3 },
    { n: 'G4', f: 392.00, d: 0.3 },
    { n: 'A4', f: 440.00, d: 0.6 },
    { n: 'G4', f: 392.00, d: 0.6 },
    { n: 'D5', f: 587.33, d: 0.6 },
    { n: 'C5', f: 523.25, d: 1.2 },

    { n: 'G4', f: 392.00, d: 0.3 },
    { n: 'G4', f: 392.00, d: 0.3 },
    { n: 'G5', f: 783.99, d: 0.6 },
    { n: 'E5', f: 659.25, d: 0.6 },
    { n: 'C5', f: 523.25, d: 0.6 },
    { n: 'B4', f: 493.88, d: 0.6 },
    { n: 'A4', f: 440.00, d: 1.2 },

    { n: 'F5', f: 698.46, d: 0.3 },
    { n: 'F5', f: 698.46, d: 0.3 },
    { n: 'E5', f: 659.25, d: 0.6 },
    { n: 'C5', f: 523.25, d: 0.6 },
    { n: 'D5', f: 587.33, d: 0.6 },
    { n: 'C5', f: 523.25, d: 1.2 },
  ];

  let time = 0;
  notes.forEach(note => {
    playTone(note.f, time, note.d);
    time += note.d;
  });
};
