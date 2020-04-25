export class Inputs {

    keys: boolean[];

    mousePosX: number;
    mousePosY: number;

    clickedLeft: boolean = false;
    clickedRight: boolean = false;

    clickedLeftTimeStemp = 0;
    clickedRightTimeStemp = 0;

    constructor() {
        this.keys = [];
    }
}