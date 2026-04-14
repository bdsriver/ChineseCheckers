import van from "vanjs-core";
import { configPanel } from "./page/configPanel";
import type { ApplicationState } from "./application/state";

const { div } = van.tags;

export function page(state: ApplicationState) {
  return div(configPanel(state));
}
