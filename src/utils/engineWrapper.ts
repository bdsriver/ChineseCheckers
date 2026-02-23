import createModule from "../generated/engine/engine.js";

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

  createModule().then((Module) => {
    currentPlayerCount = playerCount ?? currentPlayerCount;
    // @ts-expect-error Module is type {}
    engine = new Module.Engine(currentPlayerCount);
  });
}

const EMPTY_SPACE = 6;

/** Starting spaces for each player 1-6 */
const START_SPACES = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 23, 24, 25, 35, 36, 46],
  [65, 75, 76, 86, 87, 88, 98, 99, 100, 101],
  [111, 112, 113, 114, 115, 116, 117, 118, 119, 120],
  [74, 84, 85, 95, 96, 97, 107, 108, 109, 110],
  [19, 20, 21, 22, 32, 33, 34, 44, 45, 55],
];

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
      for (const space of START_SPACES[i]) {
        boardState[space] = i;
      }
    }
  }

  return boardState;
}
