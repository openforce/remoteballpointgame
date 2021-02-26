import { Ball } from '../Ball';
import { DrawUtils } from '../../utils/DrawUtils1';


export class BallDrawer {

    constructor() {

    }


    public draw(ctx: CanvasRenderingContext2D, ball: Ball) {

        if (ball.state != Ball.BALL_STATE_TAKEN) {
            DrawUtils.drawCircleObject(ctx, ball, ball.color);
            DrawUtils.drawCircleOutlineObject(ctx, ball, 'black');
        }

    }


}