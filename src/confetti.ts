import confetti from 'canvas-confetti';

let confettiInstance: confetti.CreateTypes | null = null;
let confettiCanvas: HTMLCanvasElement | null = null;

function getSafeCanvas(): HTMLCanvasElement | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  if (confettiCanvas && document.body.contains(confettiCanvas)) return confettiCanvas;

  try {
    let canvas = document.getElementById('ansh-confetti-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ansh-confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);
    }
    confettiCanvas = canvas;
    return confettiCanvas;
  } catch {
    return null;
  }
}

export function fireConfetti(options?: confetti.Options): void {
  try {
    const canvas = getSafeCanvas();
    if (!canvas) return;
    if (!confettiInstance) {
      confettiInstance = confetti.create(canvas, { resize: true, useWorker: false });
    }
    if (confettiInstance) {
      confettiInstance(options || {
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#c084fc', '#e879f9', '#a855f7', '#fbbf24', '#ffffff'],
      });
    }
  } catch (err) {
    console.warn('Confetti safely guarded:', err);
  }
}
