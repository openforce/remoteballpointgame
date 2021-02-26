import { Game } from './Game';

import { RadioSound } from '../gameObjects/sound/RadioSound';
import { TimerSound } from '../gameObjects/sound/TimerSound';


export class GameSounds {


	game: Game;

	radioSounds: RadioSound[];
	timerSound: TimerSound;


	constructor(game: Game) {
		this.game = game;
		this.radioSounds = [];
	}

	public init() {
		this.timerSound = new TimerSound();
		this.game.timer.sound = this.timerSound;
	}

	public update() {

		// Timer
		this.game.timer.updateSounds();

		// Radios
		for (var i = 0; i < this.game.radios.length; i++) {

			// create radio if its noch existing
			if (this.radioSounds[this.game.radios[i].id] == null) {
				var newSound = new RadioSound();
				this.radioSounds[this.game.radios[i].id] = newSound;
				this.game.radios[i].sound = newSound;

				if (this.game.radios[i].on) {
					newSound.playSound();
					// ToDo: in this case the sounds of the players are not in sync!!
				}

			}

			this.game.radios[i].updateSound();

		}


	}


}