import { useState } from "react";

interface StartMenuProps {
  onGameStart: (playerCount: number) => void;
}

export default function StartMenu({ onGameStart }: StartMenuProps) {
  const [playerAmount, setPlayerAmount] = useState(2);

  const onStart = () => {
    onGameStart(playerAmount);
  };

  const onChangePlayerCount = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlayerAmount(parseInt(e.target.value, 10));
  };

  return (
    <div className="w-52 border-gray-800 p-2.5 rounded-lg bg-gray-50">
      <label htmlFor="playerAmountSelect">Choose Player Amount:</label>
      <select id="playerAmountSelect" onChange={onChangePlayerCount}>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={6}>6</option>
      </select>

      <button type="button" onClick={onStart}>
        Start
      </button>
    </div>
  );
}
