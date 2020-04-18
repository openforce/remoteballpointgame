import {GameEngine} from "../../engine/GameEngine";
import {MeetingRoom} from "../MeetingRoom";

export class MeetingRoomDrawer {

    spriteBG:CanvasImageSource;
	spriteBGWidth:number;
    spriteBGHeight:number;
    
    constructor(){
        
        this.spriteBG = new Image();
        this.spriteBG.src = "/static/resources/meetingroom2.png";
        
        this.spriteBGWidth = 1024;
        this.spriteBGHeight = 768;
        
    }

    
    public draw(ctx:CanvasRenderingContext2D, meetingRoom:MeetingRoom){

        //BG
		ctx.drawImage(this.spriteBG,
			0, 0, this.spriteBGWidth, this.spriteBGHeight, // sprite cutout position and size
            0, 0, 900, 1000); 	 // draw position and size
            
        if(meetingRoom.game.drawColliders) this.drawBorder(ctx, meetingRoom);
    }

    public drawBorder(ctx:CanvasRenderingContext2D, meetingRoom:MeetingRoom){
       
        //draw border
        ctx.beginPath();
		ctx.strokeStyle = 'blue';
		ctx.rect(meetingRoom.border, meetingRoom.border, GameEngine.CANVAS_WIDTH - meetingRoom.border*2, GameEngine.CANVAS_HEIGHT - meetingRoom.border*2);
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.closePath();
    }

    
}