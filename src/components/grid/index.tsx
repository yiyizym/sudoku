import React from "react";
import Tile from "./tile";
import { ValueType } from "../backend/basics";

interface GridType {
  values: false|ValueType;
  fillNumber: (num: string) => void
}

class Grid extends React.Component<GridType, {}> {
  private checkAndSetDigit(digit: string): void {
    if (false) {
      return
    }
    this.props.fillNumber(digit)
  }
  private genTiles(): JSX.Element[] {
    const keyValuePairs = Object.entries(this.props.values)
    return Array.from({ length: 81 }, (_, index): JSX.Element => {
      return <Tile
        key={index}
        id={keyValuePairs[index][0]}
        digit={keyValuePairs[index][1].length > 1 ? '' : keyValuePairs[index][1][0]}
        setDigit={this.checkAndSetDigit}
      />
    })
  }
  render(): JSX.Element|null {
    const { values } = this.props
    return values ? (<div
      style={{
        width: 800,
        height: 800,
        display: "flex",
        flexWrap: "wrap"
      }}
    >
      {this.genTiles()}
    </div>) : null
  }
}

export default Grid