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

    // controle mode mouse
    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;

    //controle mode keyboard
    moveForward: boolean;
    moveBackward: boolean;
    rotateLeft: boolean;
    rotateRight: boolean;

    lookX: number;
    lookY: number;

    rightHand: string;
    leftHand: string;

    walkAnimationCount: number;

    leaveRoom: boolean;

}