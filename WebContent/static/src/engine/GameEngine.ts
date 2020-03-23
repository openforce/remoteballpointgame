// Navigation 
const nav_menu = 1;
const nav_game = 2;
const nav_after_game = 3;
const nav_level_menu = 4;
const nav_scene_menu = 5;
const nav_scene = 6;


class GameEngine{

	navigation:number;

	menuController:MenuController;
	levelMenuController:LevelMenuController;
	sceneMenuController:SceneMenuController;

	constructor(){
		this.navigation = null;

		this.menuController = new MenuController();
		this.levelMenuController = new LevelMenuController();
		this.sceneMenuController = new SceneMenuController();
	}
	
	public init(){
		
		this.menuController.init();
		this.levelMenuController.init();
		this.sceneMenuController.init();
		
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
		
		case nav_level_menu:
			gameEngine.levelMenuController.levelMenu();
			break;
		
		case nav_scene_menu:
			gameEngine.sceneMenuController.sceneMenu();
			break;
		
		case nav_scene:
			//scene();
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
			
		case nav_level_menu:
			this.levelMenuController.checkClick(mouseX, mouseY);
			break;
			
		case nav_scene_menu:
			this.sceneMenuController.checkClick(mouseX, mouseY);
			break;
			
		case nav_scene:
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
			
		case nav_level_menu:
			break;
			
		case nav_scene_menu:
			break;
			
		case nav_scene:
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
			
		case nav_level_menu:
			break;
			
		case nav_scene_menu:
			break;
			
		case nav_scene:
			break;
			
		default:
			break;
		}	 
	}


}



