// Retro 80s Synth Sound System using Web Audio API

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let isMusicPlaying = false;
let musicOscillators: OscillatorNode[] = [];
let musicInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create master gain
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioContext.destination);
    
    // Create separate gains for music and SFX
    musicGain = audioContext.createGain();
    musicGain.gain.value = 0.3;
    musicGain.connect(masterGain);
    
    sfxGain = audioContext.createGain();
    sfxGain.gain.value = 0.6;
    sfxGain.connect(masterGain);
  }
  
  // Resume if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  return audioContext;
}

// Create a simple synth voice
function createSynthVoice(
  ctx: AudioContext,
  frequency: number,
  type: OscillatorType,
  duration: number,
  attack: number = 0.01,
  decay: number = 0.1,
  sustain: number = 0.5,
  release: number = 0.2
): { osc: OscillatorNode; gain: GainNode } {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.value = frequency;
  osc.connect(gain);
  
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + attack);
  gain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
  gain.gain.setValueAtTime(sustain, now + duration - release);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  
  return { osc, gain };
}

// Add filter for warmer sound
function createFilter(ctx: AudioContext, type: BiquadFilterType, frequency: number): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = 1;
  return filter;
}

// ========== SOUND EFFECTS ==========

export function playClickSound() {
  const ctx = getAudioContext();
  if (!sfxGain) return;
  
  const { osc, gain } = createSynthVoice(ctx, 800, 'square', 0.08, 0.005, 0.02, 0.3, 0.03);
  gain.connect(sfxGain);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

export function playSelectSound() {
  const ctx = getAudioContext();
  if (!sfxGain) return;
  
  const { osc, gain } = createSynthVoice(ctx, 440, 'sine', 0.1, 0.01, 0.03, 0.4, 0.04);
  const filter = createFilter(ctx, 'lowpass', 2000);
  
  gain.connect(filter);
  filter.connect(sfxGain);
  
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.05);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

export function playCorrectSound() {
  const ctx = getAudioContext();
  if (!sfxGain) return;
  
  // Ascending arpeggio
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  
  notes.forEach((freq, i) => {
    const { osc, gain } = createSynthVoice(ctx, freq, 'triangle', 0.15, 0.01, 0.05, 0.6, 0.08);
    gain.connect(sfxGain);
    
    osc.start(ctx.currentTime + i * 0.06);
    osc.stop(ctx.currentTime + i * 0.06 + 0.15);
  });
}

export function playErrorSound() {
  const ctx = getAudioContext();
  if (!sfxGain) return;
  
  // Descending buzz
  const { osc, gain } = createSynthVoice(ctx, 200, 'sawtooth', 0.25, 0.01, 0.05, 0.5, 0.15);
  const filter = createFilter(ctx, 'lowpass', 800);
  
  gain.connect(filter);
  filter.connect(sfxGain);
  
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

export function playHintSound() {
  const ctx = getAudioContext();
  if (!sfxGain) return;
  
  // Magical shimmer
  const notes = [880, 1108.73, 1318.51, 1760]; // A5, C#6, E6, A6
  
  notes.forEach((freq, i) => {
    const { osc, gain } = createSynthVoice(ctx, freq, 'sine', 0.4, 0.01, 0.1, 0.3, 0.2);
    gain.gain.value = 0.3;
    gain.connect(sfxGain);
    
    osc.start(ctx.currentTime + i * 0.08);
    osc.stop(ctx.currentTime + i * 0.08 + 0.4);
  });
}

export function playVictorySound() {
  const ctx = getAudioContext();
  if (!sfxGain) return;
  
  // Epic victory fanfare
  const melody = [
    { freq: 523.25, time: 0, duration: 0.15 },      // C5
    { freq: 659.25, time: 0.15, duration: 0.15 },   // E5
    { freq: 783.99, time: 0.3, duration: 0.15 },    // G5
    { freq: 1046.5, time: 0.45, duration: 0.4 },    // C6
    { freq: 987.77, time: 0.65, duration: 0.1 },    // B5
    { freq: 1046.5, time: 0.75, duration: 0.5 },    // C6
  ];
  
  melody.forEach(({ freq, time, duration }) => {
    const { osc, gain } = createSynthVoice(ctx, freq, 'square', duration, 0.02, 0.05, 0.7, 0.1);
    const filter = createFilter(ctx, 'lowpass', 3000);
    
    gain.connect(filter);
    filter.connect(sfxGain);
    
    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + duration);
  });
  
  // Add bass
  const bassNotes = [
    { freq: 130.81, time: 0, duration: 0.3 },    // C3
    { freq: 196, time: 0.45, duration: 0.8 },    // G3
  ];
  
  bassNotes.forEach(({ freq, time, duration }) => {
    const { osc, gain } = createSynthVoice(ctx, freq, 'triangle', duration, 0.01, 0.1, 0.5, 0.2);
    gain.connect(sfxGain);
    
    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + duration);
  });
}

export function playStarSound(starNumber: number) {
  const ctx = getAudioContext();
  if (!sfxGain) return;
  
  const baseFreq = 880 + (starNumber * 220);
  
  const { osc, gain } = createSynthVoice(ctx, baseFreq, 'sine', 0.3, 0.01, 0.05, 0.5, 0.2);
  gain.connect(sfxGain);
  
  osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.15);
  osc.frequency.linearRampToValueAtTime(baseFreq * 1.2, ctx.currentTime + 0.3);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

export function playNumberSound(number: number) {
  const ctx = getAudioContext();
  if (!sfxGain) return;
  
  // Different pitch for each number
  const baseFreq = 220 + (number * 50);
  
  const { osc, gain } = createSynthVoice(ctx, baseFreq, 'triangle', 0.1, 0.01, 0.02, 0.5, 0.05);
  gain.connect(sfxGain);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

// ========== BACKGROUND MUSIC ==========

const SYNTHWAVE_PROGRESSION = [
  // Am - F - C - G (classic 80s progression)
  { bass: 110, chords: [220, 277.18, 329.63] },      // Am
  { bass: 87.31, chords: [174.61, 220, 261.63] },    // F
  { bass: 130.81, chords: [261.63, 329.63, 392] },   // C
  { bass: 98, chords: [196, 246.94, 293.66] },       // G
];

export function startBackgroundMusic() {
  if (isMusicPlaying) return;
  
  const ctx = getAudioContext();
  if (!musicGain) return;
  
  isMusicPlaying = true;
  let chordIndex = 0;
  
  function playChord() {
    if (!isMusicPlaying || !musicGain) return;
    
    const chord = SYNTHWAVE_PROGRESSION[chordIndex];
    
    // Bass
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    const bassFilter = createFilter(ctx, 'lowpass', 400);
    
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.value = chord.bass;
    bassGain.gain.setValueAtTime(0, ctx.currentTime);
    bassGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
    bassGain.gain.setValueAtTime(0.4, ctx.currentTime + 1.5);
    bassGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    
    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(musicGain);
    
    bassOsc.start();
    bassOsc.stop(ctx.currentTime + 2);
    musicOscillators.push(bassOsc);
    
    // Pad chords
    chord.chords.forEach((freq, i) => {
      const padOsc = ctx.createOscillator();
      const padGain = ctx.createGain();
      const padFilter = createFilter(ctx, 'lowpass', 2000);
      
      padOsc.type = 'sawtooth';
      padOsc.frequency.value = freq;
      
      // Slight detuning for richness
      padOsc.detune.value = (i - 1) * 5;
      
      padGain.gain.setValueAtTime(0, ctx.currentTime);
      padGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
      padGain.gain.setValueAtTime(0.15, ctx.currentTime + 1.5);
      padGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
      
      padOsc.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(musicGain);
      
      padOsc.start();
      padOsc.stop(ctx.currentTime + 2);
      musicOscillators.push(padOsc);
    });
    
    // Arpeggiated high notes
    const arpNotes = [...chord.chords, chord.chords[0] * 2];
    arpNotes.forEach((freq, i) => {
      setTimeout(() => {
        if (!isMusicPlaying || !musicGain) return;
        
        const arpOsc = ctx.createOscillator();
        const arpGain = ctx.createGain();
        
        arpOsc.type = 'square';
        arpOsc.frequency.value = freq * 2;
        
        arpGain.gain.setValueAtTime(0, ctx.currentTime);
        arpGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
        arpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        
        arpOsc.connect(arpGain);
        arpGain.connect(musicGain);
        
        arpOsc.start();
        arpOsc.stop(ctx.currentTime + 0.15);
      }, i * 125);
    });
    
    chordIndex = (chordIndex + 1) % SYNTHWAVE_PROGRESSION.length;
  }
  
  playChord();
  musicInterval = window.setInterval(playChord, 2000);
}

export function stopBackgroundMusic() {
  isMusicPlaying = false;
  
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  
  musicOscillators.forEach(osc => {
    try {
      osc.stop();
    } catch (e) {
      // Already stopped
    }
  });
  musicOscillators = [];
}

export function toggleBackgroundMusic(): boolean {
  if (isMusicPlaying) {
    stopBackgroundMusic();
    return false;
  } else {
    startBackgroundMusic();
    return true;
  }
}

export function isMusicOn(): boolean {
  return isMusicPlaying;
}

// Volume controls
export function setMasterVolume(volume: number) {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
}

export function setMusicVolume(volume: number) {
  if (musicGain) {
    musicGain.gain.value = Math.max(0, Math.min(1, volume));
  }
}

export function setSfxVolume(volume: number) {
  if (sfxGain) {
    sfxGain.gain.value = Math.max(0, Math.min(1, volume));
  }
}

// Initialize audio on first user interaction
export function initAudio() {
  getAudioContext();
}
