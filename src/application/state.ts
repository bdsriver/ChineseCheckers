import { BackendCommunicator } from "../api";
import type { Board, BoardPosition, PlayerCount } from "./board";
import { BoardBuilder } from "./board/builder";
import { Renderer } from "./renderer";

export class ApplicationState {
  private _renderer: Renderer;
  private _board: Board | undefined;
  private _boardBuilder: BoardBuilder;
  private _api: BackendCommunicator;

  constructor(ctx: CanvasRenderingContext2D) {
    this._boardBuilder = new BoardBuilder();
    this._renderer = new Renderer(ctx);
    this._api = new BackendCommunicator();

    function rerender(state: ApplicationState) {
      state.render();
      window.requestAnimationFrame(() => rerender(state));
    }

    window.requestAnimationFrame(() => rerender(this));

    ctx.canvas.onmousedown = () => {
      if (this._board !== undefined) {
        this._renderer.onMouseDown(this._board);
      }
    };

    ctx.canvas.onmouseup = () => {
      if (this._board !== undefined) {
        this._renderer.onMouseUp(this._board);
      }
    };

    ctx.canvas.onmousemove = (e) => {
      if (this._board !== undefined) {
        this._renderer.onMouseMove(e);
      }
    };
  }

  get playerCount() {
    return this._boardBuilder.playerCount;
  }

  async startGame() {
    this._board = await this._boardBuilder.build();
  }

  async resetGame() {
    this._board = undefined;
  }

  setPlayerCount(playerCount: PlayerCount) {
    this._boardBuilder.setPlayerCount(playerCount);
  }

  setClientPosition(position: BoardPosition) {
    this._boardBuilder.setClientPosition(position);
  }

  private render() {
    if (this._board !== undefined) {
      this._renderer.render(this._board);
    } else {
      this._renderer.renderBuilder(this._boardBuilder);
    }
  }

  login(username: string, password: string) {
    this._api.login(username, password);
  }

  signup(username: string, password: string) {
    this._api.signup(username, password);
  }
}
