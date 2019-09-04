import React from 'react';
import './App.css';
import Grid from "./components/grid";
import { randomPuzzle } from "./components/backend/index";
import { parseGrid } from "./components/backend/grid";
import DigitPanel from './components/digitPanel';

interface AppState {
  grid: string;
  initialValues: { [key: string]: string[]};
  digitChosen: string;
}

class App extends React.Component<{},AppState>{
  public state = {
    grid: '',
    initialValues: {},
    digitChosen: '',
  }


  public componentDidMount(): void {
    const grid = randomPuzzle()
    const initialValues = parseGrid(grid)
    this.setState({
      grid: grid,
      initialValues: initialValues ? initialValues : {}
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
    Object.values<string[]>(this.state.initialValues)
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
    const values = parseGrid(this.state.grid)
    return (<div
      style={{
        display: 'flex',
      }}
    >
      <Grid
        values={values}
        digitChosen={this.state.digitChosen}
        fillDigit={(...args) => { console.log(...args) }}
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
