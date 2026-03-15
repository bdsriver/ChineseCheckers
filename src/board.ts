import Color from "colorjs.io";
import { BOARD_MACROS } from "./board/macros";
import type { Engine } from "./engine";

export const BOT_DEPTH = 3;
export const EMPTY_CELL = 6;

export class Board {
  private engine: Engine;
  state: number[];
  colors: Color[];

  constructor(engine: Engine, state: number[], colors: Color[]) {
    this.engine = engine;
    this.state = state;
    this.colors = colors;
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
    this.state[to] = this.state[from];
    this.state[from] = EMPTY_CELL;
    this.engine.move(from, to);
  }

  destructor() {
    this.engine.delete();
  }
}
