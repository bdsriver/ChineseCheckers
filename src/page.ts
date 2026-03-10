import van from "vanjs-core";
import { ConfigPanel } from "./page/config";
import { LogPanel } from "./page/log";
import type { AppState } from "./state";

const { div } = van.tags;

export function renderPage(appState: AppState) {
  const contents = div(ConfigPanel(appState), LogPanel(appState));

  van.add(document.body, contents);
}
