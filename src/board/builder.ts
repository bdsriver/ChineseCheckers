import Color from "colorjs.io";
import { Board, EMPTY_CELL } from "../board";
import type { Engine } from "../engine";
import { BOARD_MACROS } from "./macros";

/** Initial start position around the board */
export type Position = 0|1|2|3|4|5;

export class BoardBuilder {
  state: number[];
  colors: Color[];
  included: Set<Position>

  constructor() {
    this.state = Array<number>(BOARD_MACROS.positions.length).fill(EMPTY_CELL);
    this.colors = Array(6)
      .fill(0)
      .map(() => new Color("white"));
    this.included = new Set();
  }

  setPlayer(position: Position, color: Color) {
    this.included.add(position);
    this.colors[position] = color.clone();

    for (const index of BOARD_MACROS.starts[position]) {
      this.state[index] = position;
    }
  }

  removePlayer(position: Position) {
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

    return new Board(engine, this.state, this.colors);
  }
}
