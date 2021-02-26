import { Player } from "../../Player";


export class PlayerAnimation {

    player: Player;

    walkAnimationFrames: number = 2;
    walkAnimationCount: number = 0;
    walkAnimationTime: number = 200;
    walkAnimationTimeDif: number = 0;

    constructor(player: Player) {
        this.player = player;
    }

    public update(timeDiff: number) {
        this.walkAnimationTimeDif += timeDiff;

        if (this.player.moveDown || this.player.moveLeft || this.player.moveRight || this.player.moveUp || this.player.moveForward || this.player.moveBackward) {
            if (this.walkAnimationTimeDif > this.walkAnimationTime) {
                this.walkAnimationCount++;
                if (this.walkAnimationCount > this.walkAnimationFrames) this.walkAnimationCount = 1;
                this.walkAnimationTimeDif = 0;
            }
        } else this.walkAnimationCount = 0;
    }

}