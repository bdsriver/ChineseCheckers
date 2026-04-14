import Color from "colorjs.io";
import { EMPTY_CELL } from "../board";
import type { Vector2d } from "../vector";
import type { BoardRendererConstants } from "./constants";

const PLAYER_COLORS = [
  new Color("#9b0606"),
  new Color("#026d10"),
  new Color("#aaacaf"),
  new Color("#aca408"),
  new Color("#2e3ef0"),
  new Color("#292e2a"),
] as const;
const BOARD_COLOR = new Color("#edb878");
const HOLE_COLOR = new Color("#a07d51");

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  fill: Color,
  stroke: Color | undefined,
  position: Vector2d,
  radius: number,
  blur: number,
) {
  ctx.moveTo(position.x, position.y);
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, 360);
  ctx.fillStyle = fill.to("srgb").toString();
  if (blur !== undefined) {
    ctx.filter = `blur(${blur}px)`;
  } else {
    ctx.filter = "blur(0px)";
  }
  ctx.fill();
  if (stroke !== undefined) {
    ctx.strokeStyle = stroke.to("srgb").toString();
    ctx.stroke();
  }
}

export function drawHole(
  ctx: CanvasRenderingContext2D,
  constants: BoardRendererConstants,
  position: Vector2d,
) {
  drawCircle(
    ctx,
    HOLE_COLOR.clone(),
    new Color("#000000"),
    position,
    constants.HOLE_RADIUS_CANVAS,
    0.0,
  );
}

export function drawPiece(
  ctx: CanvasRenderingContext2D,
  constants: BoardRendererConstants,
  playerIndex: number,
  position: Vector2d,
  opacity: number,
) {
  const RADIUS_L2 = 7 / 10;
  const RADIUS_L3 = 2 / 5;
  const LIGHT_L2 = 0.1;
  const LIGHT_L3 = 0.15;
  const multiplier = 0.7;
  const radiusMultiplier =
    (multiplier * constants.PIECE_RADIUS_CANVAS) / (2 ** 0.5);

  const localFill = PLAYER_COLORS[playerIndex].clone();
  const localStroke = new Color("black");

  localFill.alpha = opacity;
  localStroke.alpha = opacity;

  drawCircle(
    ctx,
    localFill,
    localStroke,
    position,
    constants.PIECE_RADIUS_CANVAS,
    0,
  );

  localFill.lighten(LIGHT_L2);

  drawCircle(
    ctx,
    localFill,
    undefined,
    {
      x: position.x + radiusMultiplier * (1 - RADIUS_L2),
      y: position.y - radiusMultiplier * (1 - RADIUS_L2),
    },
    RADIUS_L2 * constants.PIECE_RADIUS_CANVAS,
    0,
  );

  localFill.lighten(LIGHT_L3);

  drawCircle(
    ctx,
    localFill,
    undefined,
    {
      x: position.x + radiusMultiplier * (1 - RADIUS_L3),
      y: position.y - radiusMultiplier * (1 - RADIUS_L3),
    },
    RADIUS_L3 * constants.PIECE_RADIUS_CANVAS,
    0,
  );
}

export function drawBoardState(
  ctx: CanvasRenderingContext2D,
  constants: BoardRendererConstants,
  state: number[],
  activePieceIndex: number | undefined,
) {
  /** Board */
  drawCircle(
    ctx,
    BOARD_COLOR,
    new Color("black"),
    { x: 0.5 * ctx.canvas.width, y: 0.5 * ctx.canvas.height },
    constants.BOARD_DIAMETER_CANVAS / 2,
    0,
  );

  /** Render empty spots */
  for (let i = 0; i < state.length; i++) {
    if (state[i] === EMPTY_CELL) {
      drawHole(ctx, constants, constants.PIECE_POSITIONS[i]);
    }
  }

  /** Render passive pieces */
  for (let i = 0; i < state.length; i++) {
    if (state[i] !== EMPTY_CELL) {
      if (activePieceIndex !== i) {
        drawPiece(ctx, constants, state[i], constants.PIECE_POSITIONS[i], 1.0);
      } else {
        drawHole(ctx, constants, constants.PIECE_POSITIONS[i]);
      }
    }
  }
}
