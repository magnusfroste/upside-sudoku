import { PlayerProgress, BADGES, calculateLevel, xpToNextLevel, XP_PER_LEVEL, AVATARS } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Star, Zap, Flame, Trophy, Settings, Calendar, BookOpen } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlayerStatsProps {
  progress: PlayerProgress;
  onUpdateProfile: (name: string, avatar: string) => void;
  onResetProgress: () => void;
  onShowTutorial: () => void;
}

export function PlayerStats({ progress, onUpdateProfile, onResetProgress, onShowTutorial }: PlayerStatsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState(progress.name);
  const [editAvatar, setEditAvatar] = useState(progress.avatar);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const xpProgress = ((progress.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  const earnedBadges = BADGES.filter(b => progress.badges.includes(b.id));

  const handleSaveProfile = () => {
    onUpdateProfile(editName, editAvatar);
    setShowSettings(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      {/* Main stats bar */}
      <div className="flex items-center gap-3 p-3 bg-card/50 border border-border/50 rounded-lg">
        {/* Avatar & Name */}
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="text-3xl">{progress.avatar}</div>
          <div className="text-left">
            <p className="font-pixel text-xs text-primary">{progress.name}</p>
            <p className="font-retro text-sm text-muted-foreground">Nivå {progress.level}</p>
          </div>
        </button>

        <div className="flex-1 ml-2">
          {/* XP Bar */}
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-neon-green" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-green transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <span className="font-retro text-xs text-muted-foreground">
              {xpToNextLevel(progress.xp)} XP
            </span>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 font-retro text-sm">
            <span className="flex items-center gap-1 text-accent">
              <Star className="w-3 h-3 fill-current" />
              {progress.totalStars}
            </span>
            <span className="flex items-center gap-1 text-neon-red">
              <Flame className="w-3 h-3" />
              {progress.currentStreak}
            </span>
            <span className="flex items-center gap-1 text-neon-purple">
              <Trophy className="w-3 h-3" />
              {progress.puzzlesSolved}
            </span>
            {progress.dailyStreak > 0 && (
              <span className="flex items-center gap-1 text-accent">
                <Calendar className="w-3 h-3" />
                {progress.dailyStreak}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-card border-primary max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-pixel text-primary text-glow-pink">
              Inställningar
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Avatar selection */}
            <div>
              <label className="font-retro text-muted-foreground mb-2 block">
                Välj avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setEditAvatar(avatar)}
                    className={cn(
                      'text-3xl p-2 rounded-lg border-2 transition-all',
                      editAvatar === avatar
                        ? 'border-primary bg-primary/20'
                        : 'border-border/50 hover:border-secondary'
                    )}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="font-retro text-muted-foreground mb-2 block">
                Spelarnamn
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={12}
                className="w-full p-3 bg-input border border-border rounded-lg font-retro text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Badges */}
            <div>
              <label className="font-retro text-muted-foreground mb-2 block">
                Dina badges ({earnedBadges.length}/{BADGES.length})
              </label>
              <div className="grid grid-cols-5 gap-2">
                {BADGES.map((badge) => {
                  const earned = progress.badges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        'text-center p-2 rounded-lg border transition-all',
                        earned
                          ? 'border-accent/50 bg-accent/10'
                          : 'border-border/30 opacity-40'
                      )}
                      title={`${badge.name}: ${badge.description}`}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats summary */}
            <div className="p-3 bg-muted/30 rounded-lg font-retro text-sm space-y-1">
              <p>Totalt lösta pussel: <span className="text-neon-green">{progress.puzzlesSolved}</span></p>
              <p>Bästa streak: <span className="text-neon-red">{progress.bestStreak}</span></p>
              <p>Daglig streak: <span className="text-accent">{progress.dailyStreak}</span></p>
              <p>Bästa daglig streak: <span className="text-accent">{progress.bestDailyStreak}</span></p>
              <p>Total XP: <span className="text-secondary">{progress.xp}</span></p>
            </div>

            {/* Tutorial button */}
            <button
              onClick={() => {
                onShowTutorial();
                setShowSettings(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-secondary/50 rounded-lg font-retro text-secondary hover:bg-secondary/10 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Visa tutorial igen
            </button>

            {/* Save button */}
            <button
              onClick={handleSaveProfile}
              className="w-full neon-button neon-button-pink"
            >
              Spara ändringar
            </button>

            {/* Reset progress */}
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full font-retro text-sm text-destructive/70 hover:text-destructive transition-colors"
              >
                Återställ alla framsteg
              </button>
            ) : (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="font-retro text-sm text-destructive mb-2">
                  Är du säker? Alla framsteg försvinner!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowConfirmReset(false);
                      setShowSettings(false);
                    }}
                    className="flex-1 py-2 bg-destructive text-destructive-foreground rounded font-retro text-sm"
                  >
                    Ja, återställ
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2 border border-border rounded font-retro text-sm"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
