import React from 'react';

interface NumberPanelProps {
  toFillCount: { [key: string]: number};
  selectNumber: (number: string) => void;
}

class NumberPanel extends React.Component<NumberPanelProps,{}> {

  private generateNumbers(): JSX.Element[] {
    const { toFillCount,selectNumber } = this.props
    const numberCounts = Object.entries(toFillCount)
    return numberCounts.map(([number, count]) => {
      return <div
        key={number}
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
    >
      {this.generateNumbers()}
    </div>)
  }
}

export default NumberPanel