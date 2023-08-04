# To-Do List

Implement a way to store the bombs when the first square is picked

    - randomly assign a set number of bombs on screen except for the one square that has been clicked along with any other adjacent square
      - this will most likely be stored into a 2D array meaning we will have to be able to identify each individual square somehow
    - all of the squares' values will be calculated once the bombs have been placed

Spread the work out into different files for better readability

Instead prerender a game so that we do not have to deal with undefined values when the website is loaded.

Create an object for the properties in the Grid-Cell components rather than pass all the props individually.

Use numbers and X's for now instead of images.

Set a className for each property that needs a style change based on the difficulty

# The components of the game

~~Title - Presents the title of the game~~

~~Timer - Running indefinitely when the first square is clicked and stops until the game is finished~~

~~GridLayout - Contains the rows of squares (might make the size dynamic later)~~
    ~~Rows - Contains the squares~~
        ~~Squares - Will be displaying the number of bombs around or a bomb itself when clicked~~

~~Help Button - Interactive button for the user to learn the controls~~

~~Pause Button - Interactive button for the user to pause the game~~

~~Difficulty Dropdown Menu~~

# State variables

~~Numerical value for each square - number of bombs around, 0 for none, and -1 if it is a bomb~~

~~Difficulty value - easy, medium, hard, any more if wanted~~

A pause value - check whether or not the game is paused

~~Flag value - dictates if a square is flagged by being right clicked on~~

isFlagging - checks if the user is in flag mode or not

*Also added an isClicked variable*

# Game functionality

The user will only be pointing and clicking the screen. There is no need for typing interaction.

When user clicks the board to start the game:
    
    - the square clicked will alter how the bombs are generated
    - the square will guarantee to have a value of 0
    - difficulty button will disappear
    - the timer will start

If the player clicks a bomb:
    
    - they lose immediately (game over) not an alert
    - show all bomb locations
    - reveal the difficulty button

If the player clicks a safe square that's not zero:
    
    - reveal its number

If the player clicks a square that's zero:
    
    - reveal all zero square tiles in vicinity

If the player clicks a flagged square:
    
    - nothing happens

If the player clicks the pause button:
    
    - stop the clock and hide the board from view

Note: Right clicks flag squares while left clicks reveal them

# Mobile vs Computer Systems

Flagging a square:
    
    - click and hold or select the type of click for mobile user using UI elements
    - all features for mobile will be available for computer but they can right click too
