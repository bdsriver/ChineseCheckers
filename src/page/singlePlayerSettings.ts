import van from "vanjs-core";
import type { BoardPosition } from "../board/builder";
import {
  type BoardBuilderRenderer,
  INITIAL_PLAYERS,
  type PlayerCount,
} from "../board/builderRenderer";
import { ICONS } from "./icons";

const { div, input, label, button, select, option } = van.tags;

export function singlePlayerSettings(board: BoardBuilderRenderer) {
  const playerCount = van.state<PlayerCount>(2);
  board.setPlayers(playerCount.val);

  return div(
    { class: "flex flex-col items-center justify-center gap-4" },
    div(
      { class: "flex-1 flex flex-row items-center justify-center gap-2" },
      label("Players"),
      div(
        {
          class: "join",
          onchange: (e) => {
            const count = parseInt(e.target.value, 10) as PlayerCount;
            playerCount.val = count;
            board.setPlayers(count);
          },
        },
        ...[2, 3, 4, 6].map((count) =>
          input({
            class: "join-item btn btn-square",
            type: "radio",
            name: "options",
            ariaLabel: count,
            value: count,
            ...(count === playerCount.val && { checked: "checked" }),
          }),
        ),
      ),
    ),
    ...Array(6)
      .fill(0)
      .map((_, player) => {
        return div(
          { class: "flex flex-row gap-1 items-center" },
          div({ class: "w-20" }, ICONS.PLAYER_POSITION_INDICATORS[player]),
          () =>
            select(
              {
                disabled: !INITIAL_PLAYERS[playerCount.val].includes(
                  player as BoardPosition,
                ),
                class: "select",
                onchange: (e) => console.log(e.target.value),
              },
              option(
                !INITIAL_PLAYERS[playerCount.val].includes(
                  player as BoardPosition,
                )
                  ? ""
                  : "Bot",
              ),
              option("You"),
            ),
        );
      }),
    button(
      { type: "submit", class: "btn", onclick: () => void board.build() },
      "Start Game",
    ),
  );
}
