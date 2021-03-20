import * as express from 'express';
// @ts-ignore
import * as http from 'http';
// @ts-ignore
import * as path from 'path';
import * as socketIO from 'socket.io';

import { GameConfigs } from './static/src/out/game/Configs';

import { SocketListener } from './serverSrc/SocketListener';
import { SocketListenerServerMode } from './serverSrc/SocketListenerServerMode';
import { GameRoom } from './serverSrc/GameRoom';
import { ServerStatistics } from './serverSrc/ServerStatistics';


var log = false;


// init socket.io 
var app = express();
var server = new http.Server(app);
var io = socketIO(server);


var gameRooms = {};
var serverStatistics = new ServerStatistics();

var socketListener: SocketListener;

app.set('port', 5000);

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/favicon.ico'));

// @ts-ignore
app.use('/static', express.static(__dirname + '/static'));


// init peer server
if(GameConfigs.hostPeerJsServer == 1){
  var appForPeers = express();
  var serverForPeers = appForPeers.listen(5001)
  appForPeers.use('/peerjs', require('peer').ExpressPeerServer(serverForPeers, {
    debug: true
  }));
}

// @ts-ignore
var analyticsKey = process.env.ANALYTICS_KEY;
if(analyticsKey == null) analyticsKey = '';
if (log) console.log('Environment Variable ANALYTICS_KEY: ' + analyticsKey);


// @ts-ignore
var fs = require('fs')
// @ts-ignore
var landingpageHTML = fs.readFileSync(__dirname + '/landingpage.html', 'utf8');
landingpageHTML = landingpageHTML.replace('<$ANALYTICS_KEY>', analyticsKey);
// @ts-ignore
var trainerinstructionsHTML = fs.readFileSync(__dirname + '/trainerinstructions.html', 'utf8');
trainerinstructionsHTML = trainerinstructionsHTML.replace('<$ANALYTICS_KEY>', analyticsKey);
// @ts-ignore
var gameHTML = fs.readFileSync(__dirname + '/game.html', 'utf8');
gameHTML = gameHTML.replace('<$ANALYTICS_KEY>', analyticsKey);
// @ts-ignore
var maxRoomsReachedHTML = fs.readFileSync(__dirname + '/maxRoomsReached.html', 'utf8');
maxRoomsReachedHTML = maxRoomsReachedHTML.replace('<$ANALYTICS_KEY>', analyticsKey);


// Routing

// --> use game according to gameId
app.get('/:gameRoomId', function (request: any, response: any) {

  var gameRoomId: string = request.params.gameRoomId;

  console.log('gameRoomId: ', gameRoomId)
  
  // get roomId without parameters
  if(gameRoomId.includes('?')){
    gameRoomId = gameRoomId.split('?')[0];
    console.log('gameRoomId after split: ', gameRoomId)
  }
  

  // proximity Chat option... should the server or the client handle this? :think:
  var proximityChatParameter = request.query.useProximityChat;
  if (log) console.log('proximityChatParameter', proximityChatParameter);

  
  if (gameRoomId == 'trainerinstructions') {
    // @ts-ignore
    response.send(trainerinstructionsHTML);
    return;
  }


  if (gameRoomId == 'favicon.ico' ) { // favicon

    // @ts-ignore
    response.send('/favicon.ico');


  } else if (gameRooms[gameRoomId] != null) { // existing room

    // @ts-ignore
    response.send(gameHTML);


  } else if (gameRooms[gameRoomId] == null) { // new room

    if (Object.keys(gameRooms).length >= GameConfigs.maxGameRooms) {
      // @ts-ignore
      response.send(maxRoomsReachedHTML);

      serverStatistics.numberOfRoomLimitReached++;

      if (log) console.log('max rooms reached ', gameRoomId);

    } else {
      gameRooms[gameRoomId] = new GameRoom(gameRoomId, io);
      
      serverStatistics.numberOfRoomsCreated++;

      // @ts-ignore
      response.send(gameHTML);

      if (log) console.log('created gameRoom with id ', gameRoomId);
    }

  }

});

app.get('/', function (request: any, response: any) {
  //@ts-ignore
  response.send(landingpageHTML);
});


server.listen(5000, function () {
  if (log) console.log('Starting server on port 5000');
});


socketListener = new SocketListenerServerMode(io, gameRooms);
socketListener.init();


setInterval(function () {
  for (var id in gameRooms) {
    if (gameRooms[id].shouldBeDeleted) {
      delete gameRooms[id];
      console.log('deleted gameRoom ', id);

      serverStatistics.logStatics();
    }
  }
}, 1000);