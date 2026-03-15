import { BoardBuilder } from "./board/builder";
import { BoardBuilderRenderer } from "./board/builderRenderer";
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

  const boardBuilder = new BoardBuilder();
  const boardBuilderRenderer = new BoardBuilderRenderer(ctx, boardBuilder);
  // @ts-expect-error Window constant
  window.startGame = () => void boardBuilderRenderer.build();
}

void main();
