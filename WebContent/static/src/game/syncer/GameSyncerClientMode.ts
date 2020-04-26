import { Game } from "../Game";
import { GameSyncer } from "./GameSyncer";
import { Player } from "../../gameObjects/Player";
import { Ball } from "../../gameObjects/Ball";
import { IBallStateList } from "../../interfaces/IBallLists";
import { FlipchartState } from "../../gameObjects/syncObjects/FlipchartState";
import { GameEngine } from "../../engine/GameEngine";

/** 
 * GameSyncer implementation that gives controle of the player and ball states to the client
 * Client (updates and sends state, states of Balls shot by Client) --> Server --> states to all other clients
 * in this case it is not expected that the server performes updates on the game...
*/
export class GameSyncerClientMode extends GameSyncer {


	constructor(game: Game) {
		super(game);
		this.syncMode = GameEngine.SYNC_MODE_CLIENT;
	}

	public init() {
		this.registerNewPlayerOnServer();
		this.initPlayerSyncSender();
		this.initBallSyncSender();
		this.initGameStateSyncListener();
		this.initTimerEndedListener();
		this.initFlipchartListener();
		this.initEventSyncSender();
	}

	public registerNewPlayerOnServer() {
		this.socket.emit('new player', this.game.player.getSyncState());
	}

	public initPlayerSyncSender() {
		setInterval(
			(function (self) {                                                         //Self-executing func which takes 'this' as self
				return function () {                                                   //Return a function in the context of 'self'
					self.socket.emit('player sync', self.game.player.getSyncState()); //Thing you wanted to run as non-window 'this'
				}
			})(this), 1000 / 60);
	}

	public initBallSyncSender() {
		setInterval(
			(function (self) {                       //Self-executing func which takes 'this' as self
				return function () {                 //Return a function in the context of 'self'
					self.sendBallStates(self.game); //Thing you wanted to run as non-window 'this'
				}
			})(this),
			1000 / 60);
	}

	public initEventSyncSender() {
		setInterval(
			(function (self) {          //Self-executing func which takes 'this' as self
				return function () {    //Return a function in the context of 'self'
					self.sendEvents(); //Thing you wanted to run as non-window 'this'
				}
			})(this),
			1000 / 60);
	}

	public sendBallStates(game: Game) {
		for (var id in game.balls) {

			if (game.balls[id].lastHolderId == game.player.id && game.balls[id].state != Ball.BALL_STATE_TAKEN &&
				(game.balls[id].state != Ball.BALL_STATE_ONGROUND || game.balls[id].lastSyncState != Ball.BALL_STATE_ONGROUND)) {

				this.socket.emit('sync ball', game.balls[id].getSyncState());
				game.balls[id].lastSyncState = game.balls[id].state;

			}
		}
	}

	public initGameStateSyncListener() {

		//server state listener
		this.socket.on('state', (function (self) {                                                                                //Self-executing func which takes 'this' as self
			return function (serverPlayers: any, serverBalls: any, serverTimer: any, serverFlipchart: any, serverGameState: any) { //Return a function in the context of 'self'
				self.processServerSync(serverPlayers, serverBalls, serverTimer, serverFlipchart, serverGameState);     	     //Thing you wanted to run as non-window 'this'
			}
		})(this));

	}

	public initTimerEndedListener() {
		this.socket.on('timer ended', (function (self) {       //Self-executing func which takes 'this' as self
			return function () {                          //Return a function in the context of 'self'
				self.game.flipchart.triggerTimerEnded(); //Thing you wanted to run as non-window 'this'
			}
		})(this));
	}

	public initFlipchartListener() {
		//server --> client
		this.socket.on('new result table', (function (self) {         //Self-executing func which takes 'this' as self
			return function (serverResultTable: any) {                 //Return a function in the context of 'self'
				self.game.flipchart.resultTable = serverResultTable; //Thing you wanted to run as non-window 'this'
			}
		})(this));
	}

	public sendEvents() {

		for (var i = 0; i < this.game.syncEvents.length; i++) {

			if (this.game.syncEvents[i].eventData == null) this.sendEvent(this.game.syncEvents[i].eventString);
			else this.sendEventAndData(this.game.syncEvents[i].eventString, this.game.syncEvents[i].eventData);

		}

		this.game.syncEvents = [];
	}





    /***********************************
	# sync client with server states
	***********************************/
	public processServerSync(playerStates: any, ballStates: IBallStateList, timerState: any, flipchartState: FlipchartState, gameState: any) {

		this.game.syncState(gameState);

		this.game.timer.syncState(timerState);
		this.game.flipchart.syncState(flipchartState);

		this.syncPlayerStates(playerStates);
		this.syncBallStates(ballStates);

	}

	public syncPlayerStates(playerStates: any) {

		for (var id in playerStates) {

			var serverPlayerId = Number(id);

			// if its not the main Player, sync it
			if (serverPlayerId != this.game.player.id) {

				if (this.game.players[serverPlayerId] != null) {

					this.game.players[serverPlayerId].syncState(playerStates[serverPlayerId]);

				} else {
					// if the player is null add it
					this.game.players[serverPlayerId] = new Player(this.game, 0, 0, null, null, null);
					this.game.players[serverPlayerId].syncState(playerStates[serverPlayerId]);

				}

			}

		}

		// loop client players and remove not existing ones
		for (var id in this.game.players) {
			if (playerStates[id] == null) delete this.game.players[id];
		}

	}

	public syncBallStates(ballStates: IBallStateList) {

		// loop server balls and refresh / add existing balls
		for (var id in ballStates) {

			var ballId = Number(id);

			if (this.game.balls[ballId] != null) {

				if (ballStates[ballId].lastHolderId != this.game.player.id && this.game.balls[ballId].state != ballStates[ballId].state) {
					this.game.balls[ballId].syncBallState(ballStates[ballId]);
				}

			} else {

				//check if the ball is in one hand
				if ((this.game.player.leftHand == null || this.game.player.leftHand.id != ballId) && (this.game.player.rightHand == null || this.game.player.rightHand.id != ballId)) {

					var newBall = new Ball(this.game, ballStates[ballId].x, ballStates[ballId].y, null);
					newBall.syncBallState(ballStates[ballId]);
					this.game.balls[ballId] = newBall;

				}
			}
		}

		// loop client balls and remove not existing balls
		for (var id in this.game.balls) {
			if (ballStates[id] == null) delete this.game.balls[id];
		}

	}

}