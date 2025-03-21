import React from 'react';
import "./index.scss";

interface GamePanelProps {
    initGame: () => void;
    undo: () => void;
    redo: () => void;
    showHelp: () => void;
    isFlagOn: boolean;
    toggleFlag: () => void;
}

class GamePanel extends React.PureComponent<GamePanelProps> {
    public render = (): JSX.Element => {
        const { initGame, undo, redo, showHelp, isFlagOn, toggleFlag } = this.props;
        return (<div
            className='game-panel'
        >
            <button onClick={initGame}>New Game</button>
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
            <button onClick={showHelp}>Help</button>
            <button onClick={toggleFlag}>{isFlagOn ? 'Flag is On' : 'Flag is Off'}</button>
        </div>)
    }
}

export default GamePanel;