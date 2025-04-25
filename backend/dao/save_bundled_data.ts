import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { Level, getBundleGridByLevelFromDatabase } from './db_connector';

const saveBundledData = async () => {

    const db = await open({
        filename: path.resolve(__dirname, './sudoku.db'),
        driver: sqlite3.Database
    });
    const resultMap: Record<Level, { board: string; solvedBoard: string }[]> = {
        easy: [],
        medium: [],
        hard: []
    };
    for (const level of ['easy', 'medium', 'hard']) {
        const result = await getBundleGridByLevelFromDatabase(db, level as Level, 10);
        if (result) {
            resultMap[level as Level] = result;
        }
    }
    // Save the resultMap to a file
    const fs = require('fs');
    const filePath = path.resolve(__dirname, './bundled_data.json');
    fs.writeFileSync(filePath, JSON.stringify(resultMap, null, 2), 'utf-8');
    console.log(`Bundled data saved to ${filePath}`);
    // Close the database connection
    await db.close();
    console.log('Database connection closed.');
    // Exit the process
    process.exit(0);
}

saveBundledData().catch((error) => {
    console.error('Error saving bundled data:', error);
    process.exit(1);
});