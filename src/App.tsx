import React from 'react';
import './App.css';
import Grid from "./components/grid";
import { randomPuzzle } from "./components/backend/index";
import { parseGrid } from "./components/backend/grid";

interface AppState {
  grid: string;
}

class App extends React.Component<{},AppState>{
  public state = {
    grid: randomPuzzle(),
  }
  render(): JSX.Element|null {
    const values = parseGrid(this.state.grid)
    console.log('values ', values)
    return values ? (<Grid
      values={values}
    ></Grid>) : null
  }
}

export default App;
