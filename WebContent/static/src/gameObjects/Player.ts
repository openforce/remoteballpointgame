import { GameEngine } from '../engine/GameEngine';
import { Game } from '../game/Game';
import { GameSyncer } from '../game/syncer/GameSyncer';
import { Inputs } from '../game/Inputs';

import { RandomUtils } from '../utils/RandomUtils1';
import { CollisionUtils } from '../utils/CollisionUtils1';
import { GeometryUtils } from '../utils/GeometryUtils1';

import { Ball } from './Ball';
import { PlayerInputState } from './syncObjects/PlayerInputState';
import { PlayerState } from './syncObjects/PlayerState';
import { throws } from 'assert';


export class Player {

    static HAND_LEFT = 0;
    static HAND_RIGHT = 1;

    static colors = ['blue', 'white', 'orange'];
    static genders = ['m', 'w'];


    id: number;

    x: number;
    y: number;

    lastX: number;
    lastY: number;

    middleX: number;
    middleY: number;

    width: number;
    height: number;

    radius: number;
    rotation: number;

    actionCircleRadius: number = 25;
    actionCircleX: number;
    actionCircleY: number;

    rightHand: Ball;
    leftHand: Ball;

    speed: number = 0.2;
    shootSpeed: number = 0.5;

    socketId: string;

    name: string;
    color: string;
    gender: string;

    game: Game;

    walkAnimationFrames: number = 2;
    walkAnimationCount: number = 0;
    walkAnimationTime: number = 200;
    walkAnimationTimeDif: number = 0;

    // controls 

    inputState: PlayerInputState;

    clickedLeft: boolean = false;
    clickedRight: boolean = false;

    clickedLeftTimeStemp = 0;
    clickedRightTimeStemp = 0;

    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;

    lookX: number;
    lookY: number;

    constructor(game: Game, x: number, y: number, name: string, color: string, gender: string) {
        this.game = game;

        this.name = name;
        this.color = color;
        this.gender = gender;

        var date = Date.now();

        this.id = Number(date.toString() + RandomUtils.getRandomNumber(1, 100).toString());

        this.x = x;
        this.y = y;

        this.width = 70;
        this.height = 60;

        this.middleX = this.x + this.width / 2;
        this.middleY = this.y + this.height / 2;

        this.radius = 30;
        this.rotation = 180;

        this.inputState = new PlayerInputState();
        this.inputState.playerId = this.id;
    }


    public init() {

    }

    public getSyncState() {
        var syncObject = new PlayerState();

        syncObject.socketId = this.socketId;

        syncObject.id = this.id;
        syncObject.x = this.x;
        syncObject.y = this.y;
        syncObject.middleX = this.middleX;
        syncObject.middleY = this.middleY;
        syncObject.rotation = this.rotation;

        syncObject.name = this.name;
        syncObject.gender = this.gender;
        syncObject.color = this.color;

        syncObject.moveUp = this.moveUp;
        syncObject.moveDown = this.moveDown;
        syncObject.moveLeft = this.moveLeft;
        syncObject.moveRight = this.moveRight;

        syncObject.lookX = this.lookX;
        syncObject.lookY = this.lookY;
        syncObject.walkAnimationCount = this.walkAnimationCount;

        if (this.rightHand != null) syncObject.rightHand = this.rightHand.color;
        if (this.leftHand != null) syncObject.leftHand = this.leftHand.color;

        return syncObject;
    }


    public syncState(player: PlayerState) {

        if (this.socketId == null) this.socketId = player.socketId;

        this.id = player.id;
        this.x = player.x;
        this.y = player.y;
        this.middleX = player.middleX;
        this.middleY = player.middleY;
        this.rotation = player.rotation;

        this.name = player.name;
        this.gender = player.gender;
        this.color = player.color;

        this.moveUp = player.moveUp;
        this.moveDown = player.moveDown;
        this.moveLeft = player.moveLeft;
        this.moveRight = player.moveRight;
        this.lookX = player.lookX;
        this.lookY = player.lookY;

        this.walkAnimationCount = player.walkAnimationCount;

        if (player.rightHand != null) {
            if (this.rightHand == null) this.rightHand = new Ball(this.game, this.x, this.y, player.rightHand);
        } else this.rightHand = null;

        if (player.leftHand != null) {
            if (this.leftHand == null) this.leftHand = new Ball(this.game, this.x, this.y, player.leftHand);
        } else this.leftHand = null;
    }

    // CONTROLS

    // used in MODE_CLIENT
    public updateInputs(inputs: Inputs) {

        // W
        if (inputs.keys[87]) this.inputState.up = true;
        else this.inputState.up = false;
        // A
        if (inputs.keys[65]) this.inputState.left = true;
        else this.inputState.left = false;
        // S
        if (inputs.keys[83]) this.inputState.down = true;
        else this.inputState.down = false;
        // D
        if (inputs.keys[68]) this.inputState.right = true;
        else this.inputState.right = false;

        this.inputState.mouseX = inputs.mousePosX;
        this.inputState.mouseY = inputs.mousePosY;

        this.inputState.clickedLeft = inputs.clickedLeft;
        this.inputState.clickedRight = inputs.clickedRight;

        this.inputState.clickedLeftTimeStemp = inputs.clickedLeftTimeStemp;
        this.inputState.clickedRightTimeStemp = inputs.clickedRightTimeStemp;

    }

    // used in MODE_SIMULATION
    public setControlesFromInputState() {

        this.moveUp = this.inputState.up;
        this.moveLeft = this.inputState.left;
        this.moveDown = this.inputState.down;
        this.moveRight = this.inputState.right;

        this.lookX = this.inputState.mouseX;
        this.lookY = this.inputState.mouseY;


        if (this.inputState.clickedLeft && this.inputState.clickedLeftTimeStemp > this.clickedLeftTimeStemp) {
            this.clickedLeft = true;
            this.clickedLeftTimeStemp = this.inputState.clickedLeftTimeStemp;
        } else if (!this.inputState.clickedLeft) {
            this.clickedLeft = false;
        }

        if (this.inputState.clickedRight && this.inputState.clickedRightTimeStemp > this.clickedRightTimeStemp) {
            this.clickedRight = true;
            this.clickedRightTimeStemp = this.inputState.clickedRightTimeStemp;
        } else if (!this.inputState.clickedRight) {
            this.clickedRight = false;
        }

    }


    // LOGIC

    public update(timeDiff: number) {

        // MOVEMENT
        if (this.moveUp) this.y -= this.speed * timeDiff;
        if (this.moveLeft) this.x -= this.speed * timeDiff;
        if (this.moveDown) this.y += this.speed * timeDiff;
        if (this.moveRight) this.x += this.speed * timeDiff;

        this.walkAnimationTimeDif += timeDiff;

        this.middleX = this.x + this.width / 2;
        this.middleY = this.y + this.height / 2;

        // animation
        if (this.moveDown || this.moveLeft || this.moveRight || this.moveUp) {
            if (this.walkAnimationTimeDif > this.walkAnimationTime) {
                this.walkAnimationCount++;
                if (this.walkAnimationCount > this.walkAnimationFrames) this.walkAnimationCount = 1;
                this.walkAnimationTimeDif = 0;
            }
        } else this.walkAnimationCount = 0;


        // CHECK COLLISIONS
        var col = false;

        // Meeting Room
        if (this.middleX - this.radius <= this.game.meetingRoom.border) col = true; //left
        else if (this.middleY + this.radius >= GameEngine.CANVAS_HEIGHT - this.game.meetingRoom.border) col = true; //down
        else if (this.middleY - this.radius <= this.game.meetingRoom.border) col = true; //up
        else if (this.middleX + this.radius >= GameEngine.CANVAS_WIDTH - this.game.meetingRoom.border) col = true; //right

        //Flipchart
        else if (CollisionUtils.colCheckCirlces(this.middleX, this.middleY, this.radius, this.game.flipchart.middleX, this.game.flipchart.middleY, this.game.flipchart.radius)) col = true;

        //Timer
        else if (CollisionUtils.colCheckCirlces(this.middleX, this.middleY, this.radius, this.game.timer.middleX, this.game.timer.middleY, this.game.timer.radius)) col = true;

        //Baskets
        for (var i = 0; i < this.game.ballBaskets.length; i++) {
            if (CollisionUtils.colCheckCirlces(this.middleX, this.middleY, this.radius, this.game.ballBaskets[i].x, this.game.ballBaskets[i].y, this.game.ballBaskets[i].radius)) {
                col = true;
                break;
            }
        }

        //Balls
        for (var id in this.game.balls) {
            if (this.id != this.game.balls[id].lastHolderId && this.game.balls[id].state == Ball.BALL_STATE_INAIR) {
                if (CollisionUtils.colCheckCirlces(this.middleX, this.middleY, this.radius, this.game.balls[id].x, this.game.balls[id].y, this.game.balls[id].radius)) {
                    col = true;
                    break;
                }
            }
        }

        //Players   
        for (var id in this.game.players) {
            //if(colCheckCirlces(this.x, this.y, this.radius, players[id].middleX, players[id].middleY, players[id].radius)) col = true;
        }


        // HANDLE COLLISIONS
        if (col) { // reset to last save position
            this.x = this.lastX;
            this.y = this.lastY;
            this.middleX = this.x + this.width / 2;
            this.middleY = this.y + this.height / 2;
        } else { // save position
            this.lastX = this.x;
            this.lastY = this.y;
        }


        // OTHER STUFF
        this.rotation = -this.getShootAngle(this.lookX, this.lookY, this.x + this.width / 2, this.y + this.height / 2) - 90;

        this.setActionAreaCircle();

        if (this.rightHand != null) {
            this.rightHand.x = this.middleX;
            this.rightHand.y = this.middleY;
        }

        if (this.leftHand != null) {
            this.leftHand.x = this.middleX;
            this.leftHand.y = this.middleY;
        }

        if (this.clickedLeft) {
            if (this.performAction(Player.HAND_LEFT)) {
                this.clickedLeft = false;
            }
        }

        if (this.clickedRight) {
            if (this.performAction(Player.HAND_RIGHT)) {
                this.clickedRight = false;
            }
        }

        this.automaticCatch();
    }

    public automaticCatch() {
        for (var id in this.game.balls) {
            if (this.id != this.game.balls[id].lastHolderId && this.game.balls[id].state == Ball.BALL_STATE_INAIR
                && (this.rightHand == null || this.leftHand == null)
                && CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.balls[id].x, this.game.balls[id].y, this.game.balls[id].radius)) {

                if (this.leftHand == null) {
                    this.takeBall(this.game.balls[id], Player.HAND_LEFT);
                    delete this.game.balls[id];
                } else if (this.rightHand == null) {
                    this.takeBall(this.game.balls[id], Player.HAND_RIGHT);
                    delete this.game.balls[id];
                }

            }
        }
    }

    public setActionAreaCircle() {
        var fAngle = GeometryUtils.degreeToRad(-this.rotation + 90);

        var diagonalDistX = (this.radius + this.actionCircleRadius) * (Math.cos(fAngle));
        var diagonalDistY = -(this.radius + this.actionCircleRadius) * (Math.sin(fAngle));

        this.actionCircleX = this.middleX - diagonalDistX / 3;
        this.actionCircleY = this.middleY - diagonalDistY / 3;
    }


    public performAction(hand: number): boolean {

        if (hand == Player.HAND_LEFT && this.leftHand != null
            || hand == Player.HAND_RIGHT && this.rightHand != null) {

            //check BallBaskets
            for (var i = 0; i < this.game.ballBaskets.length; i++) {
                if (CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.ballBaskets[i].x, this.game.ballBaskets[i].y, this.game.ballBaskets[i].radius)) {
                    if (hand == Player.HAND_LEFT) this.leftHand = null;
                    if (hand == Player.HAND_RIGHT) this.rightHand = null;

                    return true;
                }
            }

            this.shootBall(hand);
            return true;

        } else { // nothing in Hand

            // check Balls
            for (var id in this.game.balls) {
                if (CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.balls[id].x, this.game.balls[id].y, this.game.balls[id].radius)) {
                    this.takeBall(this.game.balls[id], hand);
                    delete this.game.balls[id];
                    return true;
                }
            }

            //check BallBaskets
            for (var i = 0; i < this.game.ballBaskets.length; i++) {
                if (CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.ballBaskets[i].x, this.game.ballBaskets[i].y, this.game.ballBaskets[i].radius)) {
                    var newBall = this.game.ballBaskets[i].getNewBall();
                    newBall.x = this.middleX;
                    newBall.y = this.middleY;
                    this.takeBall(newBall, hand);
                    return true;
                }
            }

            //check Flipchart
            if (CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.flipchart.middleX, this.game.flipchart.middleY, this.game.flipchart.radius)) {
                this.game.flipchart.triggerFlipchart(this.id);
                return true;
            }

            //check Timer
            if (CollisionUtils.colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.timer.middleX, this.game.timer.middleY, this.game.timer.radius)) {
                this.game.timer.triggerTimer();
                return true;
            }
        }

        // nothing done
        return false;
    }

    public takeBall(ball: Ball, hand: number) {

        if (hand == Player.HAND_RIGHT) this.rightHand = ball;
        if (hand == Player.HAND_LEFT) this.leftHand = ball;

        ball.take(this);

        this.game.addEvent('take ball', ball.getSyncState());
    }



    public shootBall(hand: number) {
        var fAngle = GeometryUtils.degreeToRad(this.rotation + 90);

        var ballInHand: Ball;

        if (hand == Player.HAND_RIGHT) ballInHand = this.rightHand;
        if (hand == Player.HAND_LEFT) ballInHand = this.leftHand;

        ballInHand.shoot(fAngle, this.shootSpeed);
        this.game.addEvent('throw ball', ballInHand.getSyncState());
        this.game.balls[ballInHand.id] = ballInHand;

        if (hand == Player.HAND_RIGHT) this.rightHand = null;
        if (hand == Player.HAND_LEFT) this.leftHand = null;
    }

    public getShootAngle(shootTargetX: number, shootTargetY: number, playerPosX: number, playerPosY: number) {
        return GeometryUtils.getAngleBetweenToPoints(shootTargetX, shootTargetY, playerPosX, playerPosY);
    }


}