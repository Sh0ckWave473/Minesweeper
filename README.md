# 🚩 ABOUT OUR MINESWEEPER PROJECT 🚩
This is our first full attempt at a functioning React site (the prototype of this site was mediocre and we wanted to restart due to the difficulty of continuing with the design we chose).

Website: [Minesweeper](https://minesweeper-em9.pages.dev)

It was a very exciting project for [nathanieleh](https://github.com/nathanieleh?tab=repositories) (GitHub Profile) as well as myself due to the both of us enjoying Minesweeper very much. We were inspired to create a website that we ourselves would want to play on every day and I think we were somewhat successful at doing so. Overall, this was a great learning experience for the both of us due to how much knowledge we have gained about HTML, CSS, JS and React and we would love to share our experiences here in this document.

Side Note: We both utilized the Live Share extension offered in VSCode so as a result, it shows that Justin has made all the commits. However, we both contributed equally and nobody was making the other do all the work.

## The Prototype
One cannot even call this project a game given the state it is in at this moment. Going into this project, we had no grasp of any of the hooks and how React development even worked. This served as more of a sandbox to test out different features that we were learning before the real project came under way after we took a break from development for a few weeks. The project can be found [here](https://github.com/nathanieleh/minesweeper) if anyone still wants to see the amalgamation that we created in comparison to what we have now. We have certainly learned much more about React through this experience which placed us in a better position to create our new and improved minesweeper game after what we call the prototype project.

## Struggles
The main hurdle that we had to overcome was being able to fully understand functions, its capabilities, and the limitation they have. Somehow we got a deeper grasp on how classes worked before we got familiar with functions which consequently meant that we started to rely on the former rather than the latter (even though classes are not recommended at this point). But as we delved further into development and got more familiar with React's potential with functions, we ended up rewriting large blocks of code so we can make the switch over to relying more on functions/hooks. We were very unaware of the large amount of resources that the coding community had created in the form of hooks which aided in development later down the road. 

Another problem that we ran into was in the form of property management. We struggled to make changes to a particular cell's isClicked and isFlagged props which resulted in miscommunication between the board and the cell. There would be moments where the cell knew it was clicked due to it handling the click itself while the board had no clue it was clicked due to us changing the cell's state value and not the prop that the board sees. We fixed this by passing a function from the board that modifies the array of cells based on the row and column input to the cell. We are not entirely sure if this is an optimal solution to the problem, but we felt that was the best solution we could come up with.

## Favorite Part of the Project
Without a question, our favorite part of the project has to be when we dealt with the recursive nature of revealing all cells around a zero value cell that was clicked by the user. Due to us having an extensive coding background in Java, this was the first part of the project that we felt challenged us mentally in terms of functionality. Most of the challenges we had up to this point were mostly due to us trying to understand the basics of React. We were able to apply our knowledge of recursion to solve this feature and when we saw all of the cells reveal around the zero cell for the first time, we both became ecstatic. This feature we implemented reminded us that this feeling was the reason why we both enjoy programming.