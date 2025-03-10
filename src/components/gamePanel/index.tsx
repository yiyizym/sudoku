import React from 'react';

interface GamePanelProps {
  initGame: () => void;
    undo: () => void;
  redo: () => void;
}

class GamePanel extends React.PureComponent<GamePanelProps> {
  public render = (): JSX.Element => {
    const { initGame, undo, redo } = this.props;
    return (<div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '10vh'
      }}
    >
      <button onClick={initGame}>(Re)Play</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>)
  }
}

export default GamePanel;