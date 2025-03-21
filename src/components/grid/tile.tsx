import React from 'react';
import './tile.scss'
import { digits } from '../basics';
import { Mode } from '../../schema';

interface TileProps {
    id: string;
    digit: string;
    mode: Mode;
    isFlagged: boolean;
    isFlagOn: boolean;
    marked: string[];
    digitChosen: string;
    setDigit: (id: string) => void;
    updateMarked: (newMarked: string[]) => void;
    updateFlags: (id: string) => void;
}

class Tile extends React.PureComponent<TileProps> {

    private getMarkedTileClass = (): string => {
        const { id, isFlagged } = this.props
        const idClz = `tile-${id}`
        const markModeClz = this.isInMarkMode() ? `tile-mark-mode` : ''
        const flaggedClz = isFlagged ? 'tile-flagged' : ''
        return `tile ${idClz} tile-marked ${markModeClz} ${flaggedClz}`
    }

    private getTileClass = (): string => {
        const { digit, digitChosen, id, isFlagged } = this.props
        const hilightTextClz = digit === digitChosen ? 'tile-chosen' : ''
        const idClz = `tile-${id}`
        const flaggedClz = isFlagged ? 'tile-flagged' : ''
        return `tile ${idClz} ${hilightTextClz} ${flaggedClz}`
    }

    private mayToggleMarked = (digit: string): void => {
        if (!this.isInMarkMode()) { return }
        const { marked, updateMarked } = this.props
        const isMarked = marked.includes(digit)
        let newMarkedDigits: string[] = []
        if (isMarked) {
            newMarkedDigits = marked.filter((d): boolean => d !== digit)
        } else {
            newMarkedDigits = marked.concat(digit)
        }
        updateMarked(newMarkedDigits)
    }

    private mayTriggerClick = (): void => {
        const { id, digit } = this.props
        digit === '' && this.props.setDigit(id)
    }

    private mayTriggerClickMarked = (): void => {
        if (this.isInMarkMode()) { return }
        this.mayTriggerClick()
    }

    private isFilled = (): boolean => {
        return !!this.props.digit
    }

    private isInMarkMode = (): boolean => {
        return this.props.mode === 'mark'
    }
    private isInFlagMode = (): boolean => {
        return this.props.isFlagOn
    }

    private handleClick = (): void => {
        if (this.isInFlagMode()) {
            this.props.updateFlags(this.props.id)
        } else if (this.isFilled()) {
            this.mayTriggerClick()
        } else {
            this.mayTriggerClickMarked()
        }
    }

    private filledTile = (): React.ReactNode => {
        const { digit } = this.props
        return (<div
            className={this.getTileClass()}
            onClick={() => this.handleClick()}
        >
            {digit}
        </div>)
    }

    private markedTile = (): React.ReactNode => {
        return (<div
            className={this.getMarkedTileClass()}
            onClick={() => this.handleClick()}
        >
            {
                digits.map((d: string): React.ReactNode => <div
                    key={d}
                    onClick={() => this.mayToggleMarked(d)}
                    className={this.props.marked.includes(d) ? 'marked' : ''}
                >
                    {d}
                </div>)
            }
        </div>)
    }

    render(): React.ReactNode {
        return this.isFilled() ?
            this.filledTile() :
            this.markedTile()
    }
}



export default Tile