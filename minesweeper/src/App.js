import './App.css';
import React, { useState } from 'react';

function App() {
  return (
  <div className="App">
    <h2>MINESWEEPER</h2>
    <Board />
  </div>
  );
}

function Board() {
  const cells = createBoard(8, 8);
  
  return cells.map((row) => {
      return( row.map((item) => {
          return(
            <>
              <Cell
                numSurroundingBombs={item.numSurroundingBombs}
                id={`${item.row}-${item.col}`}
                row={item.row}
                col={item.col}
                isFlagged={item.isFlagged}
                isClicked={item.isClicked}
                isBomb={item.isBomb}
              />
              {row[row.length-1] === item ? <span className='break'></span> : ""}
            </>
          );
        })
      );
    });;
}

function Cell(props) {
  const [isClicked, setIsClicked] = useState(props.isClicked);
  //const [isFlagged, setIsFlagged] = useState(props.isFlagged);
  
   return (
    <div className="Cell" id={props.id} 
    onClick={() => {
        if(!isClicked)
          setIsClicked(true);
      }
    }
    click>
      {isClicked ? props.isBomb ? "💣" : `${props.numSurroundingBombs}` : ""}
    </div>
   );
}

function createBoard(r, c) {
  const grid = [];
  const numBombs = Math.floor((r * c) / 4.5);

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