import { useState, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
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

type Screen = 'menu' | 'worldMap' | 'puzzleSelect' | 'game';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedWorld, setSelectedWorld] = useState<number>(1);

  const {
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
  } = useGameState();

  const handleStartGame = useCallback(() => {
    setScreen('worldMap');
  }, []);

  const handleSelectWorld = useCallback((worldId: number) => {
    setSelectedWorld(worldId);
    setScreen('puzzleSelect');
  }, []);

  const handleSelectPuzzle = useCallback((worldId: number, puzzleIndex: number) => {
    setSelectedWorld(worldId);
    startPuzzle(worldId, puzzleIndex);
    setScreen('game');
  }, [startPuzzle]);

  const handleStartDaily = useCallback(() => {
    startDailyChallenge();
    setScreen('game');
  }, [startDailyChallenge]);

  const handleBackToMap = useCallback(() => {
    setShowingVictory(false);
    setScreen('worldMap');
  }, [setShowingVictory]);

  const handleBackToPuzzles = useCallback(() => {
    if (gameState.isDaily) {
      setScreen('worldMap');
    } else {
      setScreen('puzzleSelect');
    }
  }, [gameState.isDaily]);

  const handleNextPuzzle = useCallback(() => {
    const world = WORLDS.find(w => w.id === gameState.currentWorld)!;
    const nextIndex = gameState.currentPuzzle + 1;
    if (nextIndex < world.puzzleCount) {
      startPuzzle(gameState.currentWorld, nextIndex);
      setShowingVictory(false);
    }
  }, [gameState.currentWorld, gameState.currentPuzzle, startPuzzle, setShowingVictory]);

  const handleReplay = useCallback(() => {
    startPuzzle(gameState.currentWorld, gameState.currentPuzzle);
    setShowingVictory(false);
  }, [gameState.currentWorld, gameState.currentPuzzle, startPuzzle, setShowingVictory]);

  const currentWorld = WORLDS.find(w => w.id === gameState.currentWorld);
  const gridSize = gameState.isDaily ? 6 : (currentWorld?.gridSize || 4);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      {/* Player stats - shown on all screens except menu */}
      {screen !== 'menu' && (
        <PlayerStats
          progress={progress}
          onUpdateProfile={updateProfile}
          onResetProgress={resetProgress}
        />
      )}

      {/* Main Menu */}
      {screen === 'menu' && (
        <MainMenu progress={progress} onStartGame={handleStartGame} />
      )}

      {/* World Map */}
      {screen === 'worldMap' && (
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Daily Challenge Card */}
          <DailyChallengeCard
            progress={progress}
            onStartDaily={handleStartDaily}
          />
          
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
            onUseHint={useHint}
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
            onCellClick={selectCell}
          />

          <NumberPad
            gridSize={gridSize}
            onNumberClick={makeMove}
            onClear={clearCell}
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
        />
      )}

      {/* Background effects */}
      <div className="fixed inset-0 retro-grid opacity-5 pointer-events-none -z-10" />
    </div>
  );
}
