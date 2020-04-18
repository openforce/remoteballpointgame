import {Game} from '../game/Game.js';
import {Button} from '../gameObjectLibrary/Button.js';


export class Flipchart {
    
    static FLIPCHART_CONTROLES = 0;
    static FLIPCHART_WARMUP = 1;
    static FLIPCHART_RULES = 2;
    static FLIPCHART_RESULTS = 3;
    static FLIPCHART_END = 4;

    game:Game;

    x: number;
    y: number;
    radius:number = 40;

    width:number = 131 * 0.9;
    height:number = 83 * 1.2;

    middleX:number;
    middleY:number;
    
    active:boolean;
    activeFlipchart:number = 0;
    lastActivator:number;

    numberOfFlipcharts = 4;

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

    
    nextFlipchartButton:Button;
    previousFlipchartButton:Button;

    startButton:Button;
    
    input_estimation:any;

    infoBoxWidth:number = 400;
    infoBoxHeight:number = 550;
    infoBox_x:number = 200;
    infoBox_y:number = 25;


    constructor(game:Game, x:number, y:number){
        
        this.game = game;
        
        this.x = x;
        this.y = y;

        this.middleX = this.x + (this.width/2)-20;
        this.middleY = this.y + this.height/2;

        this.active = false;

        if(this.game.socket != null){

            //server --> client
            this.game.socket.on('new result table', (function(self) { //Self-executing func which takes 'this' as self
                return function(serverResultTable:any) {
                    self.game.flipchart.resultTable = serverResultTable;
                }
            })(this));

        }

        if(this.game.ui){

            this.startButton = new Button(this.game.gameEngine.ctx, this.infoBox_x + this.infoBoxWidth / 4, this.infoBox_y + this.infoBoxHeight - 150 , 60, 25, 'Got it!'); 
            this.startButton.textFont = 'bold 12px Arial';    
            this.nextFlipchartButton = new Button(this.game.gameEngine.ctx, this.infoBox_x + this.infoBoxWidth - 60, this.infoBox_y + this.infoBoxHeight - 30 , 50, 20, '     -->');               
            this.previousFlipchartButton = new Button(this.game.gameEngine.ctx, this.infoBox_x + 10, this.infoBox_y + this.infoBoxHeight - 30 , 50, 20, '<--');

        }
    }

    public update(timeDiff:number){
       
    }

    public checkClick(mouseX:number, mouseY:number){

        if(this.active){
            
            if(this.game.arcadeMode){
                if(this.startButton.checkForClick(mouseX, mouseY)) this.triggerStartButton();
            } else {
                if(this.nextFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerNextFlipchart();
                if(this.previousFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerPreviousFlipchart();
            }

        }
    }


    public triggerFlipchart(){
        this.active = !this.active;
        this.game.socket.emit('trigger flipchart', this.game.player.id);  
    }

    public showFlipchart(){
        this.active = true;
        this.game.socket.emit('show flipchart');  
    }

    public hideFlipchart(){
        this.active = false;
        this.game.socket.emit('hide flipchart');  
    }

    
    public triggerStartButton(){
        
        if(this.activeFlipchart == Flipchart.FLIPCHART_CONTROLES){ 
            
            // --> show Warm Up Flipchart
            this.triggerSpecificFlipchart(Flipchart.FLIPCHART_WARMUP);

        } else if(this.activeFlipchart == Flipchart.FLIPCHART_WARMUP){ 
            
            // --> start Warm Up
            this.game.gameState = Game.GAME_STATE_WARMUP;
            this.game.socket.emit('set gameState', this.game.gameState);  

            this.game.timer.startTimer();
            this.hideFlipchart();
        
        } else if(this.activeFlipchart == Flipchart.FLIPCHART_RULES){ 
            
            // --> show result table
            this.game.gameState = Game.GAME_STATE_PREP;
            this.game.socket.emit('set gameState', this.game.gameState); 

            this.triggerSpecificFlipchart(Flipchart.FLIPCHART_RESULTS);
        
        } else if(this.activeFlipchart == Flipchart.FLIPCHART_RESULTS){ 

            if(this.game.gameState == Game.GAME_STATE_PREP) { 
                
                // --> start PREP Phase
                this.game.timer.startTimer();
                if(this.game.showPoints) this.game.triggerShowPoints();
                this.hideFlipchart();

            } else if(this.game.gameState == Game.GAME_STATE_PLAY && this.activeRound <= this.rounds) { 
                
                // --> start Play Mode
                // @ts-ignore
                this.resultTable['round'+this.activeRound].estimation = this.input_estimation.value();
                this.syncResultTable();

                this.game.timer.startTimer();
                if(!this.game.showPoints) this.game.triggerShowPoints();
                this.hideFlipchart();

            } else { // --> END

            }
        }
    }

    public triggerTimerEnded(){
       
        if(!this.game.arcadeMode) return;

        if(this.activeFlipchart == Flipchart.FLIPCHART_WARMUP){ 
            
            // --> End Warm Up
            this.triggerSpecificFlipchart(Flipchart.FLIPCHART_RULES);
            this.showFlipchart();

        } else if(this.activeFlipchart == Flipchart.FLIPCHART_RESULTS){ 

            if(this.game.gameState == Game.GAME_STATE_PREP) { 
                
                // --> End PREP Phase
                this.game.gameState = Game.GAME_STATE_PLAY;
                this.game.socket.emit('set gameState', this.game.gameState); 
                this.input_estimation = null;

                this.showFlipchart();

            } else if(this.game.gameState == Game.GAME_STATE_PLAY && this.activeRound < this.rounds) { 
                
                // --> End PLAY Phase
                this.game.gameState = Game.GAME_STATE_PREP;
                this.game.socket.emit('set gameState', this.game.gameState); 

                this.activeRound++;
                this.showFlipchart();

            } else { // --> END
                this.game.gameState = Game.GAME_STATE_END;
                this.game.socket.emit('set gameState', this.game.gameState); 

                this.showFlipchart();
            }
        }
    }
    
    public triggerNextFlipchart(){
        this.activeFlipchart++;
        if(this.activeFlipchart == this.numberOfFlipcharts) this.activeFlipchart = 0; 
        
        this.game.socket.emit('trigger next flipchart'); 
    }
    public triggerPreviousFlipchart(){
        this.activeFlipchart--;
        if(this.activeFlipchart < 0) this.activeFlipchart = this.numberOfFlipcharts-1; 

        this.game.socket.emit('trigger previous flipchart'); 
    }

    public triggerSpecificFlipchart(flipchart:number){
        this.activeFlipchart = flipchart;
        
        this.game.socket.emit('trigger specific flipchart', flipchart); 
    }

    public syncResultTable(){
        this.game.socket.emit('sync result table', this.resultTable);
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

}
