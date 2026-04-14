import van from "vanjs-core";
import "./index.css";
import { page } from "./page";
import { newRenderer } from "./renderer";

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
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);

  const renderer = newRenderer(ctx);
  van.add(document.body.children[0], page(renderer));
}

void main();
