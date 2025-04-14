import React from 'react';
import Grid from "./components/grid";
import DigitPanel from './components/digitPanel';
import { ValueType } from './components/basics';
import GamePanel from './components/gamePanel';
import { Mode } from './schema'
import MyDialog from './components/dialog';
import './App.scss';

interface AppState {
    mode: Mode;
    initialValues: ValueType;
    currentValues: ValueType;
    digitChosen: string;
    solved: ValueType;
    gameKey: number;
    markedDigits: ValueType;
    flags: string[];
    isFlagOn: boolean;
    historyStack: string[];
    historyIndex: number;
    isDialogOpen: boolean;
    level: string;
}

class App extends React.Component<{}, AppState> {
    public state: AppState = {
        mode: 'fill',
        digitChosen: '',
        initialValues: {},
        currentValues: {},
        solved: {},
        markedDigits: {},
        gameKey: 0,
        flags: [],
        isFlagOn: false,
        historyStack: [],
        historyIndex: 0,
        isDialogOpen: false,
        level: 'medium'
    }


    private shortCuts = (e: KeyboardEvent): any => {
        switch (e.code) {
            case 'Space':
                this.setState({ mode: this.state.mode === 'fill' ? 'mark' : 'fill' });
                break;
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
            case 'Digit6':
            case 'Digit7':
            case 'Digit8':
            case 'Digit9':
                this.setChosenKey(e.key);
                break;
            default:
                break;
        }
    }

    private setChosenKey = (digitChosen: string): void => {
        const toFillCount = this.getToFillCount();
        if (!digitChosen || !toFillCount[digitChosen]) { return }
        this.setState({ digitChosen })
    }

    private updateValues = (id: string): void => {
        const newValues = {
            ...this.state.currentValues,
            [id]: [this.state.digitChosen]
        }
        console.log('newValues: ', newValues)
        this.setState({ currentValues: newValues })
    }

    private checkAndSetDigit = (id: string): void => {
        console.log('choose id: ', id); // id is something like C6
        this.replaceOrPushStack(id);
        this.updateValues(id)
    }

    private replaceOrPushStack = (id: string): void => {
        if (this.state.historyIndex < this.state.historyStack.length) {
            // should drop the values equal or greater than index
            const newStack = this.state.historyStack.slice(0, this.state.historyIndex);
            newStack.push(id + '_' + this.state.digitChosen)
            this.setState({ historyStack: newStack, historyIndex: newStack.length })
        } else {
            const newStack = [...this.state.historyStack, id + '_' + this.state.digitChosen];
            this.setState({ historyStack: newStack, historyIndex: newStack.length })
            // just push the values
        }
    }


    private toStackTop = (): void => {
        if (this.state.historyIndex < this.state.historyStack.length) {
            // set the grid by the stack values
            const value = this.state.historyStack[this.state.historyIndex];
            const [id, digit] = value.split('_');
            const newValues = {
                ...this.state.currentValues,
                [id]: [digit]
            }
            this.setState({ historyIndex: this.state.historyIndex + 1, currentValues: newValues })
        }
    }

    private toStackBottom = (): void => {
        if (this.state.historyIndex > 0) {
            const value = this.state.historyStack[this.state.historyIndex - 1];
            const [id,] = value.split('_');
            const newValues = {
                ...this.state.currentValues,
                [id]: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
            }
            this.setState({ historyIndex: this.state.historyIndex - 1, currentValues: newValues })
        }
    }

    private updateMarked = (id: string, newMarkedDigits: string[]): void => {
        const newDigits = {
            ...this.state.markedDigits,
            [id]: newMarkedDigits
        }
        this.setState({ markedDigits: newDigits })
    }

    private updateFlags = (id: string): void => {
        const copyFlags = [...this.state.flags]
        if (copyFlags.includes(id)) {
            this.setState({ flags: copyFlags.filter((flag) => flag !== id) })
        } else {
            this.setState({ flags: [...copyFlags, id] })
        }
    }

    public componentDidMount(): void {
        this.initGame()
        this.listenToKeyPress()
    }

    public componentWillUnmount(): void {
        this.unListenToKeyPress()
    }

    private generateGrid = (initialString: string) => {
        const initialValues = {} as Record<string, string[]>;
        const rows = 'ABCDEFGHI';
        const columns = '123456789';
        if (!initialString) {
            for (let i = 0; i < 81; i++) {
                const row = rows[Math.floor(i / 9)];
                const column = columns[i % 9];
                initialValues[`${row}${column}`] = [];
            }
            return initialValues;
        }
        for (let i = 0; i < initialString.length; i++) {
            const row = rows[Math.floor(i / 9)];
            const column = columns[i % 9];
            const value = initialString[i];
            if (value !== '0') {
                initialValues[`${row}${column}`] = [value];
            } else {
                initialValues[`${row}${column}`] = Array(9).fill(1).map((_, index) => String(index + 1));
            }
        }
        return initialValues;
    };

    private getBundledBordData = async () => {
        // we will get a bunch of data from the localStorage or from the rest api
        const { level } = this.state;
        const data = localStorage.getItem('sudoku_data');
        if (data) {
            const parsedData = JSON.parse(data);
            return parsedData[level] || null;
        }
        const result = await fetch(SERVICE_URL);
        if (!result.ok) {
            return null;
        }
        const json = await result.json();
        localStorage.setItem('sudoku_data', JSON.stringify(json));
        return json[level] || null;
    }

    private initGame = async (): Promise<void> => {
        const { level } = this.state;
        const result = await this.getBundledBordData();
        if (!result) {
            return;
        }
        // pick one from the result
        const randomIndex = Math.floor(Math.random() * result.length);
        const randomBoardData = result[randomIndex] as { board: string, solvedBoard: string };;
        // we should call the rest api to get the initialValues and solvedValues, keep the gameKeys
        const solved = this.generateGrid(randomBoardData.solvedBoard);
        const initialValues = this.generateGrid(randomBoardData.board);
        const gameKey = + new Date()
        const initialMarkedDigits = this.generateGrid('');
        // console.log('>>> solved: ', solved);
        // {"A1":["1"],"A2":["4"],"A3":["3"],"A4":["2"],"A5":["6"],"A6":["9"],"A7":["5"],"A8":["8"],"A9":["7"],"B1":["2"],"B2":["8"],"B3":["6"],"B4":["7"],"B5":["1"],"B6":["5"],"B7":["3"],"B8":["9"],"B9":["4"],"C1":["5"],"C2":["9"],"C3":["7"],"C4":["3"],"C5":["8"],"C6":["4"],"C7":["1"],"C8":["2"],"C9":["6"],"D1":["3"],"D2":["5"],"D3":["1"],"D4":["9"],"D5":["2"],"D6":["7"],"D7":["6"],"D8":["4"],"D9":["8"],"E1":["7"],"E2":["6"],"E3":["8"],"E4":["5"],"E5":["4"],"E6":["1"],"E7":["2"],"E8":["3"],"E9":["9"],"F1":["9"],"F2":["2"],"F3":["4"],"F4":["6"],"F5":["3"],"F6":["8"],"F7":["7"],"F8":["5"],"F9":["1"],"G1":["6"],"G2":["1"],"G3":["5"],"G4":["4"],"G5":["9"],"G6":["2"],"G7":["8"],"G8":["7"],"G9":["3"],"H1":["8"],"H2":["7"],"H3":["9"],"H4":["1"],"H5":["5"],"H6":["3"],"H7":["4"],"H8":["6"],"H9":["2"],"I1":["4"],"I2":["3"],"I3":["2"],"I4":["8"],"I5":["7"],"I6":["6"],"I7":["9"],"I8":["1"],"I9":["5"]}
        // console.log('>>> initialValues: ', initialValues);
        // {"A1":["1","2","3","4","5","6","7","8","9"],"A2":["1","2","3","4","5","6","7","8","9"],"A3":["3"],"A4":["1","2","3","4","5","6","7","8","9"],"A5":["1","2","3","4","5","6","7","8","9"],"A6":["1","2","3","4","5","6","7","8","9"],"A7":["1","2","3","4","5","6","7","8","9"],"A8":["8"],"A9":["1","2","3","4","5","6","7","8","9"],"B1":["2"],"B2":["8"],"B3":["6"],"B4":["1","2","3","4","5","6","7","8","9"],"B5":["1","2","3","4","5","6","7","8","9"],"B6":["5"],"B7":["1","2","3","4","5","6","7","8","9"],"B8":["1","2","3","4","5","6","7","8","9"],"B9":["1","2","3","4","5","6","7","8","9"],"C1":["1","2","3","4","5","6","7","8","9"],"C2":["1","2","3","4","5","6","7","8","9"],"C3":["1","2","3","4","5","6","7","8","9"],"C4":["3"],"C5":["8"],"C6":["4"],"C7":["1"],"C8":["1","2","3","4","5","6","7","8","9"],"C9":["1","2","3","4","5","6","7","8","9"],"D1":["1","2","3","4","5","6","7","8","9"],"D2":["1","2","3","4","5","6","7","8","9"],"D3":["1","2","3","4","5","6","7","8","9"],"D4":["1","2","3","4","5","6","7","8","9"],"D5":["2"],"D6":["1","2","3","4","5","6","7","8","9"],"D7":["6"],"D8":["1","2","3","4","5","6","7","8","9"],"D9":["1","2","3","4","5","6","7","8","9"],"E1":["7"],"E2":["1","2","3","4","5","6","7","8","9"],"E3":["8"],"E4":["1","2","3","4","5","6","7","8","9"],"E5":["1","2","3","4","5","6","7","8","9"],"E6":["1"],"E7":["1","2","3","4","5","6","7","8","9"],"E8":["3"],"E9":["1","2","3","4","5","6","7","8","9"],"F1":["1","2","3","4","5","6","7","8","9"],"F2":["2"],"F3":["1","2","3","4","5","6","7","8","9"],"F4":["6"],"F5":["1","2","3","4","5","6","7","8","9"],"F6":["1","2","3","4","5","6","7","8","9"],"F7":["1","2","3","4","5","6","7","8","9"],"F8":["5"],"F9":["1"],"G1":["1","2","3","4","5","6","7","8","9"],"G2":["1","2","3","4","5","6","7","8","9"],"G3":["1","2","3","4","5","6","7","8","9"],"G4":["1","2","3","4","5","6","7","8","9"],"G5":["1","2","3","4","5","6","7","8","9"],"G6":["1","2","3","4","5","6","7","8","9"],"G7":["8"],"G8":["1","2","3","4","5","6","7","8","9"],"G9":["1","2","3","4","5","6","7","8","9"],"H1":["1","2","3","4","5","6","7","8","9"],"H2":["1","2","3","4","5","6","7","8","9"],"H3":["9"],"H4":["1"],"H5":["1","2","3","4","5","6","7","8","9"],"H6":["1","2","3","4","5","6","7","8","9"],"H7":["4"],"H8":["1","2","3","4","5","6","7","8","9"],"H9":["1","2","3","4","5","6","7","8","9"],"I1":["4"],"I2":["1","2","3","4","5","6","7","8","9"],"I3":["2"],"I4":["8"],"I5":["1","2","3","4","5","6","7","8","9"],"I6":["6"],"I7":["9"],"I8":["1","2","3","4","5","6","7","8","9"],"I9":["5"]}
        // console.log('>>> initialMarkedDigits: ', initialMarkedDigits);
        // {"A1":[],"A2":[],"A3":[],"A4":[],"A5":[],"A6":[],"A7":[],"A8":[],"A9":[],"B1":[],"B2":[],"B3":[],"B4":[],"B5":[],"B6":[],"B7":[],"B8":[],"B9":[],"C1":[],"C2":[],"C3":[],"C4":[],"C5":[],"C6":[],"C7":[],"C8":[],"C9":[],"D1":[],"D2":[],"D3":[],"D4":[],"D5":[],"D6":[],"D7":[],"D8":[],"D9":[],"E1":[],"E2":[],"E3":[],"E4":[],"E5":[],"E6":[],"E7":[],"E8":[],"E9":[],"F1":[],"F2":[],"F3":[],"F4":[],"F5":[],"F6":[],"F7":[],"F8":[],"F9":[],"G1":[],"G2":[],"G3":[],"G4":[],"G5":[],"G6":[],"G7":[],"G8":[],"G9":[],"H1":[],"H2":[],"H3":[],"H4":[],"H5":[],"H6":[],"H7":[],"H8":[],"H9":[],"I1":[],"I2":[],"I3":[],"I4":[],"I5":[],"I6":[],"I7":[],"I8":[],"I9":[]}

        this.setState({
            initialValues: initialValues ? initialValues : {},
            currentValues: initialValues ? initialValues : {},
            solved: solved,
            mode: 'fill',
            isFlagOn: false,
            flags: [],
            gameKey: gameKey,
            historyStack: [],
            historyIndex: 0,
            isDialogOpen: false,
            level,
            markedDigits: initialMarkedDigits
        })
    }

    private listenToKeyPress = (): void => {
        const body = document.querySelector('body') as HTMLBodyElement
        body.addEventListener('keypress', this.shortCuts)
    }

    private unListenToKeyPress = (): void => {
        const body = document.querySelector('body') as HTMLBodyElement
        body.removeEventListener('keypress', this.shortCuts)
    }

    private getToFillCount(): { [key: string]: number } {
        const map = {
            '1': 9,
            '2': 9,
            '3': 9,
            '4': 9,
            '5': 9,
            '6': 9,
            '7': 9,
            '8': 9,
            '9': 9
        };
        Object.values<string[]>(this.state.currentValues)
            .forEach(
                (values: string[]): void => {
                    const digit = values.length === 1 ? values[0] : '0'
                    if (digit in map) {
                        map[digit as keyof typeof map] -= 1
                    }
                })
        return map
    }

    private showHelp = (): void => {
        this.setState({ isDialogOpen: true });
    }

    private handleDialogClose = (returnValue?: string) => {
        this.setState({ isDialogOpen: false });
    }

    private toggleFlag = (): void => {
        this.setState({ isFlagOn: !this.state.isFlagOn })
    }

    private toggleLevel = (): void => {
        const newLevel = this.state.level === 'easy' ? 'medium' : this.state.level === 'medium' ? 'hard' : 'easy'
        this.setState({ level: newLevel }, () => {
            this.initGame()
        })
    }

    render(): JSX.Element | null {
        const { mode, currentValues, digitChosen, gameKey, markedDigits, isDialogOpen, flags, isFlagOn } = this.state

        return (
            <div
                className='app'
            >
                <GamePanel
                    initGame={this.initGame}
                    undo={this.toStackBottom}
                    redo={this.toStackTop}
                    showHelp={this.showHelp}
                    isFlagOn={isFlagOn}
                    toggleFlag={this.toggleFlag}
                    level={this.state.level}
                    toggleLevel={this.toggleLevel}
                />
                <Grid
                    key={gameKey}
                    markedDigits={markedDigits}
                    values={currentValues}
                    mode={mode}
                    digitChosen={digitChosen}
                    updateValues={this.updateValues}
                    checkAndSetDigit={this.checkAndSetDigit}
                    updateMarked={this.updateMarked}
                    flags={flags}
                    updateFlags={this.updateFlags}
                    isFlagOn={isFlagOn}
                />
                <DigitPanel
                    toFillCount={this.getToFillCount()}
                    digitChosen={digitChosen}
                    selectDigit={(digit: string) => this.setState({ digitChosen: digit })}
                />
                <MyDialog
                    isOpen={isDialogOpen}
                    onClose={this.handleDialogClose}
                    title="Instructions"
                >
                    <p>Click the "Net Game" button on the left side to start new game</p>
                    <p>Click the "Undo" button on the left side to undo the last action</p>
                    <p>Click the "Redo" button on the left side to redo the last action</p>
                    <p>Click the "Help" button on the left side to show the help </p>

                    <p>Click the digits on the ride side to choose what to fill in</p>
                    <p>The current digits to be filled in is high lighted with blue color</p>

                    <p>You can also use keyboard shortCuts to control the game</p>
                    <p>Press 1 to 9 to select what digit to fill in</p>
                    <p>Use the Flag to help you mark the digit that you're not sure it's correct</p>
                    <p>We have two modes: one is fill in the selected digit directly, another is mark the possible digits inside one cell. Press "Space" to swith the mode</p>
                </MyDialog>
            </div>
        )
    }
}

export default App;
