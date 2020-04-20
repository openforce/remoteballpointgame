import {Game} from '../game/Game.js';
import {GameDrawer} from '../game/GameDrawer.js';

import {MenuController} from './MenuController.js';
import { Inputs } from '../game/Inputs.js';


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

	canvas:HTMLCanvasElement;
	ctx:CanvasRenderingContext2D;
	

	menuController:MenuController;

	game:Game;
	gameDrawer:GameDrawer;
	
	inputs:Inputs;


	// TIME Parameters
	lastTime = 0;
	timeDiff = 0;
	
	maxTimeDiff = 0;
	averageTimeDiff = 0;

	

	constructor(){

		this.inputs = new Inputs();
		
	}
	
	public initMenu(canvas:HTMLCanvasElement){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		this.mode = GameEngine.MODE_CLIENT
		this.state = GameEngine.STATE_MENU;

		this.menuController = new MenuController(this);

		this.menuController.init();
		this.menuController.gotoMenu();
	}

	public initGame(playerName:string, playerColor:string, playerGender:string){
		
		this.mode = GameEngine.MODE_CLIENT;
		this.state = GameEngine.STATE_GAME;

		this.gameDrawer = new GameDrawer();
		this.game = new Game();

		this.game.initGame(playerName, playerColor, playerGender);
		
		//time
		var now = new Date();
		this.lastTime = now.getTime();
	}

	public initGameSimulation(){

		this.mode = GameEngine.MODE_SIMULATION;
		this.state = GameEngine.STATE_GAME;

		this.game.initGameSimulation();
	}


	public mainLoop(){
		
		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			this.menuController.menu();
			break;
		
		case GameEngine.STATE_GAME:
			
			if(this.game.gameState == Game.GAME_STATE_END) this.state = GameEngine.STATE_AFTER_GAME;
			else this.mainLoopGame();
		
			break;
		
		case GameEngine.STATE_AFTER_GAME:
			this.menuController.afterGame();
			break;
		
		default:
			break;
		}	 

	}

	public mainLoopGame(){
		//time
		var now = new Date();
		var time = now.getTime();

		this.timeDiff = time - this.lastTime;

		if(this.timeDiff > this.maxTimeDiff) {
			this.maxTimeDiff = this.timeDiff;
		}
		//if(timeDiff > 20) console.log(timeDiff);

		this.lastTime = time;

		// update game
		if(this.mode == GameEngine.MODE_CLIENT) this.game.updateInputs(this.inputs);
		this.game.updateGame(this.timeDiff);
		if(this.mode == GameEngine.MODE_CLIENT) this.gameDrawer.draw(this.ctx, this.game);
	}

	
	public checkClickEvents(){
		var now = new Date();
		var time = now.getTime();

		this.inputs.clickedLeft = true;
		this.inputs.clickedLeftTimeStemp = time;

		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			this.menuController.checkClick(this.inputs.mousePosX, this.inputs.mousePosY);
			break;
			
		case GameEngine.STATE_GAME:
			break;
			
		case GameEngine.STATE_AFTER_GAME:
			break;
			
		default:
			break;
		}	 
	}

	public checkRightClickEvents(){
		var now = new Date();
		var time = now.getTime();

		this.inputs.clickedRight = true;
		this.inputs.clickedRightTimeStemp = time;
		
		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			break;
			
		case GameEngine.STATE_GAME:
			break;
			
		case GameEngine.STATE_AFTER_GAME:
			break;
			
		default:
			break;
		}	 
	}
	

	public checkMouseUpEvents(){

		this.inputs.clickedLeft = false;
		
		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			break;
			
		case GameEngine.STATE_GAME:
			break;
			
		case GameEngine.STATE_AFTER_GAME:
			break;
			
		default:
			break;
		}	 
	}

	public checkMouseRightUpEvents(){
		
		this.inputs.clickedRight = false;;

		switch(this.state) {
		
		case GameEngine.STATE_MENU:
			break;
			
		case GameEngine.STATE_GAME:
			break;
			
		case GameEngine.STATE_AFTER_GAME:
			break;
			
		default:
			break;
		}	 
	}


}



