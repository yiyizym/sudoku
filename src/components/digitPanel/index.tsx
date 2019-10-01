import React from 'react';
import "./index.scss";

interface DigitPanelProps {
  toFillCount: { [key: string]: number};
  digitChosen: string;
  selectDigit: (digit: string) => void;
}

class DigitPanel extends React.Component<DigitPanelProps,{}> {

  public componentDidMount(): void {
    this.ensureDigitChosen()
  }

  public componentDidUpdate(): void {
    this.ensureDigitChosen()
  }

  private generateDigits(): JSX.Element[] {
    const { toFillCount, selectDigit, digitChosen } = this.props
    const digitCounts = Object.entries(toFillCount)
    return digitCounts
      .filter(([, count]) => !!count)
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

  private ensureDigitChosen = (): void => {
    const { digitChosen, toFillCount, selectDigit } = this.props
    if(digitChosen && toFillCount[digitChosen]) { return }
    let chosenDigit = '0', currentCount = 10
    const digitCounts = Object.entries(toFillCount)
    for (let [key, val] of digitCounts) {
      if (chosenDigit === '0' || (val !== 0 && val < currentCount)) {
        chosenDigit = key
        currentCount = val
      }
    }
    if(chosenDigit === '0') { return } // we finished the game
    selectDigit(chosenDigit)
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