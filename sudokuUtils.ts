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