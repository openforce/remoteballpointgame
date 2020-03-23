/************************************************
################# CONSTANTS #####################
************************************************/

/************************************************
################# VARIABLES #####################
************************************************/

var buttons:Button[] = [];

/************************************************
################## METHODS ######################
************************************************/


/***********************************
# Init Buttons 
***********************************/
function initButtons(){
	
}



class Button implements ICollidable {

	x:number;
	y:number;
	width:number;
	height:number;

	text:string;

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
			
		if(this.visible && !this.disabled && checkClickOnRectObject(mouseX, mouseY, this)){
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
			
			ctx.fillStyle = "black";
			ctx.font = "bold 10px Arial";
		    ctx.fillText(this.text, this.x + 10, this.y + 15);
		    ctx.stroke();
		    ctx.closePath();
		}
	}
     
}

/***************************************
# update Button
***************************************/
function updateButtons(){

	
}



/***************************************
# draw Buttons
***************************************/
function drawButtons(){
	for (var i = 0; i < buttons.length; i++) {
		if(buttons[i].visible){
			buttons[i].draw();
		}
    }
}


/***********************************
# check if button is clicked
***********************************/
function checkButtonsClick(mouseX:number, mouseY:number) : void{
	
	for (var i = 0; i < buttons.length; i++) {
		
		if(buttons[i].visible && !buttons[i].disabled && checkClickOnRectObject(mouseX, mouseY, buttons[i])){
			buttons[i].click(null);
		}
		
    }
	
}




