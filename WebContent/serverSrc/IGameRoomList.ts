import { GameRoom } from "./GameRoom";

export interface IGameRoomList {
    [details: string]: GameRoom;
}

export interface IGameRoomSocketList {
    [details: string]: string;
}