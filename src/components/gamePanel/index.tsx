import React from 'react';
import { Mode } from '../../schema';

interface GamePanelProps {
  initGame: () => void;
  changeMode: (mode: Mode) => void;
  mode: Mode;
}

class GamePanel extends React.PureComponent<GamePanelProps> {
  public render = (): JSX.Element => {
    const { mode, initGame, changeMode } = this.props;
    return (<div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <button onClick={initGame}>(Re)Play</button>
      <select
        value={mode}
        onChange={(e): void => changeMode(e.target.value as Mode)}
      >
        <option value="fill">fill mode</option>
        <option value="note">note mode</option>
      </select>
    </div>)
  }
}

export default GamePanel;