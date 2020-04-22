import { Ball } from '../Ball';
import { DrawUtils } from '../../utils/DrawUtils1';


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