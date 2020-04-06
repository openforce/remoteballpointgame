// Navigation 
const nav_menu = 1;
const nav_game = 2;
const nav_after_game = 3;


class GameEngine{

	navigation:number;

	menuController:MenuController;

	constructor(){
		this.navigation = null;

		this.menuController = new MenuController();
	}
	
	public init(){
		
		this.menuController.init();
		this.menuController.gotoMenu();
		
		this.mainLoop();
	}


	public mainLoop(){
		
		switch(gameEngine.navigation) {
		
		case nav_menu:
			gameEngine.menuController.menu();
			break;
		
		case nav_game:
			updateGame();
			break;
		
		case nav_after_game:
			gameEngine.menuController.afterGame();
			break;
		
		default:
			break;
		}	 
		
		requestAnimationFrame(gameEngine.mainLoop);
	}

	
	public checkClickEvents(mouseX:number, mouseY:number){
		
		switch(this.navigation) {
		
		case nav_menu:
			this.menuController.checkClick(mouseX, mouseY);
			break;
			
		case nav_game:
			checkGameClicks(mouseX, mouseY);
			break;
			
		case nav_after_game:
			break;
			
		default:
			break;
		}	 
	}

	public checkRightClickEvents(mouseX:number, mouseY:number){
		
		switch(this.navigation) {
		
		case nav_menu:
			break;
			
		case nav_game:
			checkGameRightClicks(mouseX, mouseY);
			break;
			
		case nav_after_game:
			break;
			
		default:
			break;
		}	 
	}
	

	public checkMouseUpEvents(){
		
		switch(this.navigation) {
		
		case nav_menu:
			break;
			
		case nav_game:
			checkGameMouseUp();
			break;
			
		case nav_after_game:
			break;
			
		default:
			break;
		}	 
	}

	public checkMouseRightUpEvents(){
		
		switch(this.navigation) {
		
		case nav_menu:
			break;
			
		case nav_game:
			checkGameRightMouseUp();
			break;
			
		case nav_after_game:
			break;
			
		default:
			break;
		}	 
	}


}



