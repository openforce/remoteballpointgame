import { Player } from "../Player";
import { DrawUtils } from "../../utils/DrawUtils1";


export class PlayerDrawer {

    sprites: CanvasImageSource[][];
    spriteWidth: number = 218;
    spriteHeight: number = 170;


    constructor() {

        this.sprites = [];

        // erste Dimension --> Player Typ
        // zweite Dimension --> Animationen

        var animationSteps = ['stand', 'walk1', 'walk2'];

        for (var i = 0; i < Player.genders.length; i++) {
            for (var j = 0; j < Player.colors.length; j++) {

                //@ts-ignore
                this.sprites[Player.genders[i] + Player.colors[j]] = [];
                for (var k = 0; k < Player.colors.length; k++) {

                    var pngPath = '/static/resources/person_' + Player.genders[i] + '_' + Player.colors[j] + '_' + animationSteps[k] + '.png';

                    //@ts-ignore
                    this.sprites[Player.genders[i] + Player.colors[j]][k] = new Image();
                    // @ts-ignore
                    this.sprites[Player.genders[i] + Player.colors[j]][k].src = pngPath;

                }

            }
        }

    }


    public draw(ctx: CanvasRenderingContext2D, player: Player) {

        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.rotate(player.rotation * Math.PI / 180);

        // @ts-ignore
        ctx.drawImage(this.sprites[player.gender + player.color][player.walkAnimationCount],
            0, 0, this.spriteWidth, this.spriteHeight, // sprite cutout position and size
            -player.width / 2, -player.height / 2, player.width, player.height); // draw position and size

        if (player.leftHand != null) {
            var myBall = player.leftHand;

            DrawUtils.drawCyrcle(ctx, 13, 13, myBall.radius + 1, 'black');
            DrawUtils.drawCyrcle(ctx, 13, 13, myBall.radius, myBall.color);

        }

        if (player.rightHand != null) {
            var myBall = player.rightHand;

            DrawUtils.drawCyrcle(ctx, -13, 15, myBall.radius + 1, 'black');
            DrawUtils.drawCyrcle(ctx, -13, 15, myBall.radius, myBall.color);
        }


        ctx.rotate(-player.rotation * Math.PI / 180);
        ctx.translate(-player.x - player.width / 2, -player.y - player.height / 2);

        this.drawName(ctx, player);

        if (player.game.drawColliders) this.drawActionArea(ctx, player);

    }

    public drawName(ctx: CanvasRenderingContext2D, player: Player) {

        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.name, player.middleX, player.y + player.height + 10);
        ctx.textAlign = 'left';
    }

    public drawActionArea(ctx: CanvasRenderingContext2D, player: Player) {
        DrawUtils.drawCyrcleOutline(ctx, player.middleX, player.middleY, player.radius, 'blue');
        DrawUtils.drawCyrcleOutline(ctx, player.actionCircleX, player.actionCircleY, player.actionCircleRadius, 'green');
    }

}