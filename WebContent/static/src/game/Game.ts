import { SyncEvent } from '../gameObjects/syncObjects/SyncEvent';
import { Inputs } from './Inputs';

import { Flipchart } from '../gameObjects/Flipchart';
import { MeetingRoom } from '../gameObjects/MeetingRoom';
import { Timer } from '../gameObjects/Timer';
import { BallBasket } from '../gameObjects/BallBasket';
import { Player } from '../gameObjects/Player';
import { GameState } from './GameState';

import { RandomUtils } from '../utils/RandomUtils1';
import { IBallList, IBallStateList } from '../interfaces/IBallLists';
import { IPlayerList, IPlayerStateList } from '../interfaces/IPlayerLists';
import { GameConfigs } from './Configs';
import { Radio } from '../gameObjects/Radio';
import { IRadioStateList } from '../interfaces/IRadioList';


export class Game {

	static GAME_STATE_STARTED = 0;
	static GAME_STATE_WARMUP = 1;
	static GAME_STATE_PREP = 2;
	static GAME_STATE_PLAY = 3;
	static GAME_STATE_END = 4;

	gameName = "Remote Ball Point Game";

	//GAME Objects
	player: Player;

	balls: IBallList;

	ballBaskets: BallBasket[];

	meetingRoom: MeetingRoom;
	flipchart: Flipchart;
	timer: Timer;

	radios: Radio[];

	//Multiplayer Objects
	players: IPlayerList;

	points: number;
	showPoints: boolean = false;

	arcadeMode: boolean;
	gameState = Game.GAME_STATE_STARTED;

	drawColliders = false;

	ui: boolean = false;

	syncEvents: SyncEvent[];

	constructor() {
		this.syncEvents = [];
		this.arcadeMode = GameConfigs.arcadeMode;
	}


	/***********************************
	# init in MODE_CLIENT
	***********************************/
	public initGame(playerName: string, playerColor: string, playerGender: string, playerControlMode: number) {

		this.ui = true;

		this.initPlayer(playerName, playerColor, playerGender, playerControlMode);
		this.initGameWorld();

		// INIT Game Objects here
		this.player.init();
	}

	/***********************************
	# init in MODE_SIMULATION
	***********************************/
	public initGameSimulation() {
		this.ui = false;
		this.initGameWorld();

		//this.radios.push(new Radio(this, 120, 350, 270));
		this.radios.push(new Radio(this, 696, 350, 90));

		this.player = null;
	}

	public initGameWorld() {
		// ball baskets
		this.ballBaskets = [];
		//this.ballBaskets.push(new BallBasket(this, 170, 470, 'red'));
		//this.ballBaskets.push(new BallBasket(this, 270, 470, 'blue'));
		//this.ballBaskets.push(new BallBasket(this, 370, 470, 'orange'));
		this.ballBaskets.push(new BallBasket(this, 170, 470, null));
		//this.ballBaskets.push(new BallBasket(this, 400, 150, null));

		// others
		this.meetingRoom = new MeetingRoom(this);
		this.flipchart = new Flipchart(this, 40, 80);
		this.timer = new Timer(this, 170, 60);

		this.radios = [];

		this.balls = {};
		this.players = {};

		this.points = 0;

	}

	public initPlayer(playerName: string, playerColor: string, playerGender: string, playerControlMode: number) {

		var color = playerColor;
		if (color == null) color = RandomUtils.getRandomEntryFromNumberedArray(Player.colors);
		var gender = playerGender;
		if (gender == null) gender = RandomUtils.getRandomEntryFromNumberedArray(Player.genders);
		var name = playerName;
		if (name == null) name = RandomUtils.getRandomName();

		this.player = new Player(this, 620, 180, name, color, gender, playerControlMode);


	}

	public updateInputs(inputs: Inputs) {
		this.player.updateInputs(inputs);
		this.flipchart.updateInputs(inputs);
	}

	public updateGame(timeDiff: number) {
		
		for (var i = 0; i < this.ballBaskets.length; i++) {
			this.ballBaskets[i].update;
		}

		this.meetingRoom.update(timeDiff);
		this.flipchart.update(timeDiff);
		this.timer.update(timeDiff);

		if (!this.flipchart.active)
			for (var id in this.players) {
				this.players[id].update(timeDiff);
			}

		for (var id in this.balls) {
			this.balls[id].update(timeDiff);
		}

		for (var i = 0; i < this.radios.length; i++) {
			this.radios[i].update(timeDiff);
		}


	}

	public updatePlayer(timeDiff: number) {
		if (this.player != null) this.player.update(timeDiff);
	}

	public triggerShowPoints() {
		this.addEvent('show Points', null);
	}

	public triggerResetGame() {
		this.addEvent('reset gameState', null);
	}


	public getSyncState() {
		var syncObject = new GameState();

		syncObject.points = this.points;
		syncObject.showPoints = this.showPoints;
		syncObject.gameState = this.gameState;
		syncObject.arcadeMode = this.arcadeMode;

		return syncObject;
	}

	public syncState(syncObject: GameState) {
		this.points = syncObject.points;
		this.showPoints = syncObject.showPoints;
		this.gameState = syncObject.gameState;
		this.arcadeMode = syncObject.arcadeMode;
	}


	public getBallStateList() {
		var ballStates: IBallStateList;
		ballStates = {};

		for (var id in this.balls) {
			ballStates[id] = this.balls[id].getSyncState();
		}

		return ballStates;
	}

	public getRadioStateList() {
		var radioStates: IRadioStateList;
		radioStates = {};

		for (var i = 0; i < this.radios.length; i++) {
			radioStates[this.radios[i].id] = this.radios[i].getSyncState();
		}

		return radioStates;
	}

	public getPlayerStateList() {
		var playerStates: IPlayerStateList;
		playerStates = {};

		for (var id in this.players) {
			playerStates[id] = this.players[id].getSyncState();
		}

		return playerStates;
	}

	public endGame() {
		this.gameState = Game.GAME_STATE_END;
	}

	public addEvent(eventString: string, eventData: any) {
		this.syncEvents.push(new SyncEvent(eventString, eventData));
	}


}	