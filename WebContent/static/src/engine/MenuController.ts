class MenuController {
	
	startButtonX:number = 50;
	startButtonY:number = 540;
	
	startButtonWidth:number = 70;
	startButtonHeight:number = 55;


	sprites:CanvasImageSource[];

	//Player Selection
	playerSprites:CanvasImageSource[];
	playerSpriteWidth:number = 218;
	playerSpriteHeight:number= 170;
	playerSpriteDrawWidth:number = 70;
	playerSpriteDrawHeight:number = 60;
	
	playerStartX:number = 120;
	playerDistX:number = 100;
	playerY:number = 270;

	playerButtons:Button[];
	
	constructor(){

		this.playerSprites = [];
		this.playerSprites[0] = new Image();
		this.playerSprites[0].src = '/static/resources/person_blue_stand.png';
		this.playerSprites[1] = new Image();
		this.playerSprites[1].src = '/static/resources/person_orange_stand.png';
		this.playerSprites[2] = new Image();
		this.playerSprites[2].src = '/static/resources/person_white_stand.png';
		this.playerSprites[3] = new Image();
		this.playerSprites[3].src = '/static/resources/person_w_blue_stand.png';
		this.playerSprites[4] = new Image();
		this.playerSprites[4].src = '/static/resources/person_w_orange_stand.png';
		this.playerSprites[5] = new Image();
		this.playerSprites[5].src = '/static/resources/person_w_white_stand.png';

		this.playerButtons = [];
		for(var i = 0; i < this.playerSprites.length; i++){
			this.playerButtons[i] = new Button(this.playerStartX + this.playerDistX * i, this.playerY, this.playerSpriteDrawWidth, this.playerSpriteHeight, '');
		}

		this.sprites = [];
		this.sprites[0] = new Image();
		this.sprites[0].src = '/static/resources/titlescreen.png';
		this.sprites[1] = new Image();
		this.sprites[1].src = '/static/resources/chooseplayer.png';
		this.sprites[2] = new Image();
		this.sprites[2].src = '/static/resources/controlestitle.png';
	}

	public gotoMenu(){
		gameEngine.navigation = nav_menu;
	}
	
	public init(){
		//initMenuParameters();
	}
	
	
	public menu(){
		
		// UPDATE 
		
		
		// space to start
		if (keys[32]) initGame(null);
		// restart on R
		//if (keys[82]) setRandomValues();
		// levels on L
		//if (keys[76]) gameEngine.levelMenuController.gotoLevelMenu();
		// scenes on S
		//if (keys[83]) gameEngine.sceneMenuController.gotoSceneMenu();
		
		
		//DRAW
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		
		//ctx.fillText("Press R to set random values", 20, 530);
		//ctx.fillText("Press L to go to the level screen", 20, 560);
		//ctx.fillText("Press S to go to the scene menu", 20, 590);
		

		// Title Screen
		ctx.drawImage(this.sprites[0],
			0, 0, 800, 600, // sprite cutout position and size
			0, 0, 800, 600); 	 // draw position and size

		ctx.drawImage(this.sprites[1],
			0, 0, 800, 600, // sprite cutout position and size
			0, 0, 800, 600); 	 // draw position and size

		ctx.drawImage(this.sprites[2],
			0, 0, 1974, 2400, // sprite cutout position and size
			150, 350, 1974/4, 2400/4); 	 // draw position and size
			
		// Players
		for(var i = 0; i < this.playerSprites.length; i++){
			ctx.drawImage(this.playerSprites[i],
				0, 0, this.playerSpriteWidth, this.playerSpriteHeight, // sprite cutout position and size
				this.playerStartX + this.playerDistX * i, this.playerY, this.playerSpriteDrawWidth, this.playerSpriteDrawHeight); 	 // draw position and size	
		}

	}
	
	
	public afterGame(){
		
		// UPDATE 
		
		// goto menu on m
		if (keys[77]) this.gotoMenu();
		// restart on r
		if (keys[82]) initGame(null);
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
	

	public checkClick(mouseX:number, mouseY:number){
		
		if(this.playerButtons[0].checkForClick(mouseX, mouseY)) initGame('blue');
		else if(this.playerButtons[1].checkForClick(mouseX, mouseY)) initGame('orange');
		else if(this.playerButtons[2].checkForClick(mouseX, mouseY)) initGame('white');
		else if(this.playerButtons[3].checkForClick(mouseX, mouseY)) initGame('blue');
		else if(this.playerButtons[4].checkForClick(mouseX, mouseY)) initGame('orange');
		else if(this.playerButtons[5].checkForClick(mouseX, mouseY)) initGame('white');

	}

}






