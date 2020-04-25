import { Game } from "../static/src/out/game/Game";

export class SocketListener {

    io: any;

    game: Game;

    constructor(io: any, game: Game) {

        this.io = io;
        this.game = game;

    }


    public init() {
        console.log('You should extend this class!');
    }


}