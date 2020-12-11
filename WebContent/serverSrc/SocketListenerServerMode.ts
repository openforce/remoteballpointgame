import { SocketListener } from "./SocketListener";
import { Player } from "../static/src/out/gameObjects/Player";
import { PlayerInputState } from "../static/src/gameObjects/syncObjects/PlayerInputState";
import { IGameRoomList } from "./IGameRoomList";
import { GameConfigs } from "../static/src/out/game/Configs";
import { GameRoom } from "./GameRoom";

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

                    // fallback if room was closed while player was on title or after server restart...
                    if (self.gameRooms[gameRoomId] == null || self.gameRooms[gameRoomId].game == null) {

                        // TODO: with this hack its possible to create more rooms then intended!! But its a fallback ;)
                        self.gameRooms[gameRoomId] = new GameRoom(gameRoomId, self.io);

                        console.log('fallback: created gameRoom with id ', gameRoomId);
                    }

                    self.socketId2Rooms[socket.id] = gameRoomId;
                    socket.join(gameRoomId);

                    self.gameRooms[gameRoomId].game.players[newPlayer.id] = new Player(self.gameRooms[gameRoomId].game, 1, 1, null, null);
                    self.gameRooms[gameRoomId].game.players[newPlayer.id].syncState(newPlayer);
                    self.gameRooms[gameRoomId].game.players[newPlayer.id].socketId = socket.id;

                    if (self.log) console.log('New Player: ' + newPlayer.id);
                    if (self.log) console.log('Player ', newPlayer.id, ' joined room: ' + gameRoomId);
                });

                socket.on('disconnect', function () {
                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.gameRooms[gameRoomId] == null || self.gameRooms[gameRoomId].game == null) return;

                    for (var id in self.gameRooms[gameRoomId].game.players) {
                        if (self.gameRooms[gameRoomId].game.players[id].socketId == socket.id) {
                            delete self.gameRooms[gameRoomId].game.players[id];
                            delete self.socketId2Rooms[socket.id];

                            if (self.log) console.log('removed Player with socked id: ' + socket.id);
                            return;
                        }
                    }

                });


                socket.on('player controles', function (inputState: PlayerInputState) {

                    //console.log('player controles', playerControleState);

                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.gameRooms[gameRoomId] == null || self.gameRooms[gameRoomId].game == null) return;

                    if (self.gameRooms[gameRoomId].game.players[inputState.playerId] != null) {

                        self.gameRooms[gameRoomId].game.players[inputState.playerId].inputState = inputState;
                        self.gameRooms[gameRoomId].game.players[inputState.playerId].setControlesFromInputState();

                        self.gameRooms[gameRoomId].game.flipchart.updateInputsFromPlayerInputState(inputState);

                    }

                    //if (self.log) console.log('synced controles of Player with socked id: ' + socket.id);
                });


                socket.on('sync result table', function (clientResultTable: any) {
                    if (self.log) console.log('sync result table');

                    var gameRoomId = self.socketId2Rooms[socket.id];
                    if (self.gameRooms[gameRoomId] == null || self.gameRooms[gameRoomId].game == null) return;

                    self.gameRooms[gameRoomId].game.flipchart.resultTable = clientResultTable;
                });

            }
        })(this));

    }

}