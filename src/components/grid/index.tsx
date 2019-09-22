import React from "react";
import Tile from "./tile";
import { ValueType } from "../backend/basics";
import { assignValue } from "../backend";
import _ from "lodash";

interface GridType {
  values: false|ValueType;
  digitChosen: string;
  updateValues: (value: ValueType) => void
}

class Grid extends React.Component<GridType, {}> {
  private checkAndSetDigit = (id: string): void => {
    const { values, digitChosen } = this.props
    const newValues = assignValue(JSON.parse(JSON.stringify(values)), id, digitChosen)
    if (!newValues) {
      console.log('choose wrong digit')
      return
    }
    this.props.updateValues(newValues)
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
    return _.isEmpty(values) ? null : (<div
      style={{
        width: 800,
        height: 800,
        display: "flex",
        flexWrap: "wrap",
        border: "1px solid #ccc",
      }}
    >
      {this.genTiles()}
    </div>)
  }
}

export default Grid