import { GameConfigs } from '../game/Configs';

import { Game } from '../game/Game';
import { GameDrawer } from '../game/GameDrawer';

import { Inputs } from '../game/Inputs';

import { MenuController } from './MenuController';
import { GameSyncerServerMode } from '../game/syncer/GameSyncerServerMode';
import { PeerConnector } from '../game/peer/PeerConnector';
import { PeerConnectorTest } from '../game/peer/PeerConnectorTest';
import { GameSounds } from '../game/GameSounds';


export class GameEngine {

	static STATE_MENU = 1;
	static STATE_GAME = 2;
	static STATE_AFTER_GAME = 3;

	static CANVAS_WIDTH = 800;
	static CANVAS_HEIGHT = 600;


	mode: number;
	state: number;

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;


	menuController: MenuController;

	game: Game;

	gameDrawer: GameDrawer;
	gameSounds: GameSounds;

	gameSyncer: GameSyncerServerMode;

	peerConnectorTest: PeerConnectorTest;
	peerConnector: PeerConnector;

	inputs: Inputs;


	// TIME Parameters
	lastTime = 0;
	timeDiff = 0;

	maxTimeDiff = 0;
	averageTimeDiff = 0;



	constructor() {
		this.inputs = new Inputs();
		this.gameSyncer = new GameSyncerServerMode();
	}

	public initMenu(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		this.state = GameEngine.STATE_MENU;

		this.menuController = new MenuController(this);

		this.menuController.init();
		this.menuController.gotoMenu();
	}

	public initGame(playerName: string, playerColor: string, playerGender: string, playerControlMode: number) {

		this.state = GameEngine.STATE_GAME;

		this.gameDrawer = new GameDrawer();
		this.game = new Game();
		this.gameSounds = new GameSounds(this.game);

		this.game.initGame(playerName, playerColor, playerGender, playerControlMode);
		this.gameSounds.init();

		// init game logic syncer (socketIO connection to node server)
		this.initGameSyncerServer();

		// init peer connector (for peer to peer connections with webRTC)
		if (GameConfigs.useProximityChat == 1) {
			//this.peerConnectorTest = new PeerConnectorTest(this.game);

			this.peerConnector = new PeerConnector(this.game);
			this.peerConnector.init();
		}

		//time
		var now = new Date();
		this.lastTime = now.getTime();
	}

	public initGameSyncerServer() {
		this.gameSyncer.init(this.game);
	}


	public mainLoop() {

		switch (this.state) {

			case GameEngine.STATE_MENU:
				this.menuController.menu();
				break;

			case GameEngine.STATE_GAME:

				if (this.game.gameState == Game.GAME_STATE_END) this.state = GameEngine.STATE_AFTER_GAME;
				else this.mainLoopGame();

				break;

			case GameEngine.STATE_AFTER_GAME:
				this.menuController.afterGame();
				break;

			default:
				break;
		}

	}

	public mainLoopGame() {
		//time
		var now = new Date();
		var time = now.getTime();

		this.timeDiff = time - this.lastTime;

		if (this.timeDiff > this.maxTimeDiff) {
			this.maxTimeDiff = this.timeDiff;
		}

		this.lastTime = time;

		// update game
		this.game.updateInputs(this.inputs);

		this.game.flipchart.updateClient(this.timeDiff);

		this.gameDrawer.draw(this.ctx, this.game);
		this.gameSounds.update();

		if (GameConfigs.useProximityChat == 1) this.peerConnector.update();

	}


	public checkClickEvents() {

		this.inputs.clickedLeft = true;
		this.inputs.clickedLeftTimeStemp = new Date().getTime();

		switch (this.state) {

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

	public checkRightClickEvents() {

		this.inputs.clickedRight = true;
		this.inputs.clickedRightTimeStemp = new Date().getTime();

		switch (this.state) {

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


	public checkMouseUpEvents() {

		this.inputs.clickedLeft = false;

		switch (this.state) {

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

	public checkMouseRightUpEvents() {

		this.inputs.clickedRight = false;

		switch (this.state) {

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

	public sendFeedback(text: string){
		this.gameSyncer.sendEventAndData('feedback', text);
	}

}



