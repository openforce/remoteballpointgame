import { GameEngine } from './GameEngine.js';

import { RandomUtils } from '../utils/RandomUtils1.js';

import { Button } from '../gameObjectLibrary/Button.js';
import { Player } from '../gameObjects/Player.js';


export class MenuController {

	startButtonX: number = 50;
	startButtonY: number = 540;

	startButtonWidth: number = 70;
	startButtonHeight: number = 55;


	sprites: CanvasImageSource[];

	//Player Selection
	playerSprites: CanvasImageSource[];
	playerSpriteWidth: number = 218;
	playerSpriteHeight: number = 170;
	playerSpriteDrawWidth: number = 70;
	playerSpriteDrawHeight: number = 60;

	playerStartX: number = 120;
	playerDistX: number = 100;
	playerY: number = 320;

	playerButtons: Button[];
	playerControlModeButtons: Button[];

	playerControlMode: number = 0;


			
	playerControlModeButtonWidth: number = 290;
	playerControlModeButtonHeight: number = 155;
	playerControlModeButtonY: number = 400;

	playerControlMode0ButtonX: number = 100;
	playerControlMode1ButtonX: number = 400;
	

	canvas_input: any;
	input_name: any;

	gameEngine: GameEngine;

	gameRoomId: string;

	constructor(gameEngine: GameEngine) {

		this.gameEngine = gameEngine;

		// get room id
		var url = window.location.href;
		var splittedUrl = url.split('/');

		this.gameRoomId = splittedUrl[splittedUrl.length - 1];

		this.playerSprites = [];
		this.playerSprites[0] = new Image();
		this.playerSprites[0].src = '/static/resources/person_m_blue_stand.png';
		this.playerSprites[1] = new Image();
		this.playerSprites[1].src = '/static/resources/person_m_orange_stand.png';
		this.playerSprites[2] = new Image();
		this.playerSprites[2].src = '/static/resources/person_m_white_stand.png';
		this.playerSprites[3] = new Image();
		this.playerSprites[3].src = '/static/resources/person_w_blue_stand.png';
		this.playerSprites[4] = new Image();
		this.playerSprites[4].src = '/static/resources/person_w_orange_stand.png';
		this.playerSprites[5] = new Image();
		this.playerSprites[5].src = '/static/resources/person_w_white_stand.png';

		this.playerButtons = [];
		for (var i = 0; i < this.playerSprites.length; i++) {
			this.playerButtons[i] = new Button(this.playerStartX + this.playerDistX * i, this.playerY, this.playerSpriteDrawWidth, this.playerSpriteDrawHeight, '');
		}
		this.playerControlModeButtons = [];
		this.playerControlModeButtons[0] = new Button(this.playerControlMode0ButtonX, this.playerControlModeButtonY, this.playerControlModeButtonWidth, this.playerControlModeButtonHeight, '');
		this.playerControlModeButtons[1] = new Button(this.playerControlMode1ButtonX, this.playerControlModeButtonY, this.playerControlModeButtonWidth, this.playerControlModeButtonHeight, '');

		this.sprites = [];
		this.sprites[0] = new Image();
		this.sprites[0].src = '/static/resources/titlescreen.png';
		this.sprites[1] = new Image();
		this.sprites[1].src = '/static/resources/chooseplayer.png';
		this.sprites[2] = new Image();
		this.sprites[2].src = '/static/resources/controles_mouse_title.png';
		this.sprites[3] = new Image();
		this.sprites[3].src = '/static/resources/controles_keyboard_title.png';
	}

	public gotoMenu() {
		this.gameEngine.state = GameEngine.STATE_MENU;
	}

	public init() {

		//@ts-ignore
		this.input_name = new CanvasInput({
			canvas: this.gameEngine.canvas,
			x: 375,
			y: 278,
			width: 100,
			value: RandomUtils.getRandomName()
		});
	}


	public menu() {

		// UPDATE 

		// space to start
		//if (keys[32]) initGame(input_name.value(), null, null);
		// restart on R
		//if (keys[82]) setRandomValues();
		// levels on L
		//if (keys[76]) gameEngine.levelMenuController.gotoLevelMenu();
		// scenes on S
		//if (keys[83]) gameEngine.sceneMenuController.gotoSceneMenu();



		//DRAW
		var ctx = this.gameEngine.ctx;

		ctx.clearRect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT);

		// BG
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'white';
		ctx.lineWidth = 5;
		ctx.fillRect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT);
		//ctx.rect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT);
		ctx.stroke();
		ctx.closePath();


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
			0, 0, 1290, 700, // sprite cutout position and size
			this.playerControlMode0ButtonX, this.playerControlModeButtonY, this.playerControlModeButtonWidth, this.playerControlModeButtonHeight); 	 // draw position and size

		if (this.playerControlMode == Player.CONTROLE_MODE_MOUSE) {
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.rect(this.playerControlMode0ButtonX, this.playerControlModeButtonY, this.playerControlModeButtonWidth, this.playerControlModeButtonHeight);
			ctx.stroke();
			ctx.closePath();
		}

		ctx.drawImage(this.sprites[3],
			0, 0, 1290, 700, // sprite cutout position and size
			this.playerControlMode1ButtonX, this.playerControlModeButtonY, this.playerControlModeButtonWidth, this.playerControlModeButtonHeight); 	 // draw position and size

		if (this.playerControlMode == Player.CONTROLE_MODE_KEYBOARD) {
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.rect(this.playerControlMode1ButtonX, this.playerControlModeButtonY, this.playerControlModeButtonWidth, this.playerControlModeButtonHeight);
			ctx.stroke();
			ctx.closePath();
		}

		// Name input		
		ctx.fillStyle = "black";
		ctx.font = "bold 20px Arial";

		ctx.fillText("first name:", 265, 300);
		this.input_name.render();

		// room info
		ctx.fillStyle = "black";
		ctx.font = "bold 16px Arial";
		//ctx.fillText("roomId:", 40, 550);
		//ctx.fillText(this.gameRoomId, 105, 550);

		// Players
		for (var i = 0; i < this.playerSprites.length; i++) {
			ctx.drawImage(this.playerSprites[i],
				0, 0, this.playerSpriteWidth, this.playerSpriteHeight, // sprite cutout position and size
				this.playerStartX + this.playerDistX * i, this.playerY, this.playerSpriteDrawWidth, this.playerSpriteDrawHeight); 	 // draw position and size	
		}

	}


	public afterGame() {

		// UPDATE 

		// goto menu on m
		if (this.gameEngine.inputs.keys[77]) this.gotoMenu();
		// restart on r
		if (this.gameEngine.inputs.keys[82]) this.gameEngine.initGame(null, null, null, null);


		// DRAW
		var ctx = this.gameEngine.ctx;

		ctx.clearRect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT);

		// Headline
		ctx.fillStyle = "red";
		ctx.font = "bold 50px Arial";


		// Navigation
		ctx.fillStyle = "black";
		ctx.font = "bold 20px Arial";

		ctx.fillText("Press R to restart", 20, 300);
		ctx.fillText("Press M to return to the menu", 20, 350);

	}


	public checkClick(mouseX: number, mouseY: number) {
		this.checkClickControls(mouseX, mouseY);
		this.checkClickPlayer(mouseX, mouseY);
	}

	public checkClickControls(mouseX: number, mouseY: number) {

		if (this.playerControlModeButtons[0].checkForClick(mouseX, mouseY)) this.playerControlMode = Player.CONTROLE_MODE_MOUSE;
		else if (this.playerControlModeButtons[1].checkForClick(mouseX, mouseY)) this.playerControlMode = Player.CONTROLE_MODE_KEYBOARD;

	}

	public checkClickPlayer(mouseX: number, mouseY: number) {

		if (this.playerButtons[0].checkForClick(mouseX, mouseY)) this.gameEngine.initGame(this.input_name.value(), 'blue', 'm', this.playerControlMode);
		else if (this.playerButtons[1].checkForClick(mouseX, mouseY)) this.gameEngine.initGame(this.input_name.value(), 'orange', 'm', this.playerControlMode);
		else if (this.playerButtons[2].checkForClick(mouseX, mouseY)) this.gameEngine.initGame(this.input_name.value(), 'white', 'm', this.playerControlMode);
		else if (this.playerButtons[3].checkForClick(mouseX, mouseY)) this.gameEngine.initGame(this.input_name.value(), 'blue', 'w', this.playerControlMode);
		else if (this.playerButtons[4].checkForClick(mouseX, mouseY)) this.gameEngine.initGame(this.input_name.value(), 'orange', 'w', this.playerControlMode);
		else if (this.playerButtons[5].checkForClick(mouseX, mouseY)) this.gameEngine.initGame(this.input_name.value(), 'white', 'w', this.playerControlMode);
		else return;

		this.input_name.destroy();

	}

}






