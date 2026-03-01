import data from "../generated/macros/board.json";

interface BoardMacros {
  rowLengths: number[];
  moves: number[][];
  jumps: [number, number][][];
  starts: number[][];
}

// @ts-expect-error Json doesn't support tuple types
export const BOARD_MACROS: BoardMacros = data;
