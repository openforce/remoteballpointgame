import {Game} from '../game/Game.js';
import {GameEngine} from '../engine/GameEngine.js';


export class MeetingRoom {

    game:Game;

    border:number = 100;

    spriteBG:CanvasImageSource;
	spriteBGWidth:number;
    spriteBGHeight:number;
    
    constructor(game:Game){
        this.game = game;
        
        if(this.game != null && this.game.ui){
            this.spriteBG = new Image();
            this.spriteBG.src = "/static/resources/meetingroom2.png";
            
            this.spriteBGWidth = 1024;
            this.spriteBGHeight = 768;
        }
    }

    
    public update(timeDiff:number){
       
    }

    public draw(){
        if(!this.game.ui) return;

        var ctx = this.game.gameEngine.ctx;

        //BG
		ctx.drawImage(this.spriteBG,
			0, 0, this.spriteBGWidth, this.spriteBGHeight, // sprite cutout position and size
            0, 0, 900, 1000); 	 // draw position and size
            
        if(this.game.drawColliders) this.drawBorder();
    }

    public drawBorder(){
        var ctx = this.game.gameEngine.ctx;
        //draw border
        ctx.beginPath();
		ctx.strokeStyle = 'blue';
		ctx.rect(this.border, this.border, GameEngine.CANVAS_WIDTH - this.border*2, GameEngine.CANVAS_HEIGHT - this.border*2);
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.closePath();
    }

    
}