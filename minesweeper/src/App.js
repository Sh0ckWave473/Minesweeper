import './App.css';
import explosionSound from './Audio/explosion.wav';
import useSound from 'use-sound';
import winSound1 from './Audio/mixkit-instant-win-2021.wav';
import winSound2 from './Audio/mixkit-winning-chimes-2015.wav';
import flagSound from './Audio/canvas-dropcloth-snap-2-98861.wav';
import React, { useState, useEffect } from 'react';

function App() {
  const [numBombs, setNumBombs] = useState(Math.floor((8 * 8) / 4.5));
  const [play1] = useSound(winSound1);
  const [play2] = useSound(winSound2);
  
  const winGame = () => {
      if(Math.random() > 0.5)
        play1();
      else
        play2();
    const winScreen = document.getElementById("WinScreen");
    winScreen?.classList.add("visibility");
  }

  return (
    <div className="App">
      <h2>MINESWEEPER</h2>
      <div className='Board'>
        <Board
          dimension="8"
          difficulty="4.5"
          bombsOnBoard={numBombs}
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

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameStarted: false,
      isGameOver: false,
      cells: createEmptyBoard(8, 8),
      cellsClicked: 0
    };
  }

  incrementCellsClicked = () => {
    this.setState({cellsClicked: this.state.cellsClicked+1});
  }

  changeIsGameOver = () => {
    this.setState({isGameOver: true})
  }
  
  clickedZeroCell = (r, c) => {
    if(!this.state.isGameStarted){
      this.setState({
        isGameStarted: true,
        cells: fillBoard(r, c, this.state.cells, 4.5)
      });
   }
  //  else{
  //     const grid = checkingSurroundingCells(r, c, this.state.cells);
  //     const tempCells = this.state.cells;
  //     for(let i = 0; i < tempCells.length; i++){
  //       for(let j = 0; j < tempCells[0].length; j++){
  //         if(grid[i][j].needsToBeClicked){
  //           tempCells[i][j].isClicked = true;
  //         }
  //       }
  //     }
  //     this.setState({cells: tempCells});
  //  }
    console.log(`${r}-${c}`)
  }

  changeNumFlags = (changeInFlags) => {
    this.props.changeNumFlags((numBombs) => numBombs+changeInFlags);
  }
  
  render() {
    if(this.state.cellsClicked === 50)
      this.props.setGameWon();
    return this.state.cells.map((row) => {
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
            incrementCellsClicked={this.incrementCellsClicked}
            isGameStarted={this.state.isGameStarted}
            isGameOver={this.state.isGameOver}
            zeroCellClicked={this.clickedZeroCell}
            setIsGameOver={this.changeIsGameOver}
            setNumFlagsRemoved={this.changeNumFlags}
            numCellsClicked={this.state.cellsClicked}
            />
            {row[row.length-1] === item ? <span className='break'></span> : ""}
          </>
        );
      }));
    });
  }
}

function Cell(props) {
  const [isClicked, setIsClicked] = useState(props.isClicked);
  const [isFlagged, setIsFlagged] = useState(props.isFlagged);
  const [playBomb] = useSound(explosionSound);
  const [playFlag] = useSound(flagSound);

  // useEffect(() => {
  //   setIsClicked(props.isClicked);
  //   if(props.isClicked){
  //     document.getElementById(props.id)?.classList.add('isClicked');
  //     props.incrementCellsClicked();
  //   }
  // }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // , [props.isClicked, props.id])

  useEffect(() => 
  {
    if(props.isGameOver || props.numCellsClicked === 50){
      setIsClicked(true);
      document.getElementById(props.id)?.classList.add("isClicked");
    }
  }
  , [props.isGameOver, props.numCellsClicked, props.id]);

  const handleClick = (e) => {
    if((!props.isGameStarted || props.numSurroundingBombs === 0) && e.type !== "contextmenu")
      props.zeroCellClicked(props.row, props.col);
    if(e.type === "click"){
      if(!isClicked && !isFlagged){
        setIsClicked(true);
        document.getElementById(props.id)?.classList.add("isClicked");
        if(props.isBomb){
          playBomb();
          const loseScreen = document.getElementById("LoseScreen");
          loseScreen?.classList.add("visibility");
          props.setIsGameOver();
          return;
        }
        props.incrementCellsClicked();
      }
    }
    if(e.type === "contextmenu"){
      e.preventDefault();
      if(!isClicked && props.isGameStarted){
        if(isFlagged)
          props.setNumFlagsRemoved(1);
        else
          props.setNumFlagsRemoved(-1);
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
    {isClicked ? props.isBomb ? '💣' : `${props.numSurroundingBombs}` : isFlagged ? `🚩` : ""}
  </div>
  );
}

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

function fillBoard(r, c, cells, difficultyLevel){
  let grid = cells;
  const numBombs = Math.floor((grid.length * grid[0].length) / difficultyLevel);

  for (let i = 0; i < numBombs; i++){
      const randRow = Math.floor(Math.random() * grid.length);
      const randCol = Math.floor(Math.random() * grid[0].length);
      if((randRow === r-1 && randCol === c-1) || (randRow === r && randCol === c) || (randRow === r+1 && randCol === c+1) ||
        (randRow === r-1 && randCol === c) || (randRow === r && randCol === c-1) || (randRow === r+1 && randCol === c-1) ||
        (randRow === r-1 && randCol === c+1) || (randRow === r && randCol === c+1) || (randRow === r+1 && randCol === c))
        i--;
      else
        !grid[randRow][randCol].isBomb ? grid[randRow][randCol].isBomb = true : i--;
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

// function checkingSurroundingCells(r, c, cells){
//   const grid = [];
  
//   for (let i = 0; i < cells.length; i++){
//     const row = [];
//     for(let j = 0; j < cells[0].length; j++)
//       row.push({needsToBeClicked: false});
//     grid.push(row);
//   }

//   revealSurroundingCells(r, c, grid, cells);

//   console.log(grid);
//   return grid;
// }

// function revealSurroundingCells(r, c, grid, cells) {
//   for(let i = -1; i < 2; i++){
//     for(let j= -1 ; j < 2; j++) {
//       if(c+j >= 0 && c+j < grid[0].length && r+i >= 0 && r+i < grid.length){
//         grid[r+i][c+j].needsToBeClicked = true;
//         if(cells[r+i][c+j].numSurroundingBombs === 0 && !grid[r+i][c+j].needsToBeClicked){
//           revealSurroundingCells(r+i, c+j, grid, cells);
//         }
//       }
//     }
//   }
// }

export default App;