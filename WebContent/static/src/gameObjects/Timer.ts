import { Game } from '../game/Game';
import { TimerState } from './syncObjects/TimerState';


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
    startTime:number = null;
    playTime:number = this.targetTime;

    game:Game;

    constructor(game:Game, x:number, y:number){
        
        this.game = game;
        
        this.x = x;
        this.y = y;

        this.middleX = this.x + this.width/2;
        this.middleY = this.y + this.height/2-15;

        if(this.game.gameSyncer != null){
            this.game.gameSyncer.socket.on('timer ended',(function(self) { //Self-executing func which takes 'this' as self
                return function() {                                        //Return a function in the context of 'self'
                    self.game.flipchart.triggerTimerEnded();               //Thing you wanted to run as non-window 'this'
                }
            })(this));
        }
    }

    public getSyncState(){
        var syncObject = new TimerState();

        syncObject.targetTime = this.targetTime;
        syncObject.startTime = this.startTime;
        syncObject.playTime = this.playTime;

        return syncObject;
    }

    public syncState(syncObject:TimerState){
        this.targetTime = syncObject.targetTime;
        this.startTime = syncObject.startTime;
        this.playTime = syncObject.playTime;
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

        if(this.game.gameSyncer != null) this.game.gameSyncer.socket.emit('trigger timer');  
    }

    
}