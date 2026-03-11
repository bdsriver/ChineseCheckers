import Color from "colorjs.io";
import { EMPTY_CELL, type Board } from "../board";
import type { Vector2d } from "../vector";
import { BOARD_MACROS } from "./macros";

/** Diameter of board, in percent of screen height */
const BOARD_DIAMETER_PERCENTAGE = 3 / 4;
/** Diameter of piece, in percent of board diameter */
const PIECE_DIAMETER_PERCENTAGE = 3 / 64;
const COLORS = {
  BOARD: new Color("#edb878"),
  EMPTY: new Color("#423627"),
  PLAYERS: [
    new Color("#008000"),
    new Color("#9b0606"),
    new Color("#800080"),
    new Color("#2e3ef0"),
    new Color("#df6800"),
    new Color("#aca408"),
  ],
} as const;

export class BoardRenderer {
  private ctx: CanvasRenderingContext2D;
  private hoveredPieceIndex: number;
  private mouseDragging: boolean;
  private mousePosition: Vector2d;
  private board: Board;

  private BOARD_DIAMETER_CANVAS: number;
  private PIECE_DIAMETER_CANVAS: number;

  constructor(ctx: CanvasRenderingContext2D, board: Board) {
    this.ctx = ctx;
    this.hoveredPieceIndex = -1;
    this.mouseDragging = false;
    this.mousePosition = { x: 0, y: 0 };
    this.board = board;

    ctx.canvas.onmousemove = (e) => {
      this.mousePosition = {
        x:
          (e.x - this.ctx.canvas.offsetLeft) *
          (this.ctx.canvas.width / this.ctx.canvas.offsetWidth),
        y:
          (e.y - this.ctx.canvas.offsetTop) *
          (this.ctx.canvas.height / this.ctx.canvas.offsetHeight),
      };
      this.onMouseMove();
    };

    ctx.canvas.onmousedown = () => {
      this.onMouseDown();
    };

    ctx.canvas.onmouseup = () => {
      this.onMouseUp();
    };

    const BOARD_DIAMETER_PIXELS =
      BOARD_DIAMETER_PERCENTAGE * document.body.offsetHeight;
    this.BOARD_DIAMETER_CANVAS =
      (BOARD_DIAMETER_PIXELS * this.ctx.canvas.height) /
      this.ctx.canvas.offsetHeight;
    this.PIECE_DIAMETER_CANVAS =
      this.BOARD_DIAMETER_CANVAS * PIECE_DIAMETER_PERCENTAGE;

    this.safeRender();
  }

  private onMouseDown() {
    this.mouseDragging = true;
    this.safeRender();
  }

  private onMouseUp() {
    this.mouseDragging = false;
    this.computeHoveredPiece();
    this.safeRender();
  }

  private onMouseMove() {
    if (!this.mouseDragging) {
      this.computeHoveredPiece();
    }

    this.safeRender();
  }

  private piecePositionToBoardCoordinates(vector: Vector2d) {
    return {
      x:
        vector.x * this.BOARD_DIAMETER_CANVAS +
        (this.ctx.canvas.width - this.BOARD_DIAMETER_CANVAS) / 2,
      y:
        vector.y * this.BOARD_DIAMETER_CANVAS +
        (this.ctx.canvas.height - this.BOARD_DIAMETER_CANVAS) / 2,
    };
  }

  private computeHoveredPiece() {
    this.hoveredPieceIndex = -1;

    for (let i = 0; i < BOARD_MACROS.positions.length; i++) {
      if (this.board.state[i] !== EMPTY_CELL) {
        const piecePosition = this.piecePositionToBoardCoordinates(
          BOARD_MACROS.positions[i],
        );
        const withinPiece =
          (this.mousePosition.x - piecePosition.x) ** 2 +
            (this.mousePosition.y - piecePosition.y) ** 2 <=
          (this.PIECE_DIAMETER_CANVAS / 2) ** 2;
        if (withinPiece) {
          this.hoveredPieceIndex = i;
        }
      }
    }
  }

  private drawCircle(fill: Color, position: Vector2d, r: number) {
    this.ctx.moveTo(position.x, position.y);
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, r, 0, 360);
    this.ctx.fillStyle = fill.to("srgb").toString();
    this.ctx.fill();
  }

  /** Just draws some light-adjusted circles on top of each other, offset from center */
  private drawLightedSphere(
    fill: Color,
    position: Vector2d,
    radius: number,
    hole: boolean,
  ) {
    const RADIUS_L2 = 7 / 10;
    const RADIUS_L3 = 2 / 5;
    const LIGHT_L2 = 0.1;
    const LIGHT_L3 = 0.15;
    const multiplier = !hole ? 0.7 : -0.7;
    const radiusMultiplier = (multiplier * radius) / 2 ** 0.5;

    const localFill = fill.clone();

    this.drawCircle(localFill, position, radius);

    localFill.lighten(LIGHT_L2);

    this.drawCircle(
      localFill,
      {
        x: position.x + radiusMultiplier * (1 - RADIUS_L2),
        y: position.y - radiusMultiplier * (1 - RADIUS_L2),
      },
      RADIUS_L2 * radius,
    );

    localFill.lighten(LIGHT_L3);

    this.drawCircle(
      localFill,
      {
        x: position.x + radiusMultiplier * (1 - RADIUS_L3),
        y: position.y - radiusMultiplier * (1 - RADIUS_L3),
      },
      RADIUS_L3 * radius,
    );
  }

  private safeRender() {
    window.requestAnimationFrame(() => this.render());
  }

  private render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.hoveredPieceIndex !== -1) {
      if (this.mouseDragging) {
        this.ctx.canvas.style.cursor = "grabbing";
      } else {
        this.ctx.canvas.style.cursor = "grab";
      }
    } else {
      this.ctx.canvas.style.cursor = "default";
    }

    // Render board
    const PIXEL_HEIGHT = BOARD_DIAMETER_PERCENTAGE * document.body.offsetHeight;
    const CANVAS_HEIGHT =
      (PIXEL_HEIGHT * this.ctx.canvas.height) / this.ctx.canvas.offsetHeight;
    this.drawCircle(
      COLORS.BOARD,
      { x: 0.5 * this.ctx.canvas.width, y: 0.5 * this.ctx.canvas.height },
      CANVAS_HEIGHT / 2,
    );

    // Render empty spots
    for (let i = 0; i < this.board.state.length; i++) {
      if (this.board.state[i] === EMPTY_CELL) {
        const piecePosition = this.piecePositionToBoardCoordinates(
          BOARD_MACROS.positions[i],
        );

        this.drawLightedSphere(
          COLORS.EMPTY.clone(),
          piecePosition,
          this.PIECE_DIAMETER_CANVAS / 2,
          true,
        );
      }
    }

    // Render passive pieces
    for (let i = 0; i < this.board.state.length; i++) {
      if (this.board.state[i] !== EMPTY_CELL) {
        const color = COLORS.PLAYERS[this.board.state[i]].clone();
        const piecePosition = this.piecePositionToBoardCoordinates(
          BOARD_MACROS.positions[i],
        );

        if (
          !this.mouseDragging ||
          (this.mouseDragging && this.hoveredPieceIndex !== i)
        ) {
          this.drawLightedSphere(
            color,
            piecePosition,
            this.PIECE_DIAMETER_CANVAS / 2,
            false,
          );
        }
      }
    }

    // Render active piece
    for (let i = 0; i < this.board.state.length; i++) {
      if (this.board.state[i] !== EMPTY_CELL) {
        const color = COLORS.PLAYERS[this.board.state[i]].clone();
        const piecePosition = this.piecePositionToBoardCoordinates(
          BOARD_MACROS.positions[i],
        );

        if (this.mouseDragging && this.hoveredPieceIndex === i) {
          this.drawLightedSphere(
            COLORS.EMPTY,
            piecePosition,
            this.PIECE_DIAMETER_CANVAS / 2,
            true,
          );

          const mouseVector: Vector2d = {
            x: this.mousePosition.x - 0.5 * this.ctx.canvas.width,
            y: this.mousePosition.y - 0.5 * this.ctx.canvas.height,
          };
          const mouseVectorLengthSquared =
            mouseVector.x * mouseVector.x + mouseVector.y * mouseVector.y;
          const boundaryRadiusSquared =
            (this.BOARD_DIAMETER_CANVAS / 2 - this.PIECE_DIAMETER_CANVAS / 2) **
            2;

          if (mouseVectorLengthSquared <= boundaryRadiusSquared) {
            this.drawLightedSphere(
              color,
              this.mousePosition,
              this.PIECE_DIAMETER_CANVAS / 2,
              false,
            );
          } else {
            const adjustedPoint: Vector2d = {
              x:
                mouseVector.x *
                  Math.sqrt(boundaryRadiusSquared / mouseVectorLengthSquared) +
                0.5 * this.ctx.canvas.width,
              y:
                mouseVector.y *
                  Math.sqrt(boundaryRadiusSquared / mouseVectorLengthSquared) +
                0.5 * this.ctx.canvas.height,
            };
            this.drawLightedSphere(
              color,
              adjustedPoint,
              this.PIECE_DIAMETER_CANVAS / 2,
              false,
            );
          }
        }
      }
    }
  }
}

// TODO BoardBuilderRenderer
