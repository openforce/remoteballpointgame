import { GameStatistics } from "../static/src/out/game/GameStatistics";

export class GameRoomStatistics {
   

    gameRoomId: string;

    createdTimestamp: number;
    closedTimestamp: number;
    
    roomLifetime: number;

    gameStatistics: GameStatistics;

    constructor(gameRoomId: string, gameStatistics: GameStatistics) {

        this.gameRoomId = gameRoomId;
        this.gameStatistics = gameStatistics;

    }

    public setClosedTimestamp() {
        this.closedTimestamp = (new Date()).getTime();
        this.roomLifetime = this.closedTimestamp - this.createdTimestamp;
    }

    public playerAdded(numberOfPlayers: number) {
        this.gameStatistics.numberOfEnters++;
        this.gameStatistics.syncMaxNumbersOfPlayers(numberOfPlayers);
    }

    public logStatics(){
        console.log('-------------');
        console.log('statistics for room ', this.gameRoomId);

        console.log('created: ', (new Date(this.createdTimestamp)).toTimeString());
        console.log('closed: ', (new Date(this.closedTimestamp)).toTimeString());
        console.log('lifetime (in seconds): ', (this.closedTimestamp - this.createdTimestamp)/1000);

        console.log('maxNumberOfPlayers: ', this.gameStatistics.maxNumberOfPlayers);
        console.log('numberOfEnters: ', this.gameStatistics.numberOfEnters);

        console.log('numberOfBallsTakenFromBasket: ', this.gameStatistics.numberOfBallsTakenFromBasket);
        console.log('numberOfBallShots: ', this.gameStatistics.numberOfBallShots);
        console.log('numberOfBallAutoCatches: ', this.gameStatistics.numberOfBallAutoCatches);
        console.log('numberOfBallsTaken: ', this.gameStatistics.numberOfBallsTaken);
        console.log('numberOfBallsReturnedToBasket: ', this.gameStatistics.numberOfBallsReturnedToBasket);
        
        console.log('numberOfTimerTriggers: ', this.gameStatistics.numberOfTimerTriggers);
        console.log('numberOfFlipchartTriggers: ', this.gameStatistics.numberOfFlipchartTriggers);
        console.log('numberOfRadioTriggers: ', this.gameStatistics.numberOfRadioTriggers);
        console.log('numberOfDoorTriggers: ', this.gameStatistics.numberOfDoorTriggers);

        console.log('numberOfFlipchartPageChanges: ', this.gameStatistics.numberOfFlipchartPageChanges);
        console.log('numberOfResultSubmits: ', this.gameStatistics.numberOfResultSubmits);
        
        console.log('-------------');
    }

}