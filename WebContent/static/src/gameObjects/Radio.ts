import { Game } from '../game/Game';
import { RadioState } from './syncObjects/RadioState';

import { RadioSound } from './sound/RadioSound';
import { RadioAnimation } from './drawer/animationStates/RadioAnimation';

import { ISound } from '../interfaces/ISound';
import { TempColliderCircle } from '../gameObjectLibrary/TempCollider';

import { RandomUtils } from '../utils/RandomUtils1';
import { SoundUtils } from '../utils/SoundUtils';


export class Radio implements ISound{

    id: number;

    x: number;
    y: number;
    radius: number = 25;
    
    width: number = 55;
    height: number = 40;
    
    rotation: number;

    middleX: number;
    middleY: number;

    sprite: CanvasImageSource;

    sound: RadioSound;
    soundRadius: number = 500;

    game: Game;

    on: boolean;

    animationState: RadioAnimation;

    constructor(game: Game, x: number, y: number, rotation: number) {

        this.game = game;

        var date = Date.now();
        this.id = Number(date.toString() + RandomUtils.getRandomNumber(1, 100).toString());;

        this.x = x;
        this.y = y;

        this.rotation = rotation;

        this.updateMiddle();

        this.on = false;

        this.animationState = new RadioAnimation(this);

    }

    public getSyncState() {
        var syncObject = new RadioState();

        syncObject.id = this.id;
        syncObject.on = this.on;

        syncObject.x = this.x;
        syncObject.y = this.y;

        syncObject.rotation = this.rotation;

        syncObject.animationCount = this.animationState.playAnimationCount;

        return syncObject;
    }

    public syncState(syncObject: RadioState) {
        this.id = syncObject.id;

        this.x = syncObject.x;
        this.y = syncObject.y;

        this.rotation = syncObject.rotation;

        if (this.on != syncObject.on) this.triggerRadio();

        this.animationState.playAnimationCount = syncObject.animationCount;

    }

    public update(timeDiff: number){
        this.animationState.update(timeDiff);
    }

    public updateSound() {

        if (this.on) {
            var volume = SoundUtils.getVolumeFromDistanceSoundObject(this, this.game.player.x, this.game.player.y);
            this.sound.setVolume(volume);
        }

    }

    public updateMiddle(){
        this.middleX = this.x + this.width / 2;
        this.middleY = this.y + this.height / 2;
    } 

    public getCollider(){

        this.updateMiddle();
        return new TempColliderCircle(this.middleX, this.middleY, this.radius);
    }

    public triggerRadio() {
        this.on = !this.on;


        // sound
        if (this.sound) {

            if (this.on) {
                this.sound.playSound();
            } else if (!this.on) {
                this.sound.stopSound();
            }

        }

    }




}