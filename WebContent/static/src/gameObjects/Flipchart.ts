class Flipchart {

    x: number;
    y: number;
    radius:number = 40;

    middleX:number;
    middleY:number;
    
    active:boolean;
    activeFlipchart:number = 0;

    // UI 
    ui:boolean;
    
    sprite:CanvasImageSource;
	spriteWidth:number = 131;
    spriteHeight:number = 83;

    flipchartSprites:CanvasImageSource[];
    flipchartSpriteWidth:number = 1974;
    flipchartSpriteHeight:number = 2400;
    
    nextFlipchartButton:Button;
    previousFlipchartButton:Button;

    infoBoxWidth:number = 400;
    infoBoxHeight:number = 550;
    infoBox_x:number = 200;
    infoBox_y:number = 25;

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
            
            this.flipchartSprites = [];
            this.flipchartSprites[0] = new Image();
            this.flipchartSprites[0].src = "/static/resources/flipchartControles.png";
            this.flipchartSprites[1] = new Image();
            this.flipchartSprites[1].src = "/static/resources/flipchartWarmup.png";
            this.flipchartSprites[2] = new Image();
            this.flipchartSprites[2].src = "/static/resources/flipchartRules.png";
            this.flipchartSprites[3] = new Image();
            this.flipchartSprites[3].src = "/static/resources/flipchartResults.png";

            this.nextFlipchartButton = new Button(this.infoBox_x + this.infoBoxWidth - 60, this.infoBox_y + this.infoBoxHeight - 30 , 50, 20, '     -->');               
            this.previousFlipchartButton = new Button(this.infoBox_x + 10, this.infoBox_y + this.infoBoxHeight - 30 , 50, 20, '<--');
        }
    }

    public update(timeDiff:number){
       
    }

    public checkClick(mouseX:number, mouseY:number){
        if(this.nextFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerNextFlipchart();
        if(this.previousFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerPreviousFlipchart();
    }

    public triggerFlipchart(){
        this.active = !this.active;

        socket.emit('trigger flipchart');  
    }

    public triggerNextFlipchart(){
        this.activeFlipchart++;
        if(this.activeFlipchart == this.flipchartSprites.length) this.activeFlipchart = 0; 
        
        socket.emit('trigger next flipchart'); 
    }
    public triggerPreviousFlipchart(){
        this.activeFlipchart--;
        if(this.activeFlipchart < 0) this.activeFlipchart = this.flipchartSprites.length-1; 

        socket.emit('trigger previous flipchart'); 
    }

    public draw(){
        if(!this.ui) return;

        //BG
		ctx.drawImage(this.sprite,
			0, 0, this.spriteWidth, this.spriteHeight, // sprite cutout position and size
            this.x, this.y, this.spriteWidth, this.spriteHeight); 	 // draw position and size
            
        if(drawColliders) this.drawColider();

        if(this.active){
            this.drawFlipchartScreen();
            this.nextFlipchartButton.draw();
            this.previousFlipchartButton.draw();
        }
            
    }

    public drawFlipchartScreen(){
        
		// BG
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.fillRect(this.infoBox_x, this.infoBox_y, this.infoBoxWidth, this.infoBoxHeight);
        ctx.fill();
        ctx.closePath();
		
		// infos
		ctx.fillStyle = "black";
	    ctx.font = "bold 12px Arial";
		//ctx.fillText('Flipchart', infoBox_x+5, infoBox_y+30);
        
        // sprite (1974 × 2400)
        ctx.drawImage(this.flipchartSprites[this.activeFlipchart],
			0, 0, this.flipchartSpriteWidth, this.flipchartSpriteHeight, // sprite cutout position and size
            this.infoBox_x-15, this.infoBox_y, this.infoBoxWidth, this.infoBoxHeight); 	 // draw position and size
		
    }

    public drawColider(){
        drawCyrcleOutline(this.middleX, this.middleY, this.radius, 'blue');
    }

    
}