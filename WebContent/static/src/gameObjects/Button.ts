class Button implements ICollidable {

	x:number;
	y:number;
	width:number;
	height:number;

	text:string;

	textColor:string = 'black';
	textFont:string = 'bold 10px Arial';

	visible:boolean;
	disabled:boolean;
	
	constructor(x:number, y:number, width:number, height:number, text:string) {
	
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
			ctx.beginPath();
			ctx.fillStyle = "black";
		    ctx.fillRect(this.x, this.y, this.width, this.height);
			
		    if(this.disabled) ctx.fillStyle = "grey";
			else ctx.fillStyle = "lightgrey";
			
		    ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
			
			ctx.fillStyle = this.textColor;
			ctx.font = this.textFont;
		    ctx.fillText(this.text, this.x + 10, this.y + 15);
		    ctx.stroke();
		    ctx.closePath();
		}
	}
     
}




