import { squares, initValues, ValueType } from "./basics";
import { assignValue } from "./grid";
import { solve } from ".";
/**
 * Make a random puzzle with N or more assignments. Restart on contradictions.
    Note the resulting puzzle is not guaranteed to be solvable, but empirically
    about 99.8% of them are solvable. Some have multiple solutions.
 * @param n 
 */

const shuffle = (arr: Array<any>): Array<any> => {
  let newArr = Array.from(arr)
  let len = newArr.length;
  // While there remain elements to shuffle…
  while (len) {
    // Pick a remaining element…
    let i = Math.floor(Math.random() * len--);
    // And swap it with the current element.
    let t = newArr[len];
    newArr[len] = newArr[i];
    newArr[i] = t;
  }
  return newArr;
}

const randomChoose = <T>(arr: Array<T>): T => {
  const len = arr.length;
  const index = Math.floor(Math.random() * len)
  return arr[index];
}

/**
 * 
 * Make a random puzzle with N or more assignments. Restart on contradictions.
    Note the resulting puzzle is not guaranteed to be solvable, but empirically
    about 99.8% of them are solvable. Some have multiple solutions.
 * 
 * @param assignments 
 */
export const randomPuzzle = (assignments = 17): string => {
  const values = initValues()
  const squaresShuffled = shuffle(squares)
  for (let i = 0; i < squaresShuffled.length; i++) {
    const s = squaresShuffled[i];
    if (assignValue(values, s, randomChoose<string>(values[s])) === false) break;
    const ds = squares.map(s => values[s]).filter(el => el.length === 1)
    // with less than 17 squares filled in or less than 8 different digits 
    // it is known that there will be duplicate solutions.
    if(ds.length >= assignments && new Set(ds).size >= 8) {
      return squares.map(s => {
        return values[s].length === 1 ? values[s][0] : '.'
      }).join('')
    }
  }
  return randomPuzzle(assignments)
}

export const generate = (assignments: number): ValueType => {
  const puzzle = randomPuzzle(assignments)
  const solved = solve(puzzle)
  if(solved) {
    return solved
  } else {
    return  generate(assignments)
  }
}