import './board.css'
import {useState, useEffect, useRef} from 'react'
import {boardMacros, getStartBoard, getEndZones} from '../utils/macros.js'
import createModule from "../utils/engine.js";

const engineDepth = 3;

function Board(props){
  const playerAmount = props.playeramount ? props.playeramount : 6;
  let currID = 0;
  let spaces = [];
  const rowlen = boardMacros.rowlen;
  const [angle, setAngle] = useState(0);
  const colors = boardMacros.colors;
  const [selected, setSelected] = useState(null);
  const [pieceOn, setSpaceOwner] = useState(getStartBoard(playerAmount));
  const [currTurn, setCurrTurn] = useState(0);
  const [openmoves, setOpenmoves] = useState([]);
  const [startSpace, setStartSpace] = useState(null);
  const [jumper, setJumper] = useState(null);
  const [prevPath, setPrevPath] = useState([]);
  const [currPath, setCurrPath] = useState([]);
  

  const engineRef = useRef(null);

  //engine only instantiated once
  useEffect(() => {
    createModule().then(Module => {
      engineRef.current = new Module.Engine(Number(playerAmount));
    })

    //destructor
    return () => {
      if (engineRef.current) {
        engineRef.current.delete();
      }
    };

  }, []);
  
  const handleSpaceClick = (e) => {
    //check if the player clicked their own piece
    const next = Number(e.currentTarget.id);
    if (pieceOn[next] == currTurn){
      if (jumper != null){
        return;
      }
      setSelected(next);
      setStartSpace(next);
      //checking if the space we jump over is occupied and the space we land on is not
      let possibleJumps = (boardMacros.jumps[next]).filter(x => pieceOn[x[0]]<6 && pieceOn[x[1]]>=6);
      possibleJumps = possibleJumps.map(s => s[1]);
      const possibleMoves = (boardMacros.moves[next]).filter(x => pieceOn[x]>=6);
      setOpenmoves(possibleMoves.concat(possibleJumps));
      setCurrPath([next]);
      return;
    }
    if (selected == null){
      return;
    }
    //check if we clicked on a spot we can move to (empty spot means 6)    
    if ( openmoves.includes(next)){
      //move the currently select piece to that spot
      setSpaceOwner( (prev) => ({...prev, [selected]: 6, [next]: prev[selected]}));
      //if this was a move/push, we can just end the turn
      if (boardMacros.moves[selected].includes(Number(next))){
        handleEndTurn(startSpace,next, [startSpace,next]);
        return;
      }
      //jump logic
      const p = (boardMacros.jumps[next]).filter(x => pieceOn[x[0]]<6 && pieceOn[x[1]]>=6);
      const possibleJumps = p.map(s => s[1]);
      setOpenmoves([...possibleJumps, selected]);
      setSelected(next);
      setJumper(next);
      setCurrPath([...currPath, next]);
    }   
  };

  //called when the player is done jumping
  const handleFinishButtonClick = () => {
    //end the turn
    handleEndTurn(startSpace,selected, currPath);
    return;
  }

  //called when the player wants to do an engine move
  const handleEngineButtonClick = () => {
    const move = engineRef.current.search(engineDepth);
    //console.log(move);
    //reset jumper
    if (startSpace != selected){
      setSpaceOwner((prev) => ({...prev, [selected]: 6, [startSpace]: currTurn}));
    }
    //perform engine move
    setSpaceOwner( (prev) => ({...prev, [move[0]]: 6, [move[1]]: currTurn}));
    handleEndTurn(move[0],move[1], move.slice(3));
  }

  const handleEndTurn = (from,to, path) => {
    const next = engineRef.current.move(from,to);
    if (next==-1 || next ==-2){
      //this means the game is over
      handleRestart(playerAmount);
      return;
    }
    setOpenmoves([]);
    setSelected(null);
    setStartSpace(null);
    setJumper(null);
    setPrevPath(path);
    setCurrPath([]);

    //set the current turn to be the next player who is not done playing
    setCurrTurn(next);
    return;
  }

  const handleRestart = (playerNum) => {
    engineRef.current.delete();
    createModule().then(Module => {
      engineRef.current = new Module.Engine(Number(playerNum));
    });
    setSelected(null);
    setSpaceOwner(getStartBoard(playerNum));
    setCurrTurn(0);
    setOpenmoves([]);
    setStartSpace(null);
    setJumper(null);
    setCurrPath([]);
    setPrevPath([]);
  }

  //get all the html elements for individual spaces configured
  for (let i=0; i<17; i++) {
    for (let j=0; j<rowlen[i]; j++){
      const x = (7.5-(rowlen[i]-1)/2+j)*100/15;
      let currColor = openmoves.includes(currID) ? boardMacros.moveColor :colors[pieceOn[currID]];
      if ((prevPath.slice(0,-1)).includes(Number(currID))) {
        currColor = boardMacros.prevPathColor;
      }
      spaces.push(<circle className='space' id={currID} cx={x} cy={(i+0.5)*100/17}
        style={{"--color": `${currColor}`, 
        "--space-hover": `${pieceOn[currID]==currTurn ? "pointer": "cursorr"}`,
        filter:`brightness(${(selected==null && pieceOn[currID]==currTurn) || selected==currID?2:1})`}} 
        key={currID} onClick={handleSpaceClick}/>);
      currID++;
    }
  }
  const dim = "min(90vh, 90vw)";
  return (
    <div style={{ width: dim, height: dim, margin: 0, padding: 0, position: "relative"}}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className='board-container' 
      style={{ "--rotation": `${angle}deg` }}>
        <circle cx="50" cy="50" r="49.5" className='board-edge' />
        {spaces}
      </svg>
      {jumper && selected != startSpace && 
      <button onClick={handleFinishButtonClick} className='turn-button'>
        Finish Turn
      </button>}
      <button onClick={handleEngineButtonClick} className='engine-button'>
        Engine Move
      </button>
      <div className='turn-display'>
        Turn Player: 
        <div className='turn-color-wrapper'>
        <div className='turn-color-block' style={{"--turn-color": `${colors[currTurn]}`}}/>
        <div className='turn-color-block' style={{"--turn-color": `${colors[currTurn]}`, 
        filter: `brightness(2)`}}/>
        </div>
        Possible Moves: 
        <div className='move-color-block' style={{"--move-color": `${boardMacros.moveColor}`}}/>
        Previous Path: 
        <div className='path-color-block' style={{"--path-color": `${boardMacros.prevPathColor}`}}/>
      </div>
    </div>)
}

export default Board;