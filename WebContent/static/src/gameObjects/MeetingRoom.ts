import { Game } from '../game/Game';
import { TempCollider } from '../gameObjectLibrary/TempCollider';


export class MeetingRoom {

    game: Game;

    border: number = 100;

    doorCollider: TempCollider;

    constructor(game: Game) {

        this.game = game;

        this.doorCollider = new TempCollider(695, 160, 20, 105);

    }


    public update(timeDiff: number) {

    }

}