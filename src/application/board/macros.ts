import type { Vector2d } from "../vector";

interface BoardMacros {
  positions: Vector2d[];
  moves: [number, number, number, number, number, number][];
  starts: number[][];
}

export const BOARD_MACROS = (() => {
  const macros: BoardMacros = {
    positions: [],
    starts: Array(6)
      .fill(0)
      .map(() => []),
    moves: Array(121)
      .fill(0)
      .map(() => [-1, -1, -1, -1, -1, -1]),
  };

  const COLOR_BOARD = `
00000000000040000
00000000000440000
00000000004440000
00000000044440000
00003333777775555
00003337777775550
00003377777775500
00003777777775000
00007777777770000
00027777777760000
00227777777660000
02227777776660000
22227777766660000
00001111000000000
00001110000000000
00001100000000000
00001000000000000`;

  const grid = COLOR_BOARD.slice(1).split("\n");
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
        macros.starts[c].push(k);
      }

      indices[i][j] = k;

      rowLength += 1;
      k += 1;
    }

    for (let j = 0; j < rowLength; j++) {
      const x = (j + 8 - rowLength / 2) / 15;
      const y = (i + 0.5) / 17;
      macros.positions.push({ x, y });
    }
  }

  let k2 = 0;
  for (let i = 0; i < 17; i++) {
    for (let j = 0; j < 17; j++) {
      if (indices[i][j] === -1) {
        continue;
      }

      macros.moves[k2] = [
        i - 1 > 0 ? indices[i - 1][j] : -1,
        i - 1 > 0 && j + 1 < 17 ? indices[i - 1][j + 1] : -1,
        j - 1 > 0 ? indices[i][j - 1] : -1,
        j + 1 < 17 ? indices[i][j + 1] : -1,
        i + 1 < 17 && j - 1 > 0 ? indices[i + 1][j - 1] : -1,
        i + 1 < 17 ? indices[i + 1][j] : -1,
      ];
      k2 += 1;
    }
  }

  return macros;
})();
