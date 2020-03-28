class Timer {

    x: number;
    y: number;
    radius:number = 30;

    middleX:number;
    middleY:number;

    sprite:CanvasImageSource;
	spriteWidth:number = 72;
    spriteHeight:number = 85;

    ui:boolean;

    targetTime:number = 120 * 1000; //2 Minuten
    startTime:number;
    playTime:number;

    constructor(x:number, y:number, ui:boolean){
        this.x = x;
        this.y = y;

        this.middleX = this.x + this.spriteWidth/2;
        this.middleY = this.y + this.spriteHeight/2-15;

        this.ui = ui;

        if(ui){
            this.sprite = new Image();
            this.sprite.src = "/static/resources/timer.png";
        }
    }

    public update(timeDiff:number){
        var now = new Date().getTime();
        var playedTime:number; 

        if(this.startTime == null) playedTime = 0;
        else playedTime = now - this.startTime;
        
        this.playTime = Math.round((this.targetTime - playedTime)/1000);
    }

    public triggerTimer(){
        if(this.startTime == null) this.startTime = new Date().getTime();
        else this.startTime = null;
    }

    public draw(){
        if(!this.ui) return;

        //BG
		ctx.drawImage(this.sprite,
			0, 0, this.spriteWidth, this.spriteHeight-30, // sprite cutout position and size
            this.x, this.y, this.spriteWidth, this.spriteHeight-30); 	 // draw position and size

        //playTime
	    ctx.fillStyle = "black";
	    ctx.font = "bold 16px Arial";
        ctx.fillText("Timer ", this.x + 12, this.y + 20);
        ctx.fillText(this.playTime.toString(), this.x + 24, this.y + 40);
            
        if(drawColliders) this.drawColider();
    }

    public drawColider(){
        drawCyrcleOutline(this.middleX, this.middleY, this.radius, 'blue');
    }

    
}