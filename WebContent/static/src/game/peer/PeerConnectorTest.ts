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
		this.peer = new Peer(peerId, {}); // Public PeerJS Server

		/*
		this.peer = new Peer(peerId, {
			host: 'localhost',
			port: '5001', //location.port || (location.protocol === 'https:' ? 443 : 80),
			path: '/peerjs',
			debug: true
		});*/

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




	// TEST with seperated stream tracks

	videoContainerWidth = 200;
	// handle video and audio stream seperated 
	// and handle permissions (e.g. audio only)
	mediaStream: MediaStream = new MediaStream();
	audio: number = 2; // 2 waiting; 1 true; 0 false
	video: number = 2; // 2 waiting; 1 true; 0 false
	// get lokal video
	public showMyVideoOnly() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: false })
			.then((function (self: any) {
				return function (stream: MediaStream) {
					self.mediaStream.addTrack(stream.getVideoTracks()[0]);
					self.video = 1;
					self.handleMediaTracks('tomtom');
				}
			})(this))
			.catch((function (self) {
				return function (e: any) {
					console.log("e: ", e);
					self.video = 0;
					self.handleMediaTracks('tomtom');
				};
			}(this)));
	}
	// get lokal video
	public showMyAudioOnly() {
		navigator.mediaDevices.getUserMedia({ video: false, audio: true })
			.then((function (self: any) {
				return function (stream: MediaStream) {
					self.mediaStream.addTrack(stream.getAudioTracks()[0]);
					self.audio = 1;
					self.handleMediaTracks('tomtom');
				}
			})(this))
			.catch((function (self) {
				return function (e: any) {
					console.log("e: ", e);
					self.audio = 0;
					self.handleMediaTracks('tomtom');
				};
			}(this)));
	}
	// wait for both tracks or handle permissions 
	public handleMediaTracks(id: string) {
		if (this.video != 2 && this.audio != 2) {
			var htmlVideo = this.createHtmlVideo(id);
			htmlVideo.srcObject = this.mediaStream;
			this.insertHtmlVideo(htmlVideo);
		}
	}

	public createHtmlVideo(id: string) {
		var htmlVideo = document.createElement('video');
		// @ts-ignore
		htmlVideo.setAttribute('autoplay', true);
		// @ts-ignore
		htmlVideo.setAttribute('controls', true);

		htmlVideo.setAttribute('width', this.videoContainerWidth.toString());
		//htmlVideo.setAttribute('height', '150');

		htmlVideo.id = id;

		return htmlVideo;
	}

	public insertHtmlVideo(htmlVideo: any) {
		var videoContainer = document.getElementById('videos-container');

		if (videoContainer.lastChild) videoContainer.insertBefore(htmlVideo, videoContainer.lastChild.nextSibling);
		else videoContainer.insertBefore(htmlVideo, videoContainer.firstChild);
	}
}

