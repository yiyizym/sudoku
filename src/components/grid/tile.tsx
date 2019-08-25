import React from 'react';

interface TileProps {
  id: string;
  digit: string;
  // status: string; // 是否被选中
  // hilight: boolean; // 是否高亮
  // from: string; // 用户填写/系统生成
  // borders: [boolean, boolean, boolean, boolean];
  setDigit: (id: string) => void
}

class Tile extends React.Component<TileProps, {}> {
  private triggerClick = (): void => {
    this.props.setDigit(this.props.id)
  }
  render(): JSX.Element {
    const { digit } = this.props
    return (<div
      style={{ 
        boxSizing: 'border-box',
        width: '11.1%',
        height: '11.1%',
        flexShrink: 0,
        display: 'flex',
        border: '1px solid black',
        // color: from === 'system' ? 'grey' : 'red'
      }}
      onClick={() => this.triggerClick()}
    >
      {digit}
    </div>)
  }
}

export default Tile