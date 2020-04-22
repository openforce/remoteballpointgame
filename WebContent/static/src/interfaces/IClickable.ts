import { ICollidable } from './ICollidable';

export interface IClickable extends ICollidable {

    checkClick(mouseX:number, mouseY:number) : void, 
    clicked(mouseX:number, mouseY:number) : void,
    checkMouseUp() : void

}