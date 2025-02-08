import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import path from 'path';
import { User } from './typing/types';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
} as any);

app.use('/peerjs',
  (req, res, next) => {
    console.log(`PeerJS request: ${req.method} ${req.url}`);
    next();
  },
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
  peerServer
);

app.set('view engine', 'ejs');

app.use(express.static(__dirname));

app.get('/', (req: Request, res: Response) => {
  const roomId = 'main-room';
  res.redirect(`/${roomId}`);
});

app.get('/:room', (req: Request, res: Response) => {
  res.render('room', { roomId: req.params.room });
});

const userSessionIdToPeerId: { [sessionId: string]: string } = {};
const peerIdToUserName: { [peerId: string]: string } = {};
const userSessionIdToRoomId: { [sessionId: string]: string } = {};
const socketIdToSessionId: { [socketId: string]: string } = {};

io.on('connection', (socket: Socket) => {
  console.log(`Новое подключение: ${socket.id} от ${socket.handshake.address}`);

  socket.on('join-room', (roomId: string, userSessionId: string, peerId: string, userName: string) => {
    console.log(`Пользователь с SessionID: ${userSessionId}, PeerID: ${peerId}, именем "${userName}" присоединился к комнате: ${roomId}`);

    socketIdToSessionId[socket.id] = userSessionId;

    if (userSessionIdToPeerId[userSessionId] && userSessionIdToPeerId[userSessionId] !== peerId) {
      const oldPeerId = userSessionIdToPeerId[userSessionId];
      console.log(`Обновление PeerID для SessionID: ${userSessionId} с ${oldPeerId} на ${peerId}`);
      socket.to(roomId).emit('user-disconnected', oldPeerId);
      delete peerIdToUserName[oldPeerId];
    }

    userSessionIdToPeerId[userSessionId] = peerId;
    peerIdToUserName[peerId] = userName;
    userSessionIdToRoomId[userSessionId] = roomId;

    socket.join(roomId);

    const clients = io.sockets.adapter.rooms.get(roomId);
    const usersInRoom: User[] = [];
    if (clients) {
      clients.forEach((clientId: string) => {
        if (clientId !== socket.id) {
          const sessionId = socketIdToSessionId[clientId];
          if (sessionId && userSessionIdToPeerId[sessionId] !== peerId) {
            const existingPeerId = userSessionIdToPeerId[sessionId];
            const existingUserName = peerIdToUserName[existingPeerId] || 'Unknown';
            usersInRoom.push({
              userId: existingPeerId,
              userName: existingUserName,
            });
          }
        }
      });
    }

    socket.emit('all-users', usersInRoom);
    socket.to(roomId).emit('user-connected', { userId: peerId, userName });
  });

  socket.on('disconnect', () => {
    const sessionId = socketIdToSessionId[socket.id];
    if (sessionId) {
      const peerId = userSessionIdToPeerId[sessionId];
      const roomId = userSessionIdToRoomId[socket.id];
      const userName = peerIdToUserName[peerId];

      console.log(`Пользователь с SessionID: ${sessionId}, PeerID: ${peerId}, именем "${userName}" отключился от комнаты: ${roomId}`);
      socket.to(roomId).emit('user-disconnected', peerId);

      delete userSessionIdToPeerId[sessionId];
      delete peerIdToUserName[peerId];
      delete userSessionIdToRoomId[sessionId];
      delete socketIdToSessionId[socket.id];
    } else {
      console.log(`Сокет ${socket.id} отключился, но не был связан с пользователем или комнатой.`);
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Сервер слушает на порту ${PORT}`);
});