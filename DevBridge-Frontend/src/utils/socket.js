import { io } from "socket.io-client";

export const createSocketConnection = () => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL?.trim();

  return io(socketUrl || "/", {
    withCredentials: true,
    transports: ["websocket"],
  });
};