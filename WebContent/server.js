// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');


var app = express();
var server = http.Server(app);
var io = socketIO(server);

var logToConsole = false;

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
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

io.on('connection', function(socket) {
  log('New Socket Connection');
  
  // Player functions
  socket.on('new player', function(newPlayer, newMeetingRoom, newBallBasket) {
    //if(meetingRoom == null) meetingRoom = newMeetingRoom;
    //if(ballBasket == null) ballBasket = newBallBasket;
    
    newPlayer.socketId = socket.id;
    players[newPlayer.id] = newPlayer;

    log('New Player: ' + newPlayer.id);
  });

  socket.on('player sync', function(player) {
    // update Player state 
    //console.log(player);
    players[player.id] = player;
    player.socketId = socket.id;
    //console.log('sync Player: ' + player.id);
  });

  socket.on('disconnect', function() {
    log('remove Player with socked id: ' + socket.id);

    var playerId = null;
    var tempPlayers = {};
    for(var id in players){
      if(players[id].socketId != socket.id) tempPlayers[id] = players[id];
    }
    players = tempPlayers;

    log('Players: ');
    for(var id in players){
      log(players[id].id);
    }
    log('removed Player with socked id: ' + socket.id);
  });

  // Ball action functions
  socket.on('throw ball', function(ball) {
    // add Ball to the world
    log('throw ball: ' + ball.id);
    balls[ball.id] = ball;
    
  });

  socket.on('take ball', function(ball) {
    // remove ball from the world
    
    var tempBalls = {};
    for(var id in balls){
      if(id != ball.id) tempBalls[id] = balls[id];
    }
    balls = tempBalls;

    log('take ball: ' + ball.id);
    
  });
  
  socket.on('sync ball', function(ball) {
    // add Ball to the world
    //console.log('sync ball: ' + ball.id);
    if(balls[ball.id] != null) balls[ball.id] = ball;
  });

});


// server update loop
setInterval(function() {

  // update game objects
  //updateGameObjects();

  //console.log('sync with clients');
  // send state to clients
  //console.log(players);
  io.sockets.emit('state', players, balls);

}, 1000/50); // / 60


function updateGameObjects(){
  //time
	var now = new Date();
	var time = now.getTime();
	
	timeDiff = time - lastTime;
	
	lastTime = time;

  for(var id in players){
    //players[id].update(timeDiff);
  }
  for(var id in balls){
    //balls[id].update(timeDiff);
  }

}

function log(text){
  if(logToConsole) console.log(text);
}

