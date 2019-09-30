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
  selectedNoteDigits: string[];
}

class Tile extends React.Component<TileProps, TileState> {
  
  public state: TileState = {
    selectedNoteDigits: []
  }
  
  private getNotedTileClass = (): string => {
    const { id } = this.props
    const idClz = `tile-${id}`
    const noteModeClz = this.isInNoteMode() ? `tile-note-mode` : ''
    return `tile ${idClz} tile-noted ${noteModeClz}`
  }
  
  private getTileClass = (): string => {
    const { digit, digitChosen, id } = this.props
    const hilightTextClz = digit === digitChosen ? 'tile-chosen' : ''
    const idClz = `tile-${id}`
    return `tile ${idClz} ${hilightTextClz}`
  }
  
  private mayToggleSelected = (digit: string): void => {
    if(!this.isInNoteMode()) { return }
    const selected = this.state.selectedNoteDigits.includes(digit)
    let newSelectedNoteDigits: string[] = []
    if(selected) {
      newSelectedNoteDigits = this.state.selectedNoteDigits.filter((d): boolean => d !== digit) 
    } else {
      newSelectedNoteDigits = this.state.selectedNoteDigits.concat(digit)
    }
    this.setState({
      selectedNoteDigits: newSelectedNoteDigits
    })
  }
  
  private mayTriggerClick = (): void => {
    const { id, digit } = this.props
    digit === '' && this.props.setDigit(id)
  }

  private mayTriggerClickNoted = (): void => {
    if(this.isInNoteMode()) { return }
    this.mayTriggerClick()
  }

  private isFilled = (): boolean => {
    return !!this.props.digit
  }

  private isInNoteMode = (): boolean => {
    return this.props.mode === 'note'
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

  private notedTile = (): React.ReactNode => {
    return (<div
      className={this.getNotedTileClass()}
      onClick={() => this.mayTriggerClickNoted()}
    >
      {
        digits.map((d: string): React.ReactNode => <div
          key={d}
          onClick={() => this.mayToggleSelected(d)}
          className={this.state.selectedNoteDigits.includes(d) ? 'selected' : ''}
        >
          {d}
        </div>)
      }
    </div>)
  }
  
  render(): React.ReactNode {
    return this.isFilled() ? 
      this.filledTile() : 
      this.notedTile()
  }
}



export default Tile