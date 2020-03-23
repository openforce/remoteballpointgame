class MenuController {
	
	startButtonX:number = 400;
	startButtonY:number = 540;
	
	startButtonWidth:number = 50;
	startButtonHeight:number = 50;
	
	constructor(){

	}

	public gotoMenu(){
		gameEngine.navigation = nav_menu;
	}
	
	public init(){
		initMenuParameters();
	}
	
	
	public menu(){
		
		// UPDATE 
		
		// space to start
		if (keys[32]) initGame();
		// restart on R
		if (keys[82]) setRandomValues();
		// levels on L
		if (keys[76]) gameEngine.levelMenuController.gotoLevelMenu();
		// scenes on S
		if (keys[83]) gameEngine.sceneMenuController.gotoSceneMenu();
		
		
		//DRAW
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		// Headline
		ctx.fillStyle = "red";
		ctx.font = "bold 50px Arial";
		ctx.fillText(gameName, 100, 100);
		
		drawMenuParameters();
	   
		// Navigation
		ctx.fillText("Press Space to start", 20, 500);
		ctx.fillText("Press R to set random values", 20, 530);
		ctx.fillText("Press L to go to the level screen", 20, 560);
		ctx.fillText("Press S to go to the scene menu", 20, 590);
		
		this.drawStartButton(this.startButtonX, this.startButtonY, this.startButtonWidth, this.startButtonHeight);
	}
	
	
	public afterGame(){
		
		// UPDATE 
		
		// goto menu on m
		if (keys[77]) this.gotoMenu();
		// restart on r
		if (keys[82]) initGame();
		// restart on L
		if (keys[76]) gameEngine.levelMenuController.gotoLevelMenu();
		
		
		// DRAW
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		// Headline
		ctx.fillStyle = "red";
		ctx.font = "bold 50px Arial";
		
		if(mission_done){
			
			ctx.fillText("YOU WON :)", 100, 100);
			drawAfterGameParams();
			
		}else {
			
			ctx.fillText("YOU LOSE :(", 100, 100);
			
			// Loose String
			ctx.fillStyle = "black";
			ctx.font = "bold 20px Arial";
			ctx.fillText(mission_loose_string, 20, 170);
		}
		
		// Navigation
		ctx.fillStyle = "black";
		ctx.font = "bold 20px Arial";
		
		ctx.fillText("Press R to restart", 20, 300);
		ctx.fillText("Press M to return to the menu", 20, 350);
		ctx.fillText("Press L to go to the level menu", 20, 400);
		ctx.fillText("Press S to go to the scene menu", 20, 450);
		
	}
	
	
	public drawStartButton(x:number, y:number, width:number, height:number){
	
		ctx.fillStyle = "black";
		ctx.fillRect(x, y, width, height);
		
		ctx.fillStyle = "green";
		ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
		
		ctx.fillStyle = "black";
		ctx.font = "bold 20px Arial";
		ctx.fillText("GO", x + 10, y + 35);
	}
	
	public checkClick(mouseX:number, mouseY:number){
		
		if(mouseX > this.startButtonX && mouseX < this.startButtonX + this.startButtonWidth 
		   && mouseY > this.startButtonY && mouseY < this.startButtonY + this.startButtonHeight){
			
			initGame()
			return;
		}			
	}

}






