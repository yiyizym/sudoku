import { generateSudoku } from './generate_sudoku';
import { initializeDatabase, insertGridIntoDatabase } from './db_connector'

async function main() {
    const dbPath = './sudoku.db'; // Path to your SQLite database file
    const db = await initializeDatabase(dbPath);
    const clue = 10;


    for (let i = 0; i < 100; i++) {
        console.log(`Generating ${i+1} Sudoku grid`);
        const result = generateSudoku(Math.random, clue);
        if (!result) {
            console.log('Generate sudoku failed!');
            return;
        }
        const { board, solvedBoard } = result;
        // Insert the example grid
        console.log(`Generated ${i+1} Sudoku grid`);
        await insertGridIntoDatabase(db, board, solvedBoard, clue);
        console.log(`Inserted ${i+1} Sudoku grid`);
    }
    console.log("Sudoku grid inserted successfully.");

    // Retrieve the grid we just inserted (assuming it's the first one, ID 1)
    // const retrievedGrid = await getGridFromDatabase(db, 1);
    // if (retrievedGrid) {
    //     console.log("Retrieved Sudoku grid:");
    //     console.table(retrievedGrid);
    // } else {
    //     console.log("Sudoku grid not found with ID 1.");
    // }

    await db.close(); // Close the database connection
}

main().catch(err => {
    console.error("Error:", err);
});