import { useState, useCallback, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSounds } from '@/hooks/useSounds';
import { WORLDS } from '@/lib/gameData';
import { MainMenu } from '@/components/game/MainMenu';
import { WorldMap } from '@/components/game/WorldMap';
import { PuzzleSelect } from '@/components/game/PuzzleSelect';
import { GameBoard } from '@/components/game/GameBoard';
import { GameHeader } from '@/components/game/GameHeader';
import { NumberPad } from '@/components/game/NumberPad';
import { PlayerStats } from '@/components/game/PlayerStats';
import { VictoryPopup } from '@/components/game/VictoryPopup';
import { DailyChallengeCard } from '@/components/game/DailyChallengeCard';
import { SoundControls } from '@/components/game/SoundControls';
import { Tutorial } from '@/components/game/Tutorial';
import { Leaderboard } from '@/components/game/Leaderboard';

type Screen = 'menu' | 'worldMap' | 'puzzleSelect' | 'game';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedWorld, setSelectedWorld] = useState<number>(1);
  const [showTutorial, setShowTutorial] = useState(false);

  const {
    gameState,
    progress,
    savedGame,
    showingVictory,
    earnedStars,
    newBadges,
    bonusXP,
    startPuzzle,
    startDailyChallenge,
    resumeSavedGame,
    clearSavedGame,
    selectCell,
    makeMove,
    clearCell,
    useHint,
    toggleTimer,
    updateProfile,
    resetProgress,
    setShowingVictory,
    completeTutorial,
    resetTutorial,
  } = useGameState();

  const sounds = useSounds();

  // Show tutorial for new players
  useEffect(() => {
    if (!progress.tutorialCompleted && screen === 'menu') {
      setShowTutorial(true);
    }
  }, [progress.tutorialCompleted, screen]);

  // Play victory sound when showing victory
  useEffect(() => {
    if (showingVictory) {
      sounds.playVictory();
    }
  }, [showingVictory]);

  const handleTutorialComplete = useCallback(() => {
    sounds.playClick();
    completeTutorial();
    setShowTutorial(false);
  }, [completeTutorial, sounds]);

  const handleTutorialSkip = useCallback(() => {
    sounds.playClick();
    completeTutorial();
    setShowTutorial(false);
  }, [completeTutorial, sounds]);

  const handleShowTutorial = useCallback(() => {
    sounds.playClick();
    setShowTutorial(true);
  }, [sounds]);

  const handleStartGame = useCallback(() => {
    sounds.playClick();
    sounds.initialize();
    setScreen('worldMap');
  }, [sounds]);

  const handleResumeSavedGame = useCallback(() => {
    sounds.playClick();
    sounds.initialize();
    resumeSavedGame();
    setScreen('game');
  }, [sounds, resumeSavedGame]);

  const handleClearSavedGame = useCallback(() => {
    sounds.playClick();
    clearSavedGame();
  }, [sounds, clearSavedGame]);

  const handleSelectWorld = useCallback((worldId: number) => {
    sounds.playClick();
    setSelectedWorld(worldId);
    setScreen('puzzleSelect');
  }, [sounds]);

  const handleSelectPuzzle = useCallback((worldId: number, puzzleIndex: number) => {
    sounds.playClick();
    setSelectedWorld(worldId);
    startPuzzle(worldId, puzzleIndex);
    setScreen('game');
  }, [startPuzzle, sounds]);

  const handleStartDaily = useCallback(() => {
    sounds.playClick();
    startDailyChallenge();
    setScreen('game');
  }, [startDailyChallenge, sounds]);

  const handleBackToMap = useCallback(() => {
    sounds.playClick();
    setShowingVictory(false);
    setScreen('worldMap');
  }, [setShowingVictory, sounds]);

  const handleBackToPuzzles = useCallback(() => {
    sounds.playClick();
    if (gameState.isDaily) {
      setScreen('worldMap');
    } else {
      setScreen('puzzleSelect');
    }
  }, [gameState.isDaily, sounds]);

  const handleNextPuzzle = useCallback(() => {
    sounds.playClick();
    const world = WORLDS.find(w => w.id === gameState.currentWorld)!;
    const nextIndex = gameState.currentPuzzle + 1;
    if (nextIndex < world.puzzleCount) {
      startPuzzle(gameState.currentWorld, nextIndex);
      setShowingVictory(false);
    }
  }, [gameState.currentWorld, gameState.currentPuzzle, startPuzzle, setShowingVictory, sounds]);

  const handleReplay = useCallback(() => {
    sounds.playClick();
    startPuzzle(gameState.currentWorld, gameState.currentPuzzle);
    setShowingVictory(false);
  }, [gameState.currentWorld, gameState.currentPuzzle, startPuzzle, setShowingVictory, sounds]);

  const handleCellClick = useCallback((row: number, col: number) => {
    sounds.playSelect();
    selectCell(row, col);
  }, [selectCell, sounds]);

  const handleNumberClick = useCallback((value: number) => {
    sounds.playNumber(value);
    
    // Check if this will be correct or error
    if (gameState.selectedCell) {
      const [row, col] = gameState.selectedCell;
      const isCorrect = value === gameState.solution[row][col];
      
      // Play sound after a tiny delay to let the number sound play first
      setTimeout(() => {
        if (isCorrect) {
          sounds.playCorrect();
        } else {
          sounds.playError();
        }
      }, 100);
    }
    
    makeMove(value);
  }, [makeMove, sounds, gameState.selectedCell, gameState.solution]);

  const handleClear = useCallback(() => {
    sounds.playClick();
    clearCell();
  }, [clearCell, sounds]);

  const handleUseHint = useCallback(() => {
    sounds.playHint();
    useHint();
  }, [useHint, sounds]);

  const currentWorld = WORLDS.find(w => w.id === gameState.currentWorld);
  const gridSize = gameState.isDaily ? 6 : (currentWorld?.gridSize || 4);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      {/* Tutorial */}
      {showTutorial && (
        <Tutorial
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}

      {/* Sound Controls - always visible */}
      <div className="fixed top-4 right-4 z-40">
        <SoundControls
          musicEnabled={sounds.settings.musicEnabled}
          sfxEnabled={sounds.settings.sfxEnabled}
          onToggleMusic={sounds.toggleMusic}
          onToggleSfx={sounds.toggleSfx}
        />
      </div>

      {/* Player stats - shown on all screens except menu */}
      {screen !== 'menu' && (
        <PlayerStats
          progress={progress}
          onUpdateProfile={updateProfile}
          onResetProgress={resetProgress}
          onShowTutorial={handleShowTutorial}
        />
      )}

      {/* Main Menu */}
      {screen === 'menu' && (
        <MainMenu 
          progress={progress} 
          savedGame={savedGame}
          onStartGame={handleStartGame} 
          onResumeSavedGame={handleResumeSavedGame}
          onClearSavedGame={handleClearSavedGame}
        />
      )}

      {/* World Map */}
      {screen === 'worldMap' && (
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Daily Challenge Card */}
          <DailyChallengeCard
            progress={progress}
            onStartDaily={handleStartDaily}
          />

          {/* Leaderboard */}
          <Leaderboard progress={progress} />
          
          {/* World Map */}
          <WorldMap
            progress={progress}
            onSelectWorld={handleSelectWorld}
            onSelectPuzzle={handleSelectPuzzle}
          />
        </div>
      )}

      {/* Puzzle Select */}
      {screen === 'puzzleSelect' && (
        <PuzzleSelect
          worldId={selectedWorld}
          progress={progress}
          onSelectPuzzle={(puzzleIndex) => handleSelectPuzzle(selectedWorld, puzzleIndex)}
          onBack={handleBackToMap}
        />
      )}

      {/* Game Screen */}
      {screen === 'game' && (gameState.isDaily || currentWorld) && (
        <div className="max-w-lg mx-auto">
          <GameHeader
            worldId={gameState.currentWorld}
            puzzleIndex={gameState.currentPuzzle}
            elapsedTime={gameState.elapsedTime}
            timerEnabled={gameState.timerEnabled}
            hintsRemaining={gameState.hintsRemaining}
            isDaily={gameState.isDaily}
            onToggleTimer={toggleTimer}
            onUseHint={handleUseHint}
            onBack={handleBackToPuzzles}
          />

          <GameBoard
            puzzle={gameState.puzzle}
            playerGrid={gameState.playerGrid}
            solution={gameState.solution}
            selectedCell={gameState.selectedCell}
            errors={gameState.errors}
            hintCell={gameState.hintCell}
            gridSize={gridSize}
            onCellClick={handleCellClick}
          />

          <NumberPad
            gridSize={gridSize}
            onNumberClick={handleNumberClick}
            onClear={handleClear}
            disabled={gameState.isComplete}
          />
        </div>
      )}

      {/* Victory Popup */}
      {showingVictory && (
        <VictoryPopup
          worldId={gameState.currentWorld}
          puzzleIndex={gameState.currentPuzzle}
          stars={earnedStars}
          timeSeconds={gameState.elapsedTime}
          newBadges={newBadges}
          isDaily={gameState.isDaily}
          bonusXP={bonusXP}
          dailyStreak={progress.dailyStreak}
          onNextPuzzle={handleNextPuzzle}
          onReplay={handleReplay}
          onBackToMap={handleBackToMap}
          onPlayStarSound={sounds.playStar}
        />
      )}

      {/* Background effects */}
      <div className="fixed inset-0 retro-grid opacity-5 pointer-events-none -z-10" />
    </div>
  );
}
