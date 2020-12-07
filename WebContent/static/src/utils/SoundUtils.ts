import { ISound } from "../interfaces/ISound";
import { GeometryUtils } from "./GeometryUtils1";

export class SoundUtils {

    public static getVolumeFromDistance(soundX: number, soundY: number, soundRadius: number, toX: number, toY: number): number {

        var volume;

        var distance = GeometryUtils.getDistance(soundX, soundY, toX, toY);

        if (distance > soundRadius) {
            volume = 0;
        } else {
            volume = 1 - (distance / soundRadius);
        }

        return volume;
    }

    public static getVolumeFromDistanceSoundObject(soundObject: ISound, toX: number, toY: number): number {
        return SoundUtils.getVolumeFromDistance(soundObject.x, soundObject.y, soundObject.soundRadius, toX, toY);
    }

}



