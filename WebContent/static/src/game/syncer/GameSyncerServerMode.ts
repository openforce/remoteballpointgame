import { Game } from "../Game";
import { GameSyncer } from "./GameSyncer";
import { Player } from "../../gameObjects/Player";
import { Ball } from "../../gameObjects/Ball";
import { GameEngine } from "../../engine/GameEngine";
import { IBallStateList } from "../../interfaces/IBallLists";
import { FlipchartState } from "../../gameObjects/syncObjects/FlipchartState";

/** 
 * GameSyncer implementation that gives controle of the player and ball states to the server
 * Client (controles) --> Server (performes all game logic) --> states to all other clients
*/
export class GameSyncerServerMode extends GameSyncer {
    

	constructor(game:Game){
        super(game);
        this.syncMode = GameEngine.SYNC_MODE_CLIENT;
    }

    public init(){
        this.registerNewPlayerOnServer();
		this.initPlayerSyncSender();
		this.initGameStateSyncListener();
    }

    public registerNewPlayerOnServer(){
        this.socket.emit('new player', this.game.player.getSyncState());
    }

	public initPlayerSyncSender(){
        setInterval(
            (function(self) {                                                           //Self-executing func which takes 'this' as self
                return function() {                                                     //Return a function in the context of 'self'
                    self.socket.emit('player controles', self.game.player.inputState);  //Thing you wanted to run as non-window 'this'
                }
            })(this), 1000/60);
    }

    public initGameStateSyncListener(){

		//server state listener
		this.socket.on('state', (function(self) {                                                                                //Self-executing func which takes 'this' as self
			    return function(serverPlayers:any, serverBalls:any, serverTimer:any, serverFlipchart:any, serverGameState:any) { //Return a function in the context of 'self'
				    self.processServerSync(serverPlayers, serverBalls, serverTimer, serverFlipchart, serverGameState);           //Thing you wanted to run as non-window 'this'
			}
        })(this));
        
    }
    

    /***********************************
	# sync client with server states
	***********************************/
	public processServerSync(playerStates:any, ballStates:IBallStateList, timerState:any, flipchartState:FlipchartState, gameState:any) {

		this.game.syncState(gameState);
	
		this.game.timer.syncState(timerState);
		this.game.flipchart.syncState(flipchartState);
		
		this.syncPlayerStates(playerStates);
		this.syncBallStates(ballStates);
		
	}
	
	public syncPlayerStates(playerStates:any){
		
		for (var id in playerStates) {
		  
		  var serverPlayerId = Number(id);

		  // if its not the main Player, sync it
		  if(serverPlayerId != this.game.player.id) {
			
			if(this.game.players[serverPlayerId] != null){
			
				this.game.players[serverPlayerId].syncState(playerStates[serverPlayerId]);
			
			}else{
				// if the player is null add it
				this.game.players[serverPlayerId] = new Player(this.game, 0, 0, null, null, null);
				this.game.players[serverPlayerId].syncState(playerStates[serverPlayerId]);
			
			}
		
		  } else {
			this.game.player.syncState(playerStates[serverPlayerId]);
		  }

		}

		// loop client players and remove not existing ones
		for(var id in this.game.players){
			if(playerStates[id] == null) delete this.game.players[id];
		}

	}

	public syncBallStates(ballStates:IBallStateList){

		// loop server balls and refresh / add existing balls
		for(var id in ballStates) {
			
			var ballId = Number(id);

			if(this.game.balls[ballId] != null) {

                this.game.balls[ballId].syncBallState(ballStates[ballId]);

			}else{

				//check if the ball is in one hand
				if((this.game.player.leftHand == null || this.game.player.leftHand.id != ballId) && (this.game.player.rightHand == null || this.game.player.rightHand.id != ballId)) {
					
					var newBall = new Ball(this.game, ballStates[ballId].x, ballStates[ballId].y, null);
					newBall.syncBallState(ballStates[ballId]);
					this.game.balls[ballId] = newBall;

				}
			}
		}

		// loop client balls and remove not existing balls
		for(var id in this.game.balls) {
			if(ballStates[id] == null) delete this.game.balls[id];
		}

	}


}