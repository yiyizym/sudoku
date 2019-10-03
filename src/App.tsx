import React from 'react';
import Grid from "./components/grid";
import DigitPanel from './components/digitPanel';
import { ValueType, squares, peers } from './components/backend/basics';
import GamePanel from './components/gamePanel';
import { generate } from './components/backend/generate';
import { digits } from './components/backend/basics'
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
 
  private initGame = (): void => {
    const solved = generate(30)
    const initialValues = this.pickValues(solved)
    const gameKey = + new Date()
    const initialMarkedDigits = this.initMarkedDigits()
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
          mode={mode}
          changeMode={(mode: Mode): void => this.setState({ mode })}
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
