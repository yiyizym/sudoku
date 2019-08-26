import React from 'react';
import './App.css';
import Grid from "./components/grid";
import { randomPuzzle } from "./components/backend/index";
import { parseGrid } from "./components/backend/grid";
import NumberPanel from './components/numberPanel';

interface AppState {
  grid: string;
  initialValues: { [key: string]: string[]}
}

class App extends React.Component<{},AppState>{
  public state = {
    grid: '',
    initialValues: {}
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
        const num = values.length === 1 ? values[0] : '0'
        if(num in map) {
          map[num as keyof typeof map] -= 1
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
      />
      <NumberPanel 
        toFillCount={this.getToFillCount()}
        selectNumber={(num: string) => console.log(num)}
      />
      </div>)
  }
}

export default App;
