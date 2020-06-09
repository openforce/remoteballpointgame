import * as express from 'express';
// @ts-ignore
import * as http from 'http';
// @ts-ignore
import * as path from 'path';
import * as socketIO from 'socket.io';

import { GameConfigs } from './static/src/out/game/Configs';

import { GameEngine } from './static/src/out/engine/GameEngine';
import { Game } from './static/src/out/game/Game';

import { SocketListener } from './serverSrc/SocketListener';
import { SocketListenerClientMode } from './serverSrc/SocketListenerClientMode';
import { SocketListenerServerMode } from './serverSrc/SocketListenerServerMode';
import { GameRoom } from './serverSrc/GameRoom';

var log = false;


// init socket.io 
var app = express();
var server = new http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
// @ts-ignore
app.use('/static', express.static(__dirname + '/static'));

// Routing

// --> use game according to gameId
app.get('/:gameRoomId', function (request: any, response: any) {
  
  var gameRoomId: string = request.params.gameRoomId;
  
  if (gameRoomId != 'favicon.ico' && gameRooms[gameRoomId] == null) {
    
    if (Object.keys(gameRooms).length >= GameConfigs.maxGameRooms) {
      // @ts-ignore
      response.sendFile(path.join(__dirname, 'maxRoomsReached.html'));

      if (log) console.log('max rooms reached ', gameRoomId);
    }else{
      // @ts-ignore
      response.sendFile(path.join(__dirname, 'game.html'));

      gameRooms[gameRoomId] = new GameRoom(gameRoomId, syncMode, io);
      if (log) console.log('created gameRoom with id ', gameRoomId);
    }

  }

});

app.get('/', function (request: any, response: any) {
  //@ts-ignore
  response.sendFile(path.join(__dirname, 'landingpage.html'));
});


server.listen(5000, function () {
  if (log) console.log('Starting server on port 5000');
});


var gameRooms = {};

var syncMode = GameConfigs.syncMode;;

var socketListener: SocketListener;
if (syncMode == GameEngine.SYNC_MODE_CLIENT) socketListener = new SocketListenerClientMode(io, gameRooms);
else if (syncMode == GameEngine.SYNC_MODE_SERVER) socketListener = new SocketListenerServerMode(io, gameRooms);

socketListener.init();


setInterval(function () {
  for (var id in gameRooms) {
    if (gameRooms[id].shouldBeDeleted) {
      delete gameRooms[id];
      console.log('deleted gameRoom ', id);
    }
  }
}, 1000);