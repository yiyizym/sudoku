import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';


// Define a type for the Sudoku grid (2D array of numbers 0-9)
export type SudokuGrid = number[][];
export type Level = 'easy' | 'medium' | 'hard';

/**
 * Converts a Sudoku grid (number[][]) to a string representation.
 * Uses '0' for empty cells.
 * @param grid The Sudoku grid to convert.
 * @returns The string representation of the grid.
 */
export function gridToString(grid: SudokuGrid): string {
    let gridString = "";
    for (const row of grid) {
        for (const cell of row) {
            gridString += cell.toString(); // Convert number to string
        }
    }
    return gridString;
}

/**
 * Converts a string representation back to a Sudoku grid (number[][]).
 * Assumes '0' represents empty cells and parses digits 1-9 as numbers.
 * @param gridString The string representation of the grid.
 * @returns The Sudoku grid (number[][]).
 */
export function stringToGrid(gridString: string): SudokuGrid {
    const gridSize = 9; // Sudoku is 9x9
    const grid: SudokuGrid = [];

    if (gridString.length !== gridSize * gridSize) {
        throw new Error("Invalid grid string length. Expected 81 characters.");
    }

    for (let i = 0; i < gridSize; i++) {
        const row: number[] = [];
        for (let j = 0; j < gridSize; j++) {
            const char = gridString[i * gridSize + j];
            const digit = parseInt(char, 10); // Parse character to number

            if (isNaN(digit) || digit < 0 || digit > 9) {
                throw new Error(`Invalid character in grid string at position ${i * gridSize + j}: ${char}`);
            }
            row.push(digit);
        }
        grid.push(row);
    }
    return grid;
}

/**
 * Initializes the SQLite database and creates the 'sudoku_grids' table if it doesn't exist.
 * @param dbPath Path to the SQLite database file.
 * @returns A Promise that resolves with the SQLite Database object.
 */
export async function initializeDatabase(dbPath: string): Promise<Database> {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.run(`
        CREATE TABLE IF NOT EXISTS sudoku_grids (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grid_string TEXT NOT NULL,
            grid_solved_string TEXT NOT NULL,
            clues INTEGER NOT NULL DEFAULT 0
            -- ... other columns like difficulty, date solved, etc. ...
        )
    `);
    return db;
}

/**
 * Inserts a Sudoku grid into the 'sudoku_grids' table.
 * @param db SQLite Database object.
 * @param grid The Sudoku grid (number[][]) to insert.
 * @returns A Promise that resolves when the insertion is complete.
 */
export async function insertGridIntoDatabase(db: Database, grid: SudokuGrid, gridSolved: SudokuGrid, clue: number): Promise<void> {
    const gridStr = gridToString(grid);
    const gridSolvedStr = gridToString(gridSolved);
    await db.run(`
        INSERT INTO sudoku_grids (grid_string, grid_solved_string, clue) VALUES (?,?,?)
    `, [gridStr, gridSolvedStr, clue]);
}

/**
 * Retrieves a Sudoku grid from the 'sudoku_grids' table by its ID.
 * @param db SQLite Database object.
 * @param gridId The ID of the grid to retrieve.
 * @returns A Promise that resolves with the Sudoku grid (number[][]) or null if not found.
 */
export async function getGridFromDatabase(db: Database, gridId: number): Promise<SudokuGrid | null> {
    const result = await db.get<{ grid_string: string }>(`
        SELECT grid_string, grid_solved_string FROM sudoku_grids WHERE id = ?
    `, [gridId]);

    if (result) {
        return stringToGrid(result.grid_string);
    } else {
        return null; // Grid not found
    }
}

export async function getRandomGridFromDatabase(db: Database): Promise<{board: string; solvedBoard: string} | null> {
    const result = await db.get<{ grid_string: string, grid_solved_string: string }>(`
        SELECT grid_string, grid_solved_string FROM sudoku_grids ORDER BY RANDOM() LIMIT 1
    `);

    if (result) {
        return { board: result.grid_string, solvedBoard: result.grid_solved_string };
    } else {
        return null; // Grid not found
    }
}

const levelMap: Record<Level, number> = {
    easy: 35,
    medium: 30,
    hard: 25
};

export async function getRandomGridByLevelFromDatabase(db: Database, level: Level): Promise<{ board: string; solvedBoard: string } | null> {
    const result = await db.get<{ grid_string: string, grid_solved_string: string }>(`
        SELECT grid_string, grid_solved_string FROM sudoku_grids where clue = ? ORDER BY RANDOM() LIMIT 1
    `, [levelMap[level] ?? 30]);

    if (result) {
        return { board: result.grid_string, solvedBoard: result.grid_solved_string };
    } else {
        return null; // Grid not found
    }
}

export async function getBundleGridByLevelFromDatabase(db: Database, level: Level, count: number): Promise<{ board: string; solvedBoard: string }[]> {
    const result = await db.all<{ grid_string: string, grid_solved_string: string }[]>(`
        SELECT grid_string, grid_solved_string FROM sudoku_grids where clue = ? ORDER BY RANDOM() LIMIT ?
    `, [levelMap[level] ?? 30, count]);
    if (result) {
        return result.map((row) => ({
            board: row.grid_string,
            solvedBoard: row.grid_solved_string
        }));
    } else {
        return []; // Grid not found
    }
}


// Example Usage (Node.js environment) -  You would typically run this in a Node.js script
// async function main() {
//     const dbPath = './sudoku.db'; // Path to your SQLite database file
//     const db = await initializeDatabase(dbPath);


//     for (let i = 0; i < 10; i++) {
//         const result = generateSudoku(Math.random, 25);
//         if (!result) {
//             console.log('Generate sudoku failed!');
//             return;
//         }
//         const { board, solvedBoard } = result;
//         // Insert the example grid
//         console.log(`Generated ${i+1} Sudoku grid`);
//         await insertGridIntoDatabase(db, board, solvedBoard);
//         console.log(`Inserted ${i+1} Sudoku grid`);
//     }
//     console.log("Sudoku grid inserted successfully.");

//     // Retrieve the grid we just inserted (assuming it's the first one, ID 1)
//     // const retrievedGrid = await getGridFromDatabase(db, 1);
//     // if (retrievedGrid) {
//     //     console.log("Retrieved Sudoku grid:");
//     //     console.table(retrievedGrid);
//     // } else {
//     //     console.log("Sudoku grid not found with ID 1.");
//     // }

//     await db.close(); // Close the database connection
// }

// Run the example
// main().catch(err => {
//     console.error("Error:", err);
// });
