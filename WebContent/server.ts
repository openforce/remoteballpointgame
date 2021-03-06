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

var log = true;


// init socket.io 
var app = express();
var server = new http.Server(app);
var io = socketIO(server);

var gameRooms = {};

var syncMode = GameConfigs.syncMode;
var socketListener: SocketListener;

app.set('port', 5000);
// @ts-ignore
app.use('/static', express.static(__dirname + '/static'));


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

  if (gameRoomId == 'trainerinstructions') {
    // @ts-ignore
    response.send(trainerinstructionsHTML);
    return;
  }


  if (gameRoomId != 'favicon.ico' && gameRooms[gameRoomId] != null) { // existing room

    // @ts-ignore
    response.send(gameHTML);


  } else if (gameRoomId != 'favicon.ico' && gameRooms[gameRoomId] == null) { // new room

    if (Object.keys(gameRooms).length >= GameConfigs.maxGameRooms) {
      // @ts-ignore
      response.send(maxRoomsReachedHTML);

      if (log) console.log('max rooms reached ', gameRoomId);

    } else {
      gameRooms[gameRoomId] = new GameRoom(gameRoomId, syncMode, io);

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