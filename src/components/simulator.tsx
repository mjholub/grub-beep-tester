import { useState, useRef, EventHandler } from 'react';

const noteToFrequency = (note: string, octave: number) => {
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
    const frequency = noteFrequencies[note as keyof typeof noteFrequencies];
    return frequency * Math.pow(2, octave - 4);
  }
  return null;
};

export const BeepSimulator = () => {
  const [tune, setTune] = useState('');
  const [duration, setDuration] = useState(0.5);
  const [octave, setOctave] = useState(4);
  const [bpm, setBpm] = useState(120);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTune = () => {
    if (isPlaying) return;

    const context = new (window.AudioContext)();
    audioContextRef.current = context;
    const parts = tune.split(' ');

    if (parts.length < 1) {
      setErrorMessage('Invalid GRUB_INIT_TUNE string');
      return;
    }

    const frequencies = parts.map((note) => {
      const frequency = noteToFrequency(note, octave);
      return frequency;
    });


    if (frequencies.some((frequency) => frequency! > 9000 || frequency! < 37)) {
      setErrorMessage('Unsafe frequency detected');
      return;
    }

    setErrorMessage('');
    setIsPlaying(true);

    let currentTime = context.currentTime;
    const noteDuration = 60 / bpm;

    for (let i = 0; i < parts.length; i++) {
      const note = parts[i];
      const frequency = noteToFrequency(note, octave);

      if (frequency) {
        const oscillator = context.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = frequency;
        oscillator.connect(context.destination);
        oscillator.start(currentTime);

        oscillator.stop(currentTime + noteDuration);
        currentTime += noteDuration;
      }
    }

    setTimeout(() => {
      setIsPlaying(false);
    }, currentTime * 1000);
  };
  const stopTune = () => audioContextRef.current ? audioContextRef.current.close() : null;

  return (
    <div>
      <div>
        <label for="tune">Tune:</label>
        <input
          type="text"
          id="tune"
          value={tune}
          // @ts-ignore
          onchange={(e) => setTune(e.target.value)}
          // @ts-ignore
          onKeyDown={(e) => (e.key === 'Enter' ? playTune() : null)}
          aria-describedby="tune-description"
        />
        <p id="tune-description" class="annotation">
          Enter the frequencies separated by whitespaces</p>
      </div>
      <div>
        <label for="duration">Note duration (seconds):</label>
        <input
          type="number"
          class="block"
          id="duration"
          // @ts-ignore
          value={duration}
          // @ts-ignore
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          // @ts-ignore
          onKeyDown={(e) => (e.key === 'Enter' ? playTune() : null)}
          aria-describedby="duration-description"
          step="0.1"
          min="0.1"
        />
        <p id="duration-description" class="annotation">
          Specify the duration of each beep in seconds</p>
      </div>
      <div>
        <label for="octave">Octave:</label>
        <input type="number" id="octave" value={octave.toString()}
          // @ts-ignore
          onChange={(e) => setOctave(parseInt(e.target.value))}
          aria-describedby="octave-description"
          step="1" min="1" max="8"
        />
      </div>
      <div>
        <label for="bpm">BPM (Beats per minute. Will change note duration):</label>
        <input type="number" id="bpm" value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          aria-describedby="bpm-description"
          step="1" min="20" max="300" />
      </div>

      <button onClick={playTune}
        disabled={isPlaying} aria-label="Play the tune"
        type="button">Play</button>
      <button onClick={stopTune} disabled={!isPlaying}
        aria-label="Stop the tune" type="button">
        Stop
      </button>
      {errorMessage && <p name="error-message">{errorMessage}</p>}
    </div>
  );
};
