import Color from "colorjs.io";
import { BOARD_MACROS } from "./macros";

const INV_SQRT_2 = 2 ** -0.5;
const PIECE_RADIUS = 22;
const COLORS = {
  BOARD: new Color("#edb878"),
  EMPTY: new Color("#423627"),
  P1: new Color("#008000"),
  P2: new Color("#9b0606"),
  P3: new Color("#800080"),
  P4: new Color("#2e3ef0"),
  P5: new Color("#df6800"),
  P6: new Color("#aca408"),
} as const;

export class BoardRenderer {
  private ctx: CanvasRenderingContext2D;
  private hoveredPieceIndex: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.hoveredPieceIndex = -1;

    ctx.canvas.onmousemove = (e) => {
      this.onMouseMove(this.toCanvasPosition({ x: e.x, y: e.y }));
    };

    ctx.canvas.onmousedown = (e) => {
      this.onMouseDown(this.toCanvasPosition({ x: e.x, y: e.y }));
    };

    ctx.canvas.onmouseup = (e) => {
      this.onMouseUp(this.toCanvasPosition({ x: e.x, y: e.y }));
    };
  }

  private onMouseDown(canvasPosition: { x: number; y: number }) {
    // TODO
  }

  private onMouseUp(canvasPosition: { x: number; y: number }) {
    // TODO
  }

  private onMouseMove(canvasPosition: { x: number; y: number }) {
    for (let index = 0; index < BOARD_MACROS.positions.length; index++) {
      const cellPosition = BOARD_MACROS.positions[index];
      const withinPiece =
        Math.sqrt(
          (canvasPosition.x - cellPosition.x) ** 2 +
            (canvasPosition.y - cellPosition.y) ** 2,
        ) <=
        PIECE_RADIUS / this.ctx.canvas.width;
      if (withinPiece) {
        this.hoveredPieceIndex = index;
      }
    }
  }

  private toCanvasPosition(screenPosition: { x: number; y: number }) {
    return {
      x:
        (screenPosition.x - this.ctx.canvas.offsetLeft) /
        this.ctx.canvas.offsetWidth,
      y:
        (screenPosition.y - this.ctx.canvas.offsetTop) /
        this.ctx.canvas.offsetHeight,
    };
  }

  private drawCircle(fill: Color, x: number, y: number, r: number) {
    this.ctx.moveTo(x * this.ctx.canvas.width, y * this.ctx.canvas.height);
    this.ctx.beginPath();
    this.ctx.arc(
      x * this.ctx.canvas.width,
      y * this.ctx.canvas.height,
      r,
      0,
      360,
    );
    this.ctx.fillStyle = fill.to("srgb").toString();
    this.ctx.fill();
  }

  /** Just draws some light-adjusted circles on top of each other, offset from center */
  private drawLightedSphere(
    fill: Color,
    x: number,
    y: number,
    radius: number,
    hole: boolean,
  ) {
    const RADIUS_L2 = 7 / 10;
    const RADIUS_L3 = 2 / 5;
    const LIGHT_L2 = 0.1;
    const LIGHT_L3 = 0.15;
    const multiplier = !hole ? 0.7 : -0.7;

    const localFill = fill.clone();

    this.drawCircle(localFill, x, y, radius);

    localFill.lighten(LIGHT_L2);

    this.drawCircle(
      localFill,
      x +
        (multiplier * (INV_SQRT_2 * radius * (1 - RADIUS_L2))) /
          this.ctx.canvas.width,
      y -
        (multiplier * (INV_SQRT_2 * radius * (1 - RADIUS_L2))) /
          this.ctx.canvas.height,
      RADIUS_L2 * radius,
    );

    localFill.lighten(LIGHT_L3);

    this.drawCircle(
      localFill,
      x +
        (multiplier * (INV_SQRT_2 * radius * (1 - RADIUS_L3))) /
          this.ctx.canvas.width,
      y -
        (multiplier * (INV_SQRT_2 * radius * (1 - RADIUS_L3))) /
          this.ctx.canvas.height,
      RADIUS_L3 * radius,
    );
  }

  render(state: number[]) {
    // if (this.hoveredPieceIndex !== -1) {
    this.ctx.canvas.style.cursor = "grab"; // grabbing
    // } else {
    //   this.ctx.canvas.style.cursor = "default";
    // }

    this.drawCircle(COLORS.BOARD, 0.5, 0.5, this.ctx.canvas.width / 2);

    for (let i = 0; i < state.length; i++) {
      let color = COLORS.EMPTY.clone();
      let hole = false;

      switch (state[i]) {
        case 0: {
          color = COLORS.P1.clone();
          break;
        }
        case 1: {
          color = COLORS.P2.clone();
          break;
        }
        case 2: {
          color = COLORS.P3.clone();
          break;
        }
        case 3: {
          color = COLORS.P4.clone();
          break;
        }
        case 4: {
          color = COLORS.P5.clone();
          break;
        }
        case 5: {
          color = COLORS.P6.clone();
          break;
        }
        default: {
          hole = true;
          break;
        }
      }

      const position = BOARD_MACROS.positions[i];

      this.drawLightedSphere(color, position.x, position.y, PIECE_RADIUS, hole);
    }
  }
}
