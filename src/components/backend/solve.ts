import { parseGrid, assignValue } from "./grid";
import { squares, ValueType } from './basics'

const some = (seq: Array<false | ValueType>): false | ValueType => { 
  const el = seq.find(el => el !== false)
  if(el) return el
  return false
}

export const search = (values: false|ValueType): false | ValueType => {
  if(values === false) { return false; }
  if (squares.every(s => values[s].length === 1)) return values // Solved!
  // Chose the unfilled square s with the fewest possibilities
  let inter = squares.filter(s => values[s].length > 1)
  let sMin = inter.reduce((acc, curr) => values[curr].length < values[acc].length ? curr : acc , inter[0])
  return some(values[sMin].map(d => search(assignValue(JSON.parse(JSON.stringify(values)), sMin, d))))
}

/**
 * Using depth-first search and propagation, try all possible values.
 * @param grid 
 */
export const solve = (grid: string): false | ValueType => {
  const parsedGrid = parseGrid(grid)
  if(!parsedGrid) return false
  return search(parsedGrid)
}