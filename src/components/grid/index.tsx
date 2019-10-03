import React from "react";
import Tile from "./tile";
import { ValueType } from "../backend/basics";
import _ from "lodash";
import { Mode } from "../../schema";

interface GridType {
  mode: Mode;
  values: false|ValueType;
  markedDigits: ValueType;
  digitChosen: string;
  checkAndSetDigit: (id: string) => void;
  updateValues: (id: string, digitChosen: string) => void;
  updateMarked: (id: string, newMarkedDigits: string[]) => void;
}

class Grid extends React.Component<GridType, {}> {
  private genTiles(): JSX.Element[] {
    const { digitChosen, checkAndSetDigit, values, mode, markedDigits, updateMarked } = this.props
    const keyValuePairs = Object.entries(values)
    return Array.from({ length: 81 }, (_, index): JSX.Element => {
      const id = keyValuePairs[index][0]
      const digits = keyValuePairs[index][1]
      const tileMarkedDigits = markedDigits[id]
      return <Tile
        key={index}
        id={id}
        mode={mode}
        digitChosen={digitChosen}
        marked={tileMarkedDigits}
        digit={digits.length > 1 ? '' : digits[0]}
        setDigit={checkAndSetDigit}
        updateMarked={(newMarkedDigits) => updateMarked(id, newMarkedDigits) }
      />
    })
  }
  render(): JSX.Element|null {
    const { values } = this.props
    return _.isEmpty(values) ? null : (<div
      style={{
        width: '80vh',
        height: '80vh',
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {this.genTiles()}
    </div>)
  }
}

export default Grid