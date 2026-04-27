import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  // Prefer explicit socket URL. For local, VITE_PROXY_TARGET can be reused.
  const envSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();
  const envProxyTarget = import.meta.env.VITE_PROXY_TARGET?.trim();
  const socketBaseUrl = envSocketUrl
    || (BASE_URL === "/api" ? (envProxyTarget || window.location.origin) : BASE_URL.replace(/\/api$/, ""));

  return io(socketBaseUrl, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
};
