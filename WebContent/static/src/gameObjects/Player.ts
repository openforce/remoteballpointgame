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
import { GameConfigs } from '../game/Configs';


export class Player {

    static HAND_LEFT = 0;
    static HAND_RIGHT = 1;

    static colors = ['blue', 'white', 'orange'];
    static genders = ['m', 'w'];

    static CONTROLE_MODE_MOUSE = 0;
    static CONTROLE_MODE_KEYBOARD = 1;

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
    rotationSpeed: number = 0.5;

    socketId: string;

    name: string;
    color: string;
    gender: string;

    leaveRoom: boolean = false;

    game: Game;

    walkAnimationFrames: number = 2;
    walkAnimationCount: number = 0;
    walkAnimationTime: number = 200;
    walkAnimationTimeDif: number = 0;

    // controls 
    controleMode: number;
    inputState: PlayerInputState;

    lookX: number;
    lookY: number;

    doActionLeft: boolean = false;
    doActionLeftTimeStamp = 0;
    doActionRight: boolean = false;
    doActionRightTimeStamp = 0;

    // controle mode Mouse 
    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;

    // controle mode keyboard
    moveForward: boolean;
    moveBackward: boolean;
    rotateLeft: boolean;
    rotateRight: boolean;


    constructor(game: Game, x: number, y: number, name: string, color: string, gender: string, controlMode: number) {
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

        this.controleMode = controlMode;

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

        syncObject.controlMode = this.controleMode;

        syncObject.moveUp = this.moveUp;
        syncObject.moveDown = this.moveDown;
        syncObject.moveLeft = this.moveLeft;
        syncObject.moveRight = this.moveRight;

        syncObject.moveForward = this.moveForward;
        syncObject.moveBackward = this.moveBackward;
        syncObject.rotateLeft = this.rotateLeft;
        syncObject.rotateRight = this.rotateRight;

        syncObject.lookX = this.lookX;
        syncObject.lookY = this.lookY;
        syncObject.walkAnimationCount = this.walkAnimationCount;

        if (this.rightHand != null) syncObject.rightHand = this.rightHand.color;
        if (this.leftHand != null) syncObject.leftHand = this.leftHand.color;

        syncObject.leaveRoom = this.leaveRoom;

        return syncObject;
    }


    public syncState(playerSyncState: PlayerState) {

        if (this.socketId == null) this.socketId = playerSyncState.socketId;

        this.id = playerSyncState.id;
        this.x = playerSyncState.x;
        this.y = playerSyncState.y;
        this.middleX = playerSyncState.middleX;
        this.middleY = playerSyncState.middleY;
        this.rotation = playerSyncState.rotation;

        this.name = playerSyncState.name;
        this.gender = playerSyncState.gender;
        this.color = playerSyncState.color;

        this.controleMode = playerSyncState.controlMode;

        this.moveUp = playerSyncState.moveUp;
        this.moveDown = playerSyncState.moveDown;
        this.moveLeft = playerSyncState.moveLeft;
        this.moveRight = playerSyncState.moveRight;

        this.moveForward = playerSyncState.moveForward;
        this.moveBackward = playerSyncState.moveBackward;
        this.rotateLeft = playerSyncState.rotateLeft;
        this.rotateRight = playerSyncState.rotateRight;

        this.lookX = playerSyncState.lookX;
        this.lookY = playerSyncState.lookY;

        this.walkAnimationCount = playerSyncState.walkAnimationCount;

        if (playerSyncState.rightHand != null) {
            if (this.rightHand == null) this.rightHand = new Ball(this.game, this.x, this.y, playerSyncState.rightHand);
        } else this.rightHand = null;

        if (playerSyncState.leftHand != null) {
            if (this.leftHand == null) this.leftHand = new Ball(this.game, this.x, this.y, playerSyncState.leftHand);
        } else this.leftHand = null;

        this.leaveRoom = playerSyncState.leaveRoom;
    }

    // CONTROLS

    // used in MODE_CLIENT
    public updateInputs(inputs: Inputs) {

        // W | UP
        if (inputs.keys[87] || inputs.keys[38]) this.inputState.w = true;
        else this.inputState.w = false;
        // A | LEFT
        if (inputs.keys[65] || inputs.keys[37]) this.inputState.a = true;
        else this.inputState.a = false;
        // S | DOWN
        if (inputs.keys[83] || inputs.keys[40]) this.inputState.s = true;
        else this.inputState.s = false;
        // D | RIGHT
        if (inputs.keys[68] || inputs.keys[39]) this.inputState.d = true;
        else this.inputState.d = false;

        //space
        if (inputs.keys[32]) {
            this.inputState.space = true;
            if (this.inputState.spacePressedTimeStamp == null) this.inputState.spacePressedTimeStamp = new Date().getTime();
        }
        else {
            this.inputState.space = false;
            this.inputState.spacePressedTimeStamp = null;
        }

        //shift
        if (inputs.keys[16]) {
            this.inputState.shift = true;
            if (this.inputState.shiftPressedTimeStamp == null) this.inputState.shiftPressedTimeStamp = new Date().getTime();
        }
        else {
            this.inputState.shift = false;
            this.inputState.shiftPressedTimeStamp = null;
        }

        this.inputState.mouseX = inputs.mousePosX;
        this.inputState.mouseY = inputs.mousePosY;

        this.inputState.clickedLeft = inputs.clickedLeft;
        this.inputState.clickedRight = inputs.clickedRight;

        this.inputState.clickedLeftTimeStemp = inputs.clickedLeftTimeStemp;
        this.inputState.clickedRightTimeStemp = inputs.clickedRightTimeStemp;

    }

    // used in MODE_SIMULATION
    public setControlesFromInputState() {

        if (this.controleMode == Player.CONTROLE_MODE_MOUSE) {

            this.moveUp = this.inputState.w;
            this.moveLeft = this.inputState.a;
            this.moveDown = this.inputState.s;
            this.moveRight = this.inputState.d;

            this.lookX = this.inputState.mouseX;
            this.lookY = this.inputState.mouseY;

            if (this.inputState.clickedLeft && this.inputState.clickedLeftTimeStemp > this.doActionLeftTimeStamp) {
                this.doActionLeft = true;
                this.doActionLeftTimeStamp = this.inputState.clickedLeftTimeStemp;
            } else if (!this.inputState.clickedLeft) {
                this.doActionLeft = false;
            }

            if (this.inputState.clickedRight && this.inputState.clickedRightTimeStemp > this.doActionRightTimeStamp) {
                this.doActionRight = true;
                this.doActionRightTimeStamp = this.inputState.clickedRightTimeStemp;
            } else if (!this.inputState.clickedRight) {
                this.doActionRight = false;
            }

        }


        if (this.controleMode == Player.CONTROLE_MODE_KEYBOARD) {
            this.moveForward = this.inputState.w;
            this.moveBackward = this.inputState.s;

            this.rotateLeft = this.inputState.a;
            this.rotateRight = this.inputState.d;

            if (this.inputState.space && this.inputState.spacePressedTimeStamp > this.doActionLeftTimeStamp) {
                this.doActionLeft = true;
                this.doActionLeftTimeStamp = this.inputState.spacePressedTimeStamp;
            } else if (!this.inputState.space) {
                this.doActionLeft = false;
            }

            if (this.inputState.shift && this.inputState.shiftPressedTimeStamp > this.doActionRightTimeStamp) {
                this.doActionRight = true;
                this.doActionRightTimeStamp = this.inputState.shiftPressedTimeStamp;
            } else if (!this.inputState.shift) {
                this.doActionRight = false;
            }
        }

    }


    // LOGIC

    public update(timeDiff: number) {

        // MOVEMENT
        var move = true;
        if (this.game.flipchart.active && this.game.flipchart.lastActivator == this.id) {
            move = false;
        }

        if (this.controleMode == Player.CONTROLE_MODE_MOUSE) {
            this.rotation = -this.getLookAngle(this.lookX, this.lookY, this.x + this.width / 2, this.y + this.height / 2) - 90;
        }
        
        if (move) {

            if (this.controleMode == Player.CONTROLE_MODE_MOUSE) {
                if (this.moveUp) this.y -= this.speed * timeDiff;
                if (this.moveLeft) this.x -= this.speed * timeDiff;
                if (this.moveDown) this.y += this.speed * timeDiff;
                if (this.moveRight) this.x += this.speed * timeDiff;

            }

            if (this.controleMode == Player.CONTROLE_MODE_KEYBOARD) {

                if (this.rotateRight) this.rotation += this.rotationSpeed * timeDiff;
                if (this.rotateLeft) this.rotation -= this.rotationSpeed * timeDiff;

                if (this.moveForward) {
                    this.x += (this.speed * timeDiff) * (Math.cos(GeometryUtils.degreeToRad(this.rotation + 90)));
                    this.y += (this.speed * timeDiff) * (Math.sin(GeometryUtils.degreeToRad(this.rotation + 90)));
                } else if (this.moveBackward) {
                    this.x -= (this.speed * timeDiff) * (Math.cos(GeometryUtils.degreeToRad(this.rotation + 90)));
                    this.y -= (this.speed * timeDiff) * (Math.sin(GeometryUtils.degreeToRad(this.rotation + 90)));
                }
            }

            this.walkAnimationTimeDif += timeDiff;

            this.middleX = this.x + this.width / 2;
            this.middleY = this.y + this.height / 2;

            // animation
            if (this.moveDown || this.moveLeft || this.moveRight || this.moveUp || this.moveForward || this.moveBackward) {
                if (this.walkAnimationTimeDif > this.walkAnimationTime) {
                    this.walkAnimationCount++;
                    if (this.walkAnimationCount > this.walkAnimationFrames) this.walkAnimationCount = 1;
                    this.walkAnimationTimeDif = 0;
                }
            } else this.walkAnimationCount = 0;

        }

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


        // Actions

        this.setActionAreaCircle();

        if (this.rightHand != null) {
            this.rightHand.x = this.middleX;
            this.rightHand.y = this.middleY;
        }

        if (this.leftHand != null) {
            this.leftHand.x = this.middleX;
            this.leftHand.y = this.middleY;
        }

        if (this.doActionLeft) {
            if (this.performAction(Player.HAND_LEFT)) {
                this.doActionLeft = false;
            }
        }

        if (this.doActionRight) {
            if (this.performAction(Player.HAND_RIGHT)) {
                this.doActionRight = false;
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

            //check Door
            if (CollisionUtils.colCheckCircleRect(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, this.game.meetingRoom.doorCollider.x, this.game.meetingRoom.doorCollider.y, this.game.meetingRoom.doorCollider.width, this.game.meetingRoom.doorCollider.height)) {
                this.leaveRoom = true;
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

    public getLookAngle(shootTargetX: number, shootTargetY: number, playerPosX: number, playerPosY: number) {
        return GeometryUtils.getAngleBetweenToPoints(shootTargetX, shootTargetY, playerPosX, playerPosY);
    }


}