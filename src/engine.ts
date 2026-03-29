import createModule from "./engine/engine";

export interface Engine {
  /** Returns [from, to, ...path] */
  search: (depth: number) => number[];
  /** Returns next player, or -1 | -2 if the game is over */
  move: (from: number, to: number) => number;
  /** Deallocates */
  delete: () => void;
}

export async function newEngine(playerCount: number): Promise<Engine> {
  const Module = await createModule();
  // @ts-expect-error Module typing issues
  return new Module.Engine(playerCount)as Engine;
}
