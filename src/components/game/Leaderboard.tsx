import { PlayerProgress } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Trophy, Clock, Star, Flame, Calendar, Medal, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface LeaderboardProps {
  progress: PlayerProgress;
}

type TabType = 'bestTimes' | 'recentDaily' | 'records';

export function Leaderboard({ progress }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('bestTimes');

  // Get sorted daily challenges by time (fastest first)
  const dailyEntries = Object.entries(progress.dailyChallenges)
    .filter(([_, challenge]) => challenge.completed && challenge.bestTime !== null)
    .map(([date, challenge]) => ({
      date,
      time: challenge.bestTime!,
      stars: challenge.stars,
    }))
    .sort((a, b) => a.time - b.time);

  // Get recent daily challenges (most recent first)
  const recentEntries = Object.entries(progress.dailyChallenges)
    .filter(([_, challenge]) => challenge.completed)
    .map(([date, challenge]) => ({
      date,
      time: challenge.bestTime!,
      stars: challenge.stars,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  // Calculate records
  const totalDailiesCompleted = Object.values(progress.dailyChallenges).filter(c => c.completed).length;
  const averageTime = dailyEntries.length > 0 
    ? Math.round(dailyEntries.reduce((sum, e) => sum + e.time, 0) / dailyEntries.length)
    : 0;
  const totalDailyStars = dailyEntries.reduce((sum, e) => sum + e.stars, 0);
  const perfectDailies = dailyEntries.filter(e => e.stars === 3).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  const tabs = [
    { id: 'bestTimes' as TabType, label: 'Bästa Tider', icon: Trophy },
    { id: 'recentDaily' as TabType, label: 'Senaste', icon: Calendar },
    { id: 'records' as TabType, label: 'Rekord', icon: TrendingUp },
  ];

  return (
    <div className="w-full bg-card/50 border border-border/50 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-accent" />
        <h3 className="font-pixel text-sm text-primary">LEADERBOARD</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-muted/30 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-retro text-sm transition-all',
              activeTab === tab.id
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {/* Best Times Tab */}
        {activeTab === 'bestTimes' && (
          <div className="space-y-2">
            {dailyEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground font-retro">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Inga dagliga utmaningar ännu!</p>
                <p className="text-sm">Klara din första för att se tider här.</p>
              </div>
            ) : (
              dailyEntries.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.date}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-all',
                    index === 0 && 'bg-yellow-500/10 border border-yellow-500/30',
                    index === 1 && 'bg-gray-500/10 border border-gray-500/30',
                    index === 2 && 'bg-amber-600/10 border border-amber-600/30',
                    index > 2 && 'bg-muted/20'
                  )}
                >
                  {/* Rank */}
                  <div className={cn('w-8 text-center font-pixel text-lg', getMedalColor(index))}>
                    {index < 3 ? (
                      <Medal className="w-6 h-6 mx-auto" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex-1">
                    <p className="font-retro text-foreground">{formatDate(entry.date)}</p>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(star => (
                      <Star
                        key={star}
                        className={cn(
                          'w-4 h-4',
                          star <= entry.stars ? 'text-accent fill-accent' : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-secondary font-retro">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(entry.time)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Recent Daily Tab */}
        {activeTab === 'recentDaily' && (
          <div className="space-y-2">
            {recentEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground font-retro">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Inga dagliga utmaningar ännu!</p>
              </div>
            ) : (
              recentEntries.map((entry, index) => (
                <div
                  key={entry.date}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/20"
                >
                  {/* Date */}
                  <div className="flex-1">
                    <p className="font-retro text-foreground">{formatDate(entry.date)}</p>
                    {index === 0 && (
                      <span className="text-xs text-neon-green font-retro">Senaste</span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(star => (
                      <Star
                        key={star}
                        className={cn(
                          'w-4 h-4',
                          star <= entry.stars ? 'text-accent fill-accent' : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-secondary font-retro">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(entry.time)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-neon-green/10 border border-neon-green/30 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-neon-green" />
              <p className="font-pixel text-lg text-neon-green">
                {dailyEntries.length > 0 ? formatTime(dailyEntries[0].time) : '--:--'}
              </p>
              <p className="font-retro text-sm text-muted-foreground">Bästa Tid</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <p className="font-pixel text-lg text-secondary">
                {averageTime > 0 ? formatTime(averageTime) : '--:--'}
              </p>
              <p className="font-retro text-sm text-muted-foreground">Snitt</p>
            </div>

            <div className="p-4 rounded-lg bg-neon-red/10 border border-neon-red/30 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-neon-red" />
              <p className="font-pixel text-lg text-neon-red">{progress.bestDailyStreak}</p>
              <p className="font-retro text-sm text-muted-foreground">Bästa Streak</p>
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-accent fill-accent" />
              <p className="font-pixel text-lg text-accent">{totalDailyStars}</p>
              <p className="font-retro text-sm text-muted-foreground">Dagliga Stjärnor</p>
            </div>

            <div className="p-4 rounded-lg bg-neon-purple/10 border border-neon-purple/30 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-neon-purple" />
              <p className="font-pixel text-lg text-neon-purple">{totalDailiesCompleted}</p>
              <p className="font-retro text-sm text-muted-foreground">Totalt Klara</p>
            </div>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="font-pixel text-lg text-yellow-500">{perfectDailies}</p>
              <p className="font-retro text-sm text-muted-foreground">Perfekta (3⭐)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
