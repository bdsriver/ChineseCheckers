import van from "vanjs-core";
import { gameTypeSelection } from "./page/gameTypeSelection";
import type { AppState } from "./state";

const { div, span } = van.tags;

export function renderPage(appState: AppState) {
  van.add(
    document.body,
    div(
      {
        className:
          "flex items-center justify-center border-2 border-black w-full h-full",
      },
      gameTypeSelection(appState),
      span({ className: "flex-2" }),
      div(
        { className: "flex-1 m-3 h-2/3 border-2 border-black bg-taupe-500" },
        span({ className: "text-2xl" }, "Game Log"),
      ),
    ),
  );
}
