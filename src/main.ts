import { BoardRenderer } from "./BoardRenderer";
import "./index.css";
import { BOARD_MACROS } from "./macros";

function main() {
  const canvas = document.getElementById(
    "main-canvas",
  ) as HTMLCanvasElement | null;
  const ctx = canvas?.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2d not supported");
  }

  const board = new BoardRenderer(ctx);
  const initial = Array(BOARD_MACROS.positions.length).fill(6);
  for (let i = 0; i < 6; i++) {
    for (const index of BOARD_MACROS.starts[i]) {
      initial[index] = i;
    }
  }
  board.render(initial);
}

main();
