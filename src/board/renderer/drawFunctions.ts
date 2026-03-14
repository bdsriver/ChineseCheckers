import Color from "colorjs.io";
import { EMPTY_CELL } from "../../board";
import type { Vector2d } from "../../vector";
import type { BoardRenderingConstants } from "./constants";

const BOARD_COLOR = new Color("#edb878");
const EMPTY_COLOR = new Color("#423627");

/** Radius of board holes, in percent of piece radius */
const HOLE_RADIUS_PERCENT = 3 / 4;

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  fill: Color,
  position: Vector2d,
  r: number,
) {
  ctx.moveTo(position.x, position.y);
  ctx.beginPath();
  ctx.arc(position.x, position.y, r, 0, 360);
  ctx.fillStyle = fill.to("srgb").toString();
  ctx.fill();
}

/** Just draws some light-adjusted circles on top of each other, offset from center */
export function drawLightedSphere(
  ctx: CanvasRenderingContext2D,
  fill: Color,
  position: Vector2d,
  radius: number,
  hole: boolean,
  opacity: number,
) {
  const RADIUS_L2 = 7 / 10;
  const RADIUS_L3 = 2 / 5;
  const LIGHT_L2 = 0.1;
  const LIGHT_L3 = 0.15;
  const multiplier = !hole ? 0.7 : -0.7;
  const radiusMultiplier = (multiplier * radius) / 2 ** 0.5;

  const localFill = fill.clone();
  localFill.alpha = opacity;

  drawCircle(ctx, localFill, position, radius);

  localFill.lighten(LIGHT_L2);

  drawCircle(
    ctx,
    localFill,
    {
      x: position.x + radiusMultiplier * (1 - RADIUS_L2),
      y: position.y - radiusMultiplier * (1 - RADIUS_L2),
    },
    RADIUS_L2 * radius,
  );

  localFill.lighten(LIGHT_L3);

  drawCircle(
    ctx,
    localFill,
    {
      x: position.x + radiusMultiplier * (1 - RADIUS_L3),
      y: position.y - radiusMultiplier * (1 - RADIUS_L3),
    },
    RADIUS_L3 * radius,
  );
}

export function drawBoardState(
  ctx: CanvasRenderingContext2D,
  constants: BoardRenderingConstants,
  playerColors: Color[],
  state: number[],
  activePieceIndex: number | undefined,
) {
  // Render board
  drawCircle(
    ctx,
    BOARD_COLOR,
    { x: 0.5 * ctx.canvas.width, y: 0.5 * ctx.canvas.height },
    constants.BOARD_DIAMETER_CANVAS / 2,
  );

  // Render empty spots
  for (let i = 0; i < state.length; i++) {
    if (state[i] === EMPTY_CELL) {
      drawLightedSphere(
        ctx,
        EMPTY_COLOR.clone(),
        constants.PIECE_POSITIONS[i],
        constants.PIECE_RADIUS_CANVAS * HOLE_RADIUS_PERCENT,
        true,
        1,
      );
    }
  }

  // Render passive pieces
  for (let i = 0; i < state.length; i++) {
    if (state[i] !== EMPTY_CELL) {
      const color = playerColors[state[i]].clone();

      if (activePieceIndex !== i) {
        drawLightedSphere(
          ctx,
          color,
          constants.PIECE_POSITIONS[i],
          constants.PIECE_RADIUS_CANVAS,
          false,
          1,
        );
      } else {
        drawLightedSphere(
          ctx,
          EMPTY_COLOR.clone(),
          constants.PIECE_POSITIONS[i],
          constants.PIECE_RADIUS_CANVAS * HOLE_RADIUS_PERCENT,
          true,
          1,
        );
      }
    }
  }
}
