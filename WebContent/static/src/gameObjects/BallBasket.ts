import { Game } from '../game/Game';
import { Ball } from './Ball';


export class BallBasket {

    x: number;
    y: number;
    radius: number = 30;

    ballRadius: number = 7;
    ballColor: string;

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
        return new Ball(this.game, 0, 0, this.ballColor);
    }

}