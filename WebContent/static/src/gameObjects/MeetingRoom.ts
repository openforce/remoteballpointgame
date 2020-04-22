import { Game } from '../game/Game';


export class MeetingRoom {

    game:Game;

    border:number = 100;
    
    constructor(game:Game){

        this.game = game;

    }

    
    public update(timeDiff:number){
       
    }
    
}