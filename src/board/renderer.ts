import { type Board, EMPTY_CELL } from "../board";
import type { Vector2d } from "../vector";
import { BOARD_MACROS } from "./macros";
import {
  type BoardRendererConstants,
  computeConstants,
} from "./renderer/constants";
import { drawBoardState, drawPiece } from "./renderer/drawFunctions";
import { screenToCanvasSpace, withinCircle } from "./renderer/mouseFunctions";

/** Adds some padding to the hover radius of board positions */
const HOVER_MULTIPLIER = 11 / 8;

export class BoardRenderer {
  private ctx: CanvasRenderingContext2D;
  private hoveredPieceIndex: number | undefined;
  private activePieceIndex: number | undefined;
  private mousePosition: Vector2d;
  private board: Board;
  private constants: BoardRendererConstants;

  constructor(ctx: CanvasRenderingContext2D, board: Board) {
    this.ctx = ctx;
    this.constants = computeConstants(ctx);
    this.hoveredPieceIndex = undefined;
    this.activePieceIndex = undefined;
    this.mousePosition = { x: 0, y: 0 };
    this.board = board;

    ctx.canvas.onmousemove = (e) => {
      this.mousePosition = screenToCanvasSpace(this.ctx, { x: e.x, y: e.y });
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
      const withinPiece = withinCircle(
        this.mousePosition,
        this.constants.PIECE_POSITIONS[i],
        this.constants.PIECE_RADIUS_CANVAS * HOVER_MULTIPLIER,
      );
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
      this.constants,
      this.board.colors,
      this.board.state,
      this.activePieceIndex,
    );

    /** Render jump spots */
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
        const color =
          this.board.colors[this.board.state[targetPieceIndex]].clone();

        if (move === this.hoveredPieceIndex) {
          drawPiece(
            this.ctx,
            this.constants,
            color,
            this.constants.PIECE_POSITIONS[move],
            2 / 3,
          );
        } else {
          drawPiece(
            this.ctx,
            this.constants,
            color,
            this.constants.PIECE_POSITIONS[move],
            1 / 4,
          );
        }
      }
    }

    /** Render active piece */
    if (this.activePieceIndex !== undefined) {
      const color =
        this.board.colors[this.board.state[this.activePieceIndex]].clone();

      const mouseVector: Vector2d = {
        x: this.mousePosition.x - 0.5 * this.ctx.canvas.width,
        y: this.mousePosition.y - 0.5 * this.ctx.canvas.height,
      };
      const mouseVectorLengthSquared =
        mouseVector.x * mouseVector.x + mouseVector.y * mouseVector.y;
      const boundaryRadiusSquared =
        (this.constants.BOARD_DIAMETER_CANVAS / 2 -
          this.constants.PIECE_RADIUS_CANVAS) **
        2;

      if (mouseVectorLengthSquared <= boundaryRadiusSquared) {
        drawPiece(this.ctx, this.constants, color, this.mousePosition, 1);
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

        drawPiece(this.ctx, this.constants, color, adjustedPoint, 1);
      }
    }
  }
}
