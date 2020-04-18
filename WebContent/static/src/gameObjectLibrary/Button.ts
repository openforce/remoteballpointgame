import {ICollidable} from '../interfaces/ICollidable.js';
import {ClickUtils} from '../utils/ClickUtils1.js';

export class Button implements ICollidable {

	x:number;
	y:number;
	width:number;
	height:number;

	text:string;

	textColor:string = 'black';
	textFont:string = 'bold 10px Arial';

	visible:boolean;
	disabled:boolean;

	ctx:CanvasRenderingContext2D;
	
	constructor(ctx:CanvasRenderingContext2D, x:number, y:number, width:number, height:number, text:string) {
	
		this.ctx = ctx;

		this.text = text;
		
		this.x = x;
		this.y = y;
		
		this.width = width;
		this.height = height;
		
		this.visible = true;
		this.disabled = false;
	}

	click(object : object) : void {

	};
	
	show(){
		this.visible = true;
	};
	
    hide(){
    	this.visible = false;
	};
	
	disable(){
		this.disabled = true;
	};
	
    enable(){
    	this.disabled = false;
	};
	
	checkForClick(mouseX:number, mouseY:number) : boolean {

		if(this.visible && !this.disabled && ClickUtils.checkClickOnRectObject(mouseX, mouseY, this)){
			return true;
		}
		
	};
	
	draw(){
		if(this.visible){
			
			this.ctx.beginPath();
			this.ctx.fillStyle = "black";
		    this.ctx.fillRect(this.x, this.y, this.width, this.height);
			
		    if(this.disabled) this.ctx.fillStyle = "grey";
			else this.ctx.fillStyle = "lightgrey";
			
		    this.ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
			
			this.ctx.fillStyle = this.textColor;
			this.ctx.font = this.textFont;
		    this.ctx.fillText(this.text, this.x + 10, this.y + 15);
		    this.ctx.stroke();
		    this.ctx.closePath();
		}
	}
     
}




