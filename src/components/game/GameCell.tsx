import { cn } from '@/lib/utils';
import { SYMBOLS_4X4 } from '@/lib/gameData';

interface GameCellProps {
  value: number | null;
  isFixed: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
  isHint: boolean;
  gridSize: 4 | 6;
  onClick: () => void;
}

export function GameCell({
  value,
  isFixed,
  isSelected,
  isHighlighted,
  isError,
  isHint,
  gridSize,
  onClick,
}: GameCellProps) {
  const displayValue = value !== null
    ? (gridSize === 4 ? SYMBOLS_4X4[value - 1] : value.toString())
    : '';

  return (
    <button
      className={cn(
        'game-cell w-full h-full text-xl sm:text-2xl font-retro',
        'transition-all duration-200',
        isFixed && 'fixed',
        isSelected && 'selected',
        isHighlighted && !isSelected && 'highlighted',
        isError && 'error',
        isHint && 'hint',
        gridSize === 4 && 'text-2xl sm:text-3xl',
      )}
      onClick={onClick}
      disabled={isFixed}
    >
      <span className={cn(
        'transition-all duration-200',
        isError && 'animate-shake',
        isHint && 'animate-pulse-glow',
      )}>
        {displayValue}
      </span>
    </button>
  );
}
