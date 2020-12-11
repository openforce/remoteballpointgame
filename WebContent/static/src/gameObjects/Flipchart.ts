import { Game } from '../game/Game';
import { Inputs } from '../game/Inputs';

import { Button } from '../gameObjectLibrary/Button';
import { TempColliderCircle } from '../gameObjectLibrary/TempCollider';
import { FlipchartState } from './syncObjects/FlipchartState';
import { PlayerInputState } from './syncObjects/PlayerInputState';


export class Flipchart {

    static FLIPCHART_CONTROLES = 0;
    static FLIPCHART_WARMUP = 1;
    static FLIPCHART_RULES = 2;
    static FLIPCHART_RESULTS = 3;
    static FLIPCHART_END = 4;

    game: Game;

    x: number;
    y: number;
    radius: number = 40;

    width: number = 131 * 0.9;
    height: number = 83 * 1.2;

    middleX: number;
    middleY: number;

    active: boolean;
    activeFlipchart: number = 0;
    lastActivator: number = 0;

    numberOfFlipcharts = 4;

    rounds = 5;
    activeRound = 1;

    resultTable: any;
    resultTableInputs: any;
    resultTableSaveButton: Button;

    mousePosX: number;
    mousePosY: number;

    clickedLeft: boolean = false;
    clickedRight: boolean = false;
    clickedClose: boolean = false;

    clickedLeftTimeStemp = 0;
    clickedRightTimeStemp = 0;
    clickedCloseTimeStemp = 0;

    nextFlipchartButton: Button;
    previousFlipchartButton: Button;
    closeFlipchartButton: Button;


    // arcade mode inputs
    startButton: Button;
    input_estimation: any;

    infoBoxWidth: number = 400;
    infoBoxHeight: number = 550;
    infoBox_x: number = 200;
    infoBox_y: number = 25;


    constructor(game: Game, x: number, y: number) {

        this.game = game;

        this.x = x;
        this.y = y;

        this.updateMiddle();

        this.active = false;

        this.resultTable = this.getFreshResultTable();

        if (this.game.arcadeMode) {
            this.startButton = new Button(this.infoBox_x + this.infoBoxWidth / 4, this.infoBox_y + this.infoBoxHeight - 150, 60, 25, 'Got it!');
            this.startButton.textFont = 'bold 12px Arial';
        } else {
            this.nextFlipchartButton = new Button(this.infoBox_x + this.infoBoxWidth - 60, this.infoBox_y + this.infoBoxHeight - 30, 50, 20, '     -->');
            this.previousFlipchartButton = new Button(this.infoBox_x + 10, this.infoBox_y + this.infoBoxHeight - 30, 50, 20, '<--');
            this.closeFlipchartButton = new Button(this.infoBox_x + this.infoBoxWidth - 30, this.infoBox_y + 10, 25, 25, 'x');

            this.resultTableSaveButton = new Button(this.infoBox_x + this.infoBoxWidth - 150, this.infoBox_y + this.infoBoxHeight - 170, 60, 25, 'Save');
        }


    }

    public getSyncState() {
        var syncObject = new FlipchartState();

        syncObject.active = this.active;
        syncObject.activeFlipchart = this.activeFlipchart;
        syncObject.lastActivator = this.lastActivator;

        syncObject.resultTable = this.resultTable;

        return syncObject;
    }

    public syncState(syncObject: FlipchartState) {
        this.active = syncObject.active;
        this.lastActivator = syncObject.lastActivator;
        this.activeFlipchart = syncObject.activeFlipchart;
        this.resultTable = syncObject.resultTable;
    }

    public updateInputs(inputs: Inputs) {

        this.mousePosX = inputs.mousePosX;
        this.mousePosY = inputs.mousePosY;

        if (inputs.clickedLeft && inputs.clickedLeftTimeStemp > this.clickedLeftTimeStemp) {
            this.clickedLeft = true;
            this.clickedLeftTimeStemp = inputs.clickedLeftTimeStemp;
        } else if (!inputs.clickedLeft) {
            this.clickedLeft = false;
        }
    }

    public updateInputsFromPlayerInputState(inputs: PlayerInputState) {

        if (inputs.playerId != this.lastActivator) return;

        this.mousePosX = inputs.mouseX;
        this.mousePosY = inputs.mouseY;

        if (inputs.clickedLeft && inputs.clickedLeftTimeStemp > this.clickedLeftTimeStemp) {
            this.clickedLeft = true;
            this.clickedLeftTimeStemp = inputs.clickedLeftTimeStemp;
        } else if (!inputs.clickedLeft) {
            this.clickedLeft = false;
        }
    }

    public update(timeDiff: number) {

        if (this.clickedLeft) {
            this.checkClick(this.mousePosX, this.mousePosY);
            this.clickedLeft = false;
        }

        // check if the lastActivator left the game!
        if (this.lastActivator && !this.game.players[this.lastActivator]) this.active = false;

    }

    public checkClick(mouseX: number, mouseY: number) {

        if (this.active) {

            if (this.game.arcadeMode) {
                if (this.startButton.checkForClick(mouseX, mouseY)) this.triggerStartButton();
            } else {
                if (this.nextFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerNextFlipchart();
                if (this.previousFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerPreviousFlipchart();
                if (this.closeFlipchartButton.checkForClick(mouseX, mouseY)) this.triggerCloseFlipchart();

                if (this.resultTableSaveButton.checkForClick(mouseX, mouseY)) this.triggerSaveResultTableinputs();
            }

        }
    }

    // special handling for client side updates for result table inputs
    public updateClient(timeDiff: number) {

        if (this.clickedLeft) {
            this.checkClickClient(this.mousePosX, this.mousePosY);
            this.clickedLeft = false;
        }

    }
    // special handling for client side updates for result table inputs
    public checkClickClient(mouseX: number, mouseY: number) {

        if (this.active) {
            if (this.game.arcadeMode) return;
            else if (this.resultTableSaveButton.checkForClick(mouseX, mouseY)) this.triggerSaveResultTableinputs();
        }

    }

    public updateMiddle() {
        this.middleX = this.x + (this.width / 2) - 20;
        this.middleY = this.y + this.height / 2;
    }

    public getCollider() {

        this.updateMiddle();
        return new TempColliderCircle(this.middleX, this.middleY, this.radius);
    }


    public triggerFlipchart(playerId: number) {
        this.active = !this.active;
        this.lastActivator = playerId;
    }


    public triggerNextFlipchart() {
        this.activeFlipchart++;
        if (this.activeFlipchart == this.numberOfFlipcharts) this.activeFlipchart = 0;
    }

    public triggerPreviousFlipchart() {
        this.activeFlipchart--;
        if (this.activeFlipchart < 0) this.activeFlipchart = this.numberOfFlipcharts - 1;
    }

    public triggerCloseFlipchart() {
        this.active = false;
    }

    public triggerSaveResultTableinputs() {

        if (this.resultTableInputs == null) return;

        for (var i = 0; i < 5; i++) {
            this.resultTable['round' + (i + 1)].estimation = this.resultTableInputs['round' + (i + 1)].estimation.value();
            this.resultTable['round' + (i + 1)].result = this.resultTableInputs['round' + (i + 1)].result.value();
            this.resultTable['round' + (i + 1)].bugs = this.resultTableInputs['round' + (i + 1)].bugs.value();
        }

        this.game.addEvent('sync result table', this.resultTable);
    }

    public syncResultTable() {
        this.game.addEvent('sync result table', this.resultTable);
    }

    public getFreshResultTable() {

        var resultTable: any = {};

        for (var i = 0; i < 5; i++) {
            resultTable['round' + (i + 1)] = {};

            resultTable['round' + (i + 1)].estimation = '';
            resultTable['round' + (i + 1)].result = '';
            resultTable['round' + (i + 1)].bugs = '';
        }

        return resultTable;
    }



    // ARCADE MODE STUFF

    public triggerStartButton() {

        if (this.activeFlipchart == Flipchart.FLIPCHART_CONTROLES) {

            // --> show Warm Up Flipchart
            this.triggerSpecificFlipchart(Flipchart.FLIPCHART_WARMUP);

        } else if (this.activeFlipchart == Flipchart.FLIPCHART_WARMUP) {

            // --> start Warm Up
            this.game.gameState = Game.GAME_STATE_WARMUP;
            this.game.addEvent('set gameState', this.game.gameState);

            this.game.timer.startTimer();
            this.hideFlipchart();

        } else if (this.activeFlipchart == Flipchart.FLIPCHART_RULES) {

            // --> show result table
            this.game.gameState = Game.GAME_STATE_PREP;
            this.game.addEvent('set gameState', this.game.gameState);

            this.triggerSpecificFlipchart(Flipchart.FLIPCHART_RESULTS);

        } else if (this.activeFlipchart == Flipchart.FLIPCHART_RESULTS) {

            if (this.game.gameState == Game.GAME_STATE_PREP) {

                // --> start PREP Phase
                this.game.timer.startTimer();
                if (this.game.showPoints) this.game.triggerShowPoints();
                this.hideFlipchart();

            } else if (this.game.gameState == Game.GAME_STATE_PLAY && this.activeRound <= this.rounds) {

                // --> start Play Mode
                // @ts-ignore
                this.resultTable['round' + this.activeRound].estimation = this.input_estimation.value();
                this.syncResultTable();

                this.game.timer.startTimer();
                if (!this.game.showPoints) this.game.triggerShowPoints();
                this.hideFlipchart();

            } else { // --> END

            }
        }
    }

    public triggerTimerEnded() {

        if (!this.game.arcadeMode) return;

        if (this.activeFlipchart == Flipchart.FLIPCHART_WARMUP) {

            // --> End Warm Up
            this.triggerSpecificFlipchart(Flipchart.FLIPCHART_RULES);
            this.showFlipchart();

        } else if (this.activeFlipchart == Flipchart.FLIPCHART_RESULTS) {

            if (this.game.gameState == Game.GAME_STATE_PREP) {

                // --> End PREP Phase
                this.game.gameState = Game.GAME_STATE_PLAY;
                this.game.addEvent('set gameState', this.game.gameState);

                this.input_estimation.destroy();
                this.input_estimation = null;

                this.showFlipchart();

            } else if (this.game.gameState == Game.GAME_STATE_PLAY && this.activeRound < this.rounds) {

                // --> End PLAY Phase
                this.game.gameState = Game.GAME_STATE_PREP;
                this.game.addEvent('set gameState', this.game.gameState);

                this.activeRound++;
                this.showFlipchart();

            } else { // --> END
                this.game.gameState = Game.GAME_STATE_END;
                this.game.addEvent('set gameState', this.game.gameState);

                this.showFlipchart();
            }
        }
    }

    public showFlipchart() {
        this.active = true;
        this.game.addEvent('show flipchart', null);
    }

    public hideFlipchart() {
        this.active = false;
        this.game.addEvent('hide flipchart', null);
    }

    public triggerSpecificFlipchart(flipchart: number) {
        this.activeFlipchart = flipchart;

        this.game.addEvent('trigger specific flipchart', flipchart);
    }




}
