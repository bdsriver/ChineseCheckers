import { Board, EMPTY_CELL } from "../board";
import type { Engine } from "../engine";
import { BOARD_MACROS } from "./macros";

/** Initial start position around the board */
export type BoardPosition = 0 | 1 | 2 | 3 | 4 | 5;

export class BoardBuilder {
  state: number[];
  included: Set<BoardPosition>;

  constructor() {
    this.state = Array<number>(BOARD_MACROS.positions.length).fill(EMPTY_CELL);
    this.included = new Set();
  }

  setPlayer(position: BoardPosition) {
    this.included.add(position);

    for (const index of BOARD_MACROS.starts[position]) {
      this.state[index] = position;
    }
  }

  removePlayer(position: BoardPosition) {
    this.included.delete(position);

    for (const index of BOARD_MACROS.starts[position]) {
      this.state[index] = EMPTY_CELL;
    }
  }

  async build() {
    // new Engine(this.included.size);
    const engine: Engine = {
      search: (d: number) => {
        return [];
      },
      move: (f: number, t: number) => {
        return 1;
      },
      delete: () => {},
    };

    return new Board(engine, this.state);
  }
}
