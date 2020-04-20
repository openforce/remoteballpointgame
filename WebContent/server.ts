// Dependencies

import * as express from 'express';
// @ts-ignore
import * as http from 'http';
// @ts-ignore
import * as path from 'path';
import * as socketIO from 'socket.io';

import {Game} from './static/src/out/game/Game.js';


var app = express();
var server = new http.Server(app);
var io = socketIO(server);

var logToConsole = false;

app.set('port', 5000);
// @ts-ignore
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request:any, response:any) {
  // @ts-ignore
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  log('Starting server on port 5000');
});



// Setup game (old) --> refactore into the game object!!

var players = {};
var balls = {};


// init game (new)
var game = new Game();
game.initGameSimulation();


// TIME Parameters
var lastTime = 0;
var timeDiff = 0;


// socket.io stuff

io.on('connection', function(socket:any) {
  log('New Socket Connection');
  
  // Player functions
  socket.on('new player', function(newPlayer:any) {
    
    newPlayer.socketId = socket.id;
    // @ts-ignore
    players[newPlayer.id] = newPlayer;

    io.sockets.emit('new result table', game.flipchart.resultTable);

    log('New Player: ' + newPlayer.id);
  });










  // OLD SYNC STUFF

  socket.on('player sync', function(player:any) {
    // update Player state 
    //console.log(player);
    // @ts-ignore
    players[player.id] = player;
    player.socketId = socket.id;
    //console.log('sync Player: ' + player.id);
  });

  socket.on('disconnect', function() {
    log('remove Player with socked id: ' + socket.id);

    var playerId = null;
    var tempPlayers = {};
    for(var id in players){
      // @ts-ignore
      if(players[id].socketId != socket.id) tempPlayers[id] = players[id];
    }
    players = tempPlayers;

    log('Players: ');
    for(var id in players){
      // @ts-ignore
      log(players[id].id);
    }
    log('removed Player with socked id: ' + socket.id);
  });

  // BALL action functions
  socket.on('throw ball', function(ball:any) {
    // add Ball to the world
    log('throw ball:');
    log(ball);
    // @ts-ignore
    balls[ball.id] = ball;
    
  });

  socket.on('take ball', function(ball:any) {
    // remove ball from the world
    
    var tempBalls = {};
    for(var id in balls){
      // @ts-ignore
      if(id != ball.id) tempBalls[id] = balls[id];
    }
    balls = tempBalls;

    log('take ball: ' + ball.id);
    
  });
  
  socket.on('sync ball', function(ball:any) {
    // add Ball to the world
    // @ts-ignore
    if(balls[ball.id] != null) balls[ball.id] = ball;
  });

  // TIMER
  socket.on('trigger timer', function() {

    if(game.timer.startTime == null){
      game.timer.startTime = new Date().getTime();
      log('--> start timer');
    }else{
      game.timer.startTime = null;
      game.points = 0;
      log('--> End timer');
    }
  });

  // Flipchart
  socket.on('trigger flipchart', function(clientLastActivator:number) {
    game.flipchart.active = !game.flipchart.active;
    game.flipchart.lastActivator = clientLastActivator;
  });
  socket.on('trigger next flipchart', function() {
    game.flipchart.activeFlipchart++;
    if(game.flipchart.activeFlipchart == game.flipchart.numberOfFlipcharts) game.flipchart.activeFlipchart = 0; 
        
  });
  socket.on('trigger previous flipchart', function() {
    game.flipchart.activeFlipchart--;
    if(game.flipchart.activeFlipchart < 0) game.flipchart.activeFlipchart = game.flipchart.numberOfFlipcharts-1; 

  });

  socket.on('trigger specific flipchart', function(newFlipchart:any) {
    game.flipchart.activeFlipchart = newFlipchart;
  });

  socket.on('show flipchart', function() {
    game.flipchart.active = true;
  });
  socket.on('hide flipchart', function() {
    game.flipchart.active = false;
  });

  socket.on('sync result table', function(clientResultTable:any) {
    log('sync result table');
    game.flipchart.resultTable = clientResultTable;
    io.sockets.emit('new result table', game.flipchart.resultTable);
  });

  socket.on('add Point', function() {
    if(game.timer.startTime != null) game.points++;
    log('points: ' + game.points);
  });

  socket.on('show Points', function() {
    game.showPoints = !game.showPoints;
  });

  socket.on('set gameState', function(newState:number) {
    game.gameState = newState;
    log('set game state: ' + game.gameState);
  });

  socket.on('reset gameState', function(arcadeMode:boolean) {
    game = new Game();
    game.arcadeMode = arcadeMode;
  });

});


// server update loop
setInterval(function() {

  // update game objects
  updateGame();

  //console.log('sync with clients');
  // send state to clients
  //console.log(players);
  io.sockets.emit('state', players, balls, game.timer.getSyncState(), game.flipchart.getSyncState(), game.getSyncState());

}, 1000/60); // / 60


function updateGame(){

  //time
	var now = new Date();
	var time = now.getTime();
	
	timeDiff = time - lastTime;
  lastTime = time;

  //game.updateGame(timeDiff);

  // Timer
  var playedTime; 

  if(game.timer.startTime == null) playedTime = 0;
  else playedTime = time - game.timer.startTime;

  game.timer.playTime = Math.round((game.timer.targetTime - playedTime)/1000);
  
  if(game.timer.playTime <= 0){
    game.timer.playTime = 0;
    game.timer.startTime = null;
    io.sockets.emit('timer ended');
}


  //Player
  for(var id in players){
    //players[id].update(timeDiff);
  }
  for(var id in balls){
    //balls[id].update(timeDiff);
  }

}

function log(text:string){
  if(logToConsole) console.log(text);
}

