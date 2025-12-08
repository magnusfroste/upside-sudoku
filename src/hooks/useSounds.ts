import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  playClickSound,
  playSelectSound,
  playCorrectSound,
  playErrorSound,
  playHintSound,
  playVictorySound,
  playStarSound,
  playNumberSound,
  startBackgroundMusic,
  stopBackgroundMusic,
  isMusicOn,
  initAudio,
  setMusicVolume,
  setSfxVolume,
} from '@/lib/sounds';

interface SoundSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  musicEnabled: false,
  sfxEnabled: true,
  musicVolume: 0.3,
  sfxVolume: 0.6,
};

export function useSounds() {
  const [settings, setSettings] = useLocalStorage<SoundSettings>(
    'upside-down-sudoku-sounds',
    DEFAULT_SOUND_SETTINGS
  );
  const [initialized, setInitialized] = useState(false);

  // Initialize audio on first interaction
  const initialize = useCallback(() => {
    if (!initialized) {
      initAudio();
      setInitialized(true);
      
      // Apply saved volume settings
      setMusicVolume(settings.musicVolume);
      setSfxVolume(settings.sfxVolume);
      
      // Start music if it was enabled
      if (settings.musicEnabled) {
        startBackgroundMusic();
      }
    }
  }, [initialized, settings]);

  // Sound effect wrappers
  const playClick = useCallback(() => {
    if (settings.sfxEnabled) {
      initialize();
      playClickSound();
    }
  }, [settings.sfxEnabled, initialize]);

  const playSelect = useCallback(() => {
    if (settings.sfxEnabled) {
      initialize();
      playSelectSound();
    }
  }, [settings.sfxEnabled, initialize]);

  const playCorrect = useCallback(() => {
    if (settings.sfxEnabled) {
      initialize();
      playCorrectSound();
    }
  }, [settings.sfxEnabled, initialize]);

  const playError = useCallback(() => {
    if (settings.sfxEnabled) {
      initialize();
      playErrorSound();
    }
  }, [settings.sfxEnabled, initialize]);

  const playHint = useCallback(() => {
    if (settings.sfxEnabled) {
      initialize();
      playHintSound();
    }
  }, [settings.sfxEnabled, initialize]);

  const playVictory = useCallback(() => {
    if (settings.sfxEnabled) {
      initialize();
      playVictorySound();
    }
  }, [settings.sfxEnabled, initialize]);

  const playStar = useCallback((starNumber: number) => {
    if (settings.sfxEnabled) {
      initialize();
      playStarSound(starNumber);
    }
  }, [settings.sfxEnabled, initialize]);

  const playNumber = useCallback((number: number) => {
    if (settings.sfxEnabled) {
      initialize();
      playNumberSound(number);
    }
  }, [settings.sfxEnabled, initialize]);

  // Music controls
  const toggleMusic = useCallback(() => {
    initialize();
    const newEnabled = !settings.musicEnabled;
    
    if (newEnabled) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
    
    setSettings(prev => ({ ...prev, musicEnabled: newEnabled }));
  }, [settings.musicEnabled, initialize, setSettings]);

  const toggleSfx = useCallback(() => {
    setSettings(prev => ({ ...prev, sfxEnabled: !prev.sfxEnabled }));
  }, [setSettings]);

  const updateMusicVolume = useCallback((volume: number) => {
    setMusicVolume(volume);
    setSettings(prev => ({ ...prev, musicVolume: volume }));
  }, [setSettings]);

  const updateSfxVolume = useCallback((volume: number) => {
    setSfxVolume(volume);
    setSettings(prev => ({ ...prev, sfxVolume: volume }));
  }, [setSettings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  return {
    settings,
    initialize,
    playClick,
    playSelect,
    playCorrect,
    playError,
    playHint,
    playVictory,
    playStar,
    playNumber,
    toggleMusic,
    toggleSfx,
    updateMusicVolume,
    updateSfxVolume,
  };
}
