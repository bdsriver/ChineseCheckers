import { BOARD_MACROS } from "./board/macros";

interface Engine {
  /** Returns [from, to, ...path] */
  search: (depth: number) => number[];
  /** Returns next player, or -1 | -2 if the game is over */
  move: (from: number, to: number) => number;
  /** deallocates */
  delete: () => void;
}

const BOT_DEPTH = 3;
const EMPTY_CELL = 6;

class Board {
  state: number[];
  private engine: Engine;

  constructor(engine: Engine, state: number[]) {
    this.state = state;
    this.engine = engine;
  }

  playerMove(from: number, to: number) {
    this.state[to] = this.state[from];
    this.state[from] = EMPTY_CELL;
    this.engine.move(from, to);
  }

  botMove() {
    const move = this.engine.search(BOT_DEPTH);
    const from = move[0];
    const to = move[1];
    const path = move.slice(2);
    console.log(path);
    this.state[to] = this.state[from];
    this.state[from] = EMPTY_CELL;
    this.engine.move(from, to);
  }

  destructor() {
    this.engine.delete();
  }
}

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
      search: (d: number) => {return []},
      move: (f: number, t: number) => {return 1},
      delete: () => {}
    }

    return new Board(engine, boardState);
  }
}
