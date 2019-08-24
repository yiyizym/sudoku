import { squares, unitlist, units, peers } from "./basics";

test("square length is 81", () => {
  expect(squares.length).toEqual(81);
})

test("unitlist length is 27", () => {
  expect(unitlist.length).toEqual(27);
})

test("every unit in units, length is 3", () => {
  squares.forEach(s => {
    expect(units[s].length).toEqual(3)
  })
})

test("every peer in peers, length is 20", () => {
  squares.forEach(s => {
    expect(peers[s].size).toEqual(20)
  })
})

test("unit C2", () => {
  expect(units['C2']).toEqual([
    ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2'],
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
    ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']
  ])
})

test("peer C2", () => {
  expect(peers['C2']).toEqual(new Set([
    'A2', 'B2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2',
    'C1', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
    'A1', 'A3', 'B1', 'B3'
  ]))
})