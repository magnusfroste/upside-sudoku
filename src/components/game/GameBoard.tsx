import { Grid } from '@/lib/sudoku';
import { GameCell } from './GameCell';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  puzzle: Grid;
  playerGrid: Grid;
  solution: Grid;
  selectedCell: [number, number] | null;
  errors: Set<string>;
  hintCell: [number, number] | null;
  gridSize: 4 | 6;
  onCellClick: (row: number, col: number) => void;
}

export function GameBoard({
  puzzle,
  playerGrid,
  selectedCell,
  errors,
  hintCell,
  gridSize,
  onCellClick,
}: GameBoardProps) {
  const boxRows = gridSize === 4 ? 2 : 2;
  const boxCols = gridSize === 4 ? 2 : 3;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none z-10 opacity-30" />
      
      {/* Grid container */}
      <div
        className={cn(
          'grid gap-0 pixel-border bg-card/50 p-1',
          gridSize === 4 && 'grid-cols-4',
          gridSize === 6 && 'grid-cols-6',
        )}
      >
        {playerGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isFixed = puzzle[rowIndex][colIndex] !== null;
            const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
            const isHighlighted = selectedCell && (
              selectedCell[0] === rowIndex || 
              selectedCell[1] === colIndex ||
              (Math.floor(selectedCell[0] / boxRows) === Math.floor(rowIndex / boxRows) &&
               Math.floor(selectedCell[1] / boxCols) === Math.floor(colIndex / boxCols))
            );
            const isError = errors.has(`${rowIndex}-${colIndex}`);
            const isHint = hintCell?.[0] === rowIndex && hintCell?.[1] === colIndex;

            // Box borders
            const isRightBorder = (colIndex + 1) % boxCols === 0 && colIndex < gridSize - 1;
            const isBottomBorder = (rowIndex + 1) % boxRows === 0 && rowIndex < gridSize - 1;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'aspect-square',
                  isRightBorder && 'border-r-2 border-r-primary/50',
                  isBottomBorder && 'border-b-2 border-b-primary/50',
                )}
              >
                <GameCell
                  value={cell}
                  isFixed={isFixed}
                  isSelected={isSelected || false}
                  isHighlighted={isHighlighted || false}
                  isError={isError}
                  isHint={isHint}
                  gridSize={gridSize}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
