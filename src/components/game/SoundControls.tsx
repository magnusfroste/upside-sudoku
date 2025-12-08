import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SoundControlsProps {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
}

export function SoundControls({
  musicEnabled,
  sfxEnabled,
  onToggleMusic,
  onToggleSfx,
}: SoundControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleMusic}
        className={cn(
          'p-2 rounded-lg border transition-all',
          musicEnabled
            ? 'border-neon-purple/50 text-neon-purple bg-neon-purple/10'
            : 'border-muted text-muted-foreground hover:border-muted-foreground'
        )}
        title={musicEnabled ? 'Stäng av musik' : 'Sätt på musik'}
      >
        {musicEnabled ? (
          <Music className="w-5 h-5 animate-pulse" />
        ) : (
          <Music2 className="w-5 h-5" />
        )}
      </button>
      
      <button
        onClick={onToggleSfx}
        className={cn(
          'p-2 rounded-lg border transition-all',
          sfxEnabled
            ? 'border-secondary/50 text-secondary bg-secondary/10'
            : 'border-muted text-muted-foreground hover:border-muted-foreground'
        )}
        title={sfxEnabled ? 'Stäng av ljudeffekter' : 'Sätt på ljudeffekter'}
      >
        {sfxEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
