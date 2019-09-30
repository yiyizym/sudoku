import React from 'react';
import { Mode } from '../../schema';

interface GamePanelProps {
  initGame: () => void;
  changeMode: (mode: Mode) => void;
  mode: Mode;
}

class GamePanel extends React.PureComponent<GamePanelProps> {
  public render = (): JSX.Element => {
    const { mode, initGame } = this.props;
    return (<div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '10vh'
      }}
    >
      <span>mode: {mode}</span>
      <button onClick={initGame}>(Re)Play</button>
    </div>)
  }
}

export default GamePanel;