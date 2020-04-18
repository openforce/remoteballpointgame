import {Game} from '../game/Game.js';


export class Timer {

    x: number;
    y: number;
    radius:number = 30;

    middleX:number;
    middleY:number;

    sprite:CanvasImageSource;
	width:number = 72;
    height:number = 85;

    targetTime:number = 120 * 1000; //2 Minuten
    startTime:number;
    playTime:number = 5; //120;

    game:Game;

    constructor(game:Game, x:number, y:number){
        
        this.game = game;
        
        this.x = x;
        this.y = y;

        this.middleX = this.x + this.width/2;
        this.middleY = this.y + this.height/2-15;

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

    
}