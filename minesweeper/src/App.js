import './App.css';
import explosionSound from './Audio/explosion.wav';
import useSound from 'use-sound';
import winSound from './Audio/mixkit-instant-win-2021.wav';
import flagSound from './Audio/Flag.wav';
import React, { useState, useEffect } from 'react';
import { zero, one, two, three, four, five, six, seven, eight } from './Audio/CellSounds.js';

function App() {
  const [numBombs, setNumBombs] = useState(Math.floor((8 * 8) / 5));
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [play] = useSound(winSound, { volume: .50 });
  
  const changeIsGamePlaying = (truthValue) => {
    setIsGamePlaying(truthValue);
  }

  const winGame = () => {
    play();
    const winScreen = document.getElementById("WinScreen");
    setIsGameOver(true);
    winScreen?.classList.add("visibility");
  }

  const restartGame = () => {
    window.location.reload();
  }

  return (
    <div className="App">
      <div className='Deco flipped'>🚩</div>
      <div className="Title">MINESWEEPER</div>
      <div className='Deco'>🚩</div>
      <span className='break'></span>
      <Timer isGamePlaying={isGamePlaying}/>
      <span className='break'></span>
      <div className='Board'>
        <Board
          dimension="8"
          difficulty="5"
          changeNumFlags={setNumBombs}
          setGameWon={winGame}
          changeIsGamePlaying={changeIsGamePlaying}
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
        />
      </div>
      <span className='break'></span>
      <h5>Number of Bombs: {isGameOver ? '0' : numBombs}</h5>
      <div className='helpButton'
      onClick={() => {
        const helpScreen = document.getElementById("helpScreen");
        if(helpScreen?.classList.contains("visibility")) {
          helpScreen?.classList.add("fading");
          setTimeout(() => {
            helpScreen?.classList.remove("visibility");
          }, 500);
        }
        else{
          helpScreen?.classList.add("visibility");
          helpScreen?.classList.remove("fading");
        }
      }}
      ><i className="fa-sharp fa-solid fa-question" /></div>
      <div className='OverlayScreen' id="LoseScreen">
        You Lost<br />
        <button
          className='ReloadButton'
          onClick={restartGame}>
        Click me to try again!
        </button>
      </div>
      <div className='OverlayScreen' id="WinScreen">
        You Win!!!<br />
        <button
          className='ReloadButton'
          onClick={restartGame}>
        Click me to try again!
        </button>
      </div>
      <div className='helpScreen fading' id='helpScreen'>
        Left Click (tap the screen) to reveal the square.<br />
        Right Click (hold the screen) to place a flag.<br />
        Each cell reveals the number of bombs around it.<br />
        Reveal all the squares without bombs to win!<br />
        Click the help button to close this popup.
      </div>
    </div>
  );
}

function Timer(props) {
  const [numSeconds, setNumSeconds] = useState(0);
  const [numMinutes, setNumMinutes] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      if (props.isGamePlaying) {
        setNumSeconds((num) => num + 1);
        if (numSeconds === 59) {
          setNumSeconds(() => 0);
          setNumMinutes((num) => num + 1);
        }
      }
    }, 1000);
    return () => { clearInterval(timer); };
  }, [numMinutes, numSeconds, props.isGamePlaying]);

  return (
    <b className="Timer">
      {numMinutes < 10 ? `0${JSON.stringify(numMinutes)}` : JSON.stringify(numMinutes)}
      :
      {numSeconds < 10 ? `0${JSON.stringify(numSeconds)}` : JSON.stringify(numSeconds)}
    </b>
  );
}

function Board(props) {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [cells, setCells] = useState(createEmptyBoard(8, 8));
  const [cellsClicked, setCellsClicked] = useState(0);

  const incrementCellsClicked = (changeInCells) => {
    const tempCellsClicked = cellsClicked+changeInCells;
    setCellsClicked(tempCellsClicked);
  }

  const changeIsGameOver = () => {
    props.setIsGameOver((isGameOver) => !isGameOver);
    props.changeIsGamePlaying(false);
  }

  const changeIsClickedForNonZeroCell = (r, c) => {
    const tempCells = cells;
    tempCells[r][c].isClicked = true;
    setCells(tempCells);
  }

  const changeIsFlagged = (r, c) => {
    const tempCells = cells;
    tempCells[r][c].isFlagged = !tempCells[r][c].isFlagged;
    setCells(tempCells);
  }
  
  const clickedZeroCell = (r, c) => {
    let numRevealed = 0;
    if(!isGameStarted){
      const tempCells = fillBoard(r, c, cells, props.difficulty);
      setIsGameStarted(true);
      props.changeIsGamePlaying(true);
      setCells(tempCells);
    }
    const grid = checkingSurroundingCells(r, c, cells);
    const tempCells = cells;
    for(let i = 0; i < tempCells.length; i++){
      for(let j = 0; j < tempCells[0].length; j++){
        if(grid[i][j].needsToBeClicked){
          numRevealed++;
          tempCells[i][j].isClicked = true;
        }
      }
    }
    setCells(tempCells);
    incrementCellsClicked(numRevealed);
    numRevealed = 0;
  }

  const addFlag = () => {
    props.changeNumFlags((numBombs) => numBombs+1);
  }

  const removeFlag = () => {
    props.changeNumFlags((numBombs) => numBombs-1);
  }
  
  if(cellsClicked === 52){
    props.setGameWon();
    props.changeIsGamePlaying(false);
  }

  return cells.map((row) => {
    return (row.map((item) => {
      return (<>
        <Cell
          numSurroundingBombs={item.numSurroundingBombs}
          id={`${item.row}-${item.col}`}
          row={item.row}
          col={item.col}
          isFlagged={item.isFlagged}
          isClicked={item.isClicked}
          isBomb={item.isBomb}
          incrementCellsClicked={incrementCellsClicked}
          isGameStarted={isGameStarted}
          isGameOver={props.isGameOver}
          clickedZeroCell={clickedZeroCell}
          changeIsClickedForNonZeroCell={changeIsClickedForNonZeroCell}
          changeIsFlagged={changeIsFlagged}
          changeIsGameOver={changeIsGameOver}
          addFlag={addFlag}
          removeFlag={removeFlag}
          cellsClicked={cellsClicked}
          cells={cells}
          />
          {row[row.length-1] === item ? <span className='break'></span> : ""}
        </>
      );
    }));
  });
}

// r and c represent the dimensions of the board
function createEmptyBoard(r, c) {
  const grid = [];
  
  for (let i = 0; i < r; i++){
    const row = [];
    for(let j = 0; j < c; j++)
      row.push({numSurroundingBombs: 0, row: i, col: j, isFlagged: false, isClicked: false, isBomb: false});
    grid.push(row);
  }

  return grid;
}

// r and c represent the coordinates of the first click on the board
function fillBoard(r, c, cells, difficultyLevel){
  let grid = cells;
  let numBombs = Math.floor((grid.length * grid[0].length) / difficultyLevel);

  for (let i = 0; i < numBombs; i++){
      const randRow = Math.floor(Math.random() * grid.length);
      const randCol = Math.floor(Math.random() * grid[0].length);
      if((randRow === r-1 && randCol === c-1) || (randRow === r && randCol === c) || (randRow === r+1 && randCol === c+1) ||
        (randRow === r-1 && randCol === c) || (randRow === r && randCol === c-1) || (randRow === r+1 && randCol === c-1) ||
        (randRow === r-1 && randCol === c+1) || (randRow === r && randCol === c+1) || (randRow === r+1 && randCol === c))
        i--;
      else{
        if(!grid[randRow][randCol].isBomb){
          grid[randRow][randCol].isBomb = true;
          grid[randRow][randCol].numSurroundingBombs = -1;
        }
        else
          i--;
      }
  }

  for (let i = 0; i < grid.length; i++){
      for (let j = 0; j < grid[0].length; j++){
          if (grid[i][j].isBomb === true)
              continue;
          if (i > 0 && j > 0 && grid[i - 1][j - 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i > 0 && grid[i - 1][j].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i > 0 && j < grid[0].length - 1 && grid[i - 1][j + 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (j > 0 && grid[i][j - 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (j < grid[0].length - 1 && grid[i][j + 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i < grid.length - 1 && j > 0 && grid[i + 1][j - 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i < grid.length - 1 && grid[i + 1][j].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i < grid.length - 1 && j < grid[0].length - 1 && grid[i + 1][j + 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
      }
  }

  return grid;
}

function checkingSurroundingCells(r, c, cells){
  const grid = [];
  
  for (let i = 0; i < cells.length; i++){
    const row = [];
    for(let j = 0; j < cells[0].length; j++)
      row.push({needsToBeClicked: false, isTraversed: false});
    grid.push(row);
  }

  if(!cells[r][c].isFlagged){
    revealSurroundingCells(r, c, grid, cells);
  }
  
  return grid;
}

function revealSurroundingCells(r, c, grid, cells) {
  for(let i = -1; i < 2; i++){
    for(let j= -1 ; j < 2; j++) {
      if(c+j >= 0 && c+j < grid[0].length && r+i >= 0 && r+i < grid.length && !cells[r+i][c+j].isClicked
          && !cells[r+i][c+j].isFlagged && !cells[r+i][c+j].isBomb){
        grid[r+i][c+j].needsToBeClicked = true;
        if(cells[r+i][c+j].numSurroundingBombs === 0 && !grid[r+i][c+j].isTraversed){
            grid[r+i][c+j].isTraversed = true;
            revealSurroundingCells(r+i, c+j, grid, cells);
        }
      }
    }
  }
}

function Cell(props) {
  const [isClicked, setIsClicked] = useState(props.isClicked);
  const [isFlagged, setIsFlagged] = useState(props.isFlagged);
  const [playBomb] = useSound(explosionSound);
  const [playFlag] = useSound(flagSound);
  const [playZero] = useSound(zero);
  const [playOne] = useSound(one);
  const [playTwo] = useSound(two);
  const [playThree] = useSound(three);
  const [playFour] = useSound(four);
  const [playFive] = useSound(five);
  const [playSix] = useSound(six);
  const [playSeven] = useSound(seven);
  const [playEight] = useSound(eight);

  useEffect(() => {
    setIsClicked(props.isClicked);
    if(props.isClicked){
      document.getElementById(props.id)?.classList.add('isClicked');
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [props.isClicked, props.id])

  useEffect(() => 
  {
    if(props.isGameOver || props.cellsClicked === 52){
      setIsClicked(true);
      document.getElementById(props.id)?.classList.add("isClicked");
    }
  }
  , [props.isGameOver, props.cellsClicked, props.id]);

  const handleClick = (e) => {
    if(props.numSurroundingBombs === 0 && e.type !== "contextmenu" && !isClicked){
      props.clickedZeroCell(props.row, props.col);
      playZero();
    }
    if(e.type === "click"){
      if(!isClicked && !isFlagged){
        setIsClicked(true);
        document.getElementById(props.id)?.classList.add("isClicked");
        if(props.isBomb){
          playBomb();
          const loseScreen = document.getElementById("LoseScreen");
          loseScreen?.classList.add("visibility");
          props.changeIsGameOver();
          return;
        }
        if(props.numSurroundingBombs !== 0){
          props.incrementCellsClicked(1);
          props.changeIsClickedForNonZeroCell(props.row, props.col);
          if(props.numSurroundingBombs === 1)
            playOne();
          if(props.numSurroundingBombs === 2)
            playTwo();
          if(props.numSurroundingBombs === 3)
            playThree();
          if(props.numSurroundingBombs === 4)
            playFour();
          if(props.numSurroundingBombs === 5)
            playFive();
          if(props.numSurroundingBombs === 6)
            playSix();
          if(props.numSurroundingBombs === 7)
            playSeven();
          if(props.numSurroundingBombs === 8)
            playEight();
        }
      }
    }
    if(e.type === "contextmenu"){
      e.preventDefault();
      if(!isClicked && props.isGameStarted){
        if(isFlagged)
          props.addFlag();
        else
          props.removeFlag();
        playFlag();
        setIsFlagged(!isFlagged);
        props.changeIsFlagged(props.row, props.col);
        navigator.vibrate(50);
      }
    }
  }

  return (
  <div className="Cell" id={props.id} 
  onClick={handleClick}
  onContextMenu={handleClick}>
    {isClicked ? props.isBomb ? '💣' : props.numSurroundingBombs === 0 ? "" : `${props.numSurroundingBombs}` : isFlagged ? `🚩` : ""}
  </div>
  );
}

export default App;