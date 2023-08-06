import './App.css';
import React, { useState, useEffect } from 'react';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      numBombs: Math.floor((8 * 8) / 4.5)
    }
  }

  changeNumBombs = (changeInFlags) => {
    this.setState({numBombs: this.state.numBombs+changeInFlags})
  }

  winGame = () => {
    const winScreen = document.getElementById("WinScreen");
    winScreen?.classList.add("visibility");
  }

  render() {
    return (
      <div className="App">
        <h2>MINESWEEPER</h2>
        <div className='Board'>
          <Board dimension="8" difficulty="4.5" changeNumFlags={this.changeNumBombs} setGameWon={this.winGame}/>
        </div>
        <br />
        <h5>Number of Bombs: {this.state.numBombs}</h5>
        <br />
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
    console.log(this.state.cellsClicked);
  }

  changeIsGameOver = () => {
    this.setState({isGameOver: true})
  }
  
  changeIsGameStarted = (r, c) => {
    this.setState({
      isGameStarted: true,
      cells: fillBoard(r, c, this.state.cells, 4.5)
    })
    console.log(`${r}-${c}`)
  }

  changeNumFlags = (changeInFlags) => {
    this.props.changeNumFlags(changeInFlags);
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
            setIsGameStarted={this.changeIsGameStarted}
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

  useEffect(() => 
  {
    if(props.isGameOver || props.numCellsClicked === 50)
      setIsClicked(true);
  }
  , [props.isGameOver, props.numCellsClicked]);

  const handleClick = (e) => {
    if(!props.isGameStarted)
      props.setIsGameStarted(props.row, props.col);
    if(e.type === "click"){
      if(!isClicked && !isFlagged){
        setIsClicked(true);
        if(props.isBomb){
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
      if(!isClicked){
        if(isFlagged)
          props.setNumFlagsRemoved(1);
        else
          props.setNumFlagsRemoved(-1);
        setIsFlagged(!isFlagged);
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

export default App;