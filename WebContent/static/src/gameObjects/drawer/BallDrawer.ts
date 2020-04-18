import {Game} from '../../game/Game.js';
import {Ball} from '../Ball.js';
import {DrawUtils} from '../../utils/DrawUtils1.js';


export class BallDrawer {

    constructor(){

    }


    public draw(ctx:CanvasRenderingContext2D, ball:Ball){

        if(ball.state != Ball.BALL_STATE_TAKEN) {
            DrawUtils.drawCyrcle(ctx, ball.x, ball.y, ball.radius+1, 'black');
            DrawUtils.drawCyrcle(ctx, ball.x, ball.y, ball.radius, ball.color);
        }

    }


}