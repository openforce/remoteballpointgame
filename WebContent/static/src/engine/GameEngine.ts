import {Game} from '../game/Game.js';
import {GameDrawer} from '../game/GameDrawer.js';

import {MenuController} from './MenuController.js';


export class GameEngine {

	static MODE_SIMULATION = 0;
	static MODE_CLIENT = 1;

	static STATE_MENU = 1;
	static STATE_GAME = 2;
	static STATE_AFTER_GAME = 3;

	static CANVAS_WIDTH = 800;
    static CANVAS_HEIGHT = 600;


	mode:number;
	state:number;

	keys:boolean[];
	
	mousePosX:number;
	mousePosY:number;

	canvas:HTMLCanvasElement;
	ctx:CanvasRenderingContext2D;
	
	menuController:MenuController;

	game:Game;
	gameDrawer:GameDrawer;
	

	constructor(canvas:HTMLCanvasElement){

		this.canvas = canvas;

		if(this.canvas != null) this.mode = GameEngine.MODE_CLIENT;
		else this.mode = GameEngine.MODE_SIMULATION;
	
		
		if(this.mode == GameEngine.MODE_CLIENT){
			
			this.ctx = canvas.getContext('2d');
			this.gameDrawer = new GameDrawer(this.ctx);
			
			this.menuController = new MenuController(this);
			this.state = GameEngine.STATE_MENU;
			
		}else{
			this.state = GameEngine.STATE_GAME;
		}
		
		this.game = new Game(this);
		
		this.keys = [];

		console.log('GameEngine ready');

	}
	
	public init(){
		this.menuController.init();
		this.menuController.gotoMenu();
	}


	public mainLoop(){
		
		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			this.menuController.menu();
			break;
		
		case GameEngine.STATE_GAME:
			this.game.updateGame();
			if(this.mode == GameEngine.MODE_CLIENT) this.gameDrawer.draw(this.game);
			break;
		
		case GameEngine.STATE_AFTER_GAME:
			this.menuController.afterGame();
			break;
		
		default:
			break;
		}	 

	}

	
	public checkClickEvents(){
		
		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			this.menuController.checkClick(this.mousePosX, this.mousePosY);
			break;
			
		case GameEngine.STATE_GAME:
			this.game.checkGameClicks(this.mousePosX, this.mousePosY);
			break;
			
		case GameEngine.STATE_AFTER_GAME:
			break;
			
		default:
			break;
		}	 
	}

	public checkRightClickEvents(){
		
		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			break;
			
		case GameEngine.STATE_GAME:
			this.game.checkGameRightClicks(this.mousePosX, this.mousePosY);
			break;
			
		case GameEngine.STATE_AFTER_GAME:
			break;
			
		default:
			break;
		}	 
	}
	

	public checkMouseUpEvents(){
		
		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			break;
			
		case GameEngine.STATE_GAME:
			this.game.checkGameMouseUp();
			break;
			
		case GameEngine.STATE_AFTER_GAME:
			break;
			
		default:
			break;
		}	 
	}

	public checkMouseRightUpEvents(){
		
		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			break;
			
		case GameEngine.STATE_GAME:
			this.game.checkGameRightMouseUp();
			break;
			
		case GameEngine.STATE_AFTER_GAME:
			break;
			
		default:
			break;
		}	 
	}


}



