import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const numBombs = Math.floor((8 * 8) / 4.5);

  return (
    <div className="App">
      <h2>MINESWEEPER</h2>
      <Board dimension="8" difficulty="4.5"/>
      <h5>Number of Bombs: {numBombs}</h5>
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
      //Might want to change this to making an empty board in the future
      cells: createBoard(props.dimension,props.dimension,props.difficulty),
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
      isGameStarted: true
    })
    //Do some method to fill the board at this point
    console.log(`${r}-${c}`)
  }

  render() {
    if(this.state.cellsClicked === 50)
      return <h4>YOU WIN!!!</h4>;
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
              />
            {row[row.length-1] === item ? <span className='break'></span> : ""}
          </>);
        }));
      });;
  }
}

function Cell(props) {
  const [isClicked, setIsClicked] = useState(props.isClicked);
  const [isFlagged, setIsFlagged] = useState(props.isFlagged);

  useEffect(() => 
  {
    if(props.isGameOver)
      setIsClicked(true);
  }
  , [props.isGameOver]);

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
    if(!isClicked)
      setIsFlagged(!isFlagged);
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

function createBoard(r, c, difficultyLevel) {
  const grid = [];
  const numBombs = Math.floor((r * c) / difficultyLevel);

  for (let i = 0; i < r; i++){
      const row = [];
      for(let j = 0; j < c; j++)
          row.push({numSurroundingBombs: 0, row: i, col: j, isFlagged: false, isClicked: false, isBomb: false});
      grid.push(row);
  }

  for (let i = 0; i < numBombs; i++){
      const randRow = Math.floor(Math.random() * r);
      const randCol = Math.floor(Math.random() * c);
      !grid[randRow][randCol].isBomb ? grid[randRow][randCol].isBomb = true : i--;
  }

  for (let i = 0; i < r; i++){
      for (let j = 0; j < c; j++){
          if (grid[i][j].isBomb === true)
              continue;
          if (i > 0 && j > 0 && grid[i - 1][j - 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i > 0 && grid[i - 1][j].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i > 0 && j < c - 1 && grid[i - 1][j + 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (j > 0 && grid[i][j - 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (j < c - 1 && grid[i][j + 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i < r - 1 && j > 0 && grid[i + 1][j - 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i < r - 1 && grid[i + 1][j].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
          if (i < r - 1 && j < c - 1 && grid[i + 1][j + 1].isBomb === true)
              grid[i][j].numSurroundingBombs += 1;
      }
  }

  return grid;
}

export default App;