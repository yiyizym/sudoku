import React from "react";
import Tile from "./tile";
import { ValueType } from "../backend/basics";

interface GridType {
  values: false|ValueType;
  digitChosen: string;
  fillDigit: (id: string, digit: string) => void
}

class Grid extends React.Component<GridType, {}> {
  private checkAndSetDigit = (id: string): void => {
    if (false) {
      return
    }
    this.props.fillDigit(id, this.props.digitChosen)
  }
  private genTiles(): JSX.Element[] {
    const keyValuePairs = Object.entries(this.props.values)
    return Array.from({ length: 81 }, (_, index): JSX.Element => {
      const id = keyValuePairs[index][0]
      const digits = keyValuePairs[index][1]
      return <Tile
        key={index}
        id={id}
        digit={digits.length > 1 ? '' : digits[0]}
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