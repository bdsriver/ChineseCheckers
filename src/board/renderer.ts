import Color from "colorjs.io";
import { EMPTY_CELL, type Board } from "../board";
import type { Vector2d } from "../vector";
import { BOARD_MACROS } from "./macros";
import { BoardRenderingConstants } from "./renderer/constants";
import { drawBoardState, drawLightedSphere } from "./renderer/drawFunctions";

const COLOR_OPTIONS = {
  RED: new Color("#9b0606"),
  ORANGE: new Color("#df6800"),
  YELLOW: new Color("#aca408"),
  GREEN: new Color("#026d10"),
  BLUE: new Color("#2e3ef0"),
  PURPLE: new Color("#800080"),
  WHITE: new Color("#aaacaf"),
  GRAY: new Color("#5e5e5e"),
  BLACK: new Color("#292e2a"),
  PINK: new Color("#dd37bf"),
  LIME: new Color("#1bb510"),
  AQUA: new Color("#0cadaa"),
} as const;

const PLAYER_COLORS = [
  COLOR_OPTIONS.BLACK,
  COLOR_OPTIONS.WHITE,
  COLOR_OPTIONS.AQUA,
  COLOR_OPTIONS.PINK,
  COLOR_OPTIONS.GRAY,
  COLOR_OPTIONS.LIME,
];

export class BoardRenderer {
  private ctx: CanvasRenderingContext2D;
  private hoveredPieceIndex: number | undefined;
  private activePieceIndex: number | undefined;
  private mousePosition: Vector2d;
  private board: Board;
  private BOARD_CONSTANTS: BoardRenderingConstants;

  constructor(ctx: CanvasRenderingContext2D, board: Board) {
    this.ctx = ctx;
    this.hoveredPieceIndex = undefined;
    this.activePieceIndex = undefined;
    this.mousePosition = { x: 0, y: 0 };
    this.board = board;
    this.BOARD_CONSTANTS = new BoardRenderingConstants(ctx);

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

    this.safeRender();
  }

  private onMouseMove() {
    this.computeHoveredPiece();
    this.safeRender();
  }

  private onMouseDown() {
    if (
      this.hoveredPieceIndex !== undefined &&
      this.board.state[this.hoveredPieceIndex] !== EMPTY_CELL
    ) {
      this.activePieceIndex = this.hoveredPieceIndex;
    }

    this.safeRender();
  }

  private onMouseUp() {
    if (
      this.activePieceIndex !== undefined &&
      this.hoveredPieceIndex !== undefined
    ) {
      const availableMoves = this.board.availableMoves(this.activePieceIndex);
      if (availableMoves.has(this.hoveredPieceIndex)) {
        this.board.playerMove(this.activePieceIndex, this.hoveredPieceIndex);
      }
    }

    this.activePieceIndex = undefined;
    this.computeHoveredPiece();
    this.safeRender();
  }

  private computeHoveredPiece() {
    this.hoveredPieceIndex = undefined;

    for (let i = 0; i < BOARD_MACROS.positions.length; i++) {
      const withinPiece =
        (this.mousePosition.x - this.BOARD_CONSTANTS.PIECE_POSITIONS[i].x) **
          2 +
          (this.mousePosition.y - this.BOARD_CONSTANTS.PIECE_POSITIONS[i].y) **
            2 <=
        this.BOARD_CONSTANTS.PIECE_RADIUS_CANVAS ** 2;
      if (withinPiece) {
        this.hoveredPieceIndex = i;
      }
    }
  }

  private safeRender() {
    window.requestAnimationFrame(() => this.render());
  }

  private render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.activePieceIndex !== undefined) {
      this.ctx.canvas.style.cursor = "grabbing";
    } else if (
      this.hoveredPieceIndex !== undefined &&
      this.board.state[this.hoveredPieceIndex] !== EMPTY_CELL
    ) {
      this.ctx.canvas.style.cursor = "grab";
    } else {
      this.ctx.canvas.style.cursor = "default";
    }

    drawBoardState(
      this.ctx,
      this.BOARD_CONSTANTS,
      PLAYER_COLORS,
      this.board.state,
      this.activePieceIndex,
    );

    // Render jump spots
    let targetPieceIndex: undefined | number;
    if (this.activePieceIndex !== undefined) {
      targetPieceIndex = this.activePieceIndex;
    } else if (
      this.hoveredPieceIndex !== undefined &&
      this.board.state[this.hoveredPieceIndex] !== EMPTY_CELL
    ) {
      targetPieceIndex = this.hoveredPieceIndex;
    }

    if (targetPieceIndex !== undefined) {
      const availableMoves = this.board.availableMoves(targetPieceIndex);

      for (const move of availableMoves.values()) {
        const color = PLAYER_COLORS[this.board.state[targetPieceIndex]].clone();

        if (move === this.hoveredPieceIndex) {
          drawLightedSphere(
            this.ctx,
            color,
            this.BOARD_CONSTANTS.PIECE_POSITIONS[move],
            this.BOARD_CONSTANTS.PIECE_RADIUS_CANVAS,
            false,
            2 / 3,
          );
        } else {
          drawLightedSphere(
            this.ctx,
            color,
            this.BOARD_CONSTANTS.PIECE_POSITIONS[move],
            this.BOARD_CONSTANTS.PIECE_RADIUS_CANVAS,
            false,
            1 / 4,
          );
        }
      }
    }

    // Render active piece
    if (this.activePieceIndex !== undefined) {
      const color =
        PLAYER_COLORS[this.board.state[this.activePieceIndex]].clone();

      const mouseVector: Vector2d = {
        x: this.mousePosition.x - 0.5 * this.ctx.canvas.width,
        y: this.mousePosition.y - 0.5 * this.ctx.canvas.height,
      };
      const mouseVectorLengthSquared =
        mouseVector.x * mouseVector.x + mouseVector.y * mouseVector.y;
      const boundaryRadiusSquared =
        (this.BOARD_CONSTANTS.BOARD_DIAMETER_CANVAS / 2 -
          this.BOARD_CONSTANTS.PIECE_RADIUS_CANVAS) **
        2;

      if (mouseVectorLengthSquared <= boundaryRadiusSquared) {
        drawLightedSphere(
          this.ctx,
          color,
          this.mousePosition,
          this.BOARD_CONSTANTS.PIECE_RADIUS_CANVAS,
          false,
          1,
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

        drawLightedSphere(
          this.ctx,
          color,
          adjustedPoint,
          this.BOARD_CONSTANTS.PIECE_RADIUS_CANVAS,
          false,
          1,
        );
      }
    }
  }
}

// TODO BoardBuilderRenderer? or just keep board and board builder in the same renderer?
