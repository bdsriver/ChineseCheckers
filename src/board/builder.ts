import { Board, EMPTY_CELL } from "../board";
import { newEngine } from "../engine";
import { BOARD_MACROS } from "./macros";

/** Amount of players starting on the board */
export type PlayerCount = 2 | 3 | 4 | 6;

/** Initial start positions of each player count */
export const INITIAL_PLAYERS: Record<PlayerCount, BoardPosition[]> = {
  2: [0, 3],
  3: [1, 3, 5],
  4: [0, 1, 3, 4],
  6: [0, 1, 2, 3, 4, 5],
};

/** Initial start position around the board */
export type BoardPosition = 0 | 1 | 2 | 3 | 4 | 5;

export class BoardBuilder {
  state: number[];
  private included: Set<BoardPosition>;
  private playerCount: PlayerCount;

  constructor() {
    this.state = Array<number>(BOARD_MACROS.positions.length).fill(EMPTY_CELL);
    this.included = new Set();
    this.playerCount = 2;
  }

  setPlayerCount(count: PlayerCount) {
    this.playerCount = count;

    for (let i = 0; i < 6; i++) {
      this.removePlayer(i as BoardPosition);
    }

    for (const player of INITIAL_PLAYERS[count]) {
      this.setPlayer(player);
    }
  }

  private setPlayer(position: BoardPosition) {
    this.included.add(position);

    for (const index of BOARD_MACROS.starts[position]) {
      this.state[index] = position;
    }
  }

  private removePlayer(position: BoardPosition) {
    this.included.delete(position);

    for (const index of BOARD_MACROS.starts[position]) {
      this.state[index] = EMPTY_CELL;
    }
  }

  async build() {
    const engine = await newEngine(this.playerCount);
    return new Board(engine, this.state, this.playerCount);
  }
}
