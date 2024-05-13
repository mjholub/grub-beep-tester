import React, { useState, useRef } from 'react';

const noteToFrequency = (note, octave) => {
  const noteFrequencies = {
    C: 261.63,
    'C#': 277.18,
    D: 293.66,
    'D#': 311.13,
    E: 329.63,
    F: 349.23,
    'F#': 369.99,
    G: 392.0,
    'G#': 415.3,
    A: 440.0,
    'A#': 466.16,
    B: 493.88,
  };

  const noteIndex = Object.keys(noteFrequencies).indexOf(note);
  if (noteIndex !== -1) {
    const frequency = noteFrequencies[note];
    return frequency * Math.pow(2, octave - 4);
  }
  return null;
};

export const BeepSimulator = () => {
  const [tune, setTune] = useState('');
  const [duration, setDuration] = useState(2);
  const [octave, setOctave] = useState(4);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);

  const playTune = () => {
    if (isPlaying) return;

    const context = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = context;
    const parts = tune.split(' ');

    if (parts.length < 1) {
      setErrorMessage('Invalid GRUB_INIT_TUNE string');
      return;
    }

    if (parts.filter(part))

      setErrorMessage('');
    setIsPlaying(true);

    let currentTime = context.currentTime;

    for (let i = 0; i < parts.length; i++) {
      const oscillator = context.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.value = parts[i]; // value in hertz
      oscillator.connect(context.destination);
      oscillator.start(currentTime);

      const noteDuration = duration * 1000; // Convert seconds to milliseconds
      oscillator.stop(currentTime + noteDuration / 1000);
      currentTime += noteDuration / 1000;
    }

    setTimeout(() => {
      setIsPlaying(false);
    }, currentTime * 1000);
  };
  const stopTune = () => audioContextRef.current ? audioContextRef.close() : setIsPlaying(false);

  return (
    <div>
      <div>
        <label htmlFor="tune">Tune:</label>
        <input
          type="text"
          id="tune"
          value={tune}
          onChange={(e) => setTune(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' ? playTune() : null)}
          aria-describedby="tune-description"
        />
        <p id="tune-description" class="annotation">Enter the frequencies separated by whitespaces</p>
      </div>
      <div>
        <label htmlFor="duration">Note duration (seconds):</label>
        <input
          type="number"
          class="block"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          onKeyDown={(e) => (e.key === 'Enter' ? playTune() : null)}
          aria-describedby="duration-description"
          step="0.1"
          min="0.1"
        />
        <p id="duration-description" class="annotation">Specify the duration of each beep in seconds</p>
      </div>
      <button onClick={playTune}
        disabled={isPlaying} aria-label="Play the tune"
        type="button">Play</button>
      <button onClick={stopTune} disabled={!isPlaying}
        aria-label="Stop the tune" type="button">
        Stop
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
