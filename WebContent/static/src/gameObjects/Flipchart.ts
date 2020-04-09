const FLIPCHART_CONTROLES = 0;
const FLIPCHART_WARMUP = 1;
const FLIPCHART_RULES = 2;
const FLIPCHART_RESULTS = 3;
const FLIPCHART_END = 4;


class Flipchart {

    x: number;
    y: number;
    radius:number = 40;

    middleX:number;
    middleY:number;
    
    active:boolean;
    activeFlipchart:number = 0;
    lastActivator:number;

    rounds = 5;
    activeRound = 1;

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

    startButton:Button;
    
    input_estimation:CanvasInput;

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


            this.startButton = new Button(this.infoBox_x + this.infoBoxWidth / 4, this.infoBox_y + this.infoBoxHeight - 150 , 60, 25, 'Got it!'); 
            this.startButton.textFont = 'bold 12px Arial';    
            this.nextFlipchartButton = new Button(this.infoBox_x + this.infoBoxWidth - 60, this.infoBox_y + this.infoBoxHeight - 30 , 50, 20, '     -->');               
            this.previousFlipchartButton = new Button(this.infoBox_x + 10, this.infoBox_y + this.infoBoxHeight - 30 , 50, 20, '<--');

        }
    }

    public update(timeDiff:number){
       
    }

    public checkClick(mouseX:number, mouseY:number){

        if(this.active){
            
            if(arcadeMode){
                if(this.startButton.checkForClick(mouseX, mouseY)) this.triggerStartButton();
            } else {
                if(this.nextFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerNextFlipchart();
                if(this.previousFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerPreviousFlipchart();
            }

        }
    }


    public triggerFlipchart(){
        this.active = !this.active;
        socket.emit('trigger flipchart', player.id);  
    }

    public showFlipchart(){
        this.active = true;
        socket.emit('show flipchart');  
    }

    public hideFlipchart(){
        this.active = false;
        socket.emit('hide flipchart');  
    }

    
    public triggerStartButton(){
        
        if(this.activeFlipchart == FLIPCHART_CONTROLES){ 
            
            // --> show Warm Up Flipchart
            this.triggerSpecificFlipchart(FLIPCHART_WARMUP);

        } else if(this.activeFlipchart == FLIPCHART_WARMUP){ 
            
            // --> start Warm Up
            gameState = GAME_STATE_WARMUP;
            socket.emit('set gameState', gameState);  

            timer.startTimer();
            this.hideFlipchart();
        
        } else if(this.activeFlipchart == FLIPCHART_RULES){ 
            
            // --> show result table
            gameState = GAME_STATE_PREP;
            socket.emit('set gameState', gameState); 

            this.triggerSpecificFlipchart(FLIPCHART_RESULTS);
        
        } else if(this.activeFlipchart == FLIPCHART_RESULTS){ 

            if(gameState == GAME_STATE_PREP) { 
                
                // --> start PREP Phase
                timer.startTimer();
                if(showPoints) triggerShowPoints();
                this.hideFlipchart();

            } else if(gameState == GAME_STATE_PLAY && this.activeRound <= this.rounds) { 
                
                // --> start Play Mode
                // @ts-ignore
                this.resultTable['round'+this.activeRound].estimation = this.input_estimation.value();
                this.syncResultTable();

                timer.startTimer();
                if(!showPoints) triggerShowPoints();
                this.hideFlipchart();

            } else { // --> END

            }
        }
    }

    public triggerTimerEnded(){
        //console.log('triggerTimerEnded');

        if(!arcadeMode) return;

        if(this.activeFlipchart == FLIPCHART_WARMUP){ 
            
            // --> End Warm Up
            this.triggerSpecificFlipchart(FLIPCHART_RULES);
            this.showFlipchart();

        } else if(this.activeFlipchart == FLIPCHART_RESULTS){ 

            if(gameState == GAME_STATE_PREP) { 
                
                // --> End PREP Phase
                gameState = GAME_STATE_PLAY;
                socket.emit('set gameState', gameState); 
                this.input_estimation = null;

                this.showFlipchart();

            } else if(gameState == GAME_STATE_PLAY && this.activeRound < this.rounds) { 
                
                // --> End PLAY Phase
                gameState = GAME_STATE_PREP;
                socket.emit('set gameState', gameState); 

                this.activeRound++;
                this.showFlipchart();

            } else { // --> END
                gameState = GAME_STATE_END;
                socket.emit('set gameState', gameState); 

                this.showFlipchart();
            }
        }
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

    public triggerSpecificFlipchart(flipchart:number){
        this.activeFlipchart = flipchart;
        
        socket.emit('trigger specific flipchart', flipchart); 
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
            
    }

    
    public drawFlipchartScreen(){
        
        if(!this.active) return;
        
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

        if(arcadeMode){
            if(this.activeFlipchart == FLIPCHART_CONTROLES) {

                this.startButton.text = 'Got it';
                this.startButton.x = this.infoBox_x + this.infoBoxWidth / 4;
                this.startButton.y = this.infoBox_y + this.infoBoxHeight - 150;

                this.startButton.draw(); 

            } else if(this.activeFlipchart == FLIPCHART_WARMUP) {
                
                this.startButton.text = 'Start';
                this.startButton.x = this.infoBox_x + this.infoBoxWidth / 4;
                this.startButton.y = this.infoBox_y + this.infoBoxHeight - 150;
                
                this.startButton.draw(); 

            } else if(this.activeFlipchart == FLIPCHART_RULES) {

                this.startButton.text = 'Got it';
                this.startButton.x = this.infoBox_x + this.infoBoxWidth / 4;
                this.startButton.y = this.infoBox_y + this.infoBoxHeight - 150;
                
                this.startButton.draw(); 

            } else if(this.activeFlipchart == FLIPCHART_RESULTS) {
                var y = 145;
                var yOffset = 50;

                if(gameState == GAME_STATE_PREP) this.startButton.text = 'Prepare';
                if(gameState == GAME_STATE_PLAY) this.startButton.text = 'Start';
                
                this.startButton.x = this.infoBox_x + this.infoBoxWidth - this.startButton.width - 75;
                this.startButton.y = y + yOffset * (this.activeRound - 1);
                
                if(gameState != GAME_STATE_END) this.startButton.draw(); 

                //estimation Input
                if(gameState == GAME_STATE_PLAY){

                    if(this.input_estimation == null) 
                        this.input_estimation = new CanvasInput({
                            canvas: canvas,
                            x: 333,
                            y: y + yOffset * (this.activeRound - 1),
                            width: 30,
                            value: '?'
                        });

                    this.input_estimation.render();
                }

            }
            

        } else {

            if(this.lastActivator == player.id){
                this.nextFlipchartButton.draw();
                this.previousFlipchartButton.draw();
            }

        }

            
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
        DrawUtils.drawCyrcleOutline(this.middleX, this.middleY, this.radius, 'blue');
    }

    
}
