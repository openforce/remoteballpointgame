import { SocketListener } from "./SocketListener";
import { Game } from "../static/src/out/game/Game";
import { Player } from "../static/src/out/gameObjects/Player";
import { PlayerInputState } from "../static/src/gameObjects/syncObjects/PlayerInputState";

export class SocketListenerServerMode extends SocketListener {

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


                socket.on('player controles', function (inputState: PlayerInputState) {

                    //console.log('player controles', playerControleState);

                    if (self.game.players[inputState.playerId] != null) {

                        self.game.players[inputState.playerId].inputState = inputState;
                        self.game.players[inputState.playerId].setControlesFromInputState();

                        self.game.flipchart.updateInputsFromPlayerInputState(inputState);

                    }

                    if (self.log) console.log('synced controles of Player with socked id: ' + socket.id);
                });


                socket.on('sync result table', function (clientResultTable: any) {
                    if (self.log) console.log('sync result table');
                    self.game.flipchart.resultTable = clientResultTable;
                });

            }
        })(this));

    }

}