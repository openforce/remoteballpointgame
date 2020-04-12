import {Game} from '../game/Game.js';
import {MenuController} from './MenuController.js';


export class GameEngine{
	
	// Navigation 
	static nav_menu = 1;
	static nav_game = 2;
	static nav_after_game = 3;

	static CANVAS_WIDTH = 800;
    static CANVAS_HEIGHT = 600;

	navigation:number;

	keys:boolean[];
	
	mousePosX:number;
	mousePosY:number;

	menuController:MenuController;
	game:Game;
	
	canvas:HTMLCanvasElement;
	ctx:CanvasRenderingContext2D;

	constructor(canvas:HTMLCanvasElement){
		
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		
		this.navigation = GameEngine.nav_menu;
		this.keys = [];

		this.menuController = new MenuController(this);
		this.game = new Game(this);
	}
	
	public init(){
		this.menuController.init();
		this.menuController.gotoMenu();
	}


	public mainLoop(){
		
		switch(this.navigation) {
		
		case GameEngine.nav_menu:
			this.menuController.menu();
			break;
		
		case GameEngine.nav_game:
			this.game.updateGame();
			break;
		
		case GameEngine.nav_after_game:
			this.menuController.afterGame();
			break;
		
		default:
			break;
		}	 

	}

	
	public checkClickEvents(){
		
		switch(this.navigation) {
		
		case GameEngine.nav_menu:
			this.menuController.checkClick(this.mousePosX, this.mousePosY);
			break;
			
		case GameEngine.nav_game:
			this.game.checkGameClicks(this.mousePosX, this.mousePosY);
			break;
			
		case GameEngine.nav_after_game:
			break;
			
		default:
			break;
		}	 
	}

	public checkRightClickEvents(){
		
		switch(this.navigation) {
		
		case GameEngine.nav_menu:
			break;
			
		case GameEngine.nav_game:
			this.game.checkGameRightClicks(this.mousePosX, this.mousePosY);
			break;
			
		case GameEngine.nav_after_game:
			break;
			
		default:
			break;
		}	 
	}
	

	public checkMouseUpEvents(){
		
		switch(this.navigation) {
		
		case GameEngine.nav_menu:
			break;
			
		case GameEngine.nav_game:
			this.game.checkGameMouseUp();
			break;
			
		case GameEngine.nav_after_game:
			break;
			
		default:
			break;
		}	 
	}

	public checkMouseRightUpEvents(){
		
		switch(this.navigation) {
		
		case GameEngine.nav_menu:
			break;
			
		case GameEngine.nav_game:
			this.game.checkGameRightMouseUp();
			break;
			
		case GameEngine.nav_after_game:
			break;
			
		default:
			break;
		}	 
	}


}



