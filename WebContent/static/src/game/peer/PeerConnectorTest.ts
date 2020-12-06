import { GameEngine } from "../../engine/GameEngine";
import { Game } from "../Game";


export class PeerConnectorTest {

	game: Game;

	constructor(game: Game) {
		this.game = game;
	}

	peer: any;
	conn: any;
	call: any;

	streamReceived: boolean;

	htmlVideo: any;

	public addPeer(peerId: any) {

		// @ts-ignore
		this.peer = new Peer(peerId, {
			host: 'localhost',
			port: '5001', //location.port || (location.protocol === 'https:' ? 443 : 80),
			path: '/peerjs',
			debug: true,
			config: {
				'iceServers': [
					{ 'url': 'stun:stun.l.google.com:19302' }
				]
			}
		});

		this.peer.on('open', function (id: any) {
			console.log('OPEN: My peer ID is: ' + id);
		});

		this.peer.on('error', function (err: any) {
			console.log('received error', err);
		});



		// Receive connection
		this.peer.on('connection', function (newConn: any) {
			console.log('received connection from peer', newConn.peer);

			this.conn = newConn;

			// Receive data
			this.conn.on('data', function (data: any) {
				console.log('Received data', data);
			});

			this.conn.send('Hallo, I got your connection!!');
		});


		// Receive call
		this.peer.on('call', (function (self) {
			return function (call: any) {
				
				console.log('received call from peer', call.peer);

				this.call = call;

				// answer with own stream
				navigator.mediaDevices.getUserMedia({ video: true, audio: true })
					.then(stream => {
						call.answer(stream);
					});

				// Receive stream
				call.on('stream', function (stream: any) {

					console.log('received stream from incoming call!');

					if(this.streamReceived) return;
					else this.streamReceived = true;

					var htmlVideo = document.createElement('video');
					// @ts-ignore
					htmlVideo.setAttribute('autoplay', true);
					// @ts-ignore
					htmlVideo.setAttribute('controls', true);

					htmlVideo.setAttribute('width', '150');
					//htmlVideo.setAttribute('height', '300');

					htmlVideo.srcObject = stream;

					var videoContainer = document.getElementById('videos-container');
					videoContainer.insertBefore(htmlVideo, videoContainer.firstChild);
				});

			}
		})(this));

	}

	public connectToPeer(peerId: any) {
		this.conn = this.peer.connect(peerId);

		this.conn.on('open', (function (self) {
			return function () {
				console.log('OPEN');


				// Receive messages
				self.conn.on('data', function (data: any) {
					console.log('Received', data);
				});

				// Send messages
				self.conn.send('Hello, thx for accepting my connection!!');

			}
		})(this));

	}


	public sendTextToConn(text: any) {
		this.conn.send(text);
	}



	public showMyVideo() {

		var htmlVideo = document.createElement('video');
		// @ts-ignore
		htmlVideo.setAttribute('autoplay', true);
		// @ts-ignore
		htmlVideo.setAttribute('controls', true);

		htmlVideo.setAttribute('width', '150');
		//htmlVideo.setAttribute('height', '150');

		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => htmlVideo.srcObject = stream);

		var videoContainer = document.getElementById('videos-container');
		videoContainer.insertBefore(htmlVideo, videoContainer.firstChild);

	}

	public callPeer(peerId: any) {

		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => {

				this.call = this.peer.call(peerId, stream);

				this.call.on('stream', function (remoteStream: any) {

					console.log('received stream from outgoing call!');

					if(this.streamReceived) return;
					else this.streamReceived = true;

					var htmlVideo = document.createElement('video');
					// @ts-ignore
					htmlVideo.setAttribute('autoplay', true);
					// @ts-ignore
					htmlVideo.setAttribute('controls', true);
					
					htmlVideo.setAttribute('width', '150');
					//htmlVideo.setAttribute('height', '150');

					htmlVideo.srcObject = remoteStream;

					var videoContainer = document.getElementById('videos-container');
					videoContainer.insertBefore(htmlVideo, videoContainer.firstChild);
				});
			});

	}
}

