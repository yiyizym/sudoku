import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { getRandomGridFromDatabase, getRandomGridByLevelFromDatabase, Level } from './dao/db_connector';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
const port = 3001;


app.get('/get_grid', async (req, res) => {
    const db = await open({
        filename: path.resolve(__dirname, './dao/sudoku.db'),
        driver: sqlite3.Database
    });
    const level = req.query.level as Level;
    if (level === undefined || !(typeof level === 'string' && ['easy', 'medium', 'hard'].includes(level.toLowerCase()))) {
        const result = await getRandomGridFromDatabase(db);
        return res.json(result);
    } else {
        const result = await getRandomGridByLevelFromDatabase(db, level);
        return res.json(result);
    }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});