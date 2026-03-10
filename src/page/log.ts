import van from "vanjs-core";
import type { AppState } from "../state";

const { div, h1 } = van.tags;

export function LogPanel(appState: AppState) {
  return div(
    {
      class:
        "w-1/5 right-3 top-30 absolute flex flex-col items-center justify-center bg-gray-300 inset-shadow-sm inset-shadow-black",
    },
    h1({ class: "text-2xl" }, "Move Log"),
    "Logged in:", appState.loggedIn,
  );
}
