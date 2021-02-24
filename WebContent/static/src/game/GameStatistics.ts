
export class GameStatistics {
   

    maxNumberOfPlayers: number;
    numberOfEnters: number;

    numberOfBallsTakenFromBasket: number;
    numberOfBallShots: number;
    numberOfBallAutoCatches: number;
    numberOfBallsTaken: number;
    numberOfBallsReturnedToBasket: number;


    numberOfTimerTriggers: number;
    numberOfFlipchartTriggers: number;
    numberOfRadioTriggers: number;
    numberOfDoorTriggers: number;
    
    numberOfFlipchartPageChanges: number;
    numberOfResultSubmits: number;


    constructor(){
        this.maxNumberOfPlayers = 0;
        this.numberOfEnters = 0;

        this.numberOfBallsTakenFromBasket = 0;
        this.numberOfBallShots = 0;
        this.numberOfBallAutoCatches = 0;
        this.numberOfBallsTaken = 0;
        this.numberOfBallsReturnedToBasket = 0;

        this.numberOfTimerTriggers = 0;
        this.numberOfFlipchartTriggers = 0;
        this.numberOfRadioTriggers = 0;
        this.numberOfDoorTriggers = 0;
        
        this.numberOfFlipchartPageChanges = 0;
        this.numberOfResultSubmits = 0;
    }


    public syncMaxNumbersOfPlayers(numberOfPlayers: number){
        if(numberOfPlayers > this.maxNumberOfPlayers){
            this.maxNumberOfPlayers = numberOfPlayers;
        }
    }
    
}