import { BoardBuilder, type BoardPosition } from "../board/builder";
import { BoardRenderer } from "./boardRenderer";
import { type BoardRendererConstants, computeConstants } from "./constants";
import { drawBoardState } from "./drawFunctions";

export type PlayerCount = 2 | 3 | 4 | 6;
export const INITIAL_PLAYERS: Record<PlayerCount, BoardPosition[]> = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
};

export class BoardBuilderRenderer {
  built = false
  private ctx: CanvasRenderingContext2D;
  private constants: BoardRendererConstants;
  private board: BoardBuilder;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.constants = computeConstants(ctx);
    this.board = new BoardBuilder();

    this.safeRender();
  }

  setPlayers(count: PlayerCount) {
    for (let i = 0; i < 6; i++) {
      this.board.removePlayer(i as BoardPosition);
    }

    for (const player of INITIAL_PLAYERS[count]) {
      this.board.setPlayer(player);
    }

    this.safeRender();
  }

  private safeRender() {
    window.requestAnimationFrame(() => this.render());
  }

  private render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    /** Board */
    drawBoardState(this.ctx, this.constants, this.board.state, undefined);
  }

  async build() {
    const board = await this.board.build();
    return new BoardRenderer(this.ctx, board);
  }
}
