import { Radio } from "../gameObjects/Radio";
import { RadioState } from "../gameObjects/syncObjects/RadioState";

export interface IRadioList {
    [details: number]: Radio;
}

export interface IRadioStateList {
    [details: number]: RadioState;
} 