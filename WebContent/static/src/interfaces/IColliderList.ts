import { TempColliderCircle, TempColliderRect } from "../gameObjectLibrary/TempCollider";

export interface IColliderRectList {
    [details: string]: TempColliderRect;
}

export interface IColliderCircleList {
    [details: string]: TempColliderCircle;
}