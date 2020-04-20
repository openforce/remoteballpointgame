import {GameEngine} from '../engine/GameEngine.js';
import {Game} from './Game.js';

import {TimerDrawer} from '../gameObjects/drawer/TimerDrawer.js';
import {BallDrawer} from '../gameObjects/drawer/BallDrawer.js';
import {BallBasketDrawer} from '../gameObjects/drawer/BallBasketDrawer.js';
import {FlipchartDrawer} from '../gameObjects/drawer/FlipchartDrawer.js';
import {MeetingRoomDrawer} from '../gameObjects/drawer/MeetingRoomDrawer.js';
import {PlayerDrawer} from '../gameObjects/drawer/PlayerDrawer.js';


export class GameDrawer {
	
	timerDrawer:TimerDrawer;
	ballDrawer:BallDrawer;
	ballBasketDrawer:BallBasketDrawer;
	flipchartDrawer:FlipchartDrawer;
	meetingRoomDrawer:MeetingRoomDrawer;
	playerDrawer:PlayerDrawer;

	constructor(){

		this.timerDrawer = new TimerDrawer();
		this.ballDrawer = new BallDrawer();
		this.ballBasketDrawer = new BallBasketDrawer();
		this.flipchartDrawer = new FlipchartDrawer();
		this.meetingRoomDrawer = new MeetingRoomDrawer();
		this.playerDrawer = new PlayerDrawer();

	}

	
	public draw(ctx:CanvasRenderingContext2D, game:Game){
		
		ctx.clearRect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT);
		
		this.meetingRoomDrawer.draw(ctx, game.meetingRoom);
		
		for(var i = 0; i < game.balls.length; i++){
			this.ballDrawer.draw(ctx, game.balls[i]);
		}
		
		for(var i = 0; i < game.ballBaskets.length; i++){
			this.ballBasketDrawer.draw(ctx, game.ballBaskets[i]);
		}

		this.timerDrawer.draw(ctx, game.timer);
		this.flipchartDrawer.draw(ctx, game.flipchart);
		
		for(var i = 0; i < game.players.length; i++){
			this.playerDrawer.draw(ctx, game.players[i]);
		}
		
		this.playerDrawer.draw(ctx, game.player);
		
		if(game.flipchart.active) this.flipchartDrawer.drawFlipchartScreen(ctx, game.flipchart);

		
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