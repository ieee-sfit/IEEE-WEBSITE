import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  server: {
    proxy: {
      '/api/navkriti': {
        target: 'http://127.0.0.1:54321/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/navkriti/, '')
      }
    }
  }
});

