import { io, Socket } from "socket.io-client";
import { notify } from '../notifications';
import { User } from '../../typing/types';

export const socket: Socket = io('/', {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
});

let handlersSet = false;

export function setupSocketHandlers(
    onUserConnected: (user: User) => void,
    onUserDisconnected: (userId: string) => void,
    onAllUsers: (users: User[]) => void
): void {
    if (handlersSet) {
        return;
    }

    socket.on('user-connected', (data: User) => {
        onUserConnected(data);
    });

    socket.on('all-users', (users: User[]) => {
        onAllUsers(users);
    });

    socket.on('user-disconnected', (userId: string) => {
        onUserDisconnected(userId);
    });

    socket.on('connect_error', (err: any) => {
        notify('Socket connection error. Attempting to reconnect...', 'error');
    });

    socket.on('disconnect', (reason: string) => {
        notify('Socket connection lost. Attempting to reconnect...', 'warning');
    });

    socket.on('reconnect', (attemptNumber: number) => {
        notify('Socket connection restored', 'success');
    });

    socket.on('reconnect_attempt', (attempt: number) => {
        console.log(`Socket reconnection attempt: ${attempt}`);
    });

    socket.on('reconnect_failed', () => {
        notify('Failed to restore socket connection. Please refresh the page.', 'error');
    });

    handlersSet = true;
}