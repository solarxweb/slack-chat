import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      // Проксируем запросы к API
      '/api': {
        // target: 'http://localhost:5001',
        target: 'http://127.0.0.1:5001',
        changeOrigin: false,
        secure: false,
      },
      cors: false,
      // Проксируем WebSocket соединения
      '/socket.io': {
        // target: 'ws://localhost:5001',
        target: 'ws://127.0.0.1:5001',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
});