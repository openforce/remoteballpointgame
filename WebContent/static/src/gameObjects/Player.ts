class Player {

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

    id:string;
    socketId:string;

    
    // UI
    ui:boolean;

    sprite:CanvasImageSource;
	spriteWidth:number;
    spriteHeight:number;
    
    // controls 
    clickedLeft:boolean;
    clickedRight:boolean;

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

    constructor(x:number, y:number, ui:boolean, syncToServer:boolean){
        this.ui = ui;
        this.syncToServer = syncToServer;

        var date = Date.now();
        this.id = date.toString();

        this.x = x;
        this.y = y;
        
        this.width = 70;
        this.height = 60;

        this.middleX = this.x + this.width/2;
        this.middleY = this.y + this.height/2;
        
        this.radius = 30;
        this.rotation = 180;

        this.actionCircleRadius = 30;

        if(ui){
            this.sprite = new Image();
            this.sprite.src = "/static/resources/person_blue_stand.png";
            
            this.spriteWidth = 218;
            this.spriteHeight = 170;
        }

        
        if(this.syncToServer) socket.emit('new player', this.getSyncObject(), new MeetingRoom(false), new BallBasket(200, 130, false));  
    }

    public getSyncObject(){
        return {
            id: this.id,
            socketId: this.socketId, 
            x: this.x,
            y: this.y,
            middleX: this.middleX,
            middleY: this.middleY,
            rotation: this.rotation,
            rightHand: this.rightHand != null,
            leftHand: this.leftHand != null,
            moveUp: this.moveUp,
            moveDown: this.moveDown,
            moveLeft: this.moveLeft,
            moveRight: this.moveRight
        }
    }
    
    public init(){

    }

    public syncPlayerState(player:any){
        //console.log('syncPlayerState from ' + this.id);
        this.id = player.id;
        this.x = player.x;
        this.y = player.y;
        this.socketId = player.socketId;
        this.middleX = player.middleX;
        this.middleY = player.middleY;
        this.rotation = player.rotation;
        this.moveUp = player.moveUp;
        this.moveDown = player.moveDown;
        this.moveLeft = player.moveLeft;
        this.moveRight = player.moveRight;

        if(player.rightHand) this.rightHand = new Ball(this.x, this.y, true);
        else this.rightHand = null;

        if(player.leftHand) this.leftHand = new Ball(this.x, this.y, true);
        else this.leftHand = null;
    }

    // CONTROLS

    public updateControls(){
        // W
        if(keys[87]) this.moveUp = true; 
        else this.moveUp = false;
        // A
        if(keys[65]) this.moveLeft = true; 
        else this.moveLeft = false;
        // S
        if(keys[83]) this.moveDown = true; 
        else this.moveDown = false;
        // D
        if(keys[68]) this.moveRight = true; 
        else this.moveRight = false;

        this.lookX = mousePosX;
        this.lookY = mousePosY;
    }

    public checkClick(mouseX:number, mouseY:number, clickType:number){
        console.log("clicked");
        
        if(clickType == CLICK_LEFT) this.clickedLeft = true;
        if(clickType == CLICK_RIGHT) this.clickedRight = true;

        this.clickedX = mouseX;
        this.clickedY = mouseY;

    }

    // LOGIC

    public update(timeDiff:number){

        // MOVEMENT
        if(this.moveUp) this.y -= this.speed * timeDiff;
        if(this.moveLeft) this.x -= this.speed * timeDiff;
        if(this.moveDown) this.y += this.speed * timeDiff;
        if(this.moveRight) this.x += this.speed * timeDiff;    

        this.middleX = this.x + this.width/2;
        this.middleY = this.y + this.height/2;

        // COLLISIONS
        var col = false;
        // Meeting Room
        if(this.middleX - this.radius <= meetingRoom.border) col = true; //left
        else if(this.middleY + this.radius >= CANVAS_HEIGHT - meetingRoom.border) col = true; //down
        else if(this.middleY - this.radius <= meetingRoom.border) col = true; //up
        else if(this.middleX + this.radius >= CANVAS_WIDTH-meetingRoom.border) col = true; //right
        //Basket
        else if(colCheckCirlces(this.middleX, this.middleY, this.radius, ballBasket.x, ballBasket.y, ballBasket.radius)) col = true;
        //Balls
        for(var i = 0; i < balls.length; i++){
            if(balls[i].state == BALL_STATE_INAIR)
			    if(colCheckCirlces(this.x, this.y, this.radius, balls[i].x, balls[i].y, balls[i].radius)) col = true;
		}
        //Players   
        for(var i = 0; i < players.length; i++){
			//if(colCheckCirlces(this.x, this.y, this.radius, players[i].middleX, players[i].middleY, players[i].radius)) col = true;
		}       

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
            this.performAction(CLICK_LEFT);
            this.clickedLeft = false;
        }

        if(this.clickedRight){
            this.performAction(CLICK_RIGHT);
            this.clickedRight = false;
        }

        if(this.syncToServer) socket.emit('player sync', this.getSyncObject());
    }

    public setActionAreaCircle(){
        var fAngle = this.degreeToRad(-this.rotation + 90);

        var diagonalDistX = (this.radius + this.actionCircleRadius) * (Math.cos(fAngle));
	    var diagonalDistY = -(this.radius + this.actionCircleRadius) * (Math.sin(fAngle));

        this.actionCircleX = this.middleX - diagonalDistX/3;
        this.actionCircleY = this.middleY - diagonalDistY/3;
    }
    

    public performAction(clickType:number){

        if(clickType == CLICK_LEFT && this.leftHand != null
            || clickType == CLICK_RIGHT && this.rightHand != null) {
            
            //check BallBasket
            if(colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, ballBasket.x, ballBasket.y, ballBasket.radius)){
                if(clickType == CLICK_LEFT) this.leftHand = null;
                if(clickType == CLICK_RIGHT) this.rightHand = null;
                
                return;
            }
            
            this.shootBall(clickType);

        } else { // nothing in Hand

            // check Balls
            for(var i = 0; i < balls.length; i++){
                if(colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, balls[i].x, balls[i].y, balls[i].radius)){
                    this.takeBall(balls[i], clickType);
                    balls.splice(i,1);
                    return;
                }
            }

            //check BallBasket
            if(colCheckCirlces(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, ballBasket.x, ballBasket.y, ballBasket.radius)){
                var newBall = new Ball(this.middleX, this.middleY, true);
                this.takeBall(newBall, clickType);
            }
        }
        
    }

    public takeBall(ball:Ball, clickType:number){
 
        if(clickType == CLICK_RIGHT) this.rightHand = ball;
        if(clickType == CLICK_LEFT) this.leftHand = ball;

        ball.take(this);

        if(this.syncToServer) socket.emit('take ball', ball.getSyncObject());
    }

    public shootBall(clickType:number){
        var fAngle = this.degreeToRad(this.rotation + 90);

        if(clickType == CLICK_RIGHT) this.rightHand.shoot(fAngle, 0.5);
        if(clickType == CLICK_LEFT) this.leftHand.shoot(fAngle, 0.5);

        if(this.syncToServer) {
            if(clickType == CLICK_RIGHT) socket.emit('throw ball', this.rightHand.getSyncObject());
            if(clickType == CLICK_LEFT) socket.emit('throw ball', this.leftHand.getSyncObject());
        }

        if(clickType == CLICK_RIGHT) balls.push(this.rightHand);
        if(clickType == CLICK_LEFT) balls.push(this.leftHand);

        if(clickType == CLICK_RIGHT) this.rightHand = null;
        if(clickType == CLICK_LEFT) this.leftHand = null;

    }


    // UI STUFF

    public draw(){
        if(!this.ui) return;

        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);

        //Sprite
        ctx.drawImage(this.sprite,
			0, 0, this.spriteWidth, this.spriteHeight, // sprite cutout position and size
            -this.width / 2, -this.height / 2, this.width, this.height); 	 // draw position and size

        if(this.leftHand != null){
            var myBall = this.leftHand;
            
            drawCyrcle(13, 13, myBall.radius, myBall.color);
        }

        if(this.rightHand != null){
            var myBall = this.rightHand;
            
            drawCyrcle(-13, 15, myBall.radius, myBall.color);
        }

        
        ctx.rotate(-this.rotation * Math.PI / 180);
        ctx.translate(-this.x - this.width / 2, -this.y -this.height / 2);
        
        if(drawColliders) this.drawActionArea();
        
    }

    public drawActionArea(){
        drawCyrcleOutline(this.middleX, this.middleY, this.radius, 'blue');
        drawCyrcleOutline(this.actionCircleX, this.actionCircleY, this.actionCircleRadius, 'green');
    }


    // UTIL STUFF

    public getShootAngle(shootTargetX:number, shootTargetY:number, playerPosX:number, playerPosY:number){
        var dx = shootTargetX - playerPosX;
        var dy = (shootTargetY - playerPosY) * -1;

        var inRads = Math.atan2(dy,dx);

        if (inRads < 0) inRads = inRads + 2*Math.PI;

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