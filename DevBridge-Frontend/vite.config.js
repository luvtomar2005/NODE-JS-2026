import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  const proxyTarget = process.env.VITE_PROXY_TARGET || "http://localhost:3000";

  return {
    plugins: [
      tailwindcss(),
    ],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/socket.io": {
          target: proxyTarget,
          ws: true,
        },
      },
    },
  };
})