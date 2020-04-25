import { Game } from '../../game/Game';
import { Timer } from '../Timer';
import { DrawUtils } from '../../utils/DrawUtils1';


export class TimerDrawer {

    sprite: CanvasImageSource;


    constructor() {

        this.sprite = new Image();
        this.sprite.src = "/static/resources/timer.png";

    }


    public draw(ctx: CanvasRenderingContext2D, timer: Timer) {

        //BG
        ctx.drawImage(this.sprite,
            0, 0, timer.width, timer.height - 30, // sprite cutout position and size
            timer.x, timer.y, timer.width, timer.height - 10); 	 // draw position and size

        //playTime
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = 'center';

        ctx.fillText("Time ", timer.x + 40, timer.y + 20);
        ctx.fillText(timer.playTime.toString(), timer.x + 40, timer.y + 35);

        if (!timer.game.arcadeMode && timer.game.showPoints) {
            ctx.fillText("Points ", timer.x + 40, timer.y + 55);
            ctx.fillText(timer.game.points.toString(), timer.x + 40, timer.y + 70);
        }

        if (timer.game.arcadeMode) {
            if (timer.game.gameState == Game.GAME_STATE_WARMUP) {

                ctx.fillText('Warm', timer.x + 40, timer.y + 55);
                ctx.fillText('Up', timer.x + 40, timer.y + 70);

            } else if (timer.game.gameState == Game.GAME_STATE_PREP) {

                ctx.fillText('Prep.', timer.x + 40, timer.y + 55);
                ctx.fillText('Phase', timer.x + 40, timer.y + 70);

            } else if (timer.game.gameState == Game.GAME_STATE_PLAY) {

                ctx.fillText('Points', timer.x + 40, timer.y + 55);
                ctx.fillText(timer.game.points.toString(), timer.x + 40, timer.y + 70);

            }
        }


        if (timer.game.drawColliders) this.drawColider(ctx, timer);
    }

    public drawColider(ctx: CanvasRenderingContext2D, timer: Timer) {
        DrawUtils.drawCyrcleOutline(ctx, timer.middleX, timer.middleY, timer.radius, 'blue');
    }


}