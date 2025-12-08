export interface World {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  puzzleCount: number;
  gridSize: 4 | 6;
  requiredStars: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'puzzles' | 'streak' | 'noHints' | 'speed' | 'stars' | 'daily';
}

export interface DailyChallenge {
  date: string;
  completed: boolean;
  stars: number;
  bestTime: number | null;
}

export interface PlayerProgress {
  name: string;
  avatar: string;
  xp: number;
  level: number;
  totalStars: number;
  puzzlesSolved: number;
  currentStreak: number;
  bestStreak: number;
  badges: string[];
  worldProgress: Record<number, number[]>;
  bestTimes: Record<string, number>;
  dailyChallenges: Record<string, DailyChallenge>;
  dailyStreak: number;
  bestDailyStreak: number;
  tutorialCompleted: boolean;
}

export const WORLDS: World[] = [
  {
    id: 1,
    name: "Hawkins Lab",
    description: "Hemliga experiment väntar...",
    icon: "🔬",
    color: "world-lab",
    puzzleCount: 10,
    gridSize: 4,
    requiredStars: 0,
  },
  {
    id: 2,
    name: "The Arcade",
    description: "Klassiska spel och mysterier!",
    icon: "🕹️",
    color: "world-arcade",
    puzzleCount: 10,
    gridSize: 4,
    requiredStars: 15,
  },
  {
    id: 3,
    name: "Starcourt Mall",
    description: "80-talets shopping-paradis!",
    icon: "🛒",
    color: "world-mall",
    puzzleCount: 10,
    gridSize: 6,
    requiredStars: 35,
  },
  {
    id: 4,
    name: "The Upside Down",
    description: "Mörka krafter lurar...",
    icon: "🌀",
    color: "world-upside",
    puzzleCount: 10,
    gridSize: 6,
    requiredStars: 60,
  },
  {
    id: 5,
    name: "Victory!",
    description: "Slutstriden börjar!",
    icon: "⚡",
    color: "world-victory",
    puzzleCount: 10,
    gridSize: 6,
    requiredStars: 90,
  },
];

export const BADGES: Badge[] = [
  { id: 'first_puzzle', name: 'Första Pusslet!', description: 'Lös ditt första pussel', icon: '🎯', requirement: 1, type: 'puzzles' },
  { id: 'puzzle_10', name: 'Pusselproffs', description: 'Lös 10 pussel', icon: '🏆', requirement: 10, type: 'puzzles' },
  { id: 'puzzle_25', name: 'Sudoku-Mästare', description: 'Lös 25 pussel', icon: '👑', requirement: 25, type: 'puzzles' },
  { id: 'puzzle_50', name: 'Legendär!', description: 'Lös 50 pussel', icon: '🌟', requirement: 50, type: 'puzzles' },
  { id: 'streak_3', name: 'På Rulle!', description: '3 pussel i rad utan fel', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak_5', name: 'Eldig Streak!', description: '5 pussel i rad', icon: '💥', requirement: 5, type: 'streak' },
  { id: 'no_hints_5', name: 'Ingen Hjälp!', description: '5 pussel utan hints', icon: '🧠', requirement: 5, type: 'noHints' },
  { id: 'speed_demon', name: 'Snabbis!', description: 'Lös ett pussel på under 60 sekunder', icon: '⚡', requirement: 60, type: 'speed' },
  { id: 'star_collector', name: 'Stjärnsamlare', description: 'Samla 30 stjärnor', icon: '✨', requirement: 30, type: 'stars' },
  { id: 'star_master', name: 'Stjärnmästare', description: 'Samla 100 stjärnor', icon: '🌠', requirement: 100, type: 'stars' },
  { id: 'daily_first', name: 'Första Dagliga!', description: 'Klara din första dagliga utmaning', icon: '📅', requirement: 1, type: 'daily' },
  { id: 'daily_7', name: 'Vecko-Mästare', description: '7 dagliga utmaningar i rad', icon: '🗓️', requirement: 7, type: 'daily' },
  { id: 'daily_30', name: 'Månads-Legend', description: '30 dagliga utmaningar i rad', icon: '📆', requirement: 30, type: 'daily' },
];

export const AVATARS = ['🧒', '👧', '🦸', '🧙', '🤖', '👽', '🐱', '🦊'];

export const SYMBOLS_4X4 = ['🚲', '🧇', '📻', '💡'];
export const SYMBOLS_6X6 = ['1', '2', '3', '4', '5', '6'];

export const XP_PER_STAR = 25;
export const XP_PER_LEVEL = 100;
export const DAILY_BONUS_XP = 50;
export const DAILY_STREAK_BONUS = 10;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
}

export function getUnlockedWorlds(totalStars: number): number[] {
  return WORLDS.filter(w => totalStars >= w.requiredStars).map(w => w.id);
}

export function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export function getDailyDifficulty(): number {
  // Vary difficulty based on day of week (easier on weekends)
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return 4; // Weekend - easier
  return 5 + Math.floor(dayOfWeek / 2); // Weekdays - harder
}

export function getDailySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

export function checkNewBadges(progress: PlayerProgress, noHintsUsed: boolean, timeSeconds: number): Badge[] {
  const newBadges: Badge[] = [];
  
  BADGES.forEach(badge => {
    if (progress.badges.includes(badge.id)) return;
    
    let earned = false;
    switch (badge.type) {
      case 'puzzles':
        earned = progress.puzzlesSolved >= badge.requirement;
        break;
      case 'streak':
        earned = progress.currentStreak >= badge.requirement;
        break;
      case 'noHints':
        earned = noHintsUsed && progress.puzzlesSolved >= badge.requirement;
        break;
      case 'speed':
        earned = timeSeconds <= badge.requirement;
        break;
      case 'stars':
        earned = progress.totalStars >= badge.requirement;
        break;
      case 'daily':
        earned = progress.dailyStreak >= badge.requirement;
        break;
    }
    
    if (earned) {
      newBadges.push(badge);
    }
  });
  
  return newBadges;
}

export const DEFAULT_PROGRESS: PlayerProgress = {
  name: 'Spelare',
  avatar: '🧒',
  xp: 0,
  level: 1,
  totalStars: 0,
  puzzlesSolved: 0,
  currentStreak: 0,
  bestStreak: 0,
  badges: [],
  worldProgress: {},
  bestTimes: {},
  dailyChallenges: {},
  dailyStreak: 0,
  bestDailyStreak: 0,
  tutorialCompleted: false,
};
