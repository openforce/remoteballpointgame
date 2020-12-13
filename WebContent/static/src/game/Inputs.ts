export class Inputs {

    keys: boolean[];
    keysPressedTimeStamp: number[];

    mousePosX: number;
    mousePosY: number;

    clickedLeft: boolean = false;
    clickedLeftTimeStemp = 0;
    
    clickedRightTimeStemp = 0;
    clickedRight: boolean = false;

    constructor() {
        this.keys = [];
        this.keysPressedTimeStamp = [];
    }
}