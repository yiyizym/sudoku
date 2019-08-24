/**
 Throughout this program we have:
    r is a row, e.g. 'A'
    c is a column, e.g. '3'
    s is a square, e.g. 'A3'
    d is a digit, e.g. '9'
    u is a unit, e.g. ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1']
    grid is a grid, e.g. 81 non - blank chars, e.g.starting with '.18...7...
    values is a dict of possible values, e.g. { 'A1': '12349', 'A2': '8', ... }
 */

import { squares, digits, peers, units, rows, cols } from "./basics"
/**
 * Convert grid into a dict of {square: char} with '0' or '.' for empties.
 * @param grid 
 */
const getGridValues = (grid: string[]): boolean | { [key: string]: string } => {
  let parsedGrid = grid.filter((v): boolean => v.match(/\d|\./) !== null)
  if( parsedGrid.length !== 81) return false
  const result: { [key: string]: string } = {}
  squares.forEach((s,index) => {
    result[s] = parsedGrid[index]
  })
  return result
}

/**
 * Eliminate d from values[s]; propagate when values or places <= 2.
    Return values, except return False if a contradiction is detected.
 * @param values 
 * @param s 
 * @param d 
 */
const eliminate = (values: { [key: string]: string[] }, s: string, d: string): boolean | { [key: string]: string[] } => {
  // Already eliminated
  if(!values[s].includes(d)) return values

  values[s] = values[s].filter((v): boolean => v !== d)
  if (values[s].length === 0) {
    return false // Contradiction: removed last value
  } else if (values[s].length === 1) {
    // (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
    const d2 = values[s][0]
    const peersArr = Array.from(peers[s])
    if (!peersArr.every((s2): boolean => eliminate(values, s2, d2) !== false)) return false
  }
  // (2) If a unit u is reduced to only one place for a value d, then put it there.
  units[s].forEach(u => {
    if(!values[s].includes(d)) { return false }
    const dplaces = u
    if(dplaces.length === 1) {
      if(assignValues(values, dplaces[0], d) === false) return false
    }
  });
  return values
}

/**
 * Eliminate all the other values (except d) from values[s] and propagate.
    Return values, except return False if a contradiction is detected.
 * @param values 
 * @param s 
 * @param d 
 */
const assignValues = (values: { [key: string]: string[] }, s: string, d: string): boolean | { [key: string]: string[] } => {
  let otherValues = values[s].filter((v): boolean => v !== d)
  if(otherValues.every((d2): boolean => eliminate(values, s, d2) !== false)) return values
  return false
}

/**
 * Convert grid to a dict of possible values, {square: digits}, or
    return False if a contradiction is detected.
 * @param grid 
 */
const parseGrid = (grid: string[]): boolean|{[key: string]: string[]} => {
  // To start, every square can be any digit; then assign values from the grid.
  const values: { [key: string]: string[] } = squares.reduce((acc, curr) => acc[curr] = digits, {})
  const gridValues = getGridValues(grid)
  if(!gridValues) return false
  for (let [s, d] of Object.entries(gridValues)) {
    // (Fail if we can't assign d to square s.)
    if(digits.includes(d) && assignValues(values, s, d) === false) return false
  }
  return values
}

/**
 * Display these values as a 2-D grid.
 * @param values 
 */
const displayGrid = (values: { [key: string]: string[]}): void => {
  const width = Math.max.apply(Math, squares.map(s => values[s].length)) + 1
  const line: string = Array(3).fill('_'.repeat(width * 3)).join('+')
  rows.forEach(r => {
    const lineContent = cols.map(c => {
      let content = values[r+c].join('')
      let padLeft = (width - content.length) / 2
      let rightPad = ['3','6'].includes(c) ? '|' : ''
      return content.padStart(padLeft, ' ') + rightPad
    })
    console.log(lineContent.join(''));
    ['C', 'F'].includes(r) && console.log(line)
  })
}