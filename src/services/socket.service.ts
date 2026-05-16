import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './config';
import { useNotificationStore } from '../stores/useNotificationStore';
import type { Notification } from '../types/api';

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (socket) return socket;

  const url = API_BASE_URL.replace('/api/v1', '');
  socket = io(url, { transports: ['websocket'] });

  socket.on('connect', () => {
    socket?.emit('subscribe', userId);
  });

  socket.on('notification', (notif: Notification) => {
    useNotificationStore.getState().addNotification(notif);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
