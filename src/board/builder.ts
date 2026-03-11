import { Board, EMPTY_CELL } from "../board";
import type { Engine } from "../engine";
import { BOARD_MACROS } from "./macros";

export class BoardBuilder {
  private placements: number[];

  constructor() {
    this.placements = Array(6).fill(EMPTY_CELL);
  }

  private initialBoard() {
    const boardState = Array(BOARD_MACROS.positions.length).fill(EMPTY_CELL);

    for (let i = 0; i < 6; i++) {
      for (const index of BOARD_MACROS.starts[i]) {
        boardState[index] = this.placements[i];
      }
    }

    return boardState;
  }

  previewBoard() {
    return this.initialBoard();
  }

  addPlayer(player: number, position: number) {
    this.placements[position] = player;
  }

  removePlayer(position: number) {
    this.placements[position] = EMPTY_CELL;
  }

  async build() {
    const boardState = this.initialBoard();

    const playerCount = this.placements.filter((p) => p !== EMPTY_CELL).length;
    // new Engine(playerCount);
    const engine: Engine = {
      search: (d: number) => {
        return [];
      },
      move: (f: number, t: number) => {
        return 1;
      },
      delete: () => {},
    };

    return new Board(engine, boardState);
  }
}
