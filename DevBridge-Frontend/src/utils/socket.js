import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  // Prefer explicit socket URL. For local, VITE_PROXY_TARGET can be reused.
  const envSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();
  const envProxyTarget = import.meta.env.VITE_PROXY_TARGET?.trim();
  const localDefaultSocketUrl = "http://localhost:3000";

  let socketBaseUrl = envSocketUrl
    || (BASE_URL === "/api"
      ? (envProxyTarget || localDefaultSocketUrl)
      : BASE_URL.replace(/\/api$/, ""));

  // Guard: if someone sets VITE_API_BASE_URL to frontend origin
  // (e.g. http://localhost:5173/api), socket would incorrectly target frontend.
  // In dev, force backend target to avoid websocket handshake failures.
  if (
    import.meta.env.DEV &&
    typeof window !== "undefined" &&
    socketBaseUrl.includes(window.location.origin)
  ) {
    socketBaseUrl = envProxyTarget || localDefaultSocketUrl;
  }

  return io(socketBaseUrl, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    path: "/socket.io",
  });
};
