export type GridSize = 4 | 6;
export type Cell = number | null;
export type Grid = Cell[][];

// Generate a complete valid Sudoku grid
function generateComplete(size: GridSize): Grid {
  const grid: Grid = Array(size).fill(null).map(() => Array(size).fill(null));
  fillGrid(grid, size);
  return grid;
}

function fillGrid(grid: Grid, size: GridSize): boolean {
  const emptyCell = findEmpty(grid, size);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;
  const numbers = shuffleArray([...Array(size)].map((_, i) => i + 1));

  for (const num of numbers) {
    if (isValid(grid, row, col, num, size)) {
      grid[row][col] = num;
      if (fillGrid(grid, size)) return true;
      grid[row][col] = null;
    }
  }

  return false;
}

function findEmpty(grid: Grid, size: GridSize): [number, number] | null {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) return [row, col];
    }
  }
  return null;
}

function isValid(grid: Grid, row: number, col: number, num: number, size: GridSize): boolean {
  // Check row
  if (grid[row].includes(num)) return false;

  // Check column
  for (let r = 0; r < size; r++) {
    if (grid[r][col] === num) return false;
  }

  // Check box
  const boxRows = size === 4 ? 2 : 2;
  const boxCols = size === 4 ? 2 : 3;
  const startRow = Math.floor(row / boxRows) * boxRows;
  const startCol = Math.floor(col / boxCols) * boxCols;

  for (let r = startRow; r < startRow + boxRows; r++) {
    for (let c = startCol; c < startCol + boxCols; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create puzzle by removing cells
export function generatePuzzle(size: GridSize, difficulty: number): { puzzle: Grid; solution: Grid } {
  const solution = generateComplete(size);
  const puzzle: Grid = solution.map(row => [...row]);

  // Calculate cells to remove based on difficulty (1-10)
  const totalCells = size * size;
  const minFilled = size === 4 ? 6 : 15; // Minimum filled cells
  const maxRemove = totalCells - minFilled;
  const cellsToRemove = Math.floor((maxRemove * difficulty) / 10);

  const positions = shuffleArray(
    [...Array(totalCells)].map((_, i) => [Math.floor(i / size), i % size] as [number, number])
  );

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) break;
    puzzle[row][col] = null;
    removed++;
  }

  return { puzzle, solution };
}

export function checkMove(grid: Grid, row: number, col: number, value: number, size: GridSize): boolean {
  const testGrid = grid.map(r => [...r]);
  testGrid[row][col] = null;
  return isValid(testGrid, row, col, value, size);
}

export function isPuzzleComplete(grid: Grid, solution: Grid): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}

export function getHint(puzzle: Grid, solution: Grid): [number, number, number] | null {
  const emptyCells: [number, number][] = [];
  
  for (let row = 0; row < puzzle.length; row++) {
    for (let col = 0; col < puzzle[row].length; col++) {
      if (puzzle[row][col] === null) {
        emptyCells.push([row, col]);
      }
    }
  }

  if (emptyCells.length === 0) return null;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return [row, col, solution[row][col]!];
}

export function getDifficulty(worldId: number, puzzleIndex: number): number {
  // Gradually increase difficulty within each world
  const baseDifficulty = worldId;
  const puzzleBonus = Math.floor(puzzleIndex / 3);
  return Math.min(baseDifficulty + puzzleBonus, 8);
}
