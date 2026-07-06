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