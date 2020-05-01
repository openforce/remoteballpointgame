import { IGameRoomList, IGameRoomSocketList } from "./IGameRoomList";

export class SocketListener {

    io: any;

    games: IGameRoomList;
    socketId2Rooms: IGameRoomSocketList;


    constructor(io: any, games: IGameRoomList) {

        this.io = io;
        this.games = games;

        this.socketId2Rooms = {};

    }


    public init() {
        console.log('You should extend this class!');
    }


}