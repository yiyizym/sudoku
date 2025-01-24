interface DLXNode {
    left: DLXNode | null;
    right: DLXNode | null;
    up: DLXNode | null;
    down: DLXNode | null;
    column: DLXNode | null;
    row: number | null; // Row of the matrix (for solution mapping)
}

class DLX {
    header: DLXNode;
    columns: DLXNode[];
    rows: DLXNode[][]; // Keep track of all node for matrix and mapping
    solution: number[] = [];

    constructor(matrix: number[][]) {
        this.header = this.createHeader(matrix[0].length);
        this.columns = this.createColumns(matrix);
        this.rows = this.createRows(matrix);
        this.linkMatrix(); // Link the row nodes into col nodes
    }

    private createHeader(cols: number): DLXNode {
        const header: DLXNode = {
            left: null,
            right: null,
            up: null,
            down: null,
            column: null,
            row: null,
        };
        let current = header;
        for (let i = 0; i < cols; i++) {
            const colNode: DLXNode = {
                left: current,
                right: null,
                up: null,
                down: null,
                column: null,
                row: null,
            };
            current.right = colNode;
            current = colNode;
        }
        current.right = header;
        header.left = current;
        return header;
    }

    private createColumns(matrix: number[][]): DLXNode[] {
        const columns: DLXNode[] = [];
        let current = this.header.right as DLXNode;
        for (let i = 0; current !== this.header; i++) {
            current.column = current;
            columns.push(current);
            current = current.right!;
        }
        return columns;
    }

    private createRows(matrix: number[][]): DLXNode[][] {
        const rows: DLXNode[][] = [];
        for (let i = 0; i < matrix.length; i++) {
            const rowNodes: DLXNode[] = [];
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j] === 1) {
                    const node: DLXNode = {
                        left: null,
                        right: null,
                        up: null,
                        down: null,
                        column: this.columns[j],
                        row: i,
                    };
                    rowNodes.push(node);
                }
            }
            rows.push(rowNodes);
        }
        return rows;
    }

    private linkMatrix() {
        for (let rowNodes of this.rows) {
            if (rowNodes.length > 0) {
                let first = rowNodes[0];
                let last = first;
                for (let i = 1; i < rowNodes.length; i++) {
                    let node = rowNodes[i];
                    last.right = node;
                    node.left = last;
                    last = node;
                }
                first.left = last;
                last.right = first;
            }
        }

        for (let i = 0; i < this.columns.length; i++) {
            let colNode = this.columns[i];
            let first: DLXNode | null = null;
            let last: DLXNode | null = null;
            for (let rowNodes of this.rows) {
                for (let node of rowNodes) {
                    if (node.column == colNode) {
                        if (first == null) {
                            first = node;
                        } else {
                            last!.down = node;
                            node.up = last;
                        }
                        last = node
                    }
                }
            }
            if (last != null) {
                last!.down = colNode;
                colNode.up = last;

                colNode.down = first;
                if (first != null) first.up = colNode;
            }
        }
    }

    private coverColumn(column: DLXNode): void {
        column.left!.right = column.right;
        column.right!.left = column.left;

        let current = column.down as DLXNode;
        while (current !== column) {
            let rowCurrent = current.right as DLXNode;
            while (rowCurrent !== current) {
                rowCurrent.up!.down = rowCurrent.down;
                rowCurrent.down!.up = rowCurrent.up;
                rowCurrent = rowCurrent.right!;
            }
            current = current.down as DLXNode;
        }
    }


    private uncoverColumn(column: DLXNode): void {
        let current = column.up as DLXNode;
        while (current !== column) {
            let rowCurrent = current.left as DLXNode;
            while (rowCurrent !== current) {
                rowCurrent.up!.down = rowCurrent;
                rowCurrent.down!.up = rowCurrent;
                rowCurrent = rowCurrent.left!;
            }
            current = current.up as DLXNode;
        }

        column.left!.right = column;
        column.right!.left = column;
    }


    solve(solution: number[] = []): boolean {
        if (this.header.right === this.header) {
            this.solution = solution;
            return true; // Found a solution!
        }
        let column: DLXNode = this.chooseColumnRandomWithMin();
        this.coverColumn(column);

        let rowCurrent = column.down as DLXNode;
        while (rowCurrent !== column) {
            solution.push(rowCurrent.row!);
            let rowNext = rowCurrent.right as DLXNode;
            while (rowNext !== rowCurrent) {
                this.coverColumn(rowNext.column!);
                rowNext = rowNext.right!;
            }
            if (this.solve(solution)) {
                return true;
            }

            rowNext = rowCurrent.left as DLXNode;
            while (rowNext !== rowCurrent) {
                this.uncoverColumn(rowNext.column!);
                rowNext = rowNext.left!;
            }
            solution.pop();
            rowCurrent = rowCurrent.down as DLXNode;
        }

        this.uncoverColumn(column);
        return false; // No solution found in this branch
    }


    private chooseColumn(): DLXNode {
        return this.header.right!;
    }

    private chooseColumnRandomWithMin(): DLXNode {
        // min column
        let minSize = Infinity;
        let bestColumn: DLXNode[] = [];
        let current = this.header.right as DLXNode;

        while (current != this.header) {
            let count = 0;
            let curr = current.down as DLXNode;
            // if the board is correctly set, should not have this case
            // but it might happen as we try to fill the board with random number (when we try to generate the board and ensure there is only one solution)
            if (!curr) {
                return this.header.right!;
            }
            while (curr != current) {
                count++;
                curr = curr.down as DLXNode;
            }
            if (count < minSize) {
                minSize = count;
                bestColumn = [current];
            } else if (count == minSize) {
                bestColumn.push(current);
            }
            current = current.right!;
        }
        if (bestColumn.length == 0) return this.header.right!; // return first if nothing is chosen
        const randomIndex = Math.floor(Math.random() * bestColumn.length);
        return bestColumn[randomIndex];
    }
}

function solveSudoku(board: number[][]): number[][] | null {
    const matrix = createSudokuMatrix(board);
    const dlx = new DLX(matrix);
    if (dlx.solve()) {
        return mapSolution(dlx.solution);
    }
    return null;
}


function createSudokuMatrix(board: number[][]): number[][] {
    const rows = 9;
    const cols = 9;
    const numConstraints = rows * cols * 4;

    // suppose the board has board[][]

    const matrix: number[][] = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            for (let num = 1; num <= 9; num++) {
                const matrixRow = Array(numConstraints).fill(0);
                if (board[row][col] == 0 || board[row][col] == num) {
                    const index = row * 9 + col;
                    matrixRow[index] = 1; // Cell constraint
                    matrixRow[rows * cols + (row * 9 + num - 1)] = 1 // row constraint
                    matrixRow[rows * cols * 2 + (col * 9 + num - 1)] = 1; // col constraint
                    matrixRow[rows * cols * 3 + (Math.floor(row / 3) * 3 + Math.floor(col / 3)) * 9 + (num - 1)] = 1;
                }
                matrix.push(matrixRow);
            }
        }
    }

    return matrix
}

function mapSolution(solution: number[]): number[][] {
    const board: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
    for (const row of solution) {
        const r = Math.floor(row / 81)
        const c = Math.floor((row % 81) / 9)
        const n = (row % 9) + 1;
        board[r][c] = n;
    }
    return board;
}

// Example Usage
// const board: number[][] = [
//     [5, 3, 0, 0, 7, 0, 0, 0, 0],
//     [6, 0, 0, 1, 9, 5, 0, 0, 0],
//     [0, 9, 8, 0, 0, 0, 0, 6, 0],
//     [8, 0, 0, 0, 6, 0, 0, 0, 3],
//     [4, 0, 0, 8, 0, 3, 0, 0, 1],
//     [7, 0, 0, 0, 2, 0, 0, 0, 6],
//     [0, 6, 0, 0, 0, 0, 2, 8, 0],
//     [0, 0, 0, 4, 1, 9, 0, 0, 5],
//     [0, 0, 0, 0, 8, 0, 0, 7, 9],
// ];

// const solvedBoard = solveSudoku(board);

// if (solvedBoard) {
//     console.table(solvedBoard);
//     // solvedBoard.forEach(row => console.log(row));
// } else {
//     console.log("No solution found");
// }

export { solveSudoku };
