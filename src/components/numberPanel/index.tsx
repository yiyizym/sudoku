import React from 'react';
import "./index.scss";

interface NumberPanelProps {
  toFillCount: { [key: string]: number};
  selectNumber: (number: string) => void;
  numberChosen: string;
}

class NumberPanel extends React.Component<NumberPanelProps,{}> {

  private generateNumbers(): JSX.Element[] {
    const { toFillCount, selectNumber, numberChosen } = this.props
    const numberCounts = Object.entries(toFillCount)
    return numberCounts.map(([number, count]) => {
      return <div
        key={number}
        className={`${number === numberChosen ? 'selected' : ''}`}
        onClick={() => selectNumber(number)}
      >
        {`${number}: ${count}`}
      </div>
    })
  }

  public render(): JSX.Element {
    return (<div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
      className='number-panel'
    >
      {this.generateNumbers()}
    </div>)
  }
}

export default NumberPanel