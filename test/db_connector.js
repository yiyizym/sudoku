"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getGridFromDatabase = exports.insertGridIntoDatabase = exports.initializeDatabase = exports.stringToGrid = exports.gridToString = void 0;
var sqlite3 = require("sqlite3");
var sqlite_1 = require("sqlite");
/**
 * Converts a Sudoku grid (number[][]) to a string representation.
 * Uses '0' for empty cells.
 * @param grid The Sudoku grid to convert.
 * @returns The string representation of the grid.
 */
function gridToString(grid) {
    var gridString = "";
    for (var _i = 0, grid_1 = grid; _i < grid_1.length; _i++) {
        var row = grid_1[_i];
        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
            var cell = row_1[_a];
            gridString += cell.toString(); // Convert number to string
        }
    }
    return gridString;
}
exports.gridToString = gridToString;
/**
 * Converts a string representation back to a Sudoku grid (number[][]).
 * Assumes '0' represents empty cells and parses digits 1-9 as numbers.
 * @param gridString The string representation of the grid.
 * @returns The Sudoku grid (number[][]).
 */
function stringToGrid(gridString) {
    var gridSize = 9; // Sudoku is 9x9
    var grid = [];
    if (gridString.length !== gridSize * gridSize) {
        throw new Error("Invalid grid string length. Expected 81 characters.");
    }
    for (var i = 0; i < gridSize; i++) {
        var row = [];
        for (var j = 0; j < gridSize; j++) {
            var char = gridString[i * gridSize + j];
            var digit = parseInt(char, 10); // Parse character to number
            if (isNaN(digit) || digit < 0 || digit > 9) {
                throw new Error("Invalid character in grid string at position ".concat(i * gridSize + j, ": ").concat(char));
            }
            row.push(digit);
        }
        grid.push(row);
    }
    return grid;
}
exports.stringToGrid = stringToGrid;
/**
 * Initializes the SQLite database and creates the 'sudoku_grids' table if it doesn't exist.
 * @param dbPath Path to the SQLite database file.
 * @returns A Promise that resolves with the SQLite Database object.
 */
function initializeDatabase(dbPath) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sqlite_1.open)({
                        filename: dbPath,
                        driver: sqlite3.Database
                    })];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, db.run("\n        CREATE TABLE IF NOT EXISTS sudoku_grids (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            grid_string TEXT NOT NULL\n            -- ... other columns like difficulty, date solved, etc. ...\n        )\n    ")];
                case 2:
                    _a.sent();
                    return [2 /*return*/, db];
            }
        });
    });
}
exports.initializeDatabase = initializeDatabase;
/**
 * Inserts a Sudoku grid into the 'sudoku_grids' table.
 * @param db SQLite Database object.
 * @param grid The Sudoku grid (number[][]) to insert.
 * @returns A Promise that resolves when the insertion is complete.
 */
function insertGridIntoDatabase(db, grid) {
    return __awaiter(this, void 0, void 0, function () {
        var gridStr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gridStr = gridToString(grid);
                    return [4 /*yield*/, db.run("\n        INSERT INTO sudoku_grids (grid_string) VALUES (?)\n    ", [gridStr])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.insertGridIntoDatabase = insertGridIntoDatabase;
/**
 * Retrieves a Sudoku grid from the 'sudoku_grids' table by its ID.
 * @param db SQLite Database object.
 * @param gridId The ID of the grid to retrieve.
 * @returns A Promise that resolves with the Sudoku grid (number[][]) or null if not found.
 */
function getGridFromDatabase(db, gridId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.get("\n        SELECT grid_string FROM sudoku_grids WHERE id = ?\n    ", [gridId])];
                case 1:
                    result = _a.sent();
                    if (result) {
                        return [2 /*return*/, stringToGrid(result.grid_string)];
                    }
                    else {
                        return [2 /*return*/, null]; // Grid not found
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getGridFromDatabase = getGridFromDatabase;
// Example Usage (Node.js environment) -  You would typically run this in a Node.js script
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var dbPath, db, exampleSudokuGrid, retrievedGrid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbPath = './sudoku.db';
                    return [4 /*yield*/, initializeDatabase(dbPath)];
                case 1:
                    db = _a.sent();
                    exampleSudokuGrid = [
                        [5, 3, 0, 0, 7, 0, 0, 0, 0],
                        [6, 0, 0, 1, 9, 5, 0, 0, 0],
                        [0, 9, 8, 0, 0, 0, 0, 6, 0],
                        [8, 0, 0, 0, 6, 0, 0, 0, 3],
                        [4, 0, 0, 8, 0, 3, 0, 0, 1],
                        [7, 0, 0, 0, 2, 0, 0, 0, 6],
                        [0, 6, 0, 0, 0, 0, 2, 8, 0],
                        [0, 0, 0, 4, 1, 9, 0, 0, 5],
                        [0, 0, 0, 0, 8, 0, 0, 7, 9]
                    ];
                    // Insert the example grid
                    return [4 /*yield*/, insertGridIntoDatabase(db, exampleSudokuGrid)];
                case 2:
                    // Insert the example grid
                    _a.sent();
                    console.log("Sudoku grid inserted successfully.");
                    return [4 /*yield*/, getGridFromDatabase(db, 1)];
                case 3:
                    retrievedGrid = _a.sent();
                    if (retrievedGrid) {
                        console.log("Retrieved Sudoku grid:");
                        console.log(retrievedGrid);
                    }
                    else {
                        console.log("Sudoku grid not found with ID 1.");
                    }
                    return [4 /*yield*/, db.close()];
                case 4:
                    _a.sent(); // Close the database connection
                    return [2 /*return*/];
            }
        });
    });
}
// Run the example
main()["catch"](function (err) {
    console.error("Error:", err);
});
