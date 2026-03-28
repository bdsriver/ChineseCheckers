import van from "vanjs-core";
import type { BoardBuilderRenderer } from "./board/builderRenderer";
import { configPanel } from "./page/configPanel";

const { div } = van.tags;

export function page(board: BoardBuilderRenderer) {
  const loggedIn = van.state(false);

  return div(
    { class: "w-full h-full relative text-red-100" },
    configPanel(loggedIn, board),
  );
}
