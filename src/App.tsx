import React from 'react';
import Grid from "./components/grid";
import DigitPanel from './components/digitPanel';
import './components/backend';
import { ValueType, squares, peers, digits } from './components/backend/basics';
import GamePanel from './components/gamePanel';
import { generate } from './components/backend/generate';
import { search } from './components/backend/solve';
import { Mode } from './schema'

interface AppState {
  mode: Mode;
  initialValues: ValueType;
  currentValues: ValueType;
  digitChosen: string;
  solved: ValueType;
  gameKey: number;
  markedDigits: ValueType;
}

class App extends React.Component<{},AppState>{
  public state: AppState = {
    mode: 'fill',
    digitChosen: '',
    initialValues: {},
    currentValues: {},
    solved: {},
    markedDigits: {},
    gameKey: 0
  }


  private toggleMode = (e: KeyboardEvent): any => {
    switch (e.code) {
      case 'Space':
        this.setState({ mode: this.state.mode === 'fill' ? 'mark' : 'fill' });
        break;
      default:
        break;
    }
  }

  private updateValues = (id: string): void => {
    const newValues = {
      ...this.state.currentValues,
      [id]: [this.state.digitChosen]
    }
    this.setState({ currentValues: newValues })
  }

  private checkPosibility = (id: string): boolean => {
    const posibleValues = {
      ...this.state.currentValues,
      [id]: [this.state.digitChosen]
    }
    return  !!search(posibleValues)
  }

  private checkAndSetDigit = (id: string): void => {
    const { solved, digitChosen } = this.state
    const valid = digitChosen === solved[id][0]
    if (valid || this.checkPosibility(id)) { // checkPosibility 性能差，只有当 valid 为 falsy 时才触发
      this.removeUselessMarked(id)
      this.updateValues(id)
      return
    }
    console.log('choose wrong digit')
  }

  private updateMarked = (id: string, newMarkedDigits: string[]): void => {
    const newDigits = {
      ...this.state.markedDigits,
      [id]: newMarkedDigits
    }
    this.setState({ markedDigits: newDigits })
  }

  private removeUselessMarked = (id: string): void => {
    const peer = peers[id]
    const {markedDigits: markedDigitsCopy, digitChosen} = this.state
    for (const key in markedDigitsCopy) {
      if (markedDigitsCopy.hasOwnProperty(key) && peer.has(key)) {
        let newMarkedList = markedDigitsCopy[key];
        newMarkedList = newMarkedList.filter(d => d !== digitChosen)
        markedDigitsCopy[key] = newMarkedList;
      }
    }
    this.setState({ markedDigits: markedDigitsCopy });
  }

  public componentDidMount(): void {
    this.initGame()
    this.listenToKeyPress()
  }

  public componentWillUnmount(): void {
    this.unListenToKeyPress()
  }

  private pickValues = (solved: ValueType): ValueType =>{
    const pickedValue: ValueType = {}
    for (const key in solved) {
      if (solved.hasOwnProperty(key)) {
        const unSeal = Math.random() > 0.60
        pickedValue[key] = unSeal ? solved[key] : digits
      }
    }
    return pickedValue
  } 

  private initMarkedDigits = (): ValueType => {
    let marked: ValueType = {}
    squares.forEach((s): void => {
      marked[s] = []
    })
    return marked
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
 
  private initGame = async (): Promise<void> => {
    const result = await fetch('http://localhost:3001/get_grid');
    if (!result.ok) {
        return;
    }
    const json = await result.json() as { board: string, solvedBoard: string };
    // we should call the rest api to get the initialValues and solvedValues, keep the gameKeys
    const solved = this.generateGrid(json.solvedBoard);
    const initialValues = this.generateGrid(json.board);
    const gameKey = + new Date()
    const initialMarkedDigits = this.generateGrid('');
    console.log('>>> solved: ', solved);
      // {"A1":["1"],"A2":["4"],"A3":["3"],"A4":["2"],"A5":["6"],"A6":["9"],"A7":["5"],"A8":["8"],"A9":["7"],"B1":["2"],"B2":["8"],"B3":["6"],"B4":["7"],"B5":["1"],"B6":["5"],"B7":["3"],"B8":["9"],"B9":["4"],"C1":["5"],"C2":["9"],"C3":["7"],"C4":["3"],"C5":["8"],"C6":["4"],"C7":["1"],"C8":["2"],"C9":["6"],"D1":["3"],"D2":["5"],"D3":["1"],"D4":["9"],"D5":["2"],"D6":["7"],"D7":["6"],"D8":["4"],"D9":["8"],"E1":["7"],"E2":["6"],"E3":["8"],"E4":["5"],"E5":["4"],"E6":["1"],"E7":["2"],"E8":["3"],"E9":["9"],"F1":["9"],"F2":["2"],"F3":["4"],"F4":["6"],"F5":["3"],"F6":["8"],"F7":["7"],"F8":["5"],"F9":["1"],"G1":["6"],"G2":["1"],"G3":["5"],"G4":["4"],"G5":["9"],"G6":["2"],"G7":["8"],"G8":["7"],"G9":["3"],"H1":["8"],"H2":["7"],"H3":["9"],"H4":["1"],"H5":["5"],"H6":["3"],"H7":["4"],"H8":["6"],"H9":["2"],"I1":["4"],"I2":["3"],"I3":["2"],"I4":["8"],"I5":["7"],"I6":["6"],"I7":["9"],"I8":["1"],"I9":["5"]}
    console.log('>>> initialValues: ', initialValues);
      // {"A1":["1","2","3","4","5","6","7","8","9"],"A2":["1","2","3","4","5","6","7","8","9"],"A3":["3"],"A4":["1","2","3","4","5","6","7","8","9"],"A5":["1","2","3","4","5","6","7","8","9"],"A6":["1","2","3","4","5","6","7","8","9"],"A7":["1","2","3","4","5","6","7","8","9"],"A8":["8"],"A9":["1","2","3","4","5","6","7","8","9"],"B1":["2"],"B2":["8"],"B3":["6"],"B4":["1","2","3","4","5","6","7","8","9"],"B5":["1","2","3","4","5","6","7","8","9"],"B6":["5"],"B7":["1","2","3","4","5","6","7","8","9"],"B8":["1","2","3","4","5","6","7","8","9"],"B9":["1","2","3","4","5","6","7","8","9"],"C1":["1","2","3","4","5","6","7","8","9"],"C2":["1","2","3","4","5","6","7","8","9"],"C3":["1","2","3","4","5","6","7","8","9"],"C4":["3"],"C5":["8"],"C6":["4"],"C7":["1"],"C8":["1","2","3","4","5","6","7","8","9"],"C9":["1","2","3","4","5","6","7","8","9"],"D1":["1","2","3","4","5","6","7","8","9"],"D2":["1","2","3","4","5","6","7","8","9"],"D3":["1","2","3","4","5","6","7","8","9"],"D4":["1","2","3","4","5","6","7","8","9"],"D5":["2"],"D6":["1","2","3","4","5","6","7","8","9"],"D7":["6"],"D8":["1","2","3","4","5","6","7","8","9"],"D9":["1","2","3","4","5","6","7","8","9"],"E1":["7"],"E2":["1","2","3","4","5","6","7","8","9"],"E3":["8"],"E4":["1","2","3","4","5","6","7","8","9"],"E5":["1","2","3","4","5","6","7","8","9"],"E6":["1"],"E7":["1","2","3","4","5","6","7","8","9"],"E8":["3"],"E9":["1","2","3","4","5","6","7","8","9"],"F1":["1","2","3","4","5","6","7","8","9"],"F2":["2"],"F3":["1","2","3","4","5","6","7","8","9"],"F4":["6"],"F5":["1","2","3","4","5","6","7","8","9"],"F6":["1","2","3","4","5","6","7","8","9"],"F7":["1","2","3","4","5","6","7","8","9"],"F8":["5"],"F9":["1"],"G1":["1","2","3","4","5","6","7","8","9"],"G2":["1","2","3","4","5","6","7","8","9"],"G3":["1","2","3","4","5","6","7","8","9"],"G4":["1","2","3","4","5","6","7","8","9"],"G5":["1","2","3","4","5","6","7","8","9"],"G6":["1","2","3","4","5","6","7","8","9"],"G7":["8"],"G8":["1","2","3","4","5","6","7","8","9"],"G9":["1","2","3","4","5","6","7","8","9"],"H1":["1","2","3","4","5","6","7","8","9"],"H2":["1","2","3","4","5","6","7","8","9"],"H3":["9"],"H4":["1"],"H5":["1","2","3","4","5","6","7","8","9"],"H6":["1","2","3","4","5","6","7","8","9"],"H7":["4"],"H8":["1","2","3","4","5","6","7","8","9"],"H9":["1","2","3","4","5","6","7","8","9"],"I1":["4"],"I2":["1","2","3","4","5","6","7","8","9"],"I3":["2"],"I4":["8"],"I5":["1","2","3","4","5","6","7","8","9"],"I6":["6"],"I7":["9"],"I8":["1","2","3","4","5","6","7","8","9"],"I9":["5"]}
    console.log('>>> initialMarkedDigits: ', initialMarkedDigits);
      // {"A1":[],"A2":[],"A3":[],"A4":[],"A5":[],"A6":[],"A7":[],"A8":[],"A9":[],"B1":[],"B2":[],"B3":[],"B4":[],"B5":[],"B6":[],"B7":[],"B8":[],"B9":[],"C1":[],"C2":[],"C3":[],"C4":[],"C5":[],"C6":[],"C7":[],"C8":[],"C9":[],"D1":[],"D2":[],"D3":[],"D4":[],"D5":[],"D6":[],"D7":[],"D8":[],"D9":[],"E1":[],"E2":[],"E3":[],"E4":[],"E5":[],"E6":[],"E7":[],"E8":[],"E9":[],"F1":[],"F2":[],"F3":[],"F4":[],"F5":[],"F6":[],"F7":[],"F8":[],"F9":[],"G1":[],"G2":[],"G3":[],"G4":[],"G5":[],"G6":[],"G7":[],"G8":[],"G9":[],"H1":[],"H2":[],"H3":[],"H4":[],"H5":[],"H6":[],"H7":[],"H8":[],"H9":[],"I1":[],"I2":[],"I3":[],"I4":[],"I5":[],"I6":[],"I7":[],"I8":[],"I9":[]}
    this.setState({
      initialValues: initialValues ? initialValues : {},
      currentValues: initialValues ? initialValues : {},
      solved: solved,
      mode: 'fill',
      gameKey: gameKey,
      markedDigits: initialMarkedDigits
    })
  }

  private listenToKeyPress = (): void => {
    const body = document.querySelector('body') as HTMLBodyElement
    body.addEventListener('keypress', this.toggleMode)
  }
  
  private unListenToKeyPress = (): void => {
    const body = document.querySelector('body') as HTMLBodyElement
    body.removeEventListener('keypress', this.toggleMode)
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
        if(digit in map) {
          map[digit as keyof typeof map] -= 1
        }
      })
    return map
  }

  render(): JSX.Element|null {
    const { mode, currentValues, digitChosen, gameKey, markedDigits } = this.state
    
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          paddingTop: '10vh'
        }}
      >
        <GamePanel
          initGame={this.initGame}
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
        />
        <DigitPanel 
          toFillCount={this.getToFillCount()}
          digitChosen={digitChosen}
          selectDigit={(digit: string) => this.setState({digitChosen: digit})}
        />
      </div>
    )
  }
}

export default App;
