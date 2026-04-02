import van from "vanjs-core";
import type { BoardPosition } from "../board/builder";
import { INITIAL_PLAYERS, type PlayerCount } from "../board/builder";
import { buildRenderer, type Renderer } from "../renderer";
import { ICONS } from "./icons";

const { div, input, label, button } = van.tags;

export function singlePlayerSettings(renderer: Renderer) {
  const playerCount = van.state<PlayerCount>(2);
  const boardPosition = van.state<BoardPosition>(0);
  const gameStarted = van.state(false);

  if (!renderer.built) {
    renderer.board.setPlayers(playerCount.val);
  }

  return div(
    { class: "flex flex-col items-center justify-center gap-4" },
    div(
      { class: "flex-1 flex flex-row items-center justify-center gap-2" },
      label("Player Count"),
      div(
        {
          class: "join",
          onchange: (e) => {
            if (!renderer.built) {
              const count = parseInt(e.target.value, 10) as PlayerCount;
              playerCount.val = count;
              boardPosition.val = INITIAL_PLAYERS[count][0];
              renderer.board.setPlayers(count);
            }
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
      { class: "flex-1 flex flex-row items-center justify-center gap-2" },
      label("Your Pieces"),
      div(
        {
          class: "join flex flex-row",
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
              },
            },
            icon,
          ),
        ),
      ),
    ),
    button(
      {
        type: "submit",
        class: "btn",
        disabled: () => gameStarted.val,
        onclick: () => {
          void buildRenderer(renderer);
          gameStarted.val = true;
        },
      },
      "Start Game",
    ),
    button(
      {
        type: "button",
        class: "btn",
        onclick: () => {
          if (renderer.built) {
            renderer.board.tempEngineMove();
          }
        },
      },
      "Engine Move",
    ),
  );
}
