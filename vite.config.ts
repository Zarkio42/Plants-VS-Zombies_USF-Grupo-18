// vite.config.js (ou .ts)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configuração do Proxy para PvZ API
    proxy: {
      '/api': { 
        target: 'https://pvz-2-api.vercel.app', 
        changeOrigin: true, 
        secure: true, 
        rewrite: (path) => path.replace(/^\/api/, '/api'), 
      },
    },
  },
});