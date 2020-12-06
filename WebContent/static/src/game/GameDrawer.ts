import { GameEngine } from '../engine/GameEngine';
import { Game } from './Game';

import { TimerDrawer } from '../gameObjects/drawer/TimerDrawer';
import { BallDrawer } from '../gameObjects/drawer/BallDrawer';
import { BallBasketDrawer } from '../gameObjects/drawer/BallBasketDrawer';
import { FlipchartDrawer } from '../gameObjects/drawer/FlipchartDrawer';
import { MeetingRoomDrawer } from '../gameObjects/drawer/MeetingRoomDrawer';
import { PlayerDrawer } from '../gameObjects/drawer/PlayerDrawer';
import { RadioDrawer } from '../gameObjects/drawer/RadioDrawer';


export class GameDrawer {

	timerDrawer: TimerDrawer;
	ballDrawer: BallDrawer;
	ballBasketDrawer: BallBasketDrawer;
	flipchartDrawer: FlipchartDrawer;
	meetingRoomDrawer: MeetingRoomDrawer;
	playerDrawer: PlayerDrawer;
	radioDrawer: RadioDrawer;

	
	constructor() {

		this.timerDrawer = new TimerDrawer();
		this.ballDrawer = new BallDrawer();
		this.ballBasketDrawer = new BallBasketDrawer();
		this.flipchartDrawer = new FlipchartDrawer();
		this.meetingRoomDrawer = new MeetingRoomDrawer();
		this.playerDrawer = new PlayerDrawer();
		this.radioDrawer = new RadioDrawer();

	}


	public draw(ctx: CanvasRenderingContext2D, game: Game) {

		ctx.clearRect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT);
		
		this.meetingRoomDrawer.draw(ctx, game.meetingRoom);

		for (var id in game.balls) {
			this.ballDrawer.draw(ctx, game.balls[id]);
		}

		for (var i = 0; i < game.ballBaskets.length; i++) {
			this.ballBasketDrawer.draw(ctx, game.ballBaskets[i]);
		}

		this.timerDrawer.draw(ctx, game.timer);

		for (var id in game.radios) {
			this.radioDrawer.draw(ctx, game.radios[id]);
		}

		this.flipchartDrawer.draw(ctx, game.flipchart);

		for (var id in game.players) {
			this.playerDrawer.draw(ctx, game.players[id]);
		}

		this.playerDrawer.draw(ctx, game.player);
		
		this.flipchartDrawer.drawFlipchartScreen(ctx, game.flipchart);


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