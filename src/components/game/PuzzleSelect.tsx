import { WORLDS, PlayerProgress } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { ArrowLeft, Star, CheckCircle2, Play } from 'lucide-react';

interface PuzzleSelectProps {
  worldId: number;
  progress: PlayerProgress;
  onSelectPuzzle: (puzzleIndex: number) => void;
  onBack: () => void;
}

export function PuzzleSelect({ worldId, progress, onSelectPuzzle, onBack }: PuzzleSelectProps) {
  const world = WORLDS.find(w => w.id === worldId)!;
  const worldProgress = progress.worldProgress[worldId] || [];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-retro text-lg">Tillbaka</span>
        </button>
      </div>

      {/* World info */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3 animate-float">{world.icon}</div>
        <h2 className="font-pixel text-xl text-primary text-glow-pink mb-2">
          {world.name}
        </h2>
        <p className="font-retro text-muted-foreground">{world.description}</p>
        <p className="font-retro text-sm text-accent mt-2">
          {world.gridSize}x{world.gridSize} rutnät
        </p>
      </div>

      {/* Puzzle grid */}
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: world.puzzleCount }, (_, i) => {
          const isCompleted = worldProgress.includes(i);
          const bestTime = progress.bestTimes[`${worldId}-${i}`];

          return (
            <button
              key={i}
              onClick={() => onSelectPuzzle(i)}
              className={cn(
                'relative aspect-square rounded-lg border-2 transition-all duration-300',
                'flex flex-col items-center justify-center gap-1',
                'hover:scale-105 active:scale-95',
                isCompleted
                  ? 'border-neon-green/50 bg-neon-green/10 hover:border-neon-green'
                  : 'border-secondary/30 bg-card/50 hover:border-secondary'
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-neon-green" />
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-3 h-3',
                          star <= 2 ? 'text-accent fill-accent' : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                  {bestTime && (
                    <span className="font-retro text-xs text-muted-foreground">
                      {Math.floor(bestTime / 60)}:{(bestTime % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="font-pixel text-lg text-secondary">{i + 1}</span>
                  <Play className="w-4 h-4 text-muted-foreground" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
