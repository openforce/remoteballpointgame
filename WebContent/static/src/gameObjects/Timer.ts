import {Game} from '../game/Game.js';

import {DrawUtils} from '../utils/DrawUtils1.js';


export class Timer {

    x: number;
    y: number;
    radius:number = 30;

    middleX:number;
    middleY:number;

    sprite:CanvasImageSource;
	spriteWidth:number = 72;
    spriteHeight:number = 85;

    targetTime:number = 120 * 1000; //2 Minuten
    startTime:number;
    playTime:number = 5; //120;

    game:Game;

    constructor(game:Game, x:number, y:number){
        
        this.game = game;
        
        this.x = x;
        this.y = y;

        this.middleX = this.x + this.spriteWidth/2;
        this.middleY = this.y + this.spriteHeight/2-15;

        if(this.game.ui){
            this.sprite = new Image();
            this.sprite.src = "/static/resources/timer.png";
        }

        this.game.socket.on('timer ended', function(){
            this.game.flipchart.triggerTimerEnded();
        });
    }

    public update(timeDiff:number){
        var now = new Date().getTime();
        var playedTime:number; 

        if(this.startTime == null) playedTime = 0;
        else playedTime = now - this.startTime;
        
        this.playTime = Math.round((this.targetTime - playedTime)/1000);

        if(this.playTime <= 0){
            if(this.game.arcadeMode){
                this.playTime = 0;
                this.game.flipchart.triggerTimerEnded();
            }else{
                this.playTime = 0;
            }

        }

    }

    public triggerTimer(){

        if(this.game.arcadeMode) return;
        else this.startTimer();
        
    }

    public startTimer(){
        if(this.startTime == null) this.startTime = new Date().getTime();
        else this.startTime = null;

        this.game.socket.emit('trigger timer');  
    }

    public draw(){
        if(!this.game.ui) return;

        var ctx = this.game.gameEngine.ctx;

        //BG
		ctx.drawImage(this.sprite,
			0, 0, this.spriteWidth, this.spriteHeight-30, // sprite cutout position and size
            this.x, this.y, this.spriteWidth, this.spriteHeight-10); 	 // draw position and size

        //playTime
	    ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = 'center';

        ctx.fillText("Time ", this.x + 40, this.y + 20);
        ctx.fillText(this.playTime.toString(), this.x + 40, this.y + 35);
        
        if(!this.game.arcadeMode && this.game.showPoints){
            ctx.fillText("Points ", this.x + 40, this.y + 55);
            ctx.fillText(this.game.points.toString(), this.x + 40, this.y + 70);
        }

        if(this.game.arcadeMode){
            if(this.game.gameState == Game.GAME_STATE_WARMUP){
            
                ctx.fillText('Warm', this.x + 40, this.y + 55);
                ctx.fillText('Up', this.x + 40, this.y + 70);
            
            }else if(this.game.gameState == Game.GAME_STATE_PREP){
            
                ctx.fillText('Prep.', this.x + 40, this.y + 55);
                ctx.fillText('Phase', this.x + 40, this.y + 70);
            
            }else if(this.game.gameState == Game.GAME_STATE_PLAY){
            
                ctx.fillText('Points', this.x + 40, this.y + 55);
                ctx.fillText(this.game.points.toString(), this.x + 40, this.y + 70);
            
            }
        }
        

        if(this.game.drawColliders) this.drawColider();
    }

    public drawColider(){
        DrawUtils.drawCyrcleOutline(this.game.gameEngine.ctx, this.middleX, this.middleY, this.radius, 'blue');
    }

    
}