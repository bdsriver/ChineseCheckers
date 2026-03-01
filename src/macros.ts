interface BoardMacros {
  rowLengths: number[];
  moves: [number, number, number, number, number, number][];
  starts: number[][];
}

const COLOR_BOARD = `
00000000000010000
00000000000110000
00000000001110000
00000000011110000
00002222777773333
00002227777773330
00002277777773300
00002777777773000
00007777777770000
00047777777750000
00447777777550000
04447777775550000
44447777755550000
00006666000000000
00006660000000000
00006600000000000
00006000000000000`;

export const BOARD_MACROS: BoardMacros = {
  rowLengths: [],
  starts: Array(6)
    .fill(0)
    .map(() => []),
  moves: Array(121)
    .fill(0)
    .map(() => [-1, -1, -1, -1, -1, -1]),
};

(() => {
  const grid = COLOR_BOARD.split("\n");
  grid.shift();
  const indices: number[][] = Array(17)
    .fill(0)
    .map(() => Array(17).fill(-1));

  let k = 0;

  for (let i = 0; i < 17; i++) {
    let rowLength = 0;

    for (let j = 0; j < 17; j++) {
      const c = parseInt(grid[i].charAt(j), 10) - 1;

      if (c === -1) {
        continue;
      }

      if (c !== 6) {
        BOARD_MACROS.starts[c].push(k);
      }

      indices[i][j] = k;

      rowLength += 1;
      k += 1;
    }

    BOARD_MACROS.rowLengths.push(rowLength);
  }

  k = 0;
  for (let i = 0; i < 17; i++) {
    for (let j = 0; j < 17; j++) {
      if (indices[i][j] === -1) {
        continue;
      }

      BOARD_MACROS.moves[k] = [
        i - 1 > 0 ? indices[i - 1][j] : -1,
        i - 1 > 0 && j + 1 < 17 ? indices[i - 1][j + 1] : -1,
        j - 1 > 0 ? indices[i][j - 1] : -1,
        j + 1 < 17 ? indices[i][j + 1] : -1,
        i + 1 < 17 && j - 1 > 0 ? indices[i + 1][j - 1] : -1,
        i + 1 < 17 ? indices[i + 1][j] : -1,
      ];
      k += 1;
    }
  }

  console.log(BOARD_MACROS);
})();
