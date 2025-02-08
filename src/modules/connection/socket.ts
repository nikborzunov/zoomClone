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
        notify('Ошибка соединения сокетов. Попытка реконнекта...', 'error');
    });

    socket.on('disconnect', (reason: string) => {
        notify('Соединение сокетов потеряно. Попытка реконнекта...', 'warning');
    });

    socket.on('reconnect', (attemptNumber: number) => {
        notify('Соединение сокетов восстановлено', 'success');
    });

    socket.on('reconnect_attempt', (attempt: number) => {
        console.log(`Попытка реконнекта сокетов: ${attempt}`);
    });

    socket.on('reconnect_failed', () => {
        notify('Не удалось восстановить соединение сокетов. Пожалуйста, обновите страницу.', 'error');
    });

    handlersSet = true;
}