import { PlayerProgress } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Play, Trophy, Star, Calendar, Flame } from 'lucide-react';

interface MainMenuProps {
  progress: PlayerProgress;
  onStartGame: () => void;
}

export function MainMenu({ progress, onStartGame }: MainMenuProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Animated title */}
      <div className="mb-8 relative">
        <h1 className="font-pixel text-2xl sm:text-4xl text-primary text-glow-pink animate-pulse-glow leading-relaxed">
          UPSIDE DOWN
        </h1>
        <h1 className="font-pixel text-3xl sm:text-5xl text-secondary text-glow-blue mt-2">
          SUDOKU
        </h1>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 text-2xl animate-float" style={{ animationDelay: '0s' }}>
          ⚡
        </div>
        <div className="absolute -top-2 -right-6 text-xl animate-float" style={{ animationDelay: '0.5s' }}>
          🌀
        </div>
        <div className="absolute -bottom-2 -left-8 text-xl animate-float" style={{ animationDelay: '1s' }}>
          🔬
        </div>
        <div className="absolute -bottom-4 -right-4 text-2xl animate-float" style={{ animationDelay: '1.5s' }}>
          🕹️
        </div>
      </div>

      {/* Tagline */}
      <p className="font-retro text-xl text-muted-foreground mb-8 max-w-md">
        Lös mystiska pussel och rädda Hawkins från The Upside Down!
      </p>

      {/* Quick stats if returning player */}
      {progress.puzzlesSolved > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 font-retro text-lg">
          <div className="flex items-center gap-2 text-accent">
            <Star className="w-5 h-5 fill-current" />
            <span>{progress.totalStars} stjärnor</span>
          </div>
          <div className="flex items-center gap-2 text-neon-purple">
            <Trophy className="w-5 h-5" />
            <span>{progress.puzzlesSolved} pussel</span>
          </div>
          {progress.dailyStreak > 0 && (
            <div className="flex items-center gap-2 text-neon-red">
              <Flame className="w-5 h-5" />
              <span>{progress.dailyStreak} dagars streak</span>
            </div>
          )}
        </div>
      )}

      {/* Play button */}
      <button
        onClick={onStartGame}
        className={cn(
          'group relative px-12 py-6 font-pixel text-xl',
          'border-4 border-primary bg-primary/10 text-primary',
          'hover:bg-primary hover:text-primary-foreground',
          'transition-all duration-300 hover:scale-105',
          'box-glow-pink',
        )}
      >
        <span className="flex items-center gap-3">
          <Play className="w-6 h-6 group-hover:animate-pulse" />
          {progress.puzzlesSolved > 0 ? 'FORTSÄTT' : 'STARTA'}
        </span>
      </button>

      {/* Retro grid background effect */}
      <div className="fixed inset-0 retro-grid opacity-10 pointer-events-none -z-10" />
      
      {/* Animated scanlines */}
      <div className="fixed inset-0 scanlines opacity-20 pointer-events-none -z-10" />
    </div>
  );
}
