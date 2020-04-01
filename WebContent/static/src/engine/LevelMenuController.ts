class LevelMenuController{

	level_chosen:number;
	level_text:string;
	
	levels:Level[];
	
	constructor(){

	}

	public gotoLevelMenu(){
		gameEngine.navigation = nav_level_menu;
		this.level_chosen = null;
	}
	
	public init(){
		//navigation = nav_level_menu;
		this.level_chosen = null;
		
		this.levels = [];
		
		LevelController.initLevels();
	}
	
	public levelMenu(){
	
		// UPDATE
		
		// space to start
		if(this.level_chosen > 0) if (keys[32]) initGame(null, null);
		// goto menu on m
		if (keys[77]) gameEngine.menuController.gotoMenu();
		// delete cookies with d
		if (keys[68]) this.deleteAllStats();
		
		
		// DRAW
		
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		// Headline
		ctx.fillStyle = "red";
		ctx.font = "bold 50px Arial";
		ctx.fillText("LEVELS", 100, 100);
		
		// draw levels
		this.drawAllLevelIcons();
		
		// draw level Text
		ctx.fillStyle = "black";
		ctx.font = "bold 20px Arial";
		
		if(this.level_chosen > 0){ 
			ctx.fillText(this.levels[this.level_chosen-1].text, 20, 250);
			
			// Navigation
			ctx.fillStyle = "black";
			ctx.font = "bold 20px Arial";
			
			ctx.fillText("Press Space to start level", 20, 350);
		}
		
		// Navigation
		ctx.fillStyle = "black";
		ctx.font = "bold 20px Arial";
		
		ctx.fillText("Press M to return to the menu", 20, 400);
		ctx.fillText("Press D to delete stats", 20, 450);
	}
	
	public checkClick(mouseX:number, mouseY:number){
		// loop all levels
		for (var i = 0; i < this.levels.length; i++) {
			var level = this.levels[i];
			if(mouseX > level.x && mouseX < level.x + 50 
			   && mouseY > level.y && mouseY < level.y + 50){
				
				this.level_chosen = level.number;
				return;
				
			}			
		}
	}
	
	
	public drawAllLevelIcons(){
		// loop all levels
		for (var i = 0; i < this.levels.length; i++) {
			this.drawLevelIcon(this.levels[i]); 
		}
	}
	
	public drawLevelIcon(level:Level){
	
		if(this.level_chosen == level.number) ctx.fillStyle = "lime";
		else ctx.fillStyle = "black";
		
		ctx.fillRect(level.x, level.y, 50, 50);
		
		if(level.won) ctx.fillStyle = "green";
		else ctx.fillStyle = "red";
		
		ctx.fillRect(level.x + 5, level.y + 5, 40, 40);
		
		ctx.fillStyle = "black";
		ctx.font = "bold 30px Arial";
		ctx.fillText(String(level.number), level.x + 15, level.y + 35);
	}
	
	
	
	
	public loadLevelStats(){
		// loop levels and get stats
		for (var i = 0; i < this.levels.length; i++) {
			var level = this.levels[i];
			var levelCookie = getCookie("level_" + level.number);
			
			if(levelCookie == "won") level.won = true;
		}
	}
	
	public wonLevel(){
		if(this.level_chosen > 0 && mission_done){
			this.levels[this.level_chosen-1].won = true;
			this.saveLevel();
		}
	}
	
	public saveLevel(){
		setCookie("level_"+this.level_chosen, "won");
	}
	
	public deleteAllStats(){
		// loop levels and get stats
		for (var i = 0; i < this.levels.length; i++) {
			var level = this.levels[i];
			deleteCookie("level_" + level.number);
		}
		this.init();
	}
	
}
