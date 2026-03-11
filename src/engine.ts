export interface Engine {
  /** Returns [from, to, ...path] */
  search: (depth: number) => number[];
  /** Returns next player, or -1 | -2 if the game is over */
  move: (from: number, to: number) => number;
  /** deallocates */
  delete: () => void;
}

