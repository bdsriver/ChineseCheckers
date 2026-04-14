import Color from "colorjs.io";
import type { Board } from "./board";
import type { BoardBuilder } from "./board/builder";
import { BOARD_MACROS } from "./board/macros";
import { DEBUG } from "./constants";
import {
  type BoardRendererConstants,
  computeConstants,
} from "./renderer/constants";
import {
  drawBoardState,
  drawCircle,
  drawDebugBoard,
  drawPiece,
} from "./renderer/drawFunctions";
import { screenToCanvasSpace, withinCircle } from "./renderer/mouseFunctions";
import type { Vector2d } from "./vector";

/** Adds some padding to the hover radius of board positions */
const HOVER_MULTIPLIER = 11 / 8;

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private hoveredPosition: number | undefined;
  private activePiece: number | undefined;
  private mousePosition: Vector2d;
  private constants: BoardRendererConstants;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.constants = computeConstants(ctx);
    this.hoveredPosition = undefined;
    this.activePiece = undefined;
    this.mousePosition = { x: 0, y: 0 };
  }

  onMouseMove(e: MouseEvent) {
    this.mousePosition = screenToCanvasSpace(this.ctx, { x: e.x, y: e.y });
    this.hoveredPosition = undefined;

    for (let i = 0; i < BOARD_MACROS.positions.length; i++) {
      const withinPiece = withinCircle(
        this.mousePosition,
        this.constants.PIECE_POSITIONS[i],
        this.constants.PIECE_RADIUS_CANVAS * HOVER_MULTIPLIER,
      );
      if (withinPiece) {
        this.hoveredPosition = i;
      }
    }
  }

  onMouseDown(board: Board) {
    if (
      this.hoveredPosition !== undefined &&
      board.state[this.hoveredPosition] === board.currentTurn
    ) {
      this.activePiece = this.hoveredPosition;
    }
  }

  onMouseUp(board: Board) {
    if (this.activePiece !== undefined && this.hoveredPosition !== undefined) {
      const availableMoves = board.getAvailableMoves(this.activePiece);
      if (availableMoves.has(this.hoveredPosition)) {
        board.movePlayer(this.activePiece, this.hoveredPosition);
      }
    }

    this.activePiece = undefined;
  }

  renderBuilder(board: BoardBuilder) {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      drawBoardState(this.ctx, this.constants, board.state, this.activePiece);

      if (DEBUG) {
        drawDebugBoard(this.ctx, this.constants);
      }
    });
  }

  render(board: Board) {
    window.requestAnimationFrame(() => {
      if (this.activePiece !== undefined) {
        this.ctx.canvas.style.cursor = "grabbing";
      } else if (
        this.hoveredPosition !== undefined &&
        board.state[this.hoveredPosition] === board.currentTurn
      ) {
        this.ctx.canvas.style.cursor = "grab";
      } else {
        this.ctx.canvas.style.cursor = "default";
      }

      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      drawBoardState(this.ctx, this.constants, board.state, this.activePiece);

      /** Render jump spots */
      let targetPieceIndex: undefined | number;
      if (this.activePiece !== undefined) {
        targetPieceIndex = this.activePiece;
      } else if (
        this.hoveredPosition !== undefined &&
        board.state[this.hoveredPosition] === board.currentTurn
      ) {
        targetPieceIndex = this.hoveredPosition;
      }

      if (targetPieceIndex !== undefined) {
        const availableMoves = board.getAvailableMoves(targetPieceIndex);

        for (const move of availableMoves.values()) {
          if (move === this.hoveredPosition) {
            drawPiece(
              this.ctx,
              this.constants,
              board.state[targetPieceIndex],
              this.constants.PIECE_POSITIONS[move],
              2 / 3,
            );
          } else {
            drawPiece(
              this.ctx,
              this.constants,
              board.state[targetPieceIndex],
              this.constants.PIECE_POSITIONS[move],
              1 / 4,
            );
          }
        }
      }

      /** Render active piece */
      if (this.activePiece !== undefined) {
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
          drawPiece(
            this.ctx,
            this.constants,
            board.state[this.activePiece],
            this.mousePosition,
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

          drawPiece(
            this.ctx,
            this.constants,
            board.state[this.activePiece],
            adjustedPoint,
            1,
          );
        }
      }

      /** Highlight just moved piece */
      drawCircle(
        this.ctx,
        new Color("#ffffff"),
        undefined,
        this.constants.PIECE_POSITIONS[board.currentPath[0]],
        this.constants.PIECE_RADIUS_CANVAS / 2,
        0,
      );

      drawCircle(
        this.ctx,
        new Color("#ffffff"),
        undefined,
        this.constants.PIECE_POSITIONS[
          board.currentPath[board.currentPath.length - 1]
        ],
        this.constants.PIECE_RADIUS_CANVAS / 2,
        0,
      );

      if (DEBUG) {
        drawDebugBoard(this.ctx, this.constants);
      }
    });
  }
}
