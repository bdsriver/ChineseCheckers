// Game logic running on the client

import type { Engine } from "./board/engine";
import { BOARD_MACROS } from "./board/macros";

export const EMPTY_CELL = 6;

/** Amount of players starting on the board */
export type PlayerCount = 2 | 3 | 4 | 6;

/** Initial start positions of each player count */
export const INITIAL_PLAYERS: Record<PlayerCount, BoardPosition[]> = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  6: [0, 1, 2, 3, 4, 5],
};

/** Initial start position around the board */
export type BoardPosition = 0 | 1 | 2 | 3 | 4 | 5;

const BOT_DEPTH = 3;

export class Board {
  private _engine: Engine;
  private _state: number[];
  private _previousTurnMove: number[];
  private _clientPosition: BoardPosition;
  private _turnIndex: number;
  private _activePlayers: BoardPosition[];

  constructor(
    engine: Engine,
    state: number[],
    playerCount: PlayerCount,
    clientPosition: BoardPosition,
  ) {
    this._engine = engine;
    this._state = state;
    this._previousTurnMove = [];
    this._clientPosition = clientPosition;
    this._activePlayers = [...INITIAL_PLAYERS[playerCount]];
    this._turnIndex = this._activePlayers[0];

    if (this._turnIndex === -1) {
      throw new Error("Client piece index not found");
    }

    this.continueGame();
  }

  get state() {
    return this._state;
  }

  get previousTurnMove() {
    return this._previousTurnMove;
  }

  get clientPosition() {
    return this._clientPosition;
  }

  get isClientsTurn() {
    return (
      !this.gameComplete &&
      this._activePlayers[this._turnIndex] === this._clientPosition
    );
  }

  get gameComplete() {
    return this._activePlayers.length === 1;
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

  moveClient(from: number, to: number) {
    this.movePiece(from, to);
  }

  private moveBot() {
    const move = this._engine.search(BOT_DEPTH);
    this.movePiece(move[0], move[1]);
  }

  private movePiece(from: number, to: number) {
    this._previousTurnMove = [from, to];
    this._state[to] = this._state[from];
    this._state[from] = EMPTY_CELL;
    this._engine.move(from, to);

    if (this.checkFinishedPieces(this._activePlayers[this._turnIndex])) {
      this._activePlayers = this._activePlayers.filter(
        (player) => player !== this._activePlayers[this._turnIndex],
      );
      this._turnIndex = this._turnIndex % this._activePlayers.length;
    } else {
      this._turnIndex = (this._turnIndex + 1) % this._activePlayers.length;
    }

    if (!this.gameComplete) {
      this.continueGame();
    }
  }

  private checkFinishedPieces(playerPosition: BoardPosition) {
    for (const position of BOARD_MACROS.starts[(playerPosition + 3) % 6]) {
      if (this._state[position] !== playerPosition) {
        return false;
      }
    }

    return true;
  }

  private continueGame() {
    if (this._activePlayers[this._turnIndex] !== this._clientPosition) {
      window.requestAnimationFrame(() => this.moveBot());
    }
  }
}
