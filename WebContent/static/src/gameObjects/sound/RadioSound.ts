import { Radio } from '../Radio';


export class RadioSound {

    audio: any;

    volume: number = 1;

    constructor() {
        this.audio = new Audio('/static/resources/sounds/gamemusic.mp3');
        this.audio.loop = true;
    }


    public playSound() {
        this.audio.play();
    }

    public stopSound() {
        this.audio.pause();
    }

    public setVolume(volume: number) {
        this.audio.volume = volume;
    }



}