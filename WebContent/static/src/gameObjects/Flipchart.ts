class Flipchart {

    x: number;
    y: number;
    radius:number = 40;

    middleX:number;
    middleY:number;
    
    active:boolean;
    activeFlipchart:number = 0;
    lastActivator:string;

    resultTable = {
        round1: {
            estimation: '',
            result: '',
            bugs: ''
        },
        round2: {
            estimation: '',
            result: '',
            bugs: ''
        },
        round3: {
            estimation: '',
            result: '',
            bugs: ''
        },
        round4: {
            estimation: '',
            result: '',
            bugs: ''
        },
        round5: {
            estimation: '',
            result: '',
            bugs: ''
        },
    }

    // UI 
    ui:boolean;
    
    sprite:CanvasImageSource;
	spriteWidth:number = 131 * 0.9;
    spriteHeight:number = 83 * 1.2;

    flipchartSpritesSmall:CanvasImageSource[];
    flipchartSpriteSmallStartX:number = 410;
    flipchartSpriteSmallStartY:number = 300;
    flipchartSpriteSmallWidth:number =  860 - 410;
    flipchartSpriteSmallHeight:number = 615 - 300;

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

        socket.on('new result table', function(serverResultTable:any) {
            flipchart.resultTable = serverResultTable;
        });

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

            this.flipchartSpritesSmall = [];
            this.flipchartSpritesSmall[0] = new Image();
            this.flipchartSpritesSmall[0].src = "/static/resources/flipchartControlesSmall.png";
            this.flipchartSpritesSmall[1] = new Image();
            this.flipchartSpritesSmall[1].src = "/static/resources/flipchartWarmupSmall.png";
            this.flipchartSpritesSmall[2] = new Image();
            this.flipchartSpritesSmall[2].src = "/static/resources/flipchartRulesSmall.png";
            this.flipchartSpritesSmall[3] = new Image();
            this.flipchartSpritesSmall[3].src = "/static/resources/flipchartResultsSmall.png";

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

        socket.emit('trigger flipchart', player.id);  
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

    public syncResultTable(){
        socket.emit('sync result table', this.resultTable);
    }

    public resetResultTable(){
        this.resultTable = {
            round1: {
                estimation: '',
                result: '',
                bugs: ''
            },
            round2: {
                estimation: '',
                result: '',
                bugs: ''
            },
            round3: {
                estimation: '',
                result: '',
                bugs: ''
            },
            round4: {
                estimation: '',
                result: '',
                bugs: ''
            },
            round5: {
                estimation: '',
                result: '',
                bugs: ''
            },
        }
    }

    public draw(){
        if(!this.ui) return;

        //BG
		ctx.drawImage(this.flipchartSpritesSmall[this.activeFlipchart],
			this.flipchartSpriteSmallStartX, this.flipchartSpriteSmallStartY, this.flipchartSpriteSmallWidth, this.flipchartSpriteSmallHeight, // sprite cutout position and size
            this.x, this.y, this.spriteWidth, this.spriteHeight); 	 // draw position and size
            
        if(drawColliders) this.drawColider();

        if(this.active){
            this.drawFlipchartScreen();
            
            if(this.lastActivator == player.id){
                this.nextFlipchartButton.draw();
                this.previousFlipchartButton.draw();
            }
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

        if(this.activeFlipchart == 3) this.drawResultTable();
            
        }
        
    public drawResultTable(){
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Arial";

        var x = 340;
        var xOffset = 60;

        var y = 163;
        var yOffset = 50;
        
        // Runde 1
        ctx.fillText(this.resultTable.round1.estimation, x, y);
        ctx.fillText(this.resultTable.round1.result, x + xOffset, y);
        ctx.fillText(this.resultTable.round1.bugs, x + xOffset*2, y);
        // Runde 2
        ctx.fillText(this.resultTable.round2.estimation, x, y + yOffset);
        ctx.fillText(this.resultTable.round2.result, x + xOffset, y + yOffset);
        ctx.fillText(this.resultTable.round2.bugs, x + xOffset*2, y + yOffset);
        // Runde 3
        ctx.fillText(this.resultTable.round3.estimation, x, y + yOffset*2);
        ctx.fillText(this.resultTable.round3.result, x + xOffset, y + yOffset*2);
        ctx.fillText(this.resultTable.round3.bugs, x + xOffset*2, y + yOffset*2);
        // Runde 4
        ctx.fillText(this.resultTable.round4.estimation, x, y + yOffset*3);
        ctx.fillText(this.resultTable.round4.result, x + xOffset, y + yOffset*3);
        ctx.fillText(this.resultTable.round4.bugs, x + xOffset*2, y + yOffset*3);
        // Runde 5
        ctx.fillText(this.resultTable.round5.estimation, x, y + yOffset*4);
        ctx.fillText(this.resultTable.round5.result, x + xOffset, y + yOffset*4);
        ctx.fillText(this.resultTable.round5.bugs, x + xOffset*2, y + yOffset*4);
    }

    public drawColider(){
        drawCyrcleOutline(this.middleX, this.middleY, this.radius, 'blue');
    }

    
}
