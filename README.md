# OnlineBallPointGame

<h3>What is the Ball Point Game?</h3> 

The Ball Point Game is a real life group exercise to explore the basics of Agility. <br />
Players experience the concepts of iterative work, retrospectives and self-organization with the help of
a fun ball game.

<h3>What is the Remote Ball Point Game?</h3> 

Like the name suggests, the remote ball point game provides the possibility to play the game online
with distributed teams. <br />

The game itself simply provides the setup as often given in trainings: a meeting room, balls, a timer
and flipcharts with some explanations.
Like in a real life scenario a trainer should facilitate and debrief the game to connect the experiences
of the players with the theory about Agility.

<h3>How to run the game local for development?</h3> 

<ol>
  <li> npm install (to install all dependencies)</li>
  <li> npm run tsc (starts watcher for changes in ts files and generates js files) </li>
  <li> npm run build-dev (starts watcher for changes in js files and bundles them) </li>
  <li> npm start (starts node server that listens on http://localhost:5000/) </li>
</ol>

<h3>Configuration Options</h3> 

You can make some configurations in the file src/game/Congifs.ts

<ul>
  <li>maxGameRooms (the number of parallel rooms that can be opened)</li>
  <li>playerControleMode (1 - movement and rotation with the keyboard; 2 - movement with the keyboard, rotation with the mouse) </li>
  
  <li><s>syncMode (1 - the clients only send their inputs to the server and the server updates the game state; 0 - the clients update their own state and send the state to the server). Use 1, otherwise the client can easily hack the state... </s></li>
   <li>arcadeMode (false - the game ist facilitated by a trainer; true - the game guides you). The arcade mode ist not really stable and the outcome of the exercise ist better if the game is facilitated by a trainer....</li>
</ul>
