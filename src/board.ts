import type { Engine } from "./engine";

export const BOT_DEPTH = 3;
export const EMPTY_CELL = 6;

export class Board {
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
    this.state[to] = this.state[from];
    this.state[from] = EMPTY_CELL;
    this.engine.move(from, to);
  }

  destructor() {
    this.engine.delete();
  }
}
