import { io } from "socket.io-client";

const resolveSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  if (import.meta.env.PROD) {
    return "https://chatify-backend-8gna.onrender.com";
  }

  return "http://localhost:5000";
};

const socket = io(resolveSocketUrl(), {
  autoConnect: false,
  withCredentials: true,
  path: "/socket.io",
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 8,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
