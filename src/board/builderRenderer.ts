import { BoardBuilder, type BoardPosition } from "./builder";
import { BoardRenderer } from "./renderer";
import {
  type BoardRendererConstants,
  computeConstants,
} from "./renderer/constants";
import { drawBoardState } from "./renderer/drawFunctions";

export type PlayerCount = 2 | 3 | 4 | 6;
export const INITIAL_PLAYERS: Record<PlayerCount, BoardPosition[]> = {
  2: [0,3],
  3: [0,2,4],
  4: [1,2,4,5],
  6: [0,1,2,3,4,5]
}

export class BoardBuilderRenderer {
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
    this.board.removePlayer(0);
    this.board.removePlayer(1);
    this.board.removePlayer(2);
    this.board.removePlayer(3);
    this.board.removePlayer(4);
    this.board.removePlayer(5);

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
