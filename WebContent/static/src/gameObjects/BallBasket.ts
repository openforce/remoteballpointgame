import {Game} from '../game/Game.js';

import {DrawUtils} from '../utils/DrawUtils1.js';

import {Ball} from './Ball.js';


export class BallBasket {

    x: number;
    y: number;
    radius:number = 30;

    ballRadius:number = 7;
    ballColor:string;
    
    game:Game;

    constructor(game:Game, x:number, y:number, ballColor:string){
        this.x = x;
        this.y = y;

        this.game = game;

        this.ballColor = ballColor;
    }

    public update(timeDiff:number){
       
    }

    public getNewBall(){
        return new Ball(this.game, 0, 0, this.ballColor);
    }

    public draw(){
        if(!this.game.ui) return;

        //Basket
        if(this.game.drawColliders) this.drawColider();
        DrawUtils.drawCyrcle(this.game.gameEngine.ctx, this.x, this.y, this.radius+1, 'black');
        DrawUtils.drawCyrcle(this.game.gameEngine.ctx, this.x, this.y, this.radius, 'chocolate');

        //balls
        var ballColor = 0;
        for(var i = -12; i <= 12; i+=12){
            for(var j = -12; j <= 12; j+=12){
                DrawUtils.drawCyrcle(this.game.gameEngine.ctx, this.x+i, this.y+j, this.ballRadius+1, 'black');
                
                if(this.ballColor == null) DrawUtils.drawCyrcle(this.game.gameEngine.ctx, this.x+i, this.y+j, this.ballRadius, Ball.colors[ballColor % Ball.colors.length]);
                else DrawUtils.drawCyrcle(this.game.gameEngine.ctx, this.x+i, this.y+j, this.ballRadius, this.ballColor);

                ballColor++;
            }
		}

    }

    public drawColider(){
        DrawUtils.drawCyrcle(this.game.gameEngine.ctx, this.x, this.y, this.radius+1, 'blue');
    }

    
}