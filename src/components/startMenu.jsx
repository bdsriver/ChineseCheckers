import './startMenu.css'
import {useState} from 'react'

function StartMenu(props) {
  const [playerAmount, setPlayerAmount] = useState(2);

  const handleStartButtonClick = () => {
    props.submitFunc(playerAmount);
  }
  const handlePlayerAmountChange = (e) => {
    setPlayerAmount(Number(e.target.value));
  }
  
  return (
    <div className='start-menu'>
      <label htmlFor='playerAmountSelect'>
        Choose Player Amount: 
      </label>
      <select className='playerAmountSelect' id='playerAmountSelect' 
        onChange={handlePlayerAmountChange}>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={6}>6</option>
      </select>
      
      <button onClick={handleStartButtonClick} className='game-start-button'>
        Start
      </button>
    </div>
  )
}

export default StartMenu;