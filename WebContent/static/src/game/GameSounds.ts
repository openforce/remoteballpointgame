import { Game } from './Game';

import { RadioSound } from '../gameObjects/sound/RadioSound';


export class GameSounds {


	game: Game;

	radioSounds: RadioSound[];


	constructor(game: Game) {
		this.game = game;
		this.radioSounds = [];

	}


	public update() {

		// Radios
		for (var i = 0; i < this.game.radios.length; i++) {
			
			if (this.radioSounds[this.game.radios[i].id] == null) { 
				var newSound = new RadioSound();
				this.radioSounds[this.game.radios[i].id] = newSound;
				this.game.radios[i].sound = newSound;

				if(this.game.radios[i].on){
					newSound.playSound(); 
					// in this case the sounds of the players are not in sync!!
				}
			
			}

			this.game.radios[i].updateSound();

		}


	}


}