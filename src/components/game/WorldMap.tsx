import { WORLDS, PlayerProgress, getUnlockedWorlds } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Lock, Star, CheckCircle2 } from 'lucide-react';

interface WorldMapProps {
  progress: PlayerProgress;
  onSelectWorld: (worldId: number) => void;
  onSelectPuzzle: (worldId: number, puzzleIndex: number) => void;
}

export function WorldMap({ progress, onSelectWorld, onSelectPuzzle }: WorldMapProps) {
  const unlockedWorlds = getUnlockedWorlds(progress.totalStars);

  return (
    <div className="w-full space-y-4">
      <div className="text-center mb-6">
        <h2 className="font-pixel text-xl sm:text-2xl text-primary text-glow-pink mb-2">
          Välj Värld
        </h2>
        <div className="flex items-center justify-center gap-2 text-accent">
          <Star className="w-5 h-5 fill-current" />
          <span className="font-retro text-xl">{progress.totalStars} stjärnor</span>
        </div>
      </div>

      <div className="grid gap-4">
        {WORLDS.map((world) => {
          const isUnlocked = unlockedWorlds.includes(world.id);
          const worldProgress = progress.worldProgress[world.id] || [];
          const completedPuzzles = worldProgress.length;

          return (
            <div
              key={world.id}
              className={cn(
                'relative border-2 rounded-lg p-4 transition-all duration-300',
                isUnlocked
                  ? 'border-border/50 hover:border-primary cursor-pointer hover:scale-[1.02]'
                  : 'border-muted/30 opacity-60'
              )}
              onClick={() => isUnlocked && onSelectWorld(world.id)}
            >
              {/* Lock overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
                  <div className="text-center">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-retro text-muted-foreground">
                      Kräver {world.requiredStars} stjärnor
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className={cn(
                  'text-4xl p-3 rounded-lg',
                  isUnlocked && 'animate-float'
                )}>
                  {world.icon}
                </div>

                <div className="flex-1">
                  <h3 className={cn(
                    'font-pixel text-sm sm:text-base mb-1',
                    isUnlocked ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    {world.name}
                  </h3>
                  <p className="font-retro text-muted-foreground text-sm">
                    {world.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-retro text-sm text-muted-foreground">
                      {world.gridSize}x{world.gridSize} rutnät
                    </span>
                    <span className="font-retro text-sm text-accent">
                      {completedPuzzles}/{world.puzzleCount} klara
                    </span>
                  </div>
                </div>

                {isUnlocked && completedPuzzles > 0 && (
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-retro">{completedPuzzles * 2}</span>
                  </div>
                )}
              </div>

              {/* Puzzle grid */}
              {isUnlocked && completedPuzzles > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/30">
                  {Array.from({ length: world.puzzleCount }, (_, i) => {
                    const isCompleted = worldProgress.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPuzzle(world.id, i);
                        }}
                        className={cn(
                          'w-8 h-8 rounded border font-retro text-sm transition-all',
                          isCompleted
                            ? 'border-neon-green/50 bg-neon-green/20 text-neon-green'
                            : 'border-border/50 bg-card/50 text-muted-foreground hover:border-secondary'
                        )}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4 mx-auto" /> : i + 1}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
