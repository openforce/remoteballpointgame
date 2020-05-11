export class PlayerInputState {

    playerId: number;

    w: boolean;
    s: boolean;
    a: boolean;
    d: boolean;

    space: boolean;
    spacePressedTimeStamp: number;

    shift: boolean;
    shiftPressedTimeStamp: number;

    mouseX: number;
    mouseY: number;

    clickedLeft: boolean;
    clickedRight: boolean;

    clickedLeftTimeStemp: number;
    clickedRightTimeStemp: number;
}