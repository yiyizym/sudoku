import React from 'react';

interface GamePanelProps {
  initGame: () => void;
}

class GamePanel extends React.PureComponent<GamePanelProps> {
  public render = (): JSX.Element => {
    return (<div>
      <button onClick={this.props.initGame}>(Re)Play</button>
    </div>)
  }
}

export default GamePanel;