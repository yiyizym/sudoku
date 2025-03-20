/**
 See http://norvig.com/sudoku.html
 */

export const digits = '123456789'.split('')
export const rows = 'ABCDEFGHI'.split('')
export const cols = digits

export interface ValueType {
  [key: string]: string[]
}