import React from 'react';
import "./index.scss";

interface DigitPanelProps {
  toFillCount: { [key: string]: number};
  selectDigit: (digit: string) => void;
  digitChosen: string;
}

class DigitPanel extends React.Component<DigitPanelProps,{}> {

  private generateDigits(): JSX.Element[] {
    const { toFillCount, selectDigit, digitChosen } = this.props
    const digitCounts = Object.entries(toFillCount)
    return digitCounts.map(([digit, count]) => {
      return <div
        key={digit}
        className={`digit-panel-item ${digit === digitChosen ? 'selected' : ''}`}
        onClick={() => selectDigit(digit)}
      >
        {`${digit}: ${count}`}
      </div>
    })
  }

  public render(): JSX.Element {
    return (<div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
      className='digit-panel'
    >
      {this.generateDigits()}
    </div>)
  }
}

export default DigitPanel