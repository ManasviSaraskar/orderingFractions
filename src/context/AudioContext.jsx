import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    // A simple synth for UI feedback
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    Tone.Destination.volume.value = -10; // -10dB
    return () => synthRef.current?.dispose();
  }, []);

  useEffect(() => {
    Tone.Destination.mute = isMuted;
  }, [isMuted]);

  const toggleMute = () => setIsMuted(m => !m);

  // Play a success sound
  const playCorrect = () => {
    if (!synthRef.current || isMuted) return;
    try {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
      const now = Tone.now();
      synthRef.current.triggerAttackRelease(["C5", "E5", "G5"], "8n", now);
    } catch(e) {}
  };

  // Play a wrong sound
  const playWrong = () => {
    if (!synthRef.current || isMuted) return;
    try {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
      const now = Tone.now();
      synthRef.current.triggerAttackRelease(["C4", "Eb4"], "4n", now);
    } catch(e) {}
  };
  
  const playSnap = () => {
    if (!synthRef.current || isMuted) return;
    try {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
      synthRef.current.triggerAttackRelease("G4", "32n");
    } catch(e) {}
  }

  // A simple background arpeggiator for music (simulated since we don't have mp3 assets)
  const playMusic = () => {
      // Omitted for simplicity, rely on UI sounds for core logic implementation
  }
  
  const stopAll = () => {
      // stop music if implemented
  }

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playCorrect, playWrong, playSnap, playMusic, stopAll }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
