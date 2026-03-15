import type { Vector2d } from "../../vector";
import { BOARD_MACROS } from "../macros";

/** Diameter of board, in screen pixels */
const BOARD_DIAMETER_PIXELS = 540;
/** Diameter of piece, in percent of board diameter */
const PIECE_DIAMETER_PERCENTAGE = 5 / 128;
/** Radius of board holes, in percent of piece radius */
const HOLE_RADIUS_PERCENT = 3 / 4;

export interface BoardRendererConstants {
  BOARD_DIAMETER_CANVAS: number;
  PIECE_RADIUS_CANVAS: number;
  HOLE_RADIUS_CANVAS: number;
  PIECE_POSITIONS: Vector2d[];
}

export function computeConstants(
  ctx: CanvasRenderingContext2D,
): BoardRendererConstants {
  const BOARD_DIAMETER_CANVAS =
    (BOARD_DIAMETER_PIXELS * ctx.canvas.height) / ctx.canvas.offsetHeight;

  const PIECE_RADIUS_CANVAS =
    (BOARD_DIAMETER_CANVAS * PIECE_DIAMETER_PERCENTAGE) / 2;

  const HOLE_RADIUS_CANVAS = HOLE_RADIUS_PERCENT * PIECE_RADIUS_CANVAS;

  const PIECE_POSITIONS = [];
  for (const position of BOARD_MACROS.positions) {
    const piecePosition = {
      x:
        position.x * BOARD_DIAMETER_CANVAS +
        (ctx.canvas.width - BOARD_DIAMETER_CANVAS) / 2,
      y:
        position.y * BOARD_DIAMETER_CANVAS +
        (ctx.canvas.height - BOARD_DIAMETER_CANVAS) / 2,
    };
    PIECE_POSITIONS.push(piecePosition);
  }

  return {
    BOARD_DIAMETER_CANVAS,
    PIECE_RADIUS_CANVAS,
    HOLE_RADIUS_CANVAS,
    PIECE_POSITIONS,
  };
}
