import Color from "colorjs.io";
import { EMPTY_CELL } from "../../board";
import type { Vector2d } from "../../vector";
import type { BoardRendererConstants } from "./constants";

const SQRT_2 = 2 ** 0.5;
const SQRT_3 = 3 ** 0.5;

const BOARD_COLOR = new Color("#edb878");
const EMPTY_COLOR = new Color("#a07d51");

const CLUSTER_OFFSETS: Vector2d[] = [
  { x: 2, y: 2 / SQRT_3 },
  { x: 0, y: 2 / SQRT_3 },
  { x: -2, y: 2 / SQRT_3 },
  { x: 1, y: -1 / SQRT_3 },
  { x: -1, y: -1 / SQRT_3 },
  { x: 0, y: -4 / SQRT_3 },
  { x: 1, y: 1 / SQRT_3 },
  { x: -1, y: 1 / SQRT_3 },
  { x: 0, y: -2 / SQRT_3 },
  { x: 0, y: 0 },
];

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

/** Just draws some light-adjusted circles on top of each other, offset from center */
function drawLightedSphere(
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
  const radiusMultiplier = (multiplier * radius) / SQRT_2;

  const localFill = fill.clone();
  const localStroke = new Color("black");

  localFill.alpha = opacity;
  localStroke.alpha = opacity;

  drawCircle(ctx, localFill, localStroke, position, radius, 0);

  localFill.lighten(LIGHT_L2);

  drawCircle(
    ctx,
    localFill,
    undefined,
    {
      x: position.x + radiusMultiplier * (1 - RADIUS_L2),
      y: position.y - radiusMultiplier * (1 - RADIUS_L2),
    },
    RADIUS_L2 * radius,
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
    RADIUS_L3 * radius,
    0,
  );
}

export function drawHole(
  ctx: CanvasRenderingContext2D,
  constants: BoardRendererConstants,
  position: Vector2d,
) {
  drawCircle(
    ctx,
    EMPTY_COLOR.clone(),
    new Color("#000000"),
    position,
    constants.HOLE_RADIUS_CANVAS,
    0.0
  );
}

export function drawPiece(
  ctx: CanvasRenderingContext2D,
  constants: BoardRendererConstants,
  fill: Color,
  position: Vector2d,
  opacity: number,
) {
  drawLightedSphere(
    ctx,
    fill,
    position,
    constants.PIECE_RADIUS_CANVAS,
    false,
    opacity,
  );
}

export function drawBoardState(
  ctx: CanvasRenderingContext2D,
  constants: BoardRendererConstants,
  playerColors: Color[],
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
      const color = playerColors[state[i]].clone();

      if (activePieceIndex !== i) {
        drawPiece(ctx, constants, color, constants.PIECE_POSITIONS[i], 1.0);
      } else {
        drawHole(ctx, constants, constants.PIECE_POSITIONS[i]);
      }
    }
  }
}

export function drawPieceCluster(
  ctx: CanvasRenderingContext2D,
  constants: BoardRendererConstants,
  fill: Color,
  center: Vector2d,
  opacity: number,
) {
  for (const offset of CLUSTER_OFFSETS) {
    drawPiece(
      ctx,
      constants,
      fill,
      {
        x: constants.PIECE_RADIUS_CANVAS * offset.x + center.x,
        y: constants.PIECE_RADIUS_CANVAS * offset.y + center.y,
      },
      opacity,
    );
  }
}
