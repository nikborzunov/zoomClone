import Peer, { PeerJSOption } from "peerjs";
import { notify } from '../notifications';

export interface PeerInstance extends Peer { }

export function createPeer(
    id: string,
    onOpen: (id: string) => void,
    onError: (err: any) => void,
    onClose: () => void
): PeerInstance {
    console.log('PeerJS: Создание нового экземпляра Peer');
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
        console.log(`PeerJS: Соединение открыто с ID: ${id}`);
        onOpen(id);
    });

    peer.on('error', (err: any) => {
        console.error(`PeerJS Ошибка: ${err.type} - ${err.message}`);
        notify(`Ошибка PeerJS: ${err.type} - ${err.message}`, 'error');
        onError(err);
    });

    peer.on('close', () => {
        console.warn('PeerJS: Соединение закрыто');
        notify('PeerJS соединение закрыто.', 'warning');
        onClose();
    });

    peer.on('disconnected', () => {
        console.warn('PeerJS: Отключено. Попытка реконнекта...');
        notify('PeerJS: Отключено. Попытка реконнекта...', 'warning');
        peer.reconnect();
    });

    return peer;
}