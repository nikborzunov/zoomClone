import Peer, { PeerJSOption } from "peerjs";
import { notify } from '../notifications';

export interface PeerInstance extends Peer { }

export function createPeer(
    id: string,
    onOpen: (id: string) => void,
    onError: (err: any) => void,
    onClose: () => void
): PeerInstance {
    console.log('PeerJS: Creating a new Peer instance');
    const peerOptions: PeerJSOption = {
        host: '4e0b-46-246-93-69.ngrok-free.app',
        port: 443,
        path: '/peerjs',
        secure: true,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' }
            ]
        },
        debug: 1,
    };

    const peer = new Peer(id, peerOptions) as PeerInstance;

    peer.on('open', (id: string) => {
        console.log(`PeerJS: Connection opened with ID: ${id}`);
        onOpen(id);
    });

    peer.on('error', (err: any) => {
        console.error(`PeerJS Error: ${err.type} - ${err.message}`);
        notify(`PeerJS error: ${err.type} - ${err.message}`, 'error');
        onError(err);
    });

    peer.on('close', () => {
        console.warn('PeerJS: Connection closed');
        notify('PeerJS connection closed.', 'warning');
        onClose();
    });

    peer.on('disconnected', () => {
        console.warn('PeerJS: Disconnected. Attempting to reconnect...');
        notify('PeerJS disconnected. Attempting to reconnect...', 'warning');
        peer.reconnect();
    });

    return peer;
}