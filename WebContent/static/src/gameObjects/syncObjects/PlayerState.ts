export class PlayerState {

    id: number;
    socketId: string;

    x: number;
    y: number;
    middleX: number;
    middleY: number;

    rotation: number;

    name: string;
    color: string;
    gender: string;

    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;

    lookX: number;
    lookY: number;

    rightHand: string;
    leftHand: string;

    walkAnimationCount: number;


}