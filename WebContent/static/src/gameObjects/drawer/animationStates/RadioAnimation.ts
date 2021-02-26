import { Radio } from "../../Radio";


export class RadioAnimation {

    radio: Radio;

    playAnimationFrames: number = 2;
    playAnimationCount: number = 0;
    playAnimationTime: number = 200;
    playAnimationTimeDif: number = 0;

    constructor(radio: Radio) {
        this.radio = radio;
    }

    public update(timeDiff: number) {
        
        this.playAnimationTimeDif += timeDiff;

        if (this.radio.on) {
            if (this.playAnimationTimeDif > this.playAnimationTime) {
                this.playAnimationCount++;
                if (this.playAnimationCount > this.playAnimationFrames) this.playAnimationCount = 1;
                this.playAnimationTimeDif = 0;
            }
        } else this.playAnimationCount = 0;
    }

}