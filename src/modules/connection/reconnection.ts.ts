import { createPeer, PeerInstance } from './peer';
import { notify } from '../notifications';
import { INITIAL_RETRY_DELAY, MAX_RETRY_DELAY, MAX_RECONNECT_ATTEMPTS } from '../../config';
import { promptUserName } from '../prompts';

export interface ReconnectionOptions {
	onJoinRoom: (roomId: string, userName: string, peerId: string) => void;
	onPeerError?: (err: Error) => void;
}

export class ReconnectionManager {
	private myPeer: PeerInstance | null = null;
	private currentUserName: string = '';
	private currentRoomId: string = '';
	private readonly _userSessionId: string;
	private retryTimeout: number = INITIAL_RETRY_DELAY;
	private attempt: number = 0;
	private options: ReconnectionOptions;
	private socketHandlersSet: boolean = false;

	constructor(options: ReconnectionOptions) {
		this.options = options;
		this._userSessionId = localStorage.getItem('userSessionId') || this.generateUUID();
		localStorage.setItem('userSessionId', this._userSessionId);
	}

	public get userSessionId(): string {
		return this._userSessionId;
	}

	private generateUUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	public initialize(roomId: string): void {
		this.currentRoomId = roomId;
		this.setupPeer();
	}

	private setupPeer(): void {
		if (!this.myPeer) {
			this.myPeer = createPeer(
				this._userSessionId,
				this.handlePeerOpen.bind(this),
				this.handlePeerError.bind(this),
				this.handlePeerClose.bind(this)
			);
		}
	}

	private handlePeerOpen(id: string): void {
		this.attempt = 0;
		if (this.currentUserName) {
			this.options.onJoinRoom(this.currentRoomId, this.currentUserName, id);
		} else {
			promptUserName(this.currentRoomId, (roomId: string, userName: string) => {
				this.currentUserName = userName;
				this.options.onJoinRoom(roomId, userName, id);
			});
		}
	}

	private handlePeerError(err: Error): void {
		if (err.message.includes('unavailable-id')) {
			notify('PeerID is already in use. Please refresh the page.', 'error');
		}
		this.options.onPeerError?.(err);
	}

	private handlePeerClose(): void {
		notify('PeerJS connection closed.', 'warning');
		if (this.attempt < MAX_RECONNECT_ATTEMPTS) {
			const delay = Math.min(this.retryTimeout * 2 ** this.attempt, MAX_RETRY_DELAY);
			setTimeout(() => {
				this.attempt += 1;
				this.setupPeer();
			}, delay);
		} else {
			notify('Failed to restore PeerJS connection. Please refresh the page.', 'error');
		}
	}

	public getPeer(): PeerInstance | null {
		return this.myPeer;
	}

	public isSocketHandlersSet(): boolean {
		return this.socketHandlersSet;
	}

	public setSocketHandlersSet(status: boolean): void {
		this.socketHandlersSet = status;
	}
}