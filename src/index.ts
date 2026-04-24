import van from "vanjs-core";
import { ApplicationState } from "./application/state";
import "./index.css";
import { page } from "./page";

async function main() {
  const canvas = document.getElementById(
    "main-canvas",
  ) as HTMLCanvasElement | null;

  const ctx = canvas?.getContext("2d");

  if (!canvas || !ctx) {
    alert("Unsupported browser configuration: Could not get Canvas2D context");
    return;
  }

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Initialize app state
  const appState = new ApplicationState(ctx);

  // Render page
  van.add(document.body.children[0], page(appState));
}

void main();
