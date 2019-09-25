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
    return digitCounts
      .filter(([digit, count]) => !!count)
      .map(([digit, count]) => {
        return <div
          key={digit}
          className={`digit-panel-item ${digit === digitChosen ? 'selected' : ''}`}
          onClick={() => selectDigit(digit)}
        >
          {Array.from({ length: count }, ():string => digit).join(' ')}
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