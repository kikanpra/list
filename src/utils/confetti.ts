import confetti from 'canvas-confetti';

export function fireCompletionConfetti() {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#1664B0', '#D21624', '#EFE8DE'],
      ticks: 180,
      gravity: 1.2,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  } catch (err) {
    console.debug('Confetti suppressed or unsupported', err);
  }
}
