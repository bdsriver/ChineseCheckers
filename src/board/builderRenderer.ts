import Color from "colorjs.io";
import type { Vector2d } from "../vector";
import type { BoardBuilder, Position } from "./builder";
import { BOARD_MACROS } from "./macros";
import { BoardRenderer } from "./renderer";
import {
  type BoardRendererConstants,
  computeConstants,
} from "./renderer/constants";
import {
  drawBoardState,
  drawCircle,
  drawPiece,
  drawPieceCluster,
} from "./renderer/drawFunctions";
import { screenToCanvasSpace, withinCircle } from "./renderer/mouseFunctions";

/**  A "cluster" refers to the pile of pieces off to the left before the game starts */

const CLUSTER_COLOR_OPTIONS = [
  new Color("#9b0606"),
  new Color("#df6800"),
  new Color("#aca408"),
  new Color("#026d10"),
  new Color("#2e3ef0"),
  new Color("#800080"),
  new Color("#aaacaf"),
  new Color("#5e5e5e"),
  new Color("#292e2a"),
  new Color("#dd37bf"),
  new Color("#1bb510"),
  new Color("#0cadaa"),
] as const;

/** Pieces on the board where the center */
const INITIAL_POSITION_CENTERS = [116, 87, 24, 4, 33, 96];

export class BoardBuilderRenderer {
  private ctx: CanvasRenderingContext2D;
  private constants: BoardRendererConstants;
  private board: BoardBuilder;
  private mousePosition: Vector2d;
  /** Index of the cluster that is hovered [0, colors.length) */
  private hoveredClusterIndex: number | undefined;
  /** Hovered position for a cluster [0, 5] */
  private hoveredPlacementIndex: Position | undefined;
  /** Index of actively held cluster [0, colors.length) */
  private activeClusterIndex: number | undefined;
  /** The centers of the clusters off the board */
  private clusterInitialCenters: Vector2d[];
  /** Indices of cluster already assigned to a start position on the board */
  private usedClusters: Set<number>;
  /** Colors that have been assigned to a start position */
  private assignedColors: (undefined | number)[];

  constructor(ctx: CanvasRenderingContext2D, board: BoardBuilder) {
    this.ctx = ctx;
    this.constants = computeConstants(ctx);
    this.board = board;
    this.mousePosition = { x: 0, y: 0 };
    this.usedClusters = new Set();
    this.assignedColors = Array(6).fill(undefined);

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

    this.clusterInitialCenters = [];
    for (let index = 0; index < CLUSTER_COLOR_OPTIONS.length; index++) {
      const offsetMultiplier = this.constants.PIECE_RADIUS_CANVAS * 7;
      const offset = { x: index % 3, y: Math.floor(index / 3) - 1.5 };
      const center = {
        x: 0.1 * this.ctx.canvas.width + offset.x * offsetMultiplier,
        y: 0.5 * this.ctx.canvas.height + offset.y * offsetMultiplier,
      };
      this.clusterInitialCenters.push(center);
    }

    this.safeRender();
  }

  private onMouseMove() {
    this.computeHovered();
    this.safeRender();
  }

  private onMouseDown() {
    if (this.hoveredClusterIndex !== undefined) {
      this.activeClusterIndex = this.hoveredClusterIndex;
    } else if (
      this.hoveredPlacementIndex !== undefined &&
      this.assignedColors[this.hoveredPlacementIndex] !== undefined
    ) {
      const assignedColor = this.assignedColors[this.hoveredPlacementIndex];
      if (assignedColor !== undefined) {
        this.usedClusters.delete(assignedColor);
      }
      this.assignedColors[this.hoveredPlacementIndex] = undefined;
      this.board.removePlayer(this.hoveredPlacementIndex);
      this.activeClusterIndex = assignedColor;
    }

    this.safeRender();
  }

  private onMouseUp() {
    if (
      this.hoveredPlacementIndex !== undefined &&
      this.activeClusterIndex !== undefined
    ) {
      this.usedClusters.add(this.activeClusterIndex);
      this.board.setPlayer(
        this.hoveredPlacementIndex,
        CLUSTER_COLOR_OPTIONS[this.activeClusterIndex],
      );
      const removed = this.assignedColors[this.hoveredPlacementIndex];
      this.assignedColors[this.hoveredPlacementIndex] = this.activeClusterIndex;
      if (removed !== undefined) {
        this.usedClusters.delete(removed);
      }
    }

    this.activeClusterIndex = undefined;
    this.computeHovered();
    this.safeRender();
  }

  private computeHovered() {
    this.hoveredClusterIndex = undefined;
    this.hoveredPlacementIndex = undefined;

    for (let index = 0; index < CLUSTER_COLOR_OPTIONS.length; index++) {
      if (!this.usedClusters.has(index)) {
        const withinCluster = withinCircle(
          this.mousePosition,
          this.clusterInitialCenters[index],
          this.constants.PIECE_RADIUS_CANVAS * 3,
        );

        if (withinCluster) {
          this.hoveredClusterIndex = index;
        }
      }
    }

    for (let index = 0; index < 6; index++) {
      const withinPlacement = withinCircle(
        this.mousePosition,
        this.constants.PIECE_POSITIONS[INITIAL_POSITION_CENTERS[index]],
        this.constants.PIECE_RADIUS_CANVAS * 6,
      );
      if (withinPlacement) {
        this.hoveredPlacementIndex = index as Position;
      }
    }
  }

  private safeRender() {
    window.requestAnimationFrame(() => this.render());
  }

  private render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.activeClusterIndex !== undefined) {
      this.ctx.canvas.style.cursor = "grabbing";
    } else if (
      this.hoveredClusterIndex !== undefined ||
      (this.hoveredPlacementIndex !== undefined &&
        this.assignedColors[this.hoveredPlacementIndex] !== undefined)
    ) {
      this.ctx.canvas.style.cursor = "grab";
    } else {
      this.ctx.canvas.style.cursor = "default";
    }

    /** Board */
    drawBoardState(
      this.ctx,
      this.constants,
      this.board.colors,
      this.board.state,
      undefined,
    );

    /** Hovered placement for initial pieces */
    if (
      this.hoveredPlacementIndex !== undefined &&
      this.activeClusterIndex !== undefined
    ) {
      for (const index of BOARD_MACROS.starts[this.hoveredPlacementIndex]) {
        drawPiece(
          this.ctx,
          this.constants,
          CLUSTER_COLOR_OPTIONS[this.activeClusterIndex],
          this.constants.PIECE_POSITIONS[index],
          0.25,
        );
      }
    }

    /** Piece groups on the left to choose from */
    for (let index = 0; index < CLUSTER_COLOR_OPTIONS.length; index++) {
      if (!this.usedClusters.has(index)) {
        if (
          this.activeClusterIndex === undefined &&
          this.hoveredClusterIndex === index
        ) {
          drawCircle(
            this.ctx,
            CLUSTER_COLOR_OPTIONS[index],
            undefined,
            this.clusterInitialCenters[index],
            this.constants.PIECE_RADIUS_CANVAS * 2,
            40,
          );
        }

        if (index !== this.activeClusterIndex) {
          drawPieceCluster(
            this.ctx,
            this.constants,
            CLUSTER_COLOR_OPTIONS[index],
            this.clusterInitialCenters[index],
            1.0,
          );
        }
      }
    }

    /** Active cluster following the mouse */
    if (this.activeClusterIndex !== undefined) {
      drawPieceCluster(
        this.ctx,
        this.constants,
        CLUSTER_COLOR_OPTIONS[this.activeClusterIndex],
        this.mousePosition,
        1.0,
      );
    }
  }

  async build() {
    const board = await this.board.build();
    return new BoardRenderer(this.ctx, board);
  }
}
