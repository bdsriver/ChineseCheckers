import van from "vanjs-core";
import "./index.css";
import { page } from "./page";
import { ApplicationState } from "./state";

async function main() {
  const canvas = document.getElementById(
    "main-canvas",
  ) as HTMLCanvasElement | null;

  const ctx = canvas?.getContext("2d");

  if (!canvas || !ctx) {
    alert("Unsupported browser configuration: Could not get Canvas2D context");
    return;
  }

  // Reset canvas resolution (must be done first)
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Initialize app state
  const appState = new ApplicationState(ctx);

  // Render page
  van.add(document.body.children[0], page(appState));
}

void main();
