import { BoardBuilder } from "./board";
import { BoardRenderer } from "./board/renderer";
import "./index.css";

async function main() {
  const canvas = document.getElementById(
    "main-canvas",
  ) as HTMLCanvasElement | null;
  const ctx = canvas?.getContext("2d");

  if (!ctx) {
    alert("Unsupported browser configuration: Could not get Canvas2D context");
    return;
  }

  const renderer = new BoardRenderer(ctx);
  const boardBuilder = new BoardBuilder();
  boardBuilder.addPlayer(0, 4);
  boardBuilder.addPlayer(2, 5);
  boardBuilder.addPlayer(5, 0);
  boardBuilder.addPlayer(4, 1);
  boardBuilder.addPlayer(3, 2);
  boardBuilder.addPlayer(1, 3);
  renderer.render(boardBuilder.previewBoard());
}

void main();
