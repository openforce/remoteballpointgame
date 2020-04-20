import {Game} from "../../game/Game";
import {DrawUtils} from "../../utils/DrawUtils1";
import {Flipchart} from "../Flipchart";


export class FlipchartDrawer {
    
    sprite:CanvasImageSource;

    flipchartSpritesSmall:CanvasImageSource[];
    flipchartSpriteSmallStartX:number = 410;
    flipchartSpriteSmallStartY:number = 300;
    flipchartSpriteSmallWidth:number =  860 - 410;
    flipchartSpriteSmallHeight:number = 615 - 300;

    flipchartSprites:CanvasImageSource[];
    flipchartSpriteWidth:number = 1974;
    flipchartSpriteHeight:number = 2400;

    

    constructor(){

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

    }


    public draw(ctx:CanvasRenderingContext2D, flipchart:Flipchart){
       
        //BG
		ctx.drawImage(this.flipchartSpritesSmall[flipchart.activeFlipchart],
			this.flipchartSpriteSmallStartX, this.flipchartSpriteSmallStartY, this.flipchartSpriteSmallWidth, this.flipchartSpriteSmallHeight, // sprite cutout position and size
            flipchart.x, flipchart.y, flipchart.width, flipchart.height); 	 // draw position and size
            
        if(flipchart.game.drawColliders) this.drawColider(ctx, flipchart);
            
    }

    
    public drawFlipchartScreen(ctx:CanvasRenderingContext2D, flipchart:Flipchart){
       
        // BG
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.fillRect(flipchart.infoBox_x, flipchart.infoBox_y, flipchart.infoBoxWidth, flipchart.infoBoxHeight);
        ctx.fill();
        ctx.closePath();
		
		// infos
		ctx.fillStyle = "black";
	    ctx.font = "bold 12px Arial";
		//ctx.fillText('Flipchart', infoBox_x+5, infoBox_y+30);
        
        // sprite (1974 × 2400)
        ctx.drawImage(this.flipchartSprites[flipchart.activeFlipchart],
			0, 0, this.flipchartSpriteWidth, this.flipchartSpriteHeight, // sprite cutout position and size
            flipchart.infoBox_x-15, flipchart.infoBox_y, flipchart.infoBoxWidth, flipchart.infoBoxHeight); 	 // draw position and size

        if(flipchart.activeFlipchart == 3) this.drawResultTable(ctx, flipchart);

        if(flipchart.game.arcadeMode){
            if(flipchart.activeFlipchart == Flipchart.FLIPCHART_CONTROLES) {

                flipchart.startButton.text = 'Got it';
                flipchart.startButton.x = flipchart.infoBox_x + flipchart.infoBoxWidth / 4;
                flipchart.startButton.y = flipchart.infoBox_y + flipchart.infoBoxHeight - 150;

                flipchart.startButton.draw(ctx); 

            } else if(flipchart.activeFlipchart == Flipchart.FLIPCHART_WARMUP) {
                
                flipchart.startButton.text = 'Start';
                flipchart.startButton.x = flipchart.infoBox_x + flipchart.infoBoxWidth / 4;
                flipchart.startButton.y = flipchart.infoBox_y + flipchart.infoBoxHeight - 150;
                
                flipchart.startButton.draw(ctx); 

            } else if(flipchart.activeFlipchart == Flipchart.FLIPCHART_RULES) {

                flipchart.startButton.text = 'Got it';
                flipchart.startButton.x = flipchart.infoBox_x + flipchart.infoBoxWidth / 4;
                flipchart.startButton.y = flipchart.infoBox_y + flipchart.infoBoxHeight - 150;
                
                flipchart.startButton.draw(ctx); 

            } else if(flipchart.activeFlipchart == Flipchart.FLIPCHART_RESULTS) {
                var y = 145;
                var yOffset = 50;

                if(flipchart.game.gameState == Game.GAME_STATE_PREP) flipchart.startButton.text = 'Prepare';
                if(flipchart.game.gameState == Game.GAME_STATE_PLAY) flipchart.startButton.text = 'Start';
                
                flipchart.startButton.x = flipchart.infoBox_x + flipchart.infoBoxWidth - flipchart.startButton.width - 75;
                flipchart.startButton.y = y + yOffset * (flipchart.activeRound - 1);
                
                if(flipchart.game.gameState != Game.GAME_STATE_END) flipchart.startButton.draw(ctx); 

                //estimation Input
                if(flipchart.game.gameState == Game.GAME_STATE_PLAY){

                    if(flipchart.input_estimation == null) 
                        // @ts-ignore
                        this.input_estimation = new CanvasInput({
                            canvas: ctx.canvas,
                            x: 333,
                            y: y + yOffset * (flipchart.activeRound - 1),
                            width: 30,
                            value: '?'
                        });

                        flipchart.input_estimation.render();
                }

            }
            

        } else {

            if(flipchart.lastActivator == flipchart.game.player.id){
                flipchart.nextFlipchartButton.draw(ctx);
                flipchart.previousFlipchartButton.draw(ctx);
            }

        }

            
    }
        
    public drawResultTable(ctx:CanvasRenderingContext2D, flipchart:Flipchart){

        ctx.fillStyle = "black";
        ctx.font = "bold 20px Arial";

        var x = 340;
        var xOffset = 60;

        var y = 163;
        var yOffset = 50;
        
        // Runde 1
        ctx.fillText(flipchart.resultTable.round1.estimation, x, y);
        ctx.fillText(flipchart.resultTable.round1.result, x + xOffset, y);
        ctx.fillText(flipchart.resultTable.round1.bugs, x + xOffset*2, y);
        // Runde 2
        ctx.fillText(flipchart.resultTable.round2.estimation, x, y + yOffset);
        ctx.fillText(flipchart.resultTable.round2.result, x + xOffset, y + yOffset);
        ctx.fillText(flipchart.resultTable.round2.bugs, x + xOffset*2, y + yOffset);
        // Runde 3
        ctx.fillText(flipchart.resultTable.round3.estimation, x, y + yOffset*2);
        ctx.fillText(flipchart.resultTable.round3.result, x + xOffset, y + yOffset*2);
        ctx.fillText(flipchart.resultTable.round3.bugs, x + xOffset*2, y + yOffset*2);
        // Runde 4
        ctx.fillText(flipchart.resultTable.round4.estimation, x, y + yOffset*3);
        ctx.fillText(flipchart.resultTable.round4.result, x + xOffset, y + yOffset*3);
        ctx.fillText(flipchart.resultTable.round4.bugs, x + xOffset*2, y + yOffset*3);
        // Runde 5
        ctx.fillText(flipchart.resultTable.round5.estimation, x, y + yOffset*4);
        ctx.fillText(flipchart.resultTable.round5.result, x + xOffset, y + yOffset*4);
        ctx.fillText(flipchart.resultTable.round5.bugs, x + xOffset*2, y + yOffset*4);
    }

    public drawColider(ctx:CanvasRenderingContext2D, flipchart:Flipchart){
        DrawUtils.drawCyrcleOutline(ctx, flipchart.middleX, flipchart.middleY, flipchart.radius, 'blue');
    }

    
}
