import { INITIAL_PLAYERS, type PlayerCount } from "./board/builder";
import { BOARD_MACROS } from "./board/macros";
import type { Engine } from "./engine";

export const BOT_DEPTH = 3;
export const EMPTY_CELL = 6;

export class Board {
  private engine: Engine;
  state: number[];
  private turn: number;
  private lastTurn: number;
  private playerCount: PlayerCount;
  currentPath: number[];

  constructor(engine: Engine, state: number[], playerCount: PlayerCount) {
    this.engine = engine;
    // Hardcoded based on engine starts
    this.turn = { 2: 1, 3: 1, 4: 2, 6: 3 }[playerCount];
    this.lastTurn = -1;
    this.playerCount = playerCount;
    this.state = state;
    this.currentPath = [];
  }

  availableMoves(index: number) {
    const moves = new Set<number>();

    for (const neighbor of BOARD_MACROS.moves[index]) {
      if (neighbor !== -1 && this.state[neighbor] === EMPTY_CELL) {
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
        if (neighbors[i] !== -1 && this.state[neighbors[i]] !== EMPTY_CELL) {
          const neighbors_squared = BOARD_MACROS.moves[neighbors[i]];
          if (
            neighbors_squared[i] !== -1 &&
            this.state[neighbors_squared[i]] === EMPTY_CELL
          ) {
            search.push(neighbors_squared[i]);
          }
        }
      }
    }

    moves.delete(index);

    return moves;
  }

  currentTurn() {
    return INITIAL_PLAYERS[this.playerCount][this.turn];
  }

  previousTurn() {
    return INITIAL_PLAYERS[this.playerCount][this.lastTurn];
  }

  playerMove(from: number, to: number) {
    this.currentPath = this.findPath(from, to);
    this.state[to] = this.state[from];
    this.state[from] = EMPTY_CELL;
    this.engine.move(from, to);
    this.lastTurn = this.turn;
    this.turn = (this.turn + 1) % this.playerCount;
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

      for (let i = 0; i < 6; i++) {
        const neighbors = BOARD_MACROS.moves[currentPosition];
        if (neighbors[i] !== -1) {
          if (currentPath.length === 1) {
            if (
              this.state[neighbors[i]] === EMPTY_CELL &&
              !currentPath.includes(neighbors[i])
            ) {
              const newPath = [...currentPath];
              newPath.push(neighbors[i]);
              search.push(newPath);
            }
          }
          if (
            neighbors[i] !== currentPosition &&
            this.state[neighbors[i]] !== EMPTY_CELL
          ) {
            const neighbors_squared = BOARD_MACROS.moves[neighbors[i]];
            if (
              neighbors_squared[i] !== -1 &&
              this.state[neighbors_squared[i]] === EMPTY_CELL &&
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

  botMove() {
    const move = this.engine.search(BOT_DEPTH);
    const from = move[0];
    const to = move[1];
    this.currentPath = move.slice(3);
    this.state[to] = this.state[from];
    this.state[from] = EMPTY_CELL;
    this.engine.move(from, to);
    this.lastTurn = this.turn;
    this.turn = (this.turn + 1) % this.playerCount;
  }

  destructor() {
    this.engine.delete();
  }
}
