import { GameEngine } from "../../engine/GameEngine";
import { DrawUtils } from "../../utils/DrawUtils1";
import { MeetingRoom } from "../MeetingRoom";

export class MeetingRoomDrawer {

    spriteBG: CanvasImageSource;
    spriteBGWidth: number;
    spriteBGHeight: number;

    constructor() {

        this.spriteBG = new Image();
        this.spriteBG.src = "/static/resources/meetingroom2.png";

        this.spriteBGWidth = 1024;
        this.spriteBGHeight = 768;

    }


    public draw(ctx: CanvasRenderingContext2D, meetingRoom: MeetingRoom) {

        //BG
        ctx.drawImage(this.spriteBG,
            0, 0, this.spriteBGWidth, this.spriteBGHeight, // sprite cutout position and size
            0, 0, 900, 1000); 	 // draw position and size

        if (meetingRoom.game.drawColliders) {
            this.drawColliders(ctx, meetingRoom);
        }
    }

    public drawColliders(ctx: CanvasRenderingContext2D, meetingRoom: MeetingRoom) {

        for(var id in meetingRoom.colliders){
            DrawUtils.drawRectObject(ctx, meetingRoom.colliders[id], 'blue');
        }

    }
    

}