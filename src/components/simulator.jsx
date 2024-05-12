import React, { useState } from 'react';

const BeepSimulator = () => {
  const [tune, setTune] = useState('');
  const context = new (window.AudioContext || window.webkitAudioContext)();

  const playTune = () => {
    const parts = tune.split(' ');
    if (parts.length < 3) {
      alert('Invalid GRUB_INIT_TUNE string');
      return;
    }

    const defaultDuration = 1000 / parts[0];
    let currentTime = context.currentTime;

    for (let i = 2; i < parts.length; i += 2) {
      const oscillator = context.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.value = parts[i]; // value in hertz
      oscillator.connect(context.destination);
      oscillator.start(currentTime);

      const duration = parts[i + 1] ? (defaultDuration * parts[i + 1]) / 1000 : defaultDuration / 1000;
      oscillator.stop(currentTime + duration);

      currentTime += duration;
    }
  };

  return (
    <div>
      <input type="text" value={tune} onChange={(e) => setTune(e.target.value)} />
      <button onClick={playTune}>Play</button>
    </div>
  );
};

export default BeepSimulator;
