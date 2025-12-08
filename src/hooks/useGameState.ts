import { useState, useCallback, useEffect } from 'react';
import { generatePuzzle, isPuzzleComplete, getHint, getDifficulty, Grid, GridSize } from '@/lib/sudoku';
import { PlayerProgress, DEFAULT_PROGRESS, WORLDS, XP_PER_STAR, checkNewBadges, calculateLevel, Badge } from '@/lib/gameData';
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
}

const MAX_HINTS = 3;

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
  });

  const [showingVictory, setShowingVictory] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

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
    });
    setShowingVictory(false);
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    if (gameState.puzzle[row]?.[col] !== null) return; // Can't select fixed cells
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

    // Auto-fill after a short delay
    setTimeout(() => {
      setGameState(prev => {
        const newGrid = prev.playerGrid.map(r => [...r]);
        newGrid[row][col] = value;
        const complete = isPuzzleComplete(newGrid, prev.solution);
        
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

    const xpEarned = stars * XP_PER_STAR;

    const newProgress: PlayerProgress = {
      ...progress,
      xp: progress.xp + xpEarned,
      level: calculateLevel(progress.xp + xpEarned),
      totalStars: progress.totalStars + stars,
      puzzlesSolved: progress.puzzlesSolved + 1,
      currentStreak: progress.currentStreak + 1,
      bestStreak: Math.max(progress.bestStreak, progress.currentStreak + 1),
      worldProgress: {
        ...progress.worldProgress,
        [gameState.currentWorld]: [
          ...(progress.worldProgress[gameState.currentWorld] || []),
          gameState.currentPuzzle,
        ].filter((v, i, a) => a.indexOf(v) === i),
      },
    };

    // Check for new badges
    const badges = checkNewBadges(newProgress, !gameState.usedHints, timeSeconds);
    if (badges.length > 0) {
      newProgress.badges = [...newProgress.badges, ...badges.map(b => b.id)];
    }

    // Save best time
    const puzzleKey = `${gameState.currentWorld}-${gameState.currentPuzzle}`;
    if (!progress.bestTimes[puzzleKey] || timeSeconds < progress.bestTimes[puzzleKey]) {
      newProgress.bestTimes = {
        ...progress.bestTimes,
        [puzzleKey]: timeSeconds,
      };
    }

    setProgress(newProgress);
    setEarnedStars(stars);
    setNewBadges(badges);
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

  return {
    gameState,
    progress,
    showingVictory,
    earnedStars,
    newBadges,
    startPuzzle,
    selectCell,
    makeMove,
    clearCell,
    useHint,
    toggleTimer,
    updateProfile,
    resetProgress,
    setShowingVictory,
  };
}
