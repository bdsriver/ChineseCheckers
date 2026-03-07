import "./engine/engine.js";

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

  // @ts-expect-error
  Module.createModule().then((Module) => {
    currentPlayerCount = playerCount ?? currentPlayerCount;
    engine = new Module.Engine(currentPlayerCount);
  });
}
