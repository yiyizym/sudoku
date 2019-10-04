import React from 'react';

interface GamePanelProps {
  initGame: () => void;
}

class GamePanel extends React.PureComponent<GamePanelProps> {
  public render = (): JSX.Element => {
    const { initGame } = this.props;
    return (<div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '10vh'
      }}
    >
      <button onClick={initGame}>(Re)Play</button>
    </div>)
  }
}

export default GamePanel;