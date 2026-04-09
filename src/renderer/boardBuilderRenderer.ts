import { BoardBuilder, type PlayerCount } from "../board/builder";
import { BoardRenderer } from "./boardRenderer";
import { type BoardRendererConstants, computeConstants } from "./constants";
import { drawBoardState } from "./drawFunctions";

export class BoardBuilderRenderer {
  built = false;
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
    this.board.setPlayerCount(count);
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
