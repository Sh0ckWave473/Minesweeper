import './App.css';
//import React, { useState } from 'react';

function App() {
  return (
  <div className="App">
    <h2>MINESWEEPER</h2>
    <Board />
  </div>
  );
}

function Board() {
  const cells = createBoard(2, 2);

  const renderCells = () => {
  return cells.map((row) => {
      return( row.map((item) => {
          return(
            <>
              <Cell
                numSurroundingBombs={item.numSurroundingBombs}
                row={item.row}
                col={item.col}
                isFlagged={item.isFlagged}
                isClicked={item.isClicked}
                isBomb={item.isBomb}
              />
            </>
          );
        })
      );
    });
  ;}

  return {renderCells};
}

function Cell({numSurroundingBombs, row, col, isFlagged, isClicked, isBomb}) {
   return (
    <div className="Cell" id={`${row}-${col}`}>{numSurroundingBombs}</div>
    //<div className="Cell">1</div>
   );
}

function createBoard(r, c) {
  const grid = [];
  const numBombs = Math.floor((r * c) / 3);

  for (let i = 0; i < r; i++){
      const row = [];
      for(let j = 0; j < c; j++)
          row.push({numSurroundingBombs: 0, row: i, col: j, isFlagged: false, isClicked: false, isBomb: false});
      grid.push(row);
  }

  for (let i = 0; i < numBombs; i++){
      const randRow = Math.floor(Math.random() * r);
      const randCol = Math.floor(Math.random() * c);
      grid[randRow][randCol] === 0 ? grid[randRow][randCol].isBomb = true : i--;
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