import { useRef, useEffect, useState } from 'react';

interface WebAudioAPI extends Window {
  webkitAudioContext: typeof AudioContext;
}

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Initialize AudioContext on client side only
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || 
        ((window as unknown as WebAudioAPI).webkitAudioContext))();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playTone = (frequency: number, duration: number = 50) => {
    if (!isEnabled || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Apply fade out to avoid clicks
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration / 1000);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const playComparisonSound = (value: number, maxValue: number) => {
    // Map the value to a frequency between 220Hz and 880Hz
    const minFreq = 220;
    const maxFreq = 880;
    const normalizedValue = value / maxValue;
    const frequency = minFreq + normalizedValue * (maxFreq - minFreq);
    
    playTone(frequency);
  };

  const toggleAudio = () => {
    setIsEnabled(prev => !prev);
  };

  return {
    playComparisonSound,
    isEnabled,
    toggleAudio
  };
}

export default useAudio;
