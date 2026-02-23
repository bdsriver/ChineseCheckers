import "./board.css";
import { useState } from "react";
import {
  engine,
  getStartBoard,
  restartEngine,
} from "../utils/engineWrapper.js";
import { BOARD_MACROS } from "../utils/macros.js";

const ENGINE_DEPTH = 3;
const PLAYER_COLORS = [
  "#008000ff",
  "#9b0606ff",
  "#800080ff",
  "#2e3ef0ff",
  "#df6800ff",
  "#aca408ff",
  "#ffffffff",
];
const MOVE_COLOR = "#4b4b4bee";
const PREV_PATH_COLOR = "#b5b5b5ee";

export default function Board() {
  const spaces = [];
  const [selected, setSelected] = useState<number | null>(null);
  const [boardState, setBoardState] = useState(getStartBoard());
  const [currentTurn, setCurrentTurn] = useState(0);
  const [openMoves, setOpenMoves] = useState<number[]>([]);
  const [startSpace, setStartSpace] = useState<number | null>(null);
  const [jumper, setJumper] = useState<number | null>(null);
  const [previousPath, setPreviousPath] = useState<number[]>([]);
  const [currentPath, setCurrentPath] = useState<number[]>([]);

  const onSpaceClick = (e: React.MouseEvent<SVGCircleElement>) => {
    // check if the player clicked their own piece
    const clickedId = parseInt(e.currentTarget.id, 10);

    if (boardState[clickedId] === currentTurn) {
      if (jumper !== null) {
        return;
      }

      setSelected(clickedId);
      setStartSpace(clickedId);

      // checking if the space we jump over is occupied and the space we land on is not
      const possibleJumps = BOARD_MACROS.jumps[clickedId]
        .filter((x) => boardState[x[0]] < 6 && boardState[x[1]] >= 6)
        .map((s) => s[1]);

      const possibleMoves = BOARD_MACROS.moves[clickedId].filter(
        (x) => boardState[x] >= 6,
      );

      setOpenMoves(possibleMoves.concat(possibleJumps));
      setCurrentPath([clickedId]);
      return;
    }

    if (selected === null || startSpace === null) {
      return;
    }

    // check if we clicked on a spot we can move to (empty spot means 6)
    if (openMoves.includes(clickedId)) {
      // move the currently select piece to that spot
      setBoardState((prev) => ({
        ...prev,
        [selected]: 6,
        [clickedId]: prev[selected],
      }));

      // if this was a move/push, we can just end the turn
      if (BOARD_MACROS.moves[selected].includes(Number(clickedId))) {
        onEndTurn(startSpace, clickedId, [startSpace, clickedId]);
        return;
      }

      // jump logic
      const possibleJumps = BOARD_MACROS.jumps[clickedId]
        .filter((x) => boardState[x[0]] < 6 && boardState[x[1]] >= 6)
        .map((s) => s[1]);
      setOpenMoves([...possibleJumps, selected]);
      setSelected(clickedId);
      setJumper(clickedId);
      setCurrentPath([...currentPath, clickedId]);
    }
  };

  // called when the player is done jumping
  const onFinish = () => {
    if (selected === null || startSpace === null) {
      return;
    }

    // end the turn
    onEndTurn(startSpace, selected, currentPath);
  };

  // called when the player wants to do an engine move
  const onEngineMove = () => {
    if (selected === null || startSpace === null) {
      return;
    }

    if (engine === undefined) {
      restartEngine();
      return;
    }

    const move = engine.search(ENGINE_DEPTH);

    // reset jumper
    if (startSpace !== selected) {
      setBoardState((prev) => ({
        ...prev,
        [selected]: 6,
        [startSpace]: currentTurn,
      }));
    }

    // perform engine move
    setBoardState((prev) => ({
      ...prev,
      [move[0]]: 6,
      [move[1]]: currentTurn,
    }));
    onEndTurn(move[0], move[1], move.slice(3));
  };

  const onEndTurn = (from: number, to: number, path: number[]) => {
    if (engine === undefined) {
      restartEngine();
      return;
    }

    const next = engine.move(from, to);

    if (next === -1 || next === -2) {
      // this means the game is over
      onRestart();
      return;
    }

    setOpenMoves([]);
    setSelected(null);
    setStartSpace(null);
    setJumper(null);
    setPreviousPath(path);
    setCurrentPath([]);

    // set the current turn to be the next player who is not done playing
    setCurrentTurn(next);
  };

  const onRestart = () => {
    restartEngine();
    setSelected(null);
    setBoardState(getStartBoard());
    setCurrentTurn(0);
    setOpenMoves([]);
    setStartSpace(null);
    setJumper(null);
    setCurrentPath([]);
    setPreviousPath([]);
  };

  //get all the html elements for individual spaces configured
  let currID = 0;
  for (let i = 0; i < 17; i++) {
    for (let j = 0; j < BOARD_MACROS.rowLengths[i]; j++) {
      const x = ((7.5 - (BOARD_MACROS.rowLengths[i] - 1) / 2 + j) * 100) / 15;
      let currColor = openMoves.includes(currID)
        ? MOVE_COLOR
        : PLAYER_COLORS[boardState[currID]];
      //if the previous player moved through a space and we cannot move there, highlight it
      if (
        previousPath.slice(0, -1).includes(Number(currID)) &&
        currColor !== MOVE_COLOR
      ) {
        currColor = PREV_PATH_COLOR;
      }
      spaces.push(
        <circle
          className="stroke-black stroke-1"
          id={currID}
          r={2}
          cx={x}
          cy={((i + 0.5) * 100) / 17}
          // style={{
          //   "--color": `${currColor}`,
          //   "--space-hover": `${boardState[currID] === currentTurn ? "pointer" : "cursorr"}`,
          //   filter: `brightness(${(selected == null && boardState[currID] === currentTurn) || selected === currID ? 2 : 1})`,
          // }}
          key={currID}
          onClick={onSpaceClick}
        />,
      );
      currID += 1;
    }
  }
  return (
    <div className="h-full aspect-square m-0 p-0 relative">
      <svg viewBox="0 0 100 100" className="fill-amber-200 w-full h-full">
        <circle cx="50" cy="50" r="49.5" className="board-edge" />
        {spaces}
      </svg>
      <div className="bottom-0 right-0 absolute">
        {jumper && selected !== startSpace && (
          <button type="button" onClick={onFinish} className="turn-button">
            Finish Turn
          </button>
        )}
        <button type="button" onClick={onEngineMove}>
          Engine Move
        </button>
      </div>
      {/* <div className="turn-display">
        Turn Player:
        <div className="turn-color-wrapper">
          <div
            className="turn-color-block"
            style={{ "--turn-color": `${PLAYER_COLORS[currentTurn]}` }}
          />
          <div
            className="turn-color-block"
            style={{
              "--turn-color": `${PLAYER_COLORS[currentTurn]}`,
              filter: `brightness(2)`,
            }}
          />
        </div>
        Possible Moves:
        <div
          className="move-color-block"
          style={{ "--move-color": `${MOVE_COLOR}` }}
        />
        Previous Path:
        <div
          className="path-color-block"
          style={{ "--path-color": `${PREV_PATH_COLOR}` }}
        />
      </div> */}
    </div>
  );
}
