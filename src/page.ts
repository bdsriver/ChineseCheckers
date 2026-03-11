import van from "vanjs-core";
import type { AppState } from "./state";

const { div } = van.tags;

export function renderPage(appState: AppState) {
  const contents = div(
    { class: "absolute top-0 left-0 text-white" },
    "some text...",
  );

  van.add(document.body, contents);
}
