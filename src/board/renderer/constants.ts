import type { Vector2d } from "../../vector";
import { BOARD_MACROS } from "../macros";

/** Diameter of board, in screen pixels */
const BOARD_DIAMETER_PIXELS = 540;
/** Diameter of piece, in percent of board diameter */
const PIECE_DIAMETER_PERCENTAGE = 5 / 128;

export class BoardRenderingConstants {
  BOARD_DIAMETER_CANVAS: number;
  PIECE_RADIUS_CANVAS: number;
  PIECE_POSITIONS: Vector2d[];

  constructor(ctx: CanvasRenderingContext2D) {
    this.BOARD_DIAMETER_CANVAS =
      (BOARD_DIAMETER_PIXELS * ctx.canvas.height) / ctx.canvas.offsetHeight;

    this.PIECE_RADIUS_CANVAS = this.BOARD_DIAMETER_CANVAS * PIECE_DIAMETER_PERCENTAGE / 2;

    this.PIECE_POSITIONS = [];
    for (const position of BOARD_MACROS.positions) {
      const piecePosition = {
        x:
          position.x * this.BOARD_DIAMETER_CANVAS +
          (ctx.canvas.width - this.BOARD_DIAMETER_CANVAS) / 2,
        y:
          position.y * this.BOARD_DIAMETER_CANVAS +
          (ctx.canvas.height - this.BOARD_DIAMETER_CANVAS) / 2,
      };
      this.PIECE_POSITIONS.push(piecePosition);
    }
  }
}
