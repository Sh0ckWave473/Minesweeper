import './App.css';
import explosionSound from './Audio/explosion.wav';
import useSound from 'use-sound';
import winSound from './Audio/mixkit-instant-win-2021.wav';
import flagSound from './Audio/canvas-dropcloth-snap-2-98861.wav';
import React, { useState, useEffect } from 'react';

function App() {
  const [numBombs, setNumBombs] = useState(Math.floor((8 * 8) / 5));
  const [play] = useSound(winSound);
  
  const winGame = () => {
    play();
    const winScreen = document.getElementById("WinScreen");
    winScreen?.classList.add("visibility");
  }

  return (
    <div className="App">
      <h2>MINESWEEPER</h2>
      <div className='Board'>
        <Board
          dimension="8"
          difficulty="5"
          changeNumFlags={setNumBombs}
          setGameWon={winGame}
        />
      </div>
      <span className='break'></span>
      <h5>Number of Bombs: {numBombs}</h5>
      <span className='break'></span>
      <div className='helpButton'
      onClick={() => {
        const helpScreen = document.getElementById("helpScreen");
        if(helpScreen?.classList.contains("visibility"))
          helpScreen?.classList.remove("visibility");
        else
          helpScreen?.classList.add("visibility");
      }}
      ><i className="fa-sharp fa-solid fa-question" /></div>
      <div className='LoseScreen' id="LoseScreen"><h4>You Lose</h4>Refresh to try again!</div>
      <div className='WinScreen' id="WinScreen"><h4>You Win!!!</h4>Refresh to try again!</div>
      <div className='helpScreen' id='helpScreen'>
        Left Click (tap the screen) to reveal the square.<br />
        Right Click (hold the screen) to place a flag.<br />
        Reveal all the squares without bombs to win!<br />
        Click the help button to close this popup.
      </div>
    </div>
  );
}

function Board(props) {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [cells, setCells] = useState(createEmptyBoard(8, 8));
  const [cellsClicked, setCellsClicked] = useState(0);

  const incrementCellsClicked = (changeInCells) => {
    const tempCellsClicked = cellsClicked+changeInCells;
    setCellsClicked(tempCellsClicked);
  }

  const changeIsGameOver = () => {
    setIsGameOver((isGameOver) => !isGameOver);
  }

  const changeIsClickedForNonZeroCell = (r, c) => {
    const tempCells = cells;
    tempCells[r][c].isClicked = true;
    setCells(tempCells);
  }
  
  const clickedZeroCell = (r, c) => {
    let numRevealed = 0;
    if(!isGameStarted){
      const tempCells = fillBoard(r, c, cells, props.difficulty);
      setIsGameStarted(true);
      setCells(tempCells);
      console.log("game rendered");
    }
    const grid = checkingSurroundingCells(r, c, cells);
    console.log(grid);
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

  const changeNumFlags = (changeInFlags) => {
    props.changeNumFlags((numBombs) => numBombs+changeInFlags);
  }
  
  if(cellsClicked === 52)
    props.setGameWon();

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
          isGameOver={isGameOver}
          clickedZeroCell={clickedZeroCell}
          changeIsClickedForNonZeroCell={changeIsClickedForNonZeroCell}
          changeIsGameOver={changeIsGameOver}
          changeNumFlags={changeNumFlags}
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

  useEffect(() => {
    setIsClicked(props.isClicked);
    if(props.isClicked){
      document.getElementById(props.id)?.classList.add('isClicked');
      console.log(props.cellsClicked);
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
    if(props.numSurroundingBombs === 0 && e.type !== "contextmenu" && !isClicked)
      props.clickedZeroCell(props.row, props.col);
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
        }
        console.log(props.cellsClicked);
      }
    }
    if(e.type === "contextmenu"){
      e.preventDefault();
      if(!isClicked && props.isGameStarted){
        if(isFlagged)
          props.changeNumFlags(1);
        else
          props.changeNumFlags(-1);
        playFlag();
        setIsFlagged(!isFlagged);
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