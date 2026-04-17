import van from "vanjs-core";
import {
  type BoardPosition,
  INITIAL_PLAYERS,
  type PlayerCount,
} from "../application/board/client";
import type { ApplicationState } from "../application/state";
import { ICONS } from "./icons";

const { div, input, label, button } = van.tags;

export function singlePlayerSettings(state: ApplicationState) {
  const gameStarted = van.state<boolean>(false);
  const playerCount = van.state<PlayerCount>(state.playerCount);
  const boardPosition = van.state<BoardPosition>(0);

  const style = {
    field: "flex-1 flex flex-row items-center justify-center w-full",
  };

  return div(
    { class: "flex flex-col items-center justify-start h-full gap-4" },
    div(
      { class: style.field },
      label({ class: "flex-1" }, "Player Count"),
      div(
        {
          class: "join flex-1",
          onchange: (e) => {
            const count = parseInt(e.target.value, 10) as PlayerCount;
            state.setPlayerCount(count);
            boardPosition.val = INITIAL_PLAYERS[count][0];
            playerCount.val = count;
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
            disabled: () => gameStarted.val,
          }),
        ),
      ),
    ),
    div(
      { class: style.field },
      label({ class: "flex-1" }, "Your Pieces"),
      div(
        {
          class: "join flex-1 flex flex-row",
        },
        ...ICONS.PLAYER_POSITION_INDICATORS.map((icon, position) =>
          button(
            {
              class: () =>
                "btn btn-square" +
                (position === boardPosition.val ? " btn-primary" : ""),
              disabled: () =>
                !INITIAL_PLAYERS[playerCount.val].includes(
                  position as BoardPosition,
                ) || gameStarted.val,
              onclick: () => {
                boardPosition.val = position as BoardPosition;
                state.setClientPosition(position as BoardPosition);
              },
            },
            icon,
          ),
        ),
      ),
    ),
    div(
      { class: style.field },
      button(
        {
          type: "submit",
          class: "btn",
          disabled: () => gameStarted.val,
          onclick: () => {
            gameStarted.val = true;
            void state.startGame();
          },
        },
        "Start Game",
      ),
    ),
    div({ class: "flex-3/4" }),
  );
}
