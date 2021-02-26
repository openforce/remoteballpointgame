import { ICollidableRect } from './ICollidable';

export interface IClickable extends ICollidableRect {

    checkClick(mouseX: number, mouseY: number): void,
    clicked(mouseX: number, mouseY: number): void,
    checkMouseUp(): void

}