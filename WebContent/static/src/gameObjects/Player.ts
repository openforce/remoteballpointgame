import {GameEngine} from '../engine/GameEngine.js';
import {Game} from '../game/Game.js';

import {RandomUtils} from '../utils/RandomUtils1.js';
import {CollisionUtils} from '../utils/CollisionUtils1.js';
import {GeometryUtils} from '../utils/GeometryUtils1.js';

import {Ball} from './Ball.js';
import {PlayerControlesState} from './syncObjects/PlayerControlesState.js';


export class Player {

    x:number;
    y:number;

    lastX:number;
    lastY:number;

    middleX:number;
    middleY:number;

    width:number;
    height:number;

    radius:number;
    rotation:number;

    actionCircleRadius:number;
    actionCircleX:number;
    actionCircleY:number;

    rightHand:Ball;
    leftHand:Ball;
    
    speed:number = 0.2;
    shootSpeed:number = 0.5;

    id:number;
    socketId:string;

    name:string;

    game:Game;

    static colors = ['blue', 'white', 'orange'];
    color:string;

    static genders = ['m', 'w'];
    gender:string;

    walkAnimationFrames:number = 2;
    walkAnimationCount:number = 0;
    walkAnimationTime:number = 200;
    walkAnimationTimeDif:number = 0;
    
    // controls 
    clickedLeft:boolean = false;
    clickedRight:boolean = false;

    clickedX:number;
    clickedY:number;

    moveUp:boolean;
    moveDown:boolean;
    moveLeft:boolean;
    moveRight:boolean;

    lookX:number;
    lookY:number;

    // Multplayer
    syncToServer:boolean;

    constructor(game:Game, x:number, y:number, name:string, color:string, gender:string, syncToServer:boolean){
        this.game = game;
        this.syncToServer = syncToServer;

        this.name = name;
        this.color = color;
        this.gender = gender;
        
        var date = Date.now();
        
        this.id = Number(date.toString() + RandomUtils.getRandomNumber(1,100).toString());

        this.x = x;
        this.y = y;
        
        this.width = 70;
        this.height = 60;
        
        this.middleX = this.x + this.width/2;
        this.middleY = this.y + this.height/2;
        
        this.radius = 30;
        this.rotation = 180;
        
        this.actionCircleRadius = 40;

        
        if(this.syncToServer) this.game.socket.emit('new player', this.getSyncObject());  
    }

    public getSyncObject(){
        var rightHandColor = null;
        var leftHandColor = null;

        if(this.rightHand != null) rightHandColor = this.rightHand.color;
        if(this.leftHand != null) leftHandColor = this.leftHand.color;

        return {
            id: this.id,
            socketId: this.socketId, 
            x: this.x,
            y: this.y,
            middleX: this.middleX,
            middleY: this.middleY,
            rotation: this.rotation,
            color: this.color,
            gender:this.gender,
            rightHand: rightHandColor,
            leftHand: leftHandColor,
            moveUp: this.moveUp,
            moveDown: this.moveDown,
            moveLeft: this.moveLeft,
            moveRight: this.moveRight,
            lookX: this.lookX,
            lookY: this.lookY,
            walkAnimationCount: this.walkAnimationCount,
            name: this.name
        }
    }
    
    public init(){
        //setInterval(this.sendStateToServer, 1000/60);

        setInterval(
            (function(self) {         //Self-executing func which takes 'this' as self
                return function() {   //Return a function in the context of 'self'
                    //console.log(self);
                    self.game.socket.emit('player sync', self.getSyncObject()); //Thing you wanted to run as non-window 'this'
                }
            })(this), 1000/60);
    }

    public syncPlayerState(player:any){
        this.id = player.id;
        this.x = player.x;
        this.y = player.y;
        this.socketId = player.socketId;
        this.middleX = player.middleX;
        this.middleY = player.middleY;
        this.rotation = player.rotation;
        this.color = player.color;
        this.gender = player.gender;
        this.moveUp = player.moveUp;
        this.moveDown = player.moveDown;
        this.moveLeft = player.moveLeft;
        this.moveRight = player.moveRight;
        this.lookX = player.lookX;
        this.lookY = player.lookY;
        this.walkAnimationCount = player.walkAnimationCount;
        this.name = player.name;

        if(player.rightHand != null) {
            if(this.rightHand == null) this.rightHand = new Ball(this.game, this.x, this.y, null);
            this.rightHand.color = player.rightHand;
        }else this.rightHand = null;

        if(player.leftHand != null) {
            if(this.leftHand == null) this.leftHand = new Ball(this.game, this.x, this.y, null);
            this.leftHand.color = player.leftHand;
        }else this.leftHand = null;
    }

    // CONTROLS

    // used in MODE_CLIENT
    public updateControls(){
        // W
        if(this.game.gameEngine.keys[87]) this.moveUp = true; 
        else this.moveUp = false;
        // A
        if(this.game.gameEngine.keys[65]) this.moveLeft = true; 
        else this.moveLeft = false;
        // S
        if(this.game.gameEngine.keys[83]) this.moveDown = true; 
        else this.moveDown = false;
        // D
        if(this.game.gameEngine.keys[68]) this.moveRight = true; 
        else this.moveRight = false;

        this.lookX = this.game.gameEngine.mousePosX;
        this.lookY = this.game.gameEngine.mousePosY;
    }

    // used in MODE_SIMULATION
    public setControles(controlesState:PlayerControlesState){
        this.moveUp = controlesState.moveUp;
        this.moveLeft = controlesState.moveLeft;
        this.moveDown = controlesState.moveDown;
        this.moveRight = controlesState.moveRight;

        this.lookX = controlesState.lookX;
        this.lookY = controlesState.lookY;

        this.clickedLeft = controlesState.clickedLeft;
        this.clickedRight = controlesState.clickedRight;
    }

    public checkClick(mouseX:number, mouseY:number, clickType:number){
        //console.log("clicked");
        
        if(clickType == Game.CLICK_LEFT) this.clickedLeft = true;
        if(clickType == Game.CLICK_RIGHT) this.clickedRight = true;

        this.clickedX = mouseX;
        this.clickedY = mouseY;

    }

    public checkMouseUp(clickType:number){
        //console.log("mouse up");

        if(clickType == Game.CLICK_LEFT) this.clickedLeft = false;
        if(clickType == Game.CLICK_RIGHT) this.clickedRight = false;
    }

    // LOGIC

    public update(timeDiff:number){

        // MOVEMENT
        if(this.moveUp) this.y -= this.speed * timeDiff;
        if(this.moveLeft) this.x -= this.speed * timeDiff;
        if(this.moveDown) this.y += this.speed * timeDiff;
        if(this.moveRight) this.x += this.speed * timeDiff;   

        this.walkAnimationTimeDif += timeDiff;

        this.middleX = this.x + this.width/2;
        this.middleY = this.y + this.height/2;

         // animation
         if(this.moveDown || this.moveLeft || this.moveRight || this.moveUp){
            if(this.walkAnimationTimeDif > this.walkAnimationTime){
                this.walkAnimationCount++;
                if(this.walkAnimationCount > this.walkAnimationFrames) this.walkAnimationCount = 1;
                this.walkAnimationTimeDif = 0;
            }
        }else this.walkAnimationCount = 0;


        // CHECK COLLISIONS
        var col = false;

        // Meeting Room
        if(this.middleX - this.radius <= this.game.meetingRoom.border) col = true; //left
        else if(this.middleY + this.radius >= GameEngine.CANVAS_HEIGHT - this.game.meetingRoom.border) col = true; //down
        else if(this.middleY - this.radius <= this.game.meetingRoom.border) col = true; //up
        else if(this.middleX + this.radius >= GameEngine.CANVAS_WIDTH - this.game.meetingRoom.border) col = true; //right

        //Flipchart
        else if(CollisionUtils.colCheckCirlces(this.middleX, this.middleY, this.radius, this.game.flipchart.middleX, this.game.flipchart.middleY, this.game.flipchart.radius)) col = true;
        
        //Timer
        else if(CollisionUtils.colCheckCirlces(this.middleX, this.middleY, this.radius, this.game.timer.middleX, this.game.timer.middleY, this.game.timer.radius)) col = true;
        
        //Baskets
        for(var i = 0; i < this.game.ballBaskets.length; i++){
            if(CollisionUtils.colCheckCirlces(this.middleX, this.middleY, this.radius, this.game.ballBaskets[i].x, this.game.ballBaskets[i].y, this.game.ballBaskets[i].radius)){
                col = true; 
                break;
            }  
        }
        
        //Balls
        for(var i = 0; i < this.game.balls.length; i++){
            if(this.id != this.game.balls[i].lastHolderId && this.game.balls[i].state == Ball.BALL_STATE_INAIR){
                if(CollisionUtils.colCheckCirlces(this.middleX, this.middleY, this.radius, this.game.balls[i].x, this.game.balls[i].y, this.game.balls[i].radius)){
                    col = true;
                    break;
                }
            }
        }
        
        //Players   
        for(var i = 0; i < this.game.players.length; i++){
			//if(colCheckCirlces(this.x, this.y, this.radius, players[i].middleX, players[i].middleY, players[i].radius)) col = true;
		}       


        // HANDLE COLLISIONS
        if(col){ // reset to last save position
            this.x = this.lastX;
            this.y = this.lastY;
            this.middleX = this.x + this.width/2;
            this.middleY = this.y + this.height/2;
        }else{ // save position
            this.lastX = this.x;
            this.lastY = this.y;
        }
        

        // OTHER STUFF
        this.rotation = -this.getShootAngle(this.lookX, this.lookY, this.x+this.width/2, this.y+this.height/2) - 90;

        this.setActionAreaCircle();

        if(this.rightHand != null){
            this.rightHand.x = this.middleX;
            this.rightHand.y = this.middleY;
        }

        if(this.leftHand != null){
            this.leftHand.x = this.middleX;
            this.leftHand.y = this.middleY;
        }

        if(this.clickedLeft){
            if(this.performAction(Game.CLICK_LEFT)) {
                this.clickedLeft = false;
            }
        }

        if(this.clickedRight){
            if(this.performAction(Game.CLICK_RIGHT)) {
                this.clickedRight = false;
            }
        }
    }

    public setActionAreaCircle(){
        var fAngle = GeometryUtils.degreeToRad(-this.rotation + 90);

        var diagonalDistX = (this.radius + this.actionCircleRadius) * (Math.cos(fAngle));
	    var diagonalDistY = -(this.radius + this.actionCircleRadius) * (Math.sin(fAngle));

        this.actionCircleX = this.middleX - diagonalDistX/3;
        this.actionCircleY = this.middleY - diagonalDistY/3;
    }
    

    public performAction(clickType:number) : boolean{

        if(clickType == Game.CLICK_LEFT && this.leftHand != null
            || clickType == Game.CLICK_RIGHT && this.rightHand != null) {
            
            //check BallBaskets
            for(var i = 0; i < this.game.ballBaskets.length; i++){
                if(CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.ballBaskets[i].x, this.game.ballBaskets[i].y, this.game.ballBaskets[i].radius)){
                    if(clickType == Game.CLICK_LEFT) this.leftHand = null;
                    if(clickType == Game.CLICK_RIGHT) this.rightHand = null;
                    
                    return true;
                }
            }
            
            this.shootBall(clickType);
            return true;

        } else { // nothing in Hand

            // check Balls
            for(var i = 0; i < this.game.balls.length; i++){
                if(CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.balls[i].x, this.game.balls[i].y, this.game.balls[i].radius)){
                    this.takeBall(this.game.balls[i], clickType);
                    this.game.balls.splice(i,1);
                    return true;
                }
            }

            //check BallBaskets
            for(var i = 0; i < this.game.ballBaskets.length; i++){
                if(CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.ballBaskets[i].x, this.game.ballBaskets[i].y, this.game.ballBaskets[i].radius)){
                    var newBall = this.game.ballBaskets[i].getNewBall();
                    newBall.x = this.middleX;
                    newBall.y = this.middleY;
                    this.takeBall(newBall, clickType);
                    return true;
                } 
            }

            //check Flipchart
            if(CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.flipchart.middleX, this.game.flipchart.middleY, this.game.flipchart.radius)){
                this.game.flipchart.triggerFlipchart();
                return true;
            }

            //check Timer
            if(CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.timer.middleX, this.game.timer.middleY, this.game.timer.radius)){
                this.game.timer.triggerTimer();
                return true;
            }
        }

        // nothing done
        return false;
    }

    public takeBall(ball:Ball, clickType:number){
 
        if(clickType == Game.CLICK_RIGHT) this.rightHand = ball;
        if(clickType == Game.CLICK_LEFT) this.leftHand = ball;

        ball.take(this);

        if(this.syncToServer) this.game.socket.emit('take ball', ball.getSyncObject());
    }

    public shootBall(clickType:number){
        var fAngle = GeometryUtils.degreeToRad(this.rotation + 90);

        if(clickType == Game.CLICK_RIGHT) this.rightHand.shoot(fAngle, this.shootSpeed);
        if(clickType == Game.CLICK_LEFT) this.leftHand.shoot(fAngle, this.shootSpeed);

        if(this.syncToServer) {
            if(clickType == Game.CLICK_RIGHT) this.game.socket.emit('throw ball', this.rightHand.getSyncObject());
            if(clickType == Game.CLICK_LEFT) this.game.socket.emit('throw ball', this.leftHand.getSyncObject());
        }

        if(clickType == Game.CLICK_RIGHT) this.game.balls.push(this.rightHand);
        if(clickType == Game.CLICK_LEFT) this.game.balls.push(this.leftHand);

        if(clickType == Game.CLICK_RIGHT) this.rightHand = null;
        if(clickType == Game.CLICK_LEFT) this.leftHand = null;

    }

    public getShootAngle(shootTargetX:number, shootTargetY:number, playerPosX:number, playerPosY:number){
        return GeometryUtils.getAngleBetweenToPoints(shootTargetX, shootTargetY, playerPosX, playerPosY);
    }

   
}