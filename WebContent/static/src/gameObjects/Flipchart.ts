class Flipchart {

    x: number;
    y: number;
    radius:number = 40;

    middleX:number;
    middleY:number;

    sprite:CanvasImageSource;
	spriteWidth:number = 131;
    spriteHeight:number = 83;

    ui:boolean;

    active:boolean;

    constructor(x:number, y:number, ui:boolean){
        this.x = x;
        this.y = y;

        this.middleX = this.x + (this.spriteWidth/2)-20;
        this.middleY = this.y + this.spriteHeight/2;

        this.active = false;

        this.ui = ui;

        if(ui){
            this.sprite = new Image();
            this.sprite.src = "/static/resources/flipchart.png";
        }
    }

    public update(timeDiff:number){
       
    }

    public triggerFlipchart(){
        this.active = !this.active;
    }

    public draw(){
        if(!this.ui) return;

        //BG
		ctx.drawImage(this.sprite,
			0, 0, this.spriteWidth, this.spriteHeight, // sprite cutout position and size
            this.x, this.y, this.spriteWidth, this.spriteHeight); 	 // draw position and size
            
        if(drawColliders) this.drawColider();

        if(this.active) this.drawFlipchartScreen();
    }

    public drawFlipchartScreen(){
        var infoBoxWidth = 400;
		var infoBoxHeight = 550;

		var infoBox_x = 200;
		var infoBox_y = 25;
		
		
		// BG
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.fillRect(infoBox_x, infoBox_y, infoBoxWidth, infoBoxHeight);
		ctx.fill();
		ctx.closePath();
		
		// infos
		ctx.fillStyle = "black";
	    ctx.font = "bold 12px Arial";
		ctx.fillText(this.name, infoBox_x+5, infoBox_y+15);
		
		ctx.font = "bold 10px Arial";
		ctx.fillText('Flipchart', infoBox_x+5, infoBox_y+30);
		
		
		// Frame
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'black';
		ctx.rect(infoBox_x, infoBox_y, infoBoxWidth, infoBoxHeight);
		ctx.stroke();
		ctx.closePath();
    }

    public drawColider(){
        drawCyrcleOutline(this.middleX, this.middleY, this.radius, 'blue');
    }

    
}