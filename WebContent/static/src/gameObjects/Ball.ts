import { GameEngine } from '../engine/GameEngine';
import { Game } from '../game/Game';

import { RandomUtils } from '../utils/RandomUtils1';
import { CollisionUtils } from '../utils/CollisionUtils1';
import { GeometryUtils } from '../utils/GeometryUtils1';

import { Player } from './Player';
import { BallState } from './syncObjects/BallState';


export class Ball {
    
    static BALL_STATE_ONGROUND = 0;
    static BALL_STATE_INAIR = 1;
    static BALL_STATE_FALLING = 2;
    static BALL_STATE_TAKEN = 3;

    static colors = ['blue', 'white', 'orange', 'red', 'yellow'];
    
    id:number;

    x:number;
    y:number;

    lastX:number;
    lastY:number;

    radius:number;

    color:string;

    speedX:number;
    speedY:number;

    state:number;
    lastState:number;

    lastSyncState:number;

    game:Game;

    lastHolderId:number;
    touchedBy:number[];


    constructor(game:Game, x:number, y:number, color:string){
        this.game = game;

        var date = Date.now();
        this.id = Number(date.toString() + RandomUtils.getRandomNumber(1,100).toString());
        
        this.x = x;
        this.y = y;

        this.radius = 7;
        
        if(color == null) this.color = RandomUtils.getRandomEntryFromNumberedArray(Ball.colors);
        else this.color = color;

        this.speedX = 0;
        this.speedY = 0;

        this.touchedBy = [];
    }


    public sendStateToServer(){
        if(this.lastHolderId == this.game.player.id && this.state != Ball.BALL_STATE_TAKEN &&
            (this.state != Ball.BALL_STATE_ONGROUND || this.lastSyncState != Ball.BALL_STATE_ONGROUND)){ 
            
            if(this.game.gameSyncer != null) this.game.gameSyncer.socket.emit('sync ball', this.getSyncState());
            this.lastSyncState = this.state;

        }
    }

    public getSyncState(){
        var syncObject = new BallState();
       
        syncObject.id = this.id;
        syncObject.x = this.x;
        syncObject.y = this.y;
        syncObject.lastX = this.lastX;
        syncObject.lastY = this.lastY;
        syncObject.color = this.color;
        syncObject.speedX = this.speedX;
        syncObject.speedY = this.speedY;
        syncObject.state = this.state;
        syncObject.lastState = this.lastState;
        syncObject.lastHolderId = this.lastHolderId;
        syncObject.touchedBy = this.touchedBy;
        
        return syncObject;
    }

    public syncBallState(serverBall:BallState){
        this.id = serverBall.id;
        this.x = serverBall.x;
        this.y = serverBall.y;
        this.lastX = serverBall.lastX;
        this.lastY = serverBall.lastY;
        this.color = serverBall.color;
        this.speedX = serverBall.speedX;
        this.speedY = serverBall.speedY;
        this.state = serverBall.state;
        this.lastState = serverBall.lastState;
        this.lastX = serverBall.x;
        this.lastY = serverBall.y;
        this.lastHolderId = serverBall.lastHolderId;
        this.touchedBy = serverBall.touchedBy;
    }
    
    public init(){

    }


    // LOGIC

    public update(timeDiff:number){

        // MOVEMENT
        this.x += this.speedX * timeDiff;
        this.y += this.speedY * timeDiff;

        if(this.state == Ball.BALL_STATE_FALLING){
            this.speedX *= 0.9;
            this.speedY *= 0.9;

            if(Math.abs(this.speedX) < 0.01) this.speedX = 0;
            if(Math.abs(this.speedY) < 0.01) this.speedY = 0;

            if(this.speedX == 0 && this.speedY == 0) {
                this.changeStateTo(Ball.BALL_STATE_ONGROUND);
            }

        }
        
        // CHECK COLLISIONS
        var col = false;
        if(this.game != null) col = this.checkCollisions();

        // HANDLE COLLISIONS
        if(col){ // reset to last save position
            this.x = this.lastX;
            this.y = this.lastY;

            this.speedX *= -0.6;
            this.speedY *= -0.6;
            this.changeStateTo(Ball.BALL_STATE_FALLING);

        }else{ // save position
            this.lastX = this.x;
            this.lastY = this.y;
        }

    }

    public checkCollisions(){
        var col = false;
        
        // Meeting Room
        if(this.x - this.radius <= this.game.meetingRoom.border) col = true; //left
        else if(this.y + this.radius >= GameEngine.CANVAS_HEIGHT - this.game.meetingRoom.border) col = true; //down
        else if(this.y - this.radius <= this.game.meetingRoom.border) col = true; //up
        else if(this.x + this.radius >= GameEngine.CANVAS_WIDTH - this.game.meetingRoom.border) col = true; //right

        
        //Flipchart
        else if(CollisionUtils.colCheckCirlces(this.x, this.y, this.radius, this.game.flipchart.middleX, this.game.flipchart.middleY, this.game.flipchart.radius)) col = true;
        
        //Timer
        else if(CollisionUtils.colCheckCirlces(this.x, this.y, this.radius, this.game.timer.middleX, this.game.timer.middleY, this.game.timer.radius)) col = true;
        
        //Baskets
        for(var i = 0; i < this.game.ballBaskets.length; i++){
            if(CollisionUtils.colCheckCirlces(this.x, this.y, this.radius, this.game.ballBaskets[i].x, this.game.ballBaskets[i].y, this.game.ballBaskets[i].radius)){
                col = true; 
                break;
            }  
        }

        //Players   
        if(this.game.player != null && this.lastHolderId != this.game.player.id && CollisionUtils.colCheckCirlces(this.x, this.y, this.radius, this.game.player.middleY, this.game.player.middleX, this.game.player.radius)) col = true;
        for(var id in this.game.players){
			if(this.lastHolderId != this.game.players[id].id && CollisionUtils.colCheckCirlces(this.x, this.y, this.radius, this.game.players[id].middleX, this.game.players[id].middleY, this.game.players[id].radius)) col = true;
        }  
        
        return col;
    }


    public changeStateTo(newState:number){
        //console.log('changeStateTo: ' + newState);
        this.lastState = this.state;
        this.state = newState;

        if(newState == Ball.BALL_STATE_ONGROUND){
            this.touchedBy = [];
        }
    }

    public take(player:Player){
        this.changeStateTo(Ball.BALL_STATE_TAKEN);
        this.speedX = 0;
        this.speedY = 0;
        
        this.lastHolderId = player.id;
        this.touchedBy.push(player.id);

        var touchedByEverybody = true;
        for(var id in this.game.players){
            var touchedByPlayer = false;
            for(var ti = 0; ti < this.touchedBy.length; ti++){
                if(this.touchedBy[ti] == this.game.players[id].id) {
                    touchedByPlayer = true;
                    break;
                }
            }
            if(!touchedByPlayer){
                touchedByEverybody = false;
                break;
            }
        }
        if(touchedByEverybody){
            //console.log('touched by everybody');
            if(this.game.gameSyncer != null) this.game.gameSyncer.socket.emit('add Point');
            this.touchedBy = [];
        }
    }

    public shoot(shootAngle:number, shootSpeed:number){
        this.speedX = shootSpeed * (Math.cos(shootAngle));
        this.speedY = shootSpeed * (Math.sin(shootAngle));

        this.changeStateTo(Ball.BALL_STATE_INAIR);
    }

    public getShootAngle(shootTargetX:number, shootTargetY:number, playerPosX:number, playerPosY:number){
        return GeometryUtils.getAngleBetweenToPoints(shootTargetX, shootTargetY, playerPosX, playerPosY);
    }

}