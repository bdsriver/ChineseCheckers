import { BackendCommunicator } from "../api";
import type { Board, BoardPosition, PlayerCount } from "./board";
import { BoardBuilder } from "./board/builder";
import { Renderer } from "./renderer";

type BoardState =
  | { built: false; board: BoardBuilder }
  | { built: true; board: Board };

export class ApplicationState {
  private _renderer: Renderer;
  private _boardState: BoardState;
  private _api: BackendCommunicator;

  constructor(ctx: CanvasRenderingContext2D) {
    this._boardState = { built: false, board: new BoardBuilder() };
    this._renderer = new Renderer(ctx);
    this._api = new BackendCommunicator();

    function rerender(state: ApplicationState) {
      state.render();
      window.requestAnimationFrame(() => rerender(state));
    }

    window.requestAnimationFrame(() => rerender(this));

    ctx.canvas.onmousedown = () => {
      if (this._boardState.built) {
        this._renderer.onMouseDown(this._boardState.board);
      }
    };

    ctx.canvas.onmouseup = () => {
      if (this._boardState.built) {
        this._renderer.onMouseUp(this._boardState.board);
      }
    };

    ctx.canvas.onmousemove = (e) => {
      if (this._boardState.built) {
        this._renderer.onMouseMove(e);
      }
    };
  }

  get playerCount() {
    if (!this._boardState.built) {
      return this._boardState.board.playerCount;
    } else {
      throw new Error("Attempted to access playerCount when board was built");
    }
  }

  async startGame() {
    if (this._boardState.built) {
      throw new Error("Attempted to start game when board was built");
    } else {
      this._boardState = {
        built: true,
        board: await this._boardState.board.build(),
      };
    }
  }

  setPlayerCount(playerCount: PlayerCount) {
    if (this._boardState.built) {
      throw new Error("Attempted to set payer count when board was built");
    } else {
      this._boardState.board.setPlayerCount(playerCount);
      this.render();
    }
  }

  setClientPosition(position: BoardPosition) {
    if (this._boardState.built) {
      throw new Error("Attempted to set client piece when board was built");
    } else {
      this._boardState.board.setClientPosition(position);
      this.render();
    }
  }

  private render() {
    if (this._boardState.built) {
      this._renderer.render(this._boardState.board);
    } else {
      this._renderer.renderBuilder(this._boardState.board);
    }
  }

  login(username: string, password: string) {
    this._api.login(username, password);
  }

  signup(username: string, password: string) {
    this._api.signup(username, password);
  }
}
