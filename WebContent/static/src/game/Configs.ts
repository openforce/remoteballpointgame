import { GameEngine } from "../engine/GameEngine";

export class GameConfigs {

    // SYNC_MODE_CLIENT = 0;
    // SYNC_MODE_SERVER = 1;
    static syncMode = 1;

    static arcadeMode = false;

    static maxGameRooms = 3;
    static emptyRoomDeleteDelay = 40 * 1000;

    static hostPeerJsServer = 0;
    static useProximityChat = 1;
    
}