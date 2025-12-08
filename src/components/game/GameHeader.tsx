import { Timer, TimerOff, Lightbulb, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WORLDS } from '@/lib/gameData';

interface GameHeaderProps {
  worldId: number;
  puzzleIndex: number;
  elapsedTime: number;
  timerEnabled: boolean;
  hintsRemaining: number;
  onToggleTimer: () => void;
  onUseHint: () => void;
  onBack: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function GameHeader({
  worldId,
  puzzleIndex,
  elapsedTime,
  timerEnabled,
  hintsRemaining,
  onToggleTimer,
  onUseHint,
  onBack,
}: GameHeaderProps) {
  const world = WORLDS.find(w => w.id === worldId);

  return (
    <header className="w-full max-w-md mx-auto mb-4">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-retro text-lg">Tillbaka</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTimer}
            className={cn(
              'p-2 rounded-lg border transition-all',
              timerEnabled 
                ? 'border-secondary/50 text-secondary hover:bg-secondary/20' 
                : 'border-muted text-muted-foreground'
            )}
          >
            {timerEnabled ? <Timer className="w-5 h-5" /> : <TimerOff className="w-5 h-5" />}
          </button>
          
          <div className={cn(
            'font-pixel text-lg px-3 py-1 rounded-lg',
            'bg-card border border-border',
            timerEnabled ? 'text-secondary text-glow-blue' : 'text-muted-foreground'
          )}>
            {formatTime(elapsedTime)}
          </div>
        </div>
      </div>

      {/* World info & Hints */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{world?.icon}</span>
          <div>
            <p className="font-pixel text-xs text-primary text-glow-pink">{world?.name}</p>
            <p className="font-retro text-muted-foreground">Pussel {puzzleIndex + 1}/10</p>
          </div>
        </div>

        <button
          onClick={onUseHint}
          disabled={hintsRemaining === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-retro text-lg',
            'transition-all duration-300',
            hintsRemaining > 0
              ? 'border-neon-purple/50 text-neon-purple hover:bg-neon-purple/20 hover:scale-105'
              : 'border-muted text-muted-foreground opacity-50 cursor-not-allowed'
          )}
        >
          <Lightbulb className="w-5 h-5" />
          <span>Eleven&apos;s Power</span>
          <span className="bg-neon-purple/20 px-2 py-0.5 rounded">{hintsRemaining}</span>
        </button>
      </div>
    </header>
  );
}
