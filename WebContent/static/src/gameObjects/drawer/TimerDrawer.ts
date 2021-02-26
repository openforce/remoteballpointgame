import { Game } from '../../game/Game';
import { Timer } from '../Timer';
import { DrawUtils } from '../../utils/DrawUtils1';
import { RandomUtils } from '../../utils/RandomUtils1';


export class TimerDrawer {

    sprite: CanvasImageSource;


    constructor() {

        this.sprite = new Image();
        this.sprite.src = "/static/resources/timer.png";

    }


    public draw(ctx: CanvasRenderingContext2D, timer: Timer) {

        // animation based on time
        var animationCount = (timer.playTime % 2);

        var width = timer.width + (animationCount * 3);
        var height = timer.height + (animationCount * 3);

        var ringPosModifikator = 0;
        if(timer.playTime == 0) ringPosModifikator = RandomUtils.getRandomNumber(-2, 2);
        
        ctx.translate(timer.x + timer.width / 2, timer.y + timer.height / 2);

        ctx.drawImage(this.sprite,
            0, 0, timer.width, timer.height,          
            (-width / 2) + ringPosModifikator, (-height / 2) + ringPosModifikator, width, height);
        

        //playTime
        ctx.fillStyle = "black";

        if (animationCount == 0) ctx.font = "bold 16px Arial";
        else if (animationCount == 1) ctx.font = "bold 18px Arial";
        
        ctx.textAlign = 'center';

        ctx.fillText("Time ", 0 + ringPosModifikator, -5 + ringPosModifikator);
        
        if (timer.playTime <  10) ctx.fillStyle = "red";
        ctx.fillText(timer.playTime.toString(), 0 + ringPosModifikator, 0 + 15 + ringPosModifikator);

        if (!timer.game.arcadeMode && timer.game.showPoints) {
            ctx.fillText("Points ", 0, 0 + 55/2);
            ctx.fillText(timer.game.points.toString(), 0, 0 + 70/2);
        }

        ctx.translate(-timer.x - timer.width / 2, -timer.y - timer.height / 2);


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
        DrawUtils.drawCircleOutlineObject(ctx, timer.getCollider(), 'blue');
    }


}