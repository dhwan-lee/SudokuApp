/**
 * Checks if a specifc number placement violates any Sudoku constraints
 */
export const checkIsInvalid = (
    row: number,
    col: number,
    value: number,
    board: number[][],
): boolean => {
    if (value === 0) return false;

    // Row conflict
    for (let c = 0; c < 9; c++) {
        if (c !== col && board[row][c] === value) return true;
    }

    // Column conflict
    for (let r = 0; r < 9; r++) {
        if (r !== row && board[r][col] === value) return true;
    }

    // 3 x 3 box conflict
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;

    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
        for (let c = boxColStart; c < boxColStart + 3; c++) {
            if ((r !== row || c !== col) && board[r][c] === value) return true;
        }
    }

    return false;
};

/**
 * Scans the entire board to check if the puzzle has been succesfully solved.
 * Returns true only if all cells are filled and zero conflicts exists.
 */
export const checkWinCondition = (board: number[][]): boolean => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const value = board[r][c];

            // If there is a blank cell, the game isn't finished yet
            if (value === 0) return false;

            // If any cell is invalid, it's not correct solution
            if (checkIsInvalid(r, c, value, board)) return false;
        }
    }

    // The board is full and perfect
    return true;
};

// Backtracking Algorithm Solver Engine
export const solveSudokuMatrix = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            // Find an empty slot
            if (board[row][col] === 0) {
                // Try digits 1 through 9
                for (let num = 1; num <= 9; num++) {
                    // Temporarily check if placing this number violates any rules
                    if (!checkIsInvalid(row, col, num, board)) {
                        board[row][col] = num;

                        // Recursively attempt to solve the rest of the board with this guess
                        if (solveSudokuMatrix(board)) return true

                        // BACKTRACK: if that guess failed downstream, undo it and try the next digit
                        board[row][col] = 0;
                    }
                }
                // Triggers backtracking up the recursion chain if no 1-9 works
                return false;
            }
        }
    }
    // Every single slot has been successfully filled without conflict
    return true;
};

// Helper to shuffle an array randomly using the Fisher-Yates algorithm
const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Algorithmic Dynamic Board Generator Engine
export const generateRandomSudoku = (level: 'easy' | 'medium' | 'hard'): { startingBoard: number[][], solvedBoard: number[][] } => {
  // Initialize a completely blank 9x9 matrix
  const matrix: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));

  // Randomized Backtracking Solver to fill the board completely
  const fillBoardRandomly = (grid: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          // Scramble numbers 1-9 to ensure structural randomness
          const randomNumbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

          for (const num of randomNumbers) {
            if (!checkIsInvalid(row, col, num, grid)) {
              grid[row][col] = num;

              if (fillBoardRandomly(grid)) return true;

              grid[row][col] = 0; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Generate the full solution matrix
  fillBoardRandomly(matrix);

  // Keep a perfect copy of the solution to double check wins later if needed
  const solvedBoard = matrix.map(r => [...r]);

  // 3. Carve holes out of the board based on difficulty metrics
  let cellsToRemove = 35; // Easy fallback
  if (level === 'medium') cellsToRemove = 45;
  if (level === 'hard') cellsToRemove = 54;

  const startingBoard = matrix.map(r => [...r]);
  let removedCount = 0;

  while (removedCount < cellsToRemove) {
    const randomRow = Math.floor(Math.random() * 9);
    const randomCol = Math.floor(Math.random() * 9);

    // Only clear it if it isn't already empty
    if (startingBoard[randomRow][randomCol] !== 0) {
      startingBoard[randomRow][randomCol] = 0;
      removedCount++;
    }
  }

  return { startingBoard, solvedBoard };
};