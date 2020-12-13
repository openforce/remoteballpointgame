import { Game } from "../Game";

export class GameSyncer {

	socket: any;
	gameRoomId: string;

	game: Game;

	constructor(game: Game) {

		this.game = game;

		// open socket connection to server
		// @ts-ignore
		this.socket = window.io();

		// get room id
		var url = window.location.href;
		var splittedUrl = url.split('/');

		this.gameRoomId = splittedUrl[splittedUrl.length-1];

	}


	public sendEvent(eventString: string) {
		//console.log('sendEvent:', eventString);
		this.socket.emit(eventString);
	}

	public sendEventAndData(eventString: string, data: any) {
		//console.log('sendEventAndData:', eventString, data);
		this.socket.emit(eventString, data);
	}

}