//import * as express from "express";
//import * as socketio from "socket.io";

//import { Ball } from "../gameObjects/Ball";

//let socketio = require("socket.io");
let io:any;

/************************************************
################# CONSTANTS #####################
************************************************/

// game speed modes 
const GAME_SPEED_PAUSE = 0;
const GAME_SPEED_DAILY = 1;
const GAME_SPEED_SPRINT = 10;
const GAME_SPEED_PI = 50;

const CLICK_LEFT = 0;
const CLICK_RIGHT = 1;


/************************************************
################# VARIABLES #####################
************************************************/

// TIME Parameters
var lastTime = 0;
var timeDiff = 0;

var maxTimeDiff = 0;
var averageTimeDiff = 0;


var gameName = "Ball Point Game";

// GAME Parameters
var par_name:string;

var actualSpeed:number; 
var lastGameSpeed = 0;

var gameSpeedMode:number;

//GAME Objects
var player:Player;
var balls:Ball[];

var ballBaskets:BallBasket[];

var meetingRoom:MeetingRoom;
var flipchart:Flipchart;
var timer:Timer;

//Multiplayer Objects
var players:Player[];

var points:number;

// GAME Object Controller
var gameDraw:GameDraw;

var drawColliders = false;

//Multiplayer
var socket:any;

/************************************************
################## METHODS ######################
************************************************/

/***********************************
# Method to init all game objects 
***********************************/
function initGame(playerName:string, playerColor:string, playerGender:string){
	//console.log("init game");
	
	gameEngine.navigation = nav_game;
	
	gameSpeedMode = GAME_SPEED_SPRINT;
	
	// open socket connection to server
	// @ts-ignore
	socket = window.io();

	socket.on('state', processServerSync);

	//init object controllers
	var color = playerColor;
	if(color == null) color = getRandomEntryFromNumberedArray(Player.colors);

	var gender = playerGender;
	if(gender == null) gender = getRandomEntryFromNumberedArray(Player.genders);
	
	var name = playerName;
	if(name == null) name = getRandomName();


	player = new Player(620, 180, true, name, color, gender, true);

	ballBaskets = [];
	ballBaskets.push(new BallBasket(170, 470, true, 'red'));
	ballBaskets.push(new BallBasket(270, 470, true, 'blue'));
	ballBaskets.push(new BallBasket(370, 470, true, 'orange'));
	ballBaskets.push(new BallBasket(470, 470, true, null));

	meetingRoom = new MeetingRoom(true);
	flipchart = new Flipchart(40, 80, true);
	timer = new Timer(170, 60, true);
	
	gameDraw = new GameDraw();

	balls = [];
	players = [];

	points = 0;

	//time
	var now = new Date();
	lastTime = now.getTime();
	
	// INIT Game Objects here
	initButtons();

	player.init();

	setInterval(function(){
		for(var i = 0; i < balls.length; i++){
			balls[i].sendStateToServer();
		}
	}, 1000/60);
}


/***********************************
# Game loop
***********************************/
function updateGame() {

	//time
	var now = new Date();
	var time = now.getTime();
	
	timeDiff = time - lastTime;

	if(timeDiff > maxTimeDiff) {
		maxTimeDiff = timeDiff;
		//console.log('maxTimeDiff: ' + maxTimeDiff);
	}
	//if(timeDiff > 20) console.log(timeDiff);

	//console.log(timeDiff);
	
	lastTime = time;

	// UPDATE Game Objects
	updateButtons();

	player.updateControls();
	player.update(timeDiff);
	
	for(var i = 0; i < ballBaskets.length; i++){
		ballBaskets[i].update;
	}

	//ballBasket.update(timeDiff);

	meetingRoom.update(timeDiff);
	flipchart.update(timeDiff);
	timer.update(timeDiff);

	for(var i = 0; i < players.length; i++){
		//players[i].update(timeDiff);
	}

	for(var i = 0; i < balls.length; i++){
		balls[i].update(timeDiff);
	}
	
	// DRAW Game Objects
	gameDraw.draw();
	
}


/***********************************
# sync client with server states
***********************************/
function processServerSync(serverPlayers:any, serverBalls:any, serverTimer:any, serverFlipchart:any, resultTable:any, gameState:any) {
	
	// SYNC GAME STATE
	points = gameState.points;

	// SYNC TIMER
	timer.targetTime = serverTimer.targetTime;
  	timer.startTime = serverTimer.startTime;
	timer.playTime = serverTimer.playTimer;
	
	// SYNC FLIPCHART 
	flipchart.active = serverFlipchart.active;
	flipchart.activeFlipchart = serverFlipchart.activeFlipchart;
	flipchart.lastActivator = serverFlipchart.lastActivator;

	// SYNC PLAYERS
	for (var id in serverPlayers) {
	  var serverPlayer = serverPlayers[id];
	  
	  // if its not the main Player, sync it
	  if(serverPlayer.id != player.id) {
		//console.log('sync player: ' + player.id);
		var foundPlayer = false;

		// find client Player Object
		for(var i = 0; i < players.length; i++){
			var clientPlayer = players[i];
			if(clientPlayer.id == serverPlayer.id){
				clientPlayer.syncPlayerState(serverPlayer);
				foundPlayer = true;
			}
		}
		
		if(!foundPlayer){
			//console.log('Add new Player to client');
			var newPlayer = new Player(serverPlayer.x, serverPlayer.y, true, serverPlayer.name, serverPlayer.color, serverPlayer.gender, false);
			newPlayer.syncPlayerState(serverPlayer);
			players.push(newPlayer);
		}

	  }

	}

	// loop client players and remove not existing ones
	var playersToRemove = [];

	for(var i = 0; i < players.length; i++){
		var clientPlayer = players[i];
		var foundPlayer = false;

		for(var id in serverPlayers){
			var serverPlayer = serverPlayers[id];

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
		for(var i = 0; i < players.length; i++){
			if(players[i].id != playerToRemove.id) tempPlayer.push(players[i]);
		}
		players = tempPlayer;
	}


	// SYNC BALLS

	// loop server balls and refresh / add existing balls
	for (var id in serverBalls) {
		var serverBall = serverBalls[id];

		var foundBall= false;

		for(var i = 0; i < balls.length; i++){
			var clientBall = balls[i];

			if(clientBall.id == serverBall.id){
				if(serverBall.lastHolderId != player.id && clientBall.state != serverBall.state) {
					clientBall.syncBallState(serverBall);
				}
				foundBall = true;
				break;
			}

		}

		if(!foundBall){
			//check if the ball is in one hand
			if(player.leftHand != null && player.leftHand.id == serverBall.id) break;
			if(player.rightHand != null && player.rightHand.id == serverBall.id) break;

			var newBall = new Ball(serverBall.x, serverBall.y, true, null);
			newBall.syncBallState(serverBall);
			balls.push(newBall);
		}
		
	}


	// loop client balls and remove not existing balls
	var ballsToRemove = [];

	for(var i = 0; i < balls.length; i++){
		var clientBall = balls[i];
		var foundBall = false;

		for(var id in serverBalls){
			var serverBall = serverBalls[id];

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
		for(var i = 0; i < balls.length; i++){
			if(balls[i].id != ballToRemove.id) tempBalls.push(balls[i]);
		}
		balls = tempBalls;
	}

  }


/***********************************
# end game 
# --> go to after_game screen
***********************************/
function endGame(){
	gameEngine.navigation = nav_after_game;
	gameEngine.levelMenuController.wonLevel();
}

/***********************************
# check clicks
***********************************/
function checkGameClicks(mouseX:number, mouseY:number){
	//console.log("checkGameClicks");
	player.checkClick(mouseX, mouseY, CLICK_LEFT);
	flipchart.checkClick(mouseX, mouseY);
	
}

function checkGameRightClicks(mouseX:number, mouseY:number){
	//console.log("checkGameRightClicks");
	player.checkClick(mouseX, mouseY, CLICK_RIGHT);
	
}

/***********************************
# check mouse up
***********************************/
function checkGameMouseUp(){
	//console.log("checkGameClicks");
	player.checkMouseUp(CLICK_LEFT);
}

/***********************************
# check mouse up
***********************************/
function checkGameRightMouseUp(){
	//console.log("checkGameClicks");
	player.checkMouseUp(CLICK_RIGHT);
}








