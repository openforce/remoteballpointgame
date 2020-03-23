//import * as express from "express";
//import * as socketio from "socket.io";

//import { Ball } from "../gameObjects/Ball";

let socketio = require("socket.io");


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


var gameName = "Ball Point Game";

// GAME Parameters
var par_speed:number;
var par_time:number;
var par_items:number;
var par_teamMembers:number;

var par_target_points:number;

var actualSpeed:number; 
var lastGameSpeed = 0;

var gameSpeedMode:number;

//GAME Objects
var player:Player;
var balls:Ball[];
var ballBasket:BallBasket;
var meetingRoom:MeetingRoom;

//Multiplayer Objects
var players:Player[];

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
function initGame(){
	//console.log("init game");
	
	gameEngine.navigation = nav_game;
	
	gameSpeedMode = GAME_SPEED_SPRINT;
	
	// open socket connection to server
	socket = socketio.io();

	socket.on('state', processServerSync);

	//init object controllers

	player = new Player(620, 180, true, true);

	ballBasket = new BallBasket(200, 130, true);
	meetingRoom = new MeetingRoom(true);
	
	gameDraw = new GameDraw();

	balls = [];
	//balls.push(new Ball(400, 400, true));

	players = [];
	//players.push(new Player(300,300));

	//time
	var now = new Date();
	lastTime = now.getTime();
	
	//init game parameters
	
	setParametersFromMenu();
	
	initMissions();
	
	
	// INIT Game Objects here
	initButtons();

	player.init();
	
}


/***********************************
# Game loop
***********************************/
function updateGame() {

	//time
	var now = new Date();
	var time = now.getTime();
	
	timeDiff = time - lastTime;
	
	lastTime = time;

	// UPDATE Game Objects
	updateButtons();

	player.updateControls();
	player.update(timeDiff);
	
	ballBasket.update(timeDiff);
	meetingRoom.update(timeDiff);

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
function processServerSync(serverPlayers:any, serverBalls:any) {
	//console.log(players);
	//console.log(balls);
	
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
			var newPlayer = new Player(serverPlayer.x, serverPlayer.y, true, false);
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


	// Balls

	// loop server balls and refresh / add existing balls
	for (var id in serverBalls) {
		var serverBall = serverBalls[id];
		var foundBall= false;

		for(var i = 0; i < balls.length; i++){
			var clientBall = balls[i];

			if(clientBall.id == serverBall.id){
				if(clientBall.state != serverBall.state && serverBall.lastHolderId != player.id) 
					clientBall.syncBallState(serverBall);
				foundBall = true;
				break;
			}

		}

		if(!foundBall){
			//check if the ball is in one hand
			if(player.leftHand != null && player.leftHand.id == serverBall.id) break;
			if(player.rightHand != null && player.rightHand.id == serverBall.id) break;

			var newBall = new Ball(serverBall.x, serverBall.y, true);
			newBall.syncBallState(serverBall);
			balls.push(newBall);

			console.log(balls);
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
	
}

function checkGameRightClicks(mouseX:number, mouseY:number){
	console.log("checkGameRightClicks");
	player.checkClick(mouseX, mouseY, CLICK_RIGHT);
	
}

/***********************************
# check mouse up
***********************************/
function checkGameMouseUp(){
	//console.log("checkGameClicks");
}








