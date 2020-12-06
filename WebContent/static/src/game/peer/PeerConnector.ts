import { GameEngine } from "../../engine/GameEngine";
import { Game } from "../Game";


export class PeerConnector {

	game: Game;

	peer: any;
	connections: any[];

	constructor(game: Game) {
		this.game = game;
		this.connections = [];
	}

	public init() {

		//@ts-ignore
		this.peer = new Peer(this.game.player.id, {
			host: location.hostname,
			port: '5001', //location.port || (location.protocol === 'https:' ? 443 : 80),
			path: '/peerjs',
			debug: true,
			config: {
				'iceServers': [
					{ 'url': 'stun:stun.l.google.com:19302' }
				]
			}
		});

		console.log('added Peer with id ', this.game.player.id);

		// listen for OPEN
		this.peer.on('open', function (id: any) {
			console.log('received open with id', id);
		});

		// listen for ERROR
		this.peer.on('error', function (err: any) {
			console.log('received error', err);
		});

		// listen for CONNECTION
		this.peer.on('connection', function (conn: any) {
			console.log('received connection from peer', conn.peer);
			
			if(this.connections[conn.peer] == null) { 
				this.connections[conn.peer] = conn;

				// listen for DATA
				this.connections[conn.peer].on('data', function (data:any) {
					console.log('Received data', data);
				});
			}

			conn.send('Hello peer', conn.peer);
			
		});

	}

	public connectToPeerWithPlayerId(playerId: number) {
		
		if(this.connections[playerId] == null && playerId < this.game.player.id) {
			console.log('connect to Peer with id ', playerId);
		
			this.connections[playerId] = this.peer.connect(playerId);
			
			// listen for OPEN
			this.connections[playerId].on('open', function () {
				console.log('received open, send Hi!');

				// listen for DATA
				this.connections[playerId].on('data', function (data:any) {
					console.log('Received data', data);
				});
	
				this.connections[playerId].send('Hi!');
			});

		}

	}

	public sendDataToPeerWithPlayerId(playerId: number, data: any) {
		this.connections[playerId].send('Hallo');
		console.log('sent data to player ', playerId);
	}

}

