
export class GameSyncer {
    
    socket:any;

	constructor(){

		// open socket connection to server
		// @ts-ignore
		this.socket = window.io();

	}

	

}