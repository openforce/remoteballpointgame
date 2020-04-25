import { SocketListener } from "./SocketListener";
import { Game } from "../static/src/out/game/Game";
import { Player } from "../static/src/out/gameObjects/Player";
import { PlayerInputState } from "../static/src/gameObjects/syncObjects/PlayerInputState";
import { PlayerState } from "../static/src/out/gameObjects/syncObjects/PlayerState";
import { Ball } from "../static/src/out/gameObjects/Ball";
import { BallState } from "../static/src/out/gameObjects/syncObjects/BallState";

export class SocketListenerClientMode extends SocketListener {

    log = false;

    constructor(io: any, game: Game) {
        super(io, game);
    }

    public init() {

        this.io.on('connection', (function (self) {
            return function (socket: any) {
                if (self.log) console.log('New Socket Connection');

                // connect and disconnect
                socket.on('new player', function (newPlayer: any) {

                    self.game.players[newPlayer.id] = new Player(self.game, 1, 1, null, null);
                    self.game.players[newPlayer.id].syncState(newPlayer);
                    self.game.players[newPlayer.id].socketId = socket.id;

                    self.io.sockets.emit('new result table', self.game.flipchart.resultTable);

                    if (self.log) console.log('New Player: ' + newPlayer.id);
                });

                socket.on('disconnect', function () {
                    for (var id in self.game.players) {
                        if (self.game.players[id].socketId == socket.id) {
                            delete self.game.players[id];
                            break;
                        }
                    }
                    if (self.log) console.log('removed Player with socked id: ' + socket.id);
                });


                socket.on('player sync', function (player: PlayerState) {
                    // update Player state 
                    //console.log('player sync:', player);

                    if (self.game.players[player.id] != null) self.game.players[player.id].syncState(player);
                    else {
                        // add existing player (after server restart)
                        self.game.players[player.id] = new Player(self.game, 1, 1, null, null);
                        self.game.players[player.id].syncState(player);
                        self.game.players[player.id].socketId = socket.id;
                    }

                });

                // BALL action functions
                socket.on('throw ball', function (ball: BallState) {
                    // add Ball to the world
                    //console.log('throw ball:', ball);

                    self.game.balls[ball.id] = new Ball(self.game, ball.x, ball.y, ball.color);
                    self.game.balls[ball.id].syncBallState(ball);

                });

                socket.on('take ball', function (ball: BallState) {
                    // remove ball from the world
                    //console.log('take ball:', ball);

                    if (self.game.balls[ball.id] != null) delete self.game.balls[ball.id];
                });

                socket.on('sync ball', function (ball: BallState) {
                    if (self.game.balls[ball.id] != null) self.game.balls[ball.id].syncBallState(ball);
                });

                // TIMER
                socket.on('trigger timer', function () {

                    if (self.game.timer.startTime == null) {
                        self.game.timer.startTime = new Date().getTime();
                        if (self.log) console.log('--> start timer');
                    } else {
                        self.game.timer.startTime = null;
                        self.game.points = 0;
                        if (self.log) console.log('--> End timer');
                    }
                });

                // Flipchart
                socket.on('trigger flipchart', function (clientLastActivator: number) {
                    //console.log('trigger flipchart', clientLastActivator);

                    self.game.flipchart.active = !self.game.flipchart.active;
                    self.game.flipchart.lastActivator = clientLastActivator;
                });
                socket.on('trigger next flipchart', function () {
                    self.game.flipchart.activeFlipchart++;
                    if (self.game.flipchart.activeFlipchart == self.game.flipchart.numberOfFlipcharts) self.game.flipchart.activeFlipchart = 0;
                });
                socket.on('trigger previous flipchart', function () {
                    self.game.flipchart.activeFlipchart--;
                    if (self.game.flipchart.activeFlipchart < 0) self.game.flipchart.activeFlipchart = self.game.flipchart.numberOfFlipcharts - 1;
                });

                socket.on('trigger specific flipchart', function (newFlipchart: any) {
                    self.game.flipchart.activeFlipchart = newFlipchart;
                });

                socket.on('show flipchart', function () {
                    self.game.flipchart.active = true;
                });
                socket.on('hide flipchart', function () {
                    self.game.flipchart.active = false;
                });

                socket.on('sync result table', function (clientResultTable: any) {
                    if (self.log) console.log('sync result table');
                    self.game.flipchart.resultTable = clientResultTable;
                    self.io.sockets.emit('new result table', self.game.flipchart.resultTable);
                });

                socket.on('add Point', function () {
                    if (self.game.timer.startTime != null) self.game.points++;
                    if (self.log) console.log('points: ' + self.game.points);
                });

                socket.on('show Points', function () {
                    self.game.showPoints = !self.game.showPoints;
                });

                socket.on('set gameState', function (newState: number) {
                    self.game.gameState = newState;
                    if (self.log) console.log('set game state: ' + self.game.gameState);
                });


            }
        })(this));

    }


}