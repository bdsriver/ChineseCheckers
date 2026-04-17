import { ClientBoard } from "./board/client";
import { ServerBoard } from "./board/server";

export const EMPTY_CELL = 6;

export class Board {
  client: ClientBoard;
  server: ServerBoard;

  constructor() {
    this.client = new ClientBoard();
    this.server = new ServerBoard();
  }
}
