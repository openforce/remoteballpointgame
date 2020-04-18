import {BallBasket} from "../BallBasket";
import {Ball} from "../Ball";

import {DrawUtils} from "../../utils/DrawUtils1";



export class BallBasketDrawer {


    constructor(){

    }


    public draw(ctx:CanvasRenderingContext2D, ballBasket:BallBasket){
        
        //Basket
        if(ballBasket.game.drawColliders) this.drawColider(ctx, ballBasket);
        DrawUtils.drawCyrcle(ctx, ballBasket.x, ballBasket.y, ballBasket.radius+1, 'black');
        DrawUtils.drawCyrcle(ctx, ballBasket.x, ballBasket.y, ballBasket.radius, 'chocolate');

        //balls
        var ballColor = 0;
        for(var i = -12; i <= 12; i+=12){
            for(var j = -12; j <= 12; j+=12){
                DrawUtils.drawCyrcle(ctx, ballBasket.x+i, ballBasket.y+j, ballBasket.ballRadius+1, 'black');
                
                if(ballBasket.ballColor == null) DrawUtils.drawCyrcle(ctx, ballBasket.x+i, ballBasket.y+j, ballBasket.ballRadius, Ball.colors[ballColor % Ball.colors.length]);
                else DrawUtils.drawCyrcle(ctx, ballBasket.x+i, ballBasket.y+j, ballBasket.ballRadius, ballBasket.ballColor);

                ballColor++;
            }
		}

    }

    public drawColider(ctx:CanvasRenderingContext2D, ballBasket:BallBasket){
        DrawUtils.drawCyrcle(ctx, ballBasket.x, ballBasket.y, ballBasket.radius+1, 'blue');
    }

    
}