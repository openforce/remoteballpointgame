import { SocketListener } from "./SocketListener";
import { Player } from "../static/src/out/gameObjects/Player";
import { PlayerInputState } from "../static/src/gameObjects/syncObjects/PlayerInputState";
import { PlayerState } from "../static/src/out/gameObjects/syncObjects/PlayerState";
import { Ball } from "../static/src/out/gameObjects/Ball";
import { BallState } from "../static/src/out/gameObjects/syncObjects/BallState";
import { IGameRoomList } from "./IGameRoomList";

export class SocketListenerClientMode extends SocketListener {

    log = false;

    constructor(io: any, games: IGameRoomList) {
        super(io, games);
    }

    public init() {

        this.io.on('connection', (function (self) {
            return function (socket: any) {
                if (self.log) console.log('New Socket Connection');

                // connect and disconnect
                socket.on('new player', function (gameRoomId: string, newPlayer: any) {

                    if (self.gameRooms[gameRoomId] == null || self.gameRooms[gameRoomId].game == null) return;

                    self.socketId2Rooms[socket.id] = gameRoomId;
                    socket.join(gameRoomId);

                    self.gameRooms[gameRoomId].game.players[newPlayer.id] = new Player(self.gameRooms[gameRoomId].game, 1, 1, null, null);
                    self.gameRooms[gameRoomId].game.players[newPlayer.id].syncState(newPlayer);
                    self.gameRooms[gameRoomId].game.players[newPlayer.id].socketId = socket.id;

                    self.io.sockets.emit('new result table', self.gameRooms[gameRoomId].game.flipchart.resultTable);

                    if (self.log) console.log('New Player: ' + newPlayer.id);
                });

                socket.on('disconnect', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];

                    for (var id in self.gameRooms[gameRoomId].game.players) {
                        if (self.gameRooms[gameRoomId].game.players[id].socketId == socket.id) {
                            delete self.gameRooms[gameRoomId].game.players[id];
                            delete self.socketId2Rooms[socket.id];
                            break;
                        }
                    }
                    if (self.log) console.log('removed Player with socked id: ' + socket.id);
                });


                socket.on('player sync', function (player: PlayerState) {
                    // update Player state 
                    //console.log('player sync:', player);

                    var gameRoomId = self.socketId2Rooms[socket.id];

                    if (self.gameRooms[gameRoomId].game.players[player.id] != null) self.gameRooms[gameRoomId].game.players[player.id].syncState(player);
                    else {
                        // add existing player (after server restart)
                        self.gameRooms[gameRoomId].game.players[player.id] = new Player(self.gameRooms[gameRoomId].game, 1, 1, null, null);
                        self.gameRooms[gameRoomId].game.players[player.id].syncState(player);
                        self.gameRooms[gameRoomId].game.players[player.id].socketId = socket.id;
                    }

                });

                // BALL action functions
                socket.on('throw ball', function (ball: BallState) {
                    // add Ball to the world
                    //console.log('throw ball:', ball);

                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.balls[ball.id] = new Ball(self.gameRooms[gameRoomId].game, ball.x, ball.y, ball.color);
                    self.gameRooms[gameRoomId].game.balls[ball.id].syncBallState(ball);

                });

                socket.on('take ball', function (ball: BallState) {
                    // remove ball from the world
                    //console.log('take ball:', ball);

                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.gameRooms[gameRoomId].game.balls[ball.id] != null) delete self.gameRooms[gameRoomId].game.balls[ball.id];
                });

                socket.on('sync ball', function (ball: BallState) {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.gameRooms[gameRoomId].game.balls[ball.id] != null) self.gameRooms[gameRoomId].game.balls[ball.id].syncBallState(ball);
                });

                // TIMER
                socket.on('trigger timer', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.gameRooms[gameRoomId].game.timer.startTime == null) {
                        self.gameRooms[gameRoomId].game.timer.startTime = new Date().getTime();
                        if (self.log) console.log('--> start timer');
                    } else {
                        self.gameRooms[gameRoomId].game.timer.startTime = null;
                        self.gameRooms[gameRoomId].game.points = 0;
                        if (self.log) console.log('--> End timer');
                    }
                });

                // Flipchart
                socket.on('trigger flipchart', function (clientLastActivator: number) {
                    //console.log('trigger flipchart', clientLastActivator);
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.flipchart.active = !self.gameRooms[gameRoomId].game.flipchart.active;
                    self.gameRooms[gameRoomId].game.flipchart.lastActivator = clientLastActivator;
                });
                socket.on('trigger next flipchart', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.flipchart.activeFlipchart++;
                    if (self.gameRooms[gameRoomId].game.flipchart.activeFlipchart == self.gameRooms[gameRoomId].game.flipchart.numberOfFlipcharts) self.gameRooms[gameRoomId].game.flipchart.activeFlipchart = 0;
                });
                socket.on('trigger previous flipchart', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.flipchart.activeFlipchart--;
                    if (self.gameRooms[gameRoomId].game.flipchart.activeFlipchart < 0) self.gameRooms[gameRoomId].game.flipchart.activeFlipchart = self.gameRooms[gameRoomId].game.flipchart.numberOfFlipcharts - 1;
                });

                socket.on('trigger specific flipchart', function (newFlipchart: any) {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.flipchart.activeFlipchart = newFlipchart;
                });

                socket.on('show flipchart', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.flipchart.active = true;
                });
                socket.on('hide flipchart', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.flipchart.active = false;
                });

                socket.on('sync result table', function (clientResultTable: any) {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.log) console.log('sync result table');
                    self.gameRooms[gameRoomId].game.flipchart.resultTable = clientResultTable;
                    self.io.sockets.emit('new result table', self.gameRooms[gameRoomId].game.flipchart.resultTable);
                });

                socket.on('add Point', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.gameRooms[gameRoomId].game.timer.startTime != null) self.gameRooms[gameRoomId].game.points++;
                    if (self.log) console.log('points: ' + self.gameRooms[gameRoomId].game.points);
                });

                socket.on('show Points', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.showPoints = !self.gameRooms[gameRoomId].game.showPoints;
                });

                socket.on('set gameState', function (newState: number) {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    self.gameRooms[gameRoomId].game.gameState = newState;
                    if (self.log) console.log('set game state: ' + self.gameRooms[gameRoomId].game.gameState);
                });


            }
        })(this));

    }


}