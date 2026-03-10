import van from "vanjs-core";
import type { AppState } from "../state";

const { div, h1, button } = van.tags;

export function ConfigPanel(appState: AppState) {
  const onToggle = () => {
    appState.loggedIn.val = !appState.loggedIn.val;
  };

  return div(
    {
      class:
        "w-1/5 left-3 top-30 absolute flex flex-col items-center justify-center bg-gray-300 inset-shadow-sm inset-shadow-black",
    },
    h1({ class: "text-2xl" }, "Game Setup"),
    button(
      {
        onclick: onToggle,
        className: "cursor-pointer",
      },
      () => appState.loggedIn.val ? "Log Out" : "Log In",
    ),
  );
}
