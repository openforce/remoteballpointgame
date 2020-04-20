export class BallState {

    id:number;

    x:number;
    y:number;

    lastX:number;
    lastY:number;

    color:string;

    speedX:number;
    speedY:number;

    state:number;
    lastState:number;

    lastSyncState:number;

    lastHolderId:number;
    touchedBy:number[];
    
}