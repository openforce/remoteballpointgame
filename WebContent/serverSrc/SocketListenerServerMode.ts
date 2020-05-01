import { SocketListener } from "./SocketListener";
import { Player } from "../static/src/out/gameObjects/Player";
import { PlayerInputState } from "../static/src/gameObjects/syncObjects/PlayerInputState";
import { IGameRoomList } from "./IGameRoomList";

export class SocketListenerServerMode extends SocketListener {

    log = false;

    constructor(io: any, gameRooms: IGameRoomList) {
        super(io, gameRooms);
    }

    public init() {

        this.io.on('connection', (function (self) {
            return function (socket: any) {
                if (self.log) console.log('New Socket Connection');

                // connect and disconnect
                socket.on('new player', function (gameRoomId: string, newPlayer: any) {

                    if (self.games[gameRoomId] == null || self.games[gameRoomId].game == null) return;

                    self.socketId2Rooms[socket.id] = gameRoomId;
                    socket.join(gameRoomId);

                    self.games[gameRoomId].game.players[newPlayer.id] = new Player(self.games[gameRoomId].game, 1, 1, null, null);
                    self.games[gameRoomId].game.players[newPlayer.id].syncState(newPlayer);
                    self.games[gameRoomId].game.players[newPlayer.id].socketId = socket.id;

                    if (self.log) console.log('New Player: ' + newPlayer.id);
                    if (self.log) console.log('Player ', newPlayer.id, ' joined room: ' + gameRoomId);
                });

                socket.on('disconnect', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.games[gameRoomId] == null || self.games[gameRoomId].game == null) return;

                    for (var id in self.games[gameRoomId].game.players) {
                        if (self.games[gameRoomId].game.players[id].socketId == socket.id) {
                            delete self.games[gameRoomId].game.players[id];
                            delete self.socketId2Rooms[socket.id];

                            if (self.log) console.log('removed Player with socked id: ' + socket.id);
                            return;
                        }
                    }

                });


                socket.on('player controles', function (inputState: PlayerInputState) {

                    //console.log('player controles', playerControleState);

                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.games[gameRoomId] == null || self.games[gameRoomId].game == null) return;

                    if (self.games[gameRoomId].game.players[inputState.playerId] != null) {

                        self.games[gameRoomId].game.players[inputState.playerId].inputState = inputState;
                        self.games[gameRoomId].game.players[inputState.playerId].setControlesFromInputState();

                        self.games[gameRoomId].game.flipchart.updateInputsFromPlayerInputState(inputState);

                    }

                    //if (self.log) console.log('synced controles of Player with socked id: ' + socket.id);
                });


                socket.on('sync result table', function (clientResultTable: any) {
                    if (self.log) console.log('sync result table');

                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.games[gameRoomId] == null || self.games[gameRoomId].game == null) return;

                    self.games[gameRoomId].game.flipchart.resultTable = clientResultTable;
                });

            }
        })(this));

    }

}