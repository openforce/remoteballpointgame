import { Player } from "../gameObjects/Player";
import { PlayerState } from "../gameObjects/syncObjects/PlayerState";

export interface IPlayerList {
    [details: number]: Player;
}

export interface IPlayerStateList {
    [details: number]: PlayerState;
} 