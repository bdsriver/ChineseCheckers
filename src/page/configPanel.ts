import van, { type State } from "vanjs-core";
import type { BoardBuilderRenderer } from "../board/builderRenderer";
import { ICONS } from "./icons";
import { loginPanel } from "./loginPanel";
import { singlePlayerSettings } from "./singlePlayerSettings";

const { div, button } = van.tags;

enum GameMode {
  SinglePlayer,
  Multiplayer,
  Ranked,
}

export function configPanel(
  loggedIn: State<boolean>,
  board: BoardBuilderRenderer,
) {
  const mode = van.state<GameMode>(GameMode.SinglePlayer);

  const tab = {
    class: "flex-1 flex items-center justify-center not-last:border-r border-b",
  };
  const activeTab = { class: `${tab.class} border-b-transparent` };
  const inactiveTab = { class: `${tab.class} bg-slate-700 cursor-pointer` };

  const panel = { class: "flex-15 w-full p-5" };
  const shownPanel = { class: `${panel.class}` };
  const hiddenPanel = { class: `${panel.class} hidden` };

  return div(
    {
      class:
        "absolute w-1/5 h-full border-r-2 border-white bg-slate-500 shadow-lg shadow-black flex items-center justify-center flex-col",
    },
    div(
      { class: "flex-1 w-full flex flex-row" },
      button(
        {
          class: () =>
            mode.val === GameMode.SinglePlayer
              ? activeTab.class
              : inactiveTab.class,
          onclick: () => (mode.val = GameMode.SinglePlayer),
        },
        div({ class: "w-9" }, ICONS.USER),
      ),
      button(
        {
          class: () =>
            mode.val === GameMode.Multiplayer
              ? activeTab.class
              : inactiveTab.class,
          onclick: () => (mode.val = GameMode.Multiplayer),
        },
        div({ class: "w-9" }, ICONS.USER_GROUP),
      ),
      button(
        {
          class: () =>
            mode.val === GameMode.Ranked ? activeTab.class : inactiveTab.class,
          onclick: () => (mode.val = GameMode.Ranked),
        },
        div({ class: "w-9" }, ICONS.TROPHY),
      ),
    ),
    div(
      {
        class: () =>
          mode.val === GameMode.SinglePlayer
            ? shownPanel.class
            : hiddenPanel.class,
      },
      singlePlayerSettings(board),
    ),
    div(
      {
        class: () =>
          mode.val === GameMode.Multiplayer
            ? shownPanel.class
            : hiddenPanel.class,
      },
      div({ class: () => loggedIn.val && "hidden" }, loginPanel()),
    ),
    div(
      {
        class: () =>
          mode.val === GameMode.Ranked ? shownPanel.class : hiddenPanel.class,
      },
      div({ class: () => loggedIn.val && "hidden" }, loginPanel()),
    ),
  );
}
