import { useState } from "react";
import Board from "./components/Board";
import StartMenu from "./components/StartMenu";
import { restartEngine } from "./engine";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  function onGameStart(playerCount: number) {
    restartEngine(playerCount);
    setGameStarted(true);
  }

  return (
    <div className="h-dvh border-2">
      {!gameStarted && <StartMenu onGameStart={onGameStart} />}
      {gameStarted && <Board />}
    </div>
  );
}
