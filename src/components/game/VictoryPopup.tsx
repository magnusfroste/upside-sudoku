import { Badge, WORLDS, XP_PER_STAR, DAILY_BONUS_XP } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Star, Trophy, Zap, ArrowRight, RotateCcw, Calendar, Flame } from 'lucide-react';

interface VictoryPopupProps {
  worldId: number;
  puzzleIndex: number;
  stars: number;
  timeSeconds: number;
  newBadges: Badge[];
  isDaily: boolean;
  bonusXP: number;
  dailyStreak: number;
  onNextPuzzle: () => void;
  onReplay: () => void;
  onBackToMap: () => void;
}

export function VictoryPopup({
  worldId,
  puzzleIndex,
  stars,
  timeSeconds,
  newBadges,
  isDaily,
  bonusXP,
  dailyStreak,
  onNextPuzzle,
  onReplay,
  onBackToMap,
}: VictoryPopupProps) {
  const world = WORLDS.find(w => w.id === worldId);
  const isLastPuzzle = world ? puzzleIndex >= world.puzzleCount - 1 : true;
  const xpEarned = stars * XP_PER_STAR;
  const totalXP = xpEarned + bonusXP;

  return (
    <div className="fixed inset-0 bg-background/90 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-card border-2 border-primary rounded-lg p-6 text-center animate-bounce-in">
        {/* Trophy icon */}
        <div className="relative inline-block mb-4">
          {isDaily ? (
            <Calendar className="w-16 h-16 text-accent animate-pulse-glow" />
          ) : (
            <Trophy className="w-16 h-16 text-accent animate-pulse-glow" />
          )}
          <div className="absolute -top-2 -right-2 text-2xl animate-star-burst">
            ✨
          </div>
        </div>

        {/* Title */}
        <h2 className="font-pixel text-xl text-primary text-glow-pink mb-2">
          {isDaily ? 'DAGLIG KLARAD!' : 'PUSSEL KLARAT!'}
        </h2>
        <p className="font-retro text-muted-foreground mb-4">
          {isDaily ? (
            <span className="flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-neon-red" />
              {dailyStreak} dagars streak!
            </span>
          ) : (
            `${world?.name} - Pussel ${puzzleIndex + 1}`
          )}
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((num, index) => (
            <Star
              key={num}
              className={cn(
                'w-10 h-10 transition-all',
                num <= stars
                  ? 'text-accent fill-accent animate-star-burst'
                  : 'text-muted-foreground'
              )}
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6 font-retro">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Tid</p>
            <p className="text-xl text-secondary">
              {Math.floor(timeSeconds / 60)}:{(timeSeconds % 60).toString().padStart(2, '0')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">XP</p>
            <p className="text-xl text-neon-green flex items-center gap-1">
              <Zap className="w-4 h-4" />
              +{totalXP}
            </p>
          </div>
        </div>

        {/* Daily bonus callout */}
        {isDaily && bonusXP > 0 && (
          <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-accent font-retro">
              <Calendar className="w-4 h-4" />
              <span>Daglig bonus: +{bonusXP} XP!</span>
            </div>
          </div>
        )}

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="mb-6 p-3 bg-neon-purple/10 border border-neon-purple/30 rounded-lg">
            <p className="font-pixel text-xs text-neon-purple mb-2">NYA BADGES!</p>
            <div className="flex justify-center gap-3">
              {newBadges.map((badge) => (
                <div key={badge.id} className="text-center animate-pop">
                  <span className="text-3xl">{badge.icon}</span>
                  <p className="font-retro text-sm text-foreground">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {!isDaily && !isLastPuzzle && (
            <button
              onClick={onNextPuzzle}
              className="neon-button neon-button-green flex items-center justify-center gap-2"
            >
              <span>Nästa Pussel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          
          {!isDaily && (
            <button
              onClick={onReplay}
              className="neon-button neon-button-blue flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Spela Igen</span>
            </button>
          )}
          
          <button
            onClick={onBackToMap}
            className={cn(
              isDaily 
                ? "neon-button neon-button-pink"
                : "font-retro text-muted-foreground hover:text-foreground transition-colors py-2"
            )}
          >
            Tillbaka till kartan
          </button>
        </div>
      </div>
    </div>
  );
}
