import React from 'react';
import Grid from "./components/grid";
import DigitPanel from './components/digitPanel';
import { ValueType } from './components/backend/basics';
import GamePanel from './components/gamePanel';
import { generate } from './components/backend/generate';
import { digits } from './components/backend/basics'
import { search } from './components/backend/solve';

interface AppState {
  initialValues: ValueType;
  currentValues: ValueType;
  digitChosen: string;
  solved: ValueType;
}

class App extends React.Component<{},AppState>{
  public state: AppState = {
    digitChosen: '',
    initialValues: {},
    currentValues: {},
    solved: {}
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
      this.updateValues(id)
      return
    }
    console.log('choose wrong digit')
  }


  public componentDidMount(): void {
    this.initGame()
  }

  private pickValues = (solved: ValueType): ValueType =>{
    const pickedValue: ValueType = {}
    for (const key in solved) {
      if (solved.hasOwnProperty(key)) {
        // 30 / 81
        const unSeal = Math.random() > 0.55
        pickedValue[key] = unSeal ? solved[key] : digits
      }
    }
    return pickedValue
  } 
 
  private initGame = (): void => {
    const solved = generate(30)
    const initialValues = this.pickValues(solved)
    this.setState({
      initialValues: initialValues ? initialValues : {},
      currentValues: initialValues ? initialValues : {},
      solved: solved
    })
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
    return (<div
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
        values={this.state.currentValues}
        digitChosen={this.state.digitChosen}
        updateValues={this.updateValues}
        checkAndSetDigit={this.checkAndSetDigit}
      />
      <DigitPanel 
        toFillCount={this.getToFillCount()}
        digitChosen={this.state.digitChosen}
        selectDigit={(digit: string) => this.setState({digitChosen: digit})}
      />
      </div>)
  }
}

export default App;
