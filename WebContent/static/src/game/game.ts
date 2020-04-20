import {GameSyncer} from './GameSyncer.js';
import {Inputs} from './Inputs.js';

import {Flipchart} from '../gameObjects/Flipchart.js';
import {MeetingRoom} from '../gameObjects/MeetingRoom.js';
import {Timer} from '../gameObjects/Timer.js';
import {BallBasket} from '../gameObjects/BallBasket.js';
import {Ball} from '../gameObjects/Ball.js';
import {Player} from '../gameObjects/Player.js';
import {FlipchartState} from '../gameObjects/syncObjects/FlipchartState.js';
import {GameState} from './GameState.js';

import {RandomUtils} from '../utils/RandomUtils1.js';


export class Game {

	static HAND_LEFT = 0;
	static HAND_RIGHT = 1;
	
	static GAME_STATE_STARTED = 0;
	static GAME_STATE_WARMUP = 1;
	static GAME_STATE_PREP = 2;
	static GAME_STATE_PLAY = 3;
	static GAME_STATE_END = 4;

	
	gameName = "Ball Point Game";
	
	// GAME Parameters
	par_name:string;
	
	actualSpeed:number; 
	lastGameSpeed = 0;
	
	gameSpeedMode:number;
	
	//GAME Objects
	player:Player;
	balls:Ball[];
	
	ballBaskets:BallBasket[];
	
	meetingRoom:MeetingRoom;
	flipchart:Flipchart;
	timer:Timer;
	
	//Multiplayer Objects
	players:Player[];
	
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

		this.balls = [];
		this.players = [];

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
		for(var i = 0; i < game.balls.length; i++){
			game.balls[i].sendStateToServer();
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
	
		for(var i = 0; i < this.players.length; i++){
			//players[i].update(timeDiff);
		}
	
		for(var i = 0; i < this.balls.length; i++){
			this.balls[i].update(timeDiff);
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
	public processServerSync(playerStates:any, ballStates:any, timerState:any, flipchartState:FlipchartState, gameState:any) {

		
		this.syncState(gameState);
	
		this.timer.syncState(timerState);
		this.flipchart.syncState(flipchartState);
		
		// SYNC PLAYERS
		for (var id in playerStates) {
		  var serverPlayer = playerStates[id];
		  
		  // if its not the main Player, sync it
		  if(serverPlayer.id != this.player.id) {
			var foundPlayer = false;
	
			// find client Player Object
			for(var i = 0; i < this.players.length; i++){
				var clientPlayer = this.players[i];
				if(clientPlayer.id == serverPlayer.id){
					clientPlayer.syncState(serverPlayer);
					foundPlayer = true;
				}
			}
			
			if(!foundPlayer){
				//console.log('Add new Player to client');
				var newPlayer = new Player(this, serverPlayer.x, serverPlayer.y, serverPlayer.name, serverPlayer.color, serverPlayer.gender, null);
				newPlayer.syncState(serverPlayer);
				this.players.push(newPlayer);
			}
	
		  }
	
		}
	
		// loop client players and remove not existing ones
		var playersToRemove = [];
	
		for(var i = 0; i < this.players.length; i++){
			var clientPlayer = this.players[i];
			var foundPlayer = false;
	
			for(var id in playerStates){
				var serverPlayer = playerStates[id];
	
				if(clientPlayer.id == serverPlayer.id){
					foundPlayer = true;
					break;
				}
	
			}
	
			if(!foundPlayer){
				playersToRemove.push(clientPlayer);
			}
		}
	
		for(id in playersToRemove){
			var playerToRemove = playersToRemove[id];
			
			var tempPlayer = [];
			for(var i = 0; i < this.players.length; i++){
				if(this.players[i].id != playerToRemove.id) tempPlayer.push(this.players[i]);
			}
			this.players = tempPlayer;
		}
	
	
		// SYNC BALLS
	
		// loop server balls and refresh / add existing balls
		for (var id in ballStates) {
			var serverBall = ballStates[id];
	
			var foundBall= false;
	
			for(var i = 0; i < this.balls.length; i++){
				var clientBall = this.balls[i];
	
				if(clientBall.id == serverBall.id){
					if(serverBall.lastHolderId != this.player.id && clientBall.state != serverBall.state) {
						clientBall.syncBallState(serverBall);
					}
					foundBall = true;
					break;
				}
	
			}
	
			if(!foundBall){
				//check if the ball is in one hand
				if(this.player.leftHand != null && this.player.leftHand.id == serverBall.id) break;
				if(this.player.rightHand != null && this.player.rightHand.id == serverBall.id) break;
	
				var newBall = new Ball(this, serverBall.x, serverBall.y, null);
				newBall.syncBallState(serverBall);
				this.balls.push(newBall);
			}
			
		}
	
	
		// loop client balls and remove not existing balls
		var ballsToRemove = [];
	
		for(var i = 0; i < this.balls.length; i++){
			var clientBall = this.balls[i];
			var foundBall = false;
	
			for(var id in ballStates){
				var serverBall = ballStates[id];
	
				if(clientBall.id == serverBall.id){
					foundBall = true;
					break;
				}
	
			}
	
			if(!foundBall){
				ballsToRemove.push(clientBall);
			}
		}
	
		for(id in ballsToRemove){
			var ballToRemove = ballsToRemove[id];
			
			var tempBalls = [];
			for(var i = 0; i < this.balls.length; i++){
				if(this.balls[i].id != ballToRemove.id) tempBalls.push(this.balls[i]);
			}
			this.balls = tempBalls;
		}
	
	}


	
	
	public endGame(){
		this.gameState = Game.GAME_STATE_END;
	}
	
	

}	

