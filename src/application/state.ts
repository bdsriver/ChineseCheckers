import type { Board } from "./board";
import { BoardBuilder, type PlayerCount } from "./board/builder";
import { Renderer } from "./renderer";

type BoardState =
  | { built: false; board: BoardBuilder }
  | { built: true; board: Board };

export class ApplicationState {
  private _renderer: Renderer;
  private _boardState: BoardState;

  constructor(ctx: CanvasRenderingContext2D) {
    this._boardState = { built: false, board: new BoardBuilder() };
    this._renderer = new Renderer(ctx);
    this.render();

    ctx.canvas.onmousedown = () => {
      if (this._boardState.built) {
        this._renderer.onMouseDown(this._boardState.board);
      }
      this.render();
    };

    ctx.canvas.onmouseup = () => {
      if (this._boardState.built) {
        this._renderer.onMouseUp(this._boardState.board);
      }
      this.render();
    };

    ctx.canvas.onmousemove = (e) => {
      if (this._boardState.built) {
        this._renderer.onMouseMove(e);
      }
      this.render();
    };
  }

  get playerCount() {
    return this._boardState.board.playerCount;
  }

  async startGame() {
    if (this._boardState.built) {
      // Do nothing
    } else {
      this._boardState = {
        built: true,
        board: await this._boardState.board.build(),
      };
    }
  }

  setPlayerCount(playerCount: PlayerCount) {
    if (this._boardState.built) {
      // Do nothing
    } else {
      this._boardState.board.setPlayerCount(playerCount);
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
}
