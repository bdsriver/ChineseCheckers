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
00000000000010000
00000000000110000
00000000001110000
00000000011110000
00006666777772222
00006667777772220
00006677777772200
00006777777772000
00007777777770000
00057777777730000
00557777777330000
05557777773330000
55557777733330000
00004444000000000
00004440000000000
00004400000000000
00004000000000000`;

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
        i - 1 >= 0 ? indices[i - 1][j] : -1,
        i - 1 >= 0 && j + 1 < 17 ? indices[i - 1][j + 1] : -1,
        j - 1 >= 0 ? indices[i][j - 1] : -1,
        j + 1 < 17 ? indices[i][j + 1] : -1,
        i + 1 < 17 && j - 1 > 0 ? indices[i + 1][j - 1] : -1,
        i + 1 < 17 ? indices[i + 1][j] : -1,
      ];
      k2 += 1;
    }
  }

  return macros;
})();
