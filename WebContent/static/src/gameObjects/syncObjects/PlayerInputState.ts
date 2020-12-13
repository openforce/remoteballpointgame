export class PlayerInputState {

    playerId: number;

    keys: boolean[];

    w: boolean;
    s: boolean;
    a: boolean;
    d: boolean;

    f: boolean;
    fPressedTimestamp: number;

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