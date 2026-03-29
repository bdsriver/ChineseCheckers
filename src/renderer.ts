import { BoardBuilderRenderer } from "./renderer/boardBuilderRenderer";
import type { BoardRenderer } from "./renderer/boardRenderer";

export type Renderer =
  | { built: false; board: BoardBuilderRenderer }
  | { built: true; board: BoardRenderer };

export function newRenderer(ctx: CanvasRenderingContext2D): Renderer {
  return {
    built: false,
    board: new BoardBuilderRenderer(ctx),
  };
}

export async function buildRenderer(renderer: Renderer) {
  if (!renderer.built) {
    const boardRenderer = await renderer.board.build();
    Object.assign(renderer, {
      built: true,
      board: boardRenderer,
    });
  }
}
