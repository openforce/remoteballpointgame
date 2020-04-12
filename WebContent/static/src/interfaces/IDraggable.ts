import {IClickable} from './IClickable.js';

export interface IDraggable extends IClickable {
    drag : boolean,
	dragX : number,
	dragY : number,
	lastMouseX : number,
    lastMouseY : number,
    
    startDrag(mouseX:number, mouseY:number) : void,
    stopDrag() : void,
    checkDraggedTo() : void,
    updateDragPosition(mouseX:number, mouseY:number) : void
}