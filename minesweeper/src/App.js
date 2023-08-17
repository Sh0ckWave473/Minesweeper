import './App.css';
import useSound from 'use-sound';
import winSound from './Audio/mixkit-instant-win-2021.mp4';
import React, { useState, useEffect } from 'react';
const Board = React.lazy(() => import("./Board"));

/**
 * The main function of the Minesweeper Website that will be invoking all other components as well as setting up 
 * the site's structure
 * 
 * @constant {int} numBombs - the total number of bombs that will appear on the board
 * @constant {boolean} isGamePlaying - true if the game is currently in session and false otherwise
 * @constant {boolean} isGameOver - strictly false if the game has not been concluded and true if it has
 * @const {Audio} play - plays the sound used for winning the game
 * 
 * @return the entire game structure
 */
function App() {
  const [numBombs, setNumBombs] = useState(Math.floor((8 * 8) / 5));
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [play] = useSound(winSound, { volume: .50 });
  
  /**
   * Function used to pass down the setState function the board so that the isGamePlaying
   * state can be modified in the app
   * 
   * @param {boolean} truthValue - the boolean that isGamePlaying should become
   */
  const changeIsGamePlaying = (truthValue) => {
    setIsGamePlaying(truthValue);
  }

  /**
   * Function passed to the board which will play the win sound and make other necessary
   * modifications towards its states and components to create the win screen
   */
  const winGame = () => {
    play();
    const winScreen = document.getElementById("WinScreen");
    setIsGameOver(true);
    winScreen?.classList.add("visibility");
  }

  /**
   * Function meant to reload the screen which is prompted by a user pressing a button
   */
  const restartGame = () => {
    window.location.reload();
  }

  /**
    * Retrieves the help screen and applies visibility depending on whether or not the
    * help button has been pressed
    */
  const handleClick = () => {
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
  }

  return (
    <div className="App">
      <div className='Deco flipped'>🚩</div>
      <div className="Title">MINESWEEPER</div>
      <div className='Deco'>🚩</div>
      <span className='break'></span>
      <Timer isGamePlaying={isGamePlaying}/>
      <span className='break'></span>
      <React.Suspense fallback={<div>Loading...</div>}>
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
      </React.Suspense>
      <span className='break'></span>
      <h5>Number of Bombs: {isGameOver ? '0' : numBombs}</h5>
      <div
        className='helpButton'
        onClick={handleClick}>
        <i className="fa-sharp fa-solid fa-question" />
      </div>
      <h5>Best Dev Time: 00:10</h5>
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

/**
 * The timer function that creates a timer once the game begins playing and
 * terminates once the game is over
 * 
 * @param props - The timer's properties passed down from the html element
 * @prop {boolean} isGamePlaying - checks if the game is currently playing
 * 
 * @constant {int} numSeconds - the number of seconds that have elapsed at the start of the game
 * @constant {int} numMinutes - the number of minutes that have elapsed at the start of the game
 * 
 * @return an element that functions as the timer for the game
 */
function Timer(props) {
  const [numSeconds, setNumSeconds] = useState(0);
  const [numMinutes, setNumMinutes] = useState(0);

  /**
   * Keeps track of the seconds and minutes that go by to update the timer correctly
   */
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

export default App;