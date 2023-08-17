import { zero, one, two, three, four, five, six, seven, eight } from './Audio/CellSounds.js';
import useSound from 'use-sound';
import flagSound from './Audio/Flag.mp4';
import explosionSound from './Audio/explosion.mp4';
import React, { useState, useEffect } from 'react';

/**
 * The Board function which is in charge of placing the individual cells and keeping track of the state of
 * the game
 * 
 * @param props - placeholder for all the props that are passed down by the app
 * @prop {int} dimension - the dimension of the board
 * @prop {int} difficulty - the difficulty of the current game
 * @prop {const} changeNumFlags - function passed down to change the numBombs state in the app
 * @prop {const} setGameWon - function passed down for the board to call when the game has been won
 * @prop {const} changeIsGamePlaying - a function passed down for the board to modify the state of
 *                                     isGamePlaying in App
 * @prop {boolean} isGameOver - a state that tells the Board whether the game is over or not
 * @prop {const} setIsGameOver - a function passed down to change the value of isGameOver
 * 
 * @const {boolean} isGameStarted - true or false depending on whether the game has started or not
 * @const {[]} cells - an array that stores all cell objects that are being placed on the board
 * @const {int} cellsClicked - the number of cells that have been revealed by the user
 *  
 * @returns an array of cells to be placed on the board
 */
export default function Board(props) {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [cells, setCells] = useState(createEmptyBoard(8, 8));
    const [cellsClicked, setCellsClicked] = useState(0);

    /**
     * Changes the cellsClicked state based on the changeInCells value
     * 
     * @param {int} changeInCells - the number of cells that have been clicked 
     */
    const incrementCellsClicked = (changeInCells) => {
        const tempCellsClicked = cellsClicked+changeInCells;
        setCellsClicked(tempCellsClicked);
    }

    /**
     * Calls its prop values to change the state of the game in the App to being over
     */
    const changeIsGameOver = () => {
        props.setIsGameOver((isGameOver) => !isGameOver);
        props.changeIsGamePlaying(false);
    }

    /**
     * Called when a nonzero cell has been clicked and will update the cells
     * state based on the cell clicked
     * 
     * @param {int} r - the row of the cell clicked
     * @param {int} c - the column of the cell clicked
     */
    const changeIsClickedForNonZeroCell = (r, c) => {
        const tempCells = cells;
        tempCells[r][c].isClicked = true;
        setCells(tempCells);
    }

    /**
     * Called when a cell is flagged and will change its prop value of isFlagged in the cells
     * state
     * 
     * @param {int} r - the row value of the cell flagged
     * @param {int} c - the column of the cell flagged
     */
    const changeIsFlagged = (r, c) => {
        const tempCells = cells;
        tempCells[r][c].isFlagged = !tempCells[r][c].isFlagged;
        setCells(tempCells);
    }
    
    /**
     * Called when a zero cell is clicked and will set up the game if it has not started yet and
     * update the board based on the surrounding cells around it
     * 
     * @param {int} r - the row of the cell
     * @param {int} c - the column of the cell
     */
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

    /**
     * Uses the passed down prop to increment the number of bombs when removing a flag
     */
    const removeFlag = () => {
        props.changeNumFlags((numBombs) => numBombs+1);
    }

    /**
     * Uses the passed down prop to decrement the number of bombs when adding a flag
     */
    const addFlag = () => {
        props.changeNumFlags((numBombs) => numBombs-1);
    }
    
    /**
     * Meant as a check if the game is completed or not
     */
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
                />
                {row[row.length-1] === item ? <span className='break'></span> : ""}
            </>
            );
        }));
    });
}

/**
 * Creates an array with default values for each cell
 * 
 * @param {int} r - the number of rows desired
 * @param {int} c - the number of columns desired
 * 
 * @returns an empty array with default values and r rows and c columns
 */
function createEmptyBoard(r, c) {
    const grid = [];
    
    for (let i = 0; i < r; i++){
        const row = [];
        for(let j = 0; j < c; j++)
            row.push({numSurroundingBombs: 0,
                        row: i,
                        col: j,
                        isFlagged: false,
                        isClicked: false,
                        isBomb: false});
        grid.push(row);
    }

    return grid;
}

/**
 * Places the bombs and fills in the numbers in each cell w.r.t. the bombs to complete the board 
 * 
 * @param {int} r - the number of rows 
 * @param {int} c - the number of columns
 * @param {[]} cells - the array of cells for the function to reference for its return value
 * @param {int} difficultyLevel - the level of difficulty defined
 * 
 * @returns a new board with newly defined values for each cell
 */
function fillBoard(r, c, cells, difficultyLevel){
    let grid = cells;
    let numBombs = Math.floor((grid.length * grid[0].length) / difficultyLevel);

    /**
     * Places the bombs in the board
     */
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

/**
 * Goes through the board and assigns the numSurroundingBombs based on the bombs around the cell
 */
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

/**
 * Serves as the action when a cell with value zero is clicked which notes all cells
 * surrounding the given cell that was clicked by the user
 * 
 * @param {int} r - the row value of the cell clicked
 * @param {int} c - the column of the cell clicked
 * @param {[]} cells - the array of cells used as a reference for finding surrounding cells
 * 
 * @returns a new board that tells the original board which cells needs to be clicked
 */
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

/**
 * Takes the result of checkingSurroundingCells and properly notes the elements that
 * need to be clicked on the board recursively
 * 
 * @param {int} r - the row of the cell that you want to check around
 * @param {int} c - the column of the cell that you want to check around
 * @param {[]} grid - the board that is being changed around based on the clicked cells
 * @param {[]} cells - the original board used as a reference of the original board
 */
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

/**
 * The Cell function which can either carry a bomb or a number for the user to interact with
 * in an effort to win the game
 * 
 * @param props 
 * @prop {int} numSurroundingBombs - the number of bombs that are around the cell
 *                                   and -1 if it is a bomb
 * @prop {string} id - a unique id based on the row and column of the cell
 * @prop {int} row - the row of the cell based on the board
 * @prop {int} col - the column of the cell based on the board
 * @prop {boolean} isFlagged - true of false based on whether the cell is flagged or not flagged and
 *                             is used for outside components to read its state value
 * @prop {boolean} isClicked - true of false based on whether the cell is clicked or not clicked and
 *                             is used for outside components to read its state value
 * @prop {boolean} isBomb - true if the cell is a bomb and false otherwise
 * @prop {const} incrementCellsClicked - increments numCellsClicked in Board
 * @prop {boolean} isGameStarted - passed down to know whether or not the game has started
 * @prop {boolean} isGameOver - passed down to know whether or not the game is over
 * @prop {const} clickedZeroCell - tells Board the a zero cell was clicked
 * @prop {const} changeIsClickedForNonZeroCell - updates the isClicked prop value of the cell in Board
 * @prop {const} changeIsFlagged - updates the isFlagged prop value of the cell in Board
 * @prop {const} changeIsGameOver - changes the value of isGameOver in App
 * @prop {const} addFlag - updates the number of flags used which changes numBombs in App
 * @prop {const} removeFlag - updates the number of flags used which changes numBombs in App
 * @prop {int} cellsClicked - the number of cells that have been clicked on the entire board
 * 
 * @const {boolean} isClicked - true if the cell is already clicked and false otherwise
 * @const {boolean} isFlagged - true if the cell is currently flagged and false otherwise
 * @const {Audio} play* - represents all of the audio files that play in relation to the name
 * 
 * @returns a single cell which displays its value depending on its states values
 */
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

    /**
     * Modifies the state isClicked depending on whether an external component modified its
     * prop value
     */
    useEffect(() => {
        setIsClicked(props.isClicked);
        if(props.isClicked){
            document.getElementById(props.id)?.classList.add('isClicked');
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [props.isClicked, props.id])

    /**
     * Changes each cell to become clicked whether the game was won or lost
     */
    useEffect(() => {
        if(props.isGameOver || props.cellsClicked === 52){
            setIsClicked(true);
            document.getElementById(props.id)?.classList.add("isClicked");
        }
    }
    , [props.isGameOver, props.cellsClicked, props.id]);

    /**
     * Handles the click of the user by modifying the cell and game depending on the state
     * of the cell that was clicked
     * 
     * @param {Event} e - handles the type of click done by the user
     */
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
                props.removeFlag();
            else
                props.addFlag();
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