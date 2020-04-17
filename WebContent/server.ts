// Dependencies

import * as express from 'express';
// @ts-ignore
import * as http from 'http';
// @ts-ignore
import * as path from 'path';
import * as socketIO from 'socket.io';

//import {Flipchart} from './static/src/gameObjects/Flipchart';


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


// Setup game
//var meetingRoom = null;
//var ballBasket = null;

var players = {};
var balls = {};

// TIME Parameters
var lastTime = 0;
var timeDiff = 0;

var timer = {
  targetTime: 120 * 1000, //2 Minuten --> 120
  // @ts-ignore
  startTime : null,
  playTime: 120
};

var gameState = {
  state: 0,
  points: 0,
  showPoints: false,
  arcadeMode: false
}

//var flipchart:Flipchart = new Flipchart(null, 0, 0);

//*
var flipchart = {
  active: false,
  activeFlipchart: 0,
  // @ts-ignore
  lastActivator: null,
  numberOfFlipcharts: 4
}; //*/

var resultTable:any;
initResultTable();

function initResultTable(){
  resultTable = {
    round1: {
        estimation: '',
        result: '',
        bugs: ''
    },
    round2: {
        estimation: '',
        result: '',
        bugs: ''
    },
    round3: {
        estimation: '',
        result: '',
        bugs: ''
    },
    round4: {
        estimation: '',
        result: '',
        bugs: ''
    },
    round5: {
        estimation: '',
        result: '',
        bugs: ''
    },
  };
}

io.on('connection', function(socket:any) {
  log('New Socket Connection');
  
  // Player functions
  socket.on('new player', function(newPlayer:any) {
    
    newPlayer.socketId = socket.id;
    // @ts-ignore
    players[newPlayer.id] = newPlayer;

    io.sockets.emit('new result table', resultTable);

    log('New Player: ' + newPlayer.id);
  });

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
    if(timer.startTime == null){
      timer.startTime = new Date().getTime();
    }else{
      timer.startTime = null;
      gameState.points = 0;
    }
  });

  // Flipchart
  socket.on('trigger flipchart', function(clientLastActivator:number) {
    flipchart.active = !flipchart.active;
    flipchart.lastActivator = clientLastActivator;
  });
  socket.on('trigger next flipchart', function() {
    flipchart.activeFlipchart++;
    if(flipchart.activeFlipchart == flipchart.numberOfFlipcharts) flipchart.activeFlipchart = 0; 
        
  });
  socket.on('trigger previous flipchart', function() {
    flipchart.activeFlipchart--;
    if(flipchart.activeFlipchart < 0) flipchart.activeFlipchart = flipchart.numberOfFlipcharts-1; 

  });

  socket.on('trigger specific flipchart', function(newFlipchart:any) {
    flipchart.activeFlipchart = newFlipchart;
  });

  socket.on('show flipchart', function() {
    flipchart.active = true;
  });
  socket.on('hide flipchart', function() {
    flipchart.active = false;
  });

  socket.on('sync result table', function(clientResultTable:any) {
    log('sync result table');
    resultTable = clientResultTable;
    io.sockets.emit('new result table', resultTable);
  });

  socket.on('add Point', function() {
    if(timer.startTime != null) gameState.points++;
    log('points: ' + gameState.points);
  });

  socket.on('show Points', function() {
    gameState.showPoints = !gameState.showPoints;
  });

  socket.on('set gameState', function(newState:number) {
    gameState.state = newState;
    log('set game state: ' + gameState.state);
  });

  socket.on('reset gameState', function(arcadeMode:boolean) {
    gameState = {
      state: 0,
      points: 0,
      showPoints: false,
      arcadeMode: arcadeMode
    };
    flipchart.activeFlipchart = 0;
    flipchart.active = false;

    balls = [];
    initResultTable();
  });

});


// server update loop
setInterval(function() {

  // update game objects
  updateGameObjects();

  //console.log('sync with clients');
  // send state to clients
  //console.log(players);
  io.sockets.emit('state', players, balls, timer, flipchart, gameState);

}, 1000/60); // / 60


function updateGameObjects(){
  //time
	var now = new Date();
	var time = now.getTime();
	
	timeDiff = time - lastTime;
  lastTime = time;

  
  // Timer
  var playedTime; 

  if(timer.startTime == null) playedTime = 0;
  else playedTime = time - timer.startTime;

  timer.playTime = Math.round((timer.targetTime - playedTime)/1000);
  
  if(timer.playTime <= 0){
    timer.playTime = 0;
    timer.startTime = null;
    log('timer ended');
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

