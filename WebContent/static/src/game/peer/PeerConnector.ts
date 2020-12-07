import { Game } from "../Game";
import { GameConfigs } from "../Configs";

import { SoundUtils } from "../../utils/SoundUtils";


export class PeerConnector {

	game: Game;

	peer: any;
	open: boolean = false;

	calling: any;
	calls: any;
	streamReceived: any;
	removing: any;

	videoContainerWidth = 200;

	constructor(game: Game) {
		this.game = game;

		this.calling = {};
		this.calls = {};
		this.streamReceived = {};
		this.removing = {};
	}

	public init() {

		this.showMyVideo();

		var peerId = this.game.player.id;

		if (GameConfigs.hostPeerJsServer == 0) {
			// @ts-ignore
			this.peer = new Peer(peerId, {}); // use public peerjs server

		} else if (GameConfigs.hostPeerJsServer == 1) {
			// use own peerjs server
			// @ts-ignore
			this.peer = new Peer(peerId, {
				host: 'localhost',
				port: '5001', //location.port || (location.protocol === 'https:' ? 443 : 80),
				path: '/peerjs',
				debug: true
			});
		}

		this.peer.on('open', (function (self) {
			return function (id: any) {
				console.log('OPEN: My peer ID is: ' + id);
				self.open = true;
			};
		})(this));

		this.peer.on('error', function (err: any) {
			console.log('received error', err);
		});


		// receive call
		this.peer.on('call', (function (self) {
			return function (call: any) {

				console.log('received call from peer', call.peer);

				self.calls[call.peer] = call;

				// answer with own stream
				navigator.mediaDevices.getUserMedia({ video: true, audio: true })
					.then(stream => {
						call.answer(stream);
					});

				// Receive stream
				call.on('stream', function (stream: any) {

					console.log('received stream from incoming call!');

					if (self.streamReceived[call.peer]) return;
					else self.streamReceived[call.peer] = true;

					self.showVideo(call.peer, stream);

				});

			}
		})(this));


	}


	public update() {

		// check for new players
		for (var playerId in this.game.players) {
			if (this.open && this.calling[playerId] == null && this.game.player.id > Number(playerId)) {
				console.log('call peer ', playerId);
				this.calling[playerId] = true;
				this.callPeer(playerId);
			}
		}

		// check for removed players
		for (var playerId in this.streamReceived) {
			if (this.game.players[Number(playerId)] == null && !this.removing[playerId]) {
				console.log('remove peer ', playerId);
				this.removing[playerId] = true;
				this.removeVideo(playerId);
			}
		}


		// update sound volume according to distance of the players
		for (var playerId in this.game.players) {
			if (this.streamReceived[playerId]) {

				var volume = SoundUtils.getVolumeFromDistanceSoundObject(this.game.players[playerId], this.game.player.x, this.game.player.y);

				var videoContainer = document.getElementById(playerId);

				if (videoContainer) {
					// @ts-ignore
					videoContainer.volume = volume;

					var newWidth = this.videoContainerWidth * volume;
					videoContainer.setAttribute('width', newWidth.toString());
				}

			}
		}
	}


	public callPeer(peerId: any) {

		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((function (self, peerId) {

				return function (stream: any) {

					self.calls[peerId] = self.peer.call(peerId, stream);

					self.calls[peerId].on('stream', function (remoteStream: any) {

						console.log('received stream from outgoing call!');

						if (self.streamReceived[peerId]) return;
						else self.streamReceived[peerId] = true;

						self.showVideo(peerId, remoteStream);
					});

				};

			})(this, peerId))
			.catch(e => {
				console.log("e: ", e);
			});

	}




	public showMyVideo() {

		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => this.showVideo(this.game.player.id.toString(), stream))
			.catch(e => {
				console.log("e: ", e);
			});
	}



	public showVideo(id: string, stream: any) {
		var htmlVideo = this.createHtmlVideo(id);
		htmlVideo.srcObject = stream;
		this.insertHtmlVideo(htmlVideo);
	}

	public removeVideo(id: string) {
		var videoContainer = document.getElementById(id);
		if (videoContainer != null) {

			videoContainer.parentNode.removeChild(videoContainer);

			this.calling[id] = null;
			this.calls[id].close();
			this.calls[id] = null;
			this.streamReceived[id] = null;
			this.removing[id] = null;
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

		if(videoContainer.lastChild) videoContainer.insertBefore(htmlVideo, videoContainer.lastChild.nextSibling);
		else videoContainer.insertBefore(htmlVideo, videoContainer.firstChild);
	}
	
}

