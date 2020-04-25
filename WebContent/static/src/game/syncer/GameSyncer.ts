import { Game } from "../Game";

export class GameSyncer {
    
	socket:any;
	
	game:Game;

	syncMode:number;

	constructor(game:Game){

		this.game = game;

		// open socket connection to server
		// @ts-ignore
		this.socket = window.io();

	}

	

}