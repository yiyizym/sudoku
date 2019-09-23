import React from 'react';
import Grid from "./components/grid";
import { parseGrid } from "./components/backend/grid";
import DigitPanel from './components/digitPanel';
import { ValueType } from './components/backend/basics';
import GamePanel from './components/gamePanel';
import { generate } from './components/backend/generate';

interface AppState {
  grid: string;
  initialValues: ValueType;
  currentValues: ValueType;
  digitChosen: string;
  solved: ValueType;
}

class App extends React.Component<{},AppState>{
  public state = {
    grid: '',
    digitChosen: '',
    initialValues: {},
    currentValues: {},
    solved: {}
  }

  private updateValues = (id: string, digitChosen: string): void => {
    const newValues = {
      ...this.state.currentValues,
      [id]: [digitChosen]
    }
    this.setState({ currentValues: newValues })
  }


  public componentDidMount(): void {
    this.initGame()
  }

  private initGame = (): void => {
    const {puzzle, solved} = generate(30)
    const initialValues = parseGrid(puzzle)
    this.setState({
      grid: puzzle,
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
        paddingTop: 100
      }}
    >
      <GamePanel
        initGame={this.initGame}
       />
      <Grid
        values={this.state.currentValues}
        solved={this.state.solved}
        digitChosen={this.state.digitChosen}
        updateValues={this.updateValues}
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
