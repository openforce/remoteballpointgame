import { GameSyncer } from './GameSyncer';
import { Inputs } from './Inputs';

import { Flipchart } from '../gameObjects/Flipchart';
import { MeetingRoom } from '../gameObjects/MeetingRoom';
import { Timer } from '../gameObjects/Timer';
import { BallBasket } from '../gameObjects/BallBasket';
import { Ball } from '../gameObjects/Ball';
import { Player } from '../gameObjects/Player';
import { FlipchartState } from '../gameObjects/syncObjects/FlipchartState';
import { GameState } from './GameState';

import { RandomUtils } from '../utils/RandomUtils1';
import { IBallList, IBallStateList } from '../interfaces/IBallLists';
import { IPlayerList, IPlayerStateList } from '../interfaces/IPlayerLists';


export class Game {

	static HAND_LEFT = 0;
	static HAND_RIGHT = 1;
	
	static GAME_STATE_STARTED = 0;
	static GAME_STATE_WARMUP = 1;
	static GAME_STATE_PREP = 2;
	static GAME_STATE_PLAY = 3;
	static GAME_STATE_END = 4;

	
	gameName = "Remote Ball Point Game";
	
	// GAME Parameters
	par_name:string;
	
	actualSpeed:number; 
	lastGameSpeed = 0;
	
	gameSpeedMode:number;
	
	//GAME Objects
	player:Player;

	balls:IBallList;
	
	ballBaskets:BallBasket[];
	
	meetingRoom:MeetingRoom;
	flipchart:Flipchart;
	timer:Timer;
	
	//Multiplayer Objects
	players:IPlayerList;
	
	points:number;
	showPoints:boolean = false;
	
	arcadeMode:boolean;
	gameState = Game.GAME_STATE_STARTED;
	
	// GAME Object Controller
	
	drawColliders = false;
	
	ui:boolean = false;

	gameSyncer:GameSyncer;
	
	constructor(){

	}

	
	/***********************************
	# init in MODE_CLIENT
	***********************************/
	public initGame(playerName:string, playerColor:string, playerGender:string){
		
		this.ui = true;		
		
		this.initPlayer(playerName, playerColor, playerGender);
		this.initGameWorld();
		
		// INIT Game Objects here
		this.player.init();
	
	}

	/***********************************
	# init in MODE_SIMULATION
	***********************************/
	public initGameSimulation(){
		this.ui = false;
		this.initGameWorld();

		this.player = null;
	}

	public initSocketIO(gameSyncer:GameSyncer){
		
		this.gameSyncer = gameSyncer;

		// SYNCS with server
		
		//server --> client
		gameSyncer.socket.on('state', (function(self) { //Self-executing func which takes 'this' as self
			return function(serverPlayers:any, serverBalls:any, serverTimer:any, serverFlipchart:any, serverGameState:any) { //Return a function in the context of 'self'
				self.processServerSync(serverPlayers, serverBalls, serverTimer, serverFlipchart, serverGameState); //Thing you wanted to run as non-window 'this'
			}
		})(this));

		// client --> server
		setInterval(
			(function(self) {         //Self-executing func which takes 'this' as self
				return function() {   //Return a function in the context of 'self'
					self.sendBallStates(self); //Thing you wanted to run as non-window 'this'
				}
			})(this), 
		1000/60);
	}

	public initGameWorld(){
		// ball baskets
		this.ballBaskets = [];
		this.ballBaskets.push(new BallBasket(this, 170, 470, 'red'));
		this.ballBaskets.push(new BallBasket(this, 270, 470, 'blue'));
		this.ballBaskets.push(new BallBasket(this, 370, 470, 'orange'));
		this.ballBaskets.push(new BallBasket(this, 470, 470, null));

		// others
		this.meetingRoom = new MeetingRoom(this);
		this.flipchart = new Flipchart(this, 40, 80);
		this.timer = new Timer(this, 170, 60);

		this.balls = {};
		this.players = {};

		this.points = 0;

	}

	public initPlayer(playerName:string, playerColor:string, playerGender:string){

		var color = playerColor;
		if(color == null) color = RandomUtils.getRandomEntryFromNumberedArray(Player.colors);
		var gender = playerGender;
		if(gender == null) gender = RandomUtils.getRandomEntryFromNumberedArray(Player.genders);
		var name = playerName;
		if(name == null) name = RandomUtils.getRandomName();

		this.player = new Player(this, 620, 180, name, color, gender, this.gameSyncer);


	}

	public sendBallStates(game:Game){	
		for(var id in game.balls){
			if(game.balls[id] == null) continue;

			game.balls[id].sendStateToServer();
		}	
	}

	public updateInputs(inputs:Inputs){
		this.player.updateInputs(inputs);
		this.flipchart.updateInputs(inputs);
	}
	

	public updateGame(timeDiff:number) {
	
		// UPDATE Game Objects
	
		if(this.player != null){
			this.player.update(timeDiff);
		}
		
		for(var i = 0; i < this.ballBaskets.length; i++){
			this.ballBaskets[i].update;
		}
	
		this.meetingRoom.update(timeDiff);
		this.flipchart.update(timeDiff);
		//timer.update(timeDiff);
	
		for(var id in this.players){
			//players[id].update(timeDiff);
		}
	
		for(var id in this.balls){
			this.balls[id].update(timeDiff);
		}
		
		
	}
	
	public triggerShowPoints(){
		if(this.gameSyncer.socket != null) this.gameSyncer.socket.emit('show Points');  
	}
	
	public triggerResetGame(arcadeMode:boolean){
		if(this.gameSyncer.socket != null) this.gameSyncer.socket.emit('reset gameState', arcadeMode);  
	}


	public getSyncState(){
        var syncObject = new GameState();

        syncObject.points = this.points;
		syncObject.showPoints = this.showPoints;
		syncObject.gameState = this.gameState;
		syncObject.arcadeMode = this.arcadeMode;

        return syncObject;
    }

    public syncState(syncObject:GameState){
        this.points = syncObject.points;
		this.showPoints = syncObject.showPoints;
		this.gameState = syncObject.gameState;
		this.arcadeMode = syncObject.arcadeMode;
    }
	
	
	/***********************************
	# sync client with server states
	***********************************/
	public processServerSync(playerStates:any, ballStates:IBallStateList, timerState:any, flipchartState:FlipchartState, gameState:any) {

		this.syncState(gameState);
	
		this.timer.syncState(timerState);
		this.flipchart.syncState(flipchartState);
		
		this.syncPlayerStates(playerStates);
		this.syncBallStates(ballStates);
		
	}
	
	public syncPlayerStates(playerStates:any){
		
		for (var id in playerStates) {
		  
		  var serverPlayerId = Number(id);

		  // if its not the main Player, sync it
		  if(serverPlayerId != this.player.id) {
			
			if(this.players[serverPlayerId] != null){
			
				this.players[serverPlayerId].syncState(playerStates[serverPlayerId]);
			
			}else{
				// if the player is null add it
				this.players[serverPlayerId] = new Player(this, 0, 0, null, null, null, null);
				this.players[serverPlayerId].syncState(playerStates[serverPlayerId]);
			
			}
		
		  }

		}

		// loop client players and remove not existing ones
		for(var id in this.players){
			
			if(playerStates[id] == null) delete this.players[id];

		}

	}

	public syncBallStates(ballStates:IBallStateList){

		// loop server balls and refresh / add existing balls
		for(var id in ballStates) {
			
			var ballId = Number(id);

			if(this.balls[ballId] != null) {
				if(ballStates[ballId].lastHolderId != this.player.id && this.balls[ballId].state != ballStates[ballId].state) {
					this.balls[ballId].syncBallState(ballStates[ballId]);
				}
			}else{

				//check if the ball is in one hand
				if((this.player.leftHand == null || this.player.leftHand.id != ballId) && (this.player.rightHand == null || this.player.rightHand.id != ballId)) {
					
					var newBall = new Ball(this, ballStates[ballId].x, ballStates[ballId].y, null);
					newBall.syncBallState(ballStates[ballId]);
					this.balls[ballId] = newBall;

				}
			}
		}

		// loop client balls and remove not existing balls
		for(var id in this.balls) {
			if(ballStates[id] == null) delete this.balls[id];
		}

	}


	public getBallStateList(){
		var ballStates:IBallStateList;
		ballStates = {};

		for(var id in this.balls) {
			ballStates[id] = this.balls[id].getSyncState();
		}

		return ballStates;
	}

	public getPlayerStateList(){
		var playerStates:IPlayerStateList;
		playerStates = {};

		for(var id in this.players) {
			playerStates[id] = this.players[id].getSyncState();
		}

		return playerStates;
	}
	
	public endGame(){
		this.gameState = Game.GAME_STATE_END;
	}
	
	

}	

