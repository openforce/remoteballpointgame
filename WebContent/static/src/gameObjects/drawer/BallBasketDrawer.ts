import { BallBasket } from "../BallBasket";
import { Ball } from "../Ball";

import { DrawUtils } from "../../utils/DrawUtils1";



export class BallBasketDrawer {


    constructor() {

    }

    public draw(ctx: CanvasRenderingContext2D, ballBasket: BallBasket) {

        //Basket
        //DrawUtils.drawCyrcle(ctx, ballBasket.x, ballBasket.y, ballBasket.radius + 1, 'black');
        //DrawUtils.drawCyrcle(ctx, ballBasket.x, ballBasket.y, ballBasket.radius, 'chocolate');

        DrawUtils.drawCircleObject(ctx, ballBasket, 'chocolate');
        DrawUtils.drawCircleOutlineObject(ctx, ballBasket, 'black');


        var ballPositions = [-12, 0, 12];

        //balls
        var ballColor = 0;
        var ballCount = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {

                if (ballBasket.ballColor == null) {
                    DrawUtils.drawCircle(ctx, ballBasket.x + ballPositions[j], ballBasket.y + ballPositions[i], ballBasket.ballRadius, Ball.colors[ballColor % Ball.colors.length]);
                } else {
                    DrawUtils.drawCircle(ctx, ballBasket.x + ballPositions[j], ballBasket.y + ballPositions[i], ballBasket.ballRadius, ballBasket.ballColor);
                }
                DrawUtils.drawCircleOutline(ctx, ballBasket.x + ballPositions[j], ballBasket.y + ballPositions[i], ballBasket.ballRadius, 'black');

                ballCount++;
                ballColor++;
                if (ballCount >= ballBasket.ballAmount) break;
            }
            if (ballCount >= ballBasket.ballAmount) break;
        }

        if (ballBasket.game.drawColliders) this.drawColider(ctx, ballBasket);
    }


    public drawColider(ctx: CanvasRenderingContext2D, ballBasket: BallBasket) {
        DrawUtils.drawCircleOutlineObject(ctx, ballBasket, 'blue');
    }


}