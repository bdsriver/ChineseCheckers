import Color from "colorjs.io";
import { DEBUG } from "../constants";
import type { ClientBoard } from "./board/client";
import type { ClientBoardBuilder } from "./board/client/builder";
import { BOARD_MACROS } from "./board/macros";
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

const MOVE_PREVIEW_COLOR = new Color("#00000066");
const PREVIOUS_MOVE_COLOR = new Color("#ffffff88");
const HOVERED_MOVE_COLOR = new Color("#ffffffff");

/** Adds some padding to the hover radius of board positions */
const HOVER_MULTIPLIER = 11 / 8;

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private hoveredPosition: number | undefined;
  private heldPieceIndex: number | undefined;
  private selectedPieceIndex: number | undefined;
  private mousePosition: Vector2d;
  private constants: BoardRendererConstants;
  private computedAvailableMoves: Set<number>;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.constants = computeConstants(ctx);
    this.hoveredPosition = undefined;
    this.heldPieceIndex = undefined;
    this.selectedPieceIndex = undefined;
    this.computedAvailableMoves = new Set();
    this.mousePosition = { x: 0, y: 0 };
  }

  onMouseMove(e: MouseEvent) {
    this.mousePosition = screenToCanvasSpace(this.ctx, { x: e.x, y: e.y });
    this.hoveredPosition = undefined;

    for (let i = 0; i < BOARD_MACROS.positions.length; i++) {
      const withinPosition = withinCircle(
        this.mousePosition,
        this.constants.PIECE_POSITIONS[i],
        this.constants.PIECE_RADIUS_CANVAS * HOVER_MULTIPLIER,
      );
      if (withinPosition) {
        this.hoveredPosition = i;
      }
    }
  }

  onMouseDown(board: ClientBoard) {
    if (this.hoveredPosition !== undefined && board.isClientsTurn) {
      if (board.state[this.hoveredPosition] === board.clientPosition) {
        this.setSelectedPiece(this.hoveredPosition, board);
        this.heldPieceIndex = this.hoveredPosition;
      } else if (
        this.selectedPieceIndex !== undefined &&
        this.computedAvailableMoves.has(this.hoveredPosition)
      ) {
        board.moveClient(this.selectedPieceIndex, this.hoveredPosition);
        this.setSelectedPiece(undefined, board);
      }
    }
  }

  onMouseUp(board: ClientBoard) {
    if (
      this.hoveredPosition !== undefined &&
      this.heldPieceIndex !== undefined
    ) {
      if (
        this.selectedPieceIndex !== undefined &&
        this.computedAvailableMoves.has(this.hoveredPosition)
      ) {
        board.moveClient(this.selectedPieceIndex, this.hoveredPosition);
        this.setSelectedPiece(undefined, board);
      }
    }

    this.heldPieceIndex = undefined;
  }

  private setSelectedPiece(index: number | undefined, board: ClientBoard) {
    this.selectedPieceIndex = index;
    if (this.selectedPieceIndex !== undefined) {
      this.computedAvailableMoves = board.getAvailableMoves(
        this.selectedPieceIndex,
      );
    } else {
      this.computedAvailableMoves = new Set();
    }
  }

  renderBuilder(board: ClientBoardBuilder) {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      drawBoardState(
        this.ctx,
        this.constants,
        board.state,
        this.selectedPieceIndex,
      );

      if (DEBUG) {
        drawDebugBoard(this.ctx, this.constants);
      }
    });
  }

  render(board: ClientBoard) {
    window.requestAnimationFrame(() => {
      if (this.heldPieceIndex !== undefined) {
        this.ctx.canvas.style.cursor = "grabbing";
      } else if (
        this.hoveredPosition !== undefined &&
        board.state[this.hoveredPosition] === board.clientPosition &&
        board.isClientsTurn
      ) {
        this.ctx.canvas.style.cursor = "grab";
      } else if (
        this.hoveredPosition !== undefined &&
        this.computedAvailableMoves.has(this.hoveredPosition) &&
        board.isClientsTurn
      ) {
        this.ctx.canvas.style.cursor = "pointer";
      } else {
        this.ctx.canvas.style.cursor = "default";
      }

      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      drawBoardState(
        this.ctx,
        this.constants,
        board.state,
        this.heldPieceIndex,
      );

      /** Highlight just moved piece */
      if (board.previousTurnMove.length > 0) {
        drawCircle(
          this.ctx,
          undefined,
          PREVIOUS_MOVE_COLOR,
          this.constants.PIECE_POSITIONS[board.previousTurnMove[0]],
          this.constants.PIECE_RADIUS_CANVAS,
          0,
        );

        drawCircle(
          this.ctx,
          undefined,
          PREVIOUS_MOVE_COLOR,
          this.constants.PIECE_POSITIONS[
            board.previousTurnMove[board.previousTurnMove.length - 1]
          ],
          this.constants.PIECE_RADIUS_CANVAS,
          0,
        );
      }

      /** Render jump spots */
      if (this.selectedPieceIndex !== undefined) {
        const availableMoves = board.getAvailableMoves(this.selectedPieceIndex);

        for (const move of availableMoves.values()) {
          drawCircle(
            this.ctx,
            MOVE_PREVIEW_COLOR,
            undefined,
            this.constants.PIECE_POSITIONS[move],
            (this.constants.PIECE_RADIUS_CANVAS * 1) / 2,
            0,
          );
        }
        /** Render hovered move spots */
        if (
          this.heldPieceIndex !== undefined &&
          this.hoveredPosition !== undefined
        ) {
          if (availableMoves.has(this.hoveredPosition)) {
            drawCircle(
              this.ctx,
              undefined,
              HOVERED_MOVE_COLOR,
              this.constants.PIECE_POSITIONS[this.hoveredPosition],
              this.constants.PIECE_RADIUS_CANVAS,
              0,
            );
          }
        }
      }

      /** Render active piece */
      if (this.heldPieceIndex !== undefined) {
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
            board.state[this.heldPieceIndex],
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
            board.state[this.heldPieceIndex],
            adjustedPoint,
            1,
          );
        }
      }

      if (DEBUG) {
        drawDebugBoard(this.ctx, this.constants);
      }
    });
  }
}
