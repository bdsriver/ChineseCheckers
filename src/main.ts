import { BoardBuilder } from "./board/builder";
import { BoardRenderer } from "./board/renderer";
import "./index.css";
import { renderPage } from "./page";
import { initAppState as initialAppState } from "./state";

async function main() {
  renderPage(initialAppState());

  const canvas = document.getElementById(
    "main-canvas",
  ) as HTMLCanvasElement | null;

  const ctx = canvas?.getContext("2d");

  if (!ctx) {
    alert("Unsupported browser configuration: Could not get Canvas2D context");
    return;
  }

  const boardBuilder = new BoardBuilder();
  boardBuilder.addPlayer(0, 4);
  boardBuilder.addPlayer(1, 3);
  boardBuilder.addPlayer(2, 5);
  boardBuilder.addPlayer(3, 2);
  boardBuilder.addPlayer(4, 1);
  boardBuilder.addPlayer(5, 0);

  const board = await boardBuilder.build();
  const boardRenderer = new BoardRenderer(ctx, board);
}

void main();
