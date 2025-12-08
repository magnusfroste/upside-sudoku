import { PlayerProgress, getTodayKey, DAILY_BONUS_XP, DAILY_STREAK_BONUS } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Calendar, Star, Zap, Flame, CheckCircle2, Clock, Gift } from 'lucide-react';

interface DailyChallengeCardProps {
  progress: PlayerProgress;
  onStartDaily: () => void;
}

export function DailyChallengeCard({ progress, onStartDaily }: DailyChallengeCardProps) {
  const todayKey = getTodayKey();
  const todayChallenge = progress.dailyChallenges[todayKey];
  const isCompleted = todayChallenge?.completed || false;
  
  // Format date for display
  const today = new Date();
  const dateStr = today.toLocaleDateString('sv-SE', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  // Calculate potential bonus
  const potentialBonus = DAILY_BONUS_XP + ((progress.dailyStreak + 1) * DAILY_STREAK_BONUS);

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300',
      isCompleted 
        ? 'border-neon-green/50 bg-neon-green/5' 
        : 'border-accent/50 bg-accent/5 hover:border-accent hover:scale-[1.02] cursor-pointer'
    )}
    onClick={() => !isCompleted && onStartDaily()}
    >
      {/* Glowing accent */}
      <div className={cn(
        'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30',
        isCompleted ? 'bg-neon-green' : 'bg-accent'
      )} />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2">
          <div className={cn(
            'p-2 rounded-lg',
            isCompleted ? 'bg-neon-green/20' : 'bg-accent/20'
          )}>
            <Calendar className={cn(
              'w-5 h-5',
              isCompleted ? 'text-neon-green' : 'text-accent'
            )} />
          </div>
          <div>
            <h3 className="font-pixel text-xs sm:text-sm text-foreground">
              DAGLIG UTMANING
            </h3>
            <p className="font-retro text-sm text-muted-foreground capitalize">
              {dateStr}
            </p>
          </div>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-1 text-neon-green">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-retro text-sm">Klarad!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-accent animate-pulse-glow">
              NY!
            </span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 font-retro text-sm relative">
        {/* Daily streak */}
        <div className="flex items-center gap-1">
          <Flame className={cn(
            'w-4 h-4',
            progress.dailyStreak > 0 ? 'text-neon-red' : 'text-muted-foreground'
          )} />
          <span className={progress.dailyStreak > 0 ? 'text-neon-red' : 'text-muted-foreground'}>
            {progress.dailyStreak} dagars streak
          </span>
        </div>

        {/* Reward preview or result */}
        {isCompleted ? (
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-current" />
            <span>{todayChallenge.stars} stjärnor</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-neon-purple">
            <Gift className="w-4 h-4" />
            <span>+{potentialBonus} bonus XP</span>
          </div>
        )}
      </div>

      {/* Best time if completed */}
      {isCompleted && todayChallenge.bestTime && (
        <div className="flex items-center gap-1 mt-2 font-retro text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            Tid: {Math.floor(todayChallenge.bestTime / 60)}:{(todayChallenge.bestTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}

      {/* CTA for incomplete */}
      {!isCompleted && (
        <div className="mt-3 flex items-center justify-center gap-2 py-2 bg-accent/10 rounded-lg border border-accent/30">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-pixel text-xs text-accent">
            SPELA NU!
          </span>
        </div>
      )}
    </div>
  );
}
