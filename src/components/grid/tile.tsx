import React from 'react';
import './tile.scss'

interface TileProps {
  id: string;
  digit: string;
  digitChosen: string; // 被选中的 digit
  // hilight: boolean; // 是否高亮
  // from: string; // 用户填写/系统生成
  // borders: [boolean, boolean, boolean, boolean];
  setDigit: (id: string) => void;
}


class Tile extends React.Component<TileProps, {}> {
  private getTileClass = (): string => {
    const { digit, digitChosen, id } = this.props
    const hilightTextClz = digit === digitChosen ? 'tile-chosen' : ''
    const idClz = `tile-${id}`
    return `tile ${idClz} ${hilightTextClz}`
  }
  private mayTriggerClick = (): void => {
    const { id, digit } = this.props
    digit === '' && this.props.setDigit(id)
  }
  render(): JSX.Element {
    const { digit } = this.props
    return (<div
      className={this.getTileClass()}
      onClick={() => this.mayTriggerClick()}
    >
      {digit}
    </div>)
  }
}

export default Tile