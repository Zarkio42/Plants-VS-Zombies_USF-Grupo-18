import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Plants-VS-Zombies_USF-Grupo-18/',
  server: {
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