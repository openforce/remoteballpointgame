const BALL_STATE_ONGROUND = 0;
const BALL_STATE_INAIR = 1;
const BALL_STATE_FALLING = 2;
const BALL_STATE_TAKEN = 3;

class Ball {

    id:string;

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

    ui:boolean;

    lastHolderId:string;

    constructor(x:number, y:number, ui:boolean){
        this.ui = ui;

        var date = Date.now();
        this.id = date.toString();
        
        this.x = x;
        this.y = y;

        this.radius = 7;
        this.color = 'red';

        this.speedX = 0;
        this.speedY = 0;
    }

    public getSyncObject(){
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            speedX: this.speedX,
            speedY: this.speedY,
            state: this.state,
            lastHolderId: this.lastHolderId
        }
    }

    public syncBallState(serverBall:any){
        this.id = serverBall.id;
        this.x = serverBall.x;
        this.y = serverBall.y;
        this.speedX = serverBall.speedX;
        this.speedY = serverBall.speedY;
        this.state = serverBall.state;
        this.lastX = serverBall.x;
        this.lastY = serverBall.y;
        this.lastHolderId = serverBall.lastHolderId;
    }
    
    public init(){

    }


    // LOGIC

    public update(timeDiff:number){

        // MOVEMENT
        this.x += this.speedX * timeDiff;
        this.y += this.speedY * timeDiff;

        if(this.state == BALL_STATE_FALLING){
            this.speedX *= 0.9;
            this.speedY *= 0.9;

            if(Math.abs(this.speedX) < 0.01) this.speedX = 0;
            if(Math.abs(this.speedY) < 0.01) this.speedY = 0;

            if(this.speedX == 0 && this.speedY == 0) {
                this.state = BALL_STATE_ONGROUND;
            }

        }

        // COLLISIONS
        var col = false;
        // Meeting Room
        if(this.x - this.radius <= meetingRoom.border) col = true; //left
        else if(this.y + this.radius >= CANVAS_HEIGHT - meetingRoom.border) col = true; //down
        else if(this.y - this.radius <= meetingRoom.border) col = true; //up
        else if(this.x + this.radius >= CANVAS_WIDTH-meetingRoom.border) col = true; //right
        //Basket
        else if(colCheckCirlces(this.x, this.y, this.radius, ballBasket.x, ballBasket.y, ballBasket.radius)) col = true;
        //Balls
        for(var i = 0; i < balls.length; i++){
            if(balls[i].state == BALL_STATE_INAIR && balls[i].x != this.x && balls[i].y != this.y)
			    if(colCheckCirlces(this.x, this.y, this.radius, balls[i].x, balls[i].y, balls[i].radius)) col = true;
		}
        //Players   
        if(this.lastHolderId != player.id && colCheckCirlces(this.x, this.y, this.radius, player.x, player.y, player.radius)) col = true;
        for(var i = 0; i < players.length; i++){
			if(this.lastHolderId != players[i].id && colCheckCirlces(this.x, this.y, this.radius, players[i].middleX, players[i].middleY, players[i].radius)) col = true;
		}  

        if(col){ // reset to last save position
            this.x = this.lastX;
            this.y = this.lastY;

            this.speedX *= -0.6;
            this.speedY *= -0.6;
            this.state = BALL_STATE_FALLING;

        }else{ // save position
            this.lastX = this.x;
            this.lastY = this.y;
        }

        if(this.lastHolderId == player.id){ // this.state != this.lastState
            socket.emit('sync ball', this.getSyncObject());
            this.lastState = this.state;
        }

    }

    public take(player:Player){
        this.state = BALL_STATE_TAKEN;
        this.speedX = 0;
        this.speedY = 0;
        this.lastHolderId = player.id;
    }

    public shoot(shootAngle:number, shootSpeed:number){
        this.speedX = shootSpeed * (Math.cos(shootAngle));
        this.speedY = shootSpeed * (Math.sin(shootAngle));

        this.state = BALL_STATE_INAIR;
    }


    // UI

    public draw(){
        if(!this.ui) return;

        if(this.state != BALL_STATE_TAKEN) {
            if(drawColliders) drawCyrcle(this.x, this.y, this.radius+1, 'blue');
            drawCyrcle(this.x, this.y, this.radius, this.color);
        }
    }

    // UTILS

    public getShootAngle(shootTargetX:number, shootTargetY:number, playerPosX:number, playerPosY:number){
        var dx = shootTargetX - playerPosX;
        // Minus to correct for coord re-mapping
        var dy = (shootTargetY - playerPosY) * -1;

        var inRads = Math.atan2(dy,dx);

        // We need to map to coord system when 0 degree is at 3 O'clock, 270 at 12 O'clock
        if (inRads < 0)
            inRads = inRads + 2*Math.PI;
            //inRads = Math.abs(inRads);
        //else
            //inRads = inRads + 2*Math.PI;
            //inRads = 2*Math.PI - inRads;
            
        //if (inRads < 0) inRads -= 2 * Math.PI;

        return this.radToDegree(inRads) ;
    }

    public radToDegree(radValue:number) {
        var pi = Math.PI;
        var ra_de = radValue * (180 / pi);
        return ra_de;
    }
    public degreeToRad(degreeValue:number) {
        var pi = Math.PI;
        var de_ra = degreeValue * (pi / 180);
        return de_ra;
    }
    
    public getDistance(fromX:number, fromY:number, toX:number, toY:number){
        var a = Math.abs(fromX - toX);
        var b = Math.abs(fromY - toY);
     
        return Math.sqrt((a * a) + (b * b));
    }

}