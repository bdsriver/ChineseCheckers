import van from "vanjs-core";
import "./index.css";
import { page } from "./page";
import { newRenderer } from "./renderer";

async function main() {
  const canvas = document.getElementById(
    "main-canvas",
  ) as HTMLCanvasElement | null;

  const ctx = canvas?.getContext("2d");

  if (!ctx) {
    alert("Unsupported browser configuration: Could not get Canvas2D context");
    return;
  }

  const renderer = newRenderer(ctx);
  van.add(document.body, page(renderer));
}

void main();
