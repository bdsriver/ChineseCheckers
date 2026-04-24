import { BACKEND_URL } from "./constants";

// TODO what will the bot names be? for usage in game_modify
const BOT_NAMES = [];

type WSMessage = Record<string, boolean | string | number | object>;

type GameStateMessage = {
  type: "game_state";
  id: number;
  board: Record<number, number[]>;
  turn: number;
};

type GameSettingsMessage = {
  type: "game_settings";
  id: number;
  seat: Record<number, string>;
  has_started: boolean;
};

type GameResultsMessage = {
  type: "game_results";
  id: number;
  placement: number[];
  rank_change: Record<string, number>;
};

export class BackendCommunicator {
  private id: number;
  private socket: WebSocket;

  private gameStateQueue: GameStateMessage[];
  private gameSettingsQueue: GameSettingsMessage[];
  private gameResultsQueue: GameResultsMessage[];

  constructor() {
    this.id = 0;
    this.socket = new WebSocket(BACKEND_URL);
    this.gameStateQueue = [];
    this.gameSettingsQueue = [];
    this.gameResultsQueue = [];

    this.socket.onmessage = (e) => {
      this.id += 1;
      const object = JSON.parse(e.data);
      if (object.type === "game_state") {
        this.gameStateQueue.push(object);
      } else if (object.type === "game_settings") {
        this.gameSettingsQueue.push(object);
      } else if (object.type === "game_results") {
        this.gameResultsQueue.push(object);
      } else {
        console.warn("Unexpected object received from server!");
        console.warn(object);
      }
    };
  }

  private makeWSRequest(requestObject: WSMessage) {
    this.socket.send(JSON.stringify({ ...requestObject, id: this.id }));
    this.id += 1;
  }

  // TODO temporary message queues for now, maybe in the future have callbacks?
  checkState() {
    return this.gameStateQueue.pop();
  }

  checkSettings() {
    return this.gameSettingsQueue.pop();
  }

  checkResults() {
    return this.gameResultsQueue.pop();
  }

  signup(username: string, password: string) {
    this.makeWSRequest({ type: "signup", name: username, pass: password });
  }

  login(username: string, password: string) {
    this.makeWSRequest({ type: "login", name: username, pass: password });
  }

  enterGamePool() {
    this.makeWSRequest({ type: "game_request" });
  }

  createPrivateGame() {
    this.makeWSRequest({ type: "game_create" });
  }

  joinPrivateGame(gameCode: string) {
    this.makeWSRequest({ type: "game_join", code: gameCode });
  }

  /**
   * @param users List of usernames in order of board position
   */
  modifyPrivateGame(
    users: [string, string, string, string, string, string],
    started: boolean,
  ) {
    this.makeWSRequest({
      type: "game_modify",
      seat: users,
      has_started: started,
    });
  }

  movePiece(start: number, end: number, resign: boolean) {
    this.makeWSRequest({ type: "move", start, end, resign });
  }
}
