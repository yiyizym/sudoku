
/**
 See http://norvig.com/sudoku.html
 Throughout this program we have:
    r is a row, e.g. 'A'
    c is a column, e.g. '3'
    s is a square, e.g. 'A3'
    d is a digit, e.g. '9'
    u is a unit, e.g. ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1']
    grid is a grid, e.g. 81 non - blank chars, e.g.starting with '.18...7...
    values is a dict of possible values, e.g. { 'A1': '12349', 'A2': '8', ... }
 */

export const digits = '123456789'.split('')
export const rows = 'ABCDEFGHI'.split('')
export const cols = digits

export const cross = (A: string[], B: string[]): string[] => {
  const result: string[] = [];
  A.forEach(a => {
    B.forEach(b => {
      result.push(a + b)
    })
  });
  return result
}

export const squares = cross(rows, cols)

const genUnitlist = (): string[][] => {
  let result: string[][] = []

  const _cols = cols.map(c => cross(rows, [c]))
  const _rows = rows.map(r => cross([r], cols))
  const rowGroup = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]
  const colGroup = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']]
  let _squares: string[][] = []
  rowGroup.forEach(rs => {
    _squares = _squares.concat(colGroup.map(cs => cross(rs, cs)))
  })
  result = result.concat(_cols)
  result = result.concat(_rows)
  result = result.concat(_squares)

  return result
}

export const unitlist: string[][] = genUnitlist()

interface UnitType {
  [key: string]: string[][]
}
const genUnits = (): UnitType => {
  const result: UnitType = {}

  squares.forEach(s => {
    result[s] = unitlist.filter(u => u.includes(s))
  });

  return result
}

export const units = genUnits()

interface PeerType { [key: string]: Set<string> }
const genPeers = (): PeerType => {
  const peers: PeerType = {}

  squares.forEach(s => {
    let flattened: Set<string> = new Set(units[s].reduce((acc, unit) => acc.concat(unit), []))
    flattened.delete(s)
    peers[s] = flattened
  });

  return peers
}

export const peers = genPeers()
