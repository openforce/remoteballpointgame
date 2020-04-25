import * as express from 'express';
// @ts-ignore
import * as http from 'http';
// @ts-ignore
import * as path from 'path';
import * as socketIO from 'socket.io';

import { GameConfigs } from './static/src/out/game/configs';

import { GameEngine } from './static/src/out/engine/GameEngine';
import { Game } from './static/src/out/game/Game';

import { SocketListener } from './serverSrc/SocketListener';
import { SocketListenerClientMode } from './serverSrc/SocketListenerClientMode';
import { SocketListenerServerMode } from './serverSrc/SocketListenerServerMode';

var log = false;


// init socket.io 
var app = express();
var server = new http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
// @ts-ignore
app.use('/static', express.static(__dirname + '/static'));

// Routing

/* --> use game according to gameId
app.get('/:gameId', function (request: any, response: any) {
  // @ts-ignore
  response.sendFile(path.join(__dirname, 'index.html'));
  //response.send("gameId is set to " + request.params.gameId);
});
*/

app.get('/', function (request: any, response: any) {
  // @ts-ignore
  response.sendFile(path.join(__dirname, 'index.html'));
});


server.listen(5000, function () {
  if (log) console.log('Starting server on port 5000');
});


// init game
var game = new Game();
game.initGameSimulation();

var lastTime = 0;
var timeDiff = 0;


// init sync mode
var syncMode = GameConfigs.syncMode;;

var socketListener: SocketListener;
if (syncMode == GameEngine.SYNC_MODE_CLIENT) socketListener = new SocketListenerClientMode(io, game);
else if (syncMode == GameEngine.SYNC_MODE_SERVER) socketListener = new SocketListenerServerMode(io, game);

socketListener.init();


// main loop
setInterval(function () {

  // update game objects
  updateGame();

  // send all game states to clients
  io.sockets.emit('state', game.getPlayerStateList(), game.getBallStateList(), game.timer.getSyncState(), game.flipchart.getSyncState(), game.getSyncState());

}, 1000 / 60); // / 60


function updateGame() {

  //time
  var now = new Date();
  var time = now.getTime();

  timeDiff = time - lastTime;
  lastTime = time;

  if (syncMode == GameEngine.SYNC_MODE_SERVER) game.updateGame(timeDiff);

}
