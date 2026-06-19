import confetti from 'canvas-confetti';

let myConfetti: confetti.CreateTypes | null = null;
let canvas: HTMLCanvasElement | null = null;

export const fireConfetti = () => {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.pointerEvents = 'none';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    myConfetti = confetti.create(canvas, {
      resize: false,
      useWorker: false
    });
  }

  // Ensure canvas matches screen resolution precisely
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Set exactly 2000 milliseconds (2 seconds) duration
  const duration = 2000;
  const end = Date.now() + duration;

  let shapes: any[] | undefined = undefined;
  if ((confetti as any).shapeFromText) {
    shapes = [
      (confetti as any).shapeFromText({ text: '🎈', scalar: 3 }),
      (confetti as any).shapeFromText({ text: '✨', scalar: 3 }),
    ];
  }

  const frame = () => {
    if (!myConfetti) return;
    myConfetti({
      particleCount: 6,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.75 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fcd34d', '#34d399', '#f472b6'],
      shapes: shapes,
      scalar: 1.2,
    });
    myConfetti({
      particleCount: 6,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.75 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fcd34d', '#34d399', '#f472b6'],
      shapes: shapes,
      scalar: 1.2,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};
