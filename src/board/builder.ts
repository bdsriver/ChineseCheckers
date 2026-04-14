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
  private _state: number[];
  private _included: Set<BoardPosition>;
  private _playerCount: PlayerCount;

  constructor() {
    this._state = Array<number>(BOARD_MACROS.positions.length).fill(EMPTY_CELL);
    this._included = new Set();
    this._playerCount = 2;
    this.setPlayerCount(this._playerCount);
  }

  get playerCount() {
    return this._playerCount;
  }

  get state() {
    return this._state;
  }

  setPlayerCount(count: PlayerCount) {
    this._playerCount = count;

    for (let i = 0; i < 6; i++) {
      this.removePlayer(i as BoardPosition);
    }

    for (const player of INITIAL_PLAYERS[count]) {
      this.setPlayer(player);
    }
  }

  private setPlayer(position: BoardPosition) {
    this._included.add(position);

    for (const index of BOARD_MACROS.starts[position]) {
      this._state[index] = position;
    }
  }

  private removePlayer(position: BoardPosition) {
    this._included.delete(position);

    for (const index of BOARD_MACROS.starts[position]) {
      this._state[index] = EMPTY_CELL;
    }
  }

  async build() {
    const engine = await newEngine(this._playerCount);
    return new Board(engine, this._state, this._playerCount);
  }
}
