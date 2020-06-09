import { IGameRoomList, IGameRoomSocketList } from "./IGameRoomList";

export class SocketListener {

    io: any;

    gameRooms: IGameRoomList;
    socketId2Rooms: IGameRoomSocketList;


    constructor(io: any, games: IGameRoomList) {

        this.io = io;
        this.gameRooms = games;

        this.socketId2Rooms = {};

    }


    public init() {
        console.log('You should extend this class!');
    }


}