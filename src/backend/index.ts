import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { getRandomGridFromDatabase } from './dao/db_connector';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
const port = 3001;


app.get('/get_grid', async (req, res) => {
    const db = await open({
        filename: path.resolve(__dirname, './sudoku.db'),
        driver: sqlite3.Database
    });
    const result = await getRandomGridFromDatabase(db);
    res.json(result);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});