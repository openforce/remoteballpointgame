import { Ball } from "../gameObjects/Ball";
import { BallState } from "../gameObjects/syncObjects/BallState";

export interface IBallList {
    [details: number]: Ball;
}

export interface IBallStateList {
    [details: number]: BallState;
} 