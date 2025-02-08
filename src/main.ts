import { socket } from './modules/connection/socket';
import { ReconnectionManager } from './modules/connection/reconnection.ts';
import { joinRoom } from './modules/connection/roomHandler';
import { notify } from './modules/notifications';
import { setMuteButtonUI } from './modules/ui/controls';
import '../styles/room.css';

declare const ROOM_ID: string;

const videoGrid = document.getElementById('video-grid') as HTMLElement;

let currentRoomId: string = ROOM_ID;
let isAudioMuted: boolean = true;

const myVideo = document.createElement('video') as HTMLVideoElement;
myVideo.muted = true;

let myVideoStream: MediaStream | undefined;
const peers: { [key: string]: any } = {};
const userIdToUserName: { [key: string]: string } = {};

const reconnectionManager = new ReconnectionManager({
    onJoinRoom: joinRoomHandler,
    onPeerError: (err: Error) => {
        notify(`PeerJS ошибка: ${err.message}`, 'error');
    }
});

reconnectionManager.initialize(currentRoomId);

function joinRoomHandler(roomId: string, userName: string, peerId: string): void {
    const options = {
        videoGrid,
        myVideo,
        reconnectionManager,
        isAudioMuted,
        userIdToUserName,
        peers,
        toggleMute,
        setMyVideoStream: (stream: MediaStream) => {
            myVideoStream = stream;
        }
    };
    joinRoom(roomId, userName, peerId, options);
}

function toggleMute(): void {
    isAudioMuted = !isAudioMuted;
    if (myVideoStream) {
        const audioTrack = myVideoStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !isAudioMuted;
        }
    }
    setMuteButtonUI(!isAudioMuted);
}

socket.on('disconnect', () => {
    notify('Socket отключен. Попытка восстановить...', 'warning');
});