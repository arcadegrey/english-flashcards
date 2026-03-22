let audioContext = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) {
    return null;
  }

  if (!audioContext) {
    audioContext = new Context();
  }

  return audioContext;
};

export const playSuccessChime = () => {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    context.resume().catch(() => {});
  }

  const now = context.currentTime;
  const notes = [784, 1046.5, 1318.5];

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    const startTime = now + index * 0.06;
    const endTime = startTime + 0.25;

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.14, startTime + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(endTime);
  });
};

