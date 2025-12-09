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
  // Ensure proper display value
  const getDisplayValue = () => {
    if (value === null) return '';
    if (gridSize === 4) {
      return SYMBOLS_4X4[value - 1] || value.toString();
    }
    return value.toString();
  };

  return (
    <button
      className={cn(
        'w-full h-full flex items-center justify-center',
        'border border-border/30 bg-card/80',
        'text-lg sm:text-xl md:text-2xl font-retro',
        'transition-all duration-200 cursor-pointer',
        'hover:bg-muted/50',
        isFixed && 'text-secondary cursor-default',
        !isFixed && 'text-foreground',
        isSelected && 'bg-primary/30 border-primary box-glow-pink',
        isHighlighted && !isSelected && 'bg-secondary/20',
        isError && 'text-destructive animate-pulse',
        isHint && 'bg-neon-green/30 box-glow-green',
        gridSize === 4 && 'text-xl sm:text-2xl md:text-3xl',
      )}
      onClick={onClick}
      disabled={isFixed}
    >
      {getDisplayValue()}
    </button>
  );
}
