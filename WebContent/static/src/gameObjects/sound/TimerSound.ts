import { Timer } from '../Timer';


export class TimerSound {

    audioCountDown: any;
    countDownStarted: boolean;

    audioRinging: any;
    ringingStarted: boolean;

    volume: number = 1;

    constructor() {
        this.audioCountDown = new Audio('/static/resources/sounds/timerCountDown.mp3');
        this.audioCountDown.loop = true;
        
        this.audioRinging = new Audio('/static/resources/sounds/timerRinging.mp3');
        this.audioRinging.loop = true;
    }


    public playCountdown() {
        this.audioCountDown.play();
        this.countDownStarted = true;
    }

    public stopCountdown() {
        this.audioCountDown.pause();
        this.countDownStarted = false;
    }

    public playRinging() {
        this.audioRinging.play();
        this.ringingStarted = true;
    }

    public stopRinging() {
        this.audioRinging.pause();
        this.ringingStarted = false;
    }

    public setVolume(volume: number) {
        this.audioCountDown.volume = volume;
        this.audioRinging.volume = volume;

    }



}