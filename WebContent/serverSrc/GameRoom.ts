import { Game } from "../static/src/out/game/Game";
import { GameConfigs } from "../static/src/out/game/Configs";
import { GameRoomStatistics } from "./GameRoomStatistics";

export class GameRoom {

    gameRoomId: string;
    gameCreatedTimestamp: number;

    gameRoomStatistics: GameRoomStatistics;

    // @ts-ignore
    game: Game;

    log = true;

    lastTime = 0;
    timeDiff = 0;

    gameEmptyTimeStemp: number;

    mainLoopIntervallId: any;

    shouldBeDeleted: boolean;

    constructor(gameRoomId: string, io: any) {

        this.gameRoomId = gameRoomId;

        var now = new Date();
        this.gameCreatedTimestamp = now.getTime();

        this.game = new Game();
        this.game.initGameSimulation();

        this.gameRoomStatistics = new GameRoomStatistics(this.gameRoomId, this.game.gameStatistics);
        this.gameRoomStatistics.createdTimestamp = this.gameCreatedTimestamp;

        this.gameEmptyTimeStemp = null;

        // main loop for this game
        this.mainLoopIntervallId = setInterval(
            (function (self) {
                return function () {
                    self.updateGame();
                    if(self.game != null) io.to(gameRoomId).emit('state', self.game.getPlayerStateList(), self.game.getBallStateList(), self.game.timer.getSyncState(), self.game.flipchart.getSyncState(), self.game.getSyncState(), self.game.getRadioStateList());
                }
            })(this), 1000 / 60);
    }


    public updateGame() {

        var now = new Date();
        var time = now.getTime();

        this.timeDiff = time - this.lastTime;
        this.lastTime = time;

        this.game.updateGame(this.timeDiff);

        if (Object.keys(this.game.players).length == 0) {
            if (this.gameEmptyTimeStemp == null) {
                if (this.log) console.log('room with id ', this.gameRoomId, ' is empty');
                this.gameEmptyTimeStemp = time;
            }
            else if ((time - this.gameEmptyTimeStemp) > GameConfigs.emptyRoomDeleteDelay) {
                this.markToDelete();
            }
        } else {
            this.gameEmptyTimeStemp = null;
        }

    }

    public markToDelete() {
        if (this.log) console.log('mark room with id ', this.gameRoomId, ' to delete');
        
        this.gameRoomStatistics.setClosedTimestamp();
        this.gameRoomStatistics.logStatics();

        clearInterval(this.mainLoopIntervallId);
        this.game = null;
        this.shouldBeDeleted = true;
    }

}