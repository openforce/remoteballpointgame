import { ICollidableRect, ICollidableCircle } from "../interfaces/ICollidable";

export class TempColliderRect implements ICollidableRect {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

}

export class TempColliderCircle implements ICollidableCircle {
    x: number;
    y: number;
    radius: number

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

}




