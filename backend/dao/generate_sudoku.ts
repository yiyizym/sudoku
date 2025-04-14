import { solveSudoku } from './solve_sudoku';

function generateSudoku(rng = Math.random, clues = 25): { solvedBoard: number[][]; board: number[][] } | null {
    // 1. Generate a Complete Valid Solution
    const solvedBoard = generateSolvedSudoku(rng);
    if (!solvedBoard) {
        return null; // Could not generate valid solved board
    }
    // console.log("Solved Board:");
    // console.table(solvedBoard);
    // 2. Start Removing Numbers Randomly
    const board = solvedBoard.map(row => [...row]);
    
    const cells: { row: number, col: number }[] = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            cells.push({ row: r, col: c });
        }
    }

    // Shuffle the cells array to make it random
    shuffle(cells, rng)

    for (const cell of cells) {
        const temp = board[cell.row][cell.col];
        board[cell.row][cell.col] = 0; // Temporarily remove
        if (!isValidSudoku(board, rng)) {
            board[cell.row][cell.col] = temp; // If not unique, restore number
        }
        if (numClues(board) <= clues) break
    }
    return {solvedBoard, board};

}


function numClues(board: number[][]): number {
    let count = 0;
    for (let row of board) {
        for (let num of row) {
            if (num != 0) {
                count++
            }
        }
    }
    return count
}

function isValidSudoku(board: number[][], rng = Math.random): boolean {
    // 1. Use solver to see if there is a solution
    const solution = solveSudoku(board);

    if (!solution) return false; // No solution, then not valid.

    // 2. Ensure it is unique. Add an additional number, solve. If different, not unique.
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (let i = 1; i <= 9; i++) {
                    const temp = board[r][c]
                    board[r][c] = i;
                    const solution2 = solveSudoku(board);
                    board[r][c] = temp;
                    if (solution2) {
                        let same = true
                        for (let x = 0; x < 9; x++) {
                            for (let y = 0; y < 9; y++) {
                                if (solution[x][y] !== solution2[x][y]) {
                                    same = false
                                }
                            }
                        }
                        if (!same) return false; // Not a unique solution.
                    }
                }
            }
        }
    }

    return true // If all of the above pass, then it is valid sudoku board.
}

function generateSolvedSudoku(rng = Math.random): number[][] | null {
    const initBoard: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
    // Randomly fill the first row with numbers 1-9
    // const firstRow = Array(9).fill(0).map((_, i) => i + 1);
    // shuffle(firstRow, rng);
    // initBoard[0] = firstRow;

    // Randomly fill the upper left 3x3 grid with numbers 1-9
    // const firstGrid = Array(9).fill(0).map((_, i) => i + 1);
    // shuffle(firstGrid, rng);
    // for (let r = 0; r < 3; r++) {
    //     for (let c = 0; c < 3; c++) {
    //         initBoard[r][c] = firstGrid[r * 3 + c];
    //     }
    // }

    // Randomly fill the center 3x3 grid with numbers 1-9
    const centerGrid = Array(9).fill(0).map((_, i) => i + 1);
    shuffle(centerGrid, rng);
    for (let r = 3; r < 6; r++) {
        for (let c = 3; c < 6; c++) {
            initBoard[r][c] = centerGrid[(r-3) * 3 + c - 3];
        }
    }


    // Randomly fill the last row with numbers 1-9
    // const lastRow = Array(9).fill(0).map((_, i) => i + 1);
    // shuffle(lastRow, rng);
    // initBoard[8] = lastRow;

    // console.log("Initial Board:");
    // console.table(initBoard);

    return solveSudoku(initBoard);
}

function shuffle<T>(array: T[], rng = Math.random): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export { generateSudoku };

// Example Usage
// const result = generateSudoku(Math.random, 25);

// if (result) {
//     const { solvedBoard, board } = result;
//     console.log("Generated Sudoku Puzzle!");
//     console.table(board);
//     console.log("Solved Sudoku Puzzle!");
//     console.table(solvedBoard);
// } else {
//     console.log("Failed to generate Sudoku puzzle.");
// }
