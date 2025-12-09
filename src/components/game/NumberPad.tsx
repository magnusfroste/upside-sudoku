import { SYMBOLS_4X4 } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Eraser, Undo2 } from 'lucide-react';

interface NumberPadProps {
  gridSize: 4 | 6;
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onUndo: () => void;
  disabled: boolean;
  canUndo: boolean;
}

export function NumberPad({ gridSize, onNumberClick, onClear, onUndo, disabled, canUndo }: NumberPadProps) {
  // Ensure we get the correct number of buttons based on grid size
  const size = gridSize === 4 ? 4 : 6;
  const numbers = size === 4 
    ? SYMBOLS_4X4.map((s, i) => ({ display: s, value: i + 1 }))
    : [1, 2, 3, 4, 5, 6].map(n => ({ display: String(n), value: n }));

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-6">
      {numbers.map(({ display, value }) => (
        <button
          key={value}
          className={cn(
            'w-12 h-12 sm:w-14 sm:h-14 rounded-lg font-retro text-xl sm:text-2xl',
            'border-2 border-secondary/50 bg-card/80 text-secondary',
            'hover:bg-secondary hover:text-secondary-foreground',
            'hover:box-glow-blue transition-all duration-200',
            'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          onClick={() => onNumberClick(value)}
          disabled={disabled}
        >
          {display}
        </button>
      ))}
      <button
        className={cn(
          'w-12 h-12 sm:w-14 sm:h-14 rounded-lg',
          'border-2 border-accent/50 bg-card/80 text-accent',
          'hover:bg-accent hover:text-accent-foreground',
          'transition-all duration-200',
          'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        )}
        onClick={onUndo}
        disabled={disabled || !canUndo}
        title="Ångra"
      >
        <Undo2 className="w-6 h-6 mx-auto" />
      </button>
      <button
        className={cn(
          'w-12 h-12 sm:w-14 sm:h-14 rounded-lg',
          'border-2 border-destructive/50 bg-card/80 text-destructive',
          'hover:bg-destructive hover:text-destructive-foreground',
          'transition-all duration-200',
          'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        )}
        onClick={onClear}
        disabled={disabled}
        title="Rensa"
      >
        <Eraser className="w-6 h-6 mx-auto" />
      </button>
    </div>
  );
}
