import {GameEngine} from '../engine/GameEngine.js';
import {Game} from './Game.js';


export class GameDraw {
	
	game:Game;


	constructor(game:Game){
		this.game = game;
	}

	
	public draw(){
		
		var ctx = this.game.gameEngine.ctx;

		ctx.clearRect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT);
		
		this.game.meetingRoom.draw();
		
		for(var i = 0; i < this.game.balls.length; i++){
			this.game.balls[i].draw();
		}
		
		for(var i = 0; i < this.game.ballBaskets.length; i++){
			this.game.ballBaskets[i].draw();
		}

		this.game.timer.draw();
		this.game.flipchart.draw();

		
		for(var i = 0; i < this.game.players.length; i++){
			this.game.players[i].draw();
		}
		
		this.game.player.draw();

		this.game.flipchart.drawFlipchartScreen();

		
		// Frame
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'white';
		ctx.rect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT);
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.closePath();
		
	}
	

}