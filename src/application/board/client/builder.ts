import { EMPTY_CELL } from "../../board";
import {
  type BoardPosition,
  ClientBoard,
  INITIAL_PLAYERS,
  type PlayerCount,
} from "../client";
import { BOARD_MACROS } from "../macros";
import { newEngine } from "./engine";

export class ClientBoardBuilder {
  private _state: number[];
  private _included: Set<BoardPosition>;
  private _playerCount: PlayerCount;
  private _clientPosition: BoardPosition

  constructor() {
    this._state = Array<number>(BOARD_MACROS.positions.length).fill(EMPTY_CELL);
    this._included = new Set();
    this._playerCount = 2;
    this._clientPosition = INITIAL_PLAYERS[this._playerCount][0];
    this.setPlayerCount(this._playerCount);
  }

  get playerCount() {
    return this._playerCount;
  }

  get state() {
    return this._state;
  }

  get initialPositions() {
    return INITIAL_PLAYERS[this._playerCount];
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

  setClientPosition(position: BoardPosition) {
    this._clientPosition = position;
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
    return new ClientBoard(engine, this._state, this._playerCount, this._clientPosition);
  }
}
