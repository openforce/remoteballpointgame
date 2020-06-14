import { Game } from '../game/Game';
import { Ball } from './Ball';


export class BallBasket {

    x: number;
    y: number;
    radius: number = 30;

    ballRadius: number = 7;
    ballColor: string;

    ballAmount: number = 9;

    game: Game;

    constructor(game: Game, x: number, y: number, ballColor: string) {
        this.x = x;
        this.y = y;

        this.game = game;

        this.ballColor = ballColor;
    }

    public update(timeDiff: number) {

    }

    public getNewBall() {
        //this.ballAmount--;

        var newBall = null; 
        if(this.ballAmount > 0) newBall = new Ball(this.game, 0, 0, this.ballColor);
        
        return newBall;
    }

    public returnBall() {
        //this.ballAmount++;
    }

}