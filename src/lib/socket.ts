import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (!socket) {
    // Replace with your actual Socket.IO server URL
    const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';
    socket = io(SOCKET_SERVER_URL, {
      auth: {
        token: token, // Pass authentication token if needed
      },
      transports: ['websocket'], // Use websocket for better performance
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      socket = null; // Reset socket on disconnect
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
