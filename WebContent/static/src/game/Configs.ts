import { GameEngine } from "../engine/GameEngine";

export class GameConfigs {

    // SYNC_MODE_CLIENT = 0;
    // SYNC_MODE_SERVER = 1;
    static syncMode = 1;

    static arcadeMode = false;

    static maxGameRooms = 3;
    static emptyRoomDeleteDelay = 60 * 1000;

    // CONTROLE_MODE_MOUSE = 0;
    // CONTROLE_MODE_KEYBOARD = 1;
    static playerControleMode = 0;
}