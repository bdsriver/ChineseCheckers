import "./engine/engine.js";
import { BOARD_MACROS } from "./macros";

export enum PlayerCount {
  Two,
  Three,
  Four,
  Six,
}

interface Engine {
  search: (depth: number) => number[];
  move: (from: number, to: number) => number;
  delete: () => void;
}

export let engine: Engine | undefined = undefined;
let currentPlayerCount: PlayerCount = PlayerCount.Two;

export function restartEngine(playerCount?: PlayerCount) {
  engine?.delete();

  Module.createModule().then((Module) => {
    currentPlayerCount = playerCount ?? currentPlayerCount;
    engine = new Module.Engine(currentPlayerCount);
  });
}

const EMPTY_SPACE = 6;

/** Sections of the starting positions that are enabled for different game player counts */
const ENABLED_SPACES = {
  [PlayerCount.Two]: 0b001001,
  [PlayerCount.Three]: 0b010101,
  [PlayerCount.Four]: 0b011011,
  [PlayerCount.Six]: 0b111111,
};

export function getStartBoard() {
  const boardState = Array<number>(121).fill(EMPTY_SPACE);

  for (let i = 0; i < 6; i++) {
    if (((ENABLED_SPACES[currentPlayerCount] >> i) & 1) === 1) {
      for (const space of BOARD_MACROS.starts[i]) {
        boardState[space] = i;
      }
    }
  }

  return boardState;
}
