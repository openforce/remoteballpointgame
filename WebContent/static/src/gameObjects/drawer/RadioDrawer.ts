import { Game } from '../../game/Game';
import { Radio } from '../Radio';

import { DrawUtils } from '../../utils/DrawUtils1';
import { GeometryUtils } from '../../utils/GeometryUtils1';


export class RadioDrawer {

    sprite: CanvasImageSource;


    constructor() {

        this.sprite = new Image();
        this.sprite.src = "/static/resources/radio.png";

    }


    public draw(ctx: CanvasRenderingContext2D, radio: Radio) {

        ctx.translate(radio.x + radio.width / 2, radio.y + radio.height / 2);
        ctx.rotate(GeometryUtils.degreeToRad(radio.rotation));
        
        var width = radio.width + (radio.animationState.playAnimationCount * 3);
        var height = radio.height + (radio.animationState.playAnimationCount * 3);

        ctx.drawImage(this.sprite,
            0, 0, 157, 79, // sprite cutout position and size
            -width / 2, -height / 2, width, height); 	 // draw position and size

        ctx.rotate(GeometryUtils.degreeToRad(-radio.rotation));
        ctx.translate(-radio.x - radio.width / 2, -radio.y - radio.height / 2);


        //if (radio.on) this.drawMusic(ctx, radio);
        if (radio.game.drawColliders) this.drawColider(ctx, radio);
    }
    

    public drawMusic(ctx: CanvasRenderingContext2D, radio: Radio) {
        //playTime
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = 'center';

        if (radio.on) {
            ctx.fillText("lalalala ", radio.x + 30, radio.y - 10);
        }
    }


    public drawColider(ctx: CanvasRenderingContext2D, radio: Radio) {
        DrawUtils.drawCircleOutlineObject(ctx, radio.getCollider(), 'blue');
    }


}