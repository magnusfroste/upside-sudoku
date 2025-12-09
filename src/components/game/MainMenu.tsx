import { PlayerProgress, WORLDS } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Play, Trophy, Star, Flame, RotateCcw, X } from 'lucide-react';

interface SavedGameInfo {
  currentWorld: number;
  currentPuzzle: number;
  elapsedTime: number;
  isDaily: boolean;
  savedAt: number;
}

interface MainMenuProps {
  progress: PlayerProgress;
  savedGame: SavedGameInfo | null;
  onStartGame: () => void;
  onResumeSavedGame: () => void;
  onClearSavedGame: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getTimeSince(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} dag${days > 1 ? 'ar' : ''} sedan`;
  if (hours > 0) return `${hours} timm${hours > 1 ? 'ar' : 'e'} sedan`;
  if (minutes > 0) return `${minutes} minut${minutes > 1 ? 'er' : ''} sedan`;
  return 'just nu';
}

export function MainMenu({ progress, savedGame, onStartGame, onResumeSavedGame, onClearSavedGame }: MainMenuProps) {
  const getSavedGameLabel = () => {
    if (!savedGame) return '';
    if (savedGame.isDaily) return 'Dagens utmaning';
    const world = WORLDS.find(w => w.id === savedGame.currentWorld);
    return `${world?.name || 'Värld'} - Pussel ${savedGame.currentPuzzle + 1}`;
  };

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

      {/* Saved game resume card */}
      {savedGame && (
        <div className="mb-6 p-4 border-2 border-secondary/50 bg-secondary/10 rounded-lg max-w-sm w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="font-retro text-sm text-muted-foreground">Sparat pussel</span>
            <button 
              onClick={onClearSavedGame}
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
              title="Ta bort sparat pussel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="font-pixel text-secondary text-lg mb-2">{getSavedGameLabel()}</div>
          <div className="flex items-center justify-between text-sm text-muted-foreground font-retro mb-3">
            <span>Tid: {formatTime(savedGame.elapsedTime)}</span>
            <span>{getTimeSince(savedGame.savedAt)}</span>
          </div>
          <button
            onClick={onResumeSavedGame}
            className={cn(
              'w-full group relative px-6 py-3 font-pixel text-base',
              'border-2 border-secondary bg-secondary/20 text-secondary',
              'hover:bg-secondary hover:text-secondary-foreground',
              'transition-all duration-300',
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              FORTSÄTT PUSSEL
            </span>
          </button>
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
          {savedGame ? 'NYTT SPEL' : (progress.puzzlesSolved > 0 ? 'FORTSÄTT' : 'STARTA')}
        </span>
      </button>

      {/* Retro grid background effect */}
      <div className="fixed inset-0 retro-grid opacity-10 pointer-events-none -z-10" />
      
      {/* Animated scanlines */}
      <div className="fixed inset-0 scanlines opacity-20 pointer-events-none -z-10" />
    </div>
  );
}