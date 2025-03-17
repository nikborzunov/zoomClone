import { socket, setupSocketHandlers } from './socket';
import { User } from '../../typing/types';
import { addVideoStream, removeVideo } from '../ui/videoHandler';
import { setMuteButtonUI, setVideoButtonUI, setupControls } from '../ui/controls';
import { notify } from '../notifications';
import { MediaConnection } from 'peerjs';
import { ReconnectionManager } from './reconnection.ts';

interface RoomHandlerOptions {
	videoGrid: HTMLElement;
	myVideo: HTMLVideoElement;
	reconnectionManager: ReconnectionManager;
	isAudioMuted: boolean;
	userIdToUserName: { [key: string]: string };
	peers: { [key: string]: MediaConnection };
	toggleMute: () => void;
	setMyVideoStream: (stream: MediaStream) => void;
}

export function joinRoom(
	roomId: string,
	userName: string,
	peerId: string,
	options: RoomHandlerOptions
): void {
	navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	}).then(stream => {
		options.setMyVideoStream(stream);
		options.isAudioMuted = true;
		const audioTrack = stream.getAudioTracks()[0];
		if (audioTrack) {
			audioTrack.enabled = false;
		}
		addVideoStream(options.videoGrid, options.myVideo, stream, 'You', 'self');
		setMuteButtonUI(!options.isAudioMuted);
		setVideoButtonUI(true);
		setupControls(stream, setMuteButtonUI, setVideoButtonUI, options.toggleMute);
		socket.emit('join-room', roomId, options.reconnectionManager.userSessionId, peerId, userName);
		options.userIdToUserName[peerId] = userName;

		const myPeer = options.reconnectionManager.getPeer();
		if (myPeer) {
			myPeer.on('call', (call: MediaConnection) => {
				call.answer(stream);
				const video = document.createElement('video') as HTMLVideoElement;
				call.on('stream', (userVideoStream: MediaStream) => {
					if (!document.getElementById(call.peer)) {
						addVideoStream(
							options.videoGrid,
							video,
							userVideoStream,
							options.userIdToUserName[call.peer] || 'Other',
							call.peer
						);
					}
				});
				call.on('error', (err: Error) => {
					notify(`Error in call from ${call.peer}: ${err.message}`, 'error');
				});
				call.on('close', () => {
					removeVideo(options.videoGrid, call.peer);
				});
				options.peers[call.peer] = call;
			});
		}

		if (!options.reconnectionManager.isSocketHandlersSet()) {
			setupSocketHandlers(
				(user: User) => {
					const { userId, userName } = user;
					if (!options.peers[userId]) {
						notify(`User connected: ${userName}`, 'info');
						connectToNewUser(userId, stream, userName, options);
					}
				},
				(userId: string) => {
					if (options.peers[userId]) {
						options.peers[userId].close();
					}
					const userName = options.userIdToUserName[userId] || 'User';
					notify(`User disconnected: ${userName}`, 'warning');
					removeVideo(options.videoGrid, userId);
					delete options.userIdToUserName[userId];
				},
				(users: User[]) => {
					users.forEach(user => {
						const { userId, userName } = user;
						if (userId !== peerId && !options.peers[userId]) {
							connectToNewUser(userId, stream, userName, options);
						}
					});
				}
			);
			options.reconnectionManager.setSocketHandlersSet(true);
		}

		socket.on('reconnect', () => {
			if (myPeer && myPeer.id) {
				socket.emit('join-room', roomId, options.reconnectionManager.userSessionId, myPeer.id, userName);
				const audioTrack = stream.getAudioTracks()[0];
				if (audioTrack) {
					audioTrack.enabled = false;
				}
				options.isAudioMuted = true;
				setMuteButtonUI(!options.isAudioMuted);
			}
		});

	}).catch(() => {
		notify('Video stream unavailable. Please check your device settings.', 'error');
		showPlaceholder(options.videoGrid);
	});
}

function connectToNewUser(userId: string, stream: MediaStream, userName: string, options: RoomHandlerOptions): void {
	const myPeer = options.reconnectionManager.getPeer();
	if (myPeer) {
		const call = myPeer.call(userId, stream);
		call.on('stream', (userVideoStream: MediaStream) => {
			if (!document.getElementById(userId)) {
				const video = document.createElement('video') as HTMLVideoElement;
				addVideoStream(options.videoGrid, video, userVideoStream, userName, userId);
			}
		});
		call.on('error', (err: Error) => {
			notify(`Error connecting to user: ${err.message}`, 'error');
		});
		call.on('close', () => {
			removeVideo(options.videoGrid, userId);
		});
		options.peers[userId] = call;
		options.userIdToUserName[userId] = userName;
	}
}

function showPlaceholder(videoGrid: HTMLElement): void {
	const placeholder = document.createElement('div');
	placeholder.innerHTML = `<p>Video stream unavailable. Please check your device settings.</p>`;
	Object.assign(placeholder.style, {
		padding: '20px',
		backgroundColor: '#f2f2f2',
		textAlign: 'center',
	});
	videoGrid.append(placeholder);
}