import van from "vanjs-core";
import { configPanel } from "./page/configPanel";
import type { Renderer } from "./renderer";

const { div } = van.tags;

export function page(renderer: Renderer) {
  const loggedIn = van.state(false);

  return div(configPanel(loggedIn, renderer));
}
