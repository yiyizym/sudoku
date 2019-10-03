import React from 'react';
import './tile.scss'
import { digits } from '../backend/basics';
import { Mode } from '../../schema';

interface TileProps {
  id: string;
  digit: string;
  mode: Mode;
  digitChosen: string;
  setDigit: (id: string) => void;
}

interface TileState {
  markedDigits: string[];
}

class Tile extends React.PureComponent<TileProps, TileState> {
  
  public state: TileState = {
    markedDigits: []
  }
  
  private getMarkedTileClass = (): string => {
    const { id } = this.props
    const idClz = `tile-${id}`
    const markModeClz = this.isInMarkMode() ? `tile-mark-mode` : ''
    return `tile ${idClz} tile-marked ${markModeClz}`
  }
  
  private getTileClass = (): string => {
    const { digit, digitChosen, id } = this.props
    const hilightTextClz = digit === digitChosen ? 'tile-chosen' : ''
    const idClz = `tile-${id}`
    return `tile ${idClz} ${hilightTextClz}`
  }
  
  private mayToggleMarked = (digit: string): void => {
    if(!this.isInMarkMode()) { return }
    const marked = this.state.markedDigits.includes(digit)
    let newMarkedDigits: string[] = []
    if(marked) {
      newMarkedDigits = this.state.markedDigits.filter((d): boolean => d !== digit) 
    } else {
      newMarkedDigits = this.state.markedDigits.concat(digit)
    }
    this.setState({
      markedDigits: newMarkedDigits
    })
  }
  
  private mayTriggerClick = (): void => {
    const { id, digit } = this.props
    digit === '' && this.props.setDigit(id)
  }

  private mayTriggerClickMarked = (): void => {
    if(this.isInMarkMode()) { return }
    this.mayTriggerClick()
  }

  private isFilled = (): boolean => {
    return !!this.props.digit
  }

  private isInMarkMode = (): boolean => {
    return this.props.mode === 'mark'
  }

  private filledTile = (): React.ReactNode => {
    const { digit } = this.props
    return (<div
      className={this.getTileClass()}
      onClick={() => this.mayTriggerClick()}
    >
      {digit}
    </div>)
  }

  private markedTile = (): React.ReactNode => {
    return (<div
      className={this.getMarkedTileClass()}
      onClick={() => this.mayTriggerClickMarked()}
    >
      {
        digits.map((d: string): React.ReactNode => <div
          key={d}
          onClick={() => this.mayToggleMarked(d)}
          className={this.state.markedDigits.includes(d) ? 'marked' : ''}
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