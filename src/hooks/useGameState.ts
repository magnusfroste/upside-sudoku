import { useState, useCallback, useEffect } from 'react';
import { generatePuzzle, isPuzzleComplete, getHint, getDifficulty, Grid } from '@/lib/sudoku';
import { 
  PlayerProgress, DEFAULT_PROGRESS, WORLDS, XP_PER_STAR, 
  checkNewBadges, calculateLevel, Badge, getTodayKey, 
  getDailyDifficulty, getDailySeed, DAILY_BONUS_XP, DAILY_STREAK_BONUS 
} from '@/lib/gameData';
import { useLocalStorage } from './useLocalStorage';

export interface GameState {
  currentWorld: number;
  currentPuzzle: number;
  puzzle: Grid;
  solution: Grid;
  playerGrid: Grid;
  selectedCell: [number, number] | null;
  hintsRemaining: number;
  hintCell: [number, number] | null;
  errors: Set<string>;
  isComplete: boolean;
  startTime: number;
  elapsedTime: number;
  timerEnabled: boolean;
  usedHints: boolean;
  isDaily: boolean;
}

const MAX_HINTS = 3;
const DAILY_HINTS = 2; // Fewer hints for daily challenge

export function useGameState() {
  const [progress, setProgress] = useLocalStorage<PlayerProgress>('upside-down-sudoku-progress', DEFAULT_PROGRESS);
  
  const [gameState, setGameState] = useState<GameState>({
    currentWorld: 1,
    currentPuzzle: 0,
    puzzle: [],
    solution: [],
    playerGrid: [],
    selectedCell: null,
    hintsRemaining: MAX_HINTS,
    hintCell: null,
    errors: new Set(),
    isComplete: false,
    startTime: Date.now(),
    elapsedTime: 0,
    timerEnabled: true,
    usedHints: false,
    isDaily: false,
  });

  const [showingVictory, setShowingVictory] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [bonusXP, setBonusXP] = useState(0);

  // Timer effect
  useEffect(() => {
    if (gameState.isComplete || !gameState.timerEnabled || gameState.puzzle.length === 0) return;

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isComplete, gameState.timerEnabled, gameState.puzzle.length]);

  const startPuzzle = useCallback((worldId: number, puzzleIndex: number) => {
    const world = WORLDS.find(w => w.id === worldId)!;
    const difficulty = getDifficulty(worldId, puzzleIndex);
    const { puzzle, solution } = generatePuzzle(world.gridSize, difficulty);

    setGameState({
      currentWorld: worldId,
      currentPuzzle: puzzleIndex,
      puzzle,
      solution,
      playerGrid: puzzle.map(row => [...row]),
      selectedCell: null,
      hintsRemaining: MAX_HINTS,
      hintCell: null,
      errors: new Set(),
      isComplete: false,
      startTime: Date.now(),
      elapsedTime: 0,
      timerEnabled: true,
      usedHints: false,
      isDaily: false,
    });
    setShowingVictory(false);
    setBonusXP(0);
  }, []);

  const startDailyChallenge = useCallback(() => {
    const todayKey = getTodayKey();
    const seed = getDailySeed();
    const difficulty = getDailyDifficulty();
    
    // Daily challenges use 6x6 grid
    const { puzzle, solution } = generatePuzzle(6, difficulty, seed);

    setGameState({
      currentWorld: 0, // 0 indicates daily challenge
      currentPuzzle: 0,
      puzzle,
      solution,
      playerGrid: puzzle.map(row => [...row]),
      selectedCell: null,
      hintsRemaining: DAILY_HINTS,
      hintCell: null,
      errors: new Set(),
      isComplete: false,
      startTime: Date.now(),
      elapsedTime: 0,
      timerEnabled: true,
      usedHints: false,
      isDaily: true,
    });
    setShowingVictory(false);
    setBonusXP(0);
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    if (gameState.puzzle[row]?.[col] !== null) return;
    setGameState(prev => ({
      ...prev,
      selectedCell: [row, col],
      hintCell: null,
    }));
  }, [gameState.puzzle]);

  const makeMove = useCallback((value: number) => {
    if (!gameState.selectedCell) return;
    
    const [row, col] = gameState.selectedCell;
    if (gameState.puzzle[row][col] !== null) return;

    const newGrid = gameState.playerGrid.map(r => [...r]);
    newGrid[row][col] = value;

    const isCorrect = value === gameState.solution[row][col];
    const cellKey = `${row}-${col}`;
    const newErrors = new Set(gameState.errors);

    if (!isCorrect) {
      newErrors.add(cellKey);
    } else {
      newErrors.delete(cellKey);
    }

    const complete = isPuzzleComplete(newGrid, gameState.solution);

    setGameState(prev => ({
      ...prev,
      playerGrid: newGrid,
      errors: newErrors,
      isComplete: complete,
    }));

    if (complete) {
      handleVictory(newErrors.size === 0);
    }
  }, [gameState]);

  const clearCell = useCallback(() => {
    if (!gameState.selectedCell) return;
    
    const [row, col] = gameState.selectedCell;
    if (gameState.puzzle[row][col] !== null) return;

    const newGrid = gameState.playerGrid.map(r => [...r]);
    newGrid[row][col] = null;

    const cellKey = `${row}-${col}`;
    const newErrors = new Set(gameState.errors);
    newErrors.delete(cellKey);

    setGameState(prev => ({
      ...prev,
      playerGrid: newGrid,
      errors: newErrors,
    }));
  }, [gameState]);

  const useHint = useCallback(() => {
    if (gameState.hintsRemaining <= 0) return;

    const hint = getHint(gameState.playerGrid, gameState.solution);
    if (!hint) return;

    const [row, col, value] = hint;
    
    setGameState(prev => ({
      ...prev,
      hintsRemaining: prev.hintsRemaining - 1,
      hintCell: [row, col],
      usedHints: true,
    }));

    setTimeout(() => {
      setGameState(prev => {
        const newGrid = prev.playerGrid.map(r => [...r]);
        newGrid[row][col] = value;
        const complete = isPuzzleComplete(newGrid, prev.solution);
        
        if (complete) {
          setTimeout(() => handleVictory(prev.errors.size === 0), 100);
        }
        
        return {
          ...prev,
          playerGrid: newGrid,
          hintCell: null,
          isComplete: complete,
        };
      });
    }, 1500);
  }, [gameState]);

  const handleVictory = useCallback((noErrors: boolean) => {
    const timeSeconds = gameState.elapsedTime;
    
    // Calculate stars
    let stars = 1;
    if (timeSeconds < 120 && noErrors) stars = 3;
    else if (timeSeconds < 180 || noErrors) stars = 2;

    let xpEarned = stars * XP_PER_STAR;
    let dailyBonusEarned = 0;

    const newProgress: PlayerProgress = { ...progress };

    if (gameState.isDaily) {
      const todayKey = getTodayKey();
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayKey = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;
      
      // Check if continuing streak
      const hadYesterdayChallenge = progress.dailyChallenges[yesterdayKey]?.completed;
      const isFirstDaily = !progress.dailyChallenges[todayKey]?.completed;
      
      if (isFirstDaily) {
        // Calculate daily streak
        const newDailyStreak = hadYesterdayChallenge ? progress.dailyStreak + 1 : 1;
        newProgress.dailyStreak = newDailyStreak;
        newProgress.bestDailyStreak = Math.max(newProgress.bestDailyStreak, newDailyStreak);
        
        // Daily bonus XP
        dailyBonusEarned = DAILY_BONUS_XP + (newDailyStreak * DAILY_STREAK_BONUS);
        xpEarned += dailyBonusEarned;
        
        // Save daily challenge completion
        newProgress.dailyChallenges = {
          ...progress.dailyChallenges,
          [todayKey]: {
            date: todayKey,
            completed: true,
            stars,
            bestTime: timeSeconds,
          },
        };
      }
    } else {
      // Regular puzzle progress
      newProgress.worldProgress = {
        ...progress.worldProgress,
        [gameState.currentWorld]: [
          ...(progress.worldProgress[gameState.currentWorld] || []),
          gameState.currentPuzzle,
        ].filter((v, i, a) => a.indexOf(v) === i),
      };

      // Save best time
      const puzzleKey = `${gameState.currentWorld}-${gameState.currentPuzzle}`;
      if (!progress.bestTimes[puzzleKey] || timeSeconds < progress.bestTimes[puzzleKey]) {
        newProgress.bestTimes = {
          ...progress.bestTimes,
          [puzzleKey]: timeSeconds,
        };
      }
    }

    newProgress.xp = progress.xp + xpEarned;
    newProgress.level = calculateLevel(newProgress.xp);
    newProgress.totalStars = progress.totalStars + stars;
    newProgress.puzzlesSolved = progress.puzzlesSolved + 1;
    newProgress.currentStreak = progress.currentStreak + 1;
    newProgress.bestStreak = Math.max(progress.bestStreak, newProgress.currentStreak);

    // Check for new badges
    const badges = checkNewBadges(newProgress, !gameState.usedHints, timeSeconds);
    if (badges.length > 0) {
      newProgress.badges = [...newProgress.badges, ...badges.map(b => b.id)];
    }

    setProgress(newProgress);
    setEarnedStars(stars);
    setNewBadges(badges);
    setBonusXP(dailyBonusEarned);
    setShowingVictory(true);
  }, [gameState, progress, setProgress]);

  const toggleTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timerEnabled: !prev.timerEnabled,
    }));
  }, []);

  const updateProfile = useCallback((name: string, avatar: string) => {
    setProgress(prev => ({
      ...prev,
      name,
      avatar,
    }));
  }, [setProgress]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, [setProgress]);

  const isTodayCompleted = useCallback(() => {
    const todayKey = getTodayKey();
    return progress.dailyChallenges[todayKey]?.completed || false;
  }, [progress.dailyChallenges]);

  const completeTutorial = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      tutorialCompleted: true,
    }));
  }, [setProgress]);

  const resetTutorial = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      tutorialCompleted: false,
    }));
  }, [setProgress]);

  return {
    gameState,
    progress,
    showingVictory,
    earnedStars,
    newBadges,
    bonusXP,
    startPuzzle,
    startDailyChallenge,
    selectCell,
    makeMove,
    clearCell,
    useHint,
    toggleTimer,
    updateProfile,
    resetProgress,
    setShowingVictory,
    isTodayCompleted,
    completeTutorial,
    resetTutorial,
  };
}
