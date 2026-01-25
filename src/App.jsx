import './App.css'
import {useState} from 'react'
import Board from './components/board';
import StartMenu from './components/startMenu';

function App() {  
  const [showBoard, setBoardVisibility] = useState(false);
  const [showMenu, setMenuVisibility] = useState(true);
  const [playerAmount, setPlayerAmount] = useState(2);

  function setGamePlayerAmount(amount) {
    setMenuVisibility(false);
    setBoardVisibility(true);
    setPlayerAmount(amount);
  }

  return (
    <>
    {showMenu && <StartMenu submitFunc={setGamePlayerAmount}/>}
    {showBoard && <Board playeramount={playerAmount}/>}
    </>
  )
}

export default App
