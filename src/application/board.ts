import { INITIAL_PLAYERS, type PlayerCount } from "./board/builder";
import type { Engine } from "./board/engine";
import { BOARD_MACROS } from "./board/macros";

export const EMPTY_CELL = 6;
const BOT_DEPTH = 3;

export class Board {
  private _engine: Engine;
  private _state: number[];
  private _turn: number;
  private _lastTurn: number;
  private _playerCount: PlayerCount;
  private _currentPath: number[];

  constructor(engine: Engine, state: number[], playerCount: PlayerCount) {
    this._engine = engine;
    // Hardcoded based on engine starts
    this._turn = { 2: 1, 3: 1, 4: 2, 6: 3 }[playerCount];
    this._lastTurn = -1;
    this._playerCount = playerCount;
    this._state = state;
    this._currentPath = [];
  }

  get state() {
    return this._state;
  }

  get currentPath() {
    return this._currentPath;
  }

  get playerCount() {
    return this._playerCount;
  }

  get currentTurn() {
    return INITIAL_PLAYERS[this._playerCount][this._turn];
  }

  get previousTurn() {
    return INITIAL_PLAYERS[this._playerCount][this._lastTurn];
  }

  get clientPiece() {
    return 0;
  }

  getAvailableMoves(index: number) {
    const moves = new Set<number>();

    for (const neighbor of BOARD_MACROS.moves[index]) {
      if (neighbor !== -1 && this._state[neighbor] === EMPTY_CELL) {
        moves.add(neighbor);
      }
    }

    const search = [index];

    while (search.length > 0) {
      const currentPosition = search.pop();

      if (currentPosition === undefined) {
        break;
      }

      if (moves.has(currentPosition)) {
        continue;
      }
      moves.add(currentPosition);

      for (let i = 0; i < 6; i++) {
        const neighbors = BOARD_MACROS.moves[currentPosition];
        if (neighbors[i] !== -1 && this._state[neighbors[i]] !== EMPTY_CELL) {
          const neighbors_squared = BOARD_MACROS.moves[neighbors[i]];
          if (
            neighbors_squared[i] !== -1 &&
            this._state[neighbors_squared[i]] === EMPTY_CELL
          ) {
            search.push(neighbors_squared[i]);
          }
        }
      }
    }

    moves.delete(index);

    return moves;
  }

  makeMove(from: number, to: number) {
    this._currentPath = this.findPath(from, to);
    this._state[to] = this._state[from];
    this._state[from] = EMPTY_CELL;
    this._engine.move(from, to);
    this._lastTurn = this._turn;
    this._turn = (this._turn + 1) % this._playerCount;
  }

  private findPath(from: number, to: number) {
    const search = [[from]];
    let path: number[] = [];

    while (search.length > 0) {
      const currentPath = search.pop();

      if (currentPath === undefined) {
        break;
      }

      const currentPosition = currentPath.at(-1);

      if (currentPosition === undefined) {
        continue;
      }

      if (currentPosition === to) {
        path = currentPath;
        break;
      }

      const neighbors = BOARD_MACROS.moves[currentPosition];

      for (let i = 0; i < 6; i++) {
        if (neighbors[i] !== -1) {
          if (currentPath.length === 1) {
            if (
              this._state[neighbors[i]] === EMPTY_CELL &&
              !currentPath.includes(neighbors[i])
            ) {
              const newPath = [...currentPath];
              newPath.push(neighbors[i]);
              search.push(newPath);
            }
          }
          if (
            neighbors[i] !== currentPosition &&
            this._state[neighbors[i]] !== EMPTY_CELL
          ) {
            const neighbors_squared = BOARD_MACROS.moves[neighbors[i]];
            if (
              neighbors_squared[i] !== -1 &&
              this._state[neighbors_squared[i]] === EMPTY_CELL &&
              !currentPath.includes(neighbors_squared[i])
            ) {
              const newPath = [...currentPath];
              newPath.push(neighbors_squared[i]);
              search.push(newPath);
            }
          }
        }
      }
    }

    return path;
  }

  moveBot() {
    const move = this._engine.search(BOT_DEPTH);
    const from = move[0];
    const to = move[1];
    this._currentPath = move.slice(3);
    this._state[to] = this._state[from];
    this._state[from] = EMPTY_CELL;
    this._engine.move(from, to);
    this._lastTurn = this._turn;
    this._turn = (this._turn + 1) % this._playerCount;
  }
}
