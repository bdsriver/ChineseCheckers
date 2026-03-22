import type { BoardBuilder } from "./builder";
import { BoardRenderer } from "./renderer";
import {
  type BoardRendererConstants,
  computeConstants,
} from "./renderer/constants";
import { drawBoardState } from "./renderer/drawFunctions";

/** Pieces on the board where the center */
const INITIAL_POSITION_CENTERS = [116, 87, 24, 4, 33, 96];

/**  A "cluster" refers to the pile of pieces off to the left before the game starts */

export class BoardBuilderRenderer {
  private ctx: CanvasRenderingContext2D;
  private constants: BoardRendererConstants;
  private board: BoardBuilder;

  constructor(ctx: CanvasRenderingContext2D, board: BoardBuilder) {
    this.ctx = ctx;
    this.constants = computeConstants(ctx);
    this.board = board;

    ctx.canvas.onmousemove = () => {
      this.onMouseMove();
    };

    ctx.canvas.onmousedown = () => {
      this.onMouseDown();
    };

    ctx.canvas.onmouseup = () => {
      this.onMouseUp();
    };

    this.safeRender();
  }

  private onMouseMove() {
    this.computeHovered();
    this.safeRender();
  }

  private onMouseDown() {
    this.safeRender();
  }

  private onMouseUp() {
    this.computeHovered();
    this.safeRender();
  }

  private computeHovered() {}

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
